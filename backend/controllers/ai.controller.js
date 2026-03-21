const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


exports.generatePost = async (req, res) => {
    console.log("hello")
    try {
        console.log("API KEY:", process.env.GEMINI_API_KEY ? "loaded" : "MISSING");
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
You are a professional blog writer. Write a well-structured, engaging blog post based on the title below.

Title: "${title}"

Requirements:
- Write in a clear, conversational tone suitable for a developer/tech blog
- Use proper HTML formatting with these tags only: <h2>, <h3>, <p>, <ul>, <li>, <ol>, <strong>, <em>, <code>, <pre>
- Include an introduction, 3-5 main sections with headings, and a conclusion
- Each section should have 2-3 paragraphs
- Use <code> for inline code and <pre><code> for code blocks if relevant
- Do NOT include <html>, <head>, <body>, <h1> tags
- Do NOT include the title itself in the content
- Do NOT include any markdown, only HTML
- Aim for 400-600 words

Return only the HTML content, nothing else.
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.status(200).json({
            success: true,
            content: text,
        });

    } catch (error) {
        console.log("Full error:", error); // ← change this line
        res.status(500).json({ success: false, message: error.message });
    }
};