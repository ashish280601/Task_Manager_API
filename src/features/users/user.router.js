import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middleware/jwt.middleware.js";
import recaptcha from "../../services/recaptcha.js";
import multer from "multer";

const userRouter = express.Router();
const userController = new UserController();
const upload = multer();


// Manual Authentication
userRouter.post('/signup', upload.single('image'), recaptcha.middleware.verify, userController.validateSignUp(), (req, res) => {
    userController.signUp(req, res);
});
// recaptcha.middleware.verify
userRouter.post('/login', (req, res) => {
    userController.signIn(req, res);
});


userRouter.post('/request-reset-password', recaptcha.middleware.verify, jwtAuth, (req, res) => {
    userController.requestResetPassword(req, res);
});

userRouter.post('/verify-otp', jwtAuth, (req, res, next) => {
    userController.VerifyOTP(req, res, next),
        (req, res) => userController.resetPassword(req, res);
});

userRouter.post('/resetPassword', jwtAuth, (req, res) => {
    userController.resetPassword(req, res);
});

export default userRouter;
