import React from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useGameLogic } from './hooks/useGameLogic';
import GameHeader from './components/GameHeader';
import GameFooter from './components/GameFooter';
import HeroSection from './components/HeroSection';
import {GamePlayArea} from './components/GamePlayArea';
import {EnhancedStatCard} from './components/EnhancedStatCard';
import GameHistory from './components/GameHistory';
import AchievementCard from './components/AchievementCard';
import ResultModal from './components/ResultModal';
import LoadingOverlay from './components/LoadingOverlay';
import { GameWrapper, GameContent, StatsRow, GameTabs } from './styles/StyledComponents';
import { Alert, Col, Row, Spin } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';

const App: React.FC = () => {
  const { connected } = useWallet();
  const {
    gameState,
    history,
    achievements,
    isModalVisible,
    lastResult,
    isLoading,
    isGameInitialized,
    claimedRewards,
    handleInitializeGame,
    handlePlayMove,
    handleClaimReward,
    setIsModalVisible,
    getGameHistory,
    isAchievementsLoading
  } = useGameLogic();

  return (
    <GameWrapper>
      <GameHeader />
      <GameContent>
        {isLoading && <LoadingOverlay />}
        {connected ? (
          <>
            {!isGameInitialized || !gameState ? (
              <HeroSection
                isConnected={connected}
                initializeGame={handleInitializeGame}
                isLoading={isLoading}
              />
            ) : (
              <>
                <GamePlayArea playMove={handlePlayMove} isLoading={isLoading} />
                {gameState && (
                  <StatsRow gutter={16} justify="center">
                    <Col span={8}>
                      <EnhancedStatCard title="Your Wins" value={gameState.player_wins} total={gameState.games_played} />
                    </Col>
                    <Col span={8}>
                      <EnhancedStatCard title="AI Wins" value={gameState.ai_wins} total={gameState.games_played} />
                    </Col>
                    <Col span={8}>
                      <EnhancedStatCard title="Draws" value={gameState.draws} total={gameState.games_played} />
                    </Col>
                  </StatsRow>
                )}
               <GameTabs defaultActiveKey="1">
        <TabPane tab="Game History" key="1">
          <GameHistory history={history} getGameHistory={getGameHistory} />
        </TabPane>
        <TabPane tab="Achievements" key="2">
          {isAchievementsLoading ? (
            <Spin tip="Loading achievements..." />
          ) : achievements.length > 0 ? (
            <Row gutter={[16, 16]}>
              {achievements.map((achievement) => (
                <Col key={achievement.id} span={8}>
                  <AchievementCard
                    achievement={achievement}
                    claimedRewards={claimedRewards}
                    claimReward={handleClaimReward}
                    isLoading={isLoading}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Alert
              message="No achievements found"
              description="Play your first game to earn achievements!"
              type="warning"
            />
          )}
        </TabPane>
      </GameTabs>
                <ResultModal
                  isVisible={isModalVisible}
                  onClose={() => setIsModalVisible(false)}
                  result={lastResult}
                />
              </>
            )}
          </>
        ) : (
          <HeroSection
            isConnected={connected}
            initializeGame={handleInitializeGame}
            isLoading={isLoading}
          />
        )}
      </GameContent>
      <GameFooter />
    </GameWrapper>
  );
};

export default App;