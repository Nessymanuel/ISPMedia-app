import React, { useEffect, useState, useRef } from "react";
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
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const albums = [
  { id: "1", title: "Álbum 1", cover: require("../../assets/cover.png") },
  { id: "2", title: "Álbum 2", cover: require("../../assets/cover.png") },
  { id: "3", title: "Álbum 3", cover: require("../../assets/cover.png") },
  { id: "4", title: "Álbum 4", cover: require("../../assets/cover.png") },
];

const artists = [
  { id: "1", name: "Artista A", avatar: require("../../assets/cover.png") },
  { id: "2", name: "Artista B", avatar: require("../../assets/cover.png") },
  { id: "3", name: "Artista C", avatar: require("../../assets/cover.png") },
  { id: "4", name: "Artista D", avatar: require("../../assets/cover.png") },
];

const mediaTypes = ["Músicas", "Vídeos", "Rádios"];

const allMedia = [
  { id: "1", type: "Músicas", title: "Música Relax", duration: "3 min", image: require("../../assets/cover.png") },
  { id: "2", type: "Vídeos", title: "Video Aula", duration: "15 min", image: require("../../assets/cover.png") },
  { id: "3", type: "Rádios", title: "Rádio News", duration: "Ao Vivo", image: require("../../assets/cover.png") },
  { id: "4", type: "Músicas", title: "Música Pop", duration: "4 min", image: require("../../assets/cover.png") },
  { id: "5", type: "Vídeos", title: "Video Tutorial", duration: "20 min", image: require("../../assets/cover.png") },
];

const radios = [
  { id: "1", title: "Rádio Luanda", image: require("../../assets/cover.png"), streamUrl: "https://stream.zeno.fm/fw3rqz8vprhvv" },
  { id: "2", title: "Rádio Nacional de Angola", image: require("../../assets/cover.png"), streamUrl: "https://stream.zeno.fm/0rbqpn3spxhvv" },
  { id: "3", title: "LAC - Luanda Antena Comercial", image: require("../../assets/cover.png"), streamUrl: "https://stream.zeno.fm/t9kdfv4vprhvv" },
  { id: "4", title: "Rádio Mais", image: require("../../assets/cover.png"), streamUrl: "https://stream.zeno.fm/yg92uwwvprhvv" },
];

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedType, setSelectedType] = useState("Músicas");
  const [user, setUser] = useState<{ name: string } | null>(null);

  const soundRef = useRef<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  const filteredMedia = selectedType === "Todos"
    ? allMedia
    : allMedia.filter(item => item.type === selectedType);

  const handlePlayPause = async (radio: typeof radios[0]) => {
    try {
      setLoadingId(radio.id);

      if (playingId === radio.id && soundRef.current) {
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
          { uri: radio.streamUrl },
          { shouldPlay: true }
        );

        soundRef.current = sound;
        setPlayingId(radio.id);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Erro ao tocar rádio:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.name ?? "Usuário"} 👋</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image source={require("../../assets/imgprofile.png")} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Artistas</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ArtistList")}>
          <Text style={styles.seeAll}>Ver Todos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={artists}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.artistList}
        renderItem={({ item }) => (
          <View style={styles.artistCard}>
            <Image source={item.avatar} style={styles.artistAvatar} />
            <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
          </View>
        )}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Álbuns</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AlbumList")}>
          <Text style={styles.seeAll}>Ver Todos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={albums}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.albumList}
        renderItem={({ item }) => (
          <View style={styles.albumCard}>
            <Image source={item.cover} style={styles.albumCover} />
            <Text style={styles.albumTitle} numberOfLines={1}>{item.title}</Text>
          </View>
        )}
      />

      <View style={{ height: 16 }} />

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

      <View style={styles.mediaList}>
        {selectedType === "Rádios" ? (
          radios.map((radio) => {
            const isCurrent = playingId === radio.id;
            const isLoading = loadingId === radio.id;

            return (
              <View key={radio.id} style={styles.radioItem}>
                <Image source={radio.image} style={styles.mediaImage} />
                <View style={styles.radioInfo}>
                  <Text style={styles.mediaTitle}>{radio.title}</Text>
                  <TouchableOpacity style={styles.playButton} onPress={() => handlePlayPause(radio)}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Ionicons name={isCurrent && isPlaying ? "pause" : "play"} size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          filteredMedia.map((item) => (
            <View key={item.id} style={styles.mediaItem}>
              <Image source={item.image} style={styles.mediaImage} />
              <View style={styles.mediaInfo}>
                <Text style={styles.mediaTitle}>{item.title}</Text>
                <Text style={styles.mediaSubtitle}>{item.duration}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 56 : 32
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
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold" },
  seeAll: { fontSize: 12, color: "#4f46e5" },
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
  mediaList: { width: "90%" },
  mediaItem: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  mediaImage: { width: 80, height: 80, borderRadius: 8 },
  mediaInfo: { padding: 12, justifyContent: "center" },
  mediaTitle: { fontSize: 14, fontWeight: "bold" },
  mediaSubtitle: { fontSize: 12, color: "#555" },
  albumList: { paddingHorizontal: 16 },
  albumCard: { alignItems: "center", marginRight: 16, width: 80 },
  albumCover: { width: 70, height: 70, borderRadius: 8, marginBottom: 4 },
  albumTitle: { fontSize: 12, color: "#333", textAlign: "center" },
  artistList: { paddingHorizontal: 16, marginBottom: 20 },
  artistCard: { alignItems: "center", marginRight: 16, width: 80 },
  artistAvatar: { width: 70, height: 70, borderRadius: 35, marginBottom: 4 },
  artistName: { fontSize: 12, color: "#333", textAlign: "center" },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    marginBottom: 14,
    padding: 12,
    borderRadius: 10,
  },
  radioInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  playButton: {
    backgroundColor: "#4f46e5",
    padding: 8,
    borderRadius: 20,
  },
});
