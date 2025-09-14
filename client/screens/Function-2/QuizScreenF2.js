import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable"; // ✅ Animations

const QuizScreenF2 = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔥 Animated progress value
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://192.168.8.105:5050/api/quiz-f2"
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const progress = ((currentIndex + 1) / questions.length) * 100;

      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [currentIndex, questions.length]);

  const handleSelect = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questions[currentIndex].id]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitAnswers();
    }
  };

  const submitAnswers = async () => {
    try {
      const response = await axios.post(
        "http://192.168.8.105:5050/api/quiz-f2/evaluate-f2",
        { answers: selectedAnswers }
      );

      navigation.navigate("QuizResultScreen", {
        finalLevel: response.data.final_level,
        overallScore: response.data.overall_score,
        completionRate: response.data.completion_rate,
        categoryScores: response.data.skill_profile,
      });
    } catch (error) {
      console.error("Evaluation failed:", error);
    }
  };

  if (loading)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E1C16E" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );

  if (!questions.length || !questions[currentIndex]) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>No questions available</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const options = currentQuestion.options || [];
  const isAnswered = !!selectedAnswers[currentQuestion.id];

  return (
    <View style={styles.container}>
      {/* Category Heading with Animation */}
      <Animatable.Text
        key={currentQuestion.category + currentIndex} // re-animates each time
        animation="fadeInDown"
        duration={600}
        style={styles.categoryHeading}
      >
        Category: {currentQuestion.category?.replace("_", " ")}
      </Animatable.Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Question {currentIndex + 1} / {questions.length}
        </Text>
      </View>

      {/* Question Card */}
      <View style={styles.card}>
        <Text style={styles.questionText}>
          {currentIndex + 1}. {currentQuestion.question_text}
        </Text>

        {/* Options */}
        <FlatList
          data={options}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={[
                styles.optionBox,
                selectedAnswers[currentQuestion.id] === item &&
                  styles.selectedOptionBox,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedAnswers[currentQuestion.id] === item &&
                    styles.selectedOptionText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Navigation Button */}
      <TouchableOpacity
        style={[styles.navButton, !isAnswered && styles.navButtonDisabled]}
        onPress={handleNext}
        disabled={!isAnswered}
      >
        <Text style={styles.navButtonText}>
          {currentIndex === questions.length - 1 ? "Submit" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuizScreenF2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0B",
    padding: 20,
  },
  loadingText: {
    color: "#C7C7C7",
    textAlign: "center",
    marginTop: 12,
  },
  categoryHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E1C16E",
    textAlign: "center",
    marginTop: 120,
    marginBottom: 50,
    textTransform: "capitalize",
  },
  progressContainer: {
    marginBottom: 80,
  },
  progressBarBackground: {
    height: 14,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#E1C16E",
    borderRadius: 8,
  },
  progressText: {
    color: "#C7C7C7",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
  card: {
    backgroundColor: "#161616",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E1C16E",
    marginBottom: 16,
    textAlign: "center",
  },
  optionBox: {
    backgroundColor: "#1C1C1C",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
  },
  selectedOptionBox: {
    backgroundColor: "#E1C16E",
    borderColor: "#E1C16E",
  },
  optionText: {
    color: "#C7C7C7",
    textAlign: "center",
  },
  selectedOptionText: {
    color: "#0B0B0B",
    fontWeight: "bold",
  },
  navButton: {
    backgroundColor: "#E1C16E",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  navButtonDisabled: {
    backgroundColor: "#3A3A3A",
  },
  navButtonText: {
    color: "#0B0B0B",
    fontWeight: "bold",
    fontSize: 16,
  },
});
