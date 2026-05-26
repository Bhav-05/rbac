const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, action, details = '') => {
  try {
    await ActivityLog.create({ userId, action, details });
  } catch (err) {
    // Logging must never crash the main request
    console.error('Activity log failed:', err.message);
  }
};

module.exports = logActivity;