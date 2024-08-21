import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['Todo', 'In Progress', 'Done'],
        default: 'Todo',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


const TaskModel = mongoose.model("Tasks", taskSchema)

export default TaskModel;