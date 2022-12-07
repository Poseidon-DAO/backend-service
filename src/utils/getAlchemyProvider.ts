const ethers = require("ethers");
const dotenv = require("dotenv");

dotenv.config();

const alchemyApiKey = process.env.ALCHEMY_ID;
let network;

if (process.env.NODE_ENV === "dev") {
  network = "goerli";
} else {
  network = "homestead";
}

const alchemyProvider = new ethers.providers.AlchemyProvider(
  network,
  alchemyApiKey
);

export { alchemyProvider };
