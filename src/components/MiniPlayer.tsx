import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePlayer } from "../context/PlayerContext";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "MusicPlayer">;

export default function MiniPlayer() {
  const { currentMusic, isPlaying, togglePlayPause } = usePlayer();
  const navigation = useNavigation<NavigationProp>();

  if (!currentMusic) return null;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("MusicPlayer", {
         music: {
             title: currentMusic.tituloMusica,
             artist: currentMusic.nomeArtista,
             capa: `${process.env.API_BASE_URL}${currentMusic.capaMusica}`,
        },
        
        })}
      style={styles.container}
    >
      <Image source={{ uri: `${process.env.API_BASE_URL}${currentMusic.capaMusica}` }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={styles.title}>{currentMusic.tituloMusica}</Text>
        <Text style={styles.artist}>{currentMusic.nomeArtista}</Text>
      </View>
      <TouchableOpacity onPress={togglePlayPause}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1e1e1e",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    zIndex: 99,
  },
  cover: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
  },
  artist: {
    color: "#ccc",
    fontSize: 12,
  },
});