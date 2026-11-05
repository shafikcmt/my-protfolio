import mongoose from 'mongoose'

/** Single settings document for the AI features (Admin → Settings → AI & Assistant). */
const AiSettingSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    /** auto = Claude if its key exists, else Gemini; off = AI features disabled */
    provider: { type: String, enum: ['auto', 'anthropic', 'gemini', 'off'], default: 'auto' },
    assistantName: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.models.AiSetting || mongoose.model('AiSetting', AiSettingSchema)
