// screens/Career.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import Header from "../components/Header";
import NavBar from "../components/NavBar";

/** Simple typewriter without extra libraries */
const Typewriter = ({ text, speed = 45, style, onDone }) => {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setOut((prev) => prev + text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(id);
        onDone && setTimeout(onDone, 200);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, onDone]);
  return <Text style={style}>{out}</Text>;
};

const Spark = () => (
  <Animatable.Text
    animation="swing"
    iterationCount="infinite"
    duration={1600}
    style={styles.spark}
  >
    
  </Animatable.Text>
);

/** Treasure Chest Reveal for the justification */
const JustificationChest = ({ text }) => {
  const [opened, setOpened] = useState(false);
  const chestRef = useRef(null);

  const handleOpen = async () => {
    if (opened) return;
    // fun shake before open
    await chestRef.current?.shake(500);
    setOpened(true);
  };

  return (
    <View style={{ marginTop: 12 }}>
      <Text style={styles.justTitle}>See justification</Text>

      {/* Chest button */}
      <Animatable.View
        ref={chestRef}
        animation="fadeInUp"
        duration={500}
        style={styles.chestWrap}
      >
        <TouchableOpacity activeOpacity={0.9} onPress={handleOpen}>
          <View style={styles.chestInner}>
            <Text style={styles.chestEmoji}>{opened ? "🧰" : "🧳"}</Text>
            <Text style={styles.chestHint}>
              {opened ? "Loot revealed!" : "Tap to open the chest"}
            </Text>
          </View>
        </TouchableOpacity>
      </Animatable.View>

      {/* Star burst when opened */}
      {opened && (
        <>
          <Animatable.Text
            animation="bounceIn"
            duration={600}
            style={styles.xpPopup}
          >
            ✨ +50 XP
          </Animatable.Text>

          {/* simple star particles */}
          <View pointerEvents="none">
            <Animatable.Text
              animation={{ from: { opacity: 0, translateY: 0 }, to: { opacity: 1, translateY: -18 } }}
              duration={500}
              style={[styles.star, { left: 24 }]}
            >
              ✨
            </Animatable.Text>
            <Animatable.Text
              animation={{ from: { opacity: 0, translateY: 0 }, to: { opacity: 1, translateY: -26 } }}
              delay={80}
              duration={560}
              style={[styles.star, { right: 18 }]}
            >
              ✨
            </Animatable.Text>
            <Animatable.Text
              animation={{ from: { opacity: 0, translateY: 0 }, to: { opacity: 1, translateY: -22 } }}
              delay={140}
              duration={520}
              style={[styles.star, { left: 70 }]}
            >
              ✨
            </Animatable.Text>
          </View>
        </>
      )}

      {/* Justification body */}
      {opened && (
        <Animatable.View
          animation="zoomIn"
          duration={520}
          style={styles.justificationBox}
        >
          <Text style={styles.justification}>{text}</Text>
        </Animatable.View>
      )}
    </View>
  );
};

const Career = () => {
  const { skillInfo } = useRoute().params;
  const navigation = useNavigation();

  // Reveal stages for header text
  const [stage, setStage] = useState(0);

  const skills = useMemo(
    () => Object.entries(skillInfo["Required Skills"] || {}),
    [skillInfo]
  );

  useEffect(() => {
    if (stage === 1) setTimeout(() => setStage(2), 500);
    if (stage === 2) setTimeout(() => setStage(3), 350);
  }, [stage]);

  const handleSkillPress = (skill, value) => {
    if (skill === "Problem-Solving") {
      navigation.navigate("Quiz", {
        skillName: skill,
        skillValue: value,
        career: skillInfo.career,
      });
    } else if (skill === "Analytical") {
      navigation.navigate("QuizF2", {
        skillName: skill,
        skillValue: value,
        career: skillInfo.career,
      });
    } else if (skill === "Leadership") {
      navigation.navigate("LeadershipQuiz", {
        career: skillInfo.career,
      });
    } else {
      Alert.alert("Not Available", `Quiz for "${skill}" is not yet available.`);
    }
  };

  return (
    <>
      <Header />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <Animatable.View
          animation="bounceInDown"
          duration={650}
          style={styles.headerCard}
        >
          <View style={styles.introRow}>
            {stage === 0 ? (
              <Typewriter
                text="You choose, "
                speed={48}
                style={styles.introText}
                onDone={() => setStage(1)}
              />
            ) : (
              <Text style={styles.introText}>You choose, </Text>
            )}

            {stage >= 1 && (
              <Animatable.Text
                animation="flipInY"
                duration={600}
                style={styles.introCareer}
              >
                {skillInfo.career}
              </Animatable.Text>
            )}
            <Spark />
          </View>

          {stage >= 2 && (
            <Typewriter
              text="You want to improve below skills"
              speed={36}
              style={styles.subtitle}
            />
          )}
        </Animatable.View>

        {/* Skills */}
        {stage >= 3 && (
          <View style={styles.skillContainer}>
            {skills.map(([skill, value], idx) => (
              <Animatable.View
                key={skill}
                animation="zoomInUp"
                delay={idx * 90}
                duration={520}
                style={[
                  styles.skillCard,
                  { transform: [{ rotateZ: idx % 2 ? "-0.6deg" : "0.6deg" }] },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={() => handleSkillPress(skill, value)}
                >
                  <View style={styles.skillHeader}>
                    <Text style={styles.skillText}>{skill}</Text>
                    <Animatable.Text
                      animation="tada"
                      iterationCount={1}
                      delay={idx * 90 + 200}
                      style={styles.skillValue}
                    >
                      {value}/10
                    </Animatable.Text>
                  </View>

                  <View style={styles.progressBarBackground}>
                    <Animatable.View
                      animation={{
                        from: { width: "0%" },
                        to: { width: `${(value / 10) * 100}%` },
                      }}
                      easing="ease-out-back"
                      duration={800}
                      style={styles.progressBarFill}
                    />
                  </View>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        )}

        {/* Gamified Justification: treasure chest */}
        {stage >= 3 && <JustificationChest text={skillInfo.Justification} />}
      </ScrollView>
      <NavBar />
    </>
  );
};

export default Career;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#070C14",
    flexGrow: 1,
  },

  /* Header card */
  headerCard: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 14,
  
  },
  introRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  introText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#E5E7EB",
  },
  introCareer: {
    fontSize: 20,
    fontWeight: "900",
    color: "#E1C16E", // bold gold career
  },
  spark: {
    marginLeft: 6,
    fontSize: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 10,
    color: "#C7D2FE",
  },

  /* Skills */
  skillContainer: {
    flexDirection: "column",
    gap: 12,
    marginTop: 6,
  },
  skillCard: {
    backgroundColor: "#0e1b2c",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#223149",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
    marginBottom: 10,
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  skillText: {
    fontSize: 17,
    fontWeight: "900",
    color: "#E5E7EB",
  },
  skillValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#E1C16E",
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#1F2937",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#E1C16E",
    borderRadius: 999,
  },

  /* Treasure chest */
  justTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
    color: "#C7D2FE",
  },
  chestWrap: {
    backgroundColor: "#0B1220",
    borderWidth: 1.5,
    borderColor: "#223149",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  chestInner: { alignItems: "center", gap: 6 },
  chestEmoji: { fontSize: 38 },
  chestHint: { color: "#CFFAFE", fontWeight: "700" },

  xpPopup: {
    position: "absolute",
    right: 14,
    top: -8,
    backgroundColor: "#122036",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2a3d5c",
    color: "#E1C16E",
    fontWeight: "900",
    fontSize: 12,
  },
  star: {
    position: "absolute",
    top: 0,
    fontSize: 14,
  },

  justificationBox: {
    backgroundColor: "#0B1220",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#223149",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  justification: {
    fontSize: 15,
    color: "#E5E7EB",
    fontStyle: "italic",
  },
});
