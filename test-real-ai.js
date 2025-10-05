// Test Real OpenAI Integration
import { openaiService } from './src/utils/openaiService';

async function testRealAI() {
  console.log('🚀 Testing Real OpenAI Integration...\n');

  try {
    // Test chat completion with real API
    console.log('💬 Testing chat completion...');
    const chatResponse = await openaiService.chatCompletion('How can you help me discover authentic Indian handcrafted products on KalaMitra?');
    console.log('✅ Real AI Chat Working!');
    console.log('Response length:', chatResponse.length);
    console.log('Response preview:', chatResponse.substring(0, 100) + '...');

    // Test story generation with real API
    console.log('\n📖 Testing story generation...');
    const storyResult = await openaiService.generateStoryAndPrice(
      'Beautiful handcrafted blue pottery vase with traditional Jaipur designs from skilled Rajasthan artisans',
      'Jaipur, Rajasthan',
      'en'
    );
    console.log('✅ Real AI Story Generation Working!');
    console.log('Story length:', storyResult.story.length);
    console.log('Story preview:', storyResult.story.substring(0, 100) + '...');
    console.log('Suggested price:', storyResult.suggestedPrice);
    console.log('Category:', storyResult.category);
    console.log('Materials:', storyResult.materials.join(', '));

    console.log('\n🎉 SUCCESS: Real OpenAI API is working!');
    console.log('Your KalaMitra platform now has full AI capabilities!');

  } catch (error) {
    console.error('❌ Real AI Integration Issue:', error.message);

    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      console.log('\n💡 API Key Issue:');
      console.log('- Check if API key is correct');
      console.log('- Verify API key has sufficient credits');
      console.log('- Make sure API key is for the correct OpenAI account');
    }

    if (error.message.includes('429') || error.message.includes('rate limit')) {
      console.log('\n💡 Rate Limit Issue:');
      console.log('- API key may have exceeded rate limits');
      console.log('- Try again in a few minutes');
    }
  }
}

testRealAI();
