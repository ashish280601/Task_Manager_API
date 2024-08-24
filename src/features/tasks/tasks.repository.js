import TaskModel from "./task.schema.js";

export default class TaskRepository {
    async getTaskData(user, searchTitle, sortBy) {
        // Create query object
        const query = { user };
        console.log("userID", query);
        
        // Add search filter if searchTitle is provided
        if (searchTitle) {
            query.title = { $regex: searchTitle, $options: 'i' }; // Case-insensitive search
        }
    
        // Determine sort order
        let sortOrder = {};
        if (sortBy === 'recent') {
            sortOrder = { createdAt: -1 }; // Sort by recent (descending)
        } else if (sortBy === 'oldest') {
            sortOrder = { createdAt: 1 }; // Sort by oldest (ascending)
        }
    
        try {
            // Fetch tasks from the database
            const tasks = await TaskModel.find(query).sort(sortOrder).exec();
            
            if (!tasks || tasks.length === 0) {
                throw new Error("No tasks found for the given criteria");
            } 
            return tasks;
        } catch (error) {
            throw new Error(
                `Something went wrong while fetching task data from database: ${error.message}`,
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
