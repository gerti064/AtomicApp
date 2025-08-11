// app/auth/ProfileScreen.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to your Profile!</Text>
      <Text style={styles.subtitle}>Manage your account details here.</Text>

      <Button
        title="Logout"
        color="red"
        onPress={() => router.replace("/auth/FirstScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
});
