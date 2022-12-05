import express, { Express } from "express";
import dotenv from "dotenv";

import * as pollsController from "./controllers/polls";

dotenv.config();

const app: Express = express();

app.set("port", process.env.PORT || 3000);

app.get("/", pollsController.index);

export default app;
