import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LandingScreen from './screens/LandingScreen';
import HyUserScreen from './screens/HyUserScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import WelcomeGuideScreen from './screens/WelcomeGuideScreen';
import CareerGoalScreen from './screens/CareerGoalScreen';
import Header from './components/Header';
import ReadyScreen from './screens/ReadyScreen';
import SuggestedCareerScreen from './screens/SuggestedCareerScreen';
import Career from './screens/Career';
import NavBar from './components/NavBar';
import HomeScreen from './screens/HomeScreen';
import AssessmentResults from './screens/artistic/AssessmentResults';
import CareerAssessment from './screens/artistic/CareerAssessment';
import CVClassification from './screens/artistic/CVClassification';
import FinalScoreScreen from './screens/artistic/FinalScoreScreen';


//Function 1
import ResultScreen from './screens/ResultsScreen';
import QuizScreen from './screens/QuizScreen';
import ScoreScreen from './screens/ScoreScreen';

//Function 2
import QuizScreenF2 from './screens/Function-2/QuizScreenF2';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
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


        {/* artistic Screens */}
        <Stack.Screen name="assresul" component={AssessmentResults} options={{ headerShown: false }} />
        <Stack.Screen name="careerass" component={CareerAssessment} options={{ headerShown: false }} />
        <Stack.Screen name="cv" component={CVClassification} options={{ headerShown: false }} />
        <Stack.Screen name="finalscore" component={FinalScoreScreen} options={{ headerShown: false }} />
        <Stack.Screen name="score" component={AssessmentResults} options={{ headerShown: false }} />






        <Stack.Screen name='home' component={HomeScreen} options={{ headerShown: false }}/>


      </Stack.Navigator>
    </NavigationContainer>
  );
}
