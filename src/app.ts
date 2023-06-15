import { Alchemy } from "alchemy-sdk";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { type Express } from "express";

import * as artistController from "@controllers/artist";
import * as collectionController from "@controllers/collection";
import * as metaborgController from "@controllers/metaborg";
import * as nftController from "@controllers/nft";
import * as searchController from "@controllers/search";
import * as tokenController from "@controllers/token";
import * as userController from "@controllers/user";
import * as userSettingsController from "@controllers/userSettings";
import * as voteController from "@controllers/vote";

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
app.get("/collection/:collectionId", collectionController.getCollectionItem);
app.get(
  "/collection/:collectionId/votes",
  collectionController.getCollectionVotes
);
app.post("/collection/vote", collectionController.voteCollection);
app.patch("/collection/vote", collectionController.revoteCollection);
app.delete("/collection/vote", collectionController.deleteVoteCollection);

app.get("/nft/weeklyMinted", nftController.getWeeklyMinted);
app.get("/nft/total", nftController.totalNfts);

app.get("/search", searchController.search);

app.get("/token/weeklyMoved", tokenController.getWeeklyTransfers);
app.get("/token/weeklyBurned", tokenController.getWeeklyBurned);
app.get("/token/airdropsByDate", tokenController.getAirdrops);
app.get("/token/vestsByDate", tokenController.getVests);
app.get("/token/airdropUsers", tokenController.getAiradropUsers);

app.post("/user/register", userController.register);

app.get("/user/settings", userSettingsController.settings);
app.post("/user/settings", userSettingsController.updateSettings);

app.get("/vote/stats", voteController.getVoteStats);

export default app;
