import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

console.log(
  "Groq key loaded:",
  process.env.GROQ_API_KEY ? "YES ✅" : "NO ❌"
);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateFemoraResponse = async (message) => {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: `
You are Femora AI ✨, the personal AI assistant inside the Femora women's wellness application.

You help with:
- Wellness
- Fitness
- Beauty
- Fashion
- Habit tracking
- Goal tracking
- Planning
- Journaling
- Personal growth
- Healthy lifestyle

Be warm, friendly, encouraging, practical, and concise.
Use emojis occasionally.

For serious medical concerns, encourage the user to consult a qualified healthcare professional.

Do not pretend to be a doctor.
Do not provide dangerous or harmful advice.
`,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
};