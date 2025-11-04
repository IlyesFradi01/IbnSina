import { Schema } from 'mongoose';

export const MessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

MessageSchema.index({ createdAt: -1 });


