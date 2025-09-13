// screens/ReadyScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { EXPO_PUBLIC_BASE_URL } from '@env'; // ✅ USE .env FOR CONSISTENT BASE URL

const ReadyScreen = ({ navigation, route }) => {
  const { level, user } = route.params;

  const handleStartQuiz = () => {
    navigation.navigate('QuizScreen', { level, user });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get Ready for the Quiz!</Text>
      <Text style={styles.subtitle}>Level: {level}</Text>
      <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
        <Text style={styles.startButtonText}>Start Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReadyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2647',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00FFD1',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 40
  },
  startButton: {
    backgroundColor: '#1A73E8',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
