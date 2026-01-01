import { getHuggingFaceModel } from "../../../utils/huggingface";
import interests from "../../../utils/interests";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Missing title or content" });
  }

  try {
    const model = getHuggingFaceModel();

    const prompt = `You are a helpful assistant that categorizes blog posts. Based on this blog, suggest 3–5 interests.

Title: "${title}"
Content snippet: "${content.slice(0, 150)}"

Use ONLY from this list: [${interests.join(", ")}]

Respond with a JSON array only, nothing else. Example: ["Technology", "AI"]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let parsed = [];
    try {
      // Try to extract JSON array from the response
      const jsonMatch = text.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = JSON.parse(text.trim());
      }
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

