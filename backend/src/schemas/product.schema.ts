import { Schema, SchemaTypes } from 'mongoose';

export const ProductSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String },
    images: { type: String },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    benefits: { type: String },
    usageInstructions: { type: String },
    ingredients: { type: String },
    weight: { type: String },
    origin: { type: String },
    views: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    categoryId: { type: SchemaTypes.Mixed },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text', benefits: 'text' });
