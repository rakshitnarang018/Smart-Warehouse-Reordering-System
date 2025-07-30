import React, { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';

// Export Panel Component
const ExportPanel = ({ onExport, isExporting }) => {
    const [format, setFormat] = useState('csv');

    const handleExport = () => {
        onExport(format);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                    <Download className="h-6 w-6 text-green-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Export Data</h3>
                    <p className="text-gray-600">Download reorder recommendations</p>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex-1">
                    <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="csv">CSV Format</option>
                        <option value="json">JSON Format</option>
                    </select>
                </div>
                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                    {isExporting ? (
                        <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                        <Download className="h-5 w-5" />
                    )}
                    <span>{isExporting ? 'Exporting...' : 'Export'}</span>
                </button>
            </div>
        </div>
    );
};

export default ExportPanel;
