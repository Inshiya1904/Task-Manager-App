import  mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        Required: true
    },
    description:{
        type: String,
        default: ""
    },
    priority:{
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    dueDate:{
        type: Date
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user",
        required: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type:Date,
        default: Date.now
    }

},{timestamps:true})

const taskModel = mongoose.models.task || mongoose.model("task",taskSchema);

export default taskModel;