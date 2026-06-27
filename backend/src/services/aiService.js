const { GoogleGenAI } = require("@google/genai");
const buildGeneratePrompt = require("../prompts/generatePrompt");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateProposal = async (idea) => {
    console.log("1. Building prompt...");
    const prompt = buildGeneratePrompt(idea);

    console.log("2. Calling Gemini...");
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    console.log("3. Full response:");
    console.dir(response, { depth: null });

    const text = response.text;

    console.log("4. Response text:");
    console.log(text);

    const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    console.log("5. Clean text:");
    console.log(cleanText);

    const proposal = JSON.parse(cleanText);

    console.log("6. JSON parsed successfully.");

    return proposal;
};

module.exports = {
    generateProposal,
};