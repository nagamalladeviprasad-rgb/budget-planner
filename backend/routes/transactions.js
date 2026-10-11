const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Transaction = require("../models/Transaction");
const authMiddleware = require("../authMiddleware");

// Require login for every transaction route
router.use(authMiddleware);

// Add a transaction
router.post("/", async (req, res) => {
    try {
        const { description, amount, type, category, date } = req.body;

        // 1. Fail early if required fields are completely missing in the request body
        if (!description || !amount || !type || !category) {
            return res.status(400).json({
                message: "Missing required fields: description, amount, type, and category are all required."
            });
        }

        const transaction = new Transaction({
            description,
            amount,
            type,
            category,
            date: date || Date.now(), // Fallback if optional date isn't provided
            userId: req.userId // Populated by authMiddleware
        });

        const savedTransaction = await transaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(400).json({
            message: "Error adding transaction",
            error: error.message
        });
    }
});

// Get only the logged-in user's transactions
router.get("/", async (req, res) => {
    try {
        // 2. Added sorting to get the newest transactions first by default
        const transactions = await Transaction.find({ userId: req.userId })
            .sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({
            message: "Error getting transactions",
            error: error.message
        });
    }
});

// Delete only the logged-in user's transaction
router.delete("/:id", async (req, res) => {
    try {
        const transactionId = req.params.id;

        // 3. Prevent Mongoose CastErrors if the ID is not a valid 24-character hex string
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({
                message: "Invalid transaction ID format."
            });
        }

        const deletedTransaction = await Transaction.findOneAndDelete({
            _id: transactionId,
            userId: req.userId
        });

        if (!deletedTransaction) {
            return res.status(404).json({
                message: "Transaction not found or you are not authorized to delete it."
            });
        }

        res.json({
            message: "Transaction deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting transaction",
            error: error.message
        });
    }
});

module.exports = router;
