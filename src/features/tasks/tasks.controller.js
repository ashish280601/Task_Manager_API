import TaskRepository from "./tasks.repository.js";


export default class TaskController {
    constructor() {
        this.taskRepository = new TaskRepository();
    }

    async getTasks(req, res) {
        const user = req.userID;
        console.log("user", user)
        try {
            const tasks = await this.taskRepository.getTaskData(user);
            console.log("tasks", tasks)
            if (!tasks) {
                return res.status(404).json({
                    data: {
                        tasks,
                        message: "Data not found",
                        success: false,
                        status: 404
                    }
                });
            }
            return res.status(200).json({
                data: {
                    tasks,
                    message: "Task Data Fetch Successfully",
                    success: true,
                    status: 200
                }
            });
        } catch (error) {
            return res.status(500).json({
                data: {
                    tasks: {},
                    message: "Something went wrongs",
                    success: false,
                    status: 500
                }
            })
        }
    }

    async addTask(req, res) {
        const { title, description, status } = req.body;
        const user = req.userID;
        try {
            const newTaskData = { title, description, status, user }
            console.log("new Task data", newTaskData);

            const task = await this.taskRepository.addTaskData(newTaskData);
            console.log("taskData", task);

            if (!task) {
                return res.status(404).json({
                    data: {
                        task,
                        message: "Failed To Add Data",
                        success: false,
                        status: 404
                    }
                });
            }
            return res.status(201).json({
                data: {
                    task,
                    message: "Task added successfully",
                    success: true,
                    status: 201
                }
            });
        } catch (error) {
            return res.status(500).json({
                data: {
                    task: {},
                    message: error.message,
                    success: false,
                    status: 500
                }
            });
        }
    }

    async updateTask(req, res) {
        const { title, description, status } = req.body;
        const { id } = req.params;

        try {
            const updateData = { title, description, status };
            const updatedTask = await this.taskRepository.updateTaskData(id, updateData);

            if (!updatedTask) {
                return res.status(404).json({
                    data: {
                        task: {},
                        message: "Task not found",
                        success: false,
                        status: 404
                    }
                });
            }

            res.json({
                data: {
                    task: updatedTask,
                    message: "Task updated successfully",
                    success: true,
                    status: 200
                }
            });
        } catch (error) {
            res.status(500).json({
                data: {
                    data: {},
                    message: error.message,
                    success: false,
                    status: 500
                }
            });
        }
    }

    async deleteTask(req, res) {
        const { id } = req.params;

        try {
            const deleteTask = await this.taskRepository.deleteTask(id);

            if (!deleteTask) {
                return res.status(404).json({
                    data: {
                        task: {},
                        message: "Task not found",
                        success: false,
                        status: 404
                    }
                });
            }

            res.json({
                data: {
                    task: deleteTask,
                    message: "Task deleted successfully",
                    success: true,
                    status: 200
                }
            });
        } catch (error) {
            res.status(500).json({
                data: {
                    data: {},
                    message: error.message,
                    success: false,
                    status: 500
                }
            });
        }
    }
}

