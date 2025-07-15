import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

type Props = NativeStackScreenProps<RootStackParamList, "Notifications">;

const mockNotifications = [
  {
    id: "1",
    texto: "Você recebeu um novo comentário em sua música.",
    data: "2025-07-14 18:45",
  },
  {
    id: "2",
    texto: "Sua música foi curtida por Aninha.",
    data: "2025-07-13 22:18",
  },
  {
    id: "3",
    texto: "Você foi adicionado a um grupo.",
    data: "2025-07-12 09:11",
  },
];

export default function NotificationsScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
        <View style={{ width: 24 }} /> {/* Espaço para alinhar o título */}
      </View>

      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Text style={styles.texto}>{item.texto}</Text>
            <Text style={styles.data}>{item.data}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }}
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4f46e5",
  },
  notificationCard: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  texto: {
    fontSize: 14,
    color: "#111827",
  },
  data: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 6,
  },
});
