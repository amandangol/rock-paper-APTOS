import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Achievement } from '../types/types';
import { AchievementDescription, AchievementTitle, ClaimedText, RewardAmount, StyledButton, StyledCard } from '../styles/StyledComponents';

interface AchievementCardProps {
  achievement: Achievement;
  claimReward: (achievementId: number) => Promise<void>;
  isLoading: boolean;
  claimedRewards: number[];
  getRewardAmount: (achievementId: number) => number;
  claimingReward: number | null;
  onClaimStatusChange: (achievementId: number, claimed: boolean) => void;
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
  getRewardAmount,
  claimingReward,
  onClaimStatusChange
}) => {
  const [isClaimed, setIsClaimed] = useState(claimedRewards.includes(achievement.id));

  useEffect(() => {
    setIsClaimed(claimedRewards.includes(achievement.id));
  }, [claimedRewards, achievement.id]);

  const rewardAmountInOctas = getRewardAmount(achievement.id);
  const rewardAmountInAPT = (rewardAmountInOctas / 100000000).toFixed(2);

  const handleClaimReward = async () => {
    try {
      await claimReward(achievement.id);
      setIsClaimed(true);
      onClaimStatusChange(achievement.id, true);
      console.log(`Achievement ${achievement.id} claimed successfully`);
    } catch (error) {
      console.error(`Error claiming achievement ${achievement.id}:`, error);
    }
  };

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
      <IconWrapper>{renderIcon()}</IconWrapper>
      <AchievementTitle>{achievement.name}</AchievementTitle>
      <AchievementDescription>{achievement.description}</AchievementDescription>
      <RewardAmount>Reward: {rewardAmountInAPT} APT</RewardAmount>
      {isClaimed ? (
        <ClaimedText>Reward Claimed!</ClaimedText>
      ) : (
        achievement.unlocked && (
          <StyledButton
            onClick={handleClaimReward}
            disabled={isLoading || claimingReward === achievement.id}
          >
            {claimingReward === achievement.id ? <Spin /> : `Claim Reward (${rewardAmountInAPT} APT)`}
          </StyledButton>
        )
      )}
    </StyledCard>
  );
};

export default AchievementCard;