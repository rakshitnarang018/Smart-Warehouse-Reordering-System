import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart } from 'lucide-react';

// A single recommendation item component to manage its own quantity state
const RecommendationItem = ({ rec, index, onCreateOrder }) => {
    const [quantity, setQuantity] = useState(rec.suggested_reorder_quantity);

    // Update local quantity if the recommendation from parent changes
    useEffect(() => {
        setQuantity(rec.suggested_reorder_quantity);
    }, [rec.suggested_reorder_quantity]);

    const handleOrderClick = () => {
        // Ensure quantity is a positive number before ordering
        if (quantity > 0) {
            onCreateOrder(rec.product_id, quantity);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-red-600 font-bold">#{index + 1}</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{rec.product_id}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            rec.criticality === 'high' ? 'text-red-600 bg-red-100' :
                            rec.criticality === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                            'text-green-600 bg-green-100'
                        }`}>
                            {rec.criticality.toUpperCase()} PRIORITY
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">{rec.days_remaining} days</p>
                    <p className="text-sm text-gray-500">remaining</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Current Stock</p>
                    <p className="text-lg font-bold text-gray-900">{rec.current_stock}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-600">Incoming Stock</p>
                    <p className="text-lg font-bold text-blue-700">{rec.incoming_stock}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-600">Suggested Qty</p>
                    <p className="text-lg font-bold text-green-700">{rec.suggested_reorder_quantity}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-sm text-purple-600">Estimated Cost</p>
                    <p className="text-lg font-bold text-purple-700">${rec.estimated_cost.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 rounded-lg p-3 space-y-2 sm:space-y-0">
                <span className="text-sm text-gray-600">Lead Time: {rec.lead_time_days} days</span>
                <div className="flex items-center space-x-2">
                    <label htmlFor={`quantity-${rec.product_id}`} className="text-sm font-medium">Order Qty:</label>
                    <input
                        id={`quantity-${rec.product_id}`}
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                        className="w-24 p-2 border border-gray-300 rounded-lg"
                        min="1"
                    />
                    <button 
                        onClick={handleOrderClick}
                        disabled={!quantity || quantity <= 0}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        <span>Order</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main ReorderList component
const ReorderList = ({ recommendations, onCreateOrder }) => {
    if (!recommendations || recommendations.length === 0) {
        return (
            <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">All Products Well Stocked!</h3>
                <p className="text-gray-500">No reorder recommendations at this time.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {recommendations.map((rec, index) => (
                <RecommendationItem 
                    key={rec.product_id} 
                    rec={rec} 
                    index={index} 
                    onCreateOrder={onCreateOrder} 
                />
            ))}
        </div>
    );
};

export default ReorderList;
