/*
This script is for testing the Monerium SDK in a sandbox environment, locally on your device. This is meant to be an example of what can be done using 
the API and how the most basic functionalities can be implemented. This is no where near production grade code, please use this at your own discretion.

offramp.js is used to create orders for off ramping a plethora of assets. The assets gets burned on chain and get transferred off chain with absolute
regulatory compliance. We'll add support for on-ramping transactions soon.

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
//const safeAddress = process.env.SAFE_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
console.log(privateKey);
//const privateKey2 = process.env.PRIVATE_KEY_2;
//const infuraProjectId = process.env.INFURA_PROJECT_ID;
const clientID = process.env.CLIENT_ID;
console.log(clientID);
const clientSECRET = process.env.CLIENT_SECRET;
console.log(clientSECRET);

function getRFC3339Time() {
  const now = new Date();
  const future = new Date(now.getTime() + 10 * 60000); // Add 10 minutes
  return future.toISOString();
}
// order data
const amount = process.env.AMOUNT;
console.log(amount);
const IBAN = process.env.IBAN;
console.log(IBAN);
const message = `Send EUR ${amount} to ${IBAN} at ${getRFC3339Time()}`;

// Using the Monerium SDK to handle the requests.
// https://www.npmjs.com/package/@monerium/sdk
const monerium = new MoneriumClient({
  environment: "sandbox",
  clientId: clientID,
  clientSecret: clientSECRET,
});

console.log('API Init');

// Get the wallet type from command line arguments

const request = async () => {
  let signature, address;
  address = process.env.EOA_ADDRESS;
  signature = await signEOA(message);

  console.log('Address : ', address)

  if (!signature) {
    console.error("Signature is missing");
    return;
  }

  // get access to Monerium API using client credentials
  await monerium.getAccess();

  // Define the request payload
  const data = {
    address,
    currency: "eur",
    chain: "ethereum",
    kind: "redeem",
    amount,
    counterpart: {
      identifier: {
        standard: "iban",
        IBAN,
      },
      details: {
        firstName: "Satoshi",
        lastName: "Nakamoto",
        country: "FR",
      },
    },
    message,
    signature,
    memo: "uuu jeeeeee",
  };

  console.log("creating order", data);
  profileId = process.env.CLIENT_ID;
  try {
    const response = await monerium.placeOrder(data, profileId);
    console.log("success", response);
  } catch (error) {
    console.error(error);
    return;
  }
};

// Function to sign a message using an EOA (Externally Owned Account)
const signEOA = async (message) => {
  const wallet = new ethers.Wallet(privateKey);
  return await wallet.signMessage(message);
};

request();