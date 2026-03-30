import { Router } from "express";
import { register, login } from "../controllers/authController";

/**
 * Authentication Routes
 * This router handles all endpoints related to user identity and session management.
 */
const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
