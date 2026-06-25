const mongoose = require('mongoose');

const emailEventSchema = new mongoose.Schema(
  {
    openedAt: Date,
    userAgent: String,
    ip: String,
  },
  { _id: false }
);

const clickEventSchema = new mongoose.Schema(
  {
    clickedAt: {
      type: Date,
      default: Date.now,
    },
    destination: {
      type: String,
      required: true,
    },
    userAgent: String,
    ip: String,
  },
  { _id: false }
);

const leadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      minlength: 7,
      maxlength: 30,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 160,
      default: '',
    },
    requirement: {
      type: String,
      required: [true, 'Requirement is required'],
      trim: true,
      minlength: 10,
      maxlength: 3000,
    },
    aiAnalysis: {
      category: {
        type: String,
        default: 'General Inquiry',
      },
      priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium',
      },
      summary: {
        type: String,
        default: 'Summary unavailable.',
      },
    },
    emailTracking: {
      sent: {
        type: Boolean,
        default: false,
      },
      sentAt: Date,
      messageId: String,
      open: emailEventSchema,
      clicks: [clickEventSchema],
    },
  },
  { timestamps: true }
);

leadSchema.virtual('hasOpened').get(function hasOpened() {
  return Boolean(this.emailTracking?.open?.openedAt);
});

leadSchema.virtual('clickCount').get(function clickCount() {
  return this.emailTracking?.clicks?.length || 0;
});

leadSchema.set('toJSON', { virtuals: true });
leadSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Lead', leadSchema);
