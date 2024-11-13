/*require("dotenv").config();
const userRoutes = require("./routes/user");
const publicationRoutes = require("./routes/publication");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var publicationRouter = require("./routes/publication");
var app = express();

const cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", userRouter);
app.use("/", publicationRouter);
app.use("/user", userRoutes);
app.use("/publication", publicationRoutes);

module.exports = app;*/

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

