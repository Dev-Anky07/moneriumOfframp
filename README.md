/*
This script is for testing the Monerium SDK in a sandbox environment, locally on your device. This is meant to be an example of what can be done using 
the API and how the most basic functionalities can be implemented. This is no where near production grade code, please use this at your own discretion.

offramp.js is used to create orders for off ramping a plethora of assets. The assets gets burned on chain and get transferred off chain with absolute
regulatory compliance. We'll add support for on-ramping transactions soon.

uploadDoc.js is a script which uploads the required invoice or supporting documents required for off ramping more than 15,000 €. It requires the bearer
token from clientcred.js and returns the `id` of the pdf file which is then passed on to offramp.js (if required). doc.pdf is a file here, if the req 
file is of any other name then make changes accordingly

clientcred.js is a simple script to create temporary auth tokens which are required for a multitude of things, for example uploading files, authorising
txns (the constructer used to call the monerium api calls for the auth token on its own using `clientId` and `Clientsecret`) linking wallet and more. 

linkWallet.js is used to link a wallet to a specific account

These txns are performed within a sandbox environment and thus aren't real. To transition to the mainnet, change the url to `api.monerium.app` and
environment to `production`, instead of `api.monerium.dev` and `sandbox`

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
