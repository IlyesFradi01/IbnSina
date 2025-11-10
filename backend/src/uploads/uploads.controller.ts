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
    const uploadsDirs = [
      resolve(process.cwd(), 'uploads'),
      resolve(process.cwd(), '..', 'uploads'),
      resolve(process.cwd(), 'backend', 'uploads'),
      resolve(__dirname, '..', '..', 'uploads'),
      resolve(__dirname, '..', 'uploads'),
      resolve(__dirname, '..', '..', '..', 'uploads'),
    ];
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
        let candidate = name;
        if (/^https?:\/\//i.test(name)) {
          try {
            const url = new URL(name);
            const host = (url.hostname || '').toLowerCase();
            const localHosts = ['localhost', '127.0.0.1'];
            const backendHost = (process.env.BACKEND_PUBLIC_HOST || process.env.BACKEND_PUBLIC_URL || '').toLowerCase();
            const renderHostname = (process.env.RENDER_EXTERNAL_URL || '').toLowerCase();
            const isLocalHost = localHosts.includes(host);
            const matchesBackendHost = backendHost ? backendHost === host : false;
            const matchesRenderHost = renderHostname ? renderHostname === host : false;
            if (isLocalHost || matchesBackendHost || matchesRenderHost) {
              candidate = url.pathname || '';
            } else if (url.pathname.startsWith('/uploads/')) {
              // If pointing to another domain but still uploads path, fallback to using pathname
              candidate = url.pathname;
            } else {
              newUrls.push(name);
              continue;
            }
          } catch {
            // If URL parsing fails, treat it as local path
            candidate = name;
          }
        }
        const sanitized = candidate.replace(/^https?:\/\//i, '');
        const normalised = sanitized.replace(/^\/+/, '');
        const relativePath = normalised.startsWith('uploads/')
          ? normalised.replace(/^uploads\/+/, '')
          : normalised.startsWith('/uploads/')
            ? normalised.replace(/^\/+uploads\/+/, '')
            : normalised;
        let filePath = '';
        for (const dir of uploadsDirs) {
          const candidatePath = resolve(dir, relativePath);
          if (fs.existsSync(candidatePath)) {
            filePath = candidatePath;
            break;
          }
        }
        try {
          let uploadedUrl: string | null = null;
          if (filePath) {
            const uploaded = await cloudinary.uploader.upload(filePath, {
              folder: 'ibnsina/products',
              use_filename: true,
              unique_filename: true,
              resource_type: 'image',
            });
            uploadedUrl = uploaded?.secure_url || null;
          } else {
            const legacyBase = process.env.LEGACY_UPLOADS_BASE_URL || '';
            if (legacyBase) {
              const src = `${legacyBase.replace(/\/+$/, '')}/uploads/${encodeURIComponent(relativePath)}`;
              try {
                const resp = await fetch(src);
                if (resp.ok) {
                  const arrayBuffer = await resp.arrayBuffer();
                  const buffer = Buffer.from(arrayBuffer);
                  const uploaded = await new Promise<any>((resolveUpload, rejectUpload) => {
                    const stream = cloudinary.uploader.upload_stream(
                      {
                        folder: 'ibnsina/products',
                        use_filename: true,
                        unique_filename: true,
                        resource_type: 'image',
                      },
                      (error, result) => {
                        if (error) rejectUpload(error);
                        else resolveUpload(result);
                      }
                    );
                    stream.end(buffer);
                  });
                  uploadedUrl = uploaded?.secure_url || null;
                }
              } catch {
                // ignore fetch/upload errors; will count as error below
              }
            }
          }
          if (uploadedUrl) {
            newUrls.push(uploadedUrl);
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
