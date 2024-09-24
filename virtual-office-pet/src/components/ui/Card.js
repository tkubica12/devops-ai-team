import React from 'react';
import styled from '@emotion/styled';

const StyledCard = styled.div`
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 16px;
`;

export const Card = ({ children, className }) => (
  <StyledCard className={className}>{children}</StyledCard>
);

export const CardHeader = ({ children }) => <div className="mb-4">{children}</div>;
export const CardTitle = ({ children }) => <h2 className="text-xl font-bold">{children}</h2>;
export const CardContent = ({ children }) => <div>{children}</div>;
