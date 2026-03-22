// ai.controller.js

// These are the verified, currently active free models on OpenRouter as of March 2026
const FREE_MODELS = [
    "openrouter/free", // The official auto-router
    "stepfun/step-3.5-flash:free",
    "nvidia/nemotron-nano-9b-v2:free"
];

exports.generatePost = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error("CRITICAL: OPENROUTER_API_KEY is missing in .env file");
            return res.status(500).json({ success: false, message: "Server configuration error." });
        }

        const prompt = `Write a well-structured, engaging blog post about: "${title}".
        CRITICAL INSTRUCTIONS:
        - Output ONLY valid HTML. Do not wrap it in markdown backticks.
        - Use ONLY these tags: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <code>.
        - Do NOT include <html>, <head>, <body>, or <h1> tags.
        - Length: Around 300 words.`;

        let successfulContent = null;

        // 1. Try the live OpenRouter Models
        for (const model of FREE_MODELS) {
            console.log(`[AI Trigger] Trying model: ${model}...`);
            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://github.com", 
                        "X-Title": "Local-Testing"
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [{ role: "user", content: prompt }]
                    }),
                });

                const data = await response.json();

                if (response.ok && data.choices?.[0]?.message?.content) {
                    successfulContent = data.choices[0].message.content;
                    console.log(`[AI Success] Generated using: ${model}`);
                    break; 
                } else {
                    console.warn(`[AI Warning] ${model} failed:`, data.error?.message || "Unknown error");
                }
            } catch (fetchError) {
                console.warn(`[AI Warning] Network error with ${model}:`, fetchError.message);
            }
        }

        // 2. THE SAFETY NET: If OpenRouter completely fails, use a mock response
        // This ensures your React frontend NEVER crashes during testing.
        if (!successfulContent) {
            console.warn("[AI FATAL] OpenRouter blocked the request. Falling back to Mock Data for frontend testing.");
            successfulContent = `
                <h2>Introduction to ${title}</h2>
                <p>This is a simulated blog post because the AI provider was temporarily unavailable. However, your backend routing is working perfectly!</p>
                <h3>Key Concepts</h3>
                <ul>
                    <li><strong>Concept 1:</strong> Your frontend state management is correct.</li>
                    <li><strong>Concept 2:</strong> You can safely render this HTML.</li>
                </ul>
                <p>Once you get a permanent API key, real AI content will appear here instead of this placeholder.</p>
            `;
        }

        // 3. Clean up the HTML response (Strip markdown backticks if AI was used)
        let cleanHtml = successfulContent.replace(/^```html\s*/i, "").replace(/```$/, "").trim();

        // 4. Send successful response to frontend
        return res.status(200).json({ 
            success: true, 
            content: cleanHtml 
        });

    } catch (error) {
        console.error("[AI Server Error]:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};