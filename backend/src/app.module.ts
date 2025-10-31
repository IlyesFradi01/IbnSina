import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ibnsina', {
      serverSelectionTimeoutMS: 7000,
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('[MongoDB] connected');
        });
        connection.on('error', (err) => {
          console.error('[MongoDB] error:', err?.message ?? err);
        });
        connection.on('disconnected', () => {
          console.warn('[MongoDB] disconnected');
        });
        return connection;
      },
    }),
    ProductsModule,
    CategoriesModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
