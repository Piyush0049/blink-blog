import { getHuggingFaceModel } from "../../../utils/huggingface";

function stripMarkdownToParagraphs(md) {
  if (!md) return '';
  let t = md;

  t = t.replace(/```[\s\S]*?```/g, '');

  t = t.replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^(-{3,}|_{3,}|\*{3,})$/gm, '');

  t = t.replace(/^\s{0,3}[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '');

  t = t.replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_{1,2}(.*?)_{1,2}/g, '$1')
    .replace(/`([^`]+)`/g, '$1');

  t = t.replace(/\n{3,}/g, '\n\n').trim();

  return t.split(/\n{2,}/).map(s => s.trim()).filter(Boolean).join('\n\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt, title, tone = 'professional', words = 700 } = req.body || {};
    if (!prompt && !title) {
      return res.status(400).json({ message: 'Provide a prompt or a title' });
    }

    const model = getHuggingFaceModel();

    const styleMap = {
      neutral: 'balanced, clear, informative',
      casual: 'friendly, conversational, simple',
      professional: 'concise, authoritative, formal',
      enthusiastic: 'energetic, engaging, vivid',
    };

    const fullPrompt = `You are drafting a blog post for general readers.
Tone: ${styleMap[tone] || styleMap.professional}
Target length: about ${words} words.
Structure: engaging intro, 3–6 short sections, and a concise conclusion.
Write in clear, flowing paragraphs (no markdown headers or bullet lists).

Title: ${title || '(decide a fitting title)'}
Topic: ${prompt || '(none provided)'}

Write the full article as plain paragraphs.`;

    const result = await model.generateContent(fullPrompt);
    const raw = result.response.text();
    const text = stripMarkdownToParagraphs(raw);

    if (!text) {
      return res.status(500).json({ message: 'No content generated' });
    }

    return res.status(200).json({ text });
  } catch (err) {
    console.error('AI generation failed:', err);

    if (err?.message?.includes('rate limit') || err?.message?.includes('429')) {
      return res.status(429).json({
        message: 'Hugging Face rate limit exceeded. Please try again later.',
      });
    }

    if (err?.message?.includes('Missing HUGGINGFACE_API_KEY')) {
      return res.status(500).json({
        message: 'Missing HUGGINGFACE_API_KEY environment variable.',
      });
    }

    return res.status(500).json({ message: 'AI generation failed', error: err.message });
  }
}

