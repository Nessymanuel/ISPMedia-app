import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "@env";

export default function SignUpScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState<any>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSignUp = async () => {
  setError("");

  // Validações
  const emailRegex = /^(201[3-9]|202[0-9])[0-9]{4}@isptec\.co\.ao$/;
  if (!emailRegex.test(email)) {
    setError("E-mail inválido. Use o formato: 20200001@isptec.co.ao");
    return;
  }

  const phoneRegex = /^[0-9]{9}$/;
  if (!phoneRegex.test(phone)) {
    setError("Telefone inválido. Use apenas 9 dígitos.");
    return;
  }

  if (password.length < 8) {
    setError("A senha deve ter no mínimo 8 caracteres.");
    return;
  }

  if (password !== confirmPassword) {
    setError("As senhas não coincidem.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("Username", name);
    formData.append("Senha", password);
    formData.append("Email", email);
    formData.append("Telefone", phone);
    formData.append("TipoDeUtilizador", "0"); // ✅ campo obrigatório

    if (image) {
      formData.append("foto", {
        uri: image.uri,
        name: "foto.jpg",
        type: "image/jpeg",
      } as any);
    }

    // ✅ Enviar sem headers manuais — o axios cuida do boundary
    await axios.post(`${API_BASE_URL}/api/Utilizador`, formData);

    Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
    navigation.navigate("Login");
  } catch (e) {
    console.error("Erro ao criar conta:", e);
    setError("Erro ao criar conta.");
  }
};

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logoupdate.png")} style={styles.logo} />
      <Text style={styles.title}>Crie sua conta no ISPMEDIA</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

     <View style={styles.photoWrapper}>
  <TouchableOpacity onPress={pickImage}>
    {image ? (
      <Image source={{ uri: image.uri }} style={styles.avatar} />
    ) : (
      <View style={styles.avatarPlaceholder}>
        <Text style={{ color: "#999" }}>+</Text>
      </View>
    )}
  </TouchableOpacity>
  <Text style={styles.selectText}>Selecionar foto</Text>
</View>

      <TextInput
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Digite seu nome de utilizador"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Digite seu número de telefone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Confirme sua senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={handleSignUp} style={styles.button}>
        <Text style={styles.buttonText}>Criar Conta</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Já tem conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}> Fazer login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#fff", paddingHorizontal: 24 },
  logo: { width: 250, height: 100, alignSelf: "center", marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 24 },
  error: { color: "red", textAlign: "center", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 12, marginBottom: 16 },
  button: { backgroundColor: "#7c3aed", padding: 16, borderRadius: 6, alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  footer: { flexDirection: "row", justifyContent: "center" },
  link: { color: "#7c3aed" },
  imagePicker: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center"
  },
  imagePickerText: {
    color: "#666"
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
    resizeMode: "cover"
  },

  photoWrapper: {
  alignItems: "center",
  marginBottom: 20,
},

avatar: {
  width: 80,
  height: 80,
  borderRadius: 40,
  resizeMode: "cover",
},

avatarPlaceholder: {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: "#eee",
  justifyContent: "center",
  alignItems: "center",
},

selectText: {
  marginTop: 6,
  fontSize: 12,
  color: "#666",
}

});
