import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ResultScreen = ({ route, navigation }) => {
  const {
    correctAnswers,
    totalQuestions,
    percentage,
    skillName,
    requiredScore
  } = route.params;

  // Convert percentage to 0–10 scale (e.g., 70% → 7.0)
  const gotScore = (percentage / 10).toFixed(1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Completed!</Text>

      <Text style={styles.scoreText}>
        You got {correctAnswers} out of {totalQuestions} correct.
      </Text>

      <Text style={styles.percentText}>Your Score: {percentage}%</Text>

      {skillName && requiredScore !== undefined && (
        <View style={styles.skillBox}>
          <Text style={styles.skillLabel}>Skill Assessed: <Text style={styles.skillName}>{skillName}</Text></Text>
          <Text style={styles.skillScore}>Required Score: {requiredScore}/10</Text>
          <Text style={styles.skillScore}>Your Score: {gotScore}/10</Text>

          {gotScore >= requiredScore ? (
            <Text style={styles.passed}>You met the skill requirement!</Text>
          ) : (
            <Text style={styles.failed}>Keep improving to reach the required level.</Text>
          )}
        </View>
      )}

      <Text style={styles.motivation}>
        {percentage >= 70
          ? 'Great job! You\'re on the right path.'
          : 'Keep practicing. You’ve got this!'}
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('HomeScreen')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Go Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F4F9FF',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 10,
  },
  percentText: {
    fontSize: 18,
    color: '#444',
    marginBottom: 20,
  },
  skillBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
  },
  skillLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#0D47A1',
  },
  skillName: {
    fontWeight: '700',
    color: '#1976D2',
  },
  skillScore: {
    fontSize: 16,
    marginBottom: 4,
    color: '#1E88E5',
  },
  passed: {
    fontSize: 16,
    color: '#2E7D32',
    marginTop: 10,
    fontWeight: '600',
  },
  failed: {
    fontSize: 16,
    color: '#D32F2F',
    marginTop: 10,
    fontWeight: '600',
  },
  motivation: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#1A73E8',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
