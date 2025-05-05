import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";

export function SendTokens() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [txSuccess, setTxSuccess] = useState(false);

  // Validate Solana address format
  const isValidSolanaAddress = (address) => {
    try {
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Validate amount is a positive number
  const isValidAmount = (value) => {
    const numberValue = parseFloat(value);
    return !isNaN(numberValue) && numberValue > 0;
  };

  const sendTokens = async () => {
    setError("");
    setTxSuccess(false);
    
    // Input validation
    if (!publicKey) {
      setError("Please connect your wallet first");
      return;
    }
    
    if (!isValidSolanaAddress(recipientAddress)) {
      setError("Please enter a valid Solana address");
      return;
    }
    
    if (!isValidAmount(amount)) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setIsLoading(true);
      
      // Create a new transaction
      const transaction = new Transaction();
      
      // Add the transfer instruction to the transaction
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipientAddress),
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, "confirmed");
      
      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }
      
      // Success
      setTxSuccess(true);
      setRecipientAddress("");
      setAmount("");
    } catch (err) {
      console.error("Transaction error:", err);
      setError(err.message || "Failed to send SOL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="send-tokens-container">
      {/* Form fields */}
      <div className="form-group">
        <label htmlFor="recipient-address" className="form-label">Recipient Address</label>
        <input
          id="recipient-address"
          type="text"
          className="form-input"
          placeholder="Enter Solana address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="sol-amount" className="form-label">Amount (SOL)</label>
        <input
          id="sol-amount"
          type="text"
          className="form-input"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
          min="0"
          step="0.01"
        />
      </div>
      
      {/* Error message */}
      {error && (
        <div className="error-message">
          <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {/* Success message */}
      {txSuccess && (
        <div className="success-message">
          <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Successfully sent {amount} SOL to {recipientAddress.substring(0, 4)}...{recipientAddress.substring(recipientAddress.length - 4)}</span>
        </div>
      )}
      
      {/* Send button */}
      <button 
        className="action-button primary-button"
        onClick={sendTokens}
        disabled={isLoading || !publicKey}
      >
        {isLoading ? (
          <span className="loading-spinner">
            <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <>
            <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            Send SOL
          </>
        )}
      </button>
    </div>
  );
}