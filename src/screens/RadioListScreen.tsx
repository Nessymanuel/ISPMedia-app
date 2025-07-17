import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FunnelIcon } from "lucide-react";

type Radio = {
  name: string;
  favicon: string;
  url_resolved: string;
  tags: string;
  country: string;
};

export default function RadioListScreen() {
  const navigation = useNavigation();
  const [stations, setStations] = useState<Radio[]>([]);
  const [filtered, setFiltered] = useState<Radio[]>([]);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRadio, setCurrentRadio] = useState<Radio | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    fetchRadios();
  }, []);

  useEffect(() => {
    filterRadios();
  }, [search, countryFilter, genreFilter, stations]);

  const fetchRadios = async () => {
    try {
      const res = await fetch("https://de1.api.radio-browser.info/json/stations/topclick/950");
      const data = await res.json();
      setStations(data);
      setFiltered(data);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const filterRadios = () => {
    const text = search.toLowerCase();
    const result = stations
      .filter(
        (radio) =>
          radio.name.toLowerCase().includes(text) ||
          radio.country.toLowerCase().includes(text) ||
          radio.tags.toLowerCase().includes(text)
      )
      .filter(
        (radio) =>
          (!countryFilter || radio.country.toLowerCase().includes(countryFilter.toLowerCase())) &&
          (!genreFilter || radio.tags.toLowerCase().includes(genreFilter.toLowerCase()))
      );
    setFiltered(result);
  };

  const handlePlayPause = async (radio: Radio, id: string) => {
    try {
      setLoadingId(id);

      // Alterna play/pause se for a mesma rádio
      if (playingId === id && soundRef.current) {
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
        // Sempre para qualquer áudio anterior
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: radio.url_resolved },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        setPlayingId(id);
        setCurrentRadio(radio);
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
      {/* Header com botão voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.title}>Todas as Rádios</Text>
      </View>

      {/* Pesquisa e botão de filtro */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Pesquisar por nome, país ou gênero"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
       

      {/*<FunnelIcon size={18} color="#fff" */}
          
        </TouchableOpacity>
      </View>

      {/* Modal de filtros avançados */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtros Avançados</Text>
            <TextInput
              placeholder="Filtrar por país"
              value={countryFilter}
              onChangeText={setCountryFilter}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Filtrar por gênero"
              value={genreFilter}
              onChangeText={setGenreFilter}
              style={styles.modalInput}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Lista de rádios */}
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item, index }) => {
          const id = `${item.name}-${index}`;
          const isCurrent = playingId === id;
          const isLoading = loadingId === id;

          return (
            <View style={styles.radioItem}>
              <Image
                source={item.favicon ? { uri: item.favicon } : require("../../assets/cover.png")}
                style={styles.image}
              />
              <View style={styles.radioInfo}>
                <Text style={styles.radioTitle}>{item.name}</Text>
                <Text style={styles.radioMeta}>
                  {item.country} • {item.tags.split(",").slice(0, 2).join(", ")}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handlePlayPause(item, id)} style={styles.playButton}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name={isCurrent && isPlaying ? "pause" : "play"} size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Rodapé fixo do player */}
      {playingId && currentRadio && (
        <View style={styles.bottomPlayer}>
          <Image
            source={currentRadio.favicon ? { uri: currentRadio.favicon } : require("../../assets/cover.png")}
            style={styles.playerImage}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text numberOfLines={1} style={styles.playerTitle}>{currentRadio.name}</Text>
            <Text style={styles.playerMeta}>{currentRadio.country} • {currentRadio.tags.split(",")[0]}</Text>
          </View>
          <TouchableOpacity onPress={() => handlePlayPause(currentRadio, playingId)} style={styles.playButtonSmall}>
            {loadingId === playingId ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 48, paddingHorizontal: 16, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButton: { marginRight: 12 },
  title: { fontSize: 22, fontWeight: "bold" },
  searchContainer: { flexDirection: "row", marginBottom: 16 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  filterButton: {
    backgroundColor: "#4f46e5",
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    marginBottom: 14,
    padding: 12,
    borderRadius: 10,
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 16 },
  radioInfo: { flex: 1 },
  radioTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  radioMeta: { fontSize: 12, color: "#666", marginTop: 4 },
  playButton: {
    backgroundColor: "#4f46e5",
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalCloseButton: {
    backgroundColor: "#4f46e5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseText: { color: "#fff", fontWeight: "bold" },

  bottomPlayer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  playerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  playerMeta: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  playButtonSmall: {
    backgroundColor: "#4f46e5",
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
});