'use client'

import { MproAbi } from "@/utils/MproAbi";
import { ethers } from "ethers";
import Image from "next/image";
import { useState } from "react";
import { etherUnits } from "viem";
import { useAccount, useBalance, useWriteContract } from "wagmi";

const contractAddressMpro = "0x83b37130b8f6a8edd4e34c46a2fed1ac281bfb05"; // Token contract
const contractAddressUSDT = "0x55d398326f99059fF775485246999027B3197955"; // Token contract
const contractABIMpro = MproAbi();


export default function Home() {
  const { isConnected, address } = useAccount()
  const { data: usdtBalance, isLoading, error } = useBalance({
    address: address,
    token: '0x55d398326f99059fF775485246999027B3197955',
  })

  const { data: mproBalance } = useBalance({
    address: address,
    token: '0x83b37130b8f6a8edd4e34c46a2fed1ac281bfb05',
  })

  console.log(isConnected);


  //transfer
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { writeContract, isPending: isWriteLoading, isSuccess, error:isWriteError } = useWriteContract();

  const handleSubmitMpro = (e:any) => {
    e.preventDefault();
    setErrorMessage("");
    if (isNaN(parseFloat(amount)) || amount.trim() === "") {
      return setErrorMessage("Please enter a valid number");
    }
    writeContract({
      address: contractAddressMpro,
      abi: contractABIMpro,
      functionName: "transfer",
      args: [
        recipient,
        ethers.parseUnits(
          amount.toString() == "" ? "0" : amount.toString(),
          18
        ),
      ],
      chainId: 56, // BSC chainId
    });
  };

  const handleSubmitUSDT = (e:any) => {
    //set error
    e.preventDefault();
    setErrorMessage("");
    if (isNaN(parseFloat(amount)) || amount.trim() === "") {
      return setErrorMessage("Please enter a valid number");
    }

    writeContract({
      address: contractAddressUSDT,
      abi: contractABIMpro,
      functionName: "transfer",
      args: [
        recipient,
        ethers.parseUnits(
          amount.toString() == "" ? "0" : amount.toString(),
          18
        ),
      ],
      chainId: 56, // BSC chainId
    });
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>AppKit Example App</h1>
      <p>Powered by WalletConnect</p>
      <w3m-button />
      {isConnected &&
        <>
          <p>Connected to {address}</p>
          {isLoading ? <p>Loading...</p> : <p>{usdtBalance?.formatted} {usdtBalance?.symbol}</p>}
          {isLoading ? <p>Loading...</p> : <p>{mproBalance?.formatted} {mproBalance?.symbol}</p>}
          <br></br>
          <form className="max-w-sm mx-auto">
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          To Address
        </label>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="0x..."
          required
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Amount
        </label>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="11"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value ?? 0)}
        />
      </div>
      <div className="flex flex-row w-full">
        <button
          type="submit"
          disabled={isLoading}
          onClick={handleSubmitMpro}
          className="text-white m-1  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Send Mpro
        </button>
        <button
          type="submit"
          disabled={isLoading}
          onClick={handleSubmitUSDT}
          className="text-white m-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Send USDT
        </button>
      </div>
      {isSuccess && <p>Transaction successful! Hash: </p>}
      {error && <p>Error: {error.message}</p>}
      {errorMessage && <p>Error: {errorMessage}</p>}
    </form>
        </>}
    </main>
  );
}
