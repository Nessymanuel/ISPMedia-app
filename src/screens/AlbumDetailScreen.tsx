import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL = process.env.API_BASE_URL!;
type AlbumDetailRouteProp = RouteProp<RootStackParamList, "AlbumDetail">;

export default function AlbumDetailScreen() {
  const route = useRoute<AlbumDetailRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;

  const [album, setAlbum] = useState<any | null>(null);
  const [musicas, setMusicas] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const resAlbum = await axios.get(`${BASE_URL}/api/Album/${id}`);
        setAlbum(resAlbum.data);
      } catch (err) {
        console.error("Erro ao buscar álbum:", err);
        setAlbum(null);
        setLoading(false);
        return;
      }

      try {
        const resMusicas = await axios.get(`${BASE_URL}/api/Musica/Album/${id}`);
        setMusicas(resMusicas.data);
      } catch {
        setMusicas([]);
      }

      try {
        const resVideos = await axios.get(`${BASE_URL}/api/Video/Album/${id}`);
        setVideos(resVideos.data);
      } catch {
        setVideos([]);
      }

      setLoading(false);
    };

    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (!album) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Álbum não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Botão voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#4f46e5" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <Image source={{ uri: `${BASE_URL}${album.capaAlbum}` }} style={styles.cover} />
      <Text style={styles.title}>{album.tituloAlbum}</Text>
      <Text style={styles.detail}>🎶 Descrição: {album.descricao}</Text>
      <Text style={styles.detail}>🏷️ Editora: {album.editora}</Text>
      <Text style={styles.detail}>🎤 Artista: {album.nomeArtista ?? "N/A"}</Text>
      <Text style={styles.detail}>👤 Editor: {album.nomeEditor}</Text>
      <Text style={styles.detail}>🔒 Visibilidade: {album.visibilidade}</Text>
      <Text style={styles.detail}>
        📅 Lançamento: {new Date(album.dataLancamento).toLocaleDateString()}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Músicas</Text>
        {musicas.length === 0 ? (
          <Text style={styles.noMedia}>Sem músicas.</Text>
        ) : (
          musicas.map((musica) => (
            <View key={musica.id} style={styles.mediaItem}>
              <Text style={styles.mediaTitle}>🎵 {musica.titulo}</Text>
              <Text style={styles.mediaSubtitle}>{musica.formato}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vídeos</Text>
        {videos.length === 0 ? (
          <Text style={styles.noMedia}>Sem vídeos.</Text>
        ) : (
          videos.map((video) => (
            <View key={video.id} style={styles.mediaItem}>
              <Text style={styles.mediaTitle}>🎬 {video.titulo}</Text>
              <Text style={styles.mediaSubtitle}>{video.formato}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backText: {
    color: "#4f46e5",
    fontSize: 16,
    marginLeft: 6,
  },
  cover: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    color: "#444",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  mediaItem: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  mediaTitle: {
    fontWeight: "bold",
  },
  mediaSubtitle: {
    color: "#555",
  },
  noMedia: {
    color: "#888",
    fontStyle: "italic",
  },
  error: {
    fontSize: 16,
    color: "red",
  },
});
