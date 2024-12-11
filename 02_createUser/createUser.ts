import * as web3 from "@solana/web3.js";
import fs from "fs";
import path from "path";
import { createEdgeClient } from "@honeycomb-protocol/edge-client";
import { sendTransactionForTests } from "@honeycomb-protocol/edge-client/client/helpers";

const API_URL = "https://edge.test.honeycombprotocol.com/";

const adminWalletFile = JSON.parse(
  fs.readFileSync(path.join("./keys/admin.json"), "utf8")
);

const userWalletFile = JSON.parse(
  fs.readFileSync(path.join("./keys/user.json"), "utf8")
);

const adminKeyPair = web3.Keypair.fromSecretKey(
  new Uint8Array(adminWalletFile)
);

const userKeyPair = web3.Keypair.fromSecretKey(new Uint8Array(userWalletFile));

const client = createEdgeClient(API_URL, true);

const {
  createNewUserTransaction: txResponse, // This is the transaction response, you'll need to sign and send this transaction
} = await client.createNewUserTransaction({
  wallet: userKeyPair.publicKey.toString(), // User's wallet public key
  info: {
    name: "Test User",
    pfp: "https://lh3.googleusercontent.com/-Jsm7S8BHy4nOzrw2f5AryUgp9Fym2buUOkkxgNplGCddTkiKBXPLRytTMXBXwGcHuRr06EvJStmkHj-9JeTfmHsnT0prHg5Mhg",
    bio: "This is a test user",
  },
  payer: adminKeyPair.publicKey.toString(), // Optional, the transaction payer's public key
});

const result = await sendTransactionForTests(client, txResponse, [
  adminKeyPair,
]);

console.log(result.signature);

const usersArray = await client.findUsers({
  wallets: ["BPia4pVpHXGp6aBDaAdXyy5h1ArJ64PF8xE6bHT7TWRK"], // String array of users' wallet addresses
});

console.log(usersArray);
