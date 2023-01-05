import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import * as pollsController from "./controllers/polls";

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());
app.set("port", process.env.PORT || 3000);

app.get("/polls", pollsController.getPolls);
app.post("/polls", pollsController.createPoll);
app.post("/pollsWebhook", pollsController.createPollFromWebhook);

export default app;
