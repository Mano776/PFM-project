# 💰 Personal Finance Management System

A full-stack web application that helps users manage their personal finances by tracking income, expenses, budgets, and generating financial reports.

---

## 🚀 Features

* 🔐 User Authentication (Firebase Auth)
* 💵 Add, edit, delete income
* 💸 Add, edit, delete expenses
* 📊 Dashboard with total income, expense, and balance
* 📉 Charts for financial analysis (Chart.js)
* ⚠️ Expense limit warning (80% budget alert)
* 📄 Download financial report as PDF
* 📱 Responsive UI

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Axios
* Chart.js
* Firebase SDK

### Backend (Optional)

* Node.js
* Express.js
* PDFKit

### Database

* Firebase Firestore

### Authentication

* Firebase Authentication
---

## ⚙️ Installation

### 1. Clone the repository

```
git clone https://github.com/your-username/finance-management-system.git
cd finance-management-system
```

---

### 2. Setup Frontend

```
cd frontend
npm install
npm run dev
```

---

### 3. Setup Backend

```
cd backend
npm install
npm run dev
```

---

## 🔥 Firebase Setup

1. Go to Firebase Console
2. Create a project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Copy Firebase config and paste in `firebaseConfig.js`

---

## 🌐 Environment Variables

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000
```

### Backend (.env)

```
PORT=3000
```

---

## 📊 Firestore Collections

* users
* income
* expenses
* budgets

---

## 🧠 How It Works

* Users register/login using Firebase Authentication
* Data is stored in Firebase Firestore
* Users can add income and expenses
* Dashboard calculates total balance
* Charts display financial insights
* PDF reports can be downloaded

---

## 📸 Screenshots (Optional)

*Add screenshots of your UI here*

---

## 🤝 Contributing

Feel free to fork this project and improve it.

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Author

Manoj Kumar
