import express from "express";
import TaskController from "./tasks.controller.js";
import jwtAuth from "../../middleware/jwt.middleware.js";


const taskRouter = express.Router();
const taskController = new TaskController();

taskRouter.get('/all-data', jwtAuth, (req, res) => {
    taskController.getTasks(req, res);
})

taskRouter.post('/add', jwtAuth, (req, res) => {
    taskController.addTask(req,res);
})

taskRouter.put('/update/:id', jwtAuth, (req, res) => {
    taskController.updateTask(req, res);
})

taskRouter.delete('/delete/:id', jwtAuth, (req, res) => {
    taskController.deleteTask(req, res);
})

export default taskRouter;
