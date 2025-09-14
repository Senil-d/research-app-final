import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Lv3Screen = ({ navigation }) => {
  const [completed, setCompleted] = useState(false)

  const handleCompleteLevel = async () => {
    // Load saved progress
    const savedUnlocked = await AsyncStorage.getItem('unlockedLevel')
    const savedCompleted = await AsyncStorage.getItem('completedLevels')

    let unlocked = savedUnlocked ? parseInt(savedUnlocked) : 1
    let completedLevels = savedCompleted ? JSON.parse(savedCompleted) : []

    // Mark Level 1 as completed
    if (!completedLevels.includes(1)) {
      completedLevels.push(1)
    }

    // Unlock next level
    const nextLevel = Math.max(unlocked, 2)
    await AsyncStorage.setItem('unlockedLevel', String(nextLevel))
    await AsyncStorage.setItem('completedLevels', JSON.stringify(completedLevels))

    // Go back to Roadmap
    navigation.navigate('Roadmapf1')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Level 1</Text>
      <Text style={styles.subtitle}>Complete the tasks for Level 1</Text>

      {/* Example Task */}
      <TouchableOpacity
        style={styles.taskButton}
        onPress={() => setCompleted(true)}
      >
        <Text style={styles.taskText}>✅ Finish Subtask</Text>
      </TouchableOpacity>

      {completed && (
        <TouchableOpacity style={styles.nextButton} onPress={handleCompleteLevel}>
          <Text style={styles.nextButtonText}>Complete Level 1 🚀</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default Lv3Screen

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  taskButton: { padding: 15, backgroundColor: '#eee', borderRadius: 10, marginBottom: 20 },
  taskText: { fontSize: 16 },
  nextButton: { padding: 15, backgroundColor: '#3a0ca3', borderRadius: 10 },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
})
