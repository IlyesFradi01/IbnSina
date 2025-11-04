import { Schema, SchemaTypes } from 'mongoose';

export const OrderItemSchema = new Schema(
  {
    productId: { type: SchemaTypes.Mixed, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String },
    size: { type: String },
  },
  { _id: false }
);

export const OrderSchema = new Schema(
  {
    email: { type: String },
    emailOptIn: { type: Boolean, default: false },
    shipping: {
      country: { type: String },
      firstName: { type: String },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      apartment: { type: String },
      postalCode: { type: String },
      city: { type: String, required: true },
      phone: { type: String, required: true },
    },
    billingSameAsShipping: { type: Boolean, default: true },
    billing: {
      firstName: { type: String },
      lastName: { type: String },
      address: { type: String },
      apartment: { type: String },
      postalCode: { type: String },
      city: { type: String },
    },
    shippingMethod: { type: String, default: 'aramex' },
    paymentMethod: { type: String, default: 'COD' },
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ 'shipping.lastName': 1, 'shipping.phone': 1, createdAt: -1 });


