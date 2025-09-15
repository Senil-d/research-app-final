import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import LoadingScreen from './LoadingScreen';
import { BASE_URL } from '../config/apiConfig';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Missing Fields', 'Please enter both username and password');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        username,
        password,
      });
      const { token, user } = res.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('HyUserScreen', { user });
      }, 500);
    } catch (err) {
      setLoading(false);
      console.error('Login error:', err.message);
      Alert.alert('Login Failed', err.response?.data?.message || 'Something went wrong. Try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: null })}
    >
      {loading ? (
        <LoadingScreen />
      ) : (
        <Animatable.View animation="fadeInUp" delay={300} style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to Student Guide</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#ccc"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>
              Don't have an account? <Text style={styles.linkBold}>Register</Text>
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  card: {
    backgroundColor: '#000000',
    padding: 30,
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 6,
    borderColor: '#E1C16E',
    borderWidth: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E1C16E',
    marginBottom: 26,
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 20,
  },
  input: {
    width: 280,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    marginVertical: 10,
    borderColor: '#E1C16E',
    borderWidth: 2,
  },
  loginButton: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 20,
    elevation: 4,
    borderColor: '#E1C16E',
    borderWidth: 2,
  },
  loginButtonText: {
    color: '#E1C16E',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    marginTop: 15,
    fontSize: 14,
    color: '#eee',
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#E1C16E',
  },
});