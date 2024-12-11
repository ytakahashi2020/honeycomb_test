import * as web3 from "@solana/web3.js";
import fs from "fs";
import path from "path";
import { createEdgeClient } from "@honeycomb-protocol/edge-client";
import { sendTransactionForTests } from "@honeycomb-protocol/edge-client/client/helpers";

const API_URL = "https://edge.test.honeycombprotocol.com/";

const walletFile = JSON.parse(
  fs.readFileSync(path.join("./keys/admin.json"), "utf8")
);

const keyPair = web3.Keypair.fromSecretKey(new Uint8Array(walletFile));

const client = createEdgeClient(API_URL, true);

const {
  createCreateProjectTransaction: { project: projectAddress, tx: txResponse },
} = await client.createCreateProjectTransaction({
  name: "53w",
  authority: keyPair.publicKey.toString(),
  payer: keyPair.publicKey.toString(),
});

const result = await sendTransactionForTests(
  client,
  {
    blockhash: txResponse.blockhash,
    lastValidBlockHeight: txResponse.lastValidBlockHeight,
    transaction: txResponse.transaction,
  },
  [keyPair]
);

console.log(result.signature);
