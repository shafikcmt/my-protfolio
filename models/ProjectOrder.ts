'use strict'

import mongoose, { Schema, model, models } from 'mongoose'

const ProjectOrderStatusHistorySchema = new Schema(
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

const ProjectOrderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    clientName: {
      type: String,
      required: [true, 'Please provide a client name'],
    },
    clientEmail: {
      type: String,
      required: [true, 'Please provide an email'],
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    clientPhone: String,
    companyName: String,
    projectType: {
      type: String,
      required: [true, 'Please provide the project type'],
    },
    serviceTitle: String,
    title: String,
    budgetRange: String,
    budget: Number,
    deadline: String,
    timeline: String,
    preferredTechnology: String,
    description: String,
    referenceLinks: [String],
    attachmentUrl: String,
    meetingPreference: String,
    meetingLink: String,
    proposalUrl: String,
    deliveryUrl: String,
    adminNote: {
      type: String,
      default: '',
    },
    clientNote: {
      type: String,
      default: '',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['pending', 'discussing', 'accepted', 'in_progress', 'in-progress', 'testing', 'delivered', 'completed', 'cancelled'],
      default: 'pending',
    },
    statusHistory: {
      type: [ProjectOrderStatusHistorySchema],
      default: [],
    },
  },
  { timestamps: true }
)

ProjectOrderSchema.pre('save', function (this: any, next: any) {
  if (!this.orderNumber) {
    this.orderNumber = `PO-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`
  }

  if (!this.statusHistory || this.statusHistory.length === 0) {
    this.statusHistory = [
      {
        status: this.status || 'pending',
        note: 'Project order submitted',
        changedAt: new Date(),
      },
    ]
  }

  next()
})

const ProjectOrder = models.ProjectOrder || model('ProjectOrder', ProjectOrderSchema)
export default ProjectOrder
