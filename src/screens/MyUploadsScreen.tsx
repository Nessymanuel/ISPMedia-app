import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";

export default function MyUploadsScreen() {
  const [showMusicModal, setShowMusicModal] = useState(false);

  const openMusicModal = () => setShowMusicModal(true);
  const closeMusicModal = () => setShowMusicModal(false);

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <Text style={styles.title}>Uploads</Text>

      {/* Cartões Upload */}
      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card} onPress={openMusicModal}>
          <Text style={styles.cardText}>Músicas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardText}>Vídeos</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Upload de Música */}
      <Modal visible={showMusicModal} animationType="slide">
        <View style={styles.modalContainer}>
          {/* Cabeçalho */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Música</Text>
            <TouchableOpacity onPress={closeMusicModal}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          {/* Formulário */}
          <ScrollView contentContainerStyle={styles.form}>
            <TextInput placeholder="Título da Música" style={styles.input} />
            <TextInput placeholder="Letra" style={styles.input} multiline numberOfLines={3} />
            <TextInput placeholder="Gênero Musical" style={styles.input} />
            <TextInput placeholder="Produtor" style={styles.input} />
            <TextInput placeholder="Compositor" style={styles.input} />
            <TextInput placeholder="Visibilidade" style={styles.input} />
            <TextInput placeholder="Data de Lançamento" style={styles.input} />
            <TextInput placeholder="Artista" style={styles.input} />
            <TextInput placeholder="Grupo Musical" style={styles.input} />
            <TextInput placeholder="Álbum" style={styles.input} />
            <TouchableOpacity style={styles.fileButton}>
              <Text style={styles.fileText}>Selecionar Capa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fileButton}>
              <Text style={styles.fileText}>Selecionar Ficheiro de Música</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 30,
    marginHorizontal: 6,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  cancelText: {
    fontSize: 16,
    color: "#7c3aed",
  },
  form: {
    paddingBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  fileButton: {
    backgroundColor: "#e0e0e0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  fileText: {
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#7c3aed",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
