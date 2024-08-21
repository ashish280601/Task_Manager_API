import express from "express";

import userRouter from "./src/features/users/user.router.js";
import taskRouter from "./src/features/tasks/tasks.router.js";

const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json({
  message: "Welcome to task manager application",
  success: true,
  status: 200
})
});

router.use('/user', userRouter);
router.use('/task', taskRouter)

router.use((req, res) => {
  return res.status(404).json({
    message: "API's not found",
    success: false,
    status: 404
  })
})

export default router;
