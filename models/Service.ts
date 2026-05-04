import mongoose from 'mongoose'

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a service title'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a service description'],
    },
    icon: String,
    price: Number,
    startingPrice: String,
    duration: String,
    features: [String],
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema)
