const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Helper function to convert file to a generative part
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

// --- UPDATED FUNCTION ---
const getAiResponse = async (prompt, file = null) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    if (file) {
      const imagePart = fileToGenerativePart(file.path, file.mimetype);
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    } else {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    }

  } catch (error) {
    console.error("Error getting response from AI:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};

module.exports = { getAiResponse };