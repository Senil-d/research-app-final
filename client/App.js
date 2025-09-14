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

//roadmap
import LandMapScreen from './screens/Roadmap/LandMapScreen';
import Lv1Screen from './screens/Roadmap/Levels/Lv1Screen';
import Lv2Screen from './screens/Roadmap/Levels/Lv2Screen';
import Lv3Screen from './screens/Roadmap/Levels/Lv3Screen';
import Lv4Screen from './screens/Roadmap/Levels/Lv4Screen';
import Lv5Screen from './screens/Roadmap/Levels/Lv5Screen';
import Lv6Screen from './screens/Roadmap/Levels/Lv6Screen';
import Lv7Screen from './screens/Roadmap/Levels/Lv7Screen';
import Lv8Screen from './screens/Roadmap/Levels/Lv8Screen';
import Lv9Screen from './screens/Roadmap/Levels/Lv9Screen';
import Lv10Screen from './screens/Roadmap/Levels/Lv10Screen';


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


        <Stack.Screen name='home' component={HomeScreen} options={{ headerShown: false }}/>


        {/*Roadmap*/}
        <Stack.Screen name='LandMapScreen' component={LandMapScreen} options={{ headerShown: false }}/>
        {/* <Stack.Screen name="Roadmapf1" component={Roadmapf1} options={{ headerShown: false }} /> */}
        <Stack.Screen name="Lv1Screen" component={Lv1Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Lv2Screen" component={Lv2Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Lv3Screen" component={Lv3Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Lv4Screen" component={Lv4Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Lv5Screen" component={Lv5Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Lv6Screen" component={Lv6Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Lv7Screen" component={Lv7Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Lv8Screen" component={Lv8Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Lv9Screen" component={Lv9Screen} options={{ headerShown: false }} />
        <Stack.Screen name="Lv10Screen" component={Lv10Screen} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
