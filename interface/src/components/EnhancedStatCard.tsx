import React from 'react';
import styled from 'styled-components';
import { Row, Col, Typography, Tooltip } from 'antd';
import { motion } from 'framer-motion';

const { Title } = Typography;

// Enhanced StatCard Component
const StatCardWrapper = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  height: 170px;
  width: 150px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-align: center;
  color: #fff;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
  }
`;

const StatTitle = styled(Title)`
  color: #fff !important;
  font-size: 1.2rem !important;
  margin-bottom: 10px !important;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ProgressBarWrapper = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  height: 10px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background: linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%);
  transition: width 0.5s ease-out;
`;

interface EnhancedStatCardProps {
  title: string;
  value: number;
  total: number;
}

const EnhancedStatCard: React.FC<EnhancedStatCardProps> = ({ title, value, total }) => {
  const progress = total > 0 ? (value / total) * 100 : 0;

  return (
    <StatCardWrapper
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <StatTitle level={4}>{title}</StatTitle>
      <StatValue>{value}</StatValue>
      <Tooltip title={`${progress.toFixed(2)}%`}>
        <ProgressBarWrapper>
          <ProgressBarFill progress={progress} />
        </ProgressBarWrapper>
      </Tooltip>
    </StatCardWrapper>
  );
};


export { EnhancedStatCard };