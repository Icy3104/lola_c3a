import axios from 'axios';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// Create API instance with configuration
const api = axios.create({
  baseURL: 'https://api.aimlapi.com/v1',
  headers: { Authorization: 'Bearer <YOUR_API_KEY>' },
  timeout: 15000, // 15 seconds timeout
  responseType: 'arraybuffer'
});

// Setup audio caching directory
const TTS_CACHE_DIR = `${FileSystem.cacheDirectory}tts-cache/`;
let currentSound: Audio.Sound | null = null;

// Text-to-Speech Service with caching and enhanced voice quality
class TextToSpeechService {
  static voiceOptions = {
    default: '#g1_aura-asteria-en',
    male: '#g1_aura-orion-en',
    female: '#g1_aura-asteria-en',
    child: '#g1_aura-nova-en'
  };
  
  // Initialize the TTS service and ensure cache directory exists
  static async init(): Promise<void> {
    try {
      await Audio.requestPermissionsAsync();
      
      // Set up audio mode for playback
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false
      });
      
      // Create cache directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(TTS_CACHE_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(TTS_CACHE_DIR, { intermediates: true });
      }
    } catch (error) {
      console.error('TTS init error:', error);
    }
  }

  /**
   * Convert text to speech and play the audio
   * @param text - The text to convert to speech
   * @param voiceType - Optional voice type (default, male, female, child)
   * @param speed - Optional speech rate (0.5 to 2.0)
   */
  static async speak(
    text: string, 
    voiceType: keyof typeof TextToSpeechService.voiceOptions = 'default',
    speed: number = 1.0
  ): Promise<void> {
    try {
      await this.init();
      
      // Stop any currently playing audio
      await this.stop();
      
      // Create hash of text to use for caching
      const textHash = this.hashString(text + voiceType + speed);
      const cacheFile = `${TTS_CACHE_DIR}${textHash}.wav`;
      
      // Check if we have this audio in cache
      const cacheInfo = await FileSystem.getInfoAsync(cacheFile);
      let audioUri: string;
      
      if (cacheInfo.exists) {
        console.log('Using cached TTS audio');
        audioUri = cacheFile;
      } else {
        console.log('Generating new TTS audio');
        
        // Normalize speed to acceptable range
        const normalizedSpeed = Math.max(0.5, Math.min(2.0, speed));
        
        // Select voice model
        const voiceModel = this.voiceOptions[voiceType] || this.voiceOptions.default;
        
        // Request TTS audio from API
        const response = await api.post('/tts', {
          model: voiceModel,
          text: text,
          speed: normalizedSpeed,
          format: 'wav'
        });
        
        // Save audio to cache
        await FileSystem.writeAsStringAsync(
          cacheFile, 
          this.arrayBufferToBase64(response.data), 
          { encoding: FileSystem.EncodingType.Base64 }
        );
        
        audioUri = cacheFile;
      }
      
      // Create and play the sound
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri: audioUri });
      currentSound = soundObject;
      
      // Add completion handler
      soundObject.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          soundObject.unloadAsync().catch(() => {});
          if (currentSound === soundObject) {
            currentSound = null;
          }
        }
      });
      
      await soundObject.playAsync();
    } catch (error) {
      console.error('TTS speak error:', error);
      throw new Error('Failed to convert text to speech');
    }
  }
  
  /**
   * Stop any currently playing TTS audio
   */
  static async stop(): Promise<void> {
    if (currentSound) {
      try {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      } catch (error) {
        console.warn('Error stopping sound:', error);
      } finally {
        currentSound = null;
      }
    }
  }
  
  /**
   * Clean up TTS cache to free up storage
   * @param maxAgeDays Maximum age of cache files in days
   */
  static async cleanCache(maxAgeDays: number = 7): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(TTS_CACHE_DIR);
      if (!dirInfo.exists) return;
      
      const contents = await FileSystem.readDirectoryAsync(TTS_CACHE_DIR);
      const now = new Date().getTime();
      const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
      
      for (const file of contents) {
        if (!file.endsWith('.wav')) continue;
        
        const filePath = `${TTS_CACHE_DIR}${file}`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        
        if (fileInfo.modificationTime && now - fileInfo.modificationTime > maxAgeMs) {
          await FileSystem.deleteAsync(filePath);
        }
      }
    } catch (error) {
      console.warn('Error cleaning TTS cache:', error);
    }
  }
  
  /**
   * Convert ArrayBuffer to Base64 string
   */
  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  
  /**
   * Create a simple hash string from text (for cache filenames)
   */
  private static hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }
}

export default TextToSpeechService;