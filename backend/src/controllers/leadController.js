const Lead = require('../models/Lead');
const asyncHandler = require('../utils/asyncHandler');
const { analyzeRequirement } = require('../services/geminiService');
const { sendLeadConfirmationEmail } = require('../services/emailService');

const sendLeadEmailInBackground = (leadId) => {
  setImmediate(async () => {
    try {
      const lead = await Lead.findById(leadId);
      if (!lead) return;

      const emailInfo = await sendLeadConfirmationEmail(lead);
      if (emailInfo.skipped) {
        lead.emailTracking.status = 'skipped';
        lead.emailTracking.error = 'SMTP is not configured on the backend.';
      } else {
        lead.emailTracking.status = 'sent';
        lead.emailTracking.sent = true;
        lead.emailTracking.sentAt = new Date();
        lead.emailTracking.messageId = emailInfo.messageId;
      }
      await lead.save();
    } catch (error) {
      console.error(`Failed to send email for lead ${leadId}:`, error.message);
      await Lead.findByIdAndUpdate(leadId, {
        'emailTracking.status': 'failed',
        'emailTracking.error': error.message,
      });
    }
  });
};

const createLead = asyncHandler(async (req, res) => {
  const { fullName, email, phone, company, requirement } = req.body;

  const aiAnalysis = await analyzeRequirement({ fullName, company, requirement });

  const lead = await Lead.create({
    fullName,
    email,
    phone,
    company,
    requirement,
    aiAnalysis,
  });

  res.status(201).json({
    success: true,
    message: 'Lead captured successfully.',
    data: lead,
  });

  sendLeadEmailInBackground(lead._id);
});

const getLeads = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const [leads, total] = await Promise.all([
    Lead.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Lead.countDocuments(),
  ]);

  res.json({
    success: true,
    data: leads,
    meta: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  });
});

const getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found.' });
  }

  return res.json({ success: true, data: lead });
});

module.exports = {
  createLead,
  getLeads,
  getLeadById,
};
