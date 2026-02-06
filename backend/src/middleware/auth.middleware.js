import jwt from "jsonwebtoken"
import User from "../models/User.js"
import dotenv from "dotenv"

dotenv.config()

export const protectRoute = async (req, res, next) => {
    const jwt_secret = process.env.JWT_SECRET
    if(!jwt_secret) 
        return res.status(500).json({message: "JWT_SECRET is not defined"})
    try {
        const token = req.cookies.jwt
        if(!token)
            return res.status(401).json({message: "Unauthorized - no token provided"})
        const decoded = jwt.verify(token, jwt_secret)
        if(!decoded)
            return res.status(401).json({message: "Unauthorized - invaild token"})
        const user = await User.findById(decoded.id).select("-password")
        if(!user)
            return res.status(401).json({message: "user not found"})

        req.user = user

        next()
    } catch (error) {
        console.error("error in protectRoute middleware", error)
        return res.status(500).json({message: "Internal server error"})
    }
}