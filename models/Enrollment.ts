'use strict'

import mongoose, { Schema, model, models } from 'mongoose'

const EnrollmentSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLessons: [{
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
    }],
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
  },
  { timestamps: true }
)

const Enrollment = models.Enrollment || model('Enrollment', EnrollmentSchema)
export default Enrollment
