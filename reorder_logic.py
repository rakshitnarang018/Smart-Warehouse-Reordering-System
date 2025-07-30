from typing import List, Dict, Any
from models import Product

class ReorderCalculator:
    """Core logic for warehouse reordering decisions"""
    
    SAFETY_BUFFER_DAYS = 5
    TARGET_STOCK_DAYS = 60
    
    def calculate_days_remaining(self, product: Product) -> float:
        """Calculate days of stock remaining based on current stock only"""
        return product.current_stock / product.average_daily_sales
    
    def calculate_safety_threshold(self, product: Product) -> int:
        """Calculate safety stock threshold"""
        return product.lead_time_days + self.SAFETY_BUFFER_DAYS
    
    def needs_reorder(self, product: Product) -> bool:
        """Determine if product needs reordering"""
        days_remaining = self.calculate_days_remaining(product)
        safety_threshold = self.calculate_safety_threshold(product)
        return days_remaining < safety_threshold
    
    def calculate_reorder_quantity(self, product: Product) -> int:
        """Calculate optimal reorder quantity considering incoming stock"""
        required_stock = product.average_daily_sales * self.TARGET_STOCK_DAYS
        stock_needed = required_stock - product.current_stock - product.incoming_stock
        
        if stock_needed > 0:
            return max(int(stock_needed), product.min_reorder_quantity)
        else:
            return 0
    
    def process_product(self, product: Product) -> Dict[str, Any]:
        """Process a single product and return reorder recommendation"""
        days_remaining = self.calculate_days_remaining(product)
        needs_reorder = self.needs_reorder(product)
        
        if needs_reorder:
            reorder_qty = self.calculate_reorder_quantity(product)
            if reorder_qty > 0:
                estimated_cost = reorder_qty * product.cost_per_unit
                return {
                    'product_id': product.product_id,
                    'current_stock': product.current_stock,
                    'incoming_stock': product.incoming_stock,
                    'days_remaining': round(days_remaining, 1),
                    'suggested_reorder_quantity': reorder_qty,
                    'estimated_cost': round(estimated_cost, 2),
                    'criticality': product.criticality,
                    'lead_time_days': product.lead_time_days
                }
        
        return None
    
    def generate_reorder_recommendations(self, products: List[Product]) -> List[Dict[str, Any]]:
        """Generate reorder recommendations for all products"""
        recommendations = []
        
        for product in products:
            recommendation = self.process_product(product)
            if recommendation:
                recommendations.append(recommendation)
        
        # Sort by criticality (high first) then by days remaining
        criticality_order = {'high': 0, 'medium': 1, 'low': 2}
        recommendations.sort(key=lambda x: (criticality_order[x['criticality']], x['days_remaining']))
        
        return recommendations
