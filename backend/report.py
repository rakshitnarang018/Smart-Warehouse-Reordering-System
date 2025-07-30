import csv
from typing import List, Dict, Any
from datetime import datetime

class ReorderReportGenerator:
    """Generate reorder reports in various formats"""
    
    def print_summary(self, products: List, recommendations: List[Dict[str, Any]]):
        """Print a summary of current inventory status"""
        print("\n" + "="*80)
        print("📦 SMART WAREHOUSE REORDERING SYSTEM - INVENTORY SUMMARY")
        print("="*80)
        
        total_products = len(products)
        products_needing_reorder = len(recommendations)
        total_reorder_cost = sum(rec['estimated_cost'] for rec in recommendations)
        
        print(f"📊 Total Products: {total_products}")
        print(f"⚠️  Products Needing Reorder: {products_needing_reorder}")
        print(f"💰 Total Estimated Reorder Cost: ${total_reorder_cost:,.2f}")
        print(f"📅 Report Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        if not recommendations:
            print("\n✅ All products have sufficient stock levels!")
            return
        
        print(f"\n{'='*80}")
        print("🚨 REORDER RECOMMENDATIONS")
        print("="*80)
    
    def print_recommendations(self, recommendations: List[Dict[str, Any]]):
        """Print detailed reorder recommendations"""
        if not recommendations:
            return
            
        for i, rec in enumerate(recommendations, 1):
            criticality_icon = "🔴" if rec['criticality'] == 'high' else "🟡" if rec['criticality'] == 'medium' else "🟢"
            
            print(f"\n{i}. {criticality_icon} {rec['product_id']} ({rec['criticality'].upper()} PRIORITY)")
            print(f"   📦 Current Stock: {rec['current_stock']} units")
            print(f"   🚚 Incoming Stock: {rec['incoming_stock']} units")
            print(f"   ⏰ Days Remaining: {rec['days_remaining']} days")
            print(f"   📈 Suggested Reorder: {rec['suggested_reorder_quantity']} units")
            print(f"   💵 Estimated Cost: ${rec['estimated_cost']:,.2f}")
            print(f"   🕒 Lead Time: {rec['lead_time_days']} days")
    
    def export_to_csv(self, recommendations: List[Dict[str, Any]], filename: str = "reorder_report.csv"):
        """Export recommendations to CSV file"""
        if not recommendations:
            print("ℹ️  No reorder recommendations to export.")
            return
        
        fieldnames = ['product_id', 'current_stock', 'incoming_stock', 'days_remaining', 
                     'suggested_reorder_quantity', 'estimated_cost', 'criticality', 'lead_time_days']
        
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(recommendations)
        
        print(f"📄 Report exported to: {filename}")

