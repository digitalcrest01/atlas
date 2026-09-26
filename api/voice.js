// Vercel function: every spoken line in the app comes from here. See _voice.js.
const { handleVoice } = require('./_voice.js');

module.exports = function handler(req, res) {
  return handleVoice(req, res, process.env);
};
