import express from "express";
import { getAdminStats, getUsers, updateUser } from "../controllers/adminController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);
router.get("/stats", asyncHandler(getAdminStats));
router.get("/users", asyncHandler(getUsers));
router.put("/users/:id", asyncHandler(updateUser));

export default router;
