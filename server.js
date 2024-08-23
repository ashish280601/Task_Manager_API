import "./env.js";
// inbuilt import
import express from "express";
import cors from "cors";

// custom user import
import router from "./routes.js";
import mongooseConnectToDB from "./src/config/mongooseConfig.js";

const app = express();

var corsOptions = {
  origin: ["http://localhost:5173", "https://bookish-guide-44qxw4xp4x5f969-5173.app.github.dev", "https://task-manager-ui.onrender.com",],
  allowedHeaders: "*",
};

app.use(cors(corsOptions))

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
