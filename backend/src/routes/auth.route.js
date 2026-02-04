import express from "express"

const router = express.Router();

router.get("/signup", (req, res) => {
    res.send("signup end point");
})

router.get("/login", (req, res) => {
    res.send("login end point");
})

router.get("/logout", (req, res) => {
    res.send("logout end point");
})

export default router;