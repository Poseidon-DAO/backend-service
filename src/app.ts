import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import * as pollsController from "@controllers/polls";
import * as tokenController from "@controllers/token";

import { startScheduledTasks } from "@tasks/index";

dotenv.config();

const app: Express = express();
startScheduledTasks();

app.use(bodyParser.json());
app.set("port", process.env.PORT || 3000);

app.get("/token/weeklyMoved", tokenController.getWeeklyMoved);
app.get("/token/weeklyBurned", tokenController.getWeeklyBurned);

app.get("/polls", pollsController.getPolls);
app.post("/polls", pollsController.createPoll);

export default app;
