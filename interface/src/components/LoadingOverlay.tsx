import React from 'react';
import { Spin } from 'antd';
import { LoadingOverlay as StyledLoadingOverlay } from '../styles/StyledComponents';

const LoadingOverlay: React.FC = () => (
  <StyledLoadingOverlay>
    <Spin size="large" />
  </StyledLoadingOverlay>
);

export default LoadingOverlay;
