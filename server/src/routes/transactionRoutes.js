import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getDashboardSummary,
  getTransactions,
} from "../controllers/transactionController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/summary/dashboard", asyncHandler(getDashboardSummary));
router.route("/").get(asyncHandler(getTransactions)).post(asyncHandler(createTransaction));
router.delete("/:id", asyncHandler(deleteTransaction));

export default router;
