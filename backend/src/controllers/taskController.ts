import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  dueDate: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user!.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate } = taskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        userId: req.user!.userId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = taskSchema.partial().parse(req.body);

    const task = await prisma.task.update({
      where: {
        id,
        userId: req.user!.userId,
      },
      data,
    });

    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to update task" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: {
        id,
        userId: req.user!.userId,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
