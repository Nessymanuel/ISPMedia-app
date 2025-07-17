import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.API_BASE_URL;

export default function VideoPlayerScreen({ route }: any) {
  const navigation = useNavigation();
  const { video } = route.params;

  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState("");

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

    axios.get(`${BASE_URL}/api/Like/video/${video.id}`).then((res) => {
      setLikes(res.data.length);
    });

 
    axios.get(`${BASE_URL}/api/Critica/video/${video.id}`).then((res) => {
      setComments(
        res.data.map((c: any) => ({
          username: c.nomeUtilizador,
          text: c.comentario,
          stars: c.pontuacao,
        }))
      );
    });
  }, []);

     useEffect(() => {
  console.log("🎥 Dados recebidos do vídeo:", video);
}, []);


  const handlePlayPause = async () => {
    if (!videoRef.current) return;
    const status = await videoRef.current.getStatusAsync();

    if ("isPlaying" in status && status.isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`${BASE_URL}/api/Like`, {
        utilizadorId: userId,
        videoId: video.id,
        musicaId: null,
        albumId: null,
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
        videoId: video.id,
        musicaId: null,
        albumId: null,
      });

      setComments([
        ...comments,
        { username: username, text: comment, stars: rating },
      ]);
      setComment("");
    } catch (err) {
      console.error("Erro ao enviar crítica:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#333" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{video.tituloVideo}</Text>
        <Text style={styles.subtitle}>{video.nomeArtista}</Text>

        <Video
          ref={videoRef}
          source={{ uri: `${BASE_URL}/api/Video/stream/${video.id}` }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          shouldPlay={true}
          useNativeControls={true}
          onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
            if ('isPlaying' in status) {
              setIsPlaying(status.isPlaying);
            }
          }}
        />

        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
          <Ionicons name="heart" size={20} color="#fff" />
          <Text style={styles.likeText}>{likes} curtidas</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Avaliar:</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
              <Ionicons
                name="star"
                size={24}
                color={i <= rating ? "#facc15" : "#ccc"}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.commentInput}
          placeholder="Escreva um comentário..."
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity onPress={handleSubmitComment} style={styles.submitButton}>
          <Text style={styles.submitText}>Enviar</Text>
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
                  color={i <= c.stars ? "#facc15" : "#ccc"}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  backButton: { position: "absolute", top: 50, left: 20, zIndex: 10, padding: 8 },
  scrollContent: { alignItems: "center", paddingBottom: 40, paddingTop: 20, paddingHorizontal: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 4, color: "#111" },
  subtitle: { fontSize: 14, color: "#555", marginBottom: 10 },
  video: { width: "100%", height: 220, backgroundColor: "#000", borderRadius: 10 },
  playButton: {
    marginTop: 10,
    backgroundColor: "#a855f7",
    padding: 14,
    borderRadius: 50,
  },
  likeButton: {
    backgroundColor: "#5b43f2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  likeText: { color: "#fff", marginLeft: 8, fontWeight: "600" },
  sectionTitle: { alignSelf: "flex-start", fontWeight: "bold", fontSize: 14, marginBottom: 4, color: "#333" },
  ratingRow: { flexDirection: "row", marginBottom: 8 },
  commentInput: { width: "100%", borderColor: "#ccc", borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  submitButton: { backgroundColor: "#5b43f2", paddingVertical: 12, borderRadius: 8, width: "100%", alignItems: "center", marginBottom: 20 },
  submitText: { color: "#fff", fontWeight: "bold" },
  commentBox: { backgroundColor: "#f2f2f2", padding: 12, borderRadius: 8, width: "100%", marginBottom: 10 },
  username: { fontWeight: "bold", marginBottom: 2 },
  commentText: { marginBottom: 6, color: "#333" },
});
