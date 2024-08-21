import mongoose from "mongoose";
import "../../env.js";

const HOST_URL = process.env.URL;

const mongooseConnectToDB = async () => {
  try {
    await mongoose.connect(HOST_URL);
    console.log("Mongoose is connected with database");
  } catch (error) {
    console.log(error);
  }
};

export default mongooseConnectToDB;