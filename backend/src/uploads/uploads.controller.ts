import { Controller, Post, UploadedFiles, UseInterceptors, Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  upload(@UploadedFiles() files: any[], @Req() req: Request) {
    const host = `${req.protocol}://${req.get('host')}`;
    const urls = (files || []).map((f) => `${host}/uploads/${encodeURIComponent(f.filename)}`);
    return { urls };
  }
}
