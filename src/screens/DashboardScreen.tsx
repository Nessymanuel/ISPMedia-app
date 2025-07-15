import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL = process.env.API_BASE_URL;
const mediaTypes = ["Músicas", "Vídeos", "Rádios"];

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<{ name: string; fotografia: string } | null>(null);
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [musicas, setMusicas] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [radios, setRadios] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState("Músicas");

  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser({
          name: parsed.username,
          fotografia: parsed.fotografia,
        });
      }
    };
    loadUser();

    axios.get(`${BASE_URL}/api/Artista`).then((res) => setArtists(res.data));
    axios.get(`${BASE_URL}/api/Album`).then((res) => setAlbums(res.data));
    axios.get(`${BASE_URL}/api/Musica`).then((res) => setMusicas(res.data));
    axios.get(`${BASE_URL}/api/Video`).then((res) => setVideos(res.data));
    fetchRadios();
  }, []);

  const fetchRadios = async () => {
    try {
      const res = await fetch("https://de1.api.radio-browser.info/json/stations/bycountry/Angola?limit30");
      const data = await res.json();
      setRadios(data);
    } catch (err) {
      console.log("Erro ao carregar rádios:", err);
    }
  };

  const handlePlayPause = async (radio: any, id: string) => {
    try {
      setLoadingId(id);
      if (playingId === id && soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await soundRef.current.pauseAsync();
            setIsPlaying(false);
          } else {
            await soundRef.current.playAsync();
            setIsPlaying(true);
          }
        }
      } else {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        const { sound } = await Audio.Sound.createAsync(
          { uri: radio.url_resolved },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        setPlayingId(id);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Erro ao tocar rádio:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredMedia = selectedType === "Músicas" ? musicas : selectedType === "Vídeos" ? videos : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.name ?? "usuário"} 👋</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <Ionicons name="notifications-outline" size={24} color="#4f46e5" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            {user?.fotografia ? (
              <Image source={{ uri: `${BASE_URL}${user.fotografia}` }} style={styles.avatar} />
            ) : (
              <Image source={require("../../assets/imgprofile.png")} style={styles.avatar} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Artistas */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Artistas</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ArtistList")}>
          <Text style={styles.seeAll}>Ver Todos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={artists.slice(0, 5)}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.artistList}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("ArtistDetail", { id: item.id })}>
            <View style={styles.artistCard}>
              <Image source={{ uri: `${BASE_URL}${item.fotoArtista}` }} style={styles.artistAvatar} />
              <Text style={styles.artistName}>{item.nomeArtista}</Text>
              <Text style={styles.artistMeta}>{item.nomeUtilizador}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Álbuns */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Álbuns</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AlbumList")}>
          <Text style={styles.seeAll}>Ver Todos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={albums.slice(0, 5)}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.albumList}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("AlbumDetail", { id: item.id })}>
            <View style={styles.albumCard}>
              <Image source={{ uri: `${BASE_URL}${item.capaAlbum}` }} style={styles.albumCover} />
              <Text style={styles.albumTitle}>{item.tituloAlbum}</Text>
              <Text style={styles.albumMeta}>{item.nomeEditor}</Text>
            </View>
          </TouchableOpacity>
        )}
      />


      {/* Rádios */}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Rádios</Text>
        <TouchableOpacity onPress={() => navigation.navigate("RadioList")}>
          <Text style={styles.seeAll}>Ver Todos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={radios.slice(0, 5)}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={styles.albumList}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const id = `${item.name}-${index}`;
          const isCurrent = playingId === id;
          const isLoading = loadingId === id;

          return (
            <View style={styles.albumCard}>
              <Image
                source={item.favicon ? { uri: item.favicon } : require("../../assets/cover.png")}
                style={styles.albumCover}
              />
              <Text style={styles.albumTitle} numberOfLines={1}>{item.name}</Text>
              <TouchableOpacity style={styles.playButton} onPress={() => handlePlayPause(item, id)}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name={isCurrent && isPlaying ? "pause" : "play"} size={12} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          );
        }}
      />

     

      {/* Filtro de mídias */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mídias</Text>
      </View>

      <View style={styles.filterRow}>
        {mediaTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, selectedType === type && styles.filterButtonActive]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={[styles.filterText, selectedType === type && styles.filterTextActive]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {
        selectedType !== "Rádios" && (
          <FlatList
            data={filteredMedia}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.albumList}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.musicCard}>
                <Image source={{ uri: `${BASE_URL}${item.capaPath ?? item.ficheiroPath}` }} style={styles.albumCover} />
                <Text style={styles.albumTitle} numberOfLines={1}>{item.titulo}</Text>
                <TouchableOpacity style={styles.downloadButton}>
                  <Ionicons name="download-outline" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          />
        )
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 56 : 32,
  },
  header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: { fontSize: 20, fontWeight: "bold", color: "#111" },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  sectionHeader: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold" },
  seeAll: { fontSize: 12, color: "#4f46e5" },
  artistList: { paddingLeft: 20, marginBottom: 20 },
  albumList: { paddingLeft: 20, marginBottom: 20 },
  artistCard: { alignItems: "flex-start", marginRight: 16, width: 80 },
  artistAvatar: { width: 70, height: 70, borderRadius: 35, marginBottom: 4 },
  artistName: { fontSize: 12, color: "#333", textAlign: "center" },
  artistMeta: { fontSize: 11, color: "#666", textAlign: "center" },
  albumCard: {
    alignItems: "flex-start",
    marginRight: 16,
    width: 80,
  },
  albumCover: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginBottom: 4,
  },
  albumTitle: { fontSize: 12, color: "#333", textAlign: "center" },
  albumMeta: { fontSize: 11, color: "#666", textAlign: "center" },
  playButton: {
    position: "absolute",
    bottom: 24,
    right: 8,
    backgroundColor: "#4f46e5",
    padding: 6,
    borderRadius: 20,
    zIndex: 5,
  },
  downloadButton: {
    marginTop: 6,
    backgroundColor: "#4f46e5",
    padding: 6,
    borderRadius: 20,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginVertical: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  filterButtonActive: { backgroundColor: "#4f46e5" },
  filterText: { fontSize: 12, color: "#333" },
  filterTextActive: { color: "#fff" },
  musicCard: {
    width: 120,
    marginRight: 12,
    backgroundColor: "#f3f3f3",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
