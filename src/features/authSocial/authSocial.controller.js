export default class SocialController {
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