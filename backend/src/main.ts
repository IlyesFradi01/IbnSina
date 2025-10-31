import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Diagnostics: ensure MONGO_URI is detected and show masked host
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.warn('[Startup] MONGO_URI is not set. MongoDB connection will be skipped.');
    } else {
      const atIndex = uri.indexOf('@');
      const afterAt = atIndex >= 0 ? uri.slice(atIndex + 1) : uri;
      const slashIndex = afterAt.indexOf('/');
      const host = slashIndex >= 0 ? afterAt.slice(0, slashIndex) : afterAt;
      console.log(`[Startup] MONGO_URI detected. Host: ${host}`);
    }
  } catch {
    // ignore
  }
  
  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003'
    ],
    credentials: true,
  });
  
  // Serve uploads directory
  const uploadsPath = join(process.cwd(), 'backend', 'uploads');
  app.use('/uploads', express.static(uploadsPath));
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());
  
  const port = Number(process.env.PORT ?? 3002);
  await app.listen(port);
  try {
    const url = await app.getUrl();
    console.log(` Server running at ${url}`);
    console.log(` Serving uploads from ${uploadsPath} at /uploads`);
  } catch {
    console.log(` Server running on http://localhost:${port}`);
  }
}
bootstrap();
