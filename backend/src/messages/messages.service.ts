import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from '../dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(@InjectModel('Message') private readonly messageModel: Model<any>) {}

  async create(dto: CreateMessageDto) {
    return this.messageModel.create(dto);
  }

  async findAll() {
    return this.messageModel.find().sort({ createdAt: -1 }).lean();
  }

  async markRead(id: string, read: boolean) {
    return this.messageModel.findByIdAndUpdate(id, { read }, { new: true }).lean();
  }

  async delete(id: string) {
    return this.messageModel.findByIdAndDelete(id).lean();
  }
}


