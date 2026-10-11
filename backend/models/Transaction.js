const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true // 1. Added database index for performance
    },
    description: {
      type: String,
      required: true,
      trim: true // 2. Prevents leading/trailing whitespaces
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than 0"] // 3. Prevents negative or zero values
    },
    type: {
      type: String,
      enum: {
        values: ["income", "expense"],
        message: "{VALUE} is not a valid transaction type" // 4. Custom validation error message
      },
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now,
      index: true // 5. Added index for date-range queries (e.g., monthly reports)
    }
  },
  {
    timestamps: true // 6. Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
