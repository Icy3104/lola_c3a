//CompanionScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from '../styles/appStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackParamList = { Home: undefined };
type CompanionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: CompanionScreenNavigationProp;
}

const CompanionScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Icon name="arrow-left" size={24} color="#000" />
        <Text style={styles.backButtonText}>Return to Home Page</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.companionTitle}>Companion</Text>

      {/* Character Image */}
      <Image
        source={require('../assets/boy.png')} // or girl.png depending on settings
        style={styles.characterImage}
      />

      {/* Speech Bubble */}
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>Hi</Text>
      </View>

      {/* Interaction Button */}
      <TouchableOpacity style={styles.interactionButton}>
        <Text style={styles.interactionButtonText}>What can I do for you?</Text>
      </TouchableOpacity>

      {/* Microphone Button */}
      <TouchableOpacity style={styles.microphoneButton}>
        <Icon name="microphone" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default CompanionScreen;
