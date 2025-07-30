import argparse
from sample_data import get_sample_products
from reorder_logic import ReorderCalculator
from simulator import DemandSpikeSimulator
from report import ReorderReportGenerator

def main():
    parser = argparse.ArgumentParser(description='Smart Warehouse Reordering System')
    parser.add_argument('--simulate-spike', type=str, metavar='PRODUCT_ID',
                       help='Simulate demand spike for specific product')
    parser.add_argument('--spike-multiplier', type=float, default=3.0,
                       help='Demand spike multiplier (default: 3.0)')
    parser.add_argument('--spike-days', type=int, default=7,
                       help='Duration of spike in days (default: 7)')
    parser.add_argument('--export-csv', action='store_true',
                       help='Export recommendations to CSV')
    
    args = parser.parse_args()
    
    # Initialize system components
    calculator = ReorderCalculator()
    simulator = DemandSpikeSimulator()
    reporter = ReorderReportGenerator()
    
    # Load sample data
    products = get_sample_products()
    
    # Handle demand spike simulation
    if args.simulate_spike:
        products = simulator.simulate_spike(
            products, 
            args.simulate_spike, 
            args.spike_multiplier, 
            args.spike_days
        )
        print(f"\n🧪 Running simulation with {args.spike_multiplier}x demand spike for {args.simulate_spike}")
    
    # Generate recommendations
    recommendations = calculator.generate_reorder_recommendations(products)
    
    # Generate reports
    reporter.print_summary(products, recommendations)
    reporter.print_recommendations(recommendations)
    
    # Export to CSV if requested
    if args.export_csv:
        reporter.export_to_csv(recommendations)
    
    print(f"\n{'='*80}")
    print("✅ Analysis Complete!")
    if recommendations:
        print(f"💡 Use --export-csv to save recommendations to file")
        print(f"🧪 Try --simulate-spike PRODUCT_ID to test demand scenarios")
    print("="*80)

if __name__ == "__main__":
    main()