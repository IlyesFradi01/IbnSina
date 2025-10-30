import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  sku: string;

  @Column({ type: 'text', nullable: true })
  images: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Column({ type: 'text', nullable: true })
  usageInstructions: string;

  @Column({ type: 'text', nullable: true })
  ingredients: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  origin: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  sales: number;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne('Category', 'products', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: any;

  @OneToMany('OrderItem', 'product')
  orderItems: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
