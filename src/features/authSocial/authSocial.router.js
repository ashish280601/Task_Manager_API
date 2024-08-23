// built-in library
import express from "express";

// custom import
import { googlePassportConfig } from "../../middleware/authGoogle.middleware.js";
import SocialController from "./authSocial.controller.js";

const authRouter = express.Router();
const socialController = new SocialController();

// Social Authentication 

authRouter.get(
    "/google",
    googlePassportConfig.authenticate("google", { scope: ["profile", "email"] })
  );
  
  
  authRouter.get(
    "/google/callback",
    googlePassportConfig.authenticate("google", { failureRedirect: "https://node-js-authentication-git-it.onrender.com/login" }),
    (req, res) => {
        socialController.googleLogin(req, res);
    }
  );

  authRouter.get("/google/logout", 
    (req, res) => {
    // Call logout function with a callback
    req.logout((err) => { // Provide a callback function
      if (err) {
        console.error("Error logging out:", err);
        return res.status(500).json({ message: "Error logging out" });
      }
      console.log("User logged out successfully");
      // Redirect or send a response as needed
      // res.redirect("https://node-js-authentication-git-it.onrender.com/login"); // For example, redirect to the home page
      res.redirect("https://node-js-authentication-git-it.onrender.com/"); // For example, redirect to the home page
    });
  });
  

export default authRouter;