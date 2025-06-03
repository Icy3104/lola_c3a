import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../registration/RegistrationScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ProfileScreen from "../registration/ProfileScreen";
import CompanionScreen from "../screens/CompanionScreen";
import MedicationScreen from "../screens/MedicationScreen";
import EmergencyScreen from "../screens/EmergencyScreen";
import SettingsScreen from "../screens/SettingsScreen";
import RegistrationNavigator from "./RegistrationNavigator"; 

export type RootStackParamList = {
  RegistrationFlow: undefined; 
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Profile: undefined;
  Companion: undefined;
  Medication: undefined;
  Emergency: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="RegistrationFlow" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RegistrationFlow" component={RegistrationNavigator} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Companion" component={CompanionScreen} />
      <Stack.Screen name="Medication" component={MedicationScreen} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;