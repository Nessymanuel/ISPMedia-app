import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import Slider from '@react-native-community/slider';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.API_BASE_URL;

export default function MusicPlayerScreen({ route }: any) {
  const navigation = useNavigation();
  const { music } = route.params;

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");

 useEffect(() => {
  const loadUser = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserId(parsed.id);
      setUsername(parsed.username);
    }
  };

  loadUser();

  // Atualiza os comentários
  axios.get(`${BASE_URL}/api/Critica/musica/${music.id}`).then((res) => {
    setComments(res.data.map((c: any) => ({
      username: c.nomeUtilizador,
      text: c.comentario,
      stars: c.pontuacao,
    })));
  });

  // Atualiza os likes
  axios.get(`${BASE_URL}/api/Like/musica/${music.id}`).then((res) => {
    setLikes(res.data.totalLikes);
  });
}, [music.id]); 

  const handlePlayPause = async () => {
    try {
      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: `${BASE_URL}/api/Musica/stream/${music.id}` }
        );

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.durationMillis) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis);
            setProgress(status.positionMillis / status.durationMillis);
            setIsPlaying(status.isPlaying);
          }
        });

        setSound(newSound);
        await newSound.playAsync();
        return;
      }

      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
      }
    } catch (err) {
      console.error("Erro ao tocar música:", err);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`${BASE_URL}/api/Like`, {
        utilizadorId: userId,
        musicaId: music.id,
        albumId: null,
        videoId: null,
      });
      setLikes((prev) => prev + 1);
    } catch (err) {
      console.error("Erro ao enviar like:", err);
    }
  };

  const handleSubmitComment = async () => {
    if (comment.trim() === "") return;

    try {
      await axios.post(`${BASE_URL}/api/Critica`, {
        comentario: comment,
        pontuacao: rating,
        utilizadorId: userId,
        musicaId: music.id,
        albumId: null,
        videoId: null,
      });

      setComments([...comments, { username, text: comment, stars: rating }]);
      setComment("");
    } catch (err) {
      console.error("Erro ao enviar crítica:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-down" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
            <Ionicons name="heart" size={24} color="#f472b6" />
            <Text style={styles.likeText}>{likes}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.section}>Top Hits de Hoje</Text>
        <Image source={{ uri: `${BASE_URL}${music.capaMusica}` }} style={styles.cover} />
        <Text style={styles.title}>{music.tituloMusica}</Text>
        <Text style={styles.artist}>{music.nomeArtista}</Text>

        <Slider
          style={{ width: "100%" }}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          minimumTrackTintColor="#a855f7"
          maximumTrackTintColor="#333"
          thumbTintColor="#fff"
          onSlidingComplete={async (value) => {
            if (sound) await sound.setPositionAsync(value);
          }}
        />

        <View style={styles.timeRow}>
          <Text style={styles.time}>{formatTime(position)}</Text>
          <Text style={styles.time}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.controls}>
          <Ionicons name="play-skip-back" size={28} color="#fff" />
          <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={30} color="#fff" />
          </TouchableOpacity>
          <Ionicons name="play-skip-forward" size={28} color="#fff" />
        </View>

        <View style={styles.lyricsBox}>
          <Text style={styles.lyricsHeader}>Letra</Text>
          <Text style={styles.lyrics}>{music.letra || "Letra indisponível."}</Text>
        </View>

        <View style={styles.commentArea}>
          <Text style={styles.commentTitle}>Avaliar & Comentar</Text>

          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setRating(i)}>
                <Ionicons name="star" size={20} color={i <= rating ? "#facc15" : "#444"} />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Escreva um comentário..."
            placeholderTextColor="#888"
            value={comment}
            onChangeText={setComment}
            style={styles.input}
          />

          <TouchableOpacity onPress={handleSubmitComment} style={styles.sendButton}>
            <Text style={styles.sendText}>Enviar</Text>
          </TouchableOpacity>

          {comments.map((c, index) => (
            <View key={index} style={styles.commentBox}>
              <Text style={styles.username}>{c.username}</Text>
              <Text style={styles.commentText}>{c.text}</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={16}
                    color={i <= c.stars ? "#facc15" : "#555"}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0c0c0e" },
  scroll: { alignItems: "center", padding: 20, paddingBottom: 60 },
  topBar: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 10 },
  section: { color: "#aaa", fontSize: 12, marginBottom: 12 },
  cover: { width: 260, height: 260, borderRadius: 12, marginBottom: 20 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 4, textAlign: "center" },
  artist: { color: "#bbb", fontSize: 14, marginBottom: 20, textAlign: "center" },
  timeRow: { width: "100%", flexDirection: "row", justifyContent: "space-between", marginTop: 6, marginBottom: 16 },
  time: { color: "#888", fontSize: 12 },
  controls: { flexDirection: "row", justifyContent: "space-evenly", width: "100%", marginBottom: 20, alignItems: "center" },
  playButton: {
    backgroundColor: "#a855f7",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  likeButton: { flexDirection: "row", alignItems: "center" },
  likeText: { color: "#fff", marginLeft: 4 },
  lyricsBox: {
    backgroundColor: "#1c1c1e",
    padding: 16,
    borderRadius: 16,
    width: "100%",
    marginBottom: 20,
  },
  lyricsHeader: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 8,
  },
  lyrics: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 22,
  },
  commentArea: { width: "100%", marginTop: 10 },
  commentTitle: { color: "#fff", fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  ratingRow: { flexDirection: "row", marginBottom: 8 },
  input: {
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    marginBottom: 8,
  },
  sendButton: {
    backgroundColor: "#a855f7",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  sendText: { color: "#fff", fontWeight: "bold" },
  commentBox: {
    backgroundColor: "#18181b",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  username: { color: "#fff", fontWeight: "bold", marginBottom: 4 },
  commentText: { color: "#ccc", marginBottom: 4 },
});