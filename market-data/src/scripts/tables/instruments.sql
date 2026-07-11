CREATE TABLE instruments (
    instrument_key VARCHAR(40) PRIMARY KEY,
    exchange_token VARCHAR(20) NOT NULL,
    segment VARCHAR(20) NOT NULL,
    exchange VARCHAR(10) NOT NULL,
    isin VARCHAR(20),
    trading_symbol VARCHAR(50) NOT NULL,
    name VARCHAR(255),
    instrument_type VARCHAR(10),
    security_type VARCHAR(20),
    lot_size INTEGER,
    freeze_quantity DOUBLE PRECISION,
    tick_size DOUBLE PRECISION,
    qty_multiplier DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE instruments
ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

ALTER TABLE instruments
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE instruments
ADD CONSTRAINT uq_instruments_isin UNIQUE (isin);