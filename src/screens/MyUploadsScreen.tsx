import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';




interface Artista {
  id: number;
  nomeArtista: string;
}

interface Album {
  id: number;
  tituloAlbum: string;
}

const BASE_URL = process.env.API_BASE_URL;

export default function MyUploadsScreen() {
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [letra, setLetra] = useState("");
  const [genero, setGenero] = useState("");
  const [produtor, setProdutor] = useState("");
  const [compositor, setCompositor] = useState("");
  const [visibilidade, setVisibilidade] = useState("");
  const [dataLancamento, setDataLancamento] = useState(new Date());
  const [mostrarData, setMostrarData] = useState(false);
  const [artista, setArtista] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const [musicaUri, setMusicaUri] = useState("");
  const [capaUri, setCapaUri] = useState("");
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [albuns, setAlbuns] = useState<Album[]>([]);
  const [tituloVideo, setTituloVideo] = useState("");
  const [legenda, setLegenda] = useState("");
  const [produtorVideo, setProdutorVideo] = useState("");
  const [generoVideo, setGeneroVideo] = useState("");
  const [visibilidadeVideo, setVisibilidadeVideo] = useState("");
  const [dataLancamentoVideo, setDataLancamentoVideo] = useState(new Date());
  const [dataRegistroVideo, setDataRegistroVideo] = useState(new Date());
  const [videoUri, setVideoUri] = useState("");
  const [capaVideoUri, setCapaVideoUri] = useState("");
  const [mostrarDataLanc, setMostrarDataLanc] = useState(false);
  const [mostrarDataReg, setMostrarDataReg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [meusUploads, setMeusUploads] = useState<any[]>([]);




  useEffect(() => {
    axios.get(`${BASE_URL}/api/Artista`).then(res => setArtistas(res.data));
    axios.get(`${BASE_URL}/api/Album`).then(res => setAlbuns(res.data));
  }, []);

  const pickCapa = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled && result.assets?.length) setCapaUri(result.assets[0].uri);
  };

  const pickMusica = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
    if (!result.canceled && result.assets?.length) setMusicaUri(result.assets[0].uri);
  };

  const pickCapaVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled && result.assets?.length) setCapaVideoUri(result.assets[0].uri);
  };

  const pickVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "video/*" });
    if (!result.canceled && result.assets?.length) setVideoUri(result.assets[0].uri);
  };

  const resetForm = () => {
    setTitulo(""); setLetra(""); setGenero(""); setProdutor("");
    setCompositor(""); setVisibilidade(""); setArtista(""); setAlbum("");
    setMusicaUri(""); setCapaUri(""); setTituloVideo(""); setLegenda("");
    setProdutorVideo(""); setGeneroVideo(""); setVisibilidadeVideo("");
    setVideoUri(""); setCapaVideoUri("");
  };




useEffect(() => {
  const loadUserId = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    console.log("🎯 parsedUser (useEffect):", parsedUser);

    if (parsedUser?.id) {
      setUserId(parsedUser.id.toString());
     
    } else {
      console.warn("⚠️ Usuário não encontrado ou mal formatado no AsyncStorage.");
    }
  };

  loadUserId();
}, []);


