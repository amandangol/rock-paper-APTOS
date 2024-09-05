import React from 'react';
import { CustomModal, ModalContent, ResultEmoji } from '../styles/StyledComponents';

interface ResultModalProps {
  isVisible: boolean;
  onClose: () => void;
  result: {
    playerMove: string;
    aiMove: string;
    result: string;
  } | null;
}

const ResultModal: React.FC<ResultModalProps> = ({ isVisible, onClose, result }) => (
  <CustomModal
    visible={isVisible}
    onCancel={onClose}
    footer={null}
    maskClosable={false}
  >
    <ModalContent>
      <ResultEmoji>{result?.result === "You Win! 🎉" ? "🎉" : result?.result === "AI Wins 🤖" ? "🤖" : "🤝"}</ResultEmoji>
      <h3>{result?.result}</h3>
      <p>Your Move: {result?.playerMove}</p>
      <p>AI's Move: {result?.aiMove}</p>
    </ModalContent>
    <button onClick={onClose}>Close</button>
  </CustomModal>
);

export default ResultModal;