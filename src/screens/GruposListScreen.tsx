import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types"; // ajuste conforme sua estrutura

const genres = ["Todos", "Documentário", "Comédia", "Ação", "Drama", "Animação"];

const mockVideos = [
  { id: "1", title: "Documentário A", category: "Documentário", image: require("../../assets/cover.png") },
  { id: "2", title: "Comédia B", category: "Comédia", image: require("../../assets/cover.png") },
  { id: "3", title: "Ação C", category: "Ação", image: require("../../assets/cover.png") },
];

export default function GruposListScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const filteredVideos = mockVideos.filter(
    video =>
      (selectedCategory === "Todos" || video.category === selectedCategory) &&
      video.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>Grupos</Text>

        <TouchableOpacity onPress={() => alert("Adicionar Vídeo")}>
          <Ionicons name="add-circle-outline" size={28} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      {/* Pesquisa */}
      <TextInput
        placeholder="Pesquisar vídeo..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      {/* Filtro por categoria */}
      <View style={styles.genreRow}>
        {genres.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.genreButton,
              selectedCategory === category && styles.genreButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.genreText,
                selectedCategory === category && styles.genreTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de vídeos */}
      <FlatList
        data={filteredVideos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.videoItem}>
            <Image source={item.image} style={styles.videoImage} />
            <View>
              <Text style={styles.videoTitle}>{item.title}</Text>
              <Text style={styles.videoCategory}>{item.category}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  genreButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 8,
    marginBottom: 8,
  },
  genreButtonActive: {
    backgroundColor: "#4f46e5",
  },
  genreText: {
    fontSize: 12,
  },
  genreTextActive: {
    color: "#fff",
  },
  videoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 8,
  },
  videoImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  videoTitle: {
    fontWeight: "bold",
  },
  videoCategory: {
    color: "#555",
  },
});