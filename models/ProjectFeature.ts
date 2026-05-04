import mongoose from 'mongoose'

const ProjectFeatureSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a feature title'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a feature description'],
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.ProjectFeature || mongoose.model('ProjectFeature', ProjectFeatureSchema)
