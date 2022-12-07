import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import {
  addAlchemyContextToRequest,
  validateAlchemySignature,
} from "utils/alchemy-webhook";

import * as pollsController from "./controllers/polls";

dotenv.config();

const signingKey = process.env.SIGNING_KEY;

const app: Express = express();

app.use(bodyParser.json());
app.set("port", process.env.PORT || 3000);

app.use(
  express.json({
    verify: addAlchemyContextToRequest,
  })
);
app.use(validateAlchemySignature(signingKey));

app.get("/polls", pollsController.getPolls);
app.post("/polls", pollsController.createPoll);
app.post("/polls", pollsController.createPollFromWebhook);

export default app;
