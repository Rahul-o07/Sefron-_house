import logging
from contextlib import contextmanager
from typing import Optional
import psycopg
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool
from config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

logger = logging.getLogger("sefron_backend")

conninfo = f"host={DB_HOST} port={DB_PORT} dbname={DB_NAME} user={DB_USER} password={DB_PASSWORD} connect_timeout=5"

_pool: Optional[ConnectionPool] = None

def get_pool() -> ConnectionPool:
    global _pool
    if _pool is None or _pool.closed:
        _pool = ConnectionPool(
            conninfo=conninfo,
            min_size=1,
            max_size=10,
            kwargs={"row_factory": dict_row},
            open=True,
        )
    return _pool

def close_pool():
    global _pool
    if _pool is not None and not _pool.closed:
        _pool.close()
        _pool = None

@contextmanager
def get_db():
    pool = get_pool()
    with pool.connection() as conn:
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise

def init_db():
    """Ensure required tables exist upon startup."""
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                # 1. Menu Table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS menu (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        category VARCHAR(255) NOT NULL,
                        price NUMERIC(10, 2) NOT NULL
                    );
                """)

                # 2. Orders Table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS orders (
                        id SERIAL PRIMARY KEY,
                        customer_name VARCHAR(255) NOT NULL,
                        phone VARCHAR(50) NOT NULL,
                        items JSONB NOT NULL,
                        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        status VARCHAR(50) DEFAULT 'New'
                    );
                """)

                # 3. Reservations Table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS reservations (
                        id SERIAL PRIMARY KEY,
                        customer_name VARCHAR(255) NOT NULL,
                        phone VARCHAR(50) NOT NULL,
                        reservation_date DATE NOT NULL,
                        reservation_time TIME WITHOUT TIME ZONE NOT NULL,
                        guests INTEGER NOT NULL,
                        status VARCHAR(50) DEFAULT 'Pending',
                        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                """)

                logger.info("Database tables verified successfully.")
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")
        raise
