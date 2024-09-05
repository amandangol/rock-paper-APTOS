import React from 'react';
import { GameContent as StyledGameCard } from '../styles/StyledComponents';

interface GameCardProps {
  children: React.ReactNode;
}

const GameCard: React.FC<GameCardProps> = ({ children }) => {
  return <StyledGameCard>{children}</StyledGameCard>;
};

export default GameCard;