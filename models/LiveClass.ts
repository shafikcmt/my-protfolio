import mongoose from 'mongoose'

const LiveClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a class title'],
    },
    description: String,
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    instructor: String,
    scheduledDate: {
      type: Date,
      required: true,
    },
    duration: Number,
    meetingLink: String,
    capacity: Number,
    enrolled: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'ended', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.LiveClass || mongoose.model('LiveClass', LiveClassSchema)
