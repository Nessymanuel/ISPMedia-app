import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connectToNotificationHub, disconnectFromNotificationHub } from "../lib/signalr";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";

type Notification = {
  id: number;
  message: string;
  isRead: boolean;
  timestamp: string;
};

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((stored) => {
      if (!stored) return;
      const user = JSON.parse(stored);
      const id = user.id;
      setUserId(id);

      axios
        .get(`${process.env.API_BASE_URL}/api/Notificacao/utilizador/${id}`)
        .then((res) => {
          const lista = res.data.map((n: any) => ({
            id: n.id,
            message: `${n.nomeUtilizadorOrigem ?? "Alguém"} ${n.textoNotificacao}`,
            isRead: n.visto,
            timestamp: new Date(n.dataNotificacao).toLocaleString("pt-AO"),
          }));
          setNotifications(lista.reverse());
        });

      connectToNotificationHub(id, (mensagem: string) => {
        const nova = {
          id: Date.now(),
          message: mensagem,
          isRead: false,
          timestamp: "Agora mesmo",
        };
        setNotifications((prev) => [nova, ...prev]);
        Alert.alert("Nova notificação", mensagem);
      });
    });

    return () => disconnectFromNotificationHub();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {notifications.map((n) => (
        <View key={n.id} style={[styles.card, !n.isRead && styles.unread]}>
          <FontAwesome5 name="bell" size={18} color="#333" />
          <View style={styles.info}>
            <Text style={styles.msg}>{n.message}</Text>
            <Text style={styles.time}>{n.timestamp}</Text>
          </View>
        </View>
      ))}
      {notifications.length === 0 && (
        <View style={styles.empty}>
          <Text style={{ color: "#aaa" }}>Sem notificações</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  unread: { backgroundColor: "#e0e7ff" },
  info: { marginLeft: 10, flex: 1 },
  msg: { fontSize: 16, color: "#111" },
  time: { fontSize: 12, color: "#666", marginTop: 4 },
  empty: { alignItems: "center", marginTop: 100 },
});