// src/screens/LibraryScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types"; // Certifique-se que isso inclui MusicListScreen

export default function LibraryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const items = [
    "Músicas",
    "Vídeos",
    "Artistas",
    "Álbuns",
    "Playlists",
    "Grupos",
    "Notificações",
    "Críticas",
  ];

  const handleItemPress = (item: string) => {
     if (item === "Músicas") {
    navigation.navigate("MusicListScreen");
  
  } else {
    alert(`Funcionalidade "${item}" ainda não implementada`);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biblioteca</Text>

      <ScrollView>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => handleItemPress(item)}
          >
            <Text style={styles.itemText}>{item}</Text>
            <Ionicons name="chevron-forward" size={20} color="#000" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 30,
    alignSelf: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  itemText: {
    color: "#000",
    fontSize: 16,
  },
});
