## 🤖 AI Integration

KalaMitra supports **real AI integration** with OpenAI's GPT models for enhanced story generation and pricing suggestions.

### Current Implementation

**✅ What's Already Built:**
- **Mock AI Service**: Provides realistic demo experience without API costs
- **OpenAI Integration**: Ready-to-use OpenAI service implementation
- **Fallback System**: Automatically falls back to mock service if API fails
- **Smart Pricing**: Category-based fair price calculations
- **Cultural Context**: Region-aware story generation

### Enabling Real AI (Optional)

**Step 1: Get OpenAI API Key**
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy your API key

**Step 2: Configure API Key**
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your API key:
   ```env
   VITE_OPENAI_API_KEY=your_actual_api_key_here
   ```

**Step 3: Restart Development Server**
```bash
npm run dev
```

### AI Features

**🎨 Story Generation**
- **Culturally Aware**: Considers Indian regions and traditions
- **Multilingual**: Generates stories in Hindi or English
- **Authentic Voice**: Maintains artisan storytelling style
- **Context-Rich**: Incorporates product materials and techniques

**💰 Smart Pricing**
- **Fair Market Value**: Suggests competitive prices
- **Category-Based**: Different pricing logic for pottery, textiles, jewelry, etc.
- **Complexity Aware**: Considers craftsmanship and materials
- **Regional Context**: Adjusts for local market conditions

**🔄 Fallback System**
- **Always Works**: App functions even without API key
- **Graceful Degradation**: Uses mock service if OpenAI fails
- **Cost Effective**: No API costs for demo/development
- **Production Ready**: Easy switch to paid AI when needed

### API Cost Estimation

**GPT-3.5-turbo (Recommended):**
- Input: ~$0.0015 per 1K tokens
- Output: ~$0.002 per 1K tokens
- **Per story generation**: ~$0.003-0.005

**Example Monthly Cost (1000 stories/day):**
- GPT-3.5-turbo: ~$90-150/month
- GPT-4 (premium): ~$300-500/month

### Advanced Configuration

```typescript
// In src/utils/openaiService.ts
const openaiService = new OpenAIService({
  apiKey: 'your-key',
  model: 'gpt-4',           // Use GPT-4 for better quality
  maxTokens: 1500,          // Longer responses
});
```

### Supported Models

- **gpt-3.5-turbo** (Default) - Fast, cost-effective
- **gpt-4** - Higher quality, more expensive
- **gpt-4-turbo-preview** - Latest model with vision capabilities

### Rate Limits & Best Practices

- **Monitor Usage**: Check OpenAI dashboard for API usage
- **Error Handling**: App gracefully handles API failures
- **Caching**: Consider caching frequent requests
- **Rate Limiting**: Implement delays between requests if needed

---

**🚀 Ready to Scale**: The AI integration is production-ready and can be easily enabled with an API key!
