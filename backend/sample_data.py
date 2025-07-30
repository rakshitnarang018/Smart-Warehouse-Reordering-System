from models import Product

def get_sample_products():
    """Generate sample product data with various edge cases"""
    return [
        # Normal product needing reorder
        Product(
            product_id="WIDGET_001",
            current_stock=50,
            incoming_stock=0,
            average_daily_sales=10.0,
            lead_time_days=7,
            min_reorder_quantity=100,
            cost_per_unit=25.50,
            criticality="high"
        ),
        
        # Product with high incoming stock - shouldn't need reorder
        Product(
            product_id="GADGET_002",
            current_stock=20,
            incoming_stock=800,
            average_daily_sales=12.0,
            lead_time_days=10,
            min_reorder_quantity=150,
            cost_per_unit=15.75,
            criticality="medium"
        ),
        
        # Critical product with very low stock
        Product(
            product_id="CRITICAL_003",
            current_stock=5,
            incoming_stock=50,
            average_daily_sales=8.0,
            lead_time_days=14,
            min_reorder_quantity=200,
            cost_per_unit=45.00,
            criticality="high"
        ),
        
        # Product with zero current stock but incoming stock
        Product(
            product_id="SUPPLY_004",
            current_stock=0,
            incoming_stock=300,
            average_daily_sales=5.0,
            lead_time_days=5,
            min_reorder_quantity=75,
            cost_per_unit=8.25,
            criticality="low"
        ),
        
        # Well-stocked product
        Product(
            product_id="STOCK_005",
            current_stock=500,
            incoming_stock=100,
            average_daily_sales=7.0,
            lead_time_days=8,
            min_reorder_quantity=120,
            cost_per_unit=12.00,
            criticality="medium"
        ),
        
        # Low sales product
        Product(
            product_id="SLOW_006",
            current_stock=80,
            incoming_stock=20,
            average_daily_sales=1.5,
            lead_time_days=12,
            min_reorder_quantity=50,
            cost_per_unit=35.00,
            criticality="low"
        ),
        
        # High velocity product
        Product(
            product_id="FAST_007",
            current_stock=200,
            incoming_stock=0,
            average_daily_sales=25.0,
            lead_time_days=6,
            min_reorder_quantity=300,
            cost_per_unit=18.50,
            criticality="high"
        )
    ]
