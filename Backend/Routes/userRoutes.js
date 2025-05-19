import express from 'express'
import { getCurrentUser, LoginUser, registerUser, updatePassword, updateProfile } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const userRouter = express.Router();

//public links
userRouter.post('/signup',registerUser)
userRouter.post('/login',LoginUser)

// private links protect also
userRouter.get('/me',authMiddleware,getCurrentUser)
userRouter.put('/profile',authMiddleware,updateProfile)
userRouter.put('/password',authMiddleware,updatePassword)


export default userRouter