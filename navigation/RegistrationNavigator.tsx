import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RegistrationScreen from "../registration/RegistrationScreen";
import OTPScreen from "../registration/OTPScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../registration/ProfileScreen";
import EmergencyContactsScreen from "../registration/EmergencyContactsScreen";

export type RootStackParamList = {
  Registration: undefined;
  OTP: { phone: string };
  Profile: { phone: string }; 
  EmergencyContacts: { phone: string }; 
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RegistrationNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Registration" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default RegistrationNavigator;