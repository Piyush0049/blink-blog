import { GoogleGenerativeAI } from '@google/generative-ai';

function stripMarkdownToParagraphs(md) {
  if (!md) return '';
  let t = md;

  t = t.replace(/```[\s\S]*?```/g, '');

  // strip headings / blockquotes / horizontal rules
  t = t.replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^(-{3,}|_{3,}|\*{3,})$/gm, '');

  // remove list markers, keep text
  t = t.replace(/^\s{0,3}[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '');

  // remove emphasis markers
  t = t.replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_{1,2}(.*?)_{1,2}/g, '$1')
    .replace(/`([^`]+)`/g, '$1');

  // collapse blank lines
  t = t.replace(/\n{3,}/g, '\n\n').trim();

  return t.split(/\n{2,}/).map(s => s.trim()).filter(Boolean).join('\n\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'Missing GEMINI_API_KEY' });
  }

  try {
    const { prompt, title, tone = 'professional', words = 700 } = req.body || {};
    if (!prompt && !title) {
      return res.status(400).json({ message: 'Provide a prompt or a title' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const styleMap = {
      neutral: 'balanced, clear, informative',
      casual: 'friendly, conversational, simple',
      professional: 'concise, authoritative, formal',
      enthusiastic: 'energetic, engaging, vivid',
    };

    const system = `
You are drafting a blog post for general readers.
Tone: ${styleMap[tone] || styleMap.professional}
Target length: about ${words} words.
Structure: engaging intro, 3–6 short sections, and a concise conclusion.
Write in clear, flowing paragraphs (no markdown headers or bullet lists).`;

    const user = `
Title: ${title || '(decide a fitting title)'}
Topic: ${prompt || '(none provided)'}
Write the full article as plain paragraphs.
`;

    const result = await model.generateContent([
      { text: system + '\n\n' + user }
    ]);

    const raw = result?.response?.text?.() || '';
    const text = stripMarkdownToParagraphs(raw);

    if (!text) {
      return res.status(500).json({ message: 'No content generated' });
    }

    return res.status(200).json({ text });
  } catch (err) {
    console.error('AI generation failed:', err);

    if (err?.status === 403) {
      return res.status(500).json({
        message: 'Gemini API is disabled for your Google Cloud project. Enable "Generative Language API" in Google Cloud Console and ensure billing is active.',
      });
    }

    return res.status(500).json({ message: 'AI generation failed' });
  }
}
