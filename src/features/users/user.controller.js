import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

import UserRepository from "./user.repository.js";
import emailServiceSignUp, {
    OPTVerifyEmail,
} from "../../services/emailService.js";
import { uploadFileToS3 } from "../../utils/s3Uploader.js";
import multer from "multer";

const upload = multer();

export default class UserController {
    constructor() {
        this.userRepository = new UserRepository();
    }

    //validation and sanitization middleware to check the request of body 
    validateSignUp() {
        return [
            body('fName')
                .isLength({ min: 2, max: 50 })
                .withMessage('First name must be between 2 and 50 characters')
                .trim()
                .escape(),
            body('lName')
                .isLength({ min: 2, max: 50 })
                .withMessage('Last name must be between 2 and 50 characters')
                .trim()
                .escape(),
            body('email')
                .isEmail()
                .withMessage('A valid email is required')
                .normalizeEmail(),
            body('password')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters long'),
            body('image')
                .custom((value, { req }) => {
                    if (!req.file) {
                        throw new Error('Image file is required');
                    }

                    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
                    if (!validMimeTypes.includes(req.file.mimetype)) {
                        throw new Error('Invalid image format. Only JPEG, PNG, and GIF are allowed.');
                    }

                    if (req.file.size > 5 * 1024 * 1024) { // 5 MB limit
                        throw new Error('Image file is too large. Maximum allowed size is 5MB.');
                    }
                    return true;
                })
        ];
    }

    // Manual Authentication Function  
    async signUp(req, res) {

        // Validate inputs
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Validation error",
                success: false,
                status: 400
            });
        }

        try {

            const { fName, lName, email, password } = req.body;
            const fullName = `${fName} ${lName}`;
            const saltRound = 10;
            const hashedPassword = await bcrypt.hash(password, saltRound);
            console.log("hashedPassword", hashedPassword);

            let profilePhotoUrl = null;
            if (req.file) {
                profilePhotoUrl = await uploadFileToS3(req.file);
            }

            const userData = {
                fullName,
                email,
                password: hashedPassword,
                image: profilePhotoUrl
            };
            console.log("userData", userData);
            const newUser = await this.userRepository.signUp(userData);
            console.log("newUser", newUser);
            await emailServiceSignUp(newUser.email, newUser.fullName);
            return res.status(200).json({
                newUser,
                message: "User created successfully",
                success: true,
                status: 200
            });
        } catch (error) {
            // console.log("Error in signUp", error);
            return res.status(500).json({
                message: "Something went wrongs",
                success: false,
                status: 500,
            });
        }
    }

    async signIn(req, res) {
        // write your code here
        console.log(req.body);
        try {
            const { email, password } = req.body;

            if (req.recaptcha.error) {
                return res.status(400).json({
                    message: "reCAPTCHA verification failed. Please try again.",
                    status: false,
                });
            }

            // finding the email user is present or not
            const user = await this.userRepository.findByEmail(email);
            console.log("userData", user);
            
            // if email user is not found send error
            if (!user) {
                return res.status(401).json({
                    message: "Invalid user email credentials",
                    success: false,
                    status: 401,
                });
            } else {
                // compare the passowrd
                const result = await bcrypt.compare(password, user.password);
                // password matches then generate a token
                if (result) {
                    console.log("userName", user.fullName)
                    const token = jwt.sign(
                        {
                            userID: user._id,
                            email: user.email,
                            name: user.fullName,
                        },
                        process.env.SECRET_KEY,
                        {
                            expiresIn: "1hr",
                        }
                    );
                    return res.status(200).json({
                        data: {
                            message: "User Login Successful",
                            success: true,
                            status: 200,
                            userID: user._id,
                            email: user.email,
                            name: user.name,
                            userImg: user.image,
                            token,
                        }
                    });
                }
                return res.status(401).json({
                    message: "Invalid user password credentials",
                    success: false,
                    status: 401,
                });
            }
        } catch (error) {
            console.log("Error in signIn", error);
            return res.status(500).json({
                message: "Something went wrongs",
                success: false,
                status: 500,
            });
        }
    }

    async requestResetPassword(req, res) {
        console.log(req.body);
        try {
            const userID = req.userID;

            // generate otp
            const otp = Math.floor(100000 + Math.random() * 900000);

            const resetPasswordRequest =
                await this.userRepository.requestResetPassword(userID, otp.toString());
            // console.log("resetPasswordRequest", resetPasswordRequest);
            await OPTVerifyEmail(resetPasswordRequest.email, otp.toString());
            return res.status(200).json({
                message: "OTP send successfully",
                success: true,
                status: 200,
            });
        } catch (error) {
            // console.log("Error while generating request reset password", error);
            return res.status(500).json({
                message: "Something went wrongs",
                success: false,
                status: 500,
            });
        }
    }

    async VerifyOTP(req, res, next) {
        try {
            const { otp } = req.body;
            const userID = req.userID;

            const isValid = await this.userRepository.verifyOTP(userID);
            if (otp !== isValid.otp) {
                return res.status(400).json({
                    message: "OTP is not valid",
                    success: false,
                    status: 400,
                });
            } else {
                return res.status(200).json({
                    message: "OTP verified successfully",
                    success: true,
                    status: 200,
                });
            }
        } catch (error) {
            // console.log("Error while reset password", error);
            return res.status(500).json({
                message: "Something went wrong",
                success: false,
                status: 500,
            });
        }
    }

    async resetPassword(req, res) {
        try {
            // console.log(req.body);
            const { newPassword } = req.body;
            const userID = req.userID;

            // checking if newUpdate password is provided or not
            if (!newPassword) {
                return res.status(400).json({
                    message: "New Password is required",
                    status: false,
                });
            }
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            const updateUserPassword = await this.userRepository.resetPassword(
                userID,
                hashedNewPassword
            );
            return res.status(200).json({
                updateUserPassword,
                message: "Password updated successfully",
                success: true,
                status: 200,
            });
        } catch (error) {
            // console.log("Error while reset password", error);
            return res.status(500).json({
                message: "Something went wrong",
                success: false,
                status: 500,
            });
        }
    }
}
