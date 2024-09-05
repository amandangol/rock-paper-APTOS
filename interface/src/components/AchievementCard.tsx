import React from 'react';
import { Card, Spin } from 'antd';
import { Achievement } from '../types/types';
import { AchievementBadge, RewardButton } from '../styles/StyledComponents';

interface AchievementCardProps {
  achievement: Achievement | null;
  claimedRewards: number[];
  claimReward: (achievementId: number) => void;
  isLoading: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, claimedRewards, claimReward, isLoading }) => {
  if (!achievement) {
    return <Spin />;
  }

  console.log("Rendering achievement:", achievement);

  return (
    <AchievementBadge count={achievement.unlocked ? '✓' : 0}>
      <Card
        title={achievement.name}
        extra={achievement.unlocked ? '🏆' : '🔒'}
        style={{ opacity: achievement.unlocked ? 1 : 0.6 }}
      >
        <p>{achievement.description}</p>
        {achievement.unlocked && !claimedRewards.includes(achievement.id) && (
          <RewardButton onClick={() => claimReward(achievement.id)} disabled={isLoading}>
            Claim Reward
          </RewardButton>
        )}
        {claimedRewards.includes(achievement.id) && (
          <p style={{ color: 'green' }}>Reward Claimed!</p>
        )}
      </Card>
    </AchievementBadge>
  );
};

export default AchievementCard;