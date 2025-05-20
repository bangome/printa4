import React, { useRef, useEffect, useState } from 'react';
import { css } from '@emotion/react';

// A4 크기 상수 (mm)
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// DPI (dots per inch)
const DPI = 96;

// mm를 px로 변환 (96 DPI 기준)
const MM_TO_PX = DPI / 25.4;

const PdfPreview = ({ title, content, settings }) => {
  const contentRef = useRef(null);
  const [styleProcessor, setStyleProcessor] = useState(null);

  // styleProcessor 모듈 지연 로딩
  useEffect(() => {
    const loadStyleProcessor = async () => {
      const module = await import('../services/styleProcessor');
      setStyleProcessor(module);
    };
    
    loadStyleProcessor();
  }, []);

  // 컨텐츠가 변경되면 스타일 적용
  useEffect(() => {
    if (contentRef.current && content && styleProcessor) {
      // 내용 초기화
      contentRef.current.innerHTML = '';
      
      // 제목 추가
      const titleElement = document.createElement('h1');
      titleElement.textContent = title;
      titleElement.style.fontSize = `${settings.fontSize.title}px`;
      titleElement.style.fontFamily = settings.fontFamily;
      titleElement.style.marginBottom = '20px';
      contentRef.current.appendChild(titleElement);
      
      // 본문 콘텐츠 추가 및 스타일 적용
      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = content;
      
      // 스타일 적용
      styleProcessor.applyStyles(contentDiv, settings);
      
      contentRef.current.appendChild(contentDiv);
    }
  }, [title, content, settings, styleProcessor]);

  return (
    <div css={previewContainerStyles}>
      <div css={paperStyles(settings)}>
        {/* 헤더 */}
        {settings.header.show && (
          <div css={headerStyles(settings)}>
            {settings.header.text}
          </div>
        )}
        
        {/* 콘텐츠 영역 */}
        <div css={contentAreaStyles(settings)} ref={contentRef}></div>
        
        {/* 푸터 */}
        {settings.footer.show && (
          <div css={footerStyles(settings)}>
            {settings.footer.text}
            {settings.footer.showPageNumber && (
              <span css={pageNumberStyles}>1</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 스타일
const previewContainerStyles = css`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const paperStyles = (settings) => css`
  width: ${A4_WIDTH_MM * MM_TO_PX}px;
  height: ${A4_HEIGHT_MM * MM_TO_PX}px;
  background-color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  font-family: ${settings.fontFamily};
`;

const contentAreaStyles = (settings) => css`
  position: absolute;
  top: ${settings.header.show ? '40px' : '0'};
  left: 0;
  right: 0;
  bottom: ${settings.footer.show ? '40px' : '0'};
  padding: ${settings.margin.top}px ${settings.margin.right}px ${settings.margin.bottom}px ${settings.margin.left}px;
  overflow: auto;
  font-size: ${settings.fontSize.body}px;
  
  h1 {
    font-size: ${settings.fontSize.heading1}px;
  }
  
  h2 {
    font-size: ${settings.fontSize.heading2}px;
  }
`;

const headerStyles = (settings) => css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  padding: 10px ${settings.margin.right}px;
  text-align: ${settings.header.align};
  border-bottom: 1px solid #eee;
  font-size: 10px;
  color: #666;
`;

const footerStyles = (settings) => css`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  padding: 10px ${settings.margin.right}px;
  text-align: ${settings.footer.align};
  border-top: 1px solid #eee;
  font-size: 10px;
  color: #666;
`;

const pageNumberStyles = css`
  position: absolute;
  right: 10px;
  bottom: 10px;
`;

export default PdfPreview; 