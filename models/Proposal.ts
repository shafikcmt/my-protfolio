import mongoose from 'mongoose'

export const PROPOSAL_STATUSES = ['sent', 'viewed', 'accepted', 'payment_reported', 'paid', 'withdrawn'] as const

const PackageSchema = new mongoose.Schema(
  { name: String, priceUsd: Number, timeline: String, includes: [String], recommended: Boolean },
  { _id: false }
)

/** A priced proposal shared with a client at /proposal/<token>. */
const ProposalSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', index: true },
    clientName: String,
    clientEmail: String,
    clientPhone: String,
    title: { type: String, required: true },
    summary: String,
    packages: [PackageSchema],
    notes: String,
    validUntil: Date,
    status: { type: String, enum: PROPOSAL_STATUSES, default: 'sent', index: true },
    viewedAt: Date,
    accepted: {
      packageName: String,
      priceUsd: Number,
      name: String,
      email: String,
      phone: String,
      at: Date,
      ip: String,
    },
    payment: {
      method: String,
      reference: String,
      note: String,
      reportedAt: Date,
      confirmedAt: Date,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Proposal || mongoose.model('Proposal', ProposalSchema)
