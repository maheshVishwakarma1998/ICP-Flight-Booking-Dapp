import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory as hotelIDL } from "../../../declarations/dfinity_js_backend/dfinity_js_backend.did.js";
import { idlFactory as ledgerIDL } from "../../../declarations/ledger_canister/ledger_canister.did.js";

const HOTEL_CANISTER_ID = "be2us-64aaa-aaaaa-qaabq-cai";
const LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";
const HOST = "http://localhost:4943";

export async function getHotelCanister() {
  return await getCanister(HOTEL_CANISTER_ID, hotelIDL);
}

export async function getLedgerCanister() {
  return getCanister(LEDGER_CANISTER_ID, ledgerIDL);
}

async function getCanister(canisterId, idl) {
  const authClient = window.auth.client;
  const agent = new HttpAgent({
    host: HOST,
    identity: authClient.getIdentity(),
  });
  await agent.fetchRootKey(); // this line is needed for the local env only
  return Actor.createActor(idl, {
    agent,
    canisterId,
  });
}
