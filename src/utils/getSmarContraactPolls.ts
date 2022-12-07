const ethers = require("ethers");

import { alchemyProvider } from "./getAlchemyProvider";
import MultisigContractAbi from "../../contracts/MultisigContractAbi.json";

const multisigSmartContractAddress = process.env.SC_MULTI_SIG_ADDRESS;

async function getSmarContractPolls() {
  const contract = new ethers.Contract(
    multisigSmartContractAddress,
    MultisigContractAbi,
    alchemyProvider
  );

  const data = await contract.getListOfActivePoll();

  return data.map((poll: any) => Number(poll));
}

export { getSmarContractPolls };
