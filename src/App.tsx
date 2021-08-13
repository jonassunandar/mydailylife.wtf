import { ethers } from "ethers";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import MetaMaskOnboarding from "@metamask/onboarding";

const ONBOARD_TEXT = "Click here to install MetaMask!";
const CONNECT_TEXT = "Connect";
const CONNECTED_TEXT = "Connected";

declare let window: any;

export function App() {
  const [buttonText, setButtonText] = useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [recepeint, setRecepeint] = useState<string>("");
  const onboarding = React.useRef<MetaMaskOnboarding>();

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
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
          setAccounts(newAccounts);
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
      if (accounts.length > 0) {
        window.ethereum
          .request({
            method: "eth_sendTransaction",
            params: [
              {
                from: accounts[0],
                to: "0xe2e204F97dED289d11aEb03b45Aa817432A613C7",
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
          {accounts.length === 0 && <p>Please connect to MetaMask</p>}
          {accounts.length !== 0 && <p>Your Accounts: {accounts}</p>}
          <button
            disabled={isDisabled}
            onClick={onClick}
            className="px-3 py-2 text-white bg-black rounded"
          >
            {buttonText}
          </button>
        </div>

        {accounts.length !== 0 && (
          <div className="flex space-x-4">
            <input
              type="text"
              className="px-3 py-2 border rounded"
              placeholder="recepeint address"
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
