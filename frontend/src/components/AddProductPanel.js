import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

// New component to add a product
const AddProductPanel = ({ onAddProduct }) => {
    // State to hold all form input values
    const [product, setProduct] = useState({
        product_id: '',
        current_stock: '',
        incoming_stock: '0',
        average_daily_sales: '',
        lead_time_days: '',
        min_reorder_quantity: '',
        cost_per_unit: '',
        criticality: 'medium'
    });
    const [error, setError] = useState('');

    // Update state when user types in an input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation to ensure required fields are not empty
        for (const key in product) {
            if (product[key] === '') {
                setError(`Field '${key.replace(/_/g, ' ')}' cannot be empty.`);
                return;
            }
        }
        setError('');
        onAddProduct(product); // Call the main function from App.js
        // Reset form after submission
        setProduct({
            product_id: '', current_stock: '', incoming_stock: '0', average_daily_sales: '',
            lead_time_days: '', min_reorder_quantity: '', cost_per_unit: '', criticality: 'medium'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                    <PlusCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Add New Product</h3>
                    <p className="text-gray-600">Fill in the details to add a new item to the inventory.</p>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Form Inputs */}
                    <input name="product_id" value={product.product_id} onChange={handleChange} placeholder="Product ID (e.g., WIDGET_101)" className="p-2 border rounded-lg" />
                    <input name="current_stock" type="number" min="0" value={product.current_stock} onChange={handleChange} placeholder="Current Stock" className="p-2 border rounded-lg" />
                    <input name="average_daily_sales" type="number" min="0" step="0.1" value={product.average_daily_sales} onChange={handleChange} placeholder="Avg Daily Sales" className="p-2 border rounded-lg" />
                    <input name="cost_per_unit" type="number" min="0" step="0.01" value={product.cost_per_unit} onChange={handleChange} placeholder="Cost Per Unit" className="p-2 border rounded-lg" />
                    <input name="lead_time_days" type="number" min="0" value={product.lead_time_days} onChange={handleChange} placeholder="Lead Time (Days)" className="p-2 border rounded-lg" />
                    <input name="min_reorder_quantity" type="number" min="0" value={product.min_reorder_quantity} onChange={handleChange} placeholder="Min Reorder Qty" className="p-2 border rounded-lg" />
                    <input name="incoming_stock" type="number" min="0" value={product.incoming_stock} onChange={handleChange} placeholder="Incoming Stock" className="p-2 border rounded-lg" />
                    <select name="criticality" value={product.criticality} onChange={handleChange} className="p-2 border rounded-lg bg-white">
                        <option value="high">High Criticality</option>
                        <option value="medium">Medium Criticality</option>
                        <option value="low">Low Criticality</option>
                    </select>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2">
                    <PlusCircle className="h-5 w-5" />
                    <span>Add Product to Inventory</span>
                </button>
            </form>
        </div>
    );
};

export default AddProductPanel;