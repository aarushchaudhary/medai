const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const getAiResponse = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting response from AI:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};

module.exports = { getAiResponse };