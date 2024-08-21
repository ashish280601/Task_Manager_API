import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
    message: "Welcome to task manager application",
    status: true,
  })
});

export default router;
