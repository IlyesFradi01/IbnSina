import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<any>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const created = await this.categoryModel.create(createCategoryDto);
      return created;
    } catch (err: any) {
      const msg = (err?.message || '').toLowerCase();
      if (err?.code === 11000 || msg.includes('duplicate')) {
        throw new ConflictException('Category name already exists');
      }
      throw err;
    }
  }

  async findAll() {
    const filter: FilterQuery<any> = { isActive: true };
    return await this.categoryModel.find(filter).sort({ sortOrder: 1, name: 1 }).lean();
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: Partial<CreateCategoryDto>) {
    try {
      const updated = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });
      if (!updated) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return updated;
    } catch (err: any) {
      const msg = (err?.message || '').toLowerCase();
      if (err?.code === 11000 || msg.includes('duplicate')) {
        throw new ConflictException('Category name already exists');
      }
      throw err;
    }
  }

  async remove(id: string) {
    const res = await this.categoryModel.findByIdAndDelete(id);
    if (!res) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
