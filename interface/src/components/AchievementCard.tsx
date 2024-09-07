import React from 'react';
import styled from 'styled-components';
import {Spin } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Achievement } from '../types/types';
import { AchievementDescription, AchievementTitle, ClaimedText, RewardAmount, StyledButton, StyledCard } from '../styles/StyledComponents';

interface AchievementCardProps {
  achievement: Achievement | null;
  claimReward: (achievementId: number) => void;
  isLoading: boolean;
  claimedRewards: number[];
  getRewardAmount: (achievementId: number) => number;
}

const IconWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
`;

const StyledLockOutlined = styled(LockOutlined)`
  color: #f5222d;
`;

const StyledUnlockOutlined = styled(CheckCircleOutlined)`
  color: #52c41a;
`;

const StyledCheckCircleOutlined = styled(CheckCircleOutlined)`
  color: #1890ff;
`;

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  claimReward,
  isLoading,
  claimedRewards,
  getRewardAmount
}) => {
  if (!achievement) {
    return null;
  }

  const isClaimed = claimedRewards.includes(achievement.id);
  const rewardAmountInOctas = getRewardAmount(achievement.id);
  const rewardAmountInAPT = (rewardAmountInOctas / 100000000).toFixed(2);

  const renderIcon = () => {
    if (isClaimed) {
      return <StyledCheckCircleOutlined />;
    } else if (achievement.unlocked) {
      return <StyledUnlockOutlined />;
    } else {
      return <StyledLockOutlined />;
    }
  };

  return (
    <StyledCard>
      <IconWrapper>
        {renderIcon()}
      </IconWrapper>
      <AchievementTitle>{achievement.name}</AchievementTitle>
      <AchievementDescription>{achievement.description}</AchievementDescription>
      <RewardAmount>Reward: {rewardAmountInAPT} APT</RewardAmount>
      {achievement.unlocked && !isClaimed && (
        <StyledButton
          onClick={() => claimReward(achievement.id)}
          disabled={isLoading}
        >
          {isLoading ? <Spin /> : `Claim Reward (${rewardAmountInAPT} APT)`}
        </StyledButton>
      )}
      {isClaimed && (
        <ClaimedText>Reward Claimed!</ClaimedText>
      )}
    </StyledCard>
  );
};

export default AchievementCard;
