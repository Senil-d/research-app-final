import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, AccessibilityInfo } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion accessibility setting
    AccessibilityInfo.isReduceMotionEnabled?.().then((enabled) => {
      setReduceMotion(enabled);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      
      <Animatable.Text
        animation={reduceMotion ? undefined : 'fadeInDown'}
        duration={800}
        style={styles.title}
      >
        LuxeVista Quiz App
      </Animatable.Text>
      <Animatable.View
        animation={reduceMotion ? undefined : 'pulse'}
        iterationCount="infinite"
        duration={2000}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Quiz')}
          activeOpacity={0.8}
          accessibilityLabel="Start Quiz Button"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Start Quiz</Text>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#121212', // Solid dark background
  },
  lottie: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 20,
  },
  title: {
    fontSize: 34, // Aligned with other screens
    fontFamily: 'Inter-Regular', // Digital font for techy vibe
    color: '#00D4B4', // Vibrant cyan
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
    textShadowColor: 'rgba(0, 212, 180, 0.3)', // Subtle glow
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00D4B4', // Vibrant cyan
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#00D4B4', // Glow effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#121212', // Dark text for contrast
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
  },
});