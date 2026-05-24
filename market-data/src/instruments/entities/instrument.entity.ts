import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('instruments')
export class Instrument {

  @PrimaryColumn({
    name: 'instrument_key',
  })
  instrumentKey: string;

  @Column({
    name: 'exchange_token',
  })
  exchangeToken: string;

  @Column()
  segment: string;

  @Column()
  exchange: string;

  @Column({
    nullable: true,
  })
  isin: string;

  @Column({
    name: 'trading_symbol',
  })
  tradingSymbol: string;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    name: 'instrument_type',
    nullable: true,
  })
  instrumentType: string;

  @Column({
    name: 'security_type',
    nullable: true,
  })
  securityType: string;

  @Column({
    name: 'lot_size',
    nullable: true,
  })
  lotSize: number;

  @Column({
    name: 'freeze_quantity',
    type: 'double precision',
    nullable: true,
  })
  freezeQuantity: number;

  @Column({
    name: 'tick_size',
    type: 'double precision',
    nullable: true,
  })
  tickSize: number;

  @Column({
    name: 'qty_multiplier',
    type: 'double precision',
    nullable: true,
  })
  qtyMultiplier: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}