import mongoose from 'mongoose'

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    role: String,
    company: String,
    image: String,
    content: {
      type: String,
      required: [true, 'Please provide testimonial content'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema)
