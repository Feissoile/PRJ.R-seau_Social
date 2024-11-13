import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import indexRouter from "./routes/index.js";
import userRouter from "./routes/user.js";
import publicationRouter from "./routes/publication.js";

// Créer l'application express
const app = express();

// Middleware
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), "public")));
app.set('view engine', 'ejs');
app.set('views', './views');

// Routes
app.use("/", indexRouter);
app.use("/", userRouter);
app.use("/", publicationRouter);
app.use("/user", userRouter);
app.use("/publication", publicationRouter);

// Exporter l'application en tant que module par défaut
export default app;

