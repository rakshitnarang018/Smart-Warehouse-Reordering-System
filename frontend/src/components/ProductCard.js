import React from 'react';
import { Trash2 } from 'lucide-react';

// Product Card Component now receives an onDelete function
const ProductCard = ({ product, onDelete }) => {
    const getStatusColor = (days) => {
        if (days <= 3) return 'bg-red-100 text-red-700';
        if (days <= 7) return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    const getCriticalityColor = (criticality) => {
        switch (criticality) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-green-600 bg-green-100';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-transform transform hover:scale-105 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{product.product_id}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCriticalityColor(product.criticality)}`}>
                            {product.criticality.toUpperCase()} PRIORITY
                        </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.days_remaining)}`}>
                        {product.days_remaining} days left
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm text-gray-600">Current Stock</p>
                        <p className="text-xl font-bold text-gray-900">{product.current_stock}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Incoming Stock</p>
                        <p className="text-xl font-bold text-blue-600">{product.incoming_stock}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Daily Sales</p>
                        <p className="text-lg font-semibold text-gray-700">{product.average_daily_sales}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Lead Time</p>
                        <p className="text-lg font-semibold text-gray-700">{product.lead_time_days} days</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center mt-2">
                <div>
                    <span className="text-sm text-gray-600">Unit Cost: </span>
                    <span className="font-semibold text-gray-900">${product.cost_per_unit}</span>
                </div>
                {/* --- ✨ NEW: Delete Button --- */}
                <button 
                    onClick={() => onDelete(product.product_id)}
                    className="p-2 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors"
                    aria-label={`Delete ${product.product_id}`}
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
