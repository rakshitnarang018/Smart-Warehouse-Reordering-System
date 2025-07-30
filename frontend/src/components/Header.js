import React from 'react';
import { Package } from 'lucide-react';

// Header Component
const Header = () => (
    <header className="gradient-bg text-white shadow-2xl">
        <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                        <Package className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Smart Warehouse</h1>
                        <p className="text-blue-100">Intelligent Reordering System</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="text-sm text-blue-100">Last Updated</p>
                        <p className="font-semibold">{new Date().toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>
        </div>
    </header>
);

export default Header;
