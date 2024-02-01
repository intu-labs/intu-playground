If you want to use the automated registration (less clicks)...  
Edit the .env.example file to input some private keys and your Sepolia infura endpoint ID, and rename the file to .env

**The following demo is meant to be ran on Sepolia**

npm i && npm start

You have 2 options to test this:

1. You can run in a single browser and keep switching accounts as needed (for pre-registration, automate, and storing data)
2. Run localhost:3000 in 3 separate browsers with 3 separate wallets (unique one in each browser).

First, you will want to edit App.js and put in some addresses you have control over.  
Click vault create, which will create a smart contract that they will all use to interact with eachother.

Then, each user will need to pre-register.

Then, each user will need to perform automateRegistration. If you run that function in 3 browsers at the same time for 3 users, it will automatically perform 3 individual steps for each user.
Otherwise, if you rotate EOA's in a single browser, you will need to automate registration for each user 3 times. So, EOA1 -> Automate Registration, EOA2 -> Automate Registration, EOA3 -> Automate Registration. Then repeate that process 2 more times.

Then each user will need to 'store my keys/finalize registration'.

Then a single user can click 'complete Vault' to finish up the process for all.

Then you can submit a tx for all users to sign, sign it with 2 or more users, then combine and send.
