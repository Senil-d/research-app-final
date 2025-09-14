import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Header from '../components/Header';

const QuizScreen = ({ route }) => {
  const { level = 'Beginner' } = route?.params || {};
  const navigation = useNavigation(); 

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [typedQuestion, setTypedQuestion] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`http://192.168.8.105:5050/api/quiz`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setQuestions(res.data.questions.slice(0, 20));
      } catch (err) {
        console.error('Failed to load questions:', err.message);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [level]);

  useEffect(() => {
    if (questions.length > 0) {
      const current = questions[currentQuestionIndex].problem;
      let index = 0;
      const interval = setInterval(() => {
        setTypedQuestion(current.slice(0, index + 1));
        index++;
        if (index >= current.length) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }
  }, [currentQuestionIndex, questions]);

  const handleSubmitMarked = async () => {
    const formattedAnswers = {};
    for (let index in selectedAnswers) {
      const questionId = questions[index].id;
      formattedAnswers[questionId] = selectedAnswers[index];
    }
  
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.post(
        `http://192.168.8.120:5050/api/quiz/evaluate`,
        { answers: formattedAnswers },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      const { correctAnswers, totalQuestions, percentage } = res.data;
  
      navigation.navigate('QuizResultScreen', {
        correctAnswers,
        totalQuestions,
        percentage
      });
    } catch (err) {
      console.error('Failed to submit answers', err.message);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E1C16E" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  let parsedOptions;
  try {
    parsedOptions = JSON.parse(currentQuestion.options.replace(/'/g, '"'));
  } catch {
    parsedOptions = currentQuestion.options;
  }

  return (
    <>
    <Header/>
    <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.headerRow}>
      <View style={styles.dotsColumn}>
        {questions.map((_, idx) => {
          const answered = selectedAnswers[idx] !== undefined;
          const active = idx === currentQuestionIndex;
          return (
            <View
              key={idx}
              style={[
                styles.dot,
                answered && styles.dotFilled,
                active && styles.dotActive,
              ]}
            />
          );
        })}
      </View>

  <Animatable.Text animation="fadeInDown" style={styles.headerText}>
    {currentQuestionIndex + 1}/{questions.length}
  </Animatable.Text>
</View>


      <Animatable.View animation="fadeInUp" delay={200} style={styles.card}>
        <Text style={styles.questionText}>{typedQuestion}</Text>
        <View style={styles.optionsGrid}>
          {Object.entries(parsedOptions).map(([key, value]) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === key;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.optionBox, isSelected && styles.selectedOptionBox]}
                onPress={() =>
                  setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: key })
                }
              >
                <Text style={styles.optionKey}>{key}</Text>
                <Text style={styles.optionValue}>{value}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animatable.View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handlePrevious} disabled={currentQuestionIndex === 0} style={styles.navButton}>
          <Text style={styles.navButtonText1}>◀ Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmitMarked} style={styles.markButton}>
          <Text style={styles.navButtonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} disabled={currentQuestionIndex === questions.length - 1} style={styles.navButton}>
          <Text style={styles.navButtonText1}>Next ▶</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setShowProgressModal(true)} style={styles.progressButton}>
        <Text style={styles.navButtonText1}>Show Progress</Text>
      </TouchableOpacity>

      <Modal visible={showProgressModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.progressLabel}>Progress</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, {
                  width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%`
                }]}
              />
            </View>
            <TouchableOpacity onPress={() => setShowProgressModal(false)} style={styles.navButton}>
              <Text style={styles.navButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.footerStatus}>
        <Text style={styles.statusText}>you Earn XP: {Object.keys(selectedAnswers).length * 5}</Text>
      </View>
    </ScrollView>
    </>
    
  );
};

export default QuizScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#070C14',
    justifyContent: 'center'
  },
  headerText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#E1C16E',
    textAlign: 'center',
    marginBottom: 20
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#C7D2FE'
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dotsColumn: {
    flexDirection: 'row',
    gap: 4,
    marginRight: 15,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1f2b40', // empty
    marginVertical: 4,
  },
  dotFilled: {
    backgroundColor: '#E1C16E', // gold for answered
  },
  dotActive: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  
  card: {
    backgroundColor: '#0B1220',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#223149',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6
  },
  questionText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#E5E7EB',
    marginBottom: 20,
    textAlign: 'center'
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10
  },
  optionBox: {
    width: '48%',
    backgroundColor: '#0e1b2c',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#223149'
  },
  selectedOptionBox: {
    borderColor: '#E1C16E',
    shadowColor: '#E1C16E',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  optionKey: {
    fontSize: 16,
    fontWeight: '900',
    color: '#E1C16E'
  },
  optionValue: {
    fontSize: 14,
    color: '#E5E7EB',
    textAlign: 'center',
    marginTop: 4
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  navButton: {
    backgroundColor: '#0e1b2c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E1C16E'
  },
  navButtonText: {
    fontWeight: '500',
    fontSize: 16
  },

  navButtonText1: {
    color: '#E1C16E',
    fontWeight: '500',
    fontSize: 16
  },

  markButton: {
    backgroundColor: '#E1C16E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12
  },
  progressButton: {
    alignSelf: 'center',
    backgroundColor: '#0B1220',
    borderWidth: 2,
    borderColor: '#E1C16E',
    padding: 12,
    borderRadius: 12,
    marginVertical: 15
  },
  progressLabel: {
    fontSize: 16,
    color: '#E1C16E',
    marginBottom: 8,
    fontWeight: '700',
    textAlign: 'center'
  },
  progressBarContainer: {
    height: 18,
    backgroundColor: '#1F2937',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#E1C16E'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#0B1220',
    padding: 30,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#223149',
    width: '80%'
  },
  footerStatus: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  statusText: {
    fontWeight: '800',
    color: '#C7D2FE'
  }
});
