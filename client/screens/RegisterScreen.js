import axios from 'axios';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post(`http://192.168.8.105:5050/api/auth/register`, {
        username,
        email,
        password,
      });
      Alert.alert('Success', 'Registration complete');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: null })}
    >
      <LottieView
        // source={require('../assets/animation/register.json')} // 👈 Use a student/register themed animation
        autoPlay
        loop
        style={styles.lottie}
      />

      <Animatable.View animation="fadeInUp" delay={300} style={styles.card}>
        <Text style={styles.title}>Register Now</Text>
        {/* <Text style={styles.subtitle}>Join Student Guide</Text> */}

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#ccc"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>
            Already have an account? <Text style={styles.linkBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lottie: {
    width: 250,
    height: 250,
    marginBottom: -40,
  },
  card: {
    backgroundColor: '#083c5d',
    padding: 30,
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 6,
  },
  title: {
    fontSize: 28,
    padding: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  // subtitle: {
  //   fontSize: 16,
  //   color: '#cfddee',
  //   marginBottom: 20,
  // },
  input: {
    width: 280,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    marginVertical: 10,
  },
  registerButton: {
    backgroundColor: '#083c5d',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 20,
    elevation: 4,
    borderColor: '#fff',
    borderWidth: 2,
  },

  registerButtonText: {
    color: '#fff',
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
    color: '#00FFD1',
  }
});
