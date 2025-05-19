import express from 'express'
import { connectDB } from './config/db.js';
const app = express()
import cors from 'cors'
import 'dotenv/config'
import userRouter from './Routes/userRoutes.js';
import taskRouter from './Routes/taskRoutes.js';

// middleware
app.use(cors())
app.use(express.json())

// connect DB
connectDB();

// api endpoints
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);



app.get('/',(req,res) => {
    res.send("Hello Backend")
})

app.listen(process.env.PORT, () => {
  console.log(`✅ Server is running on port ${process.env.PORT}`);
});