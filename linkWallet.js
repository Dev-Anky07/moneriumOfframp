/*
This script is for testing the Monerium SDK in a sandbox environment, locally on your device. This is meant to be an example of what can be done using 
the API and how the most basic functionalities can be implemented. This is no where near production grade code, please use this at your own discretion.

linkWallet.js is used to link a wallet to a specific account

I'm getting a 403 forbidden error but that could be cause I've already linked the wallet, but you'll have to check for yourself

* Prerequisites:
*
* 1. Install the required npm packages by running:
*    npm install dotenv @monerium/sdk ethers @safe-global/protocol-kit @safe-global/safe-core-sdk-types @safe-global/api-kit
* 2. Create a `.env` file in your project directory and add your own environment variables: 
*    PRIVATE_KEY=
*    CLIENT_ID=
*    CLIENT_SECRET=
*    IBAN=
*    EOA_ADDRESS=
*    CURRENCY=
*    AMOUNT=
*    CHAIN=
*    KIND=
* 3. Run the script using:
*    node reqNewAddress.js
* 4. Chains supported : `ethereum` , `gnosis` , `polygon`
* 5. Currencies supported : `eur` , `usd` , `gbp` , `isk`
* 6. Kind stands for the type of txn, choose `redeem` for crypto off ramp txns
*/

require("dotenv").config();
const { MoneriumClient } = require("@monerium/sdk");
const { ethers } = require('ethers');
const Safe = require("@safe-global/protocol-kit");
const SafeApi = require("@safe-global/api-kit").default;
const { OperationType } = require("@safe-global/safe-core-sdk-types");

// Retrieve environment variables
const safeAddress = process.env.SAFE_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
const message = "I hereby declare that I am the address owner.";
console.log(privateKey);
const clientID = process.env.CLIENT_ID;
console.log(clientID);
const clientSECRET = process.env.CLIENT_SECRET;
console.log(clientSECRET);

const monerium = new MoneriumClient({
  environment: "sandbox",
  clientId: clientID,
  clientSecret: clientSECRET,
});

const request = async () => {
  let signature, address;
  address = process.env.EOA_ADDRESS;
  signature = await signEOA(message);

  if (!signature) {
    console.error("Signature is missing");
    return;
  }
  // get access to Monerium API using client credentials
  await monerium.getAccess();

  // Define the request payload
  const data = {
    message,
    address,
    signature,
    accounts: [
      {
        currency: "eur",
        chain: "ethereum",
      },
      {
        currency: "gbp",
        chain: "ethereum",
      },
      {
        currency: "usd",
        chain: "ethereum",
      },
      {
        currency: "eur",
        chain: "polygon",
      },
      {
        currency: "gbp",
        chain: "polygon",
      },
      {
        currency: "usd",
        chain: "polygon",
      },
      {
        currency: "eur",
        chain: "gnosis",
      },
      {
        currency: "gbp",
        chain: "gnosis",
      },
      {
        currency: "usd",
        chain: "gnosis",
      }
    ],
  };
  profileId = process.env.CLIENT_ID;
  try {
    const response = await monerium.linkAddress(profileId, data);
    console.log("success", response);
  } catch (error) {
    console.error(error);
    return;
  }
};

// Function to sign a message using an EOA (Externally Owned Account)
const signEOA = async (message) => {
  const wallet = new ethers.Wallet(privateKey);
  console.log('Signature Created : ✨');
  return await wallet.signMessage(message);
};

request();