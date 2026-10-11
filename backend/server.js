const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const transactionRoutes = require("./routes/transactions");
const savingsGoalRoutes = require("./routes/savingsGoals");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());


// Home route
app.get("/", (req, res) => {
    res.send("Budget Planner Backend is Running");
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});


// Transaction routes
app.use("/api/transactions", transactionRoutes);


// Savings Goals routes
app.use("/api/savings-goals", savingsGoalRoutes);


// Authentication routes
app.use("/api/auth", authRoutes);


async function startServer() {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is required to start the server.");
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is required to start the server.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");

    const port = Number(process.env.PORT) || 5000;
    app.listen(port, "0.0.0.0", () => {
        console.log(`Server running on port ${port}`);
    });
}

startServer().catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
});