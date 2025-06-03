//HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import styles from '../styles/homescreenStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/AppNavigator';

// Define navigation prop types
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <Image source={require('../assets/Logo.png')} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Home</Text>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Companion')}>
          <Icon name="account-group" size={30} color="white" />
          <Text style={styles.buttonText}>Companion</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Medication')}>
          <Icon name="pill" size={30} color="white" />
          <Text style={styles.buttonText}>Medications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.emergencyButton} onPress={() => navigation.navigate('Emergency')}>
          <Icon name="alert" size={30} color="white" />
          <Text style={styles.buttonText}>Emergency</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Settings')}>
          <Icon name="cog" size={30} color="white" />
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
