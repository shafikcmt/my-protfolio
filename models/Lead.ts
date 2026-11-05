import mongoose from 'mongoose'

export const LEAD_STATUSES = ['chatting', 'needs_review', 'approved', 'call_requested', 'rejected', 'won', 'lost'] as const

/** A website visitor talking to the AI sales assistant (lib/salesAgent.ts). */
const LeadSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    channel: { type: String, default: 'website' },
    ip: String,
    status: { type: String, enum: LEAD_STATUSES, default: 'chatting', index: true },

    // Details collected by the assistant
    name: String,
    email: String,
    phone: String,
    company: String,
    projectType: String,
    summary: String,
    requirements: [String],
    clientBudget: String,
    timeline: String,
    temperature: { type: String, enum: ['hot', 'warm', 'cold'], default: 'warm' },

    // Packages the assistant proposed, and what the owner approved
    proposedTiers: [{ name: String, priceUsd: Number, timeline: String, includes: [String], _id: false }],
    ownerNotes: [{ at: Date, text: String, _id: false }],
    telegramMessageId: Number,

    // Conversation: what the visitor sees, and the exact API history (append-only)
    transcript: [{ role: { type: String, enum: ['user', 'assistant', 'note'] }, text: String, at: Date, _id: false }],
    apiMessages: { type: [mongoose.Schema.Types.Mixed], default: [] },
    clientMessageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema)
