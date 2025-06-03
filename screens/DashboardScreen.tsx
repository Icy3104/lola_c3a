//DashboardScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from '../styles/appStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = { Profile: undefined };
type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>

      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Profile')}>
        <Icon name="account" size={30} color="white" />
        <Text style={styles.buttonText}>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;