// app/auth/SignUp.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit() {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match!");
      return;
    }
    Alert.alert("Success", `Signed up with ${email}`, [
      {
        text: "OK",
        onPress: () => router.replace("/auth/ProfileScreen"),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Atomic Account</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Sign Up" onPress={handleSubmit} />

      <Text style={styles.text}>
        Already have an account?{" "}
        <Text style={styles.link} onPress={() => router.push("/auth/Login")}>
          Login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  text: { marginTop: 15, textAlign: "center" },
  link: { color: "blue", fontWeight: "bold" },
});
