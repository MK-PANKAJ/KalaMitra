// Test AI Integration
import { openaiService } from './src/utils/openaiService';

async function testAI() {
  console.log('🧪 Testing AI Integration...\n');

  try {
    // Test if API key is available
    console.log('API Key available:', !!import.meta.env.VITE_OPENAI_API_KEY);

    // Test chat completion
    const response = await openaiService.chatCompletion('Hello, how can you help me with KalaMitra?');
    console.log('✅ OpenAI Chat Integration Working!');
    console.log('Response length:', response.length);

    // Test story generation
    const storyResult = await openaiService.generateStoryAndPrice(
      'Beautiful handcrafted blue pottery vase with traditional Jaipur designs',
      'Jaipur, Rajasthan',
      'en'
    );

    console.log('\n✅ OpenAI Story Generation Working!');
    console.log('Story length:', storyResult.story.length);
    console.log('Price:', storyResult.suggestedPrice);

  } catch (error) {
    console.error('❌ AI Integration Issue:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. .env file exists with VITE_OPENAI_API_KEY');
    console.log('2. Valid OpenAI API key is set');
    console.log('3. Restart development server after adding API key');
  }
}

testAI();
