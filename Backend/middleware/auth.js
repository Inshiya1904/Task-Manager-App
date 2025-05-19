import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';

export const authMiddleware = async(req,res,next) => {
   try {
        // grab bearer token from authorization header

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer '))
            {
                return res.status(401).json({
                    success: false,
                    message: "Not Authorized, Token Missing"
                })
            } 
        
            const token = authHeader.split(' ')[1];
            console.log("Token",token)
        // verify and attach user object
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        console.log("PayLoad",payload)
        const user = await userModel.findById(payload.id).select("password")
        if(!user)
        {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }
        req.user = user
        console.log("Req.user",req.user)
        console.log("User",user)
        next();
    } catch (error) {
        console.log("JWT verification failed",err)
        return res.status(401).json({
            message:"Token invalid or expired",
            success:false
        });
    }
}