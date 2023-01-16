import keccak256 from "keccak256";

export const TRANSFER_EVENT_SIGNITURE = `0x${keccak256(
  "Transfer(address,address,uint256)"
).toString("hex")}`;
