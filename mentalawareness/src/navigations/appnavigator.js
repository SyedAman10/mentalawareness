import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SignUpScreen from "../pages/signup/signup";
import LoginScreen from "../pages/login/login";
import RoleSelectionScreen from "../pages/roleselection/roleselectionscreen";
import TherapistScreen from "../pages/therapistscreen/therapistscreen";

import UserHomePage from "../pages/userscreen/userscreen";
import ProfileScreen from "../profilescreen/profilescreen";


const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide headers for a cleaner look
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="TherapistScreen" component={TherapistScreen} />
    
        <Stack.Screen name="UserHomePage" component={UserHomePage} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
