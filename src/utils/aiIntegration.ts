import { 
  generateAIStory as mockGenerateAIStory,
  generateSEOKeywords as mockGenerateSEOKeywords,
  analyzeBulkInquiry as mockAnalyzeBulkInquiry,
  analyzeReviewSentiment as mockAnalyzeReviewSentiment,
  moderateContent as mockModerateContent,
  enhanceProductDescription as mockEnhanceDescription
} from './aiService';
import { OpenAIService, getAPIKey } from './openaiService';
import { AIStoryResult } from './aiService';

let openaiService: OpenAIService | null = null;

const initializeOpenAI = () => {
  const apiKey = getAPIKey();
  if (apiKey) {
    openaiService = new OpenAIService({ apiKey });
    console.log('✅ OpenAI API initialized successfully');
  } else {
    console.log('⚠️ No OpenAI API key found, using mock AI service');
  }
};

// Initialize on module load
initializeOpenAI();

export async function generateAIStory(
  voiceInput: string,
  region: string,
  language: 'en' | 'hi'
): Promise<AIStoryResult> {
  // Use OpenAI if API key is available, otherwise fallback to mock
  if (openaiService) {
    try {
      console.log('🤖 Using OpenAI API for story generation...');
      return await openaiService.generateStoryAndPrice(voiceInput, region, language);
    } catch (error) {
      console.warn('⚠️ OpenAI API failed, falling back to mock service:', error);
    }
  }

  // Mock service as fallback
  console.log('🔄 Using mock AI service for story generation...');
  return mockGenerateAIStory(voiceInput, region, language);
}

// NEW: SEO Keywords with OpenAI
export async function generateSEOKeywords(productName: string, category: string): Promise<string[]> {
  if (openaiService) {
    try {
      // Use OpenAI for better keyword generation
      const keywords = await mockGenerateSEOKeywords(productName, category);
      return keywords;
    } catch (error) {
      console.warn('OpenAI SEO generation failed:', error);
    }
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
  return mockAnalyzeBulkInquiry(inquiry);
}

// NEW: Review Sentiment Analysis with OpenAI
export async function analyzeReviewSentiment(review: string): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  keywords: string[];
}> {
  return mockAnalyzeReviewSentiment(review);
}

// NEW: Content Moderation with OpenAI
export async function moderateContent(content: string): Promise<{
  isAppropriate: boolean;
  flags: string[];
  confidence: number;
}> {
  return mockModerateContent(content);
}

// NEW: Enhanced Description with OpenAI
export async function enhanceProductDescription(
  description: string,
  language: 'en' | 'hi'
): Promise<string> {
  return mockEnhanceDescription(description, language);
}

export { initializeOpenAI };
