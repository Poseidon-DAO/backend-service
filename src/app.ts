import { Alchemy } from "alchemy-sdk";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Express } from "express";

import * as artistController from "@controllers/artist";
import * as collectionController from "@controllers/collection";
import * as metaborgController from "@controllers/metaborg";
import * as nftController from "@controllers/nft";
import * as tokenController from "@controllers/token";
import * as userController from "@controllers/user";

import { mintEventconfig, onGNftMint, settings } from "@sockets/index";
import { startScheduledTasks } from "@tasks/index";

dotenv.config();

const alchemy = new Alchemy(settings);
const app: Express = express();

startScheduledTasks();

alchemy.ws.on(mintEventconfig, onGNftMint);

app.use(bodyParser.json());
app.use(cors());
app.set("port", process.env.PORT || 3000);

app.get("/artists", artistController.getArtists);
app.post("/artists", artistController.postArtist);
app.post("/artists/metaborg", metaborgController.submitMetaborgBurn);

app.get("/collection", collectionController.getCollection);
app.post("/collection/vote", collectionController.voteCollection);
app.patch("/collection/vote", collectionController.revoteCollection);

app.get("/nft/weeklyMinted", nftController.getWeeklyMinted);
app.get("/nft/total", nftController.totalNfts);

app.get("/token/weeklyMoved", tokenController.getWeeklyTransfers);
app.get("/token/weeklyBurned", tokenController.getWeeklyBurned);
app.get("/token/airdropsByDate", tokenController.getAirdrops);
app.get("/token/vestsByDate", tokenController.getVests);
app.get("/token/airdropUsers", tokenController.getAiradropUsers);

app.post("/user/register", userController.register);

export default app;
