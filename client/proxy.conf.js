const target = process.env.NG_APP_API_BASE_URL || 'http://localhost:5097';

module.exports = {
  '/api': {
    target,
    secure: false,
  },
};
