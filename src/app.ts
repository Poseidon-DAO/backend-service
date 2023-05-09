import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Express } from "express";

import * as artistController from "@controllers/artist";
import * as collectionController from "@controllers/collection";
import * as nftController from "@controllers/nft";
import * as tokenController from "@controllers/token";
import * as userController from "@controllers/user";

import { startScheduledTasks } from "@tasks/index";

dotenv.config();

const app: Express = express();
startScheduledTasks();

app.use(bodyParser.json());
app.use(cors());
app.set("port", process.env.PORT || 3000);

app.get("/artists", artistController.getArtists);
app.post("/artists", artistController.submitApplication);
app.post("/artists/metaborg", artistController.submitMetaborgBurn);

app.get("/collection", collectionController.get);
app.post("/collection/vote", collectionController.vote);
app.patch("/collection/vote", collectionController.revote);

app.get("/nft/weeklyMinted", nftController.getWeeklyMinted);
app.get("/nft/total", nftController.totalNfts);

app.get("/token/weeklyMoved", tokenController.getWeeklyTransfers);
app.get("/token/weeklyBurned", tokenController.getWeeklyBurned);
app.get("/token/airdropsByDate", tokenController.getAirdrops);
app.get("/token/vestsByDate", tokenController.getVests);
app.get("/token/airdropUsers", tokenController.getAiradropUsers);

app.post("/user/register", userController.register);

export default app;

// 1. Make voting possible
// 2. Fetch collection (All, Superrare, Foundation, Nifty Gateway, OpenSea)
// 3. Most voted, Most loved, Most hated, Price high/low and vice versa, Most recent, Oldest
