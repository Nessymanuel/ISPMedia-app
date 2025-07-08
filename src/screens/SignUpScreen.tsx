import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUpScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    setError("");

    // Validar email
    const emailRegex = /^(201[3-9]|202[0-9])[0-9]{4}@isptec\.co\.ao$/;
    if (!emailRegex.test(email)) {
      setError("E-mail inválido. Use o formato: 20200001@isptec.co.ao");
      return;
    }

    // Validar telefone
    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      setError("Telefone inválido. Use apenas 9 dígitos.");
      return;
    }

    // Validar senha
    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    // Confirmar senha
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      // Salvar dados
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          email,
          password,
          name,
          phone,
        })
      );
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.navigate("Login");
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível salvar seus dados.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logoupdate.png")} style={styles.logo} />
      <Text style={styles.title}>Crie sua conta no ISPMEDIA</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

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
});
