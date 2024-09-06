import styled from 'styled-components';
import { Layout, Card, Badge, Button, Tabs, Table, Modal, Row } from 'antd';
import { motion } from 'framer-motion';


const { Header, Content } = Layout;

export const GameWrapper = styled(Layout)`
  min-height: 100vh;
  background: radial-gradient(circle, var(--primary-color, #5c2e91), var(--secondary-color, #0d0040));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('https://nypost.com/wp-content/uploads/sites/2/2014/06/rock-paper.jpg?quality=75&strip=all&w=744') no-repeat center center fixed;
    background-size: cover;
    opacity: 0.3;
    z-index: -1;
  }
`;

export const StyledHeader = styled(Header)`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(to right, #ffffff, #f0f0f0);
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  .logo-container {
    display: flex;
    align-items: center;
    gap: 16px;

    img {
      height: 40px;
      width: auto;
    }
  }

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
    padding-left: 16px;
    border-left: 2px solid #6366F1;
    line-height: 1.2;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }

  .wallet-container {
    display: flex;
    align-items: center;
  }
`;

export const GameContent = styled(Content)`
  padding: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 900px;
  width: 100%;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(1px);
  position: relative;
  z-index: 1;
`;

export const StyledFooter = styled.footer`
  width: 100%;
  background-color: #f8f9fa;
  padding: 20px;
  text-align: center;
  color: #333;
  font-size: 1rem;
  border-top: 1px solid #e0e0e0;

  p {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    color: #555; /* Slightly muted color for the text */
    
    strong {
      color: #000; /* Emphasize the creator's name */
    }
  }

  @media (max-width: 768px) {
    font-size: 0.875rem; /* Slightly smaller text on mobile */
  }
`;


export const GamePlayArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

export const MoveButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 15px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  }

  svg {
    width: 60px;
    height: 60px;
    color: white;
  }
`;

export const StatsRow = styled(Row)`
  margin-top: 30px;
`;

export const EnhancedStatCard = styled(Card)<{ progress: number }>`
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  margin: 0 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 300px;
  height: 180px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  .ant-statistic-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .ant-statistic-content {
    font-size: 24px;
    font-weight: bold;
    color: #1890ff;
  }
`;

export const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-top: 10px;

  &::after {
    content: "";
    display: block;
    width: ${(props) => props.progress}%;
    height: 100%;
    background: #1890ff;
    border-radius: 4px;
  }
`;

export const GameTabs = styled(Tabs)`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  
  .ant-tabs-nav {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 15px 15px 0 0;
    padding: 10px 10px 0;
  }

  .ant-tabs-content-holder {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 0 0 15px 15px;
    padding: 20px;
  }
`;

export const StyledTable = styled(Table)`
  .ant-table-tbody > tr:nth-child(odd) > td {
    background: rgba(240, 240, 240, 0.5);
  }
  
  .ant-table-tbody > tr:nth-child(even) > td {
    background: rgba(255, 255, 255, 0.5);
  }
  
  .ant-table-thead > tr > th {
    background: rgba(118, 75, 162, 0.9);
    color: white;
    text-align: center;
  }
`;

export const AchievementCard = styled(Card)`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  margin-top: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
`;

export const AchievementBadge = styled(Badge)`
  .ant-badge-count {
    background-color: #52c41a;
    color: #fff;
    box-shadow: 0 0 0 2px #fff;
  }
`;

export const RewardButton = styled(Button)`
  background-color: #ffd700;
  border-color: #ffd700;
  color: #000;
  font-weight: bold;
  &:hover {
    background-color: #ffed4a;
    border-color: #ffed4a;
  }
`;

export const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  color: #e0e0e0;
  text-align: center;
  padding: 60px 20px;
  border-radius: 25px;

  h1 {
    font-size: 3.5rem;
    margin-bottom: 30px;
    font-weight: 800;
    color: #ffcc00;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.6);
    letter-spacing: 2px;
  }

  p {
    font-size: 1.8rem;
    line-height: 1.8;
    max-width: 700px;
    margin: 0 auto 30px;
    color: #cccccc;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
    letter-spacing: 1px;
  }

  button {
    font-size: 1.2rem;
    padding: 12px 24px;
    background: #ffcc00;
    color: #0d0040;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 204, 0, 0.3);

    &:hover {
      background: #ffd700;
      box-shadow: 0 6px 20px rgba(255, 204, 0, 0.5);
      transform: translateY(-2px);
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }

    p {
      font-size: 1.2rem;
    }

    button {
      font-size: 1rem;
      padding: 10px 20px;
    }
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const CustomModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .ant-modal-header {
    border-bottom: none;
    padding: 15px;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 15px 15px 0 0;
  }

  .ant-modal-title {
    color: white;
    font-weight: bold;
  }

  .ant-modal-body {
    padding: 20px 40px;
  }

  .ant-modal-footer {
    border-top: none;
    display: flex;
    justify-content: center;
    padding: 10px;
  }

  button {
    background: #764ba2;
    border: none;
    color: white;
    border-radius: 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      background: #667eea;
    }
  }
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;

  h3 {
    font-size: 28px;
    color: #764ba2;
  }

  p {
    font-size: 18px;
    color: #333;
    margin: 10px 0;
  }
`;

export const ResultEmoji = styled.div`
  font-size: 50px;
  margin: 20px 0;
`;