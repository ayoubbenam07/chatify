import User from "../models/User.js"
import { generateToken } from "../lib/utils.js"
import bcrypt from "bcryptjs"
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import dotenv from "dotenv"
import claudinary from "../lib/cloudinary.js"

dotenv.config()

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password)
            return res.status(400).json({ message: "All fields are required" })
        if (password.length < 6)
            return res.status(400).json({ message: "password must be at least 6 charchters" })
        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailReg.test(email))
            return res.status(400).json({ message: "Invalid email address" })
        const user = await User.findOne({ email })
        if (user)
            return res.status(400).json({ message: "User already exists" })
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })
        if (newUser) {
            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, process.env.CLIENT_URL);
            } catch (error) {
                console.error("Failed to send welcome email:", error);
            }
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.error("error in signup controller")
        res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        generateToken(user._id, res);

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.error("error in login controller")
        res.status(500).json({ message: error.message })
    }

}

export const logout = async (_, res) => {
    res.cookie("jwt", "", {maxAge:0})
    res.status(200).json({message: "logout successfully"})
}   

export const update_profile = async (req, res) => {
    const {profilePic} = req.body
    if(!profilePic)
        return res.status(400).json({message: "Profile picture is required"})
    try {
        const userId = req.user._id
        const response = await claudinary.uploader.upload(profilePic, {resource_type: "image"})  
        const updateduser = await User.findByIdAndUpdate(userId, {profilePic: response.url}, {new: true}) 
        res.status(201).json({
                _id: updateduser._id,
                fullName: updateduser.fullName,
                email: updateduser.email,
                profilePic: updateduser.profilePic,
            });
    } catch (error) {
        console.error("error in update profile controller", error)
        res.status(500).json({message: "Internal server error"})
    }
}