import mongoose from 'mongoose'

export const PROSPECT_STATUSES = [
  'new', // found or added, not researched yet
  'draft', // email drafted, waiting for my approval
  'needs_email', // drafted but no contact email known
  'approved', // approved, waiting to be sent (daily limit)
  'sent', // first email sent
  'followup_1',
  'followup_2', // sequence finished
  'replied',
  'stopped',
  'unsubscribed',
  'skipped',
  'failed',
] as const

/** A company I might work for, found by the AI or added by me. */
const ProspectSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    website: String,
    domain: { type: String, index: true },
    email: { type: String, index: true },
    contactName: String,
    industry: String,
    country: String,
    source: { type: String, default: 'manual' }, // manual | csv | discovered
    sourceNote: String, // e.g. the search target, or why the AI picked it

    // Research by the AI
    summary: String,
    likelyNeeds: [String],
    fit: { type: String, enum: ['good', 'maybe', 'poor'], default: 'maybe' },

    status: { type: String, enum: PROSPECT_STATUSES, default: 'new', index: true },
    draft: { subject: String, body: String },
    emails: [
      {
        kind: { type: String, enum: ['initial', 'followup_1', 'followup_2'] },
        subject: String,
        body: String,
        sentAt: Date,
        providerId: String,
        _id: false,
      },
    ],
    nextSendAt: Date,
    lastError: String,

    refCode: { type: String, index: { unique: true, sparse: true } },
    unsubscribeToken: { type: String, index: true },
    telegramMessageId: Number,
    visitCount: { type: Number, default: 0 },
    lastVisitAt: Date,
  },
  { timestamps: true }
)

export default mongoose.models.Prospect || mongoose.model('Prospect', ProspectSchema)
