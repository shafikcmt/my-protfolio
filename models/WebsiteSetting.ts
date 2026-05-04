import mongoose from 'mongoose'

const WebsiteSettingSchema = new mongoose.Schema(
  {
    siteName: String,
    logo: String,
    email: String,
    phone: String,
    whatsapp: String,
    address: String,
    github: String,
    linkedin: String,
    facebook: String,
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    seoTitle: String,
    seoDescription: String,
    heroTitle: String,
    heroSubtitle: String,
    resumeUrl: String,
  },
  { timestamps: true }
)

export default mongoose.models.WebsiteSetting || mongoose.model('WebsiteSetting', WebsiteSettingSchema)
