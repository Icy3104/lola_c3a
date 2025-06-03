//FloatingCompanion.tsx
import React, { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  Image,
  Easing,
  View,
  Text,
} from 'react-native';
import SpeechToTextService from '../services/SpeechToTextService';
import TextToSpeechService from '../services/TextToSpeechService';
import AIService from '../services/AIService';

const FloatingCompanion = () => {
  const pan = useRef(new Animated.ValueXY({ x: 20, y: 500 })).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isListening, setIsListening] = useState(false);
  const [bubbleText, setBubbleText] = useState('');

  const startGlowing = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  };

  const stopGlowing = () => {
    scaleAnim.stopAnimation();
    scaleAnim.setValue(1);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isListening,
      onMoveShouldSetPanResponder: () => !isListening,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const handlePress = async () => {
  try {
    setIsListening(true);
    setBubbleText('Listening...');
    startGlowing();

    await TextToSpeechService.speak('How can I help you?');

    await SpeechToTextService.startRecording();
    setBubbleText('Recording...');

    setTimeout(async () => {
      const spokenText = await SpeechToTextService.stopRecording();
      setBubbleText('You said: ' + spokenText);

      const aiResponse = await AIService.getAIResponse(spokenText);
      setBubbleText('AI: ' + aiResponse);

      await TextToSpeechService.speak(aiResponse);
      setIsListening(false);
      stopGlowing();
    }, 6000); // record 6 seconds max
  } catch (error) {
    console.error(error);
    setBubbleText('Error: ' + error.message);
    setIsListening(false);
    stopGlowing();
  }
};

  return (
    <Animated.View
      style={[styles.container, { transform: [...pan.getTranslateTransform()] }]}
      {...panResponder.panHandlers}
    >
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{bubbleText}</Text>
      </View>

      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Animated.View style={[styles.glowCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Image source={require('../assets/boy.png')} style={styles.avatar} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
    elevation: 10,
    alignItems: 'center',
  },
  glowCircle: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 50,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 35,
  },
  bubble: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    marginBottom: 5,
    maxWidth: 250,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  bubbleText: {
    fontSize: 12,
    color: '#333',
  },
});

export default FloatingCompanion;