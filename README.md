# 💰 Expense Tracker Application

> **Full Stack Developer Role - Round 2 Assignment**  
> Submitted by: Akshat Rastogi  
> GitHub: [-FJ-BE-R2-Akshat-NIT-DELHI](https://github.com/requiremen/-FJ-BE-R2-Akshat-NIT-DELHI)

A comprehensive, full-stack personal finance management application built to help users track their income, expenses, and budget goals with ease. This project demonstrates proficiency in the **MERN stack** (MongoDB, Express.js, React, Node.js), secure authentication, and real-time data visualization.

---

## 🚀 Key Features

### 🔐 Authentication & Security
*   **Secure Sign-Up/Login**: User accounts created with secure password hashing (bcrypt).
*   **Google OAuth Integration**: One-click login using Google accounts for seamless access.
*   **JWT Authorization**: Protected routes ensure user data privacy and security.

### 💸 Transaction Management
*   **Comprehensive Tracking**: Log both **Income** and **Expense** transactions.
*   **Multi-Currency Support**: Record transactions in **INR (₹), USD ($), EUR (€), or GBP (£)**.
*   **CRUD Operations**: Full capability to Add, View, Edit, and Delete transactions.
*   **Categorization**: Organize finances with built-in categories (Food, Transport, Salary, Investments, etc.).

### 📊 Dashboard & Analytics
*   **Visual Insights**: Interactive charts powered by `recharts`:
    *   **Bar Chart**: Compare monthly Income vs. Expenses.
    *   **Pie Chart**: Analyze spending breakdown by category.
*   **Financial Health Overview**: Instant view of Total Balance, Total Income, and Total Expense.
*   **Recent Activity**: Quick access to the latest 5 transactions.

### 🎯 Smart Budgeting
*   **Category-Based Budgets**: Set monthly spending limits for specific categories (e.g., "₹5000 for Food").
*   **Visual Progress**: Dashboard progress bars turn **Red** when you exceed your budget and **Green** when you are within limits.
*   **Email Notifications**: Automated email alerts via **Nodemailer** when a transaction pushes spending over the set budget.

### 🌐 Modern UI/UX
*   **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile.
*   **Onboarding Flow**: Guided setup for new users to set initial balance and preferred currency.
*   **Clean Interface**: Built with **Tailwind CSS** for a polished, professional look.

---

## 🛠️ Tech Stack

### Frontend
*   **React.js** (Vite): Fast, component-based UI library.
*   **Tailwind CSS**: Utility-first styling for rapid design.
*   **Recharts**: Composable charting library for React.
*   **Lucide React**: Beautiful, consistent icons.
*   **Axios**: Promise-based HTTP client for API requests.

### Backend
*   **Node.js & Express.js**: Scalable server-side framework.
*   **MongoDB (Mongoose)**: NoSQL database for flexible data storage.
*   **JSON Web Tokens (JWT)**: Stateless authentication mechanism.
*   **Nodemailer**: Email sending service for notifications.
*   **Google Auth Library**: Backend verification for Google Sign-In.

---

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/requiremen/-FJ-BE-R2-Akshat-NIT-DELHI.git
    cd expense-tracker
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    # Create a .env file with the following:
    # MONGODB_URL=your_mongodb_url
    # JWT_SECRET=your_jwt_secret
    # GOOGLE_CLIENT_ID=your_google_client_id
    # EMAIL_USER=your_email@gmail.com (for notifications)
    # EMAIL_PASS=your_email_app_password
    node index.js
    ```

3.  **Setup Frontend**
    ```bash
    cd ../frontend
    npm install
    # Create a .env file with the following:
    # VITE_GOOGLE_CLIENT_ID=your_google_client_id
    npm run dev
    ```

4.  **Access the App**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📷 Screenshots

*(Add screenshots of your Dashboard, Login Page, and Budget features here)*

---

## 📬 Contact
**Akshat Rastogi**  
NIT Delhi  
