import keccak256 from "keccak256";

export const TRANSFER_EVENT_SIGNITURE = `0x${keccak256(
  "Transfer(address,address,uint256)"
).toString("hex")}`;

export const ADD_VEST_EVENT_SIGNITURE = `0x${keccak256(
  "AddVestEvent(address,uint256,uint256)"
).toString("hex")}`;
