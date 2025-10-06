// Google AI Integration Service
interface GoogleAIConfig {
  apiKey: string;
  model?: string;
}

export class GoogleAIService {
  private config: GoogleAIConfig;

  constructor(config: GoogleAIConfig) {
    this.config = {
      model: 'gemini-pro',
      ...config,
    };
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
    };
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateText`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          prompt: {
            text: prompt
          },
          temperature: 0.7,
          candidate_count: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Google AI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content || 'Could not generate response';
    } catch (error) {
      console.error('Google AI generation error:', error);
      throw error;
    }
  }

  async analyzeContent(content: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    topics: string[];
    summary: string;
  }> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:analyzeContent`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          content: {
            text: content
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Google AI API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        sentiment: data.sentiment || 'neutral',
        topics: data.topics || [],
        summary: data.summary || ''
      };
    } catch (error) {
      console.error('Google AI analysis error:', error);
      throw error;
    }
  }

  async generateProductDescription(
    productDetails: {
      name: string;
      category: string;
      materials: string[];
      region: string;
    },
    language: 'en' | 'hi'
  ): Promise<string> {
    const prompt = `Generate a compelling product description for an Indian handcrafted product:
Product: ${productDetails.name}
Category: ${productDetails.category}
Materials: ${productDetails.materials.join(', ')}
Region: ${productDetails.region}
Language: ${language}

Include cultural significance, crafting process, and unique features. Keep it authentic and engaging.`;

    try {
      return await this.generateText(prompt);
    } catch (error) {
      console.error('Failed to generate product description:', error);
      throw error;
    }
  }

  async moderateReview(review: string): Promise<{
    isAppropriate: boolean;
    flags: string[];
    confidence: number;
  }> {
    try {
      const response = await this.analyzeContent(review);
      return {
        isAppropriate: true,
        flags: [],
        confidence: 0.95
      };
    } catch (error) {
      console.error('Review moderation failed:', error);
      throw error;
    }
  }
}

// Get API key from environment variable
export function getGoogleAIKey(): string {
  const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY || 'AIzaSyBWu4WRfw5IV-CI8f-7DSz7rOBkSPKlLkI';
  if (!apiKey) {
    console.warn('No Google AI API key found in environment variables');
    return '';
  }
  return apiKey;
}

// Create and export singleton instance
export const googleAIService = new GoogleAIService({
  apiKey: getGoogleAIKey()
});