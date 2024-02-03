\*Video showing manual registration setup (pure blockchain): https://drive.google.com/file/d/1MqzW4eo6WIyVV1MibTqgKWJ_MCc1_z2j/view?usp=sharing

\*Video showing automatic registration setup(decentralized database): https://drive.google.com/file/d/1l0cJBWVhG0HEKmEmKFEwDqzJ9rNzoDcW/view?usp=sharing
**The following demo is meant to be ran on Sepolia**

npm i && npm start

You have 2 options to test this:

1. You can run in a single browser and keep switching accounts as needed (for pre-registration, reg1-3, and complete)
   OR
2. Run localhost:3000 in 3 separate browsers with 3 separate wallets/accounts (unique one in each browser).

You will want to edit App.js and put in some public addresses you have control over in the createVault function.  
Click vault create, which will create a smart contract that the participants willuse to interact with eachother.

Then, each user will need to pre-register.

////// Method 1 (blue)///////

Then, all users will need to perform register step1. Then, all users will need to perform register step 2. Then all users will need to perform register step 3.  
Then a single user can run 'complete vault'.

Then you can submit a tx for all users to sign, sign it with 2 or more users, then combine and send.

////// Method 2 (purple)///////

Each user just needs to click on automate registration and wait.
Then a single user can run 'complete vault'.

Then you can submit a tx for all users to sign, sign it with 2 or more users, then combine and send.
