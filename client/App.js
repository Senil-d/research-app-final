import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// Screens
import Header from './components/Header';
import NavBar from './components/NavBar';
import Career from './screens/Career';
import CareerGoalScreen from './screens/CareerGoalScreen';
import HomeScreen from './screens/HomeScreen';
import HyUserScreen from './screens/HyUserScreen';
import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import ReadyScreen from './screens/ReadyScreen';
import RegisterScreen from './screens/RegisterScreen';
import SuggestedCareerScreen from './screens/SuggestedCareerScreen';
import WelcomeGuideScreen from './screens/WelcomeGuideScreen';

//Function 1
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultsScreen';
import ScoreScreen from './screens/ScoreScreen';

//Function 2
import QuizResultScreen from './screens/Function-2/QuizResultScreen';
import QuizScreenF2 from './screens/Function-2/QuizScreenF2';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="QuizF2">
        {/*App starting Screens*/}
        <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WelcomeGuideScreen" component={WelcomeGuideScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CareerGoalScreen" component={CareerGoalScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Header" component={Header} options={{ headerShown: false }}/>
        <Stack.Screen name="ReadyScreen" component={ReadyScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SuggestedCareerScreen" component={SuggestedCareerScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Career" component={Career} options={{ headerShown: false }}/>
        <Stack.Screen name="HyUserScreen" component={HyUserScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NavBar" component={NavBar} options={{ headerShown: false }} />

        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />

        {/* Function 1 Screens */}
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Score" component={ScoreScreen} options={{ title: 'Score Summary' }} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} options={{ headerShown: false }}/>

        {/* Function 2 Screens */}
        <Stack.Screen name="QuizF2" component={QuizScreenF2} options={{ headerShown: false }} />
        <Stack.Screen name='QuizResultScreen' component={QuizResultScreen} options={{ headerShown: false }}/>


        <Stack.Screen name='home' component={HomeScreen} options={{ headerShown: false }}/>


      </Stack.Navigator>
    </NavigationContainer>
  );
}
