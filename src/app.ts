import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

import * as tokenController from "@controllers/token";
import * as nftController from "@controllers/nft";

import { startScheduledTasks } from "@tasks/index";

dotenv.config();

const app: Express = express();
startScheduledTasks();

app.use(bodyParser.json());
app.use(cors());
app.set("port", process.env.PORT || 3000);

app.get("/token/weeklyMoved", tokenController.getWeeklyTransfers);
app.get("/token/weeklyBurned", tokenController.getWeeklyBurned);
app.get("/token/airdropsByDate", tokenController.getAirdrops);

app.get("/nft/weeklyMinted", nftController.getWeeklyMinted);
app.get("/nft/total", nftController.totalNfts);

export default app;
