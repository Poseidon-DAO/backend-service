import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import * as tokenController from "@controllers/token";
// import * as pollsController from "@controllers/polls";

import { startScheduledTasks } from "@tasks/index";

dotenv.config();

const app: Express = express();
startScheduledTasks();

app.use(bodyParser.json());
app.set("port", process.env.PORT || 3000);

app.get("/token/weeklyMoved", tokenController.getWeeklyTransfers);
app.get("/token/weeklyBurned", tokenController.getWeeklyBurned);

// app.get("/polls", pollsController.getPolls);
// app.post("/polls", pollsController.createPoll);

export default app;
