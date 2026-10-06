import mongoose from 'mongoose'

export const JOB_STATUSES = ['new', 'saved', 'applied', 'interview', 'offer', 'hired', 'rejected'] as const

/** Remote job collected by the job finder (lib/jobFinder.ts) or added manually. */
const JobSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    externalId: { type: String, required: true },
    title: { type: String, required: true },
    company: String,
    url: { type: String, required: true },
    location: String,
    salary: String,
    tags: [String],
    excerpt: String,
    description: String,
    publishedAt: Date,
    score: { type: Number, default: 0 },
    matchedSkills: [String],
    status: { type: String, enum: JOB_STATUSES, default: 'new' },
    notified: { type: Boolean, default: false },

    // Application pipeline
    notes: String,
    appliedAt: Date,
    followUpAt: Date,
    interviewAt: Date,
    interviewReminded: { type: Boolean, default: false },

    // Portfolio tracking link: https://shafiqul.dev/?ref=<refCode>
    refCode: { type: String, index: { unique: true, sparse: true } },
    visitCount: { type: Number, default: 0 },
    lastVisitAt: Date,
    visits: [{ at: Date, path: String, _id: false }],
  },
  { timestamps: true }
)

JobSchema.index({ source: 1, externalId: 1 }, { unique: true })
JobSchema.index({ status: 1, score: -1, publishedAt: -1 })

export default mongoose.models.Job || mongoose.model('Job', JobSchema)
