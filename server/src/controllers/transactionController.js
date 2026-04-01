import mongoose from "mongoose";
import { Category } from "../models/Category.js";
import { Transaction } from "../models/Transaction.js";

export const getTransactions = async (req, res) => {
  const filter = { user: req.user._id };

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (req.query.category) {
    filter.categoryLabel = req.query.category;
  }

  const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
  res.json(transactions);
};

export const createTransaction = async (req, res) => {
  const { title, amount, type, categoryId, categoryName, notes, date } = req.body;

  if (!title || !amount || !type) {
    res.status(400);
    throw new Error("Title, amount and type are required");
  }

  let category = null;
  let categoryLabel = categoryName || "Other";

  if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
    category = await Category.findOne({ _id: categoryId, user: req.user._id });
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    categoryLabel = category.name;
  } else if (categoryName) {
    const existingCategory = await Category.findOne({
      name: categoryName,
      user: req.user._id,
    });

    if (existingCategory) {
      category = existingCategory;
      categoryLabel = existingCategory.name;
    }
  }

  const transaction = await Transaction.create({
    title,
    amount: Number(amount),
    type,
    category: category?._id || null,
    categoryLabel,
    notes,
    date: date || new Date(),
    user: req.user._id,
  });

  res.status(201).json(transaction);
};

export const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  await transaction.deleteOne();

  res.json({ message: "Transaction deleted successfully" });
};

export const getDashboardSummary = async (req, res) => {
  const userId = req.user._id;

  const transactions = await Transaction.find({ user: userId }).sort({ date: -1, createdAt: -1 });

  const totals = transactions.reduce(
    (acc, item) => {
      if (item.type === "income") {
        acc.income += item.amount;
      } else {
        acc.expense += item.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const monthlyData = await Transaction.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const categoryBreakdown = await Transaction.aggregate([
    { $match: { user: userId, type: "expense" } },
    {
      $group: {
        _id: "$categoryLabel",
        total: { $sum: "$amount" },
      },
    },
    { $sort: { total: -1 } },
  ]);

  res.json({
    totals: {
      totalIncome: totals.income,
      totalExpense: totals.expense,
      balance: totals.income - totals.expense,
    },
    recentTransactions: transactions.slice(0, 8),
    allTransactions: transactions,
    monthlyData: monthlyData.map((item) => ({
      label: `${item._id.month}/${item._id.year}`,
      type: item._id.type,
      total: item.total,
    })),
    categoryBreakdown: categoryBreakdown.map((item) => ({
      name: item._id || "Other",
      value: item.total,
    })),
  });
};
