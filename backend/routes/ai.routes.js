const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const ai = require('../controllers/ai.controller');

// All AI routes require authentication.
// Rate limiting is applied INSIDE each controller, only after validation passes,
// so failed validation requests do NOT consume rate-limit quota.
router.post('/generate',     authMiddleware, ai.generatePost);
router.post('/rewrite',      authMiddleware, ai.rewriteContent);
router.post('/improve',      authMiddleware, ai.improveWriting);
router.post('/shorten',      authMiddleware, ai.shortenContent);
router.post('/expand',       authMiddleware, ai.expandContent);
router.post('/fix-grammar',  authMiddleware, ai.fixGrammar);

module.exports = router;