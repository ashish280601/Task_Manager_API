import TaskModel from "./task.schema.js";

export default class TaskRepository {
    async getTaskData(user) {
        try {
            const allTask = await TaskModel.find({ user });
            if (!allTask) {
                throw new Error("Data not found")
            }
            return allTask
        } catch (error) {
            throw new Error(
                "Something went wrong while fetching task data from database",
                500
            );
        }
    }

    async addTaskData(newTaskData) {
        console.log(newTaskData);
        try {
            const newTask = new TaskModel(newTaskData);
            console.log("new Task model", newTask);

            const addTask = await newTask.save();
            if (!addTask) {
                throw new Error("Please check the data format", 400)
            }
            return addTask;
        } catch (error) {
            throw new Error(
                "Something went wrong while adding task to database",
                500
            );
        }
    }

    async updateTaskData(taskId, updateData) {
        try {
            const updatedTask = await TaskModel.findByIdAndUpdate(taskId, updateData, { new: true });
            if (!updatedTask) {
                throw new Error("Task not found or failed to update");
            }
            return updatedTask;
        } catch (error) {
            console.error("Error occurred while updating task:", error);
            throw new Error(error.message);
        }
    }

    async deleteTask(id) {
        try {
            const deleteTask = await TaskModel.findByIdAndDelete(id);
            if (!deleteTask) {
                throw new Error("Task not found or failed to delete");
            }
            return deleteTask;
        } catch (error) {
            console.error("Error occurred while deleting task:", error);
            throw new Error(error.message);
        }
    }
}
