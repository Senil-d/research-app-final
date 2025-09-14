import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const clamp01to100 = (v) => {
  const n = Number(v);
  if (!isFinite(n)) return 0;
  // Support both 0–1 and 0–100 inputs
  const pct = n <= 1 ? n * 100 : n;
  return Math.max(0, Math.min(100, Math.round(pct)));
};

const prettyLabel = (k) =>
  String(k || "")
    .replace(/_/g, " ")
    .toLowerCase();

const preferredOrder = [
  "data_interpretation",
  "critical_thinking",
  "pattern_recognition",
  "statistics",
];

const QuizResultScreen = ({ route }) => {
  const {
    finalLevel = "Beginner",
    overallScore = 0,
    completionRate = 0,
    categoryScores = {},
  } = route.params || {};

  // Normalize and sort category scores
  const normalized = useMemo(() => {
    const out = {};
    Object.keys(categoryScores || {}).forEach((k) => {
      out[k] = clamp01to100(categoryScores[k]);
    });
    return out;
  }, [categoryScores]);

  const sortedKeys = useMemo(() => {
    const keys = Object.keys(normalized);
    const inPreferred = keys
      .filter((k) => preferredOrder.includes(k))
      .sort(
        (a, b) => preferredOrder.indexOf(a) - preferredOrder.indexOf(b)
      );
    const rest = keys.filter((k) => !preferredOrder.includes(k)).sort();
    return [...inPreferred, ...rest];
  }, [normalized]);

  // Create Animated values **for the actual keys we have**
  const [progressAnim] = useState(() => {
    const anims = {};
    Object.keys(normalized).forEach((k) => {
      anims[k] = new Animated.Value(0);
    });
    return anims;
  });

  // Kick off animations
  useEffect(() => {
    sortedKeys.forEach((k) => {
      const toValue = normalized[k] ?? 0;
      if (progressAnim[k]) {
        Animated.timing(progressAnim[k], {
          toValue,
          duration: 1200,
          useNativeDriver: false,
        }).start();
      }
    });
  }, [sortedKeys, normalized, progressAnim]);

  // Reusable bar
  const Bar = ({ label, score, anim }) => (
    <View style={styles.progressBlock} key={label}>
      <Text style={styles.category}>{prettyLabel(label)}</Text>
      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: anim
                ? anim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  })
                : "0%",
            },
          ]}
        />
      </View>
      <Text style={styles.percentText}>{score}%</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Your Quiz Results</Text>

        {/* Final Level Badge */}
        <View style={styles.card}>
          <Text style={styles.label}>Skill Level</Text>
          <Text style={styles.badge}>{finalLevel}</Text>
        </View>

        {/* Circular Overall Score */}
        <View style={[styles.card, styles.center]}>
          <Text style={styles.label}>Overall Score</Text>
          <AnimatedCircularProgress
            size={140}
            width={14}
            fill={clamp01to100(overallScore)}
            tintColor="#E1C16E"
            backgroundColor="#2A2A2A"
            duration={1500}
          >
            {(fill) => (
              <Text style={styles.circularText}>
                {`${Math.round(fill)}%`}
              </Text>
            )}
          </AnimatedCircularProgress>
        </View>

        {/* Completion Rate */}
        <View style={styles.card}>
          <Text style={styles.label}>Completion Rate</Text>
          <Text style={styles.value}>{clamp01to100(completionRate)}%</Text>
        </View>

        {/* Category Breakdown */}
        <View style={styles.card}>
          <Text style={styles.label}>Category Breakdown</Text>
          {sortedKeys.length === 0 ? (
            <Text style={styles.muted}>No category scores available.</Text>
          ) : (
            sortedKeys.map((k) => (
              <Bar
                key={k}
                label={k}
                score={normalized[k]}
                anim={progressAnim[k]}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuizResultScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B0B0B" },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 36, // ensures you can scroll past last card
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E1C16E",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#161616",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  center: { alignItems: "center" },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C7C7C7",
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E1C16E",
  },
  badge: {
    backgroundColor: "#E1C16E",
    color: "#0B0B0B",
    fontWeight: "bold",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  category: {
    fontSize: 15,
    color: "#C7C7C7",
    marginBottom: 6,
    textTransform: "lowercase",
  },
  progressBlock: {
    marginBottom: 14,
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
  percentText: {
    marginTop: 6,
    color: "#E1C16E",
    fontWeight: "bold",
  },
  circularText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E1C16E",
  },
  muted: {
    color: "#8A8A8A",
  },
});
