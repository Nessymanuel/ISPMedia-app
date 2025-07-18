import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "@env";

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/Utilizador/login`, {
        email,
        senha: password,
      });

      const user = response.data;
      await AsyncStorage.setItem("user", JSON.stringify(user));

      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Email ou senha inválidos.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logoupdate.png")} style={styles.logo} />
      <Text style={styles.title}>Bem-vindo ao ISPMEDIA 👋</Text>
      <Text style={styles.subtitle}>Faça login para acessar sua conta</Text>

      <TextInput
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Não tem conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.link}> Criar conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  logo: {
    width: 250,
    height: 100,
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#7c3aed",
    padding: 16,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  link: {
    color: "#7c3aed",
  },
});
