const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // Added to validate ObjectIds
const SavingsGoal = require("../models/SavingsGoal");
const authMiddleware = require("../authMiddleware");

// Require login for all savings-goal routes
router.use(authMiddleware);

// 1. Add a savings goal
router.post("/", async (req, res) => {
  const { name, targetAmount, savedAmount } = req.body;

  // Basic Input Validation
  if (!name || targetAmount === undefined || targetAmount === null) {
    return res.status(400).json({ message: "Name and target amount are required fields." });
  }

  if (targetAmount < 0 || (savedAmount && savedAmount < 0)) {
    return res.status(400).json({ message: "Amounts cannot be negative numbers." });
  }

  try {
    const goal = new SavingsGoal({
      name,
      targetAmount,
      savedAmount: savedAmount ?? 0,
      userId: req.userId // Assumes authMiddleware sets req.userId
    });

    const savedGoal = await goal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(500).json({ message: "Error adding savings goal", error: error.message });
  }
});

// 2. Get only the logged-in user's savings goals
router.get("/", async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.userId });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: "Error getting savings goals", error: error.message });
  }
});

// 3. Update a savings goal (Added Feature)
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid savings goal ID format" });
  }

  try {
    const updatedGoal = await SavingsGoal.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $set: req.body },
      { new: true, runValidators: true } // Return updated doc & run schema validations
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: "Savings goal not found or unauthorized" });
    }

    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: "Error updating savings goal", error: error.message });
  }
});

// 4. Delete only the logged-in user's savings goal
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // Check if ID is a valid MongoDB ObjectId to prevent cast crashes
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid savings goal ID format" });
  }

  try {
    const deletedGoal = await SavingsGoal.findOneAndDelete({ _id: id, userId: req.userId });
    
    if (!deletedGoal) {
      return res.status(404).json({ message: "Savings goal not found or unauthorized" });
    }

    res.json({ message: "Savings goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting savings goal", error: error.message });
  }
});

module.exports = router;
