import {
  generateAIStory as mockGenerateAIStory,
  generateSEOKeywords as mockGenerateSEOKeywords,
  analyzeBulkInquiry as mockAnalyzeBulkInquiry,
  analyzeReviewSentiment as mockAnalyzeReviewSentiment,
  moderateContent as mockModerateContent,
  enhanceProductDescription as mockEnhanceDescription
} from './aiService';
import { googleAIService } from './googleAIService';
import { AIStoryResult } from './aiService';
import { rateLimiter } from './rateLimiter';

let openaiService: any | null = null; // Remove OpenAI service completely

const initializeOpenAI = () => {
  // Remove OpenAI initialization
  console.log('✅ Google AI service initialized (OpenAI removed)');
};

// Initialize on module load
initializeOpenAI();

export async function generateAIStory(
  voiceInput: string,
  region: string,
  language: 'en' | 'hi'
): Promise<AIStoryResult> {
  try {
    // Check rate limit for story generation
    await rateLimiter.story.checkLimit('story');

    console.log('🤖 Using Google AI API for story generation...');

    // First, analyze the product to extract materials and estimate price
    const analysisPrompt = `Analyze handicraft product: ${voiceInput} from ${region}.
Provide JSON response with:
- materials (array of strings)
- suggestedPrice (number in rupees)
- tags (array of strings)`;

    let materials: string[] = [];
    let suggestedPrice = 0;
    let tags: string[] = [];

    try {
      const analysis = await googleAIService.generateText(analysisPrompt);
      const parsed = JSON.parse(analysis);
      materials = parsed.materials || [];
      suggestedPrice = parsed.suggestedPrice || 0;
      tags = parsed.tags || [];
    } catch (analysisError) {
      console.warn('⚠️ Failed to analyze product details:', analysisError);
    }

    // Generate the story
    const story = await googleAIService.generateProductDescription({
      name: voiceInput,
      category: 'handicraft',
      materials: materials,
      region: region
    }, language);

    return {
      story,
      suggestedPrice,
      category: 'handicraft',
      materials,
      tags
    };
  } catch (error) {
    console.warn('⚠️ Google AI API failed, falling back to mock service:', error);
  }

  // Mock service as final fallback
  console.log('🔄 Using mock AI service for story generation...');
  return mockGenerateAIStory(voiceInput, region, language);
}

// NEW: SEO Keywords with OpenAI
export async function generateSEOKeywords(productName: string, category: string): Promise<string[]> {
  try {
    // Generate SEO keywords using generateText API
    const prompt = `Generate SEO keywords for ${category} product: ${productName}. Return as comma-separated list.`;
    const response = await googleAIService.generateText(prompt);
    const keywords = response.split(',').map(k => k.trim());
    return keywords;
  } catch (error) {
    console.warn('⚠️ Google AI SEO generation failed, using mock:', error);
  }
  return mockGenerateSEOKeywords(productName, category);
}

// NEW: Bulk Inquiry Analysis with OpenAI
export async function analyzeBulkInquiry(inquiry: {
  productType: string;
  quantity: number;
  description: string;
}): Promise<{
  suggestedArtisans: string[];
  estimatedPrice: { min: number; max: number };
  estimatedDeliveryDays: number;
  complexity: 'low' | 'medium' | 'high';
}> {
  try {
    // Generate analysis using structured prompt
    const prompt = `Analyze bulk product inquiry:\nProduct: ${inquiry.productType}\nQuantity: ${inquiry.quantity}\nDescription: ${inquiry.description}\n\nProvide a JSON response with:\n- suggestedArtisans (array of strings)\n- estimatedPrice (object with min and max numbers)\n- estimatedDeliveryDays (number)\n- complexity (string: low, medium, or high)`;
    
    const response = await googleAIService.generateText(prompt);
    try {
      const analysis = JSON.parse(response);
      return {
        suggestedArtisans: analysis.suggestedArtisans || [],
        estimatedPrice: analysis.estimatedPrice || { min: 0, max: 0 },
        estimatedDeliveryDays: analysis.estimatedDeliveryDays || 0,
        complexity: analysis.complexity || 'medium'
      };
    } catch (parseError) {
      console.warn('⚠️ Failed to parse AI response:', parseError);
      throw parseError;
    }
  } catch (error) {
    console.warn('⚠️ Google AI bulk inquiry analysis failed, using mock:', error);
  }
  return mockAnalyzeBulkInquiry(inquiry);
}

// Review Sentiment Analysis with Google AI
export async function analyzeReviewSentiment(review: string): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  keywords: string[];
}> {
  try {
    // Check rate limit for sentiment analysis
    await rateLimiter.sentiment.checkLimit('sentiment');
    
    const analysis = await googleAIService.analyzeContent(review);
    
    // Generate a confidence score from sentiment analysis
    const scorePrompt = `Rate the following review's sentiment strength from 0 to 1:\n${review}`;
    let score = 0.5; // Default neutral score
    
    try {
      const scoreResponse = await googleAIService.generateText(scorePrompt);
      const parsedScore = parseFloat(scoreResponse);
      if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 1) {
        score = parsedScore;
      }
    } catch (scoreError) {
      console.warn('⚠️ Failed to generate sentiment score:', scoreError);
    }
    
    return {
      sentiment: analysis.sentiment,
      score,
      keywords: analysis.topics
    };
  } catch (error) {
    console.warn('⚠️ Google AI sentiment analysis failed, using mock:', error);
    return mockAnalyzeReviewSentiment(review);
  }
}

// Content Moderation with Google AI
export async function moderateContent(content: string): Promise<{
  isAppropriate: boolean;
  confidence: number;
}> {
  try {
    // Check rate limit for content moderation
    await rateLimiter.moderation.checkLimit('moderation');

    return await googleAIService.moderateReview(content);
  } catch (error) {
    console.warn('⚠️ Google AI moderation failed, falling back to mock:', error);

    return mockModerateContent(content);
  }
}

// Enhanced Description with Google AI
export async function enhanceProductDescription(
  description: string,
  language: 'en' | 'hi'
): Promise<string> {
  try {
    // Check rate limit for description generation
    await rateLimiter.description.checkLimit('description');
    
    const prompt = `Enhance the following product description for ${language === 'hi' ? 'Hindi' : 'English'} language:\n\n${description}`;
    return await googleAIService.generateText(prompt);
  } catch (error) {
    console.warn('⚠️ Google AI description enhancement failed, using mock:', error);
    return mockEnhanceDescription(description, language);
  }
}

export { initializeOpenAI };
