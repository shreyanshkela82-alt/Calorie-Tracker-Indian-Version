# 🇮🇳 Indian Calorie Tracker

A full-stack web application designed to help users maintain a healthy lifestyle by tracking calories based on common Indian meals. The application enables users to calculate BMI & BMR, set personalized daily calorie goals, monitor progress, and receive workout recommendations through a secure and responsive dashboard.

---

## 👨‍💻 Developer

**Created by:** **Shreyansh Kela**

Computer Science Engineering Student | Full-Stack Web Developer

GitHub: https://github.com/shreyanshkela82-alt

---

## ✨ Features

- 🔐 Secure JWT Authentication
- 🍛 Indian Food Calorie Database
- 📊 BMI Calculator
- 🔥 BMR & Daily Calorie Goal Calculator
- 🎯 Personalized Fitness Goals
- 🍽️ Meal Logging
- 💪 Workout Logging
- 📈 Daily Progress Dashboard
- 📅 Progress History
- 📱 Responsive User Interface
- 🗄️ MongoDB Database Integration
- ⚡ RESTful API Architecture

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (ES6)

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT (JSON Web Tokens)
- bcrypt.js

### Tools & Technologies

- Git
- GitHub
- REST API

---

## 📂 Project Structure

```text
Backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── mealController.js
│   ├── profileController.js
│   ├── progressController.js
│   └── workoutController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── rateLimiter.js
│   └── validators.js
│
├── models/
│   ├── User.js
│   ├── Meal.js
│   ├── Workout.js
│   └── Progress.js
│
├── routes/
│   ├── authRoutes.js
│   ├── mealRoutes.js
│   ├── profileRoutes.js
│   ├── progressRoutes.js
│   └── workoutRoutes.js
│
├── utils/
│   ├── ApiError.js
│   ├── asyncHandler.js
│   ├── calorieCalculator.js
│   └── progressSync.js
│
├── package.json
└── server.js


Frontend/
│
├── loginpage.html
├── loginpage.js
├── loginpage.css
│
├── register.html
├── register.js
│
├── dashboard.html
├── dashboard.js
├── dashboard.css
│
├── profile.html
├── profile.js
├── profile.css
│
├── workout.html
├── workout.js
├── workout.css
│
├── progress.html
├── progress.js
├── progress.css
│
├── auth.js
└── assets/
```

---

## 🚀 Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/shreyanshkela82-alt/Calorie-Tracker-Indian-Version.git

cd Calorie-Tracker-Indian-Version
```

---

### Backend Setup

```bash
cd Backend

npm install

cp .env.example .env
```

Update your `.env` file with your MongoDB URI and JWT Secret.

Run the backend:

```bash
npm run dev
```

or

```bash
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

### Frontend Setup

Simply open

```
Frontend/loginpage.html
```

or serve the Frontend folder using **VS Code Live Server**.

The frontend communicates with:

```
http://localhost:5000/api
```

---

## 📌 API Overview

All protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

| Method | Endpoint | Description |
|----------|------------------------------|---------------------------------------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/profile` | Get logged-in user profile |
| PUT | `/api/profile` | Update profile & calorie targets |
| GET | `/api/meals` | Retrieve meals |
| POST | `/api/meals` | Add a meal |
| DELETE | `/api/meals/:id` | Delete a meal |
| GET | `/api/workouts` | Retrieve workouts |
| POST | `/api/workouts` | Log workout |
| DELETE | `/api/workouts/:id` | Delete workout |
| GET | `/api/progress` | Retrieve progress history |
| POST | `/api/progress` | Refresh today's progress |
| DELETE | `/api/progress/:id` | Delete progress record |

---

## 🏗️ Design Decisions

- Daily calorie targets are calculated **server-side** using the **Mifflin-St Jeor Equation**, ensuring accurate and tamper-proof calorie recommendations.
- Progress is automatically synchronized from meal and workout records, preventing inconsistencies between logged activities and displayed progress.
- Secure JWT Authentication protects all user-specific routes.
- Centralized error handling using a custom **ApiError** class and **asyncHandler** keeps controllers clean and maintains consistent API responses.
- Modular folder architecture improves scalability and maintainability.

---

## 🚀 Future Improvements

- 📧 Email Verification
- 🔑 Forgot Password & Password Reset
- 🤖 AI Meal Recommendations
- 📸 Food Image Recognition
- 📷 Barcode Scanner
- 📱 Mobile Application
- 📊 Weekly Nutrition Analytics
- ☁️ Cloud Deployment Optimization
- 🧪 Unit & Integration Testing

---

## 🤝 Contributing

Contributions are welcome!

If you'd like to improve the project, feel free to fork the repository, create a feature branch, and submit a pull request.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgements

This project was independently designed and developed by **Shreyansh Kela** as a full-stack web development project to simplify calorie tracking for users following an Indian diet while strengthening practical skills in Node.js, Express.js, MongoDB, REST APIs, authentication, and backend architecture.
