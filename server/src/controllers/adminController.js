import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";

export const getAdminStats = async (req, res) => {
  const [userCount, activeUserCount, transactionCount, totals, usersByRole, monthlyUsers] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Transaction.countDocuments(),
    Transaction.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]),
    User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]),
    User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
  ]);

  const totalIncome = totals.find((item) => item._id === "income")?.total || 0;
  const totalExpense = totals.find((item) => item._id === "expense")?.total || 0;

  res.json({
    userCount,
    activeUserCount,
    transactionCount,
    totalIncome,
    totalExpense,
    platformBalance: totalIncome - totalExpense,
    roleDistribution: usersByRole.map((item) => ({
      name: item._id,
      value: item.count,
    })),
    monthlyUsers: monthlyUsers.map((item) => ({
      label: `${item._id.month}/${item._id.year}`,
      users: item.count,
    })),
  });
};

export const getUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { role, isActive } = req.body;

  user.role = role ?? user.role;
  user.isActive = isActive ?? user.isActive;

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  });
};
