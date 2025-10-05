import { generateAIStory } from './src/utils/aiIntegration';

async function testAIIntegration() {
  console.log('🧪 Testing AI Integration...\n');

  try {
    const result = await generateAIStory(
      'Beautiful handcrafted blue pottery vase with traditional Jaipur designs',
      'Jaipur, Rajasthan',
      'en'
    );

    console.log('✅ AI Integration Test Successful!');
    console.log('\n📖 Generated Story:');
    console.log(result.story);
    console.log('\n💰 Suggested Price:', result.suggestedPrice);
    console.log('🏷️  Category:', result.category);
    console.log('🛠️  Materials:', result.materials.join(', '));

    console.log('\n🎉 KalaMitra AI is working with real OpenAI integration!');

  } catch (error) {
    console.error('❌ AI Integration Test Failed:', error);
    console.log('\n🔄 Falling back to mock AI service...');

    // Test fallback to mock service
    const { generateAIStory: mockGenerate } = await import('./src/utils/aiService');
    const mockResult = await mockGenerate(
      'Beautiful handcrafted blue pottery vase',
      'Jaipur, Rajasthan',
      'en'
    );

    console.log('✅ Mock AI Service Working');
    console.log('Story:', mockResult.story.substring(0, 100) + '...');
  }
}

testAIIntegration().catch(console.error);
