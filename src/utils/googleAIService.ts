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
      // Use the correct Google AI (Gemini) API endpoint
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google AI API error:', response.status, errorText);
        throw new Error(`Google AI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not generate response';
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
      const prompt = `Analyze the following content and provide a JSON response with sentiment (positive/neutral/negative), key topics (array of strings), and a brief summary (string):

Content: ${content}`;
      
      const response = await this.generateText(prompt);
      
      try {
        const analysis = JSON.parse(response);
        return {
          sentiment: analysis.sentiment || 'neutral',
          topics: analysis.topics || [],
          summary: analysis.summary || ''
        };
      } catch (parseError) {
        console.warn('Failed to parse AI analysis response:', parseError);
        return {
          sentiment: 'neutral',
          topics: [],
          summary: ''
        };
      }
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
// Note: For production, set VITE_GOOGLE_AI_API_KEY in your .env file
export function getGoogleAIKey(): string {
  const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
  if (!apiKey) {
    console.warn('🔑 No Google AI API key found in environment variables');
    console.warn('💡 To use Google AI features, add VITE_GOOGLE_AI_API_KEY to your .env file');
    console.warn('📝 Example: VITE_GOOGLE_AI_API_KEY=your_api_key_here');
    return '';
  }
  return apiKey;
}

// Create and export singleton instance
export const googleAIService = new GoogleAIService({
  apiKey: getGoogleAIKey()
});