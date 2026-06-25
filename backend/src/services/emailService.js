const nodemailer = require('nodemailer');
const { baseUrl, frontendUrl, smtp } = require('../config/env');
const { createTrackingToken } = require('../utils/trackingToken');

const createTransporter = () =>
  nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth:
      smtp.user && smtp.pass
        ? {
            user: smtp.user,
            pass: smtp.pass,
          }
        : undefined,
  });

const verifyEmailConnection = async () => {
  if (!smtp.host || !smtp.user || !smtp.pass) {
    console.warn('Email credentials are not fully configured. Emails will be skipped.');
    return false;
  }

  try {
    await createTransporter().verify();
    console.log('Email transporter verified.');
    return true;
  } catch (error) {
    console.warn(`Email transporter verification failed: ${error.message}`);
    return false;
  }
};

const buildLeadEmail = (lead) => {
  const openToken = createTrackingToken(lead._id, 'open');
  const clickToken = createTrackingToken(lead._id, 'click');
  const trackingPixelUrl = `${baseUrl}/api/tracking/open/${lead._id}.png?t=${openToken}`;
  const destination = `${frontendUrl}/dashboard?lead=${lead._id}`;
  const trackableLink = `${baseUrl}/api/tracking/click/${lead._id}?t=${clickToken}&url=${encodeURIComponent(destination)}`;

  const text = [
    `Hi ${lead.fullName},`,
    '',
    'Thanks for reaching out. We received your requirement and our team will review it shortly.',
    '',
    `Requirement: ${lead.requirement}`,
    `AI Category: ${lead.aiAnalysis.category}`,
    `AI Priority: ${lead.aiAnalysis.priority}`,
    `AI Summary: ${lead.aiAnalysis.summary}`,
    '',
    `Trackable link: ${trackableLink}`,
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;color:#172033;line-height:1.6;max-width:640px;margin:0 auto;">
      <h2 style="color:#0f766e;">Hi ${lead.fullName},</h2>
      <p>Thanks for reaching out. We received your requirement and our team will review it shortly.</p>
      <div style="border:1px solid #dbe4ea;border-radius:8px;padding:16px;margin:20px 0;background:#f8fafc;">
        <p><strong>Requirement:</strong><br>${lead.requirement}</p>
        <p><strong>AI Category:</strong> ${lead.aiAnalysis.category}</p>
        <p><strong>AI Priority:</strong> ${lead.aiAnalysis.priority}</p>
        <p><strong>AI Summary:</strong><br>${lead.aiAnalysis.summary}</p>
      </div>
      <p>
        <a href="${trackableLink}" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:6px;">
          View your request
        </a>
      </p>
      <img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none;" />
    </div>
  `;

  return { html, text, trackableLink };
};

const sendLeadConfirmationEmail = async (lead) => {
  if (!smtp.host || !smtp.user || !smtp.pass) {
    console.warn('Skipping email send because SMTP is not configured.');
    return { skipped: true };
  }

  const { html, text } = buildLeadEmail(lead);
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: `"${smtp.fromName}" <${smtp.fromAddress}>`,
    to: lead.email,
    subject: `We received your request, ${lead.fullName}`,
    text,
    html,
  });

  return info;
};

module.exports = {
  verifyEmailConnection,
  sendLeadConfirmationEmail,
  buildLeadEmail,
};
