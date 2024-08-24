import authModel from "./authSocial.schema";

export default class SocialRepository{
    async findGoogleId(googleId){
        try {
            const googleUser = await authModel.findOne({googleID});
            if(!googleUser){
                throw new Error("No user found")
            }
            return googleUser
        } catch (error) {
            console.error("Error while finding by google id", error);
            throw new Error("Error while finding google user")
            
        }
    }

     // Create a new user
     async createUser(userData) {
        try {
            const user = new User(userData);
            if(!user){
                throw new Error("Error while adding user")
            }
            return await user.save();
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }
}