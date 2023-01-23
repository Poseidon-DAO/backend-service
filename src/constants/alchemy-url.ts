let url: string;

if (process.env.NODE_ENV === "dev") {
  url = `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`;
} else {
  url = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`;
}

export default url;
