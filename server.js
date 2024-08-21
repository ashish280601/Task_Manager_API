import "./env.js";
// inbuilt import
import express from "express"

// custom user import
import router from "./routes.js";
import mongooseConnectToDB from "./src/config/mongooseConfig.js";

const app = express();

const port = 3000;

app.use(router);

app.listen(port, async () => {
    try {
      console.log(`Server is running at port ${port}`);
      await mongooseConnectToDB();
    } catch (error) {
      console.error("Error while connecting to database", error);
    }
  });
