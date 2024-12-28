const OpenAI = require("openai");
const { SocialPlatform } = require("../config/platforms");

class ContentSummarizationService {
	constructor() {
		this.openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		});
	}

	async summarizeContent(content, platform = SocialPlatform.TWITTER) {
		try {
			const maxLength = this.getMaxLength(platform);
			const prompt = this.generatePrompt(content, platform, maxLength);

			const response = await this.openai.chat.completions.create({
				model: "gpt-3.5-turbo",
				messages: [
					{
						role: "system",
						content:
							"You are a social media expert who creates engaging and concise content.",
					},
					{
						role: "user",
						content: prompt,
					},
				],
				temperature: 0.7,
				max_tokens: maxLength,
				top_p: 1.0,
				frequency_penalty: 0.0,
				presence_penalty: 0.0,
			});

			return response.choices[0].message.content.trim();
		} catch (error) {
			throw new Error(`Error summarizing content: ${error.message}`);
		}
	}

	generatePrompt(content, platform, maxLength) {
		return `
      Summarize the following content for ${platform} in under ${maxLength} characters. 
      Make it engaging and appropriate for the platform's style:

      ${content}
    `;
	}

	getMaxLength(platform) {
		const maxLengths = {
			[SocialPlatform.TWITTER]: 280,
			[SocialPlatform.LINKEDIN]: 3000,
		};
		return maxLengths[platform] || 280;
	}

	async generateSummaryVariants(
		content,
		platform = SocialPlatform.TWITTER,
		count = 3
	) {
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
