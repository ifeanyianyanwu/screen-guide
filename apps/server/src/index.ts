import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import mongoose from "mongoose";
import router from "./router";
import config from "./config";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());

app.use("/", router());

mongoose
  .connect(config.database.uri)
  .then(() => {
    console.log("Database Connected!");
    app.listen(config.server.port, () => {
      console.log(
        `Express server running on http://localhost:${config.server.port}`
      );
    });
  })
  .catch((error: Error) => console.log(error));
