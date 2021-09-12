const rateLimit = require('express-rate-limit')


const rateLimiter =rateLimit({
    windowMs:10 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests, please try again later",
    headers: true,
  });



module.exports = rateLimiter;