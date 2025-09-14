import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LevelContext } from './F1-roadmap/Levels/Context/LevelContext';

const MapScreen = () => {
  const navigation = useNavigation();
  const context = useContext(LevelContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [modalType, setModalType] = useState(null); // 'description' or 'completed'
  const currentLevel = context?.currentLevel ?? 1;

  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  const getLevelStatus = (level) => {
    if (level < currentLevel) return 'completed';
    if (level === currentLevel) return 'current';
    return 'locked';
  };

  const handleLevelPress = (level) => {
    if (level <= currentLevel) {
      setSelectedLevel(level);
      setModalType(level < currentLevel ? 'completed' : 'description');
      setModalVisible(true);
    }
  };

  const handleStartTask = () => {
    setModalVisible(false);
    if (selectedLevel) {
      navigation.navigate(`Lv${selectedLevel}Screen`);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedLevel(null);
    setModalType(null);
  };

  // New handler for resetting to Level 1
  const handleStartAgain = () => {
    if (context?.setCurrentLevel) {
      context.setCurrentLevel(1);
    }
  };

  // Hardcoded level descriptions
  const getLevelDescription = (level) => {
    const descriptions = {
      1: 'Level 1 Overview:\n- Solve basic puzzles\n- Learn game mechanics\n- Earn your first badge',
      2: 'Level 2 Overview:\n- Tackle intermediate challenges\n- Test your reflexes\n- Unlock new rewards',
      3: 'Level 3 Overview:\n- Master strategic tasks\n- Enhance problem-solving\n- Gain special bonuses',
      4: 'Level 4 Overview:\n- Face timed challenges\n- Improve accuracy\n- Collect unique items',
      5: 'Level 5 Overview:\n- Conquer complex puzzles\n- Test your endurance\n- Earn a mid-tier badge',
      6: 'Level 6 Overview:\n- Solve advanced riddles\n- Boost your creativity\n- Unlock hidden rewards',
      7: 'Level 7 Overview:\n- Tackle multi-step tasks\n- Sharpen your focus\n- Gain epic points',
      8: 'Level 8 Overview:\n- Overcome tough obstacles\n- Test your speed\n- Earn elite rewards',
      9: 'Level 9 Overview:\n- Master expert challenges\n- Prove your skills\n- Unlock rare badges',
      10: 'Level 10 Overview:\n- Face the ultimate test\n- Showcase your mastery\n- Become a legend',
    };
    return descriptions[level] || `Level ${level} Overview:\n- 5 exciting tasks to complete\n- Test your skills\n- Unlock rewards`;
  };

  // Hardcoded completion statuses
  const getCompletionStatus = (level) => {
    const statuses = {
      1: 'You mastered Level 1 puzzles! Great start!',
      2: 'Level 2 challenges crushed! Well done!',
      3: 'Level 3 strategies conquered! Impressive!',
      4: 'Level 4 timed tasks completed! Amazing work!',
      5: 'Level 5 complex puzzles solved! Halfway there!',
      6: 'Level 6 riddles unlocked! Creative genius!',
      7: 'Level 7 multi-step tasks done! Focused effort!',
      8: 'Level 8 obstacles overcome! Speedy success!',
      9: 'Level 9 expert challenges mastered! Elite skills!',
      10: 'Level 10 ultimate test passed! You’re a legend!',
    };
    return statuses[level] || `Congratulations! You have completed Level ${level}!`;
  };

  // Show a fallback UI if context is unavailable
  if (!context) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Error: Level context not found. Ensure MapScreen is wrapped in LevelProvider.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mapPath}>
          {levels.map((level) => {
            const status = getLevelStatus(level);
            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelBox,
                  status === 'completed' && styles.completed,
                  status === 'current' && styles.current,
                  status === 'locked' && styles.locked,
                ]}
                onPress={() => handleLevelPress(level)}
                activeOpacity={0.8}
                disabled={status === 'locked'} // Disable interaction for locked levels
              >
                <Text style={styles.levelText}>
                  {status === 'locked' ? '🔒' : level}
                </Text>
                {status === 'completed' && <Text style={styles.checkMark}>✅</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Start Again Button */}
        <TouchableOpacity style={styles.startAgainButton} onPress={handleStartAgain}>
          <Text style={styles.startAgainText}>Start Again</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Modal for level description or completion status */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === 'completed' ? `Level ${selectedLevel} Completed` : `Level ${selectedLevel}`}
            </Text>
            <Text style={styles.modalDescription}>
              {modalType === 'completed' && selectedLevel
                ? getCompletionStatus(selectedLevel)
                : selectedLevel
                ? getLevelDescription(selectedLevel)
                : ''}
            </Text>
            {modalType === 'description' ? (
              <>
                <Button
                  title="Start My Task"
                  onPress={handleStartTask}
                  color="#ff9800"
                />
                <Button
                  title="Close"
                  onPress={handleCloseModal}
                  color="#9e9e9e"
                />
              </>
            ) : (
              <Button
                title="OK"
                onPress={handleCloseModal}
                color="#4caf50"
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Light blue background for a map feel
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapPath: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    maxWidth: 300, // To create a compact map layout
  },
  levelBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  completed: {
    backgroundColor: '#4caf50', // Green for completed
  },
  current: {
    backgroundColor: '#ff9800', // Orange for current
    transform: [{ scale: 1.1 }], // Slightly larger for emphasis
  },
  locked: {
    backgroundColor: '#9e9e9e', // Gray for locked
    opacity: 0.7, // Slightly faded for disabled feel
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  checkMark: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    fontSize: 14,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  startAgainButton: {
    backgroundColor: '#d32f2f', // Red to indicate reset action
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  startAgainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default MapScreen;