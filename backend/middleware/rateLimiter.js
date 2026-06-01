const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later."
  }
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 8,
  message: {
    success: false,
    message: "Too many login attempts. Try again later."
  }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Too many accounts created. Try again later."
  }
});

const postLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many posts created. Try again later."
  }
});

const commentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: "Too many comments. Please slow down."
  }
});

const likeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 40,
  message: {
    success: false,
    message: "Too many likes. Slow down."
  }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many AI requests, try again later." }
});

module.exports = { apiLimiter, loginLimiter, registerLimiter, postLimiter, commentLimiter, likeLimiter, aiLimiter };