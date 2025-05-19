import  mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        Required: true
    },
    email:{
        type: String,
        Required: true
    },
    password:{
        type: String,
        Required: true
    },

},{timestamps:true})

const userModel = mongoose.models.user || mongoose.model("user",userSchema);

export default userModel;