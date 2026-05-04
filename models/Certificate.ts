import mongoose, { Schema, model, models } from 'mongoose'

const CertificateSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    enrollmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
    },
    completionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    certificateUrl: String,
  },
  { timestamps: true }
)

const Certificate = models.Certificate || model('Certificate', CertificateSchema)
export default Certificate
