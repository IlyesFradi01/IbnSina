import { Controller, Post, UploadedFiles, UseInterceptors, Req, Body, Headers, ForbiddenException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { resolve } from 'path';
import * as fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../entities/product.entity';

function configureCloudinaryFromEnv() {
  const url = process.env.CLOUDINARY_URL;
  const name = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (url) {
    cloudinary.config({ cloudinary_url: url });
    return true;
  }
  if (name && key && secret) {
    cloudinary.config({ cloud_name: name, api_key: key, api_secret: secret });
    return true;
  }
  return false;
}

@Controller('uploads')
export class UploadsController {
  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  upload(@UploadedFiles() files: any[], @Req() req: Request) {
    const host = `${req.protocol}://${req.get('host')}`;
    const urls = (files || []).map((f) => `${host}/uploads/${encodeURIComponent(f.filename)}`);
    return { urls };
  }

  @Post('migrate')
  async migrate(@Headers('x-migration-token') token: string) {
    const expected = process.env.MIGRATION_TOKEN || '';
    if (!expected || token !== expected) {
      throw new ForbiddenException('Invalid migration token');
    }
    const cloudOk = configureCloudinaryFromEnv();
    if (!cloudOk) {
      return { ok: false, message: 'Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/SECRET' };
    }
    const uploadsDir = resolve(__dirname, '..', 'uploads');
    const products = await this.productModel.find({}).exec();
    const results: Array<{ id: string; updated: boolean; count: number; errors?: number }> = [];
    for (const p of products) {
      const raw = typeof (p as any).images === 'string' ? (p as any).images : '';
      const names = raw.split(',').map(s => s.trim()).filter(Boolean);
      if (names.length === 0) {
        results.push({ id: String((p as any)._id), updated: false, count: 0 });
        continue;
      }
      const newUrls: string[] = [];
      let errors = 0;
      for (const name of names) {
        if (/^https?:\/\//i.test(name)) {
          newUrls.push(name);
          continue;
        }
        const filePath = name.startsWith('/uploads') ? resolve(uploadsDir, name.replace(/^\/+?uploads\/?/, '')) : resolve(uploadsDir, name);
        try {
          if (!fs.existsSync(filePath)) {
            errors++;
            continue;
          }
          const uploaded = await cloudinary.uploader.upload(filePath, {
            folder: 'ibnsina/products',
            use_filename: true,
            unique_filename: true,
            resource_type: 'image',
          });
          if (uploaded?.secure_url) {
            newUrls.push(uploaded.secure_url);
          } else {
            errors++;
          }
        } catch {
          errors++;
        }
      }
      if (newUrls.length > 0 && newUrls.join(',') !== raw) {
        (p as any).images = newUrls.join(',');
        await p.save();
        results.push({ id: String((p as any)._id), updated: true, count: newUrls.length, errors });
      } else {
        results.push({ id: String((p as any)._id), updated: false, count: newUrls.length, errors });
      }
    }
    return { ok: true, migrated: results.length, results };
  }
}
