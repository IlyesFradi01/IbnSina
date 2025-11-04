import { Schema } from 'mongoose';

export const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
);


