import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { EXPO_PUBLIC_BASE_URL } from '@env';
import Header from '../components/Header';
import NavBar from '../components/NavBar';

const { width } = Dimensions.get('window');

const HyUserScreen = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const navigation = useNavigation();

  const fetchUsername = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setUsername('Guest');
        setLoading(false);
        return;
      }
      const response = await axios.get(`http://192.168.8.120:5050/api/auth/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsername(response.data.username);
    } catch (error) {
      console.error('Failed to fetch user:', error.message);
      setUsername('Unknown');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

    fetchUsername();
  }, []);

  return (
  <>
  <Header/>
  <View style={styles.container}>
      
      {loading ? (
        <ActivityIndicator size="large" color="#083c5d" />
      ) : (
        <>
        
          <Animatable.View animation="bounceIn" duration={1500}>
            
          </Animatable.View>
          <Animatable.Text animation="fadeIn" delay={800} style={styles.text}>
            {greeting}, {username}!
          </Animatable.Text>
          <Animatable.Text animation="fadeIn" delay={1000} style={styles.subtitle}>
            Welcome to Student Guide
          </Animatable.Text>
          <Animatable.View animation="fadeInUp" delay={1200}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('CareerGoalScreen')}
            >
              <Text style={styles.buttonText}>Go to Next Page</Text>
            </TouchableOpacity>
          </Animatable.View>
        </>
      )}
    </View>
   <NavBar/>
  </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  lottie: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 10,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#083c5d',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 4,
    borderColor: '#fff',
    borderWidth: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HyUserScreen;