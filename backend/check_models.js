const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = ['gemini-1.5-flash', 'gemini-1.0-pro'];
    
    for (const m of models) {
        try {
            console.log(`Checking ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("hello");
            console.log(`✅ Model ${m} is working! Response: ${result.response.text()}`);
            process.exit(0);
        } catch (e) {
            console.log(`❌ Model ${m} failed: ${e.message}`);
        }
    }
  } catch (err) {
    console.error("General Error:", err);
  }
}

listModels();
