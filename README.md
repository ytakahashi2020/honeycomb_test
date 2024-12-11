### 1 Preparation

#### 1 Generate a keypair

```
solana-keygen new --outfile keys/admin.json --no-bip39-passphrase --force
```

if you want to know the address

```
solana address -k keys/admin.json
```

#### 2 Airdrop

```
solana airdrop 100 --url https://rpc.test.honeycombprotocol.com/ -k keys/admin.json
```

#### 3 Check in the explorer

https://explorer.solana.com/

custom url rpc is here  
https://rpc.test.honeycombprotocol.com

#

### 2 Execute the transaction

#### 1 set API_URL

const API_URL = "https://edge.test.honeycombprotocol.com/"

#### 2 get a keypair from the file

1)fs  
2)path.json  
3)\* as web3 from "@solana/web3.js"  
4)web3.Keypair.fromSecretKey

#### 3 create a client

const client = createEdgeClient<true>(API_URL, true);  
createEdgeClient from @Honeycomb-protocol/edge-client

#### 4 create a Transaction

createCreateProjectTransaction

1)name  
2)authority  
3)payer

#### 5 sendTransactionForTests

1 from "@honeycomb-protocol/edge-client/client/helpers"  
2 arguments  
1)client  
2)Transaction( { blockhash, lastValidBlockHeight, transaction )  
3)signers?: Keypair[]
