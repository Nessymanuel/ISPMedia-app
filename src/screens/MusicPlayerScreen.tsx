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
  const [progress, setProgress] = useState(0); // real
  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [position, setPosition] = useState(0); // em milissegundos
  const [duration, setDuration] = useState(1); // evitar divisão por zero
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

    axios.get(`${BASE_URL}/api/Critica/musica/${music.id}`).then((res) => {
      setComments(
        res.data.map((c: any) => ({
          username: c.nomeUtilizador,
          text: c.comentario,
          stars: c.pontuacao,
        }))
      );
    });

    axios.get(`${BASE_URL}/api/Like/musica/${music.id}`).then((res) => {
      setLikes(res.data.length);
    });
  }, []);


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

      <Text style={styles.headerTitle}>Música</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.collectionTitle}>{music.nomeAlbum}</Text>

        <Image source={{ uri: `${BASE_URL}${music.capaMusica}` }} style={styles.coverImage} />

        <Text style={styles.songTitle}>{music.tituloMusica}</Text>
        <Text style={styles.artist}>{music.nomeArtista}</Text>

        <Slider
          style={{ width: "90%", height: 40 }}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          minimumTrackTintColor="#a855f7"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#a855f7"
          onSlidingComplete={async (value) => {
            if (sound) {
              await sound.setPositionAsync(value);
            }
          }}
        />

        <View style={styles.timeRow}>
          <Text style={styles.time}>{formatTime(position)}</Text>
          <Text style={styles.time}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.controls}>
          <Ionicons name="play-skip-back" size={28} color="#333" />
          <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#fff" />
          </TouchableOpacity>
          <Ionicons name="play-skip-forward" size={28} color="#333" />
        </View>

        {/* Letra */}
        <Text style={styles.lyricsTitle}>Letra</Text>
        <Text style={styles.lyrics}>{music.letra || "Letra indisponível."}</Text>

        {/* Curtidas */}
        <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
          <Ionicons name="heart" size={20} color="#fff" />
          <Text style={styles.likeText}>{likes} curtidas</Text>
        </TouchableOpacity>

        {/* Avaliação */}
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

        {/* Comentário */}
        <TextInput
          style={styles.commentInput}
          placeholder="Escreva um comentário..."
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity onPress={handleSubmitComment} style={styles.submitButton}>
          <Text style={styles.submitText}>Enviar</Text>
        </TouchableOpacity>

        {/* Comentários */}
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

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50, paddingHorizontal: 20 },
  backButton: { position: "absolute", top: 50, left: 20, zIndex: 10, padding: 8 },
  headerTitle: { textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 10 },
  scrollContent: { alignItems: "center", paddingBottom: 50 },
  collectionTitle: { color: "#666", fontSize: 14, marginBottom: 10 },
  coverImage: { width: 280, height: 280, borderRadius: 12, marginBottom: 20 },
  songTitle: { fontSize: 22, color: "#111", fontWeight: "bold", marginBottom: 4 },
  artist: { color: "#666", fontSize: 14, marginBottom: 20 },
  progressContainer: { width: "80%", height: 4, backgroundColor: "#ddd", borderRadius: 2, marginBottom: 6 },
  progressBar: { height: 4, backgroundColor: "#a855f7", borderRadius: 2 },
  timeRow: { width: "80%", flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  time: { color: "#888", fontSize: 12 },
  controls: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", width: "80%", marginBottom: 30 },
  playButton: { backgroundColor: "#a855f7", padding: 20, borderRadius: 50, marginHorizontal: 20 },
  lyricsTitle: { fontSize: 16, fontWeight: "bold", color: "#333", alignSelf: "flex-start", marginBottom: 8 },
  lyrics: { fontSize: 14, color: "#444", lineHeight: 22, textAlign: "left", marginBottom: 20 },
  likeButton: { backgroundColor: "#5b43f2", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, flexDirection: "row", alignItems: "center", marginBottom: 16 },
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
