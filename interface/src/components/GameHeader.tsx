import React from 'react';
import { Typography } from 'antd';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { StyledHeader as StyledGameHeader } from '../styles/StyledComponents';

const { Title } = Typography;

const GameHeader: React.FC = () => (
  <StyledGameHeader>
    <Title level={3} style={{ margin: 0, color: '#ffffff' }}>Rock Paper Scissors</Title>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <WalletSelector />
    </div>
  </StyledGameHeader>
);

export default GameHeader;