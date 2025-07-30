# Smart Warehouse Reordering System

A full-stack inventory intelligence platform built to help small-scale e-commerce businesses manage their warehouse stock efficiently. This system minimizes the risk of stockouts and overstocking by generating intelligent reorder recommendations based on real-time data and business logic.

---

## ✨ Key Features

### 📊 Real-Time Inventory Dashboard

* Monitor current stock levels, incoming quantities, and estimated days of stock remaining.
* Provides a holistic view of inventory health.

### 🧠 Intelligent Reordering Engine

* Calculates "days of stock remaining" using actual sales velocity.
* Triggers reorder alerts when projected stock coverage falls below the defined safety threshold (lead time + buffer).
* Suggests optimal reorder quantities to maintain a consistent 60-day stock coverage.

### 🔁 Scenario Simulation

* Simulate demand spikes (e.g., during festive sales) to assess inventory impact and reordering needs.
* Adjusts recommendations dynamically in response to temporary sales surges.

### 🔧 Full CRUD Functionality

* **Add Products:** Register new SKUs in the system.
* **Delete Products:** Remove obsolete or discontinued items.
* **Create Purchase Orders:** Manually initiate replenishment based on suggested quantities.
* **Export Reports:** Download reorder reports in CSV or JSON format for record-keeping or further analysis.

---

## 💻 Technology Stack

| Layer    | Tools                                |
| -------- | ------------------------------------ |
| Frontend | React.js, Tailwind CSS, Lucide Icons |
| Backend  | Flask (Python)                       |
| Language | JavaScript (ES6+), Python 3          |

---

## 🚀 Setup Instructions

### Backend (Flask)

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
# For Windows:
venv\Scripts\activate
# For macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```

Server runs at: `http://localhost:5000`

### Frontend (React)

```bash
# Navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the React development server
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🧠 Core Logic Overview

### Reorder Logic (Defined in `reorder_logic.py`)

* **Days of Stock Remaining** = `current_stock / avg_daily_sales`
* **Reorder Trigger Point** = `lead_time_days + 5 (buffer)`
* **Suggested Reorder Quantity** = `(60 * avg_daily_sales) - current_stock - incoming_stock`

  * Reorder quantity is rounded up to respect the product's minimum reorder threshold.

### Reorder Report Generation

* Identifies SKUs requiring replenishment.
* Displays suggested reorder quantities and associated costs.
* Report is exportable in CSV or JSON formats.

### Demand Spike Simulation

* User can simulate a sales spike (e.g., 3x daily sales for 7 days).
* System updates inventory projections and reorder recommendations accordingly.

---

## 📦 Product Data Model

Each product object includes the following fields:

* `id` (str): Unique identifier
* `name` (str): Product name
* `current_stock` (int): Units in warehouse
* `incoming_stock` (int): Ordered but undelivered stock
* `average_daily_sales` (float): Sales rate
* `lead_time_days` (int): Supplier delivery lead time
* `min_reorder_qty` (int): Minimum purchase batch size
* `cost_per_unit` (float): Procurement cost per unit
* `criticality` (str): Priority or strategic importance of the item

---

## 🧪 Sample Output: Reorder Report (JSON)

```json
[
  {
    "product_id": "WIDGET_001",
    "product_name": "Blue Widget",
    "recommended_quantity": 320,
    "estimated_cost": 6400.0
  },
  {
    "product_id": "GIZMO_023",
    "product_name": "Power Gizmo",
    "recommended_quantity": 150,
    "estimated_cost": 7500.0
  }
]
```

---

## 🧾 Developer Notes

* The backend currently uses a simple in-memory data store. All data will reset upon restarting the server.
* All frontend actions are reflected in real-time through API calls to the backend.

Example terminal log when creating a new order:

```
127.0.0.1 - - [30/Jul/2025 17:35:10] "POST /api/create-order HTTP/1.1" 200 -
```

---

## 🛠 Future Enhancements

* Integration with persistent databases like PostgreSQL or MongoDB.
* Role-based authentication (Admin, Warehouse Staff).
* Automatic email/SMS alerts for critical reorders.
* Visual analytics dashboards (charts, sales trends, seasonal forecasting).

---

## ✅ Assignment Notes

* This project was developed as part of a time-bound technical assignment (6 hours) for CareEco Technologies Pvt. Ltd.
* All business requirements such as safety stock, reorder quantity optimization, and demand simulation have been implemented as specified.

---

## 📌 Submission Details

**Submitted To:** CareEco Technologies Pvt. Ltd.
**Submitted By:** \Rakshit Narang
**Submission Date:** July 30, 2025
**Duration:** 6 hours (12:00 PM to 6:00 PM)

---

Thank you for the opportunity. I look forward to your feedback and further discussions.
