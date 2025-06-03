import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import appStyles from "./styles/appStyles"; // Ensure correct path
import FloatingCompanion from './components/FloatingCompanion';



const App: React.FC = () => {
  return (
    <View style={{ flex: 1 }}> 
      <NavigationContainer>
        <AppNavigator />
        <FloatingCompanion />
      </NavigationContainer>
    </View>
  );
};

export default App;
