import userModel from "../models/userModel.js";
import validator from 'validator'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

// register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //Field validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All feilds are required!"
            })
        }
        // Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            })
        }
        // Password validation
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be atleast 8 Characters"
            })
        }
        // check if user already exist

        const user = await userModel.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }

        // encrypt the password
        const hashedPassword = await bcryptjs.hash(password, 10)

        // create new user
        const newUser = await userModel.create({
            name, email, password: hashedPassword
        })
        // Generate jwt Token (payload// secret key// token expiry) 
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        console.log("Token", token)
        //  Send response
        res.status(201).json({
            sucess: true,
            message: "User Registered Successfully",
            token: token,
            data: newUser
        })
        console.log("User", newUser)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            sucess: false,
            message: "Server Error",

        })
    }

}

// login user
export const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required!"
            })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }
        const match = await bcryptjs.compare(password, user.password)
        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            sucess: true,
            message: "User Loggedin Successfully",
            token: token,
            data: user
        })
        console.log("User", user)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            sucess: false,
            message: "Server Error",

        })
    }
}

// fetch logged in user detail
export const getCurrentUser = async (req, res) => {
    try {
        console.log(req.user.id)
        const user = await userModel.findById(req.user.id).select("name email")
        if (!user) {
            return res.status(400).json({
                sucess: false,
                message: "User not found"
            })
        }
        res.status(201).json({
            success: true,
            data: user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            sucess: false,
            message: "Server Error",

        })
    }
}

// Update user
export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email || !validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "valid name and email required"
            })
        }
        const userExists = await userModel.findOne({ email, _id: { $ne: req.user.id } })

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Email is already taken"
            });

        }
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true, select: "name email" }
        )
        res.status(201).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            sucess: false,
            message: "Server Error",

        })
    }
}

// change password function

export const updatePassword = async (req,res) => {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword || newPassword.length < 8) {
        return res.status(400).json({
            success: false,
            message: "password invalid or too short"
        })
    }
    try {
        const user = await userModel.findById(req.user.id).select("password")
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
                
            })
        }
        const match = await bcryptjs.compare(currentPassword, user.password)
        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Current password incorrect"
            })
        }
        user.password = await bcryptjs.hash(newPassword, 10)
        await user.save();
        res.status(201).json({
            sucess: true,
            message: "Password has been changed",
            data: user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            sucess: false,
            message: "Server Error",

        })
    }

}

