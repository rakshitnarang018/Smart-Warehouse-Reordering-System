import React, { useState } from 'react';
import { Play, RefreshCw } from 'lucide-react';

// Simulation Panel Component
const SimulationPanel = ({ products, onSimulate, isSimulating }) => {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [multiplier, setMultiplier] = useState(3.0);
    const [days, setDays] = useState(7);

    const handleSimulate = () => {
        if (selectedProduct) {
            onSimulate(selectedProduct, multiplier, days);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <Play className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Demand Spike Simulation</h3>
                    <p className="text-gray-600">Test how demand spikes affect reorder recommendations</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select Product</option>
                        {products.map(product => (
                            <option key={product.product_id} value={product.product_id}>
                                {product.product_id}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Spike Multiplier</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.1"
                        value={multiplier}
                        onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                    <input
                        type="number"
                        min="1"
                        max="30"
                        value={days}
                        onChange={(e) => setDays(parseInt(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        onClick={handleSimulate}
                        disabled={!selectedProduct || isSimulating}
                        className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                        {isSimulating ? (
                            <RefreshCw className="h-5 w-5 animate-spin" />
                        ) : (
                            <Play className="h-5 w-5" />
                        )}
                        <span>{isSimulating ? 'Simulating...' : 'Run Simulation'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SimulationPanel;
