import express from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(asyncHandler(getCategories)).post(asyncHandler(createCategory));

export default router;
