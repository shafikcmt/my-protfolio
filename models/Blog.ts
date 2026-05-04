import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a blog title'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide blog content'],
    },
    excerpt: String,
    image: String,
    author: String,
    category: String,
    tags: [String],
    published: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema)
