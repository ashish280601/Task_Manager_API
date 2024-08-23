import mongoose from "mongoose";

const authShcema = new mongoose.Schema({
    googleID:{
        type: String
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    name:{
        type: String
    }
});

const authModel = mongoose.model("Auth", authShcema);

export default authModel