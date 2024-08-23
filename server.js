import "./env.js";
// inbuilt import
import express from "express"

// custom user import
import router from "./routes.js";
import mongooseConnectToDB from "./src/config/mongooseConfig.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', router);

app.listen(port, async () => {
    try {
      console.log(`Server is running at port ${port}`);
      await mongooseConnectToDB();
    } catch (error) {
      console.error("Error while connecting to database", error);
    }
  });
