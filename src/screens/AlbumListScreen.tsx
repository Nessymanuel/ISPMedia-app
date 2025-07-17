import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import axios from "axios";

const BASE_URL = process.env.API_BASE_URL;
const genres = ["Todos", "Pop", "Jazz", "Rock", "Hip-Hop", "Kuduro", "Kizomba", "Semba"];

export default function AlbumListScreen() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/Album`)
      .then((res) => setAlbums(res.data))
      .catch((err) => console.error("Erro ao buscar álbuns:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredAlbums = albums.filter(
    (album) =>
      (selectedGenre === "Todos" || album.generoMusical === selectedGenre) &&
      album.tituloAlbum.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Álbuns</Text>
        <TouchableOpacity onPress={() => alert("Adicionar Álbum")}>
          <Ionicons name="add-circle-outline" size={28} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      {/* Campo de pesquisa */}
      <TextInput
        placeholder="Pesquisar álbum..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      {/* Gêneros */}
      <View style={styles.genreRow}>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre}
            style={[
              styles.genreButton,
              selectedGenre === genre && styles.genreButtonActive,
            ]}
            onPress={() => setSelectedGenre(genre)}
          >
            <Text
              style={[
                styles.genreText,
                selectedGenre === genre && styles.genreTextActive,
              ]}
            >
              {genre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de álbuns */}
      <FlatList
        data={filteredAlbums}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("AlbumDetail", { id: item.id })}
            style={styles.albumCard}
          >
            <Image
              source={{ uri: `${BASE_URL}${item.capaAlbum}` }}
              style={styles.albumCover}
            />
            <View>
              <Text style={styles.albumTitle}>{item.tituloAlbum}</Text>
              <Text style={styles.albumMeta}>{item.nomeArtista}</Text>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  albumCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f3f3f3",
    borderRadius: 12,
    padding: 10,
  },
  albumCover: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#ccc",
  },
  albumTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  albumMeta: {
    fontSize: 12,
    color: "#666",
  },
});
