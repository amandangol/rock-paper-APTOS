import React, { useState } from 'react';
import { Modal, Steps, Button } from 'antd';

const { Step } = Steps;

interface GameGuideProps {
  isVisible: boolean;
  onClose: () => void;
}

const GameGuide: React.FC<GameGuideProps> = ({ isVisible, onClose }) => {
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: 'Welcome',
      content: 'Welcome to Rock Paper Scissors on Aptos! This guide will walk you through the game.',
    },
    {
      title: 'Connect Wallet',
      content: 'First, connect your Aptos wallet using the button in the top right corner.',
    },
    {
      title: 'Initialize Game',
      content: 'Once connected, initialize the game to start playing.',
    },
    {
      title: 'Make Your Move',
      content: 'Choose Rock, Paper, or Scissors to play against the AI.',
    },
    {
      title: 'Rewards',
      content: 'Win 0.02 APT for each victory, but be careful - you lose 0.01 APT for each defeat!',
    },
    {
      title: 'Achievements',
      content: 'Complete achievements to earn additional rewards. Check the Achievements tab to claim your prizes!',
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <Modal
      title="How to Play"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content" style={{ margin: '20px 0', minHeight: '200px' }}>
        {steps[current].content}
      </div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={onClose}>
            Got it!
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default GameGuide;