import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import MetaMaskOnboarding from "@metamask/onboarding";

const ONBOARD_TEXT = "Click here to install MetaMask!";
const CONNECT_TEXT = "Connect";
const CONNECTED_TEXT = "Connected";

declare let window: any;

export function App() {
  const [buttonText, setButtonText] = useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = useState(false);
  const [accounts, setAccounts] = useState<string>("");
  const [recepeint, setRecepeint] = useState<string>("");
  const onboarding = React.useRef<MetaMaskOnboarding>();

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum.on("accountsChanged", (accounts: string) => {
        toast.success("Address changed");
        setAccounts(accounts);
      });
    }
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts) {
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        onboarding.current?.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((newAccounts: string[]) => {
          setAccounts(newAccounts[0]);
          toast.success(`Connected: ${newAccounts[0].substring(0, 10)}...`);
        });
    } else {
      onboarding.current?.startOnboarding();
    }
  };

  const handleSendTransaction = () => {
    let value = ethers.utils.parseEther("0.01")._hex;
    console.log(value);

    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts) {
        window.ethereum
          .request({
            method: "eth_sendTransaction",
            params: [
              {
                from: accounts,
                to: recepeint,
                value: value,
              },
            ],
          })
          .then((txHash: any) => {
            console.log(txHash);
            toast.success(`Success: ${txHash}`);
          })
          .catch((error: any) => {
            console.error;
            toast.error(`Error: ${error.message}`);
          });
      } else {
        toast.error("Please connect your account to MetaMask");
      }
    }
  };

  return (
    <>
      <div className="p-8 space-y-12">
        <div className="flex flex-col space-y-4">
          {!accounts && <p>Please connect to MetaMask</p>}
          {accounts && <p>Your Accounts: {accounts}</p>}
          <button
            disabled={isDisabled}
            onClick={onClick}
            className="px-3 py-2 text-white bg-black rounded"
          >
            {buttonText}
          </button>
        </div>

        {accounts && (
          <div className="flex space-x-4">
            <input
              type="text"
              className="px-3 py-2 border rounded"
              placeholder="recepeint address"
              onChange={(e) => {
                setRecepeint(e.target.value);
              }}
            />
            <button
              onClick={handleSendTransaction}
              className="px-3 py-2 text-gray-500 border rounded-md shadow-sm hover:text-gray-700 hover:border-gray-300"
            >
              Send 0.01 ETH
            </button>
          </div>
        )}
      </div>
      <Toaster />
    </>
  );
}

export default App;
