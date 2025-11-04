import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel('Order') private readonly orderModel: Model<any>) {}

  async create(dto: CreateOrderDto) {
    const doc = await this.orderModel.create({
      ...dto,
      paymentMethod: dto.paymentMethod || 'COD',
      shippingMethod: dto.shippingMethod || 'aramex',
      status: 'pending',
    });
    return doc;
  }

  async findAll() {
    return this.orderModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    return this.orderModel.findById(id).lean();
  }

  async updateStatus(id: string, status: string) {
    return this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
  }
}


