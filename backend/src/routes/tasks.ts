import express, { Request, Response, RequestHandler } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.use(auth);

const getTasksHandler: RequestHandler = async (req, res) => {
  await getTasks(req, res);
};

const createTaskHandler: RequestHandler = async (req, res) => {
  await createTask(req, res);
};

const updateTaskHandler: RequestHandler = async (req, res) => {
  await updateTask(req, res);
};

const deleteTaskHandler: RequestHandler = async (req, res) => {
  await deleteTask(req, res);
};

router.get("/", getTasksHandler);
router.post("/", createTaskHandler);
router.put("/:id", updateTaskHandler);
router.delete("/:id", deleteTaskHandler);

export default router;
