import React from 'react';
import { css } from '@emotion/react';

const Header = ({ title }) => {
  return (
    <header css={headerStyles}>
      <h1 css={titleStyles}>{title}</h1>
    </header>
  );
};

// 스타일
const headerStyles = css`
  background-color: #0052CC;
  color: white;
  padding: 16px 24px;
  display: flex;
  align-items: center;
`;

const titleStyles = css`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
`;

export default Header; 