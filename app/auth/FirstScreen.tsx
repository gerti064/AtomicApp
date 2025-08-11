// app/auth/FirstScreen.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function FirstScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Atomic</Text>
      <Button title="Login" onPress={() => router.push("/auth/Login")} />
      <View style={{ height: 20 }} />
      <Button title="Sign Up" onPress={() => router.push("/auth/SignUp")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 40 },
});
