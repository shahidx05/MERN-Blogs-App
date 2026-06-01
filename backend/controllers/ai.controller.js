const { aiLimiter } = require('../middleware/rateLimiter');

//  applyRateLimit — run aiLimiter AFTER validation passes so that
//  invalid requests (title too short, content too short, etc.) do
//  NOT consume the user's rate-limit quota.

const applyRateLimit = (req, res) =>
    new Promise((resolve, reject) => {
        aiLimiter(req, res, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });

const FREE_MODELS = [
    "openrouter/free",
    "stepfun/step-3.5-flash:free",
    "nvidia/nemotron-nano-9b-v2:free"
];

const htmlToPlainText = (html) =>
    html
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const cleanHtml = (raw) =>
    raw
        .replace(/^```html\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/g, "")
        .trim();

const callAI = async (prompt) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw Object.assign(new Error("Server configuration error."), { code: "NO_API_KEY" });
    }

    let lastError = null;

    for (const model of FREE_MODELS) {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://github.com",
                    "X-Title": "Blogify",
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: "user", content: prompt }],
                }),
            });

            if (response.status === 429) {
                throw Object.assign(new Error("AI rate limit reached. Please try again later."), {
                    code: "RATE_LIMITED",
                });
            }

            const data = await response.json();

            if (response.ok && data.choices?.[0]?.message?.content) {
                return data.choices[0].message.content;
            }

            lastError = new Error(data.error?.message || "Model returned empty response.");
        } catch (err) {
            if (err.code === "RATE_LIMITED") throw err;
            lastError = err;
        }
    }

    throw Object.assign(
        lastError || new Error("All AI models failed."),
        { code: "AI_UNAVAILABLE" }
    );
};

const sendError = (res, err) => {
    if (err.code === "RATE_LIMITED") {
        return res.status(429).json({ success: false, message: err.message, code: "RATE_LIMITED" });
    }
    if (err.code === "NO_API_KEY") {
        return res.status(500).json({ success: false, message: err.message, code: "CONFIG_ERROR" });
    }
    if (err.code === "AI_UNAVAILABLE") {
        return res.status(503).json({
            success: false,
            message: "AI is temporarily unavailable. Please try again in a moment.",
            code: "AI_UNAVAILABLE",
        });
    }
    return res.status(500).json({ success: false, message: "Internal server error.", code: "SERVER_ERROR" });
};

exports.generatePost = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || title.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: "Title must be at least 3 characters.",
                code: "INVALID_INPUT",
            });
        }

        await applyRateLimit(req, res);
        if (res.headersSent) return; 

        const prompt = `Write a well-structured, engaging blog post about: "${title.trim()}".

CRITICAL INSTRUCTIONS:
- Return clean HTML, Never use markdown backticks.
- Use ONLY these tags: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <s>, <blockquote>, <code>, <pre>, <hr>, <a>.
- For code: use <code> for inline, and <pre><code>...</code></pre> for multi-line.
- Do NOT include <html>, <head>, <body>, or <h1> tags.
- Do NOT include any explanatory text before or after the HTML.
- Length: 300-500 words.
- Make it professional, insightful, and well-written.`;

        const raw = await callAI(prompt);

        if (!raw || !raw.trim()) {
            return res.status(503).json({
                success: false,
                message: "AI returned an empty response. Please try again.",
                code: "EMPTY_RESPONSE",
            });
        }

        return res.status(200).json({ success: true, content: cleanHtml(raw) });
    } catch (err) {
        return sendError(res, err);
    }
};
exports.rewriteContent = async (req, res) => {
    try {
        const { content, title } = req.body;

        if (!content) {
            return res.status(400).json({ success: false, message: "Content is required.", code: "INVALID_INPUT" });
        }

        const plainText = htmlToPlainText(content);
        if (plainText.length < 30) {
            return res.status(400).json({
                success: false,
                message: "Content is too short to rewrite. Write at least 30 characters first.",
                code: "CONTENT_TOO_SHORT",
            });
        }

        await applyRateLimit(req, res);
        if (res.headersSent) return;

        const titleContext = title ? ` The post is titled: "${title.trim()}".` : "";

        const prompt = `Rewrite the following blog post content completely.${titleContext}

ORIGINAL CONTENT (HTML):
${content}

CRITICAL INSTRUCTIONS:
- Return clean HTML, Never use markdown backticks.
- Use ONLY these tags: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <s>, <blockquote>, <code>, <pre>, <hr>, <a>.
- For code: use <code> for inline, and <pre><code>...</code></pre> for multi-line.
- Do NOT include any explanatory text before or after the HTML.
- Preserve the original meaning and key points but rewrite in fresh language.
- Keep similar structure and length.
- Do NOT add <h1>, <html>, <head>, or <body> tags.`;

        const raw = await callAI(prompt);

        if (!raw || !raw.trim()) {
            return res.status(503).json({
                success: false,
                message: "AI returned an empty response. Please try again.",
                code: "EMPTY_RESPONSE",
            });
        }

        return res.status(200).json({ success: true, content: cleanHtml(raw) });
    } catch (err) {
        return sendError(res, err);
    }
};

exports.improveWriting = async (req, res) => {
    try {
        const { content, title } = req.body;

        if (!content) {
            return res.status(400).json({ success: false, message: "Content is required.", code: "INVALID_INPUT" });
        }

        const plainText = htmlToPlainText(content);
        if (plainText.length < 30) {
            return res.status(400).json({
                success: false,
                message: "Content is too short to improve. Write at least 30 characters first.",
                code: "CONTENT_TOO_SHORT",
            });
        }
        await applyRateLimit(req, res);
        if (res.headersSent) return;

        const titleContext = title ? ` The post is titled: "${title.trim()}".` : "";

        const prompt = `Improve the writing quality of the following blog post content.${titleContext}

ORIGINAL CONTENT (HTML):
${content}

CRITICAL INSTRUCTIONS:
- Return clean HTML, Never use markdown backticks.
- Use ONLY these tags: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <s>, <blockquote>, <code>, <pre>, <hr>, <a>.
- For code: use <code> for inline, and <pre><code>...</code></pre> for multi-line.
- Improve: sentence structure, clarity, readability, and tone.
- Do NOT include any explanatory text before or after the HTML.
- Keep the same meaning, structure, and approximate length.
- Do NOT add <h1>, <html>, <head>, or <body> tags.`;

        const raw = await callAI(prompt);

        if (!raw || !raw.trim()) {
            return res.status(503).json({
                success: false,
                message: "AI returned an empty response. Please try again.",
                code: "EMPTY_RESPONSE",
            });
        }

        return res.status(200).json({ success: true, content: cleanHtml(raw) });
    } catch (err) {
        return sendError(res, err);
    }
};
exports.shortenContent = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ success: false, message: "Content is required.", code: "INVALID_INPUT" });
        }

        const plainText = htmlToPlainText(content);
        if (plainText.length < 30) {
            return res.status(400).json({
                success: false,
                message: "Content is too short to shorten. Write at least 30 characters first.",
                code: "CONTENT_TOO_SHORT",
            });
        }

        await applyRateLimit(req, res);
        if (res.headersSent) return;

        const prompt = `Shorten the following blog post content significantly.

ORIGINAL CONTENT (HTML):
${content}

CRITICAL INSTRUCTIONS:
- Return clean HTML, Never use markdown backticks.
- Use ONLY these tags: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <s>, <blockquote>, <code>, <pre>, <hr>, <a>.
- For code: use <code> for inline, and <pre><code>...</code></pre> for multi-line.
- Do NOT include any explanatory text before or after the HTML.
- Preserve key information.
- Target: roughly 40-60% of the original length.
- Do NOT add <h1>, <html>, <head>, or <body> tags.`;

        const raw = await callAI(prompt);

        if (!raw || !raw.trim()) {
            return res.status(503).json({
                success: false,
                message: "AI returned an empty response. Please try again.",
                code: "EMPTY_RESPONSE",
            });
        }

        return res.status(200).json({ success: true, content: cleanHtml(raw) });
    } catch (err) {
        return sendError(res, err);
    }
};

exports.expandContent = async (req, res) => {
    try {
        const { content, title } = req.body;

        if (!content) {
            return res.status(400).json({ success: false, message: "Content is required.", code: "INVALID_INPUT" });
        }

        const plainText = htmlToPlainText(content);
        if (plainText.length < 30) {
            return res.status(400).json({
                success: false,
                message: "Content is too short to expand. Write at least 30 characters first.",
                code: "CONTENT_TOO_SHORT",
            });
        }

        await applyRateLimit(req, res);
        if (res.headersSent) return;

        const titleContext = title ? ` The post is titled: "${title.trim()}".` : "";

        const prompt = `Expand and enrich the following blog post content.${titleContext}

ORIGINAL CONTENT (HTML):
${content}

CRITICAL INSTRUCTIONS:
- Return clean HTML, Never use markdown backticks.
- Use ONLY these tags: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <s>, <blockquote>, <code>, <pre>, <hr>, <a>.
- For code: use <code> for inline, and <pre><code>...</code></pre> for multi-line.
- Do NOT include any explanatory text before or after the HTML.
- Add relevant explanations, examples, and deeper insights.
- Target: roughly 150-200% of the original length.
- Do NOT add <h1>, <html>, <head>, or <body> tags.`;

        const raw = await callAI(prompt);

        if (!raw || !raw.trim()) {
            return res.status(503).json({
                success: false,
                message: "AI returned an empty response. Please try again.",
                code: "EMPTY_RESPONSE",
            });
        }

        return res.status(200).json({ success: true, content: cleanHtml(raw) });
    } catch (err) {
        return sendError(res, err);
    }
};

exports.fixGrammar = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ success: false, message: "Content is required.", code: "INVALID_INPUT" });
        }

        const plainText = htmlToPlainText(content);
        if (plainText.length < 10) {
            return res.status(400).json({
                success: false,
                message: "Content is too short. Write at least 10 characters first.",
                code: "CONTENT_TOO_SHORT",
            });
        }

        await applyRateLimit(req, res);
        if (res.headersSent) return;

        const prompt = `Fix grammar, spelling, and punctuation in the following blog post content.

ORIGINAL CONTENT (HTML):
${content}

CRITICAL INSTRUCTIONS:
- Return clean HTML, Never use markdown backticks.
- Preserve ALL existing HTML tags exactly as they are.
- Do NOT include any explanatory text before or after the HTML.
- Only fix grammar, spelling, punctuation, and capitalization errors.
- Do NOT change wording, tone, structure, or meaning.
- Do NOT add or remove content.`;

        const raw = await callAI(prompt);

        if (!raw || !raw.trim()) {
            return res.status(503).json({
                success: false,
                message: "AI returned an empty response. Please try again.",
                code: "EMPTY_RESPONSE",
            });
        }

        return res.status(200).json({ success: true, content: cleanHtml(raw) });
    } catch (err) {
        return sendError(res, err);
    }
};