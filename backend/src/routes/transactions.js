const express = require("express");
const transactionRouter = express.Router();
const Transaction = require("../models/transaction");
const { validateTransactionData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");

transactionRouter.get("/transactions", userAuth, async (req, res) => {
    try {
      const filter = { userId: req.user._id };
      const transactions = await Transaction.find(filter).sort({ date: -1 });
      res.json({ message: "Transactions fetched", data: transactions });
    } 
    catch (err) {
      res.status(500).json({ message: "Error fetching transactions", error: err.message });
    }
});

transactionRouter.post("/transactions/add", userAuth, async (req, res) => {
    try {
      validateTransactionData(req.body);
      const transaction = new Transaction({
        ...req.body,
        userId: req.user._id
      });

      const savedTransaction = await transaction.save();
      res.status(201).json({ message: "Transaction added", data: savedTransaction });
    }
    catch (err) {
      res.status(400).json({ message: "Error adding transaction", error: err.message });
    }
});

transactionRouter.get("/transactions/:type", userAuth, async (req, res) => {
    try {
      const { type } = req.params;
      const isAllowed = ['income', 'expense'].includes(type);
      if (!isAllowed) {
        return res.status(400).json({ message: "Invalid transaction type" });
      }
      const filter = { userId: req.user._id };
      if (type) {
        filter.type = type;
      }
      const transactions = await Transaction.find(filter).sort({ date: -1 });
      res.json({ message: "Transactions fetched", data: transactions });
    } 
    catch (err) {
      res.status(500).json({ message: "Error fetching transactions", error: err.message });
    }
});

transactionRouter.put("/transactions/update/:id", userAuth, async (req, res) => {
    try {
      validateTransactionData(req.body);
      const updated = await Transaction.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      res.json({ message: "Transaction updated", data: updated });
    } 
    catch (err) {
      res.status(500).json({ message: "Error updating transaction", error: err.message });
    }
});

transactionRouter.delete("/transactions/delete/:id", userAuth, async (req, res) => {
    try {
      const deleted = await Transaction.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!deleted) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      res.json({ message: "Transaction deleted", data: deleted });
    } 
    catch (err) {
      res.status(500).json({ message: "Error deleting transaction", error: err.message });
    }
});

transactionRouter.get("/transactions/filter/:fromDate/:toDate", userAuth, async (req, res) => {
    const { fromDate, toDate } = req.params;

    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "From and to dates are required" });
    }

    try {
      const transactions = await Transaction.find({
        userId: req.user._id,
        date: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      }).sort({ date: -1 });

      res.json({ message: "Transactions fetched", data: transactions });
    } 
    catch (err) {
      res.status(500).json({ message: "Error filtering transactions", error: err.message });
    }
});

transactionRouter.get("/transactions/filter/:category", userAuth, async (req, res) => {
    const {category} = req.params;
    const valid = [
      'salary', 'business', 'investments', 'food', 'rent', 'transport',
      'entertainment', 'utilities', 'healthcare', 'education', 'other'];

    if (!valid.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    try{
      const transactions = await Transaction.find({
        userId: req.user._id,
        category: category
      }).sort({date: -1});

      res.json({ message: "Transactions fetched", data: transactions });
    }
    catch (err) {
      res.status(500).json({ message: "Error fetching transactions by category", error: err.message });
    }
});

module.exports = transactionRouter;