// Test AI Integration Status
console.log('🧪 Testing AI Integration Status...\n');

// Check if .env file exists
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

console.log('📁 Checking environment files...');
console.log('✅ .env file exists:', fs.existsSync(envPath));
console.log('✅ .env.example file exists:', fs.existsSync(envExamplePath));

// Check if OpenAI service can be imported
try {
  console.log('\n🔧 Testing OpenAI service import...');
  const { openaiService } = await import('./src/utils/openaiService');
  console.log('✅ OpenAI service imported successfully');

  // Test if API key is available
  console.log('\n🔑 Checking API key availability...');
  const apiKey = process.env.VITE_OPENAI_API_KEY || 'NOT_SET';
  console.log('API Key status:', apiKey === 'NOT_SET' ? '❌ Not set' : '✅ Set');

  // Test chat completion (will fail without valid key)
  console.log('\n💬 Testing chat completion...');
  try {
    const response = await openaiService.chatCompletion('Hello, how can you help me with KalaMitra?');
    console.log('✅ Chat completion working (real AI)');
    console.log('Response preview:', response.substring(0, 50) + '...');
  } catch (error) {
    console.log('❌ Chat completion failed (expected without valid API key)');
    console.log('Error:', error.message);
  }

  // Test story generation (will fail without valid key)
  console.log('\n📖 Testing story generation...');
  try {
    const storyResult = await openaiService.generateStoryAndPrice(
      'Beautiful handcrafted blue pottery vase',
      'Jaipur, Rajasthan',
      'en'
    );
    console.log('✅ Story generation working (real AI)');
    console.log('Story preview:', storyResult.story.substring(0, 50) + '...');
  } catch (error) {
    console.log('❌ Story generation failed (expected without valid API key)');
    console.log('Error:', error.message);
  }

} catch (error) {
  console.error('❌ OpenAI service import failed:', error.message);
}

// Check chatbot service
try {
  console.log('\n🤖 Testing chatbot service...');
  const { chatbotService } = await import('./src/utils/chatbotService');
  console.log('✅ Chatbot service imported successfully');

  // Test fallback responses
  const response = await chatbotService.sendMessage('test-user', 'What payment methods do you accept?');
  console.log('✅ Chatbot fallback working');
  console.log('Response preview:', response.content.substring(0, 50) + '...');

} catch (error) {
  console.error('❌ Chatbot service failed:', error.message);
}

console.log('\n🎯 AI Integration Summary:');
console.log('• OpenAI API: Uses .env file (VITE_OPENAI_API_KEY)');
console.log('• Fallback: Pre-configured responses when API unavailable');
console.log('• Chatbot: Smart recommendations with suggested actions');
console.log('• Story Generation: AI-powered when API key valid');

console.log('\n💡 To enable real AI:');
console.log('1. Get OpenAI API key from https://platform.openai.com/api-keys');
console.log('2. Add to .env: VITE_OPENAI_API_KEY=your_real_key');
console.log('3. Restart development server');
console.log('4. Test at http://localhost:5174');
