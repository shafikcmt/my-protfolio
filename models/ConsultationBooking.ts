'use strict'

import mongoose, { Schema, model, models } from 'mongoose'

const BookingStatusHistorySchema = new Schema(
  {
    status: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: '',
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
)

const ConsultationBookingSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
    },
    topic: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 60,
    },
    meetingLink: {
      type: String,
      default: '',
    },
    adminNote: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'requested', 'approved', 'confirmed', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    statusHistory: {
      type: [BookingStatusHistorySchema],
      default: [],
    },
  },
  { timestamps: true }
)

ConsultationBookingSchema.pre('save', function (this: any, next: any) {
  if (!this.statusHistory || this.statusHistory.length === 0) {
    this.statusHistory = [
      {
        status: this.status || 'pending',
        note: 'Consultation request submitted',
        changedAt: new Date(),
      },
    ]
  }

  next()
})

const ConsultationBooking = models.ConsultationBooking || model('ConsultationBooking', ConsultationBookingSchema)
export default ConsultationBooking
