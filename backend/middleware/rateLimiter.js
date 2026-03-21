const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000000, // each IP can make 100 requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later."
  }
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 8, // 5 login attempts
  message: {
    success: false,
    message: "Too many login attempts. Try again later."
  }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  message: {
    message: "Too many accounts created. Try again later."
  }
});


const postLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 15,
    message: {
        message: "Too many posts created. Try again later."
    }
});

const commentLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 50,
    message: {
        message: "Too many comments. Please slow down."
    }
});

const likeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many likes. Slow down."
  }
});

module.exports = { apiLimiter, loginLimiter, registerLimiter, postLimiter, commentLimiter, likeLimiter };

exports.aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100,                   // 10 AI generations per hour per IP
    message: { success: false, message: "Too many AI requests, try again later" }
});