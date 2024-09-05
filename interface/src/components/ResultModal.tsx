import React from 'react';
import { Modal } from 'antd';
import styled, { keyframes } from 'styled-components';

interface ResultModalProps {
  isVisible: boolean;
  onClose: () => void;
  result: {
    playerMove: string;
    aiMove: string;
    result: string;
  } | null;
}

const ArcadeModal = styled(Modal)`
  .ant-modal-content {
    background-color: #000;
    border: 4px solid #30a7d7;
    border-radius: 10px;
    box-shadow: 0 0 10px #30a7d7, 0 0 20px #30a7d7;
  }
`;

const ArcadeScreen = styled.div`
  background-color: #000;
  color: #fff;
  font-family: 'Press Start 2P', cursive;
  padding: 20px;
  text-align: center;
`;

const ResultDisplay = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
`;

const blinkAnimation = keyframes`
  to {
    visibility: hidden;
  }
`;

const BlinkText = styled.div`
  animation: ${blinkAnimation} 1s steps(5, start) infinite;
`;

const MoveDisplay = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
`;

const ArcadeButton = styled.button`
  background-color: #ff0000;
  border: none;
  color: #fff;
  cursor: pointer;
  font-family: 'Press Start 2P', cursive;
  font-size: 18px;
  padding: 10px 20px;
  text-transform: uppercase;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ff3333;
    box-shadow: 0 0 10px #ff3333;
  }
`;
;

const ResultModal: React.FC<ResultModalProps> = ({ isVisible, onClose, result }) => (
  <ArcadeModal
    visible={isVisible}
    onCancel={onClose}
    footer={null}
    width={400}
    centered
    closable={false}
  >
    <ArcadeScreen>
      <ResultDisplay>
        <BlinkText>
          {result?.result === "You Win! 🎉" ? "VICTORY!" : 
           result?.result === "AI Wins 🤖" ? "GAME OVER" : "DRAW"}
        </BlinkText>
      </ResultDisplay>
      <MoveDisplay>
        <div>PLAYER: {(result?.playerMove || '')} </div>
        <div>AI: {(result?.aiMove || '')} </div>
      </MoveDisplay>
      <ResultDisplay>{result?.result}</ResultDisplay>
      <ArcadeButton onClick={onClose}>CONTINUE?</ArcadeButton>
    </ArcadeScreen>
  </ArcadeModal>
);

export default ResultModal;