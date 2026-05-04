import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: String,
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
    },
    image: String,
    screenshots: [String],
    videoUrl: String,
    liveDemoUrl: String,
    githubUrl: String,
    link: String,
    codeLink: String,
    clientProblem: String,
    solution: String,
    technologies: [String],
    features: [String],
    adminFeatures: [String],
    userFeatures: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema)
