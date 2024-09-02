/*
This script is for testing the Monerium SDK in a sandbox environment, locally on your device. This is meant to be an example of what can be done using 
the API and how the most basic functionalities can be implemented. This is no where near production grade code, please use this at your own discretion.

clientcred.js is a simple script to create temporary auth tokens which are required for a multitude of things, for example uploading files, authorising
txns (the constructer used to call the monerium api calls for the auth token on its own using `clientId` and `Clientsecret`) linking wallet and more. 

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

const cli_id = process.env.CLIENT_ID
const cli_secret = process.env.CLIENT_SECRET

const url = 'https://api.monerium.dev/auth/token';
const data = new URLSearchParams({
    'grant_type': 'client_credentials',
    'client_id': cli_id,
    'client_secret': cli_secret
});

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: data
})
.then(response => response.json())
.then(data => {
  console.log(data);
  
  const accessToken = data.access_token;
  const refreshToken = data.refresh_token;
  
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
})
.catch(error => {
  console.error('Error:', error);
});
