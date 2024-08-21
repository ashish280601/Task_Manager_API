import express from "express";

import userRouter from "./src/features/users/user.router.js";

const router = express.Router();

router.use('/user', userRouter)

router.get('/', (req, res) => {
    res.status(200).json({
    message: "Welcome to task manager application",
    status: true,
  })
});

export default router;
