import { Category } from "../models/Category.js";

export const getCategories = async (req, res) => {
  const categories = await Category.find({ user: req.user._id }).sort({ name: 1 });
  res.json(categories);
};

export const createCategory = async (req, res) => {
  const { name, type } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const category = await Category.create({
    name,
    type: type || "expense",
    user: req.user._id,
  });

  res.status(201).json(category);
};
