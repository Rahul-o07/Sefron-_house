import logging
from contextlib import asynccontextmanager
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, Query, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from psycopg.types.json import Jsonb

from config import DB_NAME
from database import get_db, init_db, close_pool
from auth import verify_admin_credentials, create_access_token, get_current_admin, security
from schemas import (
    AdminLoginRequest,
    MenuItemCreate,
    MenuItemUpdate,
    OrderCreate,
    OrderStatusUpdate,
    ReservationCreate,
    ReservationStatusUpdate,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sefron_house")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables
    try:
        init_db()
        logger.info(f"Database initialized for {DB_NAME}.")
    except Exception as e:
        logger.error(f"Database connection/initialization error: {e}")
    yield
    # Shutdown
    try:
        close_pool()
        logger.info("Database connection pool closed.")
    except Exception as e:
        logger.error(f"Error closing connection pool: {e}")

app = FastAPI(
    title="SEFRON HOUSE API",
    description="Backend API for Sefron House Restaurant",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for frontend Vite application (supporting localhost, 127.0.0.1, and custom ports)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?",
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom exception handler to provide both 'detail' and 'error' in JSON
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "error": exc.detail},
    )

# -------------------------------------------------------------
# ROOT & HEALTH CHECK
# -------------------------------------------------------------
@app.get("/")
@app.get("/health")
@app.get("/api/health")
@app.get("/api/status")
def root():
    db_status = "connected"
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1;")
    except Exception as e:
        logger.warning(f"Database health check failed: {e}")
        db_status = "disconnected"

    return {
        "message": "Backend connected successfully",
        "status": "online",
        "database": db_status,
        "app": "SEFRON HOUSE API",
    }

# -------------------------------------------------------------
# ADMIN AUTHENTICATION
# -------------------------------------------------------------
@app.post("/api/admin/login")
def admin_login(creds: AdminLoginRequest):
    if not verify_admin_credentials(creds.username.strip(), creds.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
        )
    token = create_access_token(data={"sub": creds.username.strip()})
    return {
        "access_token": token,
        "token_type": "bearer",
        "username": creds.username.strip(),
    }

# -------------------------------------------------------------
# MENU ENDPOINTS
# -------------------------------------------------------------
@app.get("/api/menu")
def get_menu():
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, name, category, price FROM menu ORDER BY id ASC;")
                rows = cur.fetchall()
                return [
                    {
                        "id": row["id"],
                        "name": row["name"],
                        "category": row["category"],
                        "price": float(row["price"]),
                    }
                    for row in rows
                ]
    except Exception as e:
        logger.error(f"Error fetching menu: {e}")
        raise HTTPException(status_code=500, detail="Failed to load menu items from database")

@app.post("/api/menu")
def add_menu_item(item: MenuItemCreate, admin: dict = Depends(get_current_admin)):
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO menu (name, category, price)
                    VALUES (%s, %s, %s)
                    RETURNING id, name, category, price;
                    """,
                    (item.name.strip(), item.category.strip(), item.price),
                )
                row = cur.fetchone()
                return {
                    "id": row["id"],
                    "name": row["name"],
                    "category": row["category"],
                    "price": float(row["price"]),
                    "message": "Menu item created successfully",
                }
    except Exception as e:
        logger.error(f"Error creating menu item: {e}")
        raise HTTPException(status_code=500, detail="Failed to create menu item")

@app.put("/api/menu/{item_id}")
def update_menu_item(item_id: int, item: MenuItemUpdate, admin: dict = Depends(get_current_admin)):
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE menu
                    SET name = %s, category = %s, price = %s
                    WHERE id = %s
                    RETURNING id, name, category, price;
                    """,
                    (item.name.strip(), item.category.strip(), item.price, item_id),
                )
                row = cur.fetchone()
                if not row:
                    raise HTTPException(status_code=404, detail="Menu item not found")
                return {
                    "id": row["id"],
                    "name": row["name"],
                    "category": row["category"],
                    "price": float(row["price"]),
                    "message": "Menu item updated successfully",
                }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating menu item {item_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update menu item")

@app.delete("/api/menu/{item_id}")
def delete_menu_item(item_id: int, admin: dict = Depends(get_current_admin)):
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM menu WHERE id = %s RETURNING id;", (item_id,))
                row = cur.fetchone()
                if not row:
                    raise HTTPException(status_code=404, detail="Menu item not found")
                return {
                    "message": "Menu item deleted successfully",
                    "id": item_id,
                }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting menu item {item_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete menu item")

# -------------------------------------------------------------
# ORDERS ENDPOINTS
# -------------------------------------------------------------
@app.post("/api/orders")
def create_order(order: OrderCreate):
    try:
        items_payload = [
            {"dish_id": item.dish_id, "quantity": item.quantity}
            for item in order.items
        ]
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO orders (customer_name, phone, items, status)
                    VALUES (%s, %s, %s, 'New')
                    RETURNING id, customer_name, phone, items, created_at, status;
                    """,
                    (order.customer_name.strip(), order.phone.strip(), Jsonb(items_payload)),
                )
                row = cur.fetchone()
                return {
                    "id": row["id"],
                    "order_id": row["id"],
                    "customer_name": row["customer_name"],
                    "phone": row["phone"],
                    "items": row["items"],
                    "status": row["status"],
                    "created_at": row["created_at"].isoformat() if row["created_at"] else None,
                    "message": "Order placed successfully",
                }
    except Exception as e:
        logger.error(f"Error placing order: {e}")
        raise HTTPException(status_code=500, detail="Failed to place order")

@app.get("/api/orders")
def get_orders(admin: dict = Depends(get_current_admin)):
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, customer_name, phone, items, created_at, status
                    FROM orders
                    ORDER BY id DESC;
                    """
                )
                rows = cur.fetchall()
                return [
                    {
                        "id": row["id"],
                        "order_id": row["id"],
                        "customer_name": row["customer_name"],
                        "phone": row["phone"],
                        "items": row["items"],
                        "status": row["status"] or "New",
                        "created_at": row["created_at"].isoformat() if row["created_at"] else None,
                    }
                    for row in rows
                ]
    except Exception as e:
        logger.error(f"Error fetching orders: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch orders")

@app.get("/api/orders/{order_id}")
def get_order_by_id(
    order_id: int,
    phone: Optional[str] = Query(None),
    authorization: Optional[str] = Depends(security),
):
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                if phone:
                    clean_phone = phone.strip()
                    cur.execute(
                        """
                        SELECT id, customer_name, phone, items, created_at, status
                        FROM orders
                        WHERE id = %s AND TRIM(phone) = %s;
                        """,
                        (order_id, clean_phone),
                    )
                else:
                    # If no phone provided, verify admin token
                    if not authorization or not authorization.credentials:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Please enter your phone number to track this order.",
                        )
                    # verify token
                    get_current_admin(authorization)
                    cur.execute(
                        """
                        SELECT id, customer_name, phone, items, created_at, status
                        FROM orders
                        WHERE id = %s;
                        """,
                        (order_id,),
                    )

                row = cur.fetchone()
                if not row:
                    raise HTTPException(
                        status_code=404,
                        detail="Unable to find your order. Please check your Order ID and phone number.",
                    )
                return {
                    "id": row["id"],
                    "order_id": row["id"],
                    "customer_name": row["customer_name"],
                    "phone": row["phone"],
                    "items": row["items"],
                    "status": row["status"] or "New",
                    "created_at": row["created_at"].isoformat() if row["created_at"] else None,
                }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error tracking order {order_id}: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving order details")

@app.put("/api/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    body: OrderStatusUpdate,
    admin: dict = Depends(get_current_admin),
):
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE orders
                    SET status = %s
                    WHERE id = %s
                    RETURNING id, status;
                    """,
                    (body.status.strip(), order_id),
                )
                row = cur.fetchone()
                if not row:
                    raise HTTPException(status_code=404, detail="Order not found")
                return {
                    "id": row["id"],
                    "order_id": row["id"],
                    "status": row["status"],
                    "message": "Order status updated successfully",
                }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating order status for {order_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update order status")

# -------------------------------------------------------------
# RESERVATIONS ENDPOINTS
# -------------------------------------------------------------
@app.post("/api/reservations")
def create_reservation(res: ReservationCreate):
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO reservations (customer_name, phone, reservation_date, reservation_time, guests, status)
                    VALUES (%s, %s, %s, %s, %s, 'Pending')
                    RETURNING id, customer_name, phone, reservation_date, reservation_time, guests, status, created_at;
                    """,
                    (
                        res.customer_name.strip(),
                        res.phone.strip(),
                        res.reservation_date.strip(),
                        res.reservation_time.strip(),
                        res.guests,
                    ),
                )
                row = cur.fetchone()
                return {
                    "id": row["id"],
                    "reservation_id": row["id"],
                    "customer_name": row["customer_name"],
                    "phone": row["phone"],
                    "reservation_date": str(row["reservation_date"]),
                    "reservation_time": str(row["reservation_time"])[:5],
                    "guests": row["guests"],
                    "status": row["status"],
                    "created_at": row["created_at"].isoformat() if row["created_at"] else None,
                    "message": "Reservation created successfully",
                }
    except Exception as e:
        logger.error(f"Error booking reservation: {e}")
        raise HTTPException(status_code=500, detail="Failed to create reservation")

@app.get("/api/reservations")
def get_reservations(admin: dict = Depends(get_current_admin)):
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, customer_name, phone, reservation_date, reservation_time, guests, status, created_at
                    FROM reservations
                    ORDER BY id DESC;
                    """
                )
                rows = cur.fetchall()
                return [
                    {
                        "id": row["id"],
                        "reservation_id": row["id"],
                        "customer_name": row["customer_name"],
                        "phone": row["phone"],
                        "reservation_date": str(row["reservation_date"]),
                        "reservation_time": str(row["reservation_time"])[:5],
                        "guests": row["guests"],
                        "status": row["status"] or "Pending",
                        "created_at": row["created_at"].isoformat() if row["created_at"] else None,
                    }
                    for row in rows
                ]
    except Exception as e:
        logger.error(f"Error fetching reservations: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch reservations")

@app.get("/api/reservations/{reservation_id}")
def get_reservation_by_id(
    reservation_id: int,
    phone: Optional[str] = Query(None),
    authorization: Optional[str] = Depends(security),
):
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                if phone:
                    clean_phone = phone.strip()
                    cur.execute(
                        """
                        SELECT id, customer_name, phone, reservation_date, reservation_time, guests, status, created_at
                        FROM reservations
                        WHERE id = %s AND TRIM(phone) = %s;
                        """,
                        (reservation_id, clean_phone),
                    )
                else:
                    if not authorization or not authorization.credentials:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Please provide phone number to check reservation.",
                        )
                    get_current_admin(authorization)
                    cur.execute(
                        """
                        SELECT id, customer_name, phone, reservation_date, reservation_time, guests, status, created_at
                        FROM reservations
                        WHERE id = %s;
                        """,
                        (reservation_id,),
                    )

                row = cur.fetchone()
                if not row:
                    raise HTTPException(
                        status_code=404,
                        detail="Reservation not found. Please check your details.",
                    )
                return {
                    "id": row["id"],
                    "reservation_id": row["id"],
                    "customer_name": row["customer_name"],
                    "phone": row["phone"],
                    "reservation_date": str(row["reservation_date"]),
                    "reservation_time": str(row["reservation_time"])[:5],
                    "guests": row["guests"],
                    "status": row["status"] or "Pending",
                    "created_at": row["created_at"].isoformat() if row["created_at"] else None,
                }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving reservation {reservation_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching reservation details")

@app.put("/api/reservations/{reservation_id}/status")
def update_reservation_status(
    reservation_id: int,
    body: ReservationStatusUpdate,
    admin: dict = Depends(get_current_admin),
):
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE reservations
                    SET status = %s
                    WHERE id = %s
                    RETURNING id, status;
                    """,
                    (body.status.strip(), reservation_id),
                )
                row = cur.fetchone()
                if not row:
                    raise HTTPException(status_code=404, detail="Reservation not found")
                return {
                    "id": row["id"],
                    "reservation_id": row["id"],
                    "status": row["status"],
                    "message": "Reservation status updated successfully",
                }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating reservation status for {reservation_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update reservation status")
