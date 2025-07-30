import React from 'react';
import { Package, AlertTriangle, BarChart3 } from 'lucide-react';

// Tab Navigation Component
const TabNav = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'overview', label: 'Inventory Overview', icon: Package },
        { id: 'recommendations', label: 'Reorder Recommendations', icon: AlertTriangle },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 }
    ];

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="container mx-auto px-6">
                <div className="flex space-x-1">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
                                activeTab === id
                                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                                    : 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-gray-50'
                            }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default TabNav;