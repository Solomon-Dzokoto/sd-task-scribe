import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const prisma = new PrismaClient();

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response) => {
  try {
    console.log("Register request body:", req.body);
    const { email, password, name } = userSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    console.log("Existing user check:", existingUser);

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Attempting to create user...");
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    console.log("User created successfully:", user.id);

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res
      .status(500)
      .json({
        error: "Server error",
        details: error instanceof Error ? error.message : String(error),
      });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log("Login request body:", req.body);
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Server error" });
  }
};
