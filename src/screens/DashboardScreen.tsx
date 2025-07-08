import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, ScrollView, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const groups = [
  { id: "1", name: "Grupo A", avatar: require("../../assets/imgprofile.png") },
  { id: "2", name: "Grupo B", avatar: require("../../assets/imgprofile.png") },
  { id: "3", name: "Grupo C", avatar: require("../../assets/imgprofile.png") },
  { id: "4", name: "Grupo D", avatar: require("../../assets/imgprofile.png") },
];

const mediaTypes = ["Todos", "Vídeos", "Músicas", "Rádios", "Podcasts"];

const allMedia = [
  { id: "1", type: "Músicas", title: "Música Relax", duration: "3 min", image: require("../../assets/cover.png") },
  { id: "2", type: "Vídeos", title: "Video Aula", duration: "15 min", image: require("../../assets/cover.png") },
  { id: "3", type: "Rádios", title: "Rádio News", duration: "Ao Vivo", image: require("../../assets/cover.png") },
  { id: "4", type: "Músicas", title: "Música Pop", duration: "4 min", image: require("../../assets/cover.png") },
  { id: "5", type: "Vídeos", title: "Video Tutorial", duration: "20 min", image: require("../../assets/cover.png") },
  { id: "6", type: "Podcasts", title: "Podcast Tech", duration: "30 min", image: require("../../assets/cover.png") },
  { id: "7", type: "Rádios", title: "Rádio 80s", duration: "Ao Vivo", image: require("../../assets/cover.png") },
  { id: "8", type: "Músicas", title: "Música Jazz", duration: "5 min", image: require("../../assets/cover.png") },
  { id: "9", type: "Vídeos", title: "Video Promo", duration: "2 min", image: require("../../assets/cover.png") },
  { id: "10", type: "Podcasts", title: "Podcast Saúde", duration: "25 min", image: require("../../assets/cover.png") },
];

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedType, setSelectedType] = useState("Todos");
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  const filteredMedia = selectedType === "Todos"
    ? allMedia
    : allMedia.filter(item => item.type === selectedType);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.name ?? "Usuário"} 👋</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")} >
            <Image source={require("../../assets/imgprofile.png")} style={styles.avatar} />
          </TouchableOpacity>

        </View>
      </View>

      {/* Banner Promo */}
      <View style={styles.banner}>
        <View>
          <Text style={styles.bannerTitle}>🎵 Mídia em alta</Text>
          <Text style={styles.bannerSubtitle}>"Música Relax" está bombando hoje!</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.bannerButton}>Ouvir agora</Text>
        </TouchableOpacity>
      </View>

      {/* Grupos */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Grupos</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Ver Todos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={groups}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.groupList}
        renderItem={({ item }) => (
          <View style={styles.groupItem}>
            <Image source={item.avatar} style={styles.groupAvatar} />
            <Text style={styles.groupName}>{item.name}</Text>
          </View>
        )}
      />


      {/* Filtros */}
      <View style={styles.filterRow}>
        {mediaTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              selectedType === type && styles.filterButtonActive
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text
              style={[
                styles.filterText,
                selectedType === type && styles.filterTextActive
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista Mídia */}
      <View style={styles.mediaList}>
        {filteredMedia.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.mediaItem}
            onPress={() => navigation.navigate("ContentDetail", { id: item.id })}
          >
            <Image source={item.image} style={styles.mediaImage} />
            <View style={styles.mediaInfo}>
              <Text style={styles.mediaTitle}>{item.title}</Text>
              <Text style={styles.mediaSubtitle}>{item.duration}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 56 : 32
  },
  header: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: { fontSize: 20, fontWeight: "bold", color: "#111" },
  subtitle: { fontSize: 14, color: "#555" },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  iconButton: { marginRight: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  banner: {
    width: "90%",
    backgroundColor: "#fbbf24",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  bannerTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  bannerSubtitle: { fontSize: 12, color: "#333" },
  bannerButton: { fontSize: 12, color: "#111", fontWeight: "bold" },
  sectionHeader: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold" },
  seeAll: { fontSize: 12, color: "#4f46e5" },
  groupList: { paddingHorizontal: 16 },
  groupItem: {
    alignItems: "center",
    marginRight: 16,
  },
  groupImage: { width: 60, height: 60, borderRadius: 8, marginBottom: 4 },
  groupName: { fontSize: 12, color: "#333" },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginVertical: 16,
  },
  groupAvatar: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginBottom: 4,
  },



  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  filterButtonActive: { backgroundColor: "#4f46e5" },
  filterText: { fontSize: 12, color: "#333" },
  filterTextActive: { color: "#fff" },
  mediaList: { width: "90%" },
  mediaItem: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  mediaImage: { width: 80, height: 80 },
  mediaInfo: { padding: 12, justifyContent: "center" },
  mediaTitle: { fontSize: 14, fontWeight: "bold" },
  mediaSubtitle: { fontSize: 12, color: "#555" },
});

