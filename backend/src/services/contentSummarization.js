const OpenAI = require('openai');

class ContentSummarizationService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async summarizeContent(content, platform = 'TWITTER') {
    try {
      const maxLength = this.getMaxLength(platform);
      const prompt = this.generatePrompt(content, platform, maxLength);

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a professional social media content creator. Your task is to create engaging, 
                     concise summaries of blog posts that are optimized for social media sharing. The summary 
                     should maintain the key points while being attention-grabbing and shareable.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      throw new Error(`Error summarizing content: ${error.message}`);
    }
  }

  generatePrompt(content, platform, maxLength) {
    return `
      Please create a compelling ${platform.toLowerCase()} post summarizing the following blog content.
      The summary should be no longer than ${maxLength} characters and should:
      1. Capture the main value proposition
      2. Use engaging language
      3. Include relevant hashtags if appropriate
      4. End with a call to action when possible

      Blog content:
      ${content}
    `;
  }

  getMaxLength(platform) {
    const maxLengths = {
      TWITTER: 280,
      LINKEDIN: 3000
    };
    return maxLengths[platform] || 280;
  }

  async generateSummaryVariants(content, platform = 'TWITTER', count = 3) {
    try {
      const summaries = [];
      for (let i = 0; i < count; i++) {
        const summary = await this.summarizeContent(content, platform);
        summaries.push(summary);
      }
      return summaries;
    } catch (error) {
      throw new Error(`Error generating summary variants: ${error.message}`);
    }
  }
}

module.exports = new ContentSummarizationService();
