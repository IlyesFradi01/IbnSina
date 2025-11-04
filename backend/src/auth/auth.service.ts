import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// TypeORM user repository removed to avoid DataSource requirement when not configured
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

type AdminDoc = {
  _id: any;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel('Admin') private readonly adminModel: Model<AdminDoc>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // Admin Mongo collection
    const adminDoc = await this.adminModel.findOne({ email }).lean<AdminDoc>().exec();
    if (adminDoc && adminDoc.password && await bcrypt.compare(password, adminDoc.password)) {
      const { password: _omit, ...rest } = adminDoc;
      return { ...rest, id: adminDoc._id, role: adminDoc.role || 'admin' } as any;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const exists = await this.adminModel.findOne({ email: userData.email }).lean();
    if (exists) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const created = await this.adminModel.create({
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'admin',
    });
    const { password, ...rest } = (created.toObject ? created.toObject() : created) as any;
    return rest;
  }

  async findUserById(id: any): Promise<any> {
    try {
      const doc = await this.adminModel.findById(id).lean();
      return doc || null;
    } catch {
      return null;
    }
  }
}
