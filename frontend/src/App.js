import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TabNav from './components/TabNav';
import ProductCard from './components/ProductCard';
import ReorderList from './components/ReorderList';
import SimulationPanel from './components/SimulationPanel';
import ExportPanel from './components/ExportPanel';
import AddProductPanel from './components/AddProductPanel'; // ✨ Import new component
import api from './services/api';
import { AlertTriangle, RefreshCw, Play, Package, TrendingUp, DollarSign } from 'lucide-react';

// Main App Component
const App = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [products, setProducts] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSimulating, setIsSimulating] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState(null);
    const [simulationResult, setSimulationResult] = useState(null);

    // Initial data load
    useEffect(() => {
        loadData();
    }, []);

    // --- Central function to fetch all data and update state ---
    const loadData = async () => {
        setError(null);
        try {
            const [productsData, recommendationsData, analyticsData] = await Promise.all([
                api.getProducts(),
                api.getRecommendations(),
                api.getAnalytics()
            ]);
            setProducts(productsData.products);
            setRecommendations(recommendationsData.recommendations);
            setAnalytics(analyticsData);
        } catch (err) {
            setError(err.message || 'Failed to load data. Make sure the API is running.');
            console.error('Error loading data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Handler for adding a product ---
    const handleAddProduct = async (productData) => {
        try {
            await api.addProduct(productData);
            await loadData(); // Refresh all data after adding
        } catch (err) {
            setError(err.message); // Show specific error from backend
            console.error('Add product error:', err);
        }
    };

    // --- Handler for deleting a product ---
    const handleDeleteProduct = async (productId) => {
        if (window.confirm(`Are you sure you want to delete product: ${productId}?`)) {
            try {
                await api.deleteProduct(productId);
                await loadData(); // Refresh all data after deleting
            } catch (err) {
                setError(err.message);
                console.error('Delete product error:', err);
            }
        }
    };

    // --- Handler to create order with custom quantity ---
    const handleCreateOrder = async (productId, quantity) => {
        try {
            await api.createOrder(productId, quantity);
            await loadData(); // Refresh all data after creating order
            setActiveTab('overview');
        } catch (err) {
            setError(err.message);
            console.error('Create order error:', err);
        }
    };

    const handleSimulation = async (productId, multiplier, days) => {
        setIsSimulating(true);
        try {
            const result = await api.simulateSpike(productId, multiplier, days);
            setSimulationResult(result);
            setRecommendations(result.recommendations);
        } catch (err) {
            setError(err.message || 'Simulation failed');
            console.error('Simulation error:', err);
        } finally {
            setIsSimulating(false);
        }
    };

    const handleExport = async (format) => {
        setIsExporting(true);
        try {
            const result = await api.exportData(format);
            let content, mimeType;
            if (format === 'csv') {
                content = result.data.map(row => row.join(',')).join('\n');
                mimeType = 'text/csv';
            } else {
                content = JSON.stringify(result.data, null, 2);
                mimeType = 'application/json';
            }
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = result.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.message || 'Export failed');
            console.error('Export error:', err);
        } finally {
            setIsExporting(false);
        }
    };

    const clearSimulation = () => {
        setSimulationResult(null);
        loadData(); // Reload original data
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-6 py-12">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-center text-gray-600 mt-4">Loading warehouse data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <main className="container mx-auto px-6 py-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                        </span>
                    </div>
                )}

                {simulationResult && (
                    <div className="bg-orange-100 border border-orange-300 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Play className="h-6 w-6 text-orange-600" />
                                <div>
                                    <h4 className="font-semibold text-orange-800">
                                        Simulation Active: {simulationResult.simulation.product_id}
                                    </h4>
                                    <p className="text-orange-700">
                                        Demand increased by {simulationResult.simulation.multiplier}x for {simulationResult.simulation.days} days
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={clearSimulation}
                                className="text-orange-600 hover:text-orange-800 px-3 py-1 rounded-lg hover:bg-orange-200 transition-colors"
                            >
                                Clear Simulation
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        <AddProductPanel onAddProduct={handleAddProduct} />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SimulationPanel 
                                products={products}
                                onSimulate={handleSimulation}
                                isSimulating={isSimulating}
                            />
                            <ExportPanel 
                                onExport={handleExport}
                                isExporting={isExporting}
                            />
                        </div>

                        {analytics && (
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <Package className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Products</p>
                                            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-red-100 rounded-lg">
                                            <AlertTriangle className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Need Reorder</p>
                                            <p className="text-2xl font-bold text-red-600">{recommendations.length}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-green-100 rounded-lg">
                                            <TrendingUp className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Stock Health</p>
                                            <p className="text-2xl font-bold text-green-600">
                                                {products.length > 0 ? Math.round((products.length - recommendations.length) / products.length * 100) : 100}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-purple-100 rounded-lg">
                                            <DollarSign className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Reorder Cost</p>
                                            <p className="text-2xl font-bold text-purple-600">
                                                ${recommendations.reduce((sum, rec) => sum + rec.estimated_cost, 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Inventory</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map(product => (
                                    // --- ✨ FIX IS HERE: Passing the onDelete prop ---
                                    <ProductCard key={product.product_id} product={product} onDelete={handleDeleteProduct} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'recommendations' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Reorder Recommendations</h2>
                            <button
                                onClick={loadData}
                                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <RefreshCw className="h-5 w-5" />
                                <span>Refresh</span>
                            </button>
                        </div>
                        <ReorderList 
                            recommendations={recommendations} 
                            onCreateOrder={handleCreateOrder} 
                        />
                    </div>
                )}

                {activeTab === 'analytics' && analytics && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Criticality Breakdown</h3>
                                <div className="space-y-3">
                                    {Object.entries(analytics.criticality_breakdown).map(([level, count]) => (
                                        <div key={level} className="flex justify-between items-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                level === 'high' ? 'bg-red-100 text-red-700' :
                                                level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {level.toUpperCase()}
                                            </span>
                                            <span className="text-lg font-bold">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Urgency Levels</h3>
                                <div className="space-y-3">
                                    {Object.entries(analytics.urgency_levels).map(([level, count]) => (
                                        <div key={level} className="flex justify-between items-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                level === 'critical' ? 'bg-red-100 text-red-700' :
                                                level === 'urgent' ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {level.toUpperCase()}
                                            </span>
                                            <span className="text-lg font-bold">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Inventory Value</h3>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-green-600">
                                        ${analytics.total_inventory_value.toLocaleString()}
                                    </p>
                                    <p className="text-gray-600 mt-2">Current stock value</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Stock Levels Overview</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {analytics.stock_levels.map(item => (
                                    <div key={item.product_id} className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">{item.product_id}</h4>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Days remaining</span>
                                            <span className={`font-bold ${
                                                item.days_remaining <= 3 ? 'text-red-600' :
                                                item.days_remaining <= 7 ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>
                                                {item.days_remaining}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Stock</span>
                                            <span className="font-semibold">{item.current_stock}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
