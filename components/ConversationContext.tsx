import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import AIService from '../services/AIService';
import TextToSpeechService from '../services/TextToSpeechService';
import SpeechToTextService from '../services/SpeechToTextService';

// Types
export type ConversationStatus = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
export type MessageType = 'user' | 'ai';

export interface Message {
  id: string;
  text: string;
  type: MessageType;
  timestamp: number;
}

interface ConversationContextProps {
  messages: Message[];
  status: ConversationStatus;
  statusText: string;
  errorMessage: string | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  sendTextInput: (text: string) => Promise<void>;
  clearConversation: () => void;
}

// Create context
const ConversationContext = createContext<ConversationContextProps | undefined>(undefined);

// Provider component
export const ConversationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ConversationStatus>('idle');
  const [statusText, setStatusText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate a unique ID for messages
  const generateId = () => Math.random().toString(36).substring(2, 11);

  // Add a new message to the conversation
  const addMessage = useCallback((text: string, type: MessageType) => {
    const newMessage: Message = {
      id: generateId(),
      text,
      type,
      timestamp: Date.now()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  }, []);

  // Start listening for voice input
  const startListening = useCallback(async () => {
    try {
      setStatus('listening');
      setStatusText('Listening...');
      setErrorMessage(null);
      
      // First speak a greeting
      const greeting = AIService.getGreeting();
      await TextToSpeechService.speak(greeting);
      
      // Start voice recording
      await SpeechToTextService.startRecording();
    } catch (error) {
      console.error('Start listening error:', error);
      setStatus('error');
      setErrorMessage('Failed to start listening: ' + (error.message || 'Unknown error'));
    }
  }, []);

  // Stop listening and process voice input
  const stopListening = useCallback(async () => {
    try {
      setStatus('processing');
      setStatusText('Processing...');
      
      // Get transcription
      const transcript = await SpeechToTextService.stopRecording();
      
      if (transcript && transcript.trim()) {
        // Add user message
        addMessage(transcript, 'user');
        
        // Get AI response
        setStatusText('Getting response...');
        const aiResponse = await AIService.getAIResponse(transcript);
        
        // Add AI message
        addMessage(aiResponse, 'ai');
        
        // Speak response
        setStatus('speaking');
        setStatusText('Speaking...');
        await TextToSpeechService.speak(aiResponse);
      } else {
        // No transcript detected
        setStatusText('I didn\'t hear anything. Try again?');
        await TextToSpeechService.speak('I didn\'t hear anything. Try again?');
      }
    } catch (error) {
      console.error('Stop listening error:', error);
      setStatus('error');
      setErrorMessage('Failed to process speech: ' + (error.message || 'Unknown error'));
      
      // Speak error message
      await TextToSpeechService.speak('Sorry, there was a problem processing your request.');
    } finally {
      // Return to idle state
      setStatus('idle');
      setStatusText('');
    }
  }, [addMessage]);

  // Send text input manually
  const sendTextInput = useCallback(async (text: string) => {
    try {
      if (!text.trim()) return;
      
      // Add user message
      addMessage(text, 'user');
      
      // Get AI response
      setStatus('processing');
      setStatusText('Getting response...');
      const aiResponse = await AIService.getAIResponse(text);
      
      // Add AI message
      addMessage(aiResponse, 'ai');
      
      // Speak response
      setStatus('speaking');
      setStatusText('Speaking...');
      await TextToSpeechService.speak(aiResponse);
    } catch (error) {
      console.error('Send text input error:', error);
      setStatus('error');
      setErrorMessage('Failed to get AI response: ' + (error.message || 'Unknown error'));
    } finally {
      // Return to idle state
      setStatus('idle');
      setStatusText('');
    }
  }, [addMessage]);

  // Clear conversation history
  const clearConversation = useCallback(() => {
    setMessages([]);
    setStatus('idle');
    setStatusText('');
    setErrorMessage(null);
  }, []);

  // Initialize services
  useEffect(() => {
    const initServices = async () => {
      try {
        await TextToSpeechService.init();
        
        // Clean TTS cache periodically
        TextToSpeechService.cleanCache().catch(console.error);
      } catch (error) {
        console.error('Services initialization error:', error);
      }
    };
    
    initServices();
    
    // Cleanup function
    return () => {
      TextToSpeechService.stop().catch(console.error);
      SpeechToTextService.cancelRecording().catch(console.error);
    };
  }, []);

  // Context value
  const value = {
    messages,
    status,
    statusText,
    errorMessage,
    startListening,
    stopListening,
    sendTextInput,
    clearConversation
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

// Custom hook to use the conversation context
export const useConversation = (): ConversationContextProps => {
  const context = useContext(ConversationContext);
  
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  
  return context;
};

export default ConversationContext;