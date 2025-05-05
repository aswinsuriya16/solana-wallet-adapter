import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect ,useRef } from "react";

export function NavbarBalance() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  const checkBalance = async () => {
    if (!wallet.publicKey) {
      setBalance(null);
      return;
    }

    try {
      setIsLoading(true);
      const balanceInLamports = await connection.getBalance(wallet.publicKey);
      setBalance(balanceInLamports / 1e9);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
      setBalance(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowBalance = () => {
    if (!showPopup) {
      checkBalance();
    }
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.toString().substring(0, 4)}...${address.toString().substring(address.toString().length - 4)}`;
  };

  if (!wallet.publicKey) {
    return null; 
  }

  return (
    <div className="relative">
      <button 
        onClick={handleShowBalance}
        className="bg-gray-900 hover:bg-gray-800 rounded-lg px-3 py-2 border border-gray-700 flex items-center transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <span className="text-sm">Show Balance</span>
      </button>
      
      {showPopup && (
        <div 
          ref={popupRef} 
          className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-700 bg-gray-900">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">Connected Account</div>
              <div className="text-xs bg-gray-700 px-2 py-1 rounded-full text-cyan-400">Devnet</div>
            </div>
            <div className="font-medium text-sm mt-1">{formatAddress(wallet.publicKey)}</div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-400">Balance</div>
              {isLoading && (
                <svg className="animate-spin h-4 w-4 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                {balance !== null ? `${balance.toFixed(4)} SOL` : "---"}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {balance !== null ? `≈ $${(balance * 150).toFixed(2)} USD` : ""}
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gray-900 border-t border-gray-700">
            <button 
              onClick={checkBalance}
              className="text-xs w-full py-2 bg-gray-700 hover:bg-gray-600 rounded text-center transition-colors duration-200"
            >
              Refresh Balance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
