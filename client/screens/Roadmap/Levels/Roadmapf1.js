import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const levels = Array.from({ length: 15 }, (_, i) => i + 1);

export default function RoadmapScreen({ navigation }) {
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState([]);

  useEffect(() => {
    const loadProgress = async () => {
      const savedUnlocked = await AsyncStorage.getItem('unlockedLevel');
      const savedCompleted = await AsyncStorage.getItem('completedLevels');
      if (savedUnlocked) setUnlockedLevel(parseInt(savedUnlocked));
      if (savedCompleted) setCompletedLevels(JSON.parse(savedCompleted));
    };
    loadProgress();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Roadmap</Text>
      <View style={styles.levelContainer}>
        {levels.map((level) => {
          const isUnlocked = level <= unlockedLevel;
          const isCompleted = completedLevels.includes(level);

          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelCircle,
                { backgroundColor: isCompleted ? '#4cc9f0' : isUnlocked ? '#3a0ca3' : '#ccc' },
              ]}
              disabled={!isUnlocked}
              onPress={() => navigation.navigate(`Lv${level}Screen`)}
            >
              <Text style={styles.levelText}>
                {isCompleted ? '✅' : `Lv${level}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  levelContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  levelCircle: {
    width: 70, height: 70, margin: 10,
    borderRadius: 35, justifyContent: 'center', alignItems: 'center',
  },
  levelText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});
