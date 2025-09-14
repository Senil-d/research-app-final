// components/TimedProgressCircle.js

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function TimedProgressCircle({ duration = 15, onComplete }) {
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useRef(new Animated.Value(0)).current;
  const [secondsLeft, setSecondsLeft] = useState(duration);

  useEffect(() => {
    let interval;

    // Animate progress circle
    Animated.timing(progress, {
      toValue: 1,
      duration: duration * 1000,
      useNativeDriver: true,
    }).start(() => {
      onComplete?.();
    });

    // Countdown text
    interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, circumference],
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#E6E6E6"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke="#1A73E8"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}, ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.timerTextContainer}>
        <Text style={styles.timerText}>{secondsLeft}s</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginVertical: 16,
  },
  timerTextContainer: {
    position: 'absolute',
    top: 35,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
});
