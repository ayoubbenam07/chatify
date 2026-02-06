import User from "../models/User.js"
import { generateToken } from "../lib/utils.js"
import bcrypt from "bcryptjs"

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
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const login = (req, res) => {
    res.send("login end point");
}

export const logout = (req, res) => {
    res.send("logout end point");
}   