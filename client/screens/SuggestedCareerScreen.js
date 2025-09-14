import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PUBLIC_BASE_URL } from "@env";
import Header from "../components/Header";
import NavBar from "../components/NavBar";

// Career Options for Assessment
const CAREER_OPTIONS = [
  { id: 'ui_ux', name: 'UI/UX Design', riasec: ['Artistic', 'Investigative', 'Social'] },
  { id: 'game_design', name: 'Game Design', riasec: ['Artistic', 'Investigative', 'Realistic'] },
  { id: 'web_development', name: 'Web Development', riasec: ['Investigative', 'Realistic', 'Conventional'] }
];


const SuggestedCareerScreen = ({ route, navigation }) => {
  const { stream, goal, predictedCareer } = route.params;

  // Ensure array format
  const careerOptions = Array.isArray(predictedCareer)
    ? predictedCareer
    : [predictedCareer];

  const handleSelectCareer = async (career) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      // Save selected career
      await axios.post(
        `http://192.168.54.44:5050/api/career/save-selection`,
        {
          selectedCareer: career,
          stream,
          specialization: goal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get career skill info
      const res = await axios.post(
        `http://192.168.54.44:5050/api/career/career-skills`,
        { career },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigation.navigate("Career", { skillInfo: res.data });
    } catch (err) {
      console.error("❌ Error saving or fetching skill info:", err.message);
      Alert.alert("Error", "Could not process selection.");
    }
  };

  const handleStartAssessment = (career) => {
    // Navigate to CareerAssessment with selected career
    navigation.navigate("careerass", { 
      selectedCareer: career,
      stream,
      goal
    });
  };

  return (
    <>
    <Header/>
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.headerBox}>
        <Text style={styles.title}>Suggested Careers</Text>
        <Text style={styles.subText}>Stream: {stream}</Text>
        <Text style={styles.subText}>Chosen Goal: {goal}</Text>
      </View>

      {/* Predicted Career Cards */}
      <Text style={styles.label}>AI Predicted Careers:</Text>
      {careerOptions.map((career, index) => (
        <TouchableOpacity
          key={index}
          style={styles.careerCard}
          activeOpacity={0.85}
          onPress={() => handleSelectCareer(career)}
        >
          <Text style={styles.careerText}>{career}</Text>
        </TouchableOpacity>
      ))}

      {/* Career Assessment Options */}
      <Text style={[styles.label, { marginTop: 30 }]}>Or choose a career path for skill assessment:</Text>
      {CAREER_OPTIONS.map((career) => (
        <TouchableOpacity
          key={career.id}
          style={styles.assessmentCard}
          activeOpacity={0.85}
          onPress={() => handleStartAssessment(career)}
        >
          <Text style={styles.assessmentCardTitle}>{career.name}</Text>
          <Text style={styles.assessmentCardSubtitle}>
            RIASEC Types: {career.riasec.join(', ')}
          </Text>
          <Text style={styles.assessmentCardAction}>📝 Start Assessment</Text>
        </TouchableOpacity>
      ))}

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Move Back</Text>
      </TouchableOpacity>
    </ScrollView>
    <NavBar/>
    </>
    
  );
};

export default SuggestedCareerScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: "#070C14", 
    flexGrow: 1,
  },

  /* Header box (dark card with gold accent) */
  headerBox: {
    backgroundColor: "#0B1220",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    borderWidth: 1.5,
    borderColor: "#223149",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#E1C16E", // gold title
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: "#C7D2FE", // soft indigo
    fontWeight: "400",
  },

  /* Section label */
  label: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
    color: "#C7D2FE",
  },

  /* Career card → dark tile with subtle border and hover feel */
  careerCard: {
    backgroundColor: "#0e1b2c",
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#223149",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 5,
  },
  careerText: {
    fontSize: 17,
    fontWeight: "900",
    color: "#E5E7EB",
    textAlign: "center",
  },

  /* Assessment card → distinct style for career assessment options */
  assessmentCard: {
    backgroundColor: "#1e293b",
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#4338ca",
    shadowColor: "#4338ca",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  assessmentCardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#E1C16E",
    textAlign: "center",
    marginBottom: 6,
  },
  assessmentCardSubtitle: {
    fontSize: 13,
    color: "#C7D2FE",
    textAlign: "center",
    marginBottom: 8,
  },
  assessmentCardAction: {
    fontSize: 14,
    color: "#4cc9f0",
    textAlign: "center",
    fontWeight: "700",
  },

  /* Back button → gold primary */
  backButton: {
    marginTop: 24,
    backgroundColor: "#E1C16E", // gold
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: "#0b1220",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "900",
  },
});

