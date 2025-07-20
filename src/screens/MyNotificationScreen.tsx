import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = process.env.API_BASE_URL;

interface Notificacao {
  id: number;
  textoNotificacao: string;
  dataNotificacao: string;
  visto: boolean;
  nomeUtilizadorOrigem: string;
}

export default function NotificationScreen() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchNotificacoes = async () => {
      const user = await AsyncStorage.getItem('user');
      if (!user) return;

      const { id: userId } = JSON.parse(user);

      try {
        const res = await axios.get(`${BASE_URL}/api/Notificacao/utilizador/${userId}`);
        const data: Notificacao[] = res.data;

        setNotificacoes(data.reverse());
        setUnreadCount(data.filter(n => !n.visto).length);
      } catch (error) {
        console.error('Erro ao buscar notificações', error);
      }
    };

    fetchNotificacoes();
  }, []);

  const getIcon = (texto: string) => {
    const lower = texto.toLowerCase();
    if (lower.includes('curtiu')) return <Ionicons name="heart" size={20} color="red" />;
    if (lower.includes('comentou')) return <Ionicons name="chatbubble" size={20} color="blue" />;
    if (lower.includes('avaliou')) return <MaterialCommunityIcons name="star" size={20} color="orange" />;
    return <Ionicons name="notifications" size={20} color="gray" />;
  };

  const renderItem = ({ item }: { item: Notificacao }) => (
    <View style={[styles.card, !item.visto && styles.unread]}>
      {getIcon(item.textoNotificacao)}
      <View style={styles.textContainer}>
        <Text style={styles.message}>
          {item.nomeUtilizadorOrigem ?? 'Alguém'} {item.textoNotificacao}
        </Text>
        <Text style={styles.timestamp}>{new Date(item.dataNotificacao).toLocaleString('pt-AO')}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notificações</Text>
      {unreadCount > 0 && (
        <Text style={styles.unreadCount}>Você tem {unreadCount} novas notificações</Text>
      )}
      <FlatList
        data={notificacoes}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma notificação</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  unreadCount: { color: '#4f46e5', marginBottom: 10 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 10, borderRadius: 8, backgroundColor: '#f3f4f6' },
  unread: { backgroundColor: '#e0e7ff' },
  textContainer: { marginLeft: 12, flex: 1 },
  message: { fontSize: 15, color: '#111827' },
  timestamp: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 100, color: '#6b7280' },
});