import { generateFemoraResponse } from "../services/openaiService.js";

export const chatWithFemora = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const reply = await generateFemoraResponse(message);

    res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error("Femora AI Error:", error);

    res.status(500).json({
      message: "AI is not responding",
    });
  }
};