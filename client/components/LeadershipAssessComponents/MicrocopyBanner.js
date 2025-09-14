// components/MicrocopyBanner.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Microcopy ideas for traits
const microcopyByTrait = {
  communication: [
    "📣 Clear communication builds strong teams!",
    "🗣️ Say it like a leader!",
    "👂 Listening is half the talk.",
  ],
  adaptability: [
    "🌊 Go with the flow — leaders adapt!",
    "🔄 Embrace the unexpected!",
    "🧠 Flexibility is your superpower.",
  ],
  'decision-making': [
    "⚖️ Choose wisely, future leader!",
    "🧭 A quick decision is still a decision.",
    "🧠 Trust your instincts!",
  ],
  delegation: [
    "🧑‍🤝‍🧑 Great leaders trust their team!",
    "📤 Share the load, grow the team.",
    "📋 Assign, align, and shine!",
  ],
  teamwork: [
    "🤝 Teamwork makes the dream work!",
    "🧩 Every role matters.",
    "💬 Collaboration is key.",
  ],
  strategy: [
    "♟️ Think long-term. Play the big game!",
    "🧩 Align actions with vision.",
    "📈 Leaders see the whole board.",
  ],
};

export default function MicrocopyBanner({ trait }) {
  const microcopies = microcopyByTrait[trait?.toLowerCase()] || ["✨ Show us what you've got!"];
  const randomIndex = Math.floor(Math.random() * microcopies.length);
  const message = microcopies[randomIndex];

  return (
    <View style={styles.banner}>
      <MaterialIcons name="lightbulb" size={20} color="#FFD700" style={{ marginRight: 8 }} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFCEB',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});
