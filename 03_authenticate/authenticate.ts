import * as web3 from "@solana/web3.js";
import fs from "fs";
import path from "path";
import { createEdgeClient } from "@honeycomb-protocol/edge-client";
import nacl from "tweetnacl";
import { sendTransactionForTests } from "@honeycomb-protocol/edge-client/client/helpers";
import base58 from "bs58";

const API_URL = "https://edge.test.honeycombprotocol.com/";

const userWalletFile = JSON.parse(
  fs.readFileSync(path.join("./keys/user.json"), "utf8")
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
  payer: userKeyPair.publicKey.toString(), // Optional, the transaction payer's public key
});

const result = await sendTransactionForTests(client, txResponse, [userKeyPair]);

console.log(result.signature);

const {
  authRequest: { message: authRequest },
} = await client.authRequest({
  wallet: userKeyPair.publicKey.toString(),
});

console.log(authRequest);

// Convert the auth request into a UInt8Array
const encodedMessage = new TextEncoder().encode(authRequest);
// Sign the message
const signedUIntArray = nacl.sign.detached(
  encodedMessage,
  userKeyPair.secretKey
);

const signature = base58.encode(signedUIntArray);

const { authConfirm } = await client.authConfirm({
  wallet: userKeyPair.publicKey.toString(),
  signature,
});

console.log(authConfirm.accessToken);
