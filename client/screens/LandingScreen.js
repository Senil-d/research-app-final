import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, AccessibilityInfo } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import LoadingScreen from './LoadingScreen';

const { width } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [reduceMotion, setReduceMotion] = useState(false);
  const titleText = "Student Guide";

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then((enabled) => {
      setReduceMotion(enabled);
    });

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < titleText.length) {
        setDisplayedText(titleText.slice(0, index + 1));
        index++;
      } else {
        setTimeout(() => {
          setDisplayedText('');
          index = 0;
        }, 3000);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  const handleNavigate = (screen) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate(screen);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Animatable.View animation="fadeOut" duration={500}>
          <LoadingScreen />
        </Animatable.View>
      ) : (
        <>
          <Animatable.View animation={reduceMotion ? undefined : 'bounceIn'} duration={1500}>
            <LottieView
              source={require('../assets/student.json')}
              autoPlay={!reduceMotion}
              loop
              style={styles.lottie}
            />
          </Animatable.View>
          <View style={styles.titleContainer}>
            {displayedText.split('').map((letter, index) => (
              <Animatable.Text
                key={`${letter}-${index}`}
                animation={reduceMotion ? undefined : 'fadeIn'}
                duration={300}
                delay={index * 150}
                style={styles.title}
              >
                {letter}
              </Animatable.Text>
            ))}
            <Animatable.Text
              animation={
                reduceMotion
                  ? undefined
                  : {
                      0: { opacity: 1 },
                      0.5: { opacity: 0 },
                      1: { opacity: 1 },
                    }
              }
              iterationCount="infinite"
              duration={500}
              style={styles.cursor}
            >
              .. ..
            </Animatable.Text>
          </View>
          <Animatable.Text animation="fadeIn" delay={800} style={styles.subtitle}>
            Discover your career. Level up your skills.
          </Animatable.Text>
          <Animatable.View animation="fadeInUp" delay={1200} style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.getStartedBtn}
              onPress={() => handleNavigate('WelcomeGuideScreen')}
              activeOpacity={0.8}
              accessibilityLabel="Get Started Button"
              accessibilityRole="button"
            >
              <Text style={styles.btnText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => handleNavigate('CareerGoalScreen')}
              activeOpacity={0.8}
              accessibilityLabel="Check Your Path Free Button"
              accessibilityRole="button"
            >
              <Text style={styles.secondaryText}>Check Your Path Free</Text>
            </TouchableOpacity>
          </Animatable.View>
        </>
      )}
    </SafeAreaView>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212', // Solid dark background
  },
  lottie: {
    width: width * 0.8,
    height: width * 0.8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Digital-7 Mono',
    fontWeight: 'bold',
    color: '#E1C16E', // Vibrant cyan for title
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
    textShadowColor: 'rgba(0, 212, 180, 0.3)', // Subtle glow
    textAlign: 'center',
  },
  cursor: {
    fontSize: 34,
    fontFamily: 'Digital-7 Mono',
    fontWeight: 'bold',
    color: '#E1C16E', // Matching cyan for cursor
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#E0E0E0', // Light gray for readability
    marginVertical: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    gap: 20,
    marginTop: 30,
  },
  getStartedBtn: {
    backgroundColor: '#E1C16E', // Vibrant cyan for primary button
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#E1C16E', // Glow effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#121212', 
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
  },
  secondaryBtn: {
    borderColor: '#E1C16E', 
    borderWidth: 3,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  secondaryText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#E1C16E', 
    fontWeight: '600',
  },
});