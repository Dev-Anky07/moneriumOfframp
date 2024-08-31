require("dotenv").config();

const cli_id = process.env.CLIENT_ID
const cli_secret = process.env.CLIENT_SECRET
console.log('Client ID:', cli_id);
console.log('Client Secret:', cli_secret);

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

