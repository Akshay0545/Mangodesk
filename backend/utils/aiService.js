const Groq = require('groq-sdk');

let groq;
try {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
} catch (error) {
  console.warn('⚠️  GROQ_API_KEY not found. AI service will use mock responses.');
}

class AIService {
  async generateSummary(transcript, prompt = 'Generate a concise summary of this transcript') {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert at summarizing transcripts. Create clear, concise summaries that capture the key points and main ideas. Focus on actionable insights and important takeaways.'
          },
          {
            role: 'user',
            content: `${prompt}\n\nTranscript:\n${transcript}`
          }
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 1000,
      });

      return completion.choices[0]?.message?.content || 'Summary generation failed';
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate summary');
    }
  }

  async improveSummary(existingSummary, improvementPrompt) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert editor. Improve the following summary based on the user\'s instructions while maintaining clarity and conciseness.'
          },
          {
            role: 'user',
            content: `Improve this summary: ${existingSummary}\n\nInstructions: ${improvementPrompt}`
          }
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.5,
        max_tokens: 1000,
      });

      return completion.choices[0]?.message?.content || existingSummary;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to improve summary');
    }
  }
}

module.exports = AIService;
