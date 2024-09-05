import React from 'react';
import { HeroSection as StyledHeroSection } from '../styles/StyledComponents';

interface HeroSectionProps {
  isConnected: boolean;
  initializeGame: () => void;
  isLoading: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isConnected, initializeGame, isLoading }) => (
  <StyledHeroSection>
    <h1>Welcome to Rock Paper Scissors on Aptos</h1>
    <p>
      {isConnected
        ? "Get ready to challenge the AI in this classic game powered by Aptos blockchain."
        : "Dive into the world of blockchain with a classic game powered by Aptos!\nConnect your wallet to start playing."}
    </p>
    {isConnected && (
      <button onClick={initializeGame} disabled={isLoading}>
        Initialize Game
      </button>
    )}
  </StyledHeroSection>
);

export default HeroSection;