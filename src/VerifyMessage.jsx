import React, { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import { ed25519 } from '@noble/curves/ed25519';

export function VerifyMessage() {
    const [message, setMessage] = useState('');
    const [publicKeyString, setPublicKeyString] = useState('');
    const [signature, setSignature] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    
    async function handleVerifyMessage() {
        try {
            // Clear previous results
            setVerificationResult(null);
            if (!message || !publicKeyString || !signature) {
                throw new Error('Please fill in all fields');
            }
            const messageBytes = new TextEncoder().encode(message);
            const signatureBytes = bs58.decode(signature);
            let publicKeyBytes;
            try {
                const publicKey = new PublicKey(publicKeyString);
                publicKeyBytes = publicKey.toBytes();
            } catch (error) {
                throw new Error('Invalid public key format');
            }
            const isValid = ed25519.verify(signatureBytes, messageBytes, publicKeyBytes);
            
            setVerificationResult({
                success: true,
                isValid,
                message: isValid 
                    ? 'Signature is valid! This message was signed by the provided wallet.'
                    : 'Signature is invalid! This message was NOT signed by the provided wallet or has been altered.'
            });
        } catch (error) {
            console.error('Verification error:', error);
            setVerificationResult({
                success: false,
                isValid: false,
                message: `Error: ${error.message}`
            });
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label htmlFor="verify-message" className="text-sm text-gray-300">Message</label>
                <input 
                    id="verify-message" 
                    type="text" 
                    placeholder="Original message that was signed" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
            </div>
            
            <div className="flex flex-col gap-2">
                <label htmlFor="public-key" className="text-sm text-gray-300">Public Key</label>
                <input 
                    id="public-key" 
                    type="text" 
                    placeholder="Wallet public key (e.g., 3Dj7...5xyz)" 
                    value={publicKeyString}
                    onChange={(e) => setPublicKeyString(e.target.value)}
                    className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm"
                />
            </div>
            
            <div className="flex flex-col gap-2">
                <label htmlFor="signature" className="text-sm text-gray-300">Signature</label>
                <input 
                    id="signature" 
                    type="text" 
                    placeholder="Base58 encoded signature" 
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm"
                />
            </div>
            
            <button 
                onClick={handleVerifyMessage}
                disabled={!message || !publicKeyString || !signature}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 text-white font-medium py-2 px-4 rounded-lg mt-2"
            >
                Verify Signature
            </button>
            
            {verificationResult && (
                <div className={`mt-4 p-4 rounded-lg ${
                    !verificationResult.success ? 'bg-red-900/30 border border-red-700' : 
                    verificationResult.isValid ? 'bg-green-900/30 border border-green-700' :
                    'bg-red-900/30 border border-red-700'
                }`}>
                    <h3 className="text-lg font-medium mb-2">
                        {!verificationResult.success ? 'Error' : 
                         verificationResult.isValid ? 'Verification Successful' : 
                         'Verification Failed'}
                    </h3>
                    <div className="text-sm">
                        {verificationResult.message}
                    </div>
                </div>
            )}
        </div>
    );
}