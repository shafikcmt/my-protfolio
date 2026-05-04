import mongoose from 'mongoose'

const LessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a lesson title'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: String,
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    videoUrl: String,
    duration: Number,
    order: {
      type: Number,
      default: 0,
    },
    locked: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    resources: [String],
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema)
