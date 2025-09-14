// screens/LeadershipQuizScreen.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import LeadershipQuestionCard from '../components/LeadershipQuestionCard';
import RoleplayDialog from '../components/RoleplayDialog';
import DragAndDropSorter from '../components/DragAndDropSorter';
import TimedProgressCircle from '../components/TimedProgressCircle';
import MicrocopyBanner from '../components/MicrocopyBanner';
import QuitConfirmationModal from '../components/QuitConfirmationModal';
import LottieView from 'lottie-react-native';

const API_BASE = 'http://localhost:5050/api/leadership';

const LeadershipQuizScreen = ({ navigation, route }) => {
  const { userId, career } = route.params;
  const [sessionToken, setSessionToken] = useState(null);
  const [currentTrait, setCurrentTrait] = useState(null);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quitModal, setQuitModal] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    startSession();
  }, []);

  const startSession = async () => {
    try {
      const res = await axios.post(`${API_BASE}/start`, { user_id: userId, career });
      setSessionToken(res.data.session_token);
      setCurrentTrait(res.data.current_trait);
      setQuestion(res.data.first_question);
    } catch (err) {
      Alert.alert('Error', 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answerPayload) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/submit-answer`, answerPayload);
      if (res.data.completed) {
        const summary = await axios.get(`${API_BASE}/summary/${sessionToken}`);
        navigation.replace('LeadershipResultScreen', { summary: summary.data });
      } else {
        setQuestion(res.data);
        setCurrentTrait(res.data.trait);
      }
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionComponent = () => {
    switch (question?.type) {
      case 'roleplay':
        return <RoleplayDialog question={question} onSubmit={handleAnswer} />;
      case 'drag_drop':
        return <DragAndDropSorter question={question} onSubmit={handleAnswer} />;
      case 'timed':
        return <TimedProgressCircle question={question} onSubmit={handleAnswer} duration={30} />;
      case 'msq':
      default:
        return <LeadershipQuestionCard question={question} onSubmit={handleAnswer} />;
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1A73E8" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MicrocopyBanner trait={currentTrait} />
      {renderQuestionComponent()}

      <TouchableOpacity
        style={styles.quitButton}
        onPress={() => setQuitModal(true)}
      >
        <Text style={styles.quitText}>Quit</Text>
      </TouchableOpacity>

      <QuitConfirmationModal
        visible={quitModal}
        onCancel={() => setQuitModal(false)}
        onConfirm={() => {
          setQuitModal(false);
          navigation.goBack();
        }}
      />

      <LottieView
        ref={animationRef}
        source={require('../assets/owl-helper.json')}
        autoPlay
        loop
        style={styles.avatar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quitButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#FF5252',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  quitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  avatar: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 100,
    height: 100,
  },
});

export default LeadershipQuizScreen;
