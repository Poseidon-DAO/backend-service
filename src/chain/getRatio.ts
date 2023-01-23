import { ethers } from "ethers";

import ERC20Abi from "@contracts/ERC20Abi.json";

export async function getRatio() {
  const provider = new ethers.providers.AlchemyProvider(
    Number(process.env.CHAIN_ID),
    process.env.ALCHEMY_ID
  );
  const contract = new ethers.Contract(
    process.env.SC_ERC20_ADDRESS,
    ERC20Abi,
    provider
  );

  const ratio = await contract.ratio();

  return ratio;
}
