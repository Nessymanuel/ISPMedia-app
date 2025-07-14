import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

const reviews = [
  { id: "1", content: "Vídeo de Aula", rating: 4, comment: "Muito bom!" },
  { id: "2", content: "Minha Música 1", rating: 5, comment: "Excelente qualidade!" },
];

export default function MyNotificationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
    
      <Text style={styles.title}>Minhas Críticas</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.content}</Text>
            <Text style={styles.itemSubtitle}>⭐ {item.rating} - {item.comment}</Text>
          </View>
        )}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  itemTitle: { fontSize: 16, fontWeight: "bold" },
  itemSubtitle: { fontSize: 14, color: "#666" },
  backButton: { marginTop: 20, alignItems: "center" },
  backButtonText: { color: "#7c3aed", fontWeight: "bold" },
});
