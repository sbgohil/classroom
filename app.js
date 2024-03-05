import dotenv from "dotenv";
dotenv.config();

// Libs
import express from "express";
import cors from "cors";
import session from "cookie-session";
import cookieParser from "cookie-parser";
import _ from "lodash";

// Module imports
import routes from "./src/routes/index.js";
import { logger } from "./src/middlewares/logger.js";
import { errorHandler, notFound } from "./src/middlewares/errorHandlers.js";

const app = express();

// Middleware to parse requests
app.use(
  cors({
    origin: `http://${process.env.SERVER_HOST || "localhost"}:${
      process.env.SERVER_PORT || 80
    }`,
    methods: "GET,POST,PUT,DELET",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// cookie session
app.use(
  session({
    name: "session",
    keys: ["homiya"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

// Middlewares
app.use(logger);

app.listen(process.env.SERVER_PORT || 80, () => {
  console.log(
    `Server: UP\nServer URL: ${process.env.SERVER_HOST}:${process.env.SERVER_PORT || 80}`
  );
});

// Routes
app.use("/", routes);

app.use(errorHandler);
app.use(notFound);
