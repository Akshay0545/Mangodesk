// utils/aiService.js
const Groq = require('groq-sdk');

/**
 * Design goals:
 * - Never echo the whole transcript
 * - Respect user's prompt
 * - Handle long transcripts by chunking + final merge
 * - Reasonable defaults, but allow model override via env
 */
class AIService {
  constructor() {
    this.groq = process.env.GROQ_API_KEY
      ? new Groq({ apiKey: process.env.GROQ_API_KEY })
      : null;

    this.model =
      process.env.GROQ_MODEL?.trim() ||
      'llama-3.3-70b-versatile'; // very strong for summarization

    if (!this.groq) {
      console.warn('⚠️  GROQ_API_KEY not found. Using naive local summarizer as fallback.');
    }
  }

  // ~12k characters per chunk (safe for chat input sizes)
  _chunk(text, size = 12000) {
    const s = String(text || '');
    const chunks = [];
    for (let i = 0; i < s.length; i += size) {
      chunks.push(s.slice(i, i + size));
    }
    return chunks.length ? chunks : [''];
  }

  _naiveSummary(transcript, prompt) {
    const lines = String(transcript).split('\n').map(s => s.trim()).filter(Boolean).slice(0, 12);
    return [
      '## Summary',
      ...lines.map(l => `- ${l}`),
    ].join('\n');
  }

  _systemPrompt() {
    return {
      role: 'system',
      content:
`You are an expert meeting-notes summarizer.
Rules (follow strictly):
- Do NOT repeat or quote the full transcript.
- Be concise and structured.
- If the user provides a custom instruction, follow it.
- Prefer Markdown with clear sections.
- Limit the whole output to ~250–350 words unless the user asks otherwise.

Default sections (include only when present):
## Summary
- ...

## Action Items (Owner — Task — Due)
- ...

## Decisions
- ...

## Risks / Follow-ups
- ...`
    };
  }

  async _summarizeChunk(chunk, prompt) {
    // Guard: if no Groq, fallback
    if (!this.groq) return this._naiveSummary(chunk, prompt);

    const messages = [
      this._systemPrompt(),
      {
        role: 'user',
        content:
`${prompt || 'Summarize clearly in concise bullet points.'}

Transcript (partial):
""" 
${chunk}
"""
Only provide the summary; do not quote the transcript lines verbatim.`
      }
    ];

    try {
      const completion = await this.groq.chat.completions.create({
        model: this.model,
        temperature: 0.2,
        max_tokens: 800,
        messages
      });

      const out = completion?.choices?.[0]?.message?.content?.trim();
      return out || this._naiveSummary(chunk, prompt);
    } catch (err) {
      console.error('AI chunk summary error:', err.message);
      return this._naiveSummary(chunk, prompt);
    }
  }

  async _mergeSummaries(partials, prompt) {
    // Guard: if one chunk only, return it
    if (partials.length === 1) return partials[0];

    if (!this.groq) {
      // naive merge
      return [
        '## Summary (Merged)',
        ...partials.map((p, i) => `### Part ${i + 1}\n${p}`)
      ].join('\n\n');
    }

    const messages = [
      this._systemPrompt(),
      {
        role: 'user',
        content:
`Combine these partial summaries into one cohesive summary.
Ensure no duplication, maximum clarity, and keep it within ~300 words.
Respect the instruction:

Instruction:
${prompt || 'Summarize clearly in concise bullet points.'}

Partial summaries:
${partials.map((p, i) => `--- Part ${i + 1} ---\n${p}`).join('\n\n')}
`
      }
    ];

    try {
      const completion = await this.groq.chat.completions.create({
        model: this.model,
        temperature: 0.2,
        max_tokens: 900,
        messages
      });
      return completion?.choices?.[0]?.message?.content?.trim() || partials.join('\n\n');
    } catch (err) {
      console.error('AI merge error:', err.message);
      return partials.join('\n\n');
    }
  }

  async generateSummary(transcript, prompt = 'Summarize clearly in concise bullet points.') {
    if (!transcript || !String(transcript).trim()) {
      return 'No transcript provided.';
    }

    const chunks = this._chunk(transcript);
    const partials = [];
    for (const c of chunks) {
      // eslint-disable-next-line no-await-in-loop
      const s = await this._summarizeChunk(c, prompt);
      partials.push(s);
    }
    const merged = await this._mergeSummaries(partials, prompt);

    // Final “polish” pass to strictly remove transcript echoes (lightweight)
    if (!this.groq) return merged;

    try {
      const messages = [
        this._systemPrompt(),
        {
          role: 'user',
          content:
`Polish the following summary.
- Keep within ~300 words
- No transcript quotes
- Keep Markdown headings & bullets
- Follow user's intent

User instruction:
${prompt}

Summary to polish:
${merged}`
        }
      ];
      const completion = await this.groq.chat.completions.create({
        model: this.model,
        temperature: 0.2,
        max_tokens: 800,
        messages
      });
      return completion?.choices?.[0]?.message?.content?.trim() || merged;
    } catch {
      return merged;
    }
  }

  async improveSummary(existingSummary, improvementPrompt) {
    if (!existingSummary) return '';
    if (!this.groq) return existingSummary;

    try {
      const messages = [
        this._systemPrompt(),
        {
          role: 'user',
          content:
`Improve this summary per the instructions. Do not add transcript lines.

Instructions:
${improvementPrompt || 'Tighten wording; keep structure and headings.'}

Summary:
${existingSummary}`
        }
      ];
      const completion = await this.groq.chat.completions.create({
        model: this.model,
        temperature: 0.2,
        max_tokens: 800,
        messages
      });
      return completion?.choices?.[0]?.message?.content?.trim() || existingSummary;
    } catch (err) {
      console.error('AI improve error:', err.message);
      return existingSummary;
    }
  }
}

module.exports = AIService;
