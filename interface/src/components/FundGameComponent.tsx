import React from 'react';
import { Card, Typography, Spin } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text } = Typography;

interface FundGameComponentProps {
  resourceBalance: number | null;
  fundAmount: string;
  setFundAmount: React.Dispatch<React.SetStateAction<string>>;
  handleFundGame: () => Promise<void>;
  isLoading: boolean;
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

const StyledMoneyCollectOutlined = styled(DollarOutlined)`
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

const StyledSpin = styled(Spin)`
  .ant-spin-dot-item {
    background-color: #4ade80;
  }
`;

const  FundGameComponent: React.FC<FundGameComponentProps> = ({
  resourceBalance,
  fundAmount,
  setFundAmount,
  handleFundGame,
  isLoading
}) => {
  return (
    <div style={{ position: 'fixed', top: '140px', right: '16px', zIndex: 100 }}>
      <StyledCard bodyStyle={{ padding: 0 }}>
        <CardContent>
          <IconWrapper>
            <StyledMoneyCollectOutlined />
          </IconWrapper>
          <TextWrapper>
            <BalanceLabel>Game Balance</BalanceLabel>
            {resourceBalance !== null ? (
              <BalanceText>{resourceBalance.toFixed(2)} APT</BalanceText>
            ) : (
              <StyledSpin size="small" />
            )}
          </TextWrapper>
        </CardContent>
      </StyledCard>
    </div>
  );
};

export default FundGameComponent;

// import React from 'react';
// import { Card, Typography, Spin, Input, Button } from 'antd';
// import { DollarOutlined } from '@ant-design/icons';
// import styled from 'styled-components';

// const { Text } = Typography;

// interface FundGameComponentProps {
//   resourceBalance: number | null;
//   fundAmount: string;
//   setFundAmount: React.Dispatch<React.SetStateAction<string>>;
//   handleFundGame: () => Promise<void>;
//   isLoading: boolean;
// }

// const StyledCard = styled(Card)`
//   background: rgba(255, 255, 255, 0.2);
//   border-radius: 8px;
//   box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
//   width: 200px;
// `;

// const CardContent = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 12px;
// `;

// const IconWrapper = styled.div`
//   margin-bottom: 8px;
// `;

// const StyledDollarOutlined = styled(DollarOutlined)`
//   font-size: 24px;
//   color: white;
// `;

// const TextWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin-bottom: 12px;
// `;

// const BalanceLabel = styled(Text)`
//   font-size: 12px;
//   color: rgba(255, 255, 255, 0.8);
// `;

// const BalanceText = styled(Text)`
//   font-size: 16px;
//   font-weight: bold;
//   color: #4ade80;
// `;

// const StyledInput = styled(Input)`
//   margin-bottom: 8px;
// `;

// const StyledButton = styled(Button)`
//   width: 100%;
// `;

// const StyledSpin = styled(Spin)`
//   .ant-spin-dot-item {
//     background-color: #4ade80;
//   }
// `;

// const FundGameComponent: React.FC<FundGameComponentProps> = ({
//   resourceBalance,
//   fundAmount,
//   setFundAmount,
//   handleFundGame,
//   isLoading
// }) => {
//   return (
//     <div style={{ position: 'fixed', top: '140px', right: '16px', zIndex: 100 }}>
//       <StyledCard bodyStyle={{ padding: 0 }}>
//         <CardContent>
//           <IconWrapper>
//             <StyledDollarOutlined />
//           </IconWrapper>
//           <TextWrapper>
//             <BalanceLabel>Game Balance</BalanceLabel>
//             {resourceBalance !== null ? (
//               <BalanceText>{resourceBalance.toFixed(2)} APT</BalanceText>
//             ) : (
//               <StyledSpin size="small" />
//             )}
//           </TextWrapper>
//           <StyledInput
//             placeholder="Amount to fund"
//             value={fundAmount}
//             onChange={(e) => setFundAmount(e.target.value)}
//             type="number"
//             min="0"
//             step="0.01"
//           />
//           <StyledButton 
//             onClick={handleFundGame} 
//             loading={isLoading}
//             disabled={isLoading || fundAmount === '' || parseFloat(fundAmount) <= 0}
//           >
//             Fund Game
//           </StyledButton>
//         </CardContent>
//       </StyledCard>
//     </div>
//   );
// };

// export default FundGameComponent;