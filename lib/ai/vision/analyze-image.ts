// lib/analyze-image.ts
import OpenAI from "openai";
import Tesseract from "tesseract.js";
import { ragSystem } from "../../rag/rag-system";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Analyse une image :
 * - OCR (texte brut)
 * - Vision-Language (description visuelle)
 */
export async function analyzeImage(filePath: string, fileName: string) {
    console.log(`🔍 Analyzing image: ${fileName}`);

    // 1. OCR avec Tesseract.js
    let extractedText = "";
    try {
        const ocrResult = await Tesseract.recognize(filePath, "eng");
        extractedText = ocrResult.data.text.trim();
        console.log(`📝 OCR extracted ${extractedText.length} chars`);
    } catch (err) {
        console.error("❌ OCR failed", err);
    }

    // 2. Analyse visuelle avec GPT-4o-mini
    let visualDescription = "";
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini", // modèle multimodal
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Describe this image in detail for knowledge base context." },
                        {
                            type: "image_url",
                            image_url: { url: `file://${filePath}` }, // support direct path si dispo
                        },
                    ],
                },
            ],
        });

        visualDescription = response.choices[0]?.message?.content || "";
        console.log(`🖼️ Visual description extracted (${visualDescription.length} chars)`);
    } catch (err) {
        console.error("❌ Visual analysis failed", err);
    }

    // 3. Injection dans ton RAG
    if (extractedText) {
        await ragSystem.addTextDocument({
            content: extractedText,
            type: "note",
            id: `ocr_${Date.now()}`,
            title: `OCR - ${fileName}`,
            temporary: true,
        });
    }

    if (visualDescription) {
        await ragSystem.addTextDocument({
            content: visualDescription,
            type: "note",
            id: `img_analysis_${Date.now()}`,
            title: `Image Analysis - ${fileName}`,
            temporary: true,
        });
    }

    console.log("✅ Image processed and added to RAG");
}
