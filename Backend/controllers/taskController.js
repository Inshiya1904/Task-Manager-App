import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";


// Create a new Task

export const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, completed } = req.body;
        const task = new taskModel({
            title,
            description,
            priority,
            dueDate,
            completed: completed === 'Yes' || completed === true,
            owner: req.user.id
        })
        const savedTask = await task.save()
        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: savedTask

        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// get all task for logged in user

export const getTask = async (req, res) => {
    try {
        const task = await taskModel.find({ owner: req.user.id }).sort({ createdAt: -1 })
        res.json({
            success: true,
            date: task
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// get a single task by id (must belong to that user)

export const fetchSingleTask = async (req, res) => {
    try {
        const task = await taskModel.findOne({ _id: req.params.id, owner: req.user.id })
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }
        res.json({
            success: true,
            data: task
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// update a task

export const updateTask = async (req, res) => {
    try {
        const data = { ...req.body }
        if (!data.completed !== undefined) {
            data.completed = data.completed === 'Yes' || data.completed === true
        }
        const updateTask = await taskModel.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            data,
            { new: true, runValidator: true }
        )
        if (!updateTask) {
            res.status(404).json({
                success: false,
                message: "Task not found or not yours"
            })
        }
        res.json({
            success: true,
            data: updateTask,
            message: "Task Updated Successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// delete task

export const deleteTask = async (req, res) => {
    try {
        const deleted = await taskModel.findOneAndDelete({ _id: req.params.id, owner: req.user.id })
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: "Task not found or not yours"
            })
        }
        res.json({
            success: true,
            message: "Task Deleted Successfully",
            data: deleted
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}