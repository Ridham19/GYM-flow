# 🏋️ GymFlow - Smart Gym Reservation System (🚧 Under Work)

![License](https://img.shields.io/badge/License-MIT-blue.svg) ![Status](https://img.shields.io/badge/Status-In%20Development-yellow) ![Stack](https://img.shields.io/badge/Stack-MERN-green)

**GymFlow** is a modern, web-based application designed to streamline gym equipment management and user bookings. It allows members to reserve specific machines in real-time, avoiding wait times and optimizing their workout schedules.

> **Note:** This project is currently **Under Active Development**. Features and UI are subject to change.

---

## ✨ Features

### 👤 User Features
*   **Secure Authentication**: Sign up and login with JWT-based auth.
*   **Real-time Availability**: Check which machines are free or booked instantly.
*   **Visual Schedule**: Interactive schedule view to see booking slots (5 AM - 10 PM).
*   **Analog/Digital Clock Picker**: sleek time selection interface.
*   **Responsive Design**: Mobile-friendly interface for booking on the go.

### 🛡️ Admin Features
*   **Dashboard**: Overview of gym inventory.
*   **Inventory Management**: Add, edit, or remove gym machines and equipment.
*   **Live Reservations**: View all active bookings in real-time.
*   **User Management**: Monitor user activity (coming soon).

---

## 🛠️ Tech Stack

*   **Frontend**: React.js (Vite), Tailwind CSS, Lucide Icons, Framer Motion (animations).
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB.
*   **Authentication**: JWT (JSON Web Tokens).
*   **State Management**: Zustand.

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v16+)
*   MongoDB (Local or Atlas URL)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/gym-reservation.git
    cd gym-reservation
    ```

2.  **Install Dependencies**
    *   Root/Backend dependencies:
        ```bash
        npm install
        ```
    *   Frontend dependencies:
        ```bash
        cd frontend
        npm install
        ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/gym_database
    JWT_SECRET=your_super_secret_key
    NODE_ENV=development
    ```

4.  **Run the App**
    You can run both backend and frontend concurrently from the root (if scripts are set up) or separately:

    *   **Backend**: `npm run server` (or `node backend/server.js`)
    *   **Frontend**: `cd frontend && npm run dev`

5.  **Access the App**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---




## 📄 License

This project is licensed under the MIT License.
