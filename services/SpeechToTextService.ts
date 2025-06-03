import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { Platform } from 'react-native';

const api = axios.create({
  baseURL: 'https://api.aimlapi.com/v1',
  headers: { Authorization: 'Bearer <YOUR_API_KEY>' },
  timeout: 15000, // 15 seconds timeout
});

let recordingInstance: Audio.Recording | null = null;

// Improved speech-to-text service with platform-specific configurations
class SpeechToTextService {
  /**
   * Request microphone permissions and configure audio settings
   */
  static async setup() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) throw new Error('Microphone permission required');
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Audio setup error:', error);
      throw new Error('Failed to configure audio settings');
    }
  }

  /**
   * Start audio recording with optimized settings for speech recognition
   */
  static async startRecording(): Promise<void> {
    try {
      await this.setup();
      
      // Cleanup any existing recording instance
      if (recordingInstance) {
        await this.destroyRecording();
      }
      
      // Configure recording with appropriate settings for speech
      const recording = new Audio.Recording();
      
      // Platform-specific optimizations
      const recordingOptions = Platform.OS === 'ios' 
        ? {
            isMeteringEnabled: true,
            android: {
              extension: '.m4a',
              outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
              audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
              sampleRate: 44100,
              numberOfChannels: 1,
              bitRate: 128000,
            },
            ios: {
              extension: '.wav',
              audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
              sampleRate: 44100,
              numberOfChannels: 1,
              bitRate: 128000,
              linearPCMBitDepth: 16,
              linearPCMIsBigEndian: false,
              linearPCMIsFloat: false,
            },
          }
        : Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY;
      
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
      recordingInstance = recording;
      
      console.log('Started recording');
    } catch (error) {
      console.error('Start recording error:', error);
      throw new Error('Failed to start recording');
    }
  }

  /**
   * Stop recording and transcribe audio to text
   */
  static async stopRecording(): Promise<string> {
    try {
      if (!recordingInstance) {
        throw new Error('No active recording found');
      }
      
      console.log('Stopping recording...');
      await recordingInstance.stopAndUnloadAsync();
      
      const uri = recordingInstance.getURI();
      if (!uri) throw new Error('Recording URI is null');
      
      console.log('Converting audio to base64...');
      const audioBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      console.log('Sending audio for transcription...');
      const audioFormat = Platform.OS === 'ios' ? 'wav' : 'm4a';
      
      const sttResponse = await api.post('/stt', {
        model: '#g1_nova-2-general',
        audio: `data:audio/${audioFormat};base64,${audioBase64}`,
        language: 'en'
      });
      
      // Clean up recording file
      await FileSystem.deleteAsync(uri, { idempotent: true });
      
      if (sttResponse.data && sttResponse.data.results && 
          sttResponse.data.results.channels && 
          sttResponse.data.results.channels[0] &&
          sttResponse.data.results.channels[0].alternatives &&
          sttResponse.data.results.channels[0].alternatives[0]) {
        
        const transcript = sttResponse.data.results.channels[0].alternatives[0].transcript;
        return transcript || 'Sorry, I didn\'t catch that';
      } else {
        throw new Error('Invalid transcription response format');
      }
    } catch (error) {
      console.error('Speech to text error:', error);
      throw new Error(
        error.message === 'Recording URI is null' 
          ? 'Recording failed. Please try again.' 
          : 'Failed to convert speech to text'
      );
    } finally {
      await this.destroyRecording();
    }
  }
  
  /**
   * Cancel recording and cleanup resources
   */
  static async cancelRecording(): Promise<void> {
    await this.destroyRecording();
  }
  
  /**
   * Helper method to clean up recording resources
   */
  private static async destroyRecording(): Promise<void> {
    if (recordingInstance) {
      try {
        // Check recording status to avoid errors when stopping
        const status = await recordingInstance.getStatusAsync();
        if (status.isRecording) {
          await recordingInstance.stopAndUnloadAsync();
        } else if (status.isDoneRecording) {
          await recordingInstance.unloadAsync();
        }
        
        // Clean up recording file if exists
        const uri = recordingInstance.getURI();
        if (uri) {
          await FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});
        }
      } catch (error) {
        console.warn('Error cleaning up recording:', error);
      } finally {
        recordingInstance = null;
      }
    }
  }
}

export default SpeechToTextService;