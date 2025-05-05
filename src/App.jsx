import React, { useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { AirDrop } from './AirDrop';
import { SignMessage } from './SignMessage';
import { VerifyMessage } from './VerifyMessage';
import { NavbarBalance } from './NavBarBalance';

import './App.css';
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  const wallets = useMemo(() => [
    new UnsafeBurnerWalletAdapter(),
  ], []);
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('overview');

  const navigateTo = (view) => {
    setActiveView(view);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app-container">
      <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className="dashboard-layout">
              {/* Header/Navbar */}
              <header className="app-header">
                <div className="header-container">
                  <div className="logo-section">
                    <button 
                      onClick={() => setSidebarOpen(!isSidebarOpen)}
                      className="mobile-menu-button md:hidden"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                      </svg>
                    </button>
                    <h1 className="app-title" onClick={() => navigateTo('overview')}>
                      Solana Wallet Adapter
                    </h1>
                  </div>
                  <div className="header-actions">
                    <NavbarBalance />
                    <div className="wallet-button-wrapper">
                      <WalletMultiButton className="wallet-multi-button" />
                    </div>
                    <div className="wallet-button-wrapper">
                      <WalletDisconnectButton className="wallet-disconnect-button" />
                    </div>
                  </div>
                </div>
              </header>

              {/* Main Container with Sidebar and Content */}
              <div className="main-container">
                {/* Sidebar */}
                <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                  <div className="sidebar-content">
                    <nav className="sidebar-nav">
                      <div className="sidebar-header">Dashboard</div>
                      
                      <button 
                        onClick={() => navigateTo('overview')}
                        className={`nav-button ${activeView === 'overview' ? 'nav-button-active' : 'nav-button-inactive'}`}
                      >
                        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        Overview
                      </button>
                      
                      <button 
                        onClick={() => navigateTo('airdrop')}
                        className={`nav-button ${activeView === 'airdrop' ? 'nav-button-active' : 'nav-button-inactive'}`}
                      >
                        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Airdrop SOL
                      </button>
                      
                      <button 
                        onClick={() => navigateTo('sign-verify')}
                        className={`nav-button ${activeView === 'sign-verify' ? 'nav-button-active' : 'nav-button-inactive'}`}
                      >
                        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                        Sign & Verify
                      </button>
                    </nav>
                  </div>
                </aside>

                {/* Main Content Area */}
                <main className="main-content">
                  {/* Overview View */}
                  {activeView === 'overview' && (
                    <div className="content-container">
                      <div className="content-section">
                        <h2 className="section-header">
                          Hey there !
                        </h2>
                        <div className="card">
                          <p className="text-lg mb-4">
                          This dashboard offers essential tools to interact with the Solana blockchain in a development environment.
                          </p>
                          <div className="feature-grid">
                            {/* Airdrop Card */}
                            <div 
                              className="feature-card"
                              onClick={() => navigateTo('airdrop')}
                            >
                              <div className="feature-icon-container">
                                <div className="icon-bg">
                                  <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                  </svg>
                                </div>
                                <h3 className="feature-title">Airdrop SOL</h3>
                              </div>
                              <p className="feature-text">
                                Request SOL tokens to your wallet for testing and development on the Solana devnet.
                              </p>
                              <div className="feature-link">
                                <span className="feature-link-text">
                                  Open
                                  <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                  </svg>
                                </span>
                              </div>
                            </div>
                            
                            {/* Sign & Verify Card */}

                            <div 
                              className="feature-card"
                              onClick={() => navigateTo('sign-verify')}
                            >
                              <div className="feature-icon-container">
                                <div className="icon-bg">
                                  <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                  </svg>
                                </div>
                                <h3 className="feature-title">Sign & Verify</h3>
                              </div>
                              <p className="feature-text">
                              Digitally sign a message using your wallet to securely verify ownership.
                              </p>
                              <div className="feature-link">
                                <span className="feature-link-text">
                                  Open
                                  <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* AirDrop View */}
                  {activeView === 'airdrop' && (
                    <div className="feature-container">
                      <div className="back-nav">
                        <button 
                          onClick={() => navigateTo('overview')}
                          className="back-button"
                        >
                          <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                          </svg>
                        </button>
                        <h2 className="page-title">
                          Airdrop SOL
                        </h2>
                      </div>
                      
                      <div className="card">
                        <p className="feature-description">
                          Request SOL tokens to be sent to your connected wallet.
                        </p>
                        
                        <div className="feature-component-container">
                          <AirDrop />
                        </div>
                        
                      </div>
                    </div>
                  )}
                  
                  {/* Sign & Verify View */}
                  {activeView === 'sign-verify' && (
                    <div className="feature-container">
                      <div className="back-nav">
                        <button 
                          onClick={() => navigateTo('overview')}
                          className="back-button"
                        >
                          <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                          </svg>
                        </button>
                        <h2 className="page-title">
                          Sign & Verify Messages
                        </h2>
                      </div>
                      
                      <div className="feature-spaces">
                        {/* Sign Message Component */}
                        <div className="card">
                          <div className="feature-header">
                            <svg className="feature-header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                            <h3 className="feature-header-title">Sign Message</h3>
                          </div>
                          <p className="feature-description">
                            Create a cryptographic signature for any message using your connected wallet's keypair.
                            This proves ownership of your wallet without revealing your private key.
                          </p>
                          <div className="feature-component-container">
                            <SignMessage />
                          </div>
                        </div>
                        
                        {/* Verify Message Component */}
                        <div className="card">
                          <div className="feature-header">
                            <svg className="feature-header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                            <h3 className="feature-header-title">Verify Signature</h3>
                          </div>
                          <p className="feature-description">
                            By Verifying the Signature we can confirm the authenticity of signed messsages.
                          </p>
                          <div className="feature-component-container">
                            <VerifyMessage />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </main>
              </div>
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}

export default App;