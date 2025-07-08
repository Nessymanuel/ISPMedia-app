import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function ContentDetailScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Imagem e botões */}
      <Image
        source={require("../../assets/logoupdate.png")}
        style={styles.cover}
      />
      <View style={styles.headerRow}>
        <Text style={styles.title}>Detalhes da Mídia</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Descrição resumida desta mídia</Text>

      {/* Capítulos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lista de Capítulos</Text>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="play" size={18} color="#4f46e5" />
          <Text style={styles.itemText}>Introdução - 2 min</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="play" size={18} color="#4f46e5" />
          <Text style={styles.itemText}>Como Usar - 4 min</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="play" size={18} color="#4f46e5" />
          <Text style={styles.itemText}>Dicas Avançadas - 5 min</Text>
        </TouchableOpacity>
      </View>

      {/* Botão */}
      <TouchableOpacity style={styles.cta}>
        <Text style={styles.ctaText}>Reproduzir Tudo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 16, backgroundColor: "#fff" },
  cover: { width: "100%", height: 200, borderRadius: 12, marginBottom: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 4,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#555", marginBottom: 16 },
  section: { width: "100%" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: { marginLeft: 8, fontSize: 14 },
  cta: {
    backgroundColor: "#4f46e5",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginTop: 16,
  },
  ctaText: { color: "#fff", fontWeight: "bold" },
});
