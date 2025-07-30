from dataclasses import dataclass
from typing import Optional

@dataclass
class Product:
    """Product data model for warehouse inventory management"""
    product_id: str
    current_stock: int
    incoming_stock: int  # Stock that's ordered but not yet received
    average_daily_sales: float
    lead_time_days: int
    min_reorder_quantity: int
    cost_per_unit: float
    criticality: str  # 'high', 'medium', 'low'
    
    def __post_init__(self):
        """Validate product data"""
        if self.average_daily_sales <= 0:
            raise ValueError(f"Average daily sales must be positive for {self.product_id}")
        if self.current_stock < 0 or self.incoming_stock < 0:
            raise ValueError(f"Stock values cannot be negative for {self.product_id}")

