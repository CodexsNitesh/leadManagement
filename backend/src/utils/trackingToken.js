const crypto = require('crypto');
const { trackingSecret } = require('../config/env');

const createTrackingToken = (leadId, action) =>
  crypto.createHmac('sha256', trackingSecret).update(`${leadId}:${action}`).digest('hex');

const isValidTrackingToken = (leadId, action, token) => {
  if (!token) return false;
  const expected = createTrackingToken(leadId, action);
  const received = String(token);

  if (received.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected));
};

module.exports = { createTrackingToken, isValidTrackingToken };
