import { View, Text } from "react-native";
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../screens/Home";
import Register from "../../screens/auth/Register";
import Login from "../../screens/auth/Login";
import { AuthContext } from "../../context/authContext";
import Post from "../../screens/Post";
import About from "../../screens/About";
import Account from "../../screens/Account";
import Myposts from "../../screens/Myposts";
import ModelDataScreen from "../../screens/ModelDataScreen"
import HeaderMenu from "../Menus/HeaderMenu";

const ScreenMenu = () => {
  const [state] = useContext(AuthContext);
  const authenticatedUser = state?.user && state?.token;
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Login">
      {authenticatedUser ? (
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              title: "Full Stack App",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
        name="ModelData"
        component={ModelDataScreen}
        options={{ title: 'Model Data' }}
      />
          <Stack.Screen
            name="Post"
            component={Post}
            options={{
              headerBackTitle: "Back",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="About"
            component={About}
            options={{
              headerBackTitle: "Back",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
          name="Account"
          component={Account}
          options={{
            headerBackTitle: "Back",
            headerRight: () => <HeaderMenu />,
          }}
        />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login} // Add Login screen
            options={{
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="Register" // Changed from "Post" to "Register" to match component
            component={Register}
            options={{
              headerBackTitle: "Back",
              headerRight: () => <HeaderMenu />,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default ScreenMenu;