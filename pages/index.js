import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/SimpleStorage.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [message, setMessage] = useState(" ");
  const [newName, setnewName] = useState();
  const [newId, setNewId] = useState();
  const [id, setId] = useState();

  const contractAddress = "0xEc65B74E8F7DEBa42F3122A9Ac8D12930aBDAa75";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Connect Metamask Wallet</button>;
    }

    //Added functionality

    async function setName() {
      if (atm) {
        let tx = await atm.setValue(newId, newName);
        await tx.wait();

        alert("Successful");
        setnewName(" ");
        setNewId(" ");
      }
    }

    async function getMessage() {
      if (atm) {
        let tx = await atm.getName(id);
        const nm = `Name saved with the Id of ${id} is ${tx}`;

        setMessage(nm);
      }
    }
    function handleMessageChange(e) {
      setnewName(e.target.value);
    }

    function handleNewIdChange(e) {
      setNewId(e.target.value);
    }
    function handleIdChange(e) {
      setId(e.target.value);
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <h3>
          <h2>Simple Storage</h2>
        </h3>
        <br />
        <input
          type="text"
          placeholder="Set id"
          value={newId}
          onChange={handleNewIdChange}
        />

        <input
          type="text"
          placeholder="Set Name"
          value={newName}
          onChange={handleMessageChange}
        />
        <br />
        <button onClick={setName}>Set Name</button>
        <br />
        <input
          type="text"
          placeholder="input id"
          value={id}
          onChange={handleIdChange}
        />
        <button onClick={getMessage}>Get Message</button>
        <h2>{message}</h2>
        <br />
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx global>{`
        body {
          padding: 0;
          margin: 0;
          min-height: 100vh;
          display: flex;
          width: 100%;
          text-align: center;
          justify-content: center;
          align-items: center;
          background-color: skyblue;
          color: white;
        }
        button {
          background-color: blue;
          padding: 1em 2em;
          border-radius: 10px;
          border: 0;
          margin: 1em;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }
        input {
          padding: 0.5em;
          margin: 0.5em;
          border-radius: 5px;
          border: 1px solid #ccc;
          color: black;
        }
      `}</style>
    </main>
  );
}
