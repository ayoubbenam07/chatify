import express from "express"
import dotenv from "dotenv"
import path from "path" 
import cookieParser from "cookie-parser"
import {connectDB} from "./lib/db.js"
import authRoutes from "./routes/auth.route.js"
import messagesRoutes from "./routes/messages.route.js"

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/messages", messagesRoutes)

if(process.env.NODE_ENV==="production")
{
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
    app.get("*path", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    })
}

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});