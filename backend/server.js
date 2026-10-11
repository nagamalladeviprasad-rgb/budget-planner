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


// Transaction routes
app.use("/api/transactions", transactionRoutes);


// Savings Goals routes
app.use("/api/savings-goals", savingsGoalRoutes);


// Authentication routes
app.use("/api/auth", authRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {

        console.log("MongoDB Connected Successfully");

        app.listen(process.env.PORT, () => {
            console.log(
                `Server running on http://localhost:${process.env.PORT}`
            );
        });

    })
    .catch((error) => {

        console.log("MongoDB Connection Error:");
        console.log(error);

    });