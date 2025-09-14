import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const LandMapScreen = () => {
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

        // ✅ Fetch results from backend
        const res = await axios.get("http://192.168.8.120:5050/api/results", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.results.length > 0) {
          setLatestResult(res.data.results[0]);
        } else {
          console.log("⚠️ No results found");
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
        <ActivityIndicator size="large" color="#1A73E8" />
        <Text>Loading results...</Text>
      </View>
    );
  }

  if (!latestResult) {
    return (
      <View style={styles.center}>
        <Text>No quiz results found. Please take a quiz first.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Finalise Your Skill Assesment</Text>
      <View style={styles.card}>
        <Text style={styles.label}>
         Your Specialization is {" "}
        <Text style={styles.value}>{latestResult.specialization}</Text>
        </Text>
        <Text style={styles.label}>
          Level: <Text style={styles.value}>{latestResult.level}</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default LandMapScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  value: {
    fontWeight: "400",
    color: "#1A73E8",
  },
});
