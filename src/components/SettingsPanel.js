import React from 'react';
import { css } from '@emotion/react';
import pdfGenerator from '../services/pdfGenerator';

const SettingsPanel = ({ settings, onSettingsChange }) => {
  // 폰트 크기 변경 핸들러
  const handleFontSizeChange = (type, value) => {
    onSettingsChange({
      fontSize: {
        ...settings.fontSize,
        [type]: parseInt(value)
      }
    });
  };

  // 여백 변경 핸들러
  const handleMarginChange = (side, value) => {
    onSettingsChange({
      margin: {
        ...settings.margin,
        [side]: parseInt(value)
      }
    });
  };

  // 폰트 패밀리 변경 핸들러
  const handleFontFamilyChange = (e) => {
    onSettingsChange({
      fontFamily: e.target.value
    });
  };

  // 헤더 설정 변경 핸들러
  const handleHeaderChange = (property, value) => {
    onSettingsChange({
      header: {
        ...settings.header,
        [property]: value
      }
    });
  };

  // 푸터 설정 변경 핸들러
  const handleFooterChange = (property, value) => {
    onSettingsChange({
      footer: {
        ...settings.footer,
        [property]: value
      }
    });
  };

  // PDF 생성 핸들러
  const handleGeneratePdf = async () => {
    try {
      // 현재 페이지 제목과 내용 가져오기
      const title = document.querySelector('h1')?.textContent || 'Confluence 문서';
      const content = document.querySelector('.pdf-preview-content')?.innerHTML || '';
      
      // PDF 생성 서비스 직접 호출
      await pdfGenerator.generatePdf(title, content, settings);
    } catch (error) {
      console.error('PDF 생성 중 오류 발생:', error);
      alert('PDF 생성에 실패했습니다.');
    }
  };

  return (
    <div css={panelStyles}>
      <h2 css={sectionTitleStyles}>PDF 설정</h2>
      
      <section css={sectionStyles}>
        <h3 css={subSectionTitleStyles}>여백 (px)</h3>
        <div css={gridStyles}>
          <div>
            <label css={labelStyles} htmlFor="margin-top">상단</label>
            <input
              id="margin-top"
              type="number"
              value={settings.margin.top}
              min="0"
              max="100"
              onChange={(e) => handleMarginChange('top', e.target.value)}
              css={inputStyles}
            />
          </div>
          <div>
            <label css={labelStyles} htmlFor="margin-right">우측</label>
            <input
              id="margin-right"
              type="number"
              value={settings.margin.right}
              min="0"
              max="100"
              onChange={(e) => handleMarginChange('right', e.target.value)}
              css={inputStyles}
            />
          </div>
          <div>
            <label css={labelStyles} htmlFor="margin-bottom">하단</label>
            <input
              id="margin-bottom"
              type="number"
              value={settings.margin.bottom}
              min="0"
              max="100"
              onChange={(e) => handleMarginChange('bottom', e.target.value)}
              css={inputStyles}
            />
          </div>
          <div>
            <label css={labelStyles} htmlFor="margin-left">좌측</label>
            <input
              id="margin-left"
              type="number"
              value={settings.margin.left}
              min="0"
              max="100"
              onChange={(e) => handleMarginChange('left', e.target.value)}
              css={inputStyles}
            />
          </div>
        </div>
      </section>
      
      <section css={sectionStyles}>
        <h3 css={subSectionTitleStyles}>글꼴</h3>
        <div>
          <label css={labelStyles} htmlFor="font-family">글꼴 패밀리</label>
          <select
            id="font-family"
            value={settings.fontFamily}
            onChange={handleFontFamilyChange}
            css={selectStyles}
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Helvetica">Helvetica</option>
            <option value="'Noto Sans KR', sans-serif">Noto Sans KR</option>
          </select>
        </div>
      </section>
      
      <section css={sectionStyles}>
        <h3 css={subSectionTitleStyles}>글꼴 크기 (px)</h3>
        <div>
          <label css={labelStyles} htmlFor="font-title">제목</label>
          <input
            id="font-title"
            type="number"
            value={settings.fontSize.title}
            min="8"
            max="36"
            onChange={(e) => handleFontSizeChange('title', e.target.value)}
            css={inputStyles}
          />
        </div>
        <div>
          <label css={labelStyles} htmlFor="font-heading1">헤딩 1</label>
          <input
            id="font-heading1"
            type="number"
            value={settings.fontSize.heading1}
            min="8"
            max="30"
            onChange={(e) => handleFontSizeChange('heading1', e.target.value)}
            css={inputStyles}
          />
        </div>
        <div>
          <label css={labelStyles} htmlFor="font-heading2">헤딩 2</label>
          <input
            id="font-heading2"
            type="number"
            value={settings.fontSize.heading2}
            min="8"
            max="24"
            onChange={(e) => handleFontSizeChange('heading2', e.target.value)}
            css={inputStyles}
          />
        </div>
        <div>
          <label css={labelStyles} htmlFor="font-body">본문</label>
          <input
            id="font-body"
            type="number"
            value={settings.fontSize.body}
            min="8"
            max="18"
            onChange={(e) => handleFontSizeChange('body', e.target.value)}
            css={inputStyles}
          />
        </div>
      </section>
      
      <section css={sectionStyles}>
        <h3 css={subSectionTitleStyles}>헤더</h3>
        <div>
          <label css={checkboxLabelStyles}>
            <input
              type="checkbox"
              checked={settings.header.show}
              onChange={(e) => handleHeaderChange('show', e.target.checked)}
            />
            헤더 표시
          </label>
        </div>
        {settings.header.show && (
          <>
            <div>
              <label css={labelStyles} htmlFor="header-text">헤더 텍스트</label>
              <input
                id="header-text"
                type="text"
                value={settings.header.text}
                onChange={(e) => handleHeaderChange('text', e.target.value)}
                css={inputStyles}
              />
            </div>
            <div>
              <label css={labelStyles} htmlFor="header-align">정렬</label>
              <select
                id="header-align"
                value={settings.header.align}
                onChange={(e) => handleHeaderChange('align', e.target.value)}
                css={selectStyles}
              >
                <option value="left">왼쪽</option>
                <option value="center">가운데</option>
                <option value="right">오른쪽</option>
              </select>
            </div>
          </>
        )}
      </section>
      
      <section css={sectionStyles}>
        <h3 css={subSectionTitleStyles}>푸터</h3>
        <div>
          <label css={checkboxLabelStyles}>
            <input
              type="checkbox"
              checked={settings.footer.show}
              onChange={(e) => handleFooterChange('show', e.target.checked)}
            />
            푸터 표시
          </label>
        </div>
        {settings.footer.show && (
          <>
            <div>
              <label css={labelStyles} htmlFor="footer-text">푸터 텍스트</label>
              <input
                id="footer-text"
                type="text"
                value={settings.footer.text}
                onChange={(e) => handleFooterChange('text', e.target.value)}
                css={inputStyles}
              />
            </div>
            <div>
              <label css={checkboxLabelStyles}>
                <input
                  type="checkbox"
                  checked={settings.footer.showPageNumber}
                  onChange={(e) => handleFooterChange('showPageNumber', e.target.checked)}
                />
                페이지 번호 표시
              </label>
            </div>
            <div>
              <label css={labelStyles} htmlFor="footer-align">정렬</label>
              <select
                id="footer-align"
                value={settings.footer.align}
                onChange={(e) => handleFooterChange('align', e.target.value)}
                css={selectStyles}
              >
                <option value="left">왼쪽</option>
                <option value="center">가운데</option>
                <option value="right">오른쪽</option>
              </select>
            </div>
          </>
        )}
      </section>
      
      <button css={generatePdfButtonStyles} onClick={handleGeneratePdf}>
        PDF 생성
      </button>
    </div>
  );
};

