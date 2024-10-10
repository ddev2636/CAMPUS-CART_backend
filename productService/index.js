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
import cookieParser from "cookie-parser";

//importing middlewares
import notFoundMiddlware from "./middleware/notFound.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

//routes

import thingRouter from "./Routes/itemRoutes.js";
import stripeRouter from "./Routes/stripeRoutes.js";

//inbuile middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://campus-cart-frontend.vercel.app",
    ],
    credentials: true,
  })
);

app.use("/api/v1/item", thingRouter);
app.use("/api/v1/stripe", stripeRouter);
app.get("/", (req, res) => {
  res.json({
    message: "Hello, World! 5000 from me",
    status: "success",
    data: {
      key1: "value1",
      key2: "value2",
    },
  });
});

app.use(notFoundMiddlware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT0 || 5000;

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
