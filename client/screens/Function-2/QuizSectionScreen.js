
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ProgressBarAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CATEGORY_ORDER = ['data_interpretation', 'pattern_recognition', 'case_study'];

const QuizSectionScreen = () => {
  const router = useRouter();
  const { category, answersSoFar = '{}' } = useLocalSearchParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(true);
  const [allAnswers, setAllAnswers] = useState(JSON.parse(answersSoFar));

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://192.168.8.105:5050/api/quiz-f2');
      const filtered = response.data.filter(q => q.category === category);
      setQuestions(filtered.slice(0, 5));
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (option) => {
    setSelected(prev => ({
      ...prev,
      [questions[currentIndex].id]: option
    }));
  };

  const handleNext = async () => {
    const currentId = questions[currentIndex]?.id;

    if (!selected[currentId]) {
      Alert.alert("Select an answer", "Please choose an option before proceeding.");
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const updatedAnswers = { ...allAnswers, ...selected };
      const nextCategoryIndex = CATEGORY_ORDER.indexOf(category) + 1;

      if (nextCategoryIndex < CATEGORY_ORDER.length) {
        router.push({
          pathname: '/QuizSectionScreen',
          params: {
            category: CATEGORY_ORDER[nextCategoryIndex],
            answersSoFar: JSON.stringify(updatedAnswers),
          },
        });
      } else {
        // ✅ Submit to backend after last category
        try {
          const res = await axios.post('http://192.168.8.105:5050/api/quiz-f2/evaluate-f2', {
            answers: updatedAnswers,
          });
        
          console.log('✅ Evaluation Response:', res.data);
        
          const { overall_score, completion_rate, skill_profile, final_level } = res.data;
        
          // Navigation
          router.push({
            pathname: '/QuizResultScreen',
            params: {
              overallScore: overall_score.toString(),
              completionRate: completion_rate.toString(),
              categoryScores: JSON.stringify(skill_profile),
              level: final_level,
            },
          });
        } catch (error) {
          console.error('❌ Evaluation failed:', error?.response?.data || error.message);
          Alert.alert("Error", "Something went wrong while submitting your answers.");
        }
        
      }
    }
  };

  if (loading || !questions[currentIndex]) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const q = questions[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {category.replaceAll('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Text>
      <Text style={styles.progressText}>Question {currentIndex + 1} of {questions.length}</Text>
      <ProgressBarAndroid
        styleAttr="Horizontal"
        progress={(currentIndex + 1) / questions.length}
        color="#4CAF50"
      />

      <Text style={styles.question}>{q.question_text}</Text>

      {q.options.map((opt, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.option,
            selected[q.id] === opt && styles.selectedOption
          ]}
          onPress={() => handleSelect(opt)}
        >
          <Text>{opt}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextText}>
          {currentIndex === questions.length - 1 && CATEGORY_ORDER.indexOf(category) === CATEGORY_ORDER.length - 1
            ? 'Finish & Submit'
            : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuizSectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  heading: {
    fontSize: 22, fontWeight: 'bold', marginBottom: 10
  },
  progressText: {
    fontSize: 14, marginBottom: 5
  },
  question: {
    fontSize: 18, fontWeight: '600', marginVertical: 20
  },
  option: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, marginVertical: 6
  },
  selectedOption: {
    backgroundColor: '#D0F0C0', borderColor: '#4CAF50'
  },
  nextBtn: {
    marginTop: 30, backgroundColor: '#4CAF50', padding: 15, borderRadius: 8
  },
  nextText: {
    color: '#fff', fontSize: 16, textAlign: 'center'
  }
});
