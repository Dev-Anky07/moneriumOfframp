/*
This script is for testing the Monerium SDK in a sandbox environment, locally on your device. This is meant to be an example of what can be done using 
the API and how the most basic functionalities can be implemented. This is no where near production grade code, please use this at your own discretion.

uploadDoc.js is a script which uploads the required invoice or supporting documents required for off ramping more than 15,000 €. It requires the bearer
token from clientcred.js and returns the `id` of the pdf file which is then passed on to offramp.js (if required)

doc.pdf is a file here, if the req file is of any other name then make changes accordingly

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

const { exec, execSync } = require('child_process');

function executeCurlCommand(token, path) {
    const curlCommand = `curl -H "Authorization: Bearer ${token}" --form "file=@${path}" https://api.monerium.dev/files`;
  
    try {
      console.log('Executing curl command...');
      const stdout = execSync(curlCommand, { encoding: 'utf-8' });
      
      console.log('Raw response:', stdout);
  
      try {
        const response = JSON.parse(stdout);
        console.log('Parsed API Response:');
        console.log(JSON.stringify(response, null, 2));
  
        const doc_id = response.id;
        console.log(`\nDocument ID: ${doc_id}`);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
      }
    } catch (error) {
      console.error(`Error executing curl command: ${error.message}`);
      if (error.stderr) {
        console.error(`stderr: ${error.stderr}`);
      }
    }
  }

const token = ''; // your access token
const path = '/Users/anky/Documents/GitHub/moneriumOfframp/doc.pdf'; // path/to/file/doc.pdf

executeCurlCommand(token, path);

// Curl command with bearer auth template : curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" --form file="@PATH_GOES_HERE" https://api.monerium.dev/files