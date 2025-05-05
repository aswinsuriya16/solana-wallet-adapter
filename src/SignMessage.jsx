import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import React, { useState } from 'react';

export function SignMessage() {
    const { publicKey, signMessage } = useWallet();
    const [message, setMessage] = useState('');
    const [signature, setSignature] = useState('');
    const [status, setStatus] = useState('');
    const [copied, setCopied] = useState(false);
    
    async function handleSignMessage() {
        if (!publicKey) {
            setStatus('error');
            setSignature('Wallet not connected!');
            return;
        }
        if (!signMessage) {
            setStatus('error');
            setSignature('Wallet does not support message signing!');
            return;
        }
        
        try {
            setStatus('processing');
            setSignature('');
            setCopied(false);
            
            const encodedMessage = new TextEncoder().encode(message);
            const signatureBytes = await signMessage(encodedMessage);
            const signatureBase58 = bs58.encode(signatureBytes);
            
            setSignature(signatureBase58);
            setStatus('success');
        } catch (error) {
            console.error('Error signing message:', error);
            setStatus('error');
            setSignature(error.message);
        }
    };
    
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(signature);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <label htmlFor="message" className="text-sm text-gray-300">Enter a message to sign</label>
                    {publicKey && (
                        <div className="text-xs text-gray-400">
                            Signing as: <span className="font-mono">{publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}</span>
                        </div>
                    )}
                </div>
                <input 
                    id="message" 
                    type="text" 
                    placeholder="Message to sign" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
            </div>
            
            <button 
                onClick={handleSignMessage}
                disabled={!publicKey || !message}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300 text-white font-medium py-2 px-4 rounded-lg"
            >
                {status === 'processing' ? 'Signing...' : 'Sign Message'}
            </button>
            
            {status && (
                <div className={`mt-4 p-4 rounded-lg ${
                    status === 'error' ? 'bg-red-900/30 border border-red-700' : 
                    status === 'success' ? 'bg-green-900/30 border border-green-700' :
                    'bg-gray-800 border border-gray-700'
                }`}>
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium mb-2">
                            {status === 'error' ? 'Error' : 
                             status === 'success' ? 'Signature' : 
                             'Processing...'}
                        </h3>
                        
                        {status === 'success' && (
                            <button 
                                onClick={copyToClipboard}
                                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 px-2 rounded transition-colors"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        )}
                    </div>
                    
                    {signature && (
                        <div className="break-all font-mono text-sm">
                            {signature}
                        </div>
                    )}
                    
                    {status === 'success' && (
                        <div className="mt-4 text-xs text-gray-400">
                            <p>This signature proves that you own this wallet. It can be verified using:</p>
                            <ul className="list-disc ml-5 mt-1 space-y-1">
                                <li>The message: <span className="font-mono">{message}</span></li>
                                <li>Your public key: <span className="font-mono">{publicKey.toString()}</span></li>
                                <li>The signature shown above</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};