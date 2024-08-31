/**
* This script demonstrates how to place an order with Monerium API
* and create signatures for EOA, Safe onchain transactions, and Safe offchain messages.
*
* Prerequisites:
* 1. Install Node.js from https://nodejs.org/ (if not already installed). ✅
* 2. Create a folder for this project and navigate to it in your terminal. ✅
* 3. Create a file called `reqNewAddress.js` and paste this script into it. ✅
* 4. Install the required npm packages by running: ✅
*    npm install dotenv @monerium/sdk ethers @safe-global/protocol-kit @safe-global/safe-core-sdk-types @safe-global/api-kit
* 5. Create a `.env` file in your project directory and add your environment variables: ✅
*    SAFE_ADDRESS=your_safe_address
*    PRIVATE_KEY=your_private_key
*    PRIVATE_KEY_2=your_second_private_key (if using Safe)
*    INFURA_PROJECT_ID=your_infura_project_id
*    ACCESS_TOKEN=your_access_token
*    PROFILE_ID=profile_that_owns_the_address
*    CLIENT_ID=your_client_id
*    CLIENT_SECRET=your_client_secret
* 6. Run the script using:
*    node reqNewAddress.js [eoa|safe-onchain|safe-offchain]
*
* Note: Replace the placeholder values in the `.env` file with your actual values.
* Tips
*  Create a Safe on Sepolia and a Punk wallet (https://punkwallet.io/)
*  Make the punk wallet a owner of the safe and use that private key
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
//const privateKey2 = process.env.PRIVATE_KEY_2;
const infuraProjectId = process.env.INFURA_PROJECT_ID;

function getRFC3339Time() {
  const now = new Date();
  const future = new Date(now.getTime() + 10 * 60000); // Add 10 minutes
  return future.toISOString();
}
// order data

const userInput = prompt('Enter the Amount : ')
const amount = userInput;
const IBAN = process.env.IBAN;
const message = `Send EUR ${amount} to ${IBAN} at ${getRFC3339Time()}`;

// Using the Monerium SDK to handle the requests.
// https://www.npmjs.com/package/@monerium/sdk
const monerium = new MoneriumClient({
  environment: "sandbox",
  clientId,
  clientSecret,
});

// Get the wallet type from command line arguments
const walletType = process.argv[2];

const request = async () => {
  let signature, address;

  switch (walletType) {
    case "eoa":
      address = process.env.EOA_ADDRESS;
      signature = await signEOA(message);
      break;
    case "safe-onchain":
      address = process.env.SAFE_ADDRESS;
      signature = await signOnchain(message);
      break;
    case "safe-offchain":
      address = process.env.SAFE_ADDRESS;
      signature = await signOffchain(message);
      break;
    default:
      if (!walletType) {
        console.error(
          "Wallet type parameter missing. Please use 'eoa','safe-onchain', or 'safe-offchain'. Example: node reqNewAddress.js eoa"
        );
        return;
      }
      console.error(
        `Unsupported wallet type ${walletType}. Please use 'eoa','safe-onchain', or 'safe-offchain'.`
      );
      return;
  }

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
        iban,
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

// Function to sign a message using Safe onchain transactions for a wallet with two owners.
const signOnchain = async () => {
  // Initialize Safe SDK with provider, signer, and safe address
  let kit = await Safe.default.init({
    provider: `https://sepolia.infura.io/v3/${infuraProjectId}`,
    signer: privateKey,
    safeAddress,
  });

  // Generate the hash of the message to be signed
  const hash = Safe.hashSafeMessage(message);

  // Get the SignMessageLib contract for the Safe version
  const contract = await Safe.getSignMessageLibContract({
    safeProvider: kit.getSafeProvider(),
    safeVersion: "1.3.0",
  });

  // Encode the transaction data to sign the message
  const txData = contract.encode("signMessage", [hash]);

  // Prepare the transaction payload
  const payload = {
    to: await contract.getAddress(),
    value: "0",
    data: txData,
    operation: OperationType.DelegateCall,
  };

  // Create the transaction
  let tx = await kit.createTransaction({
    transactions: [payload],
  });

  // // Sign the transaction with OWNER_1_ADDRESS
  // // After this, the transaction contains the signature from OWNER_1_ADDRESS
  tx = await kit.signTransaction(tx, Safe.SigningMethod.ETH_SIGN);

  // // Connect OWNER_2_ADDRESS
  kit = await Safe.default.init({
    provider: `https://sepolia.infura.io/v3/${infuraProjectId}`,
    signer: privateKey2,
    safeAddress,
  });

  // // Sign the transaction with OWNER_2_ADDRESS
  // // After this, the transaction contains the signature from OWNER_1_ADDRESS and OWNER_2_ADDRESS
  tx = await kit.signTransaction(tx, Safe.SigningMethod.ETH_SIGN);

  // Execute the transaction and log the response
  const response = await kit.executeTransaction(tx);
  console.log("signature response:", response);
  return "0x";
};

// Function to sign a message using Safe offchain messages for a wallet with two owners.
const signOffchain = async (message) => {
  // Initialize Safe SDK with provider, signer, and safe address
  let kit = await Safe.default.init({
    provider: `https://sepolia.infura.io/v3/${infuraProjectId}`,
    signer: privateKey,
    safeAddress,
  });

  // Create a new message object
  let msgSafe = kit.createMessage(message);

  // Sign the message with OWNER 1
  msgSafe = await kit.signMessage(
    msgSafe,
    Safe.SigningMethod.ETH_SIGN,
    safeAddress
  );

  // Sign with OWNER 2
  kit = await Safe.default.init({
    provider: `https://sepolia.infura.io/v3/${infuraProjectId}`,
    signer: privateKey2,
    safeAddress,
  });

  msgSafe = await kit.signMessage(
    msgSafe,
    Safe.SigningMethod.ETH_SIGN,
    safeAddress
  );

  // get the signature for OWNER 1
  const signature = Array.from(msgSafe.signatures.values())[0];

  // Instantiate the API Kit
  // Use the chainId where you have the Safe account deployed
  const apiKit = new SafeApi({ chainId: 11155111 });

  // Propose the message
  try {
    await apiKit.addMessage(safeAddress, {
      message,
      signature: Safe.buildSignatureBytes([signature]),
    });
  } catch (error) {
    const regex = /already exists/;

    if (!error || !regex.test(error.message)) {
      console.error("Error:", error.message);
      return;
    } else {
      console.log(error.message);
      console.log("Signature 1 has already been added, continuing...");
    }
  }

  // Get the signature from OWNER_2_ADDRESS
  const signatureOwner2 = Array.from(msgSafe.signatures.values())[1];

  const safeMessageHash = await kit.getSafeMessageHash(
    Safe.hashSafeMessage(message)
  );

  // Add signature from OWNER_2_ADDRESS
  try {
    await apiKit.addMessageSignature(
      safeMessageHash,
      Safe.buildSignatureBytes([signatureOwner2])
    );
  } catch (error) {
    const regex = /already exists/;

    if (!error || !regex.test(error.message)) {
      console.error("Error:", error.message);
      return;
    } else {
      console.log(error.message);
      console.log("Signature 2 has already been added, continuing...");
    }
  }

  // Get the message and confirmation status
  const status = await apiKit.getMessage(safeMessageHash);
  if (status?.preparedSignature) {
    return status.preparedSignature;
  }
  return;
};

request();