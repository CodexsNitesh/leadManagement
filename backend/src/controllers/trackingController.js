const Lead = require('../models/Lead');
const asyncHandler = require('../utils/asyncHandler');
const { isValidTrackingToken } = require('../utils/trackingToken');

const pixel = Buffer.from(
  'R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64'
);

const getClientIp = (req) => req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

const trackOpen = asyncHandler(async (req, res) => {
  if (!isValidTrackingToken(req.params.leadId, 'open', req.query.t)) {
    return res.status(403).end();
  }

  const lead = await Lead.findById(req.params.leadId);

  if (lead && !lead.emailTracking?.open?.openedAt) {
    lead.emailTracking = lead.emailTracking || {};
    lead.emailTracking.open = {
      openedAt: new Date(),
      userAgent: req.get('user-agent'),
      ip: getClientIp(req),
    };
    await lead.save();
  }

  res.set({
    'Content-Type': 'image/gif',
    'Content-Length': pixel.length,
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  });
  res.end(pixel);
});

const trackClick = asyncHandler(async (req, res) => {
  const destination = req.query.url;

  if (!isValidTrackingToken(req.params.leadId, 'click', req.query.t)) {
    return res.status(403).send('Invalid tracking token.');
  }

  if (!destination || !/^https?:\/\//i.test(destination)) {
    return res.status(400).send('Invalid redirect URL.');
  }

  const lead = await Lead.findById(req.params.leadId);
  if (lead) {
    lead.emailTracking = lead.emailTracking || {};
    lead.emailTracking.clicks = lead.emailTracking.clicks || [];
    lead.emailTracking.clicks.push({
      destination,
      clickedAt: new Date(),
      userAgent: req.get('user-agent'),
      ip: getClientIp(req),
    });
    await lead.save();
  }

  return res.redirect(destination);
});

module.exports = { trackOpen, trackClick };
