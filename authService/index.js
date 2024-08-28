import express from "express";
const app = express();
import connectDB from "./db/connect.js";
import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

//importing middlewares
import notFoundMiddlware from "./middleware/notFound.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

//routes
import authRouter from "./Routes/authRoutes.js";

//inbuile middleware
app.use(express.json());

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());

app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddlware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT1 || 5001;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () => {
      console.log(`server listening on ${port} `);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
