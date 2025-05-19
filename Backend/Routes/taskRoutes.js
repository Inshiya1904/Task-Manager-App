import express from 'express'
import { createTask, deleteTask, fetchSingleTask, getTask, updateTask } from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/auth.js';


const taskRouter = express.Router();

taskRouter.post('/create-task',authMiddleware,createTask)
taskRouter.get('/get-task',authMiddleware,getTask)
taskRouter.get('/get-task/:id',authMiddleware,fetchSingleTask)
taskRouter.put('/update-task/:id',authMiddleware,updateTask)
taskRouter.delete('/delete-task/:id',authMiddleware,deleteTask)


export default taskRouter