// 스타일
const panelStyles = css`
  padding: 16px;
`;

const sectionStyles = css`
  margin-bottom: 24px;
`;

const sectionTitleStyles = css`
  font-size: 18px;
  margin-bottom: 16px;
  color: #172B4D;
`;

const subSectionTitleStyles = css`
  font-size: 14px;
  margin-bottom: 12px;
  color: #172B4D;
`;

const gridStyles = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const labelStyles = css`
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  color: #6B778C;
`;

const checkboxLabelStyles = css`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #172B4D;
`;

const inputStyles = css`
  width: 100%;
  padding: 8px;
  border: 1px solid #DFE1E6;
  border-radius: 3px;
  margin-bottom: 12px;
  
  &:focus {
    border-color: #4C9AFF;
    outline: none;
  }
`;

const selectStyles = css`
  width: 100%;
  padding: 8px;
  border: 1px solid #DFE1E6;
  border-radius: 3px;
  margin-bottom: 12px;
  background-color: white;
  
  &:focus {
    border-color: #4C9AFF;
    outline: none;
  }
`;

const generatePdfButtonStyles = css`
  background-color: #0052CC;
  color: white;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  width: 100%;
  margin-top: 16px;
  
  &:hover {
    background-color: #0065FF;
  }
`;

export default SettingsPanel; 