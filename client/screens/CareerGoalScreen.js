import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Navbar from '../components/NavBar';

const { width: SCREEN_W } = Dimensions.get('window');

const streams = ['Mathematics', 'Biological Science', 'Commerce', 'Arts', 'Technology'];
const goals = [
  'Information Technology',
  'Computer Systems & Network Engineering',
  'Software Engineering',
  'Information Systems Engineering',
  'Cyber Security',
  'Interactive Media',
  'Data Science',
];

const TOTAL_STEPS = 3;

export default function CareerGoalScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [stream, setStream] = useState('');
  const [goal, setGoal] = useState('');
  const [knowledge, setKnowledge] = useState(50);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);
  const cardRef = useRef(null);

  const progress = (step + 1) / TOTAL_STEPS;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: SCREEN_W * step, animated: true });
    }
    if (cardRef.current) cardRef.current.fadeInUp(350);
  }, [step]);

  const canNext = () => {
    if (step === 0) return !!stream;
    if (step === 1) return !!goal;
    return true;
  };

  const onNext = async () => {
    if (!canNext()) {
      return Alert.alert('Complete this step', 'Please make a selection to continue.');
    }
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else await onSubmit();
  };

  const onBack = () => {
    if (step === 0 || loading) return;
    setStep((s) => s - 1);
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return Alert.alert('Unauthorized', 'Please log in again.');
      }

      const res = await axios.post(
        `http://192.168.8.105:5050/api/career/suggest-career`,
        { stream, specialization: goal, knowledge },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const predictedCareer = res.data.career;
      setLoading(false);
      navigation.navigate('SuggestedCareerScreen', { stream, goal, knowledge, predictedCareer });
    } catch (e) {
      setLoading(false);
      console.error('Prediction failed:', e?.message);
      Alert.alert('Error', 'Could not get suggestion. Try again later.');
    }
  };

  const Dot = ({ i }) => {
    const active = i === step;
    const done = i < step;
    return (
      <View style={[styles.dot, active && styles.dotActive, done && styles.dotDone]} />
    );
  };

  const Header = () => (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Skill To Career</Text>
        <View style={styles.currency}>
          <Text style={styles.coin}>🪙</Text>
          <Text style={styles.coinText}>{Math.round(progress * 105)}</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.dotsRow}>
        {[0, 1, 2].map((i) => <Dot key={i} i={i} />)}
      </View>
    </View>
  );

  const StreamSlide = () => (
    <ScrollView>
      <Animatable.View ref={cardRef} style={[styles.card, { width: SCREEN_W - 40 }]}>
        <Text style={styles.cardTitle}>Select your A/L Stream</Text>
        <View style={styles.grid}>
          {streams.map((item) => {
            const selected = stream === item;
            return (
              <Animatable.View
                key={item}
                animation={selected ? 'pulse' : undefined}
                duration={900}
                iterationCount={selected ? 'infinite' : 1}
              >
                <TouchableOpacity
                  style={[styles.tile, selected && styles.tileSelected]}
                  onPress={() => setStream(item)}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.tileText, selected && styles.tileTextSelected]}>{item}</Text>
                </TouchableOpacity>
              </Animatable.View>
            );
          })}
        </View>
        {!stream && <Text style={styles.hint}>Pick one to unlock the next chapter ▶</Text>}
      </Animatable.View>
    </ScrollView>
  );

  const GoalSlide = () => (
    <ScrollView>
      <Animatable.View ref={cardRef} style={[styles.card, { width: SCREEN_W - 40 }]}>
        <Text style={styles.cardTitle}>Choose your Career Goal</Text>
        <View style={styles.grid}>
          {goals.map((item) => {
            const selected = goal === item;
            return (
              <Animatable.View key={item} animation={selected ? 'jello' : undefined} duration={700}>
                <TouchableOpacity
                  style={[styles.tile, selected && styles.tileSelected]}
                  onPress={() => setGoal(item)}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.tileText, selected && styles.tileTextSelected]} numberOfLines={2}>
                    {item}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            );
          })}
        </View>
        {!goal && <Text style={styles.hint}>Choose a goal to continue ▶</Text>}
      </Animatable.View>
    </ScrollView>
  );

  // FIXED KnowledgeSlide (receives props + gesture safe)
  const KnowledgeSlide = ({ knowledge, setKnowledge, scrollRef }) => {
    const [scrollEnabled, setScrollEnabled] = useState(true);
  
    useEffect(() => {
      if (scrollRef?.current) {
        scrollRef.current.setNativeProps({ scrollEnabled });
      }
    }, [scrollEnabled]);
  
    return (
      <Animatable.View style={[styles.card, { width: SCREEN_W - 40 }]}>
        <Text style={styles.cardTitle}>Rate your Knowledge</Text>
        <Text style={styles.meterText}>
          Readiness: <Text style={styles.meterValue}>{knowledge}%</Text>
        </Text>
  
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={knowledge}
          onValueChange={(v) => setKnowledge(Math.round(v))}
          minimumTrackTintColor="#E1C16E"
          maximumTrackTintColor="#2C3E50"
          thumbTintColor="#E1C16E"
          onTouchStart={() => setScrollEnabled(false)}
          onTouchEnd={() => setScrollEnabled(true)}
        />
  
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeEmoji}>
              {knowledge >= 70 ? "🤗" : knowledge >= 40 ? "☹️" : "🥺"}
            </Text>
            <Text style={styles.badgeText}>
              {knowledge >= 70
                ? "Great"
                : knowledge >= 40
                ? "Medium"
                : "Lower"}
            </Text>
          </View>
        </View>
      </Animatable.View>
    );
  };
  

  return (
    <>
      <Navbar />
      <View style={styles.screen}>
        <View style={styles.bgOrbA} />
        <View style={styles.bgOrbB} />

        <Header />

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          <View style={{ width: SCREEN_W, alignItems: 'center' }}>
            <StreamSlide />
          </View>
          <View style={{ width: SCREEN_W, alignItems: 'center' }}>
            <GoalSlide />
          </View>
          <View style={{ width: SCREEN_W, alignItems: 'center' }}>
            {/* Pass props here */}
            <KnowledgeSlide
              knowledge={knowledge}
              setKnowledge={setKnowledge}
              scrollRef={scrollRef}
            />
          </View>
        </ScrollView>

        {/* Nav */}
        <View style={styles.navRow}>
          <TouchableOpacity
            onPress={onBack}
            disabled={step === 0 || loading}
            style={[styles.navBtn, styles.navGhost, (step === 0 || loading) && styles.disabled]}
            activeOpacity={0.85}
          >
            <Text style={styles.navGhostText}>◀ Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNext}
            disabled={!canNext() || loading}
            style={[styles.navBtn, styles.navPrimary, (!canNext() || loading) && styles.disabled]}
            activeOpacity={0.9}
          >
            <Text style={styles.navPrimaryText}>
              {step < TOTAL_STEPS - 1 ? 'Next ▶' : loading ? 'Submitting…' : 'Start ▶'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const ORB = 300;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#070C14' },
  bgOrbA: {
    position: 'absolute', top: -100, right: -80, width: ORB, height: ORB, borderRadius: ORB,
    backgroundColor: '#0ea5e9', opacity: 0.09,
  },
  bgOrbB: {
    position: 'absolute', bottom: -105, left: -80, width: ORB, height: ORB, borderRadius: ORB,
    backgroundColor: '#10b981', opacity: 0.08,
  },
  header: { paddingHorizontal: 20, paddingTop: 25, paddingBottom: 8 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { color: '#E1C16E', fontSize: 20, fontWeight: '900' },
  currency: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  coin: { fontSize: 16 },
  coinText: { color: '#E1C16E', fontWeight: '800' },
  progressBar: { height: 10, borderRadius: 999, backgroundColor: '#1F2937', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#E1C16E' },
  dotsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  dot: { width: 10, height: 10, borderRadius: 10, backgroundColor: '#1f2b40' },
  dotActive: { backgroundColor: '#E1C16E' },
  dotDone: { backgroundColor: '#E1C16E' },
  card: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#0B1220',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  cardTitle: { fontSize: 16, fontWeight: '900', color: '#E5E7EB', marginBottom: 30, marginTop: 20, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  tile: {
    width: (SCREEN_W - 40 - 40),
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#223149',
    backgroundColor: '#0e1b2c',
  },
  tileSelected: {
    borderColor: '#E1C16E',
    shadowColor: '#E1C16E',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  tileText: { fontSize: 15, fontWeight: '800', color: '#C7D2FE', textAlign: 'center' },
  tileTextSelected: { color: '#E1C16E' },
  hint: { marginTop: 4, color: '#9CA3AF', fontWeight: '700', textAlign: 'center' },
  meterText: { color: '#9CA3AF', fontWeight: '800', marginBottom: 6 },
  meterValue: { color: '#E1C16E' },
  slider: { width: '100%', height: 40 },
  badges: { marginTop: 14, flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  badge: {
    backgroundColor: '#0e1b2c',
    width:'100%',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  badgeEmoji: { fontSize: 18, marginBottom: 4 },
  badgeText: { color: '#CFFAFE', fontWeight: '800', fontSize: 12 },
  navRow: { flexDirection: 'row', gap: 12, padding: 20, paddingTop: 10 },
  navBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  navGhost: { backgroundColor: '#0e1b2c', borderWidth: 2, borderColor: '#E1C16E' },
  navGhostText: { color: '#E5E7EB', fontSize: 15, fontWeight: '900' },
  navPrimary: { backgroundColor: '#E1C16E' },
  navPrimaryText: { color: '#0b1220', fontSize: 16, fontWeight: '900' },
  disabled: { opacity: 0.5 },
});
