import React from 'react';
import { css } from '@emotion/react';

const Header = ({ title }) => {
  // PDF 생성 핸들러
  const handleGeneratePdf = () => {
    window.parent.postMessage({ action: 'generatePdf' }, '*');
  };

  return (
    <header css={headerStyles}>
      <div css={titleStyles}>{title}</div>
      <button css={generateButtonStyles} onClick={handleGeneratePdf}>
        PDF 생성
      </button>
    </header>
  );
};

// 스타일
const headerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0052CC;
  color: white;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const titleStyles = css`
  font-size: 18px;
  font-weight: 500;
`;

const generateButtonStyles = css`
  background-color: white;
  color: #0052CC;
  border: none;
  border-radius: 3px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f4f5f7;
  }
`;

export default Header; 