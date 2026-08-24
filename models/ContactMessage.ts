import mongoose from 'mongoose'

const ContactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: { type: String },
    phone: { type: String },
    inquiryType: {
      type: String,
      enum: ['hire_me', 'project_inquiry', 'course_training', 'consultation', 'support', 'other'],
    },
    serviceNeeded: { type: String },
    budget: { type: String },
    timeline: { type: String },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
    },
    preferredContact: {
      type: String,
      enum: ['email', 'phone', 'whatsapp'],
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'in_progress', 'converted', 'closed', 'archived'],
      default: 'new',
    },
    read: {
      type: Boolean,
      default: false,
    },
    adminNote: { type: String },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema)
