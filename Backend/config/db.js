import mongoose from 'mongoose'
import 'dotenv/config'

export const connectDB = async() => {
    try {
       await mongoose.connect(process.env.MONGODB_URI)
       console.log("Connected to Database")
    } catch (error) {
        console.log(error)
    }
}