from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import copy

# Import your existing modules
from models import Product
from reorder_logic import ReorderCalculator
from simulator import DemandSpikeSimulator
from report import ReorderReportGenerator
from sample_data import get_sample_products

app = Flask(__name__)
CORS(app) # This allows your React app to connect

# --- In-Memory Data Store ---
# This acts as a simple database. It's initialized once and then modified by API calls.
products_in_memory = get_sample_products()

# Initialize system components
calculator = ReorderCalculator()
simulator = DemandSpikeSimulator()
reporter = ReorderReportGenerator()

# --- ✨ NEW: API Endpoint to Add a New Product ---
@app.route('/api/products/add', methods=['POST'])
def add_product():
    global products_in_memory
    data = request.get_json()
    try:
        # Check if product ID already exists
        if any(p.product_id == data.get('product_id') for p in products_in_memory):
            return jsonify({"error": f"Product ID '{data.get('product_id')}' already exists."}), 409

        # Create a new Product object with proper type casting
        new_product = Product(
            product_id=str(data.get('product_id')),
            current_stock=int(data.get('current_stock')),
            incoming_stock=int(data.get('incoming_stock', 0)),
            average_daily_sales=float(data.get('average_daily_sales')),
            lead_time_days=int(data.get('lead_time_days')),
            min_reorder_quantity=int(data.get('min_reorder_quantity')),
            cost_per_unit=float(data.get('cost_per_unit')),
            criticality=str(data.get('criticality'))
        )
        products_in_memory.append(new_product)
        return jsonify({"message": f"Product '{new_product.product_id}' added successfully."}), 201

    except (ValueError, TypeError) as e:
        return jsonify({"error": f"Invalid data provided: {e}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- ✨ NEW: API Endpoint to Delete a Product ---
@app.route('/api/products/delete/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    global products_in_memory
    product_to_delete = next((p for p in products_in_memory if p.product_id == product_id), None)
    
    if product_to_delete:
        products_in_memory.remove(product_to_delete)
        return jsonify({"message": f"Product '{product_id}' deleted successfully."})
    else:
        return jsonify({"error": "Product not found."}), 404

# --- MODIFIED: API Endpoint to Create an Order ---
@app.route('/api/create-order', methods=['POST'])
def create_order():
    global products_in_memory
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity')

    if not all([product_id, quantity]):
        return jsonify({"error": "product_id and quantity are required"}), 400

    product_found = False
    for product in products_in_memory:
        if product.product_id == product_id:
            # Ensure quantity is an integer before adding
            product.incoming_stock += int(quantity)
            product_found = True
            break
    
    if not product_found:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({
        "message": f"Order for {quantity} units of {product_id} created successfully. Incoming stock updated.",
        "product_id": product_id,
        "new_incoming_stock": product.incoming_stock
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

# --- MODIFIED: All endpoints below now use `products_in_memory` ---

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all products with their current status from memory"""
    global products_in_memory
    try:
        products_data = []
        for product in products_in_memory:
            days_remaining = calculator.calculate_days_remaining(product)
            needs_reorder = calculator.needs_reorder(product)
            
            product_data = {
                'product_id': product.product_id,
                'current_stock': product.current_stock,
                'incoming_stock': product.incoming_stock,
                'average_daily_sales': product.average_daily_sales,
                'lead_time_days': product.lead_time_days,
                'min_reorder_quantity': product.min_reorder_quantity,
                'cost_per_unit': product.cost_per_unit,
                'criticality': product.criticality,
                'days_remaining': round(days_remaining, 1),
                'needs_reorder': needs_reorder,
                'safety_threshold': calculator.calculate_safety_threshold(product)
            }
            products_data.append(product_data)
        
        return jsonify({
            "products": products_data,
            "total_count": len(products_data),
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        print(f"Error in get_products: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    """Get reorder recommendations based on data in memory"""
    global products_in_memory
    try:
        recommendations = calculator.generate_reorder_recommendations(products_in_memory)
        return jsonify({
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        print(f"Error in get_recommendations: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/simulate-spike', methods=['POST'])
def simulate_demand_spike():
    """Simulate demand spike without changing the persistent in-memory data"""
    global products_in_memory
    try:
        data = request.get_json()
        product_id = data.get('product_id')
        multiplier = data.get('multiplier', 3.0)
        days = data.get('days', 7)
        
        if not product_id:
            return jsonify({"error": "product_id is required"}), 400
        
        products_for_simulation = copy.deepcopy(products_in_memory)
        
        simulated_products = simulator.simulate_spike(
            products_for_simulation, product_id, multiplier, days
        )
        
        recommendations = calculator.generate_reorder_recommendations(simulated_products)
        
        return jsonify({
            "simulation": {
                "product_id": product_id,
                "multiplier": multiplier,
                "days": days
            },
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        print(f"Error in simulate_demand_spike: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get analytics data for dashboard from memory"""
    global products_in_memory
    try:
        recommendations = calculator.generate_reorder_recommendations(products_in_memory)
        
        criticality_breakdown = {'high': 0, 'medium': 0, 'low': 0}
        stock_levels = []
        
        for product in products_in_memory:
            criticality_breakdown[product.criticality] += 1
            days_remaining = calculator.calculate_days_remaining(product)
            
            stock_levels.append({
                'product_id': product.product_id,
                'days_remaining': round(days_remaining, 1),
                'criticality': product.criticality,
                'current_stock': product.current_stock
            })
        
        urgency_levels = {'critical': 0, 'urgent': 0, 'moderate': 0}
        for rec in recommendations:
            if rec['days_remaining'] <= 3:
                urgency_levels['critical'] += 1
            elif rec['days_remaining'] <= 7:
                urgency_levels['urgent'] += 1
            else:
                urgency_levels['moderate'] += 1
        
        total_inventory_value = sum(p.current_stock * p.cost_per_unit for p in products_in_memory)
        
        return jsonify({
            "criticality_breakdown": criticality_breakdown,
            "stock_levels": stock_levels,
            "urgency_levels": urgency_levels,
            "total_inventory_value": round(total_inventory_value, 2),
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        print(f"Error in get_analytics: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/export', methods=['POST'])
def export_data():
    """Export recommendations data from memory"""
    global products_in_memory
    try:
        data = request.get_json()
        export_format = data.get('format', 'csv')
        
        recommendations = calculator.generate_reorder_recommendations(products_in_memory)
        
        if export_format == 'csv':
            csv_data = []
            headers = ['Product ID', 'Current Stock', 'Incoming Stock', 'Days Remaining',
                       'Suggested Reorder Quantity', 'Estimated Cost', 'Criticality', 'Lead Time Days']
            csv_data.append(headers)
            
            for rec in recommendations:
                row = [
                    rec['product_id'], rec['current_stock'], rec['incoming_stock'],
                    rec['days_remaining'], rec['suggested_reorder_quantity'],
                    rec['estimated_cost'], rec['criticality'], rec['lead_time_days']
                ]
                csv_data.append(row)
            
            return jsonify({
                "format": "csv", "data": csv_data,
                "filename": f"reorder_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                "timestamp": datetime.now().isoformat()
            })
        
        elif export_format == 'json':
            return jsonify({
                "format": "json",
                "data": {
                    "recommendations": recommendations,
                    "export_date": datetime.now().isoformat(),
                    "total_items": len(recommendations)
                },
                "filename": f"reorder_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                "timestamp": datetime.now().isoformat()
            })
        
        else:
            return jsonify({"error": "Unsupported export format"}), 400
            
    except Exception as e:
        print(f"Error in export_data: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, host='localhost', port=5000)