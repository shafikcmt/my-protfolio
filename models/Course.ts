import mongoose from 'mongoose'

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
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
      required: [true, 'Please provide a course description'],
    },
    image: String,
    instructor: {
      type: String,
      default: 'Md Shafiqul Islam',
    },
    category: String,
    price: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    duration: String,
    lessons: {
      type: Number,
      default: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    students: {
      type: Number,
      default: 0,
    },
    syllabus: [String],
    learningOutcomes: [String],
    requirements: [String],
    certificateEnabled: {
      type: Boolean,
      default: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Course || mongoose.model('Course', CourseSchema)
