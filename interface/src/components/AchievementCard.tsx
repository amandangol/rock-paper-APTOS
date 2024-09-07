import React from 'react';
import { Card, Spin } from 'antd';
import { Achievement } from '../types/types';
import { AchievementBadge, RewardButton } from '../styles/StyledComponents';

interface AchievementCardProps {
  achievement: Achievement | null;
  claimReward: (achievementId: number) => void;
  isLoading: boolean;
  claimedRewards: number[];
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, claimReward, isLoading, claimedRewards }) => {
  if (!achievement) {
    return <Spin />;
  }

  const isClaimed = claimedRewards.includes(achievement.id);

  return (
    <AchievementBadge count={achievement.unlocked ? '✓' : 0}>
      <Card
        title={achievement.name}
        extra={achievement.unlocked ? '🏆' : '🔒'}
        style={{ opacity: achievement.unlocked ? 1 : 0.6 }}
      >
        <p>{achievement.description}</p>
        {achievement.unlocked && !isClaimed && (
          <RewardButton onClick={() => claimReward(achievement.id)} disabled={isLoading}>
            Claim Reward
          </RewardButton>
        )}
        {isClaimed && (
          <p style={{ color: 'green' }}>Reward Claimed!</p>
        )}
      </Card>
    </AchievementBadge>
  );
};

export default AchievementCard;