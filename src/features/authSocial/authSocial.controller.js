import SocialRepository from "./authSocial.repository.js";

export default class SocialController {
    constructor(){
        this.socialRepository = new SocialRepository
    }
    // Social Authentication Function  
    async googleLogin(req, res) {
        try {
            // Check if req.user is populated
            if (!req.user) {
                res.json({
                    data: {
                        message: "User not found",
                        status: false,
                    }
                });
            }

            console.log("Authenticated user:", req.user);

            const { id, displayName, emails, photos } = req.user;

            let user = await this.userRepository.findByGoogleId(id);

            if (!user) {
                user = await this.userRepository.createUser({
                    googleId: id,
                    name: displayName,
                    email: emails[0].value,
                    profilePhoto: photos[0].value
                });
            }
            
            // Correctly format the redirection URL with query parameters
            const redirectUrl = "https://node-js-authentication-git-it.onrender.com/dashboard";
            console.log("Redirecting to:", redirectUrl);
            // Redirect to frontend with the token and status as query parameters
            res.redirect(redirectUrl);

        } catch (error) {
            console.error("Error during Google login:", error);

            res.json({
                data: {
                    message: "Login Failed",
                    status: false,
                }
            });
        }
    }
}