import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Initialize the Google Generative AI client with v1 endpoint
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the model - using gemini-2.5-flash-lite (stable 2026 model)
    const model = genAI.getGenerativeModel(
      { model: "gemini-2.5-flash-lite" },
      { apiVersion: "v1" }
    );

    // Extract base64 data from data URL
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // Prepare the image part for the API
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg",
      },
    };

    // The expert grocer prompt - returns structured JSON with quality-based recommendations
    const prompt = `You are an expert grocer and fruit quality analyst. Analyze the fruit in the image thoroughly. 

Provide:
1. A freshness rating from 1-10 (10 being perfectly fresh)
2. A definitive consumption verdict
3. Estimated remaining shelf life
4. Alternative uses if overripe
5. The type of fruit detected
6. Quality-based recommended uses - this is VERY IMPORTANT:
   - For rating 8-10 (Excellent): ["Fresh Eating", "Premium Gift Baskets", "Restaurant Grade", "Smoothies", "Fruit Salads"]
   - For rating 6-7 (Good): ["Fresh Juice", "Smoothies", "Cooking", "Baking", "Jam Making"]
   - For rating 4-5 (Fair): ["Cooking Only", "Baking", "Face Mask", "Hair Treatment", "Vinegar Making"]
   - For rating 1-3 (Poor): ["Composting", "Plant Fertilizer", "Animal Feed Only"]

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "rating": <number 1-10>,
  "consumeStatus": "<YES | NO | PROCEED WITH CAUTION>",
  "shelfLife": "<duration string like '2-3 Days' or '1 Week'>",
  "verdict": "<brief honest assessment of the fruit's current state and quality>",
  "alternativeUses": ["<use 1>", "<use 2>", "<use 3>"],
  "fruitType": "<detected fruit type - capitalize first letter>",
  "recommendedUses": ["<use based on quality rating>", "<use 2>", "<use 3>", "<use 4>", "<use 5>"],
  "qualityGrade": "<Excellent | Good | Fair | Poor>",
  "priceEstimate": <number - estimated price in INR per kg based on quality>
}`;

    // Generate content with the image
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error("[v0] Full error object:", error);
    console.error("[v0] Error message:", error instanceof Error ? error.message : "Unknown error");
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack");
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze image" },
      { status: 500 }
    );
  }
}
