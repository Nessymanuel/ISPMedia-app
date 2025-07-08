import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

type UserData = {
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
};

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsed = JSON.parse(userData);
         // Se não tiver data de cadastro, adiciona uma data simulada
          if (!parsed.createdAt) {
            parsed.createdAt = new Date().toISOString().split("T")[0];
            await AsyncStorage.setItem("user", JSON.stringify(parsed));
          }
          setUser(parsed);
        } else {
          navigation.navigate("Login");
        }
      } catch (e) {
        console.error(e);
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Carregando perfil...</Text>
      </View>
    );
  }

  // Estatísticas fictícias
  const stats = {
    uploads: 12,
    playlists: 4,
    reviews: 9,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <Image
          source={require("../../assets/logoupdate.png")}
          style={styles.logo}
        />
      </View>

      {/* Avatar */}
      <Image
        source={require("../../assets/imgprofile.png")}
        style={styles.avatar}
      />

      {/* Dados Pessoais */}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.phone}>
        <Ionicons name="call" size={16} color="#555" /> {user.phone}
      </Text>
      <Text style={styles.registered}>
        <MaterialIcons name="calendar-today" size={16} color="#555" /> Cadastro em: {user.createdAt}
      </Text>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.uploads}</Text>
          <Text style={styles.statLabel}>Uploads</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.playlists}</Text>
          <Text style={styles.statLabel}>Playlists</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.reviews}</Text>
          <Text style={styles.statLabel}>Críticas</Text>
        </View>
      </View>

      {/* Botão de Sair */}
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Text style={styles.buttonText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingBottom: 60,
  },
  banner: {
    width: "100%",
    backgroundColor: "#7c3aed",
    paddingVertical: 20,
    alignItems: "center",
  },
  logo: { width: 140, height: 50, resizeMode: "contain", marginBottom: 4 },
  appName: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  avatar: { width: 120, height: 120, borderRadius: 60, marginTop: -40, borderWidth: 3, borderColor: "#fff" },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 12 },
  email: { fontSize: 16, color: "#555", marginBottom: 4 },
  phone: { fontSize: 16, color: "#555", marginBottom: 4 },
  registered: { fontSize: 14, color: "#777", marginBottom: 24 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 8,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  statBox: { alignItems: "center", flexDirection: "row", gap: 10, justifyContent: "center" },
  statNumber: { fontSize: 18, fontWeight: "bold"},
  statLabel: { fontSize: 18, color: "#777" },
  button: {
    backgroundColor: "#e11d48",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 6,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  loading: { fontSize: 16, color: "#666", marginTop: 20 },
});
