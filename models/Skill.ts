import mongoose from 'mongoose'

const SkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a skill name'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a skill category'],
    },
    level: String,
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema)
