import React from 'react';
import { Row, Col, Typography } from 'antd';
import { GamePlayArea as StyledGamePlayArea, MoveButton } from '../styles/StyledComponents';
import { MOVES, MOVE_NAMES } from '../constants/gameConstants';
import { styled } from 'styled-components';
import { motion } from 'framer-motion';

const { Title } = Typography;

interface GamePlayAreaProps {
  playMove: (moveIndex: number) => void;
  isLoading: boolean;
}

// Enhanced GamePlayArea Component
const GamePlayAreaWrapper = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: 30px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  margin-bottom: 10px;
  margin-top: 20px;
`;

const GameTitle = styled(Title)`
  color: #fff !important;
  text-align: center;
  margin-bottom: 30px !important;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const MoveButtonWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const MoveIcon = styled.span`
  font-size: 3rem;
`;

const MoveName = styled.span`
  font-size: 1rem;
  margin-top: 10px;
  color: #fff;
`;

interface GamePlayAreaProps {
  playMove: (moveIndex: number) => void;
  isLoading: boolean;
}

const GamePlayArea: React.FC<GamePlayAreaProps> = ({ playMove, isLoading }) => {
  const moves = [
    { icon: '🪨', name: 'Rock' },
    { icon: '📰', name: 'Paper' },
    { icon: '✂️', name: 'Scissors' }
  ];

  return (
    <GamePlayAreaWrapper
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GameTitle level={2}>Choose Your Move</GameTitle>
      <Row gutter={[24, 24]} justify="center">
        {moves.map((move, index) => (
          <Col key={index}>
            <MoveButtonWrapper
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => playMove(index)}
              style={{ opacity: isLoading ? 0.5 : 1 }}
            >
              <div style={{ alignItems: 'center',display: 'flex',flexDirection: 'column' }}>
                <MoveIcon>{move.icon}</MoveIcon>
                <MoveName>{move.name}</MoveName>
              </div>
             
            </MoveButtonWrapper>
          </Col>
        ))}
      </Row>
    </GamePlayAreaWrapper>
  );
};

export {  GamePlayArea };