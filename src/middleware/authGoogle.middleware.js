// importing the social google library
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import UserModel from "../features/users/user.schema.js";
import emailServiceSignUp from "../services/emailService.js";
import crypto from "crypto";

// configuring my google authentication
export const googlePassportConfig = passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://node-js-authentication-apis.onrender.com/api/user/auth/google/callback",
    },
    async function verify(accessToken, refreshToken, profile, cb) {
      try {
        let user = await UserModel.findOne({ email: profile.emails[0].value })
        
        console.log("profile", profile);
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);
        if (!user) {
          // Create a user if not found in the database
          user = new UserModel({
            name: profile.displayName,
            email: profile.emails[0].value, // Assuming you want to store the email
            password: crypto.randomBytes(20).toString('hex'),
            status: true,
          });
          const userData = await user.save();
          console.log(userData);
          await emailServiceSignUp(userData.email, userData.name);
        }

        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await authModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});