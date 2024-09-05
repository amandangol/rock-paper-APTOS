import React from 'react';
import ReactDOM from 'react-dom';
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import App from './App';
import "./styles/global.css";

const wallets = [new PetraWallet()];

ReactDOM.render(
  <React.StrictMode>
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <App />
    </AptosWalletAdapterProvider>
  </React.StrictMode>,
  document.getElementById('root')
);