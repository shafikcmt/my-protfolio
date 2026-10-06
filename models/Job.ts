import mongoose from 'mongoose'

/** Remote job collected by the job finder (lib/jobFinder.ts). */
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
    publishedAt: Date,
    score: { type: Number, default: 0 },
    matchedSkills: [String],
    status: {
      type: String,
      enum: ['new', 'saved', 'applied', 'rejected'],
      default: 'new',
    },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

JobSchema.index({ source: 1, externalId: 1 }, { unique: true })
JobSchema.index({ status: 1, score: -1, publishedAt: -1 })

export default mongoose.models.Job || mongoose.model('Job', JobSchema)
