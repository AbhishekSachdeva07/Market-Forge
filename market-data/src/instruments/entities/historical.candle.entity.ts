import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Instrument } from './instrument.entity';

@Entity('historical_candles')
@Unique(['isin', 'tradingDate'])
export class HistoricalCandle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'isin',
    type: 'varchar',
    length: 20,
  })
  isin: string;

  @ManyToOne(() => Instrument, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'isin',
    referencedColumnName: 'isin',
  })
  instrument: Instrument;

  @Column({
    name: 'trading_date',
    type: 'date',
  })
  tradingDate: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  open: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  high: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  low: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  close: number;

  @Column({
    type: 'bigint',
  })
  volume: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}