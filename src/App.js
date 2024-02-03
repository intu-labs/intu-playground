import "./App.css";
import { ethers } from "ethers";
import { useState } from "react";

import {
  getVaults,
  vaultCreation,
  preRegistration,
  completeVault,
  submitTransaction,
  automateRegistration,
  signTx,
  combineSignedTx,
  registerAllSteps,
  getUserRegistrationAllInfos,
  registerStep1,
  registerStep2,
  registerStep3,
} from "@intuweb3/exp-web";

const jsonRpcProvider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.REACT_APP_JSONRPCID}`);
const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send("eth_requestAccounts", []);
const signer = await provider.getSigner();
const signerAddress = await provider.getSigner().getAddress();
let myIntuAccounts = await getVaults(signerAddress, provider);
console.log(myIntuAccounts);
let currentVault = myIntuAccounts && myIntuAccounts[myIntuAccounts.length - 1];
let myVaultAddress = myIntuAccounts.length > 0 ? myIntuAccounts[myIntuAccounts.length - 1].vaultAddress : "0x1";

let vCreate = async () => {
  const proposedAddresses = [
    "0x633FEedCda014E7C095f406A697918838F523508", // FILL IN YOUR PUBLIC ADDRESS HERE
    "0x947c2A79A4009E8f19a14a5437373d9239298558", // FILL IN YOUR PUBLIC ADDRESS HERE
    "0x20acAE41C32F33Dcf862Da6A24a45f860bc88A46", // FILL IN YOUR PUBLIC ADDRESS HERE
  ];
  await vaultCreation(proposedAddresses, "New Intu Vault", 66, 66, 66, signer); // the 66 is a percentage, we are setting up a 2(t) of 3(n) scheme
};

let preReg = async () => {
  await preRegistration(myVaultAddress, signer);
};

let regStep1 = async () => {
  await registerStep1(myVaultAddress, signer);
};

let regStep2 = async () => {
  await registerStep2(myVaultAddress, signer);
};

let regStep3 = async () => {
  await registerStep3(myVaultAddress, signer);
};

let cVault = async () => {
  await completeVault(myVaultAddress, signer);
};

//shouldn't be needed as long as everyone is online
//let regAll = async () => {
//  await registerAllSteps(myVaultAddress, signer);
//};

let submitTx = async () => {
  //The following commented code is an example to create perform a token transfer in a transaction
  {
    /*
  const erc721Interface = new ethers.utils.Interface(["function safeTransferFrom(address _from, address _to, uint256 _tokenId)"]);
  //let contractInterface = new ethers.utils.Interface(contractJson.abi);
  //let encodedCommand = contractInterface.encodeFunctionData("proposeTransaction", ["0x1234567890"]);
  //const data = erc721Interface.encodeFunctionData("safeTransferFrom", [
  //  "0x4f5d7651eceded736a9c49f30193b1fa8a4e668a",
  //  "0x94fD43dE0095165eE054554E1A84ccEfa8fdA47F",
  //  4,
  //]);
  */
  }
  let chainId = "1351057110"; //this is sepolia chainid //skale 1351057110
  let value = "0.01"; //in eth
  let to = "0x633FEedCda014E7C095f406A697918838F523508"; //address you want to send tokens to... contract address in case of token transfer
  let gasPrice = ""; //determined by protocol, or you can enter your own
  let gas = ""; //determined by protocol, or you can enter your own
  let nonce = 0; //needs to be incremeneted for each transaction
  let data = ""; //for sending transactions, etc
  await submitTransaction(to, value, String(chainId), String(nonce), data, gasPrice, gas, myVaultAddress, signer);
};

let signTransactions = async () => {
  let txId = 1;
  await signTx(myVaultAddress, txId, signer);
};

let combineTx = async () => {
  let txId = 1;
  let hash = await combineSignedTx(myVaultAddress, txId, signer);
  let p = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.REACT_APP_JSONRPCID}`);
  // skale testnet https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix
  p.sendTransaction(hash.combinedTxHash.finalSignedTransaction)
    .then((txResponse) => {
      console.log("Transaction Hash:", txResponse.hash);
    })
    .catch((error) => {
      console.error("Failed to send transaction:", error);
    });
};

function App() {
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState("");
  const buildMultipleVaults = true;

  let automaticRegistration = async () => {
    setLoading(true);
    try {
      await automateRegistration(myVaultAddress, signerAddress, signer).then(async (result) => {
        let isRegistered = await getUserRegistrationAllInfos(myVaultAddress, signerAddress, provider);
        console.log(isRegistered.registered);
        if (isRegistered.registered === false) {
          await registerAllSteps(myVaultAddress, signer);
          console.log("registerallstepsdone");
        }
        return true;
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  if (currentVault && currentVault.masterPublicAddress) {
    provider.getBalance(currentVault.masterPublicAddress).then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance);
      setTokens(balanceInEth);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>INTU</div>
        <div>
          <small>Your EOA: {signerAddress}</small>
        </div>
        <div>Vault MPC EOA: {currentVault && currentVault.masterPublicAddress ? currentVault.masterPublicAddress : "MPC not complete"}</div>
        <div>MPC Balance: {currentVault && currentVault.masterPublicAddress ? tokens : "0"}</div>
        {!loading ? (
          <>
            <button onClick={() => vCreate()}>vault create</button>
            {myIntuAccounts.length > 0 ? (
              <>
                {(myIntuAccounts.length > 0 && currentVault.masterPublicAddress === "") || buildMultipleVaults ? (
                  <>
                    <div style={{ border: "1px solid #333", backgroundColor: "blue", borderRadius: "5px", padding: "10px" }}>
                      <div>
                        Perform the registration steps in this BLUE box if you do not setup private keys in the .env file to perform the automatic
                        registration.
                      </div>
                      <br />
                      <button onClick={() => preReg()}>pre register</button>
                      <button onClick={() => regStep1()}>regStep1</button>
                      <button onClick={() => regStep2()}>regStep2</button>
                      <button onClick={() => regStep3()}>regStep3</button>
                      <button onClick={() => cVault()}>completeVault</button>
                    </div>
                    <br />
                    <br />
                    <div style={{ border: "1px solid #333", backgroundColor: "purple", borderRadius: "5px", padding: "10px", marginTop: "25px" }}>
                      <div>
                        Perform the registration steps in this PURPLE box if you do setup private keys and have 3 different browsers open with each
                        running the wallet for each key.
                      </div>
                      <br />
                      <button onClick={() => preReg()}>pre register</button>
                      <button onClick={() => automaticRegistration()}>automateRegistration</button>
                      <button onClick={() => cVault()}>completeVault</button>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {myIntuAccounts && myIntuAccounts[myIntuAccounts.length - 1].masterPublicAddress !== "" ? (
                  <div style={{ border: "1px solid #333", backgroundColor: "green", borderRadius: "5px", padding: "10px" }}>
                    <div>Now that you have a master public address for your MPC account - you can submit, sign and combine/send the transaction.</div>
                    <div>Keep in mind, you will need to fund the MPC public address before sending funds from it.</div>
                    <br />
                    <button onClick={() => submitTx()}>submittx</button>
                    <button onClick={() => signTransactions()}>signtx</button>
                    <button onClick={() => combineTx()}>combinetx</button>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </header>
    </div>
  );
}
export default App;
