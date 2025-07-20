import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
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
  const [isFullscreen, setIsFullscreen] = useState(false);
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
      setLikes(res.data.totalLikes);
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

  const handleFullscreenToggle = async () => {
    if (!videoRef.current) return;

    if (Platform.OS === "android") {
      // Android pode suportar PiP
      try {
        await videoRef.current.presentFullscreenPlayer();
      } catch (err) {
        console.error("Erro ao entrar em fullscreen:", err);
      }
    } else {
      setIsFullscreen(!isFullscreen);
      await videoRef.current.presentFullscreenPlayer();
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

      setComments([...comments, { username, text: comment, stars: rating }]);
      setComment("");
    } catch (err) {
      console.error("Erro ao enviar crítica:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-down" size={28} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
            <Ionicons name="heart" size={22} color="#f472b6" />
            <Text style={styles.likeText}>{likes}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{video.tituloVideo}</Text>
        <Text style={styles.subtitle}>{video.nomeArtista}</Text>

        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: `${BASE_URL}/api/Video/stream/${video.id}` }}
            style={isFullscreen ? styles.videoFullscreen : styles.video}
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay={true}
            onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
              if ('isPlaying' in status) {
                setIsPlaying(status.isPlaying);
              }
            }}
          />
          
          {/* Legenda sobre o vídeo */}
          {video.legenda && (
            <View style={styles.captionContainer}>
              <Text style={styles.caption}>{video.legenda}</Text>
            </View>
          )}

          {/* Botões sobre o vídeo */}
          <View style={styles.videoControls}>
            <TouchableOpacity onPress={handlePlayPause} style={styles.playOverlay}>
              <Ionicons name={isPlaying ? "pause" : "play"} size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleFullscreenToggle} style={styles.fullscreenButton}>
              <Ionicons name="expand" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Avaliar e comentar */}
        <View style={styles.commentArea}>
          <Text style={styles.sectionTitle}>Avaliar & Comentar</Text>

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
            style={styles.commentInput}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0c0c0e" },
  scrollContent: { alignItems: "center", paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20 },
  topBar: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 4, color: "#fff", textAlign: "center" },
  subtitle: { fontSize: 14, color: "#ccc", marginBottom: 12 },
  videoContainer: { width: "100%", height: 220, position: "relative" },
  video: { width: "100%", height: "100%", backgroundColor: "#000", borderRadius: 12 },
  videoFullscreen: { width: "100%", height: 300, backgroundColor: "#000" },
  videoControls: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "space-between", padding: 10 },
  playOverlay: { position: "absolute", top: "40%", left: "45%" },
  fullscreenButton: { position: "absolute", bottom: 10, right: 10, backgroundColor: "#0006", padding: 6, borderRadius: 20 },
  captionContainer: { position: "absolute", bottom: 40, width: "100%", alignItems: "center" },
  caption: { color: "#fff", backgroundColor: "#0008", paddingHorizontal: 10, borderRadius: 4, fontSize: 12 },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  likeText: { color: "#fff", marginLeft: 6, fontSize: 14 },
  commentArea: { width: "100%", marginTop: 10 },
  sectionTitle: { color: "#fff", fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  ratingRow: { flexDirection: "row", marginBottom: 8 },
  commentInput: {
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: "#a855f7",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  submitText: { color: "#fff", fontWeight: "bold" },
  commentBox: {
    backgroundColor: "#18181b",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  username: { color: "#fff", fontWeight: "bold", marginBottom: 4 },
  commentText: { color: "#ccc", marginBottom: 4 },
});