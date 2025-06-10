import express, { RequestHandler } from "express";
import { register, login } from "../controllers/authController";

const router = express.Router();

const registerUser: RequestHandler = async (req, res) => {
  await register(req, res);
};

const loginUser: RequestHandler = async (req, res) => {
  await login(req, res);
};

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
