import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsController } from './uploads.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from '../schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [UploadsController],
})
export class UploadsModule {}
