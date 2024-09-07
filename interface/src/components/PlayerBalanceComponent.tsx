import React from 'react';
import { Card, Typography } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text } = Typography;

interface PlayerBalanceProps {
  playerBalance: number | null;
}

const StyledCard = styled(Card)`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 160px;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
`;

const IconWrapper = styled.div`
  margin-right: 12px;
`;

const StyledWalletOutlined = styled(WalletOutlined)`
  font-size: 24px;
  color: white;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const BalanceLabel = styled(Text)`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
`;

const BalanceText = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  color: #4ade80;
`;

const PlayerBalanceComponent: React.FC<PlayerBalanceProps> = ({ playerBalance }) => {
  return (
    <div style={{ position: 'fixed', top: '70px', right: '16px', zIndex: 100 }}>
      <StyledCard bodyStyle={{ padding: 0 }}>
        <CardContent>
          <IconWrapper>
            <StyledWalletOutlined />
          </IconWrapper>
          <TextWrapper>
            <BalanceLabel>Your Balance</BalanceLabel>
            <BalanceText>
              {playerBalance !== null ? `${playerBalance.toFixed(2)} APT` : 'Loading...'}
            </BalanceText>
          </TextWrapper>
        </CardContent>
      </StyledCard>
    </div>
  );
};


export default PlayerBalanceComponent;