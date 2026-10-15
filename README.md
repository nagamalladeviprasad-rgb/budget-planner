# 💰 Budget Planner

A full-stack web application that helps users manage their income and expenses, track savings goals, and understand their spending habits.

## ✨ Features

- 🔐 **User Authentication** – Register and log in to your account.
- 💵 **Transaction Management** – Add, view, and delete income and expense transactions.
- 📊 **Financial Dashboard** – View total income, expenses, and balance.
- 🎯 **Savings Goals** – Create savings goals and track your progress.
- 📈 **Interactive Charts** – Visualize spending categories and monthly income versus expenses.
- 📅 **Monthly Reports** – Review monthly financial summaries.
- ⚠️ **Overspending Alerts** – Get alerts when spending exceeds the configured limit.
- 🗄️ **Database Storage** – Store financial data using MongoDB.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| CSS | Styling and responsive design |
| Node.js | JavaScript runtime |
| Express.js | Backend API |
| MongoDB | Database |
| Mongoose | Database connection and models |
| JWT | Authentication |
| Recharts | Charts and visualizations |

## 📸 Screenshots

Add screenshots of your application here after capturing them from your browser.

### Login Page
![Budget Planner Login](screenshots/login.png)

### Dashboard
![Budget Planner Dashboard](screenshots/dashboard.png)

### Savings Goals
![Budget Planner Savings Goals](screenshots/savings-goals.png)

### Reports
![Budget Planner Reports](screenshots/reports.png)

> **Note:** Create a `screenshots` folder in the project root and save your actual screenshots using the filenames shown above. Until you add these images, the screenshot links will not display.

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a MongoDB Atlas database
- [Git](https://git-scm.com/)
- Visual Studio Code (recommended)

### 1. Clone the repository

```bash
git clone https://github.com/nagamalladeviprasad-rgb/budget-planner.git
cd budget-planner
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=mongodb://localhost:27017/budgetplanner
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
```

For MongoDB Atlas, replace the local MongoDB URI with your Atlas connection string.

**Important:** Never upload your `.env` file or database credentials to GitHub.

### 3. Start the backend

From the `backend` folder, run:

```bash
node server.js
```

The backend should run at:

```text
http://localhost:5000
```

### 4. Set up the React frontend

Open a second terminal in the project root and run:

```bash
cd frontend-react
npm install
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

Keep both terminals running while using the application locally.

## 📂 Project Structure

```text
budget-planner/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend-react/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── login.jsx
│   │   ├── Register.jsx
│   │   ├── SavingsGoals.jsx
│   │   └── Reports.jsx
│   ├── package.json
│   └── index.html
├── frontend/
├── .gitignore
├── package.json
└── README.md
```

*Folder and file names may vary depending on the latest version of the project.*

## 🚀 Future Improvements

- Export financial reports to PDF or Excel.
- Add budget limits for individual spending categories.
- Improve mobile responsiveness.
- Add recurring transactions.
- Deploy the application online.

## 🎓 Project Information

**Project Name:** Budget Planner  
**Project Type:** Full-Stack Web Development  
**Purpose:** To help users organize their finances, monitor expenses, and work toward savings goals.

## 👨‍💻 Author

**Devi Prasad N.**

GitHub: [nagamalladeviprasad-rgb](https://github.com/nagamalladeviprasad-rgb)

---

If you find this project useful, consider giving the repository a ⭐ on GitHub.
