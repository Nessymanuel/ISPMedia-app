import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { HubConnectionBuilder } from "@microsoft/signalr";
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, "Notifications">;

type NotificationType = 'comment' | 'friend' | 'rating' | 'share' | 'like';

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export default function NotificationsScreen({ navigation }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState<any>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Carregar notificações da API
  const loadNotifications = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) return;
      
      const user = JSON.parse(storedUser);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/Notificacao/utilizador/${user.id}`
      );
      
      const data = await response.json();
      
      const parsed: Notification[] = data.map((n: any) => {
        let tipo: NotificationType = 'comment';
        if (n.textoNotificacao?.toLowerCase().includes('curtiu')) tipo = 'like';

        return {
          id: n.id,
          type: tipo,
          message: `${n.nomeUtilizadorOrigem ?? "Alguém"} ${n.textoNotificacao}`,
          timestamp: new Date(n.dataNotificacao).toLocaleString('pt-AO'),
          isRead: n.visto === true,
        };
      });

      setNotifications(parsed);
      setUnreadCount(parsed.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  // Conectar ao SignalR
  const connectToSignalR = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) return;
      
      const user = JSON.parse(storedUser);
      const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

      if (!baseUrl) {
        console.error("❌ EXPO_PUBLIC_API_BASE_URL não definida");
        return;
      }

      const newConnection = new HubConnectionBuilder()
        .withUrl(`${baseUrl}/notificationhub?userId=${user.id}`)
        .withAutomaticReconnect()
        .build();

      newConnection.on("ReceiveNotification", (message: string) => {
        const newNotification: Notification = {
          id: Date.now(),
          type: message.toLowerCase().includes('curtiu') ? 'like' : 'comment',
          message: message,
          timestamp: 'Agora mesmo',
          isRead: false,
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        playNotificationSound();
      });

      await newConnection.start();
      setConnection(newConnection);
      console.log("✅ Conectado ao SignalR");
    } catch (err) {
      console.error("Erro ao conectar ao SignalR:", err);
    }
  };

  // Reproduzir som de notificação
  const playNotificationSound = async () => {
    try {
      // Baixar o som se necessário (opcional)
      const soundFile = `${FileSystem.cacheDirectory}notification.wav`;
      const { exists } = await FileSystem.getInfoAsync(soundFile);
      
      if (!exists) {
        await FileSystem.downloadAsync(
          'https://exemplo.com/sounds/notification.wav',
          soundFile
        );
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: soundFile },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Erro ao reproduzir som:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
    connectToSignalR();

    return () => {
      if (connection) {
        connection.stop();
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const getNotificationIcon = (type: NotificationType) => {
    const iconProps = { size: 24, style: styles.icon };
    
    switch (type) {
      case 'comment':
        return <Ionicons name="chatbubble-outline" color="#3b82f6" {...iconProps} />;
      case 'friend':
        return <Ionicons name="person-add-outline" color="#10b981" {...iconProps} />;
      case 'rating':
        return <Ionicons name="star-outline" color="#f59e0b" {...iconProps} />;
      case 'share':
        return <Ionicons name="share-social-outline" color="#8b5cf6" {...iconProps} />;
      case 'like':
        return <Ionicons name="heart-outline" color="#ef4444" {...iconProps} />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(prev - 1, 0));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <View style={[styles.notificationCard, !item.isRead && styles.unreadCard]}>
      <View style={styles.notificationHeader}>
        <View style={styles.iconContainer}>
          {getNotificationIcon(item.type)}
        </View>
        
        <View style={styles.notificationContent}>
          <Text style={styles.texto}>{item.message}</Text>
          <Text style={styles.data}>{item.timestamp}</Text>
        </View>
        
        <View style={styles.actions}>
          {!item.isRead && (
            <TouchableOpacity 
              onPress={() => markAsRead(item.id)}
              style={styles.actionButton}
            >
              <Ionicons name="checkmark-outline" size={20} color="#4f46e5" />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            onPress={() => deleteNotification(item.id)}
            style={styles.actionButton}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#4f46e5" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Notificações {unreadCount > 0 && `(${unreadCount})`}</Text>
        
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={styles.markAllButton}>Marcar todas</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
            <Text style={styles.emptyText}>Você não tem notificações no momento</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4f46e5",
  },
  markAllButton: {
    color: "#4f46e5",
    fontWeight: "500",
  },
  notificationCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  unreadCard: {
    backgroundColor: "#e0f2fe",
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  icon: {
    marginRight: 10,
  },
  notificationContent: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    marginLeft: 8,
  },
  actionButton: {
    marginLeft: 12,
    padding: 4,
  },
  texto: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 4,
  },
  data: {
    fontSize: 12,
    color: "#6b7280",
  },
  listContent: {
    paddingVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});