import axios from 'axios';

// Create API instance with configuration
const api = axios.create({
  baseURL: 'https://api.aimlapi.com/v1',
  headers: { Authorization: 'Bearer <YOUR_API_KEY>' },
  timeout: 10000, // 10 seconds timeout
});

// Enhanced AI Service with comprehensive error handling and retries
class AIService {
  static MAX_RETRIES = 2;
  
  /**
   * Gets a response from the AI service
   * @param prompt - User's text prompt
   * @param context - Optional conversation context
   * @returns Promise resolving to AI's text response
   */
  static async getAIResponse(prompt: string, context: string = ''): Promise<string> {
    let retries = 0;
    
    while (retries <= this.MAX_RETRIES) {
      try {
        const systemPrompt = context 
          ? `You are an AI assistant for elderly users. ${context}`
          : 'You are an AI assistant for elderly users. Keep responses clear, concise, and helpful.';
        
        const response = await api.post('/chat/completions', {
          model: 'openai/gpt-4.1-nano-2025-04-14',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: 200
        });

        if (response.data && response.data.choices && response.data.choices.length > 0) {
          return response.data.choices[0].message.content;
        } else {
          throw new Error('Invalid response structure from AI API');
        }
      } catch (err: any) {
        retries++;
        
        // Network errors - retry
        if (axios.isAxiosError(err) && !err.response) {
          if (retries <= this.MAX_RETRIES) {
            console.warn(`Network error, retrying (${retries}/${this.MAX_RETRIES})...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
            continue;
          }
        }
        
        // API errors with status code
        if (axios.isAxiosError(err) && err.response) {
          const statusCode = err.response.status;
          
          if (statusCode === 401) {
            throw new Error('Authentication failed. Please check your API key.');
          } else if (statusCode === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
          } else if (statusCode >= 500) {
            if (retries <= this.MAX_RETRIES) {
              console.warn(`Server error (${statusCode}), retrying (${retries}/${this.MAX_RETRIES})...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * retries));
              continue;
            }
          }
        }
        
        console.error('AIService error:', err);
        throw new Error(axios.isAxiosError(err) && err.response?.data?.error 
          ? `AI error: ${err.response.data.error}` 
          : 'Failed to get response from AI service');
      }
    }
    
    throw new Error('Failed to get AI response after multiple attempts');
  }
  
  /**
   * Gets a simple greeting from the AI based on time of day
   */
  static getGreeting(): string {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return "Good morning! How can I help you today?";
    } else if (hour < 18) {
      return "Good afternoon! How can I assist you?";
    } else {
      return "Good evening! What can I do for you?";
    }
  }
}

export default AIService;