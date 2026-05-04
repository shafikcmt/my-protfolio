'use strict'

import mongoose, { Schema, model, models } from 'mongoose'

const OrderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceTitle: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    budget: {
      type: Number,
      default: 0,
    },
    timeline: {
      type: String,
      default: 'Flexible',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
)

const Order = models.Order || model('Order', OrderSchema)
export default Order
