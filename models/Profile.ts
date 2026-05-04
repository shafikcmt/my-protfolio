import mongoose from 'mongoose'

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    title: String,
    summary: String,
    location: String,
    experience: String,
    education: [String],
    socials: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema)
