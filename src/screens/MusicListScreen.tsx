import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

const genres = ["Todos", "Pop", "Jazz", "Rock", "Hip-Hop", "Kuduro"];

const mockSongs = [
  { id: "1", artist: "Artista A", title: "Música A", genre: "Pop", image: require("../../assets/cover.png") },
  { id: "2", artist: "Artista B", title: "Música B", genre: "Jazz", image: require("../../assets/cover.png") },
  { id: "3", artist: "Artista C", title: "Música C", genre: "Rock", image: require("../../assets/cover.png") },
];

export default function MusicListScreen() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const filteredSongs = mockSongs.filter(
    song =>
      (selectedGenre === "Todos" || song.genre === selectedGenre) &&
      song.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>Músicas</Text>

        <TouchableOpacity onPress={() => alert("Adicionar Música")}>
          <Ionicons name="add-circle-outline" size={28} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      {/* Campo de busca */}
      <TextInput
        placeholder="Pesquisar música..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      {/* Gêneros */}
      <View style={styles.genreRow}>
        {genres.map(genre => (
          <TouchableOpacity
            key={genre}
            style={[
              styles.genreButton,
              selectedGenre === genre && styles.genreButtonActive
            ]}
            onPress={() => setSelectedGenre(genre)}
          >
            <Text style={[
              styles.genreText,
              selectedGenre === genre && styles.genreTextActive
            ]}>
              {genre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de músicas */}
      <FlatList
  data={filteredSongs}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => navigation.navigate("MusicPlayerScreen", { music: item })}
    >
      <Image source={item.image} style={styles.songImage} />
      <View>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
    </TouchableOpacity>
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
    marginBottom: 12
  },
  genreRow: {
    flexDirection: "row",
    marginBottom: 12,
    flexWrap: "wrap"
  },
  genreButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 8,
    marginBottom: 8
  },
  genreButtonActive: {
    backgroundColor: "#4f46e5"
  },
  genreText: {
    fontSize: 12
  },
  genreTextActive: {
    color: "#fff"
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 8
  },
  songImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12
  },
  songTitle: {
    fontWeight: "bold"
  },
  songArtist: {
    color: "#555"
  }
});
