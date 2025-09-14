// LeadershipResultScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const LeadershipResultScreen = () => {
  const {
    overall_score,
    level,
    trait_scores,
    skill_area = 'Leadership'
  } = useLocalSearchParams();

  const router = useRouter();

  const parsedScores = trait_scores ? JSON.parse(trait_scores) : {};

  const barData = {
    labels: Object.keys(parsedScores).map(trait => trait.toUpperCase()),
    datasets: [
      {
        data: Object.values(parsedScores).map(t => t.score || 0)
      }
    ]
  };

  useEffect(() => {
    // Future: Save to MongoDB here
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🎉 Celebration Lottie */}
      <LottieView
        source={require('../assets/celebration.json')}
        autoPlay
        loop={false}
        style={{ width: 180, height: 180 }}
      />

      <Text style={styles.header}>🎯 Leadership Skill Report</Text>

      {/* 🧠 Overall Result */}
      <Animatable.View animation="fadeInUp" delay={300} style={styles.card}>
        <Text style={styles.label}>Skill Area:</Text>
        <Text style={styles.value}>{skill_area}</Text>

        <Text style={styles.label}>Overall Score:</Text>
        <Text style={styles.value}>{overall_score}/10</Text>

        <Text style={styles.label}>Level:</Text>
        <Text style={styles.value}>{level}</Text>
      </Animatable.View>

      {/* 📊 Trait Breakdown */}
      <Text style={[styles.header, { fontSize: 18, marginTop: 20 }]}>Skill Breakdown</Text>
      <BarChart
        data={barData}
        width={screenWidth - 40}
        height={220}
        yAxisSuffix="/10"
        chartConfig={chartConfig}
        verticalLabelRotation={20}
        style={{ marginVertical: 12, borderRadius: 10 }}
      />

      {/* 🔍 Trait Level Summary */}
      <View style={{ width: '100%' }}>
        {Object.entries(parsedScores).map(([trait, data]) => (
          <View key={trait} style={styles.traitCard}>
            <Text style={styles.traitName}>{trait}</Text>
            <Text style={styles.traitLevel}>Level: {data.level}</Text>
            <Text style={styles.traitScore}>Score: {data.score}/10</Text>
          </View>
        ))}
      </View>

      {/* 👣 Back to Home */}
      <Animatable.Text
        onPress={() => router.push('/home')}
        style={styles.homeButton}
        animation="pulse"
        iterationCount="infinite"
      >
        🔁 Back to Home
      </Animatable.Text>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: '#0A2647',
  backgroundGradientFrom: '#00D1FF',
  backgroundGradientTo: '#1A73E8',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#f6f9fc'
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#0A2647',
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    width: '100%',
    elevation: 3,
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888'
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A73E8',
    marginBottom: 6
  },
  traitCard: {
    backgroundColor: '#e7f0ff',
    padding: 14,
    borderRadius: 10,
    marginVertical: 5
  },
  traitName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A237E'
  },
  traitLevel: {
    color: '#0D47A1'
  },
  traitScore: {
    color: '#1E88E5'
  },
  homeButton: {
    fontSize: 18,
    color: '#0A2647',
    marginTop: 30,
    textDecorationLine: 'underline'
  }
});

export default LeadershipResultScreen;
