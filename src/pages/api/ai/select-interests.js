import { GoogleGenerativeAI } from "@google/generative-ai";
import interests from "../../../utils/interests";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Missing title or content" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Suggest 3–5 interests based on this blog:
Title: "${title}"
Content snippet: "${content.slice(0, 150)}"

Use only from this list: [${interests.join(", ")}]
Return JSON array only, e.g. ["Technology", "AI"].
`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    let parsed = [];
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text
        .split(/,|\n|-/)
        .map((s) => s.trim().replace(/["\[\]]/g, ""))
        .filter((s) => interests.includes(s));
    }

    const filtered = parsed.filter((i) => interests.includes(i));

    return res.status(200).json({ interests: filtered });
  } catch (err) {
    console.error("AI interest selection error:", err);
    return res.status(500).json({ error: "AI failed to generate interests" });
  }
}
