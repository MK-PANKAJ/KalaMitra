import { AIStoryResult } from './aiService';

interface OpenAIConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
}

class OpenAIService {
  private config: OpenAIConfig;

  constructor(config: OpenAIConfig) {
    this.config = {
      model: 'gpt-3.5-turbo',
      maxTokens: 1000,
      ...config,
    };
  }

  async chatCompletion(message: string): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: `You are KalaMitra AI assistant, an expert in Indian handcrafted products and artisan marketplace. You help customers with:
              - Order tracking and shipping information
              - Payment methods and policies
              - Returns and refunds
              - Product quality and QC badges
              - Artisan connections and custom orders
              - Discounts and promotional offers
              - General platform assistance

              Always be helpful, friendly, and culturally sensitive. Use appropriate Hindi/English greetings when relevant. Keep responses concise but informative.`,
            },
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I could not process your request at the moment. Please try again or contact our support team.';
    } catch (error) {
      console.error('OpenAI chat completion error:', error);
      throw error;
    }
  }

  async generateStoryAndPrice(
    voiceInput: string,
    region: string,
    language: 'en' | 'hi'
  ): Promise<AIStoryResult> {
    const prompt = this.buildPrompt(voiceInput, region, language);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: `You are an expert artisan storyteller. Generate compelling, culturally authentic stories for Indian handcrafted products. Always respond in JSON format.`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: this.config.maxTokens,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return this.parseAIResponse(content);
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  private buildPrompt(voiceInput: string, region: string, language: 'en' | 'hi'): string {
    const langText = language === 'hi' ? 'Hindi' : 'English';
    return `
Please analyze this product description and create a culturally authentic story in ${langText}:

"${voiceInput}"

Region: ${region}

Please respond with a JSON object containing:
{
  "story": "A compelling 100-150 word story about this product, highlighting its cultural significance, craftsmanship, and artisan heritage",
  "suggestedPrice": 1500,
  "materials": ["material1", "material2"],
  "category": "pottery|textile|jewelry|woodwork|metalwork|painting|handloom|general"
}

Make the story authentic to Indian artisanal traditions and the specified region. Use appropriate cultural context and storytelling style.`;
  }

  private parseAIResponse(content: string): AIStoryResult {
    try {
      // Clean the response (remove markdown code blocks if present)
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '');
      const parsed = JSON.parse(cleanedContent);

      return {
        story: parsed.story || 'A beautiful handcrafted item with rich cultural heritage.',
        suggestedPrice: parsed.suggestedPrice || 1000,
        materials: Array.isArray(parsed.materials) ? parsed.materials : ['Traditional materials'],
        category: parsed.category || 'general',
        tags: Array.isArray(parsed.tags) ? parsed.tags : ['handcrafted', 'traditional'],
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      // Fallback to mock response if parsing fails
      return {
        story: 'A beautiful handcrafted item representing the rich heritage of Indian artisans.',
        suggestedPrice: 1500,
        materials: ['Traditional materials'],
        category: 'general',
        tags: ['handcrafted', 'traditional'],
      };
    }
  }
}

// Environment variable for API key
const getAPIKey = (): string => {
  // In production, this would come from environment variables
  // For demo purposes, you can set it here or use a .env file
  return import.meta.env.VITE_OPENAI_API_KEY || '';
};

// Export singleton instance
export const openaiService = new OpenAIService({
  apiKey: getAPIKey(),
});

export { OpenAIService, getAPIKey };
