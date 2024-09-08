import React from 'react';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { StyledHeader } from '../styles/StyledComponents';
import Rpslogo from '../assets/rpslogo.png';

const GameHeader: React.FC = () => (
  <StyledHeader>
    <div className="logo-container">
      <img src={Rpslogo} alt="Rock Paper Scissors Logo" />
     
    </div>
    <div className="wallet-container">
      <WalletSelector />
    </div>
  </StyledHeader>
);

export default GameHeader;