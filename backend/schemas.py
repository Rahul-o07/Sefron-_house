from typing import List, Optional, Union
from pydantic import BaseModel, Field

# Admin Login
class AdminLoginRequest(BaseModel):
    username: str
    password: str

# Menu schemas
class MenuItemCreate(BaseModel):
    name: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1)
    price: float = Field(..., gt=0)

class MenuItemUpdate(BaseModel):
    name: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1)
    price: float = Field(..., gt=0)

# Order schemas
class OrderItem(BaseModel):
    dish_id: int
    quantity: int = Field(..., gt=0)

class OrderCreate(BaseModel):
    customer_name: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=5)
    items: List[OrderItem] = Field(..., min_items=1)

class OrderStatusUpdate(BaseModel):
    status: str = Field(..., min_length=1)

# Reservation schemas
class ReservationCreate(BaseModel):
    customer_name: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=5)
    reservation_date: str = Field(..., min_length=4)
    reservation_time: str = Field(..., min_length=3)
    guests: int = Field(..., gt=0)

class ReservationStatusUpdate(BaseModel):
    status: str = Field(..., min_length=1)
