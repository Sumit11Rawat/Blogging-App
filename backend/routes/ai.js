const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post("/improve", verifyToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "AI features are not configured on the server." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert copywriter and editor. Your task is to take the following blog post draft and improve its grammar, tone, flow, and readability while maintaining the original meaning and author's voice. 
Do NOT add any introductory or concluding conversational text (like "Here is the improved version"). Return ONLY the improved text.

Draft to improve:
${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ improvedContent: text.trim() });
  } catch (err) {
    console.error("AI Improve Error:", err);
    res.status(500).json({ message: "Failed to improve content via AI." });
  }
});

module.exports = router;
