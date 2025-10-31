import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Types } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<any>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const created = await this.productModel.create(createProductDto);
      return created;
    } catch (err: any) {
      // Mongo duplicate key error code
      if (err && (err.code === 11000 || err.code === '11000')) {
        // Determine which field caused duplicate if available
        const field = err?.keyPattern ? Object.keys(err.keyPattern)[0] : 'name';
        throw new ConflictException(`Product ${field} already exists`);
      }
      throw err;
    }
  }

  async findAll() {
    return await this.productModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findFeatured() {
    return await this.productModel
      .find({ isActive: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();
  }

  async findByCategory(categoryId: any) {
    const filter: FilterQuery<any> = { isActive: true };
    if (categoryId !== undefined) {
      filter['categoryId'] = categoryId;
    }
    return await this.productModel.find(filter).sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    try {
      const product = await this.productModel.findById(id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      await this.productModel.updateOne({ _id: product._id }, { $inc: { views: 1 } });
      return product;
    } catch (err: any) {
      // Handle malformed ObjectId
      if (err?.name === 'CastError') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw err;
    }
  }

  async search(query: string) {
    const regex = new RegExp(query, 'i');
    return await this.productModel
      .find({
        isActive: true,
        $or: [
          { name: regex },
          { description: regex },
          { benefits: regex },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const updated = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
    if (!updated) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.productModel.findByIdAndDelete(id);
    if (!res) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async updateStock(id: string, quantity: number) {
    const updated = await this.productModel.findByIdAndUpdate(
      id,
      { $inc: { stock: -quantity, sales: quantity } },
      { new: true }
    );
    if (!updated) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updated;
  }
}
