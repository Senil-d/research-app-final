import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const screenWidth = Dimensions.get("window").width;

const ResultScreen = ({ navigation }) => {
  const [latestResult, setLatestResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("⚠️ No token found");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://192.168.8.120:5050/api/results", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.results.length > 0) {
          setLatestResult(res.data.results[0]);
        }
      } catch (err) {
        console.error("API Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD93D" />
        <Text style={styles.muted}>Loading results...</Text>
      </View>
    );
  }

  if (!latestResult) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>No quiz results found. Take a quiz first </Text>
      </View>
    );
  }

  const { correctAnswers, totalQuestions, attempted, percentage, skill } = latestResult;

  const wrongAnswers = attempted - correctAnswers;
  const gotScore = (percentage / 10).toFixed(1);

  // User Level
  let userLevel = "Beginner";
  let levelEmoji = "🥉";
  if (percentage > 50 && percentage < 80) {
    userLevel = "Intermediate";
    levelEmoji = "🥈";
  } else if (percentage >= 80) {
    userLevel = "Advanced";
    levelEmoji = "🥇";
  }

  const pieData = [
    {
      name: "Correct",
      population: correctAnswers,
      color: "#4CAF50",
      legendFontColor: "#fff",
      legendFontSize: 14,
    },
    {
      name: "Wrong",
      population: wrongAnswers,
      color: "#F44336",
      legendFontColor: "#fff",
      legendFontSize: 14,
    },
    {
      name: "Unattempted",
      population: totalQuestions - attempted,
      color: "#9E9E9E",
      legendFontColor: "#fff",
      legendFontSize: 14,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>

      {/* Circular Percentage */}
      <AnimatedCircularProgress
        size={150}
        width={15}
        fill={percentage}
        tintColor="#FFD93D"
        backgroundColor="#2C2C2C"
        duration={1500}
        style={{ marginBottom: 20 }}
      >
        {(fill) => (
          <Text style={styles.circularText}>{`${Math.round(fill)}%`}</Text>
        )}
      </AnimatedCircularProgress>

      {/* Pie Chart */}
      <Text style={styles.sectionTitle}>Answer Breakdown</Text>
<View style={styles.breakdownBar}>
  <View
    style={[
      styles.correctBar,
      { flex: correctAnswers || 0 },
    ]}
  />
  <View
    style={[
      styles.wrongBar,
      { flex: wrongAnswers || 0 },
    ]}
  />
  <View
    style={[
      styles.unattemptedBar,
      { flex: totalQuestions - attempted || 0 },
    ]}
  />
</View>

{/* Legends */}
<View style={styles.legendRow}>
  <Text style={styles.legend}>🟩 Correct: {correctAnswers}</Text>
  <Text style={styles.legend}>🟥 Wrong: {wrongAnswers}</Text>
  <Text style={styles.legend}>⬜ Unattempted: {totalQuestions - attempted}</Text>
</View>
      {/* Info Cards */}
      <View style={styles.card}>
        <Text style={styles.label}>Level</Text>
        <Text style={styles.value}>
          {levelEmoji} {userLevel}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Skill Assessed</Text>
        <Text style={styles.value}>{skill || "General"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Questions</Text>
        <Text style={styles.value}>{totalQuestions}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Attempted</Text>
        <Text style={styles.value}>{attempted}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Correct Answers</Text>
        <Text style={styles.value}>{correctAnswers}</Text>
      </View>

      <Text style={styles.motivation}>
        {percentage >= 70
          ? " Awesome work! You’re mastering this skill!"
          : " Keep grinding, you’re leveling up every attempt!"}
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("LandMapScreen")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Move to Guide</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#121212",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD93D",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFD93D",
    marginTop: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C7C7C7",
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD93D",
  },
  circularText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD93D",
  },
  button: {
    backgroundColor: "#FFD93D",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: "#121212",
    fontWeight: "600",
    fontSize: 16,
  },
  motivation: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#C7C7C7",
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  muted: {
    color: "#8A8A8A",
  },

  breakdownBar: {
    flexDirection: "row",
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 12,
    width: "100%",
  },
  correctBar: {
    backgroundColor: "#4CAF50",
  },
  wrongBar: {
    backgroundColor: "#F44336",
  },
  unattemptedBar: {
    backgroundColor: "#9E9E9E",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 6,
  },
  legend: {
    color: "#C7C7C7",
    fontSize: 14,
  },  
});
