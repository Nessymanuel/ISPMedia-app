import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function MyUploadsScreen() {
  // Modals
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Música
  const [titulo, setTitulo] = useState("");
  const [letra, setLetra] = useState("");
  const [genero, setGenero] = useState("");
  const [produtor, setProdutor] = useState("");
  const [compositor, setCompositor] = useState("");
  const [visibilidade, setVisibilidade] = useState("");
  const [dataLancamento, setDataLancamento] = useState(new Date());
  const [mostrarData, setMostrarData] = useState(false);
  const [artista, setArtista] = useState("");
  const [grupo, setGrupo] = useState("");
  const [album, setAlbum] = useState("");

  // Vídeo
  const [tituloVideo, setTituloVideo] = useState("");
  const [legenda, setLegenda] = useState("");
  const [produtorVideo, setProdutorVideo] = useState("");
  const [generoVideo, setGeneroVideo] = useState("");
  const [visibilidadeVideo, setVisibilidadeVideo] = useState("");
  const [dataLancamentoVideo, setDataLancamentoVideo] = useState(new Date());
  const [dataRegistroVideo, setDataRegistroVideo] = useState(new Date());
  const [mostrarDataLanc, setMostrarDataLanc] = useState(false);
  const [mostrarDataReg, setMostrarDataReg] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uploads</Text>
      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card} onPress={() => setShowMusicModal(true)}>
          <Text style={styles.cardText}>Músicas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => setShowVideoModal(true)}>
          <Text style={styles.cardText}>Vídeos</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de MÚSICA */}
      <Modal visible={showMusicModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Música</Text>
            <TouchableOpacity onPress={() => setShowMusicModal(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.form}>
            {/* Campos da música */}
            <Text style={styles.label}>Título da Música</Text>
            <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

            <Text style={styles.label}>Letra</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              value={letra}
              onChangeText={setLetra}
              multiline
            />

            <Text style={styles.label}>Gênero Musical</Text>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={genero} onValueChange={setGenero} style={styles.picker}>
                <Picker.Item label="Selecionar" value="" />
                <Picker.Item label="Hip Hop" value="hiphop" />
                <Picker.Item label="Kizomba" value="kizomba" />
                <Picker.Item label="Gospel" value="gospel" />
              </Picker>
            </View>

            <Text style={styles.label}>Produtor</Text>
            <TextInput style={styles.input} value={produtor} onChangeText={setProdutor} />

            <Text style={styles.label}>Compositor</Text>
            <TextInput style={styles.input} value={compositor} onChangeText={setCompositor} />

            <Text style={styles.label}>Visibilidade</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={visibilidade}
                onValueChange={setVisibilidade}
                style={styles.picker}
              >
                <Picker.Item label="Selecionar" value="" />
                <Picker.Item label="Público" value="publico" />
                <Picker.Item label="Privado" value="privado" />
              </Picker>
            </View>

            <Text style={styles.label}>Data de Lançamento</Text>
            <TouchableOpacity
              onPress={() => setMostrarData(true)}
              style={styles.dateButton}
            >
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

            <Text style={styles.label}>Capa</Text>
            <TouchableOpacity style={styles.fileButton}>
              <Text style={styles.fileText}>Selecionar Imagem</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Ficheiro da Música</Text>
            <TouchableOpacity style={styles.fileButton}>
              <Text style={styles.fileText}>Selecionar Ficheiro</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitText}>Carregar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal de VÍDEO */}
      <Modal visible={showVideoModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Vídeo</Text>
            <TouchableOpacity onPress={() => setShowVideoModal(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.form}>
            <Text style={styles.label}>Título do Vídeo</Text>
            <TextInput style={styles.input} value={tituloVideo} onChangeText={setTituloVideo} />

            <Text style={styles.label}>Legenda</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={legenda}
              onChangeText={setLegenda}
              multiline
            />

            <Text style={styles.label}>Produtor</Text>
            <TextInput style={styles.input} value={produtorVideo} onChangeText={setProdutorVideo} />

            <Text style={styles.label}>Gênero do Vídeo</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={generoVideo}
                onValueChange={setGeneroVideo}
                style={styles.picker}
              >
                <Picker.Item label="Selecionar" value="" />
                <Picker.Item label="Documentário" value="documentario" />
                <Picker.Item label="Clipe" value="clipe" />
                <Picker.Item label="Animação" value="animacao" />
              </Picker>
            </View>

            <Text style={styles.label}>Visibilidade</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={visibilidadeVideo}
                onValueChange={setVisibilidadeVideo}
                style={styles.picker}
              >
                <Picker.Item label="Selecionar" value="" />
                <Picker.Item label="Público" value="publico" />
                <Picker.Item label="Privado" value="privado" />
              </Picker>
            </View>

            <Text style={styles.label}>Data de Lançamento</Text>
            <TouchableOpacity
              onPress={() => setMostrarDataLanc(true)}
              style={styles.dateButton}
            >
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
            <TouchableOpacity
              onPress={() => setMostrarDataReg(true)}
              style={styles.dateButton}
            >
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

            <Text style={styles.label}>Capa do Vídeo</Text>
            <TouchableOpacity style={styles.fileButton}>
              <Text style={styles.fileText}>Selecionar Imagem</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Ficheiro do Vídeo</Text>
            <TouchableOpacity style={styles.fileButton}>
              <Text style={styles.fileText}>Selecionar Ficheiro</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitText}>Carregar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  card: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 30,
    marginHorizontal: 6,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: { fontSize: 16, fontWeight: "600" },
  modalContainer: { flex: 1, backgroundColor: "#fff", paddingTop: 60, paddingHorizontal: 16 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  modalTitle: { fontSize: 22, fontWeight: "bold" },
  cancelText: { fontSize: 16, color: "#7c3aed" },
  form: { paddingBottom: 40 },
  label: { fontSize: 14, marginBottom: 4, fontWeight: "600" },
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
    height: 48,
    marginBottom: 12,
    justifyContent: "center",
    overflow: "hidden",
  },
  picker: { flex: 1, paddingHorizontal: Platform.OS === "ios" ? 12 : 0 },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
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
    marginTop: 10,
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
