import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/users/entity/user.entity';

@Entity('api_keys')
export class ApiKey {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'user_id',
  })
  userId!: number;

  @ManyToOne(
    () => User,
    { nullable: false },
  )
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @Column({
    name: 'api_key',
    unique: true,
  })
  apiKey!: string;

  @Column()
  name!: string;

  @Column({
    name: 'is_active',
    default: true,
  })
  isActive!: boolean;

  @Column({
    name: 'last_used_at',
    nullable: true,
  })
  lastUsedAt?: Date;

  @Column({
    name: 'expires_at',
    nullable: true,
  })
  expiresAt?: Date;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;
}