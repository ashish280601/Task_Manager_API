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
            res.status(201).json({
                data: {
                    task,
                    message: "Task added successfully",
                    success: true,
                    status: 201
                }
            });
        } catch (error) {
            res.status(500).json({
                data: {
                    task: {},
                    message: error.message,
                    success: false,
                    status: 500
                }
            });
        }
    }

    async updateTask() {
        try {

        } catch (error) {

        }
    }

    async deleteTask() {
        try {

        } catch (error) {

        }
    }
}