useEffect(() => {
  if (!userId) return;

  const fetchMusicas = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/Musica/trending/${userId}`);
     
      // setMusicas(response.data); // ← se você quiser mostrar na tela
    } catch (error) {
      console.error("Erro ao buscar músicas:", error);
    }
  };

  fetchMusicas();
}, [userId]);





  const handleEnviarMusica = async () => {
  console.log("🚨 handleEnviarMusica foi chamado!");
  console.log("🔎 musicaUri:", musicaUri);
  console.log("🔎 capaUri:", capaUri);

  if (!userId) {
    Alert.alert("Erro", "Usuário não autenticado.");
    return;
  }

  if (!musicaUri || !capaUri) {
    console.warn("⚠️ URI de música ou capa está vazia.");
    return;
  }

  const formDataMusic = new FormData();

  formDataMusic.append("ficheiroMusica", {
    uri: musicaUri,
    name: "musica.mp3",
    type: "audio/mpeg",
  } as any);

  formDataMusic.append("capa", {
    uri: capaUri,
    name: "capa.jpg",
    type: "image/jpeg",
  } as any);

  formDataMusic.append("TituloMusica", titulo);
  formDataMusic.append("GeneroMusical", genero);
  formDataMusic.append("Letra", letra);
  formDataMusic.append("Produtor", produtor);
  formDataMusic.append("Compositor", compositor);
  formDataMusic.append("Visibilidade", visibilidade);
  formDataMusic.append("DataLancamento", dataLancamento.toISOString());
  formDataMusic.append("UtilizadorId", userId);

  if (artista) formDataMusic.append("ArtistaId", artista.toString());
  if (album) formDataMusic.append("AlbumId", album.toString());

  console.log("📦 Dados preparados para envio:");
  console.log({
    TituloMusica: titulo,
    GeneroMusical: genero,
    Letra: letra,
    Produtor: produtor,
    Compositor: compositor,
    Visibilidade: visibilidade,
    DataLancamento: dataLancamento.toISOString(),
    UtilizadorId: userId,
    ArtistaId: artista,
    AlbumId: album,
    FicheiroMusica: musicaUri,
    Capa: capaUri,
  });

const debugFormData = formDataMusic as any;

for (let pair of debugFormData._parts) {
  console.log(`📨 FormData -> ${pair[0]}:`, pair[1]);
}
  try {
    const response = await axios.post(`${BASE_URL}/api/Musica`, formDataMusic, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Upload feito com sucesso:", response.data);
    Alert.alert("Sucesso", "Música enviada com sucesso!");
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Erro Axios:", error.response?.data);
      console.error("❌ Status:", error.response?.status);
    } else {
      console.error("❌ Erro geral:", error);
    }
    Alert.alert("Erro", "Falha ao enviar música.");
  }
};


 const handleEnviarVideo = async () => {
  if (!userId) {
    Alert.alert("Erro", "Usuário não autenticado.");
    return;
  }

  if (!videoUri || !capaVideoUri) {
    console.warn("⚠️ URI de vídeo ou capa está vazia.");
    return;
  }

  const formDataVideo = new FormData();

  formDataVideo.append("ficheiroVideo", {
    uri: videoUri,
    name: "video.mp4",
    type: "video/mp4",
  } as any);

  formDataVideo.append("capa", {
    uri: capaVideoUri,
    name: "capaVideo.jpg",
    type: "image/jpeg",
  } as any);

  formDataVideo.append("TituloVideo", tituloVideo);
  formDataVideo.append("GeneroDoVideo", generoVideo);
  formDataVideo.append("Legenda", legenda);
  formDataVideo.append("Produtor", produtorVideo);
  formDataVideo.append("Visibilidade", visibilidadeVideo);
  formDataVideo.append("DataLancamento", dataLancamentoVideo.toISOString());
  formDataVideo.append("DataRegistro", dataRegistroVideo.toISOString());
  formDataVideo.append("UtilizadorId", userId);

  if (artista) formDataVideo.append("ArtistaId", artista.toString());
  if (album) formDataVideo.append("AlbumId", album.toString());

  // Log de dados
  console.log("📦 Dados preparados para envio (vídeo):", {
    TituloVideo: tituloVideo,
    GeneroVideo: generoVideo,
    Legenda: legenda,
    Produtor: produtorVideo,
    Visibilidade: visibilidadeVideo,
    DataLancamento: dataLancamentoVideo.toISOString(),
    DataRegistro: dataRegistroVideo.toISOString(),
    UtilizadorId: userId,
    ArtistaId: artista,
    AlbumId: album,
    ficheiroVideo: videoUri,
    capa: capaVideoUri,
  });

  const debugFormData = formDataVideo as any;
  for (let pair of debugFormData._parts) {
    console.log(`📨 FormData -> ${pair[0]}:`, pair[1]);
  }

  try {
    setLoading(true);

    const response = await axios.post(`${BASE_URL}/api/Video`, formDataVideo, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Vídeo enviado com sucesso:", response.data);
    Alert.alert("Sucesso", "Vídeo enviado com sucesso!");
    resetForm();
    setShowVideoModal(false);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Erro Axios (vídeo):", error.response?.data);
      console.error("❌ Status:", error.response?.status);
    } else {
      console.error("❌ Erro geral (vídeo):", error);
    }
    Alert.alert("Erro", "Erro ao enviar vídeo.");
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uploads</Text>

      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card} onPress={() => setShowMusicModal(true)}>
          <Text style={styles.cardIcon}>🎵</Text>
          <Text style={styles.cardText}>Upload Música</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => setShowVideoModal(true)}>
          <Text style={styles.cardIcon}>🎬</Text>
          <Text style={styles.cardText}>Upload Vídeo</Text>
        </TouchableOpacity>
      </View>


      <Text style={styles.sectionTitle}>Meus Uploads</Text>
<ScrollView style={{ marginTop: 10 }}>
  {meusUploads.map((item, index) => (
    <View key={index} style={styles.uploadItem}>
      <Text style={{ fontWeight: "bold" }}>{item.tituloMusica || item.tituloVideo}</Text>
      <Text style={{ color: "#666" }}>{item.generoMusical || item.generoDoVideo}</Text>
      <Text style={{ fontSize: 12 }}>{item.dataLancamento?.split("T")[0]}</Text>
    </View>
  ))}
</ScrollView>


      {/* Modal de Música */}
      <Modal visible={showMusicModal} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload de Música</Text>
            <TouchableOpacity onPress={() => setShowMusicModal(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          {capaUri ? (
            <Image source={{ uri: capaUri }} style={{ width: 120, height: 120, borderRadius: 8, marginBottom: 12 }} />
          ) : null}

          <TouchableOpacity onPress={pickCapa} style={styles.uploadCard}>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadText}>
              {capaUri ? "✓ Capa selecionada" : "Selecionar Capa"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={pickMusica} style={styles.uploadCard}>
            <Text style={styles.uploadIcon}>🎧</Text>
            <Text style={styles.uploadText}>
              {musicaUri ? "✓ Música selecionada" : "Selecionar Ficheiro de Música"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Título</Text>
          <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

          <Text style={styles.label}>Gênero</Text>
          <TextInput style={styles.input} value={genero} onChangeText={setGenero} />

          <Text style={styles.label}>Letra</Text>
          <TextInput style={[styles.input, { height: 100 }]} value={letra} onChangeText={setLetra} multiline />

          <Text style={styles.label}>Produtor</Text>
          <TextInput style={styles.input} value={produtor} onChangeText={setProdutor} />

          <Text style={styles.label}>Compositor</Text>
          <TextInput style={styles.input} value={compositor} onChangeText={setCompositor} />

          <Text style={styles.label}>Artista</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={artista} onValueChange={setArtista}>
              <Picker.Item label="Selecionar Artista" value="" />
              {artistas.map((a) => (
                <Picker.Item key={a.id} label={a.nomeArtista} value={a.id.toString()} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Álbum</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={album} onValueChange={setAlbum}>
              <Picker.Item label="Selecionar Álbum" value="" />
              {albuns.map((a) => (
                <Picker.Item key={a.id} label={a.tituloAlbum} value={a.id.toString()} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Visibilidade</Text>
          <Picker selectedValue={visibilidade} onValueChange={setVisibilidade}>
            <Picker.Item label="Selecionar" value="" />
            <Picker.Item label="Público" value="publica" />
            <Picker.Item label="Privado" value="privada" />
          </Picker>

          <Text style={styles.label}>Data de Lançamento</Text>
          <TouchableOpacity onPress={() => setMostrarData(true)} style={styles.dateButton}>
            <Text>{dataLancamento.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {mostrarData && (
            <DateTimePicker
              value={dataLancamento}
              mode="date"
              display="default"
              onChange={(_, d) => {
                setMostrarData(false);
                if (d) setDataLancamento(d);
              }}
            />
          )}

          {loading && <ActivityIndicator size="large" color="#7c3aed" style={{ marginVertical: 12 }} />}

          <TouchableOpacity style={styles.submitButton} onPress={handleEnviarMusica}>
            <Text style={styles.submitText}>Enviar Música</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* Modal de Vídeo */}
      <Modal visible={showVideoModal} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload de Vídeo</Text>
            <TouchableOpacity onPress={() => setShowVideoModal(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          {capaVideoUri ? (
            <Image source={{ uri: capaVideoUri }} style={{ width: 120, height: 120, borderRadius: 8, marginBottom: 12 }} />
          ) : null}
          <TouchableOpacity onPress={pickCapaVideo} style={styles.uploadCard}>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadText}>
              {capaVideoUri ? "✓ Capa selecionada" : "Selecionar Capa do Vídeo"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={pickVideo} style={styles.uploadCard}>
            <Text style={styles.uploadIcon}>🎥</Text>
            <Text style={styles.uploadText}>
              {videoUri ? "✓ Vídeo selecionado" : "Selecionar Ficheiro de Vídeo"}
            </Text>
          </TouchableOpacity>





          <Text style={styles.label}>Título</Text>
          <TextInput style={styles.input} value={tituloVideo} onChangeText={setTituloVideo} />

          <Text style={styles.label}>Gênero</Text>
          <TextInput style={styles.input} value={generoVideo} onChangeText={setGeneroVideo} />

          <Text style={styles.label}>Legenda</Text>
          <TextInput style={[styles.input, { height: 100 }]} value={legenda} onChangeText={setLegenda} multiline />

          <Text style={styles.label}>Produtor</Text>
          <TextInput style={styles.input} value={produtorVideo} onChangeText={setProdutorVideo} />

          <Text style={styles.label}>Artista</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={artista} onValueChange={setArtista}>
              <Picker.Item label="Selecionar Artista" value="" />
              {artistas.map((a) => (
                <Picker.Item key={a.id} label={a.nomeArtista} value={a.id.toString()} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Visibilidade</Text>
          <Picker selectedValue={visibilidadeVideo} onValueChange={setVisibilidadeVideo}>
            <Picker.Item label="Selecionar" value="" />
            <Picker.Item label="Público" value="publica" />
            <Picker.Item label="Privado" value="privada" />
          </Picker>

          <Text style={styles.label}>Data de Lançamento</Text>
          <TouchableOpacity onPress={() => setMostrarDataLanc(true)} style={styles.dateButton}>
            <Text>{dataLancamentoVideo.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {mostrarDataLanc && (
            <DateTimePicker
              value={dataLancamentoVideo}
              mode="date"
              display="default"
              onChange={(_, d) => {
                setMostrarDataLanc(false);
                if (d) setDataLancamentoVideo(d);
              }}
            />
          )}

          <Text style={styles.label}>Data de Registro</Text>
          <TouchableOpacity onPress={() => setMostrarDataReg(true)} style={styles.dateButton}>
            <Text>{dataRegistroVideo.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {mostrarDataReg && (
            <DateTimePicker
              value={dataRegistroVideo}
              mode="date"
              display="default"
              onChange={(_, d) => {
                setMostrarDataReg(false);
                if (d) setDataRegistroVideo(d);
              }}
            />
          )}

          {loading && (
            <Modal transparent visible animationType="fade">
              <View style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.4)",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <View style={{
                  backgroundColor: "#fff",
                  padding: 24,
                  borderRadius: 12,
                  alignItems: "center",
                  elevation: 5
                }}>
                  <ActivityIndicator size="large" color="#7c3aed" />
                  <Text style={{ marginTop: 12, fontSize: 16 }}>A enviar, aguarde...</Text>
                </View>
              </View>
            </Modal>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleEnviarVideo}>
            <Text style={styles.submitText}>Enviar Vídeo</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  card: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 24,
    margin: 8,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  cardIcon: { fontSize: 32, marginBottom: 8 },
  cardText: { fontSize: 16, fontWeight: "600" },
  modalContainer: { padding: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  modalTitle: { fontSize: 22, fontWeight: "bold" },
  cancelText: { fontSize: 16, color: "#7c3aed" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  fileButton: {
    backgroundColor: "#e0e0e0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  fileText: { fontSize: 16, color: "#333" },
  submitButton: {
    backgroundColor: "#7c3aed",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  uploadCard: {
    backgroundColor: "#ede9fe", // lilás suave
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#c4b5fd",
    elevation: 3,
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  uploadText: {
    fontSize: 16,
    color: "#4b0082",
    fontWeight: "600",
  },

  sectionTitle: {
  fontSize: 18,
  fontWeight: "bold",
  marginTop: 24,
  marginBottom: 8,
},

uploadItem: {
  padding: 12,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  marginBottom: 8,
},


  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
