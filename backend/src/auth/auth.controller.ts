import { Controller, Post, Body, UseGuards, Get, Request, BadRequestException, Query, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as bcrypt from 'bcryptjs';
// Removed TypeORM user repository to avoid DataSource requirement
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectModel('Admin') private readonly adminModel: Model<any>,
  ) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    // Create into Admin collection instead
    const existsMongo = await this.adminModel.findOne({ email: registerDto.email }).lean();
    if (existsMongo) {
      throw new BadRequestException('Admin already exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    await this.adminModel.create({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: 'admin',
    });
    return { ok: true, email: registerDto.email };
  }

  // Register admin into Mongo Admin collection (alternative to TypeORM users)
  @Post('register-admin')
  async registerAdmin(@Body() registerDto: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    const existsMongo = await this.adminModel.findOne({ email: registerDto.email }).lean();
    if (existsMongo) {
      throw new BadRequestException('Admin already exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    await this.adminModel.create({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: 'admin',
    });
    return { ok: true, email: registerDto.email };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // One-time seed admin endpoint (protected by SEED_TOKEN)
  @Post('seed-admin')
  async seedAdmin(
    @Query('token') token: string,
    @Body() body: { email?: string; password?: string; firstName?: string; lastName?: string },
  ) {
    if (!token || token !== (process.env.SEED_TOKEN || 'seed-secret')) {
      throw new BadRequestException('Invalid seed token');
    }
    const email = body.email || process.env.SEED_ADMIN_EMAIL || 'admin@ibnsina.com';
    const password = body.password || process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const firstName = body.firstName || 'Admin';
    const lastName = body.lastName || 'User';

    const existsMongo = await this.adminModel.findOne({ email }).lean();
    if (existsMongo) {
      return { ok: true, message: 'Admin already exists', email };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.adminModel.create({ email, password: hashedPassword, firstName, lastName, role: 'admin' });
    return { ok: true, message: 'Admin created', email };
  }
}
