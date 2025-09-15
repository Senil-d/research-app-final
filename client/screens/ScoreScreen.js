import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';


const ScoreScreen = ({ route, navigation }) => {
  const { score, total } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Completed!</Text>
      <Text style={styles.score}>Your Score: {score} / {total}</Text>
      <Button title="Go Back" onPress={() => navigation.popToTop()} />
    </View>
  );
};

export default ScoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  score: {
    fontSize: 20,
    marginBottom: 30
  }
});
