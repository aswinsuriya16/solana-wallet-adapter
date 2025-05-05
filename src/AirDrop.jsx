import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export function AirDrop() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleAirdrop = async () => {
    if (!wallet.publicKey) {
      setMessage("Please connect your wallet first");
      setStatus("error");
      return;
    }

    const inputElement = document.getElementById('inputbox');
    const lamports = inputElement.value;
    
    if (!lamports || isNaN(Number(lamports)) || Number(lamports) <= 0) {
      setMessage("Please enter a valid amount");
      setStatus("error");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("Processing airdrop request...");
      setStatus("loading");
      
      const signature = await connection.requestAirdrop(
        wallet.publicKey,
        Number(lamports) * 1e9
      );
      
      setMessage(`Airdrop successful! ${lamports} SOL added to your wallet`);
      setStatus("success");
      inputElement.value = "";
    } catch (error) {
      console.error("Airdrop failed:", error);
      setMessage("Airdrop failed. Please try again.");
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Enter SOL amount"
          id="inputbox"
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
          min="0"
          step="0.1"
        />
        <div className="absolute right-3 top-3 text-gray-400">SOL</div>
      </div>
      
      <button
        onClick={handleAirdrop}
        disabled={isLoading || !wallet.publicKey}
        className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center
          ${isLoading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'}`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          "Request Airdrop"
        )}
      </button>
      
      {message && (
        <div className={`mt-2 p-3 rounded-lg ${
          status === "error" ? "bg-red-900/50 border border-red-700 text-red-200" : 
          status === "success" ? "bg-green-900/50 border border-green-700 text-green-200" :
          "bg-blue-900/50 border border-blue-700 text-blue-200"
        }`}>
          {message}
        </div>
      )}
      
      <div className="text-xs text-gray-400 mt-1">
        Note: Airdrops are limited on devnet and may occasionally fail due to rate limiting.
      </div>
    </div>
  );
}