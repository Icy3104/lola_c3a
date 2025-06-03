//EmergencyScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
  Home: undefined;
};

type EmergencyScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const EmergencyScreen: React.FC = () => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [calling, setCalling] = useState<'ambulance' | 'family' | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (!isPaused && countdown !== null && countdown > 0) {
      const newTimer = setInterval(() => {
        setCountdown((prev) => (prev !== null && prev > 1 ? prev - 1 : 0));
      }, 1000);
      
      setTimer(newTimer);
      
      return () => clearInterval(newTimer);
    } else if (countdown === 0) {
      console.log(`Calling ${calling} now...`);
      setCountdown(null);
      setCalling(null);
      if (timer) clearInterval(timer);
      setTimer(null);
    }
  }, [countdown, isPaused]);

  const startEmergencyCall = (type: 'ambulance' | 'family') => {
    setCalling(type);
    setCountdown(3);
    setIsPaused(false);
  };

  const handleSafePress = () => {
    if (timer) clearInterval(timer);
    setIsPaused(true);
    
    Alert.alert(
      "Stop Emergency Call?",
      "Are you sure you are safe and want to stop the call?",
      [
        {
          text: "No",
          style: "cancel",
          onPress: () => {
            setIsPaused(false); // Resume countdown if user selects "No"
          }
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            if (timer) {
              clearInterval(timer);
              setTimer(null);
            }
            setCountdown(null);
            setCalling(null);
            setIsPaused(false);
            
            Alert.alert("Call Stopped", "You have marked yourself as safe.");
          }
        }
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#f5f7fa', '#e4eaf1']}
      style={styles.container}
    >
      <Text style={styles.headerText}>Emergency</Text>
      
      {countdown !== null ? (
        <View style={styles.countdownContainer}>
          <View style={styles.countdownCircle}>
            <Text style={styles.countdownNumber}>{countdown}</Text>
          </View>
          <Text style={styles.countdownText}>
            {calling === 'ambulance' 
              ? `Calling Ambulance in ${countdown}...` 
              : `Calling Family in ${countdown}...`}
          </Text>
          
          <TouchableOpacity 
            style={styles.safeButton}
            onPress={handleSafePress}
          >
            <LinearGradient
              colors={['#2ecc71', '#27ae60']}
              style={styles.gradientButton}
            >
              <Icon name="check-circle" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.safeButtonText}>I am Safe</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.buttonWrapper}
            onPress={() => startEmergencyCall('ambulance')}
          >
            <LinearGradient
              colors={['#e74c3c', '#c0392b']}
              style={styles.gradientButton}
            >
              <Icon name="ambulance" size={24} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Call an Ambulance</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.buttonWrapper}
            onPress={() => startEmergencyCall('family')}
          >
            <LinearGradient
              colors={['#3498db', '#2980b9']}
              style={styles.gradientButton}
            >
              <Icon name="phone" size={24} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Call your Family</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  countdownContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  countdownCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f39c12',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  countdownNumber: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  countdownText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#e67e22',
    marginBottom: 30,
    textAlign: 'center',
  },
  safeButton: {
    width: '80%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 20,
  },
  safeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default EmergencyScreen;