import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

export default function QuickTutorial({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>👋 Welcome to UniConnect!</Text>
          <Text style={styles.text}>
            • Share posts or drop media using the box at the top.{"\n\n"}
            • Tap the heart icon to like posts.{"\n\n"}
            • Pull down anytime to refresh your feed.
          </Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Got it, let's go!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center", padding: 20 },
  card: { backgroundColor: "#161E2E", padding: 24, borderRadius: 16, width: "100%", maxWidth: 340, borderWidth: 1, borderColor: "#2D3748" },
  title: { fontSize: 18, fontWeight: "bold", color: "#FFF", marginBottom: 12, textAlign: "center" },
  text: { fontSize: 14, color: "#9CA3AF", lineHeight: 22, marginBottom: 20 },
  button: { backgroundColor: "#006837", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#FFF", fontWeight: "600", fontSize: 15 },
});