import React from 'react';
import { Row, Col } from 'antd';
import {EnhancedStatCard} from './EnhancedStatCard';
import styled from 'styled-components';
import { GameState } from '../types/types';

interface StatsRowProps {
  gameState: GameState;
}

const StyledStatsRow = styled(Row)`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const StatsRow: React.FC<StatsRowProps> = ({ gameState }) => (
  <StyledStatsRow gutter={16} justify="center">
    <Col xs={24} sm={8}>
      <EnhancedStatCard title="Your Wins" value={gameState.player_wins} total={gameState.games_played} />
    </Col>
    <Col xs={24} sm={8}>
      <EnhancedStatCard title="AI Wins" value={gameState.ai_wins} total={gameState.games_played} />
    </Col>
    <Col xs={24} sm={8}>
      <EnhancedStatCard title="Draws" value={gameState.draws} total={gameState.games_played} />
    </Col>
  </StyledStatsRow>
);

export default StatsRow;