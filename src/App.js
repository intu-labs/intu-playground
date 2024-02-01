import "./App.css";
import { ethers } from "ethers";
import { FC, useState, useEffect } from "react";

import {
  getVaults,
  getReSharingStatus,
  vaultCreation,
  preRegistration,
  completeVault,
  submitTransaction,
  automateRegistration,
  signTx,
  combineSignedTx,
  reShareStep1,
  reShareStep2,
  reShareStep3,
  proposeAddUserInVault,
  registerAllSteps,
  getUserRegistrationAllInfos,
  getRotationVaultAddresses,
  getRegistrationStatus,
} from "@intuweb3/web";

const jsonRpcProvider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.JSONRPCID}`);
const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send("eth_requestAccounts", []);
const signer = await provider.getSigner();
const signerAddress = await provider.getSigner().getAddress();
const erc721Interface = new ethers.utils.Interface(["function safeTransferFrom(address _from, address _to, uint256 _tokenId)"]);
let myIntuAccounts = await getVaults(signerAddress, provider);
let currentVault = myIntuAccounts[myIntuAccounts.length - 1];
let myVaultAddress = myIntuAccounts.length > 0 ? myIntuAccounts[myIntuAccounts.length - 1].vaultAddress : "0x1";
console.log("myVaults: ", myIntuAccounts);
console.log("latestvault: ", currentVault);
console.log("myVaultAddress: ", myVaultAddress);
let myRotationVaults = await getRotationVaultAddresses(signerAddress, provider);
if (myVaultAddress === "0x1" && myRotationVaults.length > 0) {
  myVaultAddress = myRotationVaults[myRotationVaults.length - 1];
}

if (myVaultAddress !== "0x1") {
  let resharingStatus = await getReSharingStatus(myVaultAddress, signerAddress, provider);
  let registrationStatus = await getRegistrationStatus(myVaultAddress, signerAddress, provider);
}

let vCreate = async () => {
  const proposedAddresses = [
    "0x1111111111111111111111111111111111111111", // FILL IN YOUR ADDRESSES HERE
    "0x2222222222222222222222222222222222222222", // FILL IN YOUR ADDRESSES HERE
    "0x3333333333333333333333333333333333333333", // FILL IN YOUR ADDRESSES HERE
  ];
  await vaultCreation(proposedAddresses, "New Vault", 60, 60, 60, signer);
};

let preReg = async () => {
  await preRegistration(myVaultAddress, signer);
};

let cVault = async () => {
  await completeVault(myVaultAddress, signer);
};

let submitTx = async () => {
  //let contractInterface = new ethers.utils.Interface(contractJson.abi);
  //let encodedCommand = contractInterface.encodeFunctionData("proposeTransaction", ["0x1234567890"]);
  //const data = erc721Interface.encodeFunctionData("safeTransferFrom", [
  //  "0x4f5d7651eceded736a9c49f30193b1fa8a4e668a",
  //  "0x94fD43dE0095165eE054554E1A84ccEfa8fdA47F",
  //  4,
  //]);

  let chainId = "11155111";
  let value = "0.001";
  let to = "0xDf3e004BAB3b32110Bb495C0fd5DE25e0144880c"; //contract address in case of token transfer
  let gasPrice = "";
  let gas = "";
  let nonce = 0;
  let data = "";
  await submitTransaction(to, value, String(chainId), String(nonce), data, gasPrice, gas, myVaultAddress, signer);
};

let signTransactions = async () => {
  let txId = 1;
  await signTx(myVaultAddress, txId, signer);
};

let combineTx = async () => {
  let txId = 1;
  let hash = await combineSignedTx(myVaultAddress, txId, signer);
  let p = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/a6122371120a4819ae02bac868b9d07a");
  p.sendTransaction(hash.combinedTxHash.finalSignedTransaction)
    .then((txResponse) => {
      console.log("Transaction Hash:", txResponse.hash);
    })
    .catch((error) => {
      console.error("Failed to send transaction:", error);
    });
};

let resharePre = async () => {
  await preRegistration(myVaultAddress, signer);
};

let reshareStep1Group = async () => {
  await reShareStep1(myVaultAddress, signer);
};

let reshareStep1New = async () => {
  await reShareStep1(myVaultAddress, signer);
};

let reshareStep2 = async () => {
  await reShareStep2(myVaultAddress, signer);
};

let reshareStep3 = async () => {
  await reShareStep3(myVaultAddress, signer);
};

let reshareSign = async () => {
  let txId = 1;
  await signTx(myVaultAddress, txId, signer);
};

let regAll = async () => {
  await registerAllSteps(myVaultAddress, signer);
};

let reshareCombine = async () => {
  let txId = 1;
  let hash = await combineSignedTx(myVaultAddress, txId, signer);
  //let p = new ethers.providers.JsonRpcProvider("https://bsc-testnet.publicnode.com");
  let p = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/a6122371120a4819ae02bac868b9d07a");
  console.log(hash.combinedTxHash.finalSignedTransaction);
  p.sendTransaction(hash.combinedTxHash.finalSignedTransaction)
    .then((txResponse) => {
      console.log("Transaction Hash:", txResponse.hash);
    })
    .catch((error) => {
      console.error("Failed to send transaction:", error);
    });
};

let proposeUser = async () => {
  //0x633FEedCda014E7C095f406A697918838F523508
  let proposedRotationAddress = "0xC29Cd9FF0460b9C9bBC4b410eB175512431bb5b7";
  await proposeAddUserInVault(myVaultAddress, proposedRotationAddress, signer);
};

function App() {
  const [loading, setLoading] = useState(false);

  let ar = async () => {
    setLoading(true);
    try {
      await automateRegistration(myVaultAddress, signerAddress, signer).then(async (result) => {
        let isRegistered = await getUserRegistrationAllInfos(myVaultAddress, signerAddress, provider);
        console.log(isRegistered);
        if (isRegistered.regsistered === true) {
          await registerAllSteps(myVaultAddress, signer);
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

  return (
    <div className="App">
      <header className="App-header">
        <div>INTU</div>
        <div>Your EOA: {signerAddress}</div>
        <div>Vault Contract: {myVaultAddress ? myVaultAddress : "n/a"}</div>
        <div>Vault EOA: {currentVault.masterPublicAddress ? currentVault.masterPublicAddress : "n/a"}</div>
        {!loading ? (
          <>
            <button onClick={() => vCreate()}>vault create</button>
            {myIntuAccounts.length > 0 ? (
              <>
                <button onClick={() => preReg()}>pre register</button>
                <button onClick={() => ar()}>automateRegistration</button>
                <button onClick={() => regAll()}>store my keys / finalize registration</button>
                <button onClick={() => cVault()}>completeVault</button>
              </>
            ) : (
              ""
            )}
            {myIntuAccounts && myIntuAccounts[myIntuAccounts.length - 1].masterPublicAddress !== "" ? (
              <>
                <button onClick={() => submitTx()}>submittx</button>
                <button onClick={() => signTransactions()}>signtx</button>
                <button onClick={() => combineTx()}>combinetx</button>
              </>
            ) : (
              ""
            )}
            <hr />
            <hr />
            {/*
            <div>Resharing tests</div>
            <button onClick={() => proposeUser()}>proposeUser</button>
            <button onClick={() => resharePre()}>reshare pre</button>
            <button onClick={() => reshareStep1Group()}>reshare step 1 group</button>
            <button onClick={() => reshareStep1New()}>reshare step 1 new</button>
            <button onClick={() => reshareStep2()}>reshare step 2</button>
            <button onClick={() => reshareStep3()}>reshare step 3</button>
            <button onClick={() => reshareSign()}>reshare sign tx</button>
            <button onClick={() => reshareCombine()}>reshare combine signatures</button>
        */}
          </>
        ) : (
          "waiting on others...."
        )}
      </header>
    </div>
  );
}
export default App;
