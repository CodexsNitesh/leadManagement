const { GoogleGenerativeAI } = require('@google/generative-ai');
const { gemini } = require('../config/env');

const fallbackAnalysis = {
  category: 'General Inquiry',
  priority: 'Medium',
  summary: 'AI analysis is currently unavailable. Please review the requirement manually.',
};

const normalizePriority = (priority) => {
  const value = String(priority || '').toLowerCase();
  if (value.includes('high')) return 'High';
  if (value.includes('low')) return 'Low';
  return 'Medium';
};

const parseJsonFromText = (text) => {
  const cleaned = text.replace(/```json|```/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('Gemini response did not include JSON.');
  }
  return JSON.parse(match[0]);
};

const analyzeRequirement = async ({ fullName, company, requirement }) => {
  if (!gemini.apiKey || gemini.apiKey.startsWith('your_')) {
    return fallbackAnalysis;
  }

  try {
    const genAI = new GoogleGenerativeAI(gemini.apiKey);
    const model = genAI.getGenerativeModel({ model: gemini.model });

    const prompt = `
Analyze this sales/service lead. Return only valid JSON with keys:
category, priority, summary.

Rules:
- category should be short, business-friendly, and specific.
- priority must be exactly one of: High, Medium, Low.
- summary must be 1-2 concise sentences.

Lead name: ${fullName}
Company: ${company || 'Not provided'}
Requirement: ${requirement}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseJsonFromText(text);

    return {
      category: String(parsed.category || fallbackAnalysis.category).slice(0, 120),
      priority: normalizePriority(parsed.priority),
      summary: String(parsed.summary || fallbackAnalysis.summary).slice(0, 600),
    };
  } catch (error) {
    console.error('Gemini analysis failed:', error.message);
    return fallbackAnalysis;
  }
};

module.exports = { analyzeRequirement };
