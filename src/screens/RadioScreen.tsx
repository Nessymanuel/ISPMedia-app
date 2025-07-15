import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const radios = [
  {
    id: "1",
    title: "Rádio Luanda",
    image: require("../../assets/cover.png"),
    streamUrl: "https://stream.zeno.fm/fw3rqz8vprhvv",
  },
  {
    id: "2",
    title: "Rádio Nacional de Angola",
    image: require("../../assets/cover.png"),
    streamUrl: "https://stream.zeno.fm/0rbqpn3spxhvv",
  },
  {
    id: "3",
    title: "LAC - Luanda Antena Comercial",
    image: require("../../assets/cover.png"),
    streamUrl: "https://stream.zeno.fm/t9kdfv4vprhvv",
  },
  {
    id: "4",
    title: "Rádio Mais",
    image: require("../../assets/radiomais.png"),
    streamUrl: "https://stream.zeno.fm/yg92uwwvprhvv",
  },
];

export default function RadioScreen() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="radio-outline" size={24} color="#4f46e5" />
        <Text style={styles.headerTitle}>Rádios de Angola</Text>
      </View>

      <FlatList
        data={radios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isCurrent = playingId === item.id;
          const isLoading = loadingId === item.id;

          return (
            <View style={styles.radioItem}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.radioInfo}>
                <Text style={styles.radioTitle}>{item.title}</Text>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => handlePlayPause(item)}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons
                      name={isCurrent && isPlaying ? "pause" : "play"}
                      size={20}
                      color="#fff"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    marginBottom: 14,
    padding: 12,
    borderRadius: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  radioInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  radioTitle: {
    fontSize: 16,
    color: "#333",
  },
  playButton: {
    backgroundColor: "#4f46e5",
    padding: 8,
    borderRadius: 20,
  },
});
