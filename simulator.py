from typing import List
from models import Product
from reorder_logic import ReorderCalculator

class DemandSpikeSimulator:
    """Simulate demand spikes and their impact on reordering"""
    
    def __init__(self):
        self.calculator = ReorderCalculator()
    
    def simulate_spike(self, products: List[Product], product_id: str, 
                      multiplier: float = 3.0, days: int = 7) -> List[Product]:
        """Simulate a demand spike for a specific product"""
        simulated_products = []
        
        for product in products:
            if product.product_id == product_id:
                # Create a copy with adjusted sales
                simulated_product = Product(
                    product_id=product.product_id,
                    current_stock=product.current_stock,
                    incoming_stock=product.incoming_stock,
                    average_daily_sales=product.average_daily_sales * multiplier,
                    lead_time_days=product.lead_time_days,
                    min_reorder_quantity=product.min_reorder_quantity,
                    cost_per_unit=product.cost_per_unit,
                    criticality=product.criticality
                )
                simulated_products.append(simulated_product)
                print(f"🔥 SPIKE SIMULATION: {product_id}")
                print(f"   Original daily sales: {product.average_daily_sales}")
                print(f"   Spiked daily sales: {simulated_product.average_daily_sales} ({multiplier}x for {days} days)")
            else:
                simulated_products.append(product)
        
        return simulated_products
