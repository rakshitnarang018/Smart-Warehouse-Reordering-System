// API Service
class ApiService {
    constructor() {
        // --- ✨ MODIFIED FOR DEPLOYMENT ---
        // This line now uses an environment variable for the live URL,
        // but falls back to localhost for local development.
        this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });
            
            const resJson = await response.json();
            if (!response.ok) {
                // Pass backend error message to the frontend
                throw new Error(resJson.error || `API Error: ${response.status}`);
            }
            return resJson;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    getProducts() {
        return this.request('/products');
    }

    getRecommendations() {
        return this.request('/recommendations');
    }

    // --- NEW: Function to Add a Product ---
    addProduct(productData) {
        return this.request('/products/add', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    }

    // --- NEW: Function to Delete a Product ---
    deleteProduct(productId) {
        return this.request(`/products/delete/${productId}`, {
            method: 'DELETE',
        });
    }

    createOrder(productId, quantity) {
        return this.request('/create-order', {
            method: 'POST',
            body: JSON.stringify({
                product_id: productId,
                quantity: quantity,
            }),
        });
    }

    simulateSpike(productId, multiplier, days) {
        return this.request('/simulate-spike', {
            method: 'POST',
            body: JSON.stringify({
                product_id: productId,
                multiplier: multiplier,
                days: days
            })
        });
    }

    getAnalytics() {
        return this.request('/analytics');
    }

    exportData(format) {
        return this.request('/export', {
            method: 'POST',
            body: JSON.stringify({ format })
        });
    }
}

const api = new ApiService();
export default api;
