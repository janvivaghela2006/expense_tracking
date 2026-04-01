import crypto from "crypto";
import { User } from "../models/User.js";
import { Category } from "../models/Category.js";
import { PasswordResetToken } from "../models/PasswordResetToken.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { DEFAULT_CATEGORIES } from "../seed/defaultCategories.js";

const formatAuthResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  token: generateToken(user._id),
});

const createDefaultCategories = async (userId) => {
  await Category.insertMany(
    DEFAULT_CATEGORIES.map((category) => ({
      ...category,
      user: userId,
      isDefault: true,
    }))
  );
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!name || !normalizedEmail || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email: normalizedEmail, password });

  try {
    await createDefaultCategories(user._id);
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }

  res.status(201).json(formatAuthResponse(user));
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("This account is disabled");
  }

  res.json(formatAuthResponse(user));
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "If the email exists, a reset link has been sent" });
  }

  await PasswordResetToken.deleteMany({ user: user._id });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  await PasswordResetToken.create({
    user: user._id,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
  const text = `Reset your password using this link: ${resetUrl}`;
  const isEmailConfigured =
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  await sendEmail({
    to: user.email,
    subject: "Reset your expense tracker password",
    text,
    html: `<p>Reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  res.json({
    message: "If the email exists, a reset link has been sent",
    resetUrl: isEmailConfigured ? undefined : resetUrl,
  });
};

export const resetPassword = async (req, res) => {
  const rawToken = req.params.token;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const resetRecord = await PasswordResetToken.findOne({
    token: hashedToken,
    expiresAt: { $gt: new Date() },
  });

  if (!resetRecord) {
    res.status(400);
    throw new Error("Reset token is invalid or expired");
  }

  const user = await User.findById(resetRecord.user);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.password = password;
  await user.save();
  await PasswordResetToken.deleteMany({ user: user._id });

  res.json({ message: "Password reset successful" });
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};
