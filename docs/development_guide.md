# Confluence A4 PDF Export App 개발 가이드

## 목차
1. [개요](#개요)
2. [프로젝트 구조](#프로젝트-구조)
3. [개발 환경 설정](#개발-환경-설정)
4. [Atlassian Connect 프레임워크 설정](#atlassian-connect-프레임워크-설정)
5. [Confluence API 연동](#confluence-api-연동)
6. [React 기반 UI 구현](#react-기반-ui-구현)
7. [PDF 변환 및 A4 최적화](#pdf-변환-및-a4-최적화)
8. [스타일 조정 기능 구현](#스타일-조정-기능-구현)

## 개요

Confluence A4 PDF Export App은 Confluence 페이지를 A4 용지 크기에 최적화하여 PDF로 내보내는 기능을 제공합니다. 이 앱은 Atlassian Connect 프레임워크를 기반으로 개발되며, React와 jsPDF 라이브러리를 활용하여 구현됩니다.

### 주요 기능
- Confluence 페이지를 A4 용지 크기에 최적화하여 PDF로 내보내기
- 실시간 A4 미리보기 기능
- 여백, 타이틀 크기, 폰트, 헤더/푸터 등 PDF 출력 설정 조정 기능

## 프로젝트 구조

```
printa4/
├── atlassian-connect.json    # Atlassian Connect 앱 매니페스트
├── package.json              # 프로젝트 의존성 및 스크립트
├── public/                   # 정적 파일
│   ├── index.html            # 메인 HTML 파일
│   └── assets/               # 이미지, 아이콘 등의 에셋
├── src/                      # 소스 코드
│   ├── index.js              # 앱 진입점
│   ├── App.js                # 메인 앱 컴포넌트
│   ├── components/           # React 컴포넌트
│   │   ├── PdfPreview.js     # A4 미리보기 컴포넌트
│   │   ├── SettingsPanel.js  # PDF 설정 패널 컴포넌트
│   │   └── Header.js         # 앱 헤더 컴포넌트
│   ├── api/                  # API 관련 코드
│   │   └── confluence.js     # Confluence API 래퍼
│   ├── services/             # 비즈니스 로직
│   │   ├── pdfGenerator.js   # PDF 생성 서비스
│   │   └── styleProcessor.js # 스타일 처리 서비스
│   └── utils/                # 유틸리티 함수
│       ├── a4Utils.js        # A4 관련 유틸리티
│       └── styleUtils.js     # 스타일 유틸리티
├── routes/                   # Express 라우트
│   └── index.js              # 메인 라우트
└── server.js                 # Express 서버
```

## 개발 환경 설정

### 필요 도구
- Node.js (v14 이상)
- npm 또는 yarn
- Git

### 프로젝트 초기화

1. 프로젝트 디렉토리 생성 및 초기화:

```bash
mkdir printa4
cd printa4
npm init -y
```

2. 필요한 의존성 설치:

```bash
# 기본 의존성
npm install express body-parser cors atlassian-connect-express

# React 관련 의존성
npm install react react-dom react-router-dom @emotion/react

# PDF 관련 의존성
npm install jspdf html2canvas

# 개발 의존성
npm install --save-dev webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env @babel/preset-react css-loader style-loader
```

3. `package.json` 스크립트 설정:

```json
"scripts": {
  "start": "node server.js",
  "dev": "webpack-dev-server --mode development --open",
  "build": "webpack --mode production"
}
```

## Atlassian Connect 프레임워크 설정

### atlassian-connect.json 생성

Atlassian Connect 앱의 핵심은 매니페스트 파일인 `atlassian-connect.json`입니다. 다음과 같이 설정합니다:

```json
{
  "key": "printa4",
  "name": "A4 PDF Export for Confluence",
  "description": "Confluence 페이지를 A4 용지 크기에 최적화하여 PDF로 내보내는 앱",
  "vendor": {
    "name": "Your Company",
    "url": "https://example.com"
  },
  "baseUrl": "{{localBaseUrl}}",
  "authentication": {
    "type": "jwt"
  },
  "lifecycle": {
    "installed": "/installed"
  },
  "scopes": [
    "read",
    "write"
  ],
  "modules": {
    "generalPages": [
      {
        "key": "pdf-export-page",
        "location": "system.content.action",
        "name": {
          "value": "A4 PDF 내보내기"
        },
        "url": "/pdf-export?pageId={page.id}",
        "conditions": [
          {
            "condition": "content_type",
            "params": {
              "contentTypes": ["page"]
            }
          }
        ]
      }
    ],
    "webItems": [
      {
        "key": "pdf-export-button",
        "location": "confluence.page.tools",
        "name": {
          "value": "A4 PDF 내보내기"
        },
        "url": "/pdf-export?pageId={page.id}",
        "tooltip": {
          "value": "A4 용지 크기로 PDF 내보내기"
        }
      }
    ]
  }
}
```

### Express 서버 설정

`server.js` 파일을 생성하여 Express 서버를 설정합니다:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const ace = require('atlassian-connect-express');

// 앱 초기화
const app = express();
const addon = ace(app);

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Atlassian Connect Express 라우트 설정
app.use(addon.middleware());

// 앱 라우트
app.get('/', (req, res) => {
  res.redirect('/pdf-export');
});

// PDF 내보내기 페이지 라우트
app.get('/pdf-export', addon.authenticate(), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 설치 라우트
app.post('/installed', (req, res) => {
  console.log('App installed!');
  res.status(204).send();
});

// API 라우트
const apiRoutes = require('./routes');
app.use('/api', addon.authenticate(), apiRoutes);

// 서버 시작
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
``` 

## PDF 변환 및 A4 최적화

### PDF 생성 서비스

`src/services/pdfGenerator.js` 파일을 생성하여 PDF 생성 서비스를 구현합니다:

```javascript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { applyStyles } from './styleProcessor';

// A4 크기 상수 (mm)
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// A4 크기 (pt, jsPDF 기본 단위)
const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;

/**
 * PDF 생성 서비스
 */
class PdfGenerator {
  /**
   * HTML 콘텐츠를 A4 PDF로 변환
   * @param {string} title - 문서 제목
   * @param {string} htmlContent - HTML 콘텐츠
   * @param {Object} settings - PDF 설정
   * @returns {Promise<Blob>} - PDF Blob
   */
  async generatePdf(title, htmlContent, settings) {
    // HTML 요소 생성
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = `${A4_WIDTH_PT}px`;
    container.style.fontFamily = settings.fontFamily;
    document.body.appendChild(container);
    
    try {
      // 제목 추가
      const titleElement = document.createElement('h1');
      titleElement.textContent = title;
      titleElement.style.fontSize = `${settings.fontSize.title}px`;
      titleElement.style.fontFamily = settings.fontFamily;
      titleElement.style.marginBottom = '20px';
      container.appendChild(titleElement);
      
      // 본문 콘텐츠 추가
      const contentElement = document.createElement('div');
      contentElement.innerHTML = htmlContent;
      
      // 스타일 적용
      applyStyles(contentElement, settings);
      container.appendChild(contentElement);
      
      // 콘텐츠 높이를 기준으로 페이지 분할
      const contentHeight = container.offsetHeight;
      const contentWidth = container.offsetWidth;
      
      // 여백을 고려한 jsPDF 설정 (mm 단위)
      const marginLeft = settings.margin.left * 0.352778; // px to mm
      const marginTop = settings.margin.top * 0.352778;
      const marginRight = settings.margin.right * 0.352778;
      const marginBottom = settings.margin.bottom * 0.352778;
      
      // 사용 가능한 콘텐츠 영역 (mm)
      const availableWidth = A4_WIDTH_MM - marginLeft - marginRight;
      const availableHeight = A4_HEIGHT_MM - marginTop - marginBottom;
      const headerHeight = settings.header.show ? 15 : 0;
      const footerHeight = settings.footer.show ? 15 : 0;
      const actualAvailableHeight = availableHeight - headerHeight - footerHeight;

      // PDF 생성
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // HTML을 캔버스로 변환
      const canvas = await html2canvas(container, {
        scale: 2, // 고해상도를 위한 스케일 조정
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY
      });
      
      // 캔버스를 이미지로 변환
      const imgData = canvas.toDataURL('image/png');
      
      // 총 페이지 수 계산
      const totalPages = Math.ceil(contentHeight / (actualAvailableHeight * 2.83)); // mm to px
      
      // 각 페이지에 이미지 추가
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        // 컨텐츠 영역 계산
        const sourceY = i * (actualAvailableHeight * 2.83);
        const sourceHeight = Math.min(actualAvailableHeight * 2.83, contentHeight - sourceY);
        
        // 이미지 추가
        pdf.addImage(
          imgData,
          'PNG',
          marginLeft,
          marginTop + headerHeight,
          availableWidth,
          (sourceHeight / contentHeight) * availableWidth * (contentHeight / contentWidth),
          '',
          'FAST'
        );
        
        // 헤더 추가
        if (settings.header.show) {
          pdf.setFont(settings.fontFamily);
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          
          const headerText = settings.header.text;
          const headerWidth = pdf.getStringUnitWidth(headerText) * 9 / pdf.internal.scaleFactor;
          let headerX = marginLeft;
          
          if (settings.header.align === 'center') {
            headerX = marginLeft + (availableWidth - headerWidth) / 2;
          } else if (settings.header.align === 'right') {
            headerX = A4_WIDTH_MM - marginRight - headerWidth;
          }
          
          pdf.text(headerText, headerX, marginTop + 7);
          pdf.line(marginLeft, marginTop + 10, A4_WIDTH_MM - marginRight, marginTop + 10);
        }
        
        // 푸터 추가
        if (settings.footer.show) {
          pdf.setFont(settings.fontFamily);
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          
          const footerText = settings.footer.text;
          const footerWidth = pdf.getStringUnitWidth(footerText) * 9 / pdf.internal.scaleFactor;
          let footerX = marginLeft;
          
          if (settings.footer.align === 'center') {
            footerX = marginLeft + (availableWidth - footerWidth) / 2;
          } else if (settings.footer.align === 'right') {
            footerX = A4_WIDTH_MM - marginRight - footerWidth;
          }
          
          pdf.text(footerText, footerX, A4_HEIGHT_MM - marginBottom - 7);
          
          // 페이지 번호 추가
          if (settings.footer.showPageNumber) {
            const pageNumberText = `${i + 1} / ${totalPages}`;
            pdf.text(pageNumberText, A4_WIDTH_MM - marginRight - 20, A4_HEIGHT_MM - marginBottom - 7);
          }
          
          pdf.line(marginLeft, A4_HEIGHT_MM - marginBottom - 10, A4_WIDTH_MM - marginRight, A4_HEIGHT_MM - marginBottom - 10);
        }
      }
      
      // PDF 파일명 설정
      const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_A4.pdf`;
      
      // PDF 다운로드
      pdf.save(fileName);
      
      return pdf.output('blob');
    } finally {
      // 임시 요소 제거
      document.body.removeChild(container);
    }
  }
}

export default new PdfGenerator();
```

### PDF 변환 이벤트 처리

`src/index.js` 파일을 생성하여 PDF 변환 이벤트 처리를 구현합니다:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import pdfGenerator from './services/pdfGenerator';
import confluenceApi from './api/confluence';

// 앱 렌더링
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// 메시지 이벤트 리스너 등록
window.addEventListener('message', async (event) => {
  // 메시지가 generatePdf 액션인 경우
  if (event.data && event.data.action === 'generatePdf') {
    try {
      // URL에서 페이지 ID 파라미터 가져오기
      const params = new URLSearchParams(window.location.search);
      const pageId = params.get('pageId');
      
      if (!pageId) {
        throw new Error('페이지 ID가 제공되지 않았습니다.');
      }
      
      // 페이지 데이터 가져오기
      const pageData = await confluenceApi.getPageContent(pageId);
      const htmlContent = await confluenceApi.getPageHtmlContent(pageId);
      
      // PDF 생성
      await pdfGenerator.generatePdf(
        pageData.title,
        htmlContent,
        event.data.settings
      );
      
      // 성공 메시지 전송
      window.parent.postMessage({ 
        action: 'pdfGenerated',
        success: true
      }, '*');
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      
      // 오류 메시지 전송
      window.parent.postMessage({
        action: 'pdfGenerated',
        success: false,
        error: error.message
      }, '*');
    }
  }
});
```

## 스타일 조정 기능 구현

### 스타일 처리 서비스

`src/services/styleProcessor.js` 파일을 생성하여 스타일 처리 서비스를 구현합니다:

```javascript
/**
 * HTML 요소에 스타일 적용
 * @param {HTMLElement} element - 스타일을 적용할 HTML 요소
 * @param {Object} settings - 스타일 설정
 */
export const applyStyles = (element, settings) => {
  if (!element) return;
  
  // 기본 스타일 설정
  element.style.fontFamily = settings.fontFamily;
  element.style.fontSize = `${settings.fontSize.body}px`;
  
  // 제목 스타일 설정
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    switch (heading.tagName.toLowerCase()) {
      case 'h1':
        heading.style.fontSize = `${settings.fontSize.heading1}px`;
        break;
      case 'h2':
        heading.style.fontSize = `${settings.fontSize.heading2}px`;
        break;
      case 'h3':
        heading.style.fontSize = `${settings.fontSize.heading2 - 2}px`;
        break;
      case 'h4':
      case 'h5':
      case 'h6':
        heading.style.fontSize = `${settings.fontSize.body + 2}px`;
        break;
    }
    heading.style.fontFamily = settings.fontFamily;
  });
  
  // 이미지 너비 제한
  const images = element.querySelectorAll('img');
  images.forEach(img => {
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
  });
  
  // 테이블 스타일 설정
  const tables = element.querySelectorAll('table');
  tables.forEach(table => {
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '16px';
    
    const cells = table.querySelectorAll('th, td');
    cells.forEach(cell => {
      cell.style.border = '1px solid #DFE1E6';
      cell.style.padding = '8px';
    });
    
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(cell => {
      cell.style.backgroundColor = '#F4F5F7';
      cell.style.fontWeight = 'bold';
    });
  });
  
  // 리스트 스타일 설정
  const lists = element.querySelectorAll('ul, ol');
  lists.forEach(list => {
    list.style.paddingLeft = '24px';
    list.style.marginBottom = '16px';
  });
  
  // 링크 스타일 설정
  const links = element.querySelectorAll('a');
  links.forEach(link => {
    link.style.color = '#0052CC';
    link.style.textDecoration = 'none';
  });
  
  // 코드 블록 스타일 설정
  const codeBlocks = element.querySelectorAll('pre, code');
  codeBlocks.forEach(block => {
    block.style.fontFamily = 'monospace';
    block.style.backgroundColor = '#F4F5F7';
    block.style.padding = '8px';
    block.style.borderRadius = '3px';
    block.style.whiteSpace = 'pre-wrap';
    block.style.overflowX = 'auto';
  });
  
  // 콘텐츠 맥락 유지 스타일 설정
  element.style.pageBreakInside = 'avoid';
  element.style.breakInside = 'avoid';
  
  // 여백 없는 요소 조정
  element.querySelectorAll('p').forEach(p => {
    p.style.marginTop = '0';
    p.style.marginBottom = '16px';
  });
  
  return element;
};

/**
 * Confluence 마크업을 A4에 최적화된 HTML로 변환
 * @param {string} htmlContent - Confluence HTML 콘텐츠
 * @returns {string} - 최적화된 HTML
 */
export const optimizeForA4 = (htmlContent) => {
  // 임시 컨테이너 생성
  const container = document.createElement('div');
  container.innerHTML = htmlContent;
  
  // 메타 태그, 스크립트 제거
  container.querySelectorAll('script, style, meta').forEach(el => el.remove());
  
  // Confluence 특정 스타일 제거
  container.querySelectorAll('[class^="confluence-"]').forEach(el => {
    el.removeAttribute('class');
  });
  
  // 불필요한 속성 제거
  container.querySelectorAll('*').forEach(el => {
    el.removeAttribute('data-*');
    el.removeAttribute('id');
  });
  
  // 페이지 나누기를 위한 클래스 적용
  container.querySelectorAll('h1, h2').forEach(heading => {
    heading.style.pageBreakBefore = 'always';
    heading.style.breakBefore = 'page';
  });
  
  // 이미지 주변에 페이지 나누기 방지
  container.querySelectorAll('img').forEach(img => {
    const wrapper = document.createElement('div');
    wrapper.style.pageBreakInside = 'avoid';
    wrapper.style.breakInside = 'avoid';
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
  });
  
  // 테이블 주변에 페이지 나누기 방지
  container.querySelectorAll('table').forEach(table => {
    table.style.pageBreakInside = 'avoid';
    table.style.breakInside = 'avoid';
  });
  
  return container.innerHTML;
};

/**
 * A4 페이지에 맞게 콘텐츠 분할
 * @param {HTMLElement} container - 콘텐츠 컨테이너
 * @param {number} pageHeight - 페이지 높이 (px)
 * @returns {Array<HTMLElement>} - 페이지별로 분할된 요소 배열
 */
export const splitContentIntoPages = (container, pageHeight) => {
  const pages = [];
  let currentPage = document.createElement('div');
  let currentHeight = 0;
  
  // 각 자식 요소를 순회하며 페이지 나누기
  Array.from(container.childNodes).forEach(node => {
    const clone = node.cloneNode(true);
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(clone);
    document.body.appendChild(tempDiv);
    
    const nodeHeight = tempDiv.offsetHeight;
    document.body.removeChild(tempDiv);
    
    // 요소가 페이지에 들어갈 수 있는지 확인
    if (currentHeight + nodeHeight > pageHeight) {
      // 현재 페이지가 비어있지 않으면 페이지 배열에 추가
      if (currentPage.childNodes.length > 0) {
        pages.push(currentPage);
        currentPage = document.createElement('div');
        currentHeight = 0;
      }
      
      // 요소가 한 페이지보다 크면 요소 분할 필요
      if (nodeHeight > pageHeight) {
        // 복잡한 요소 분할은 구현하지 않고, 요소를 그대로 추가
        currentPage.appendChild(node.cloneNode(true));
        pages.push(currentPage);
        currentPage = document.createElement('div');
        currentHeight = 0;
      } else {
        currentPage.appendChild(node.cloneNode(true));
        currentHeight = nodeHeight;
      }
    } else {
      currentPage.appendChild(node.cloneNode(true));
      currentHeight += nodeHeight;
    }
  });
  
  // 마지막 페이지 추가
  if (currentPage.childNodes.length > 0) {
    pages.push(currentPage);
  }
  
  return pages;
};

/**
 * A4 관련 유틸리티 함수
 */
export const a4Utils = {
  // A4 크기 상수 (mm)
  A4_WIDTH_MM: 210,
  A4_HEIGHT_MM: 297,
  
  // DPI (dots per inch)
  DPI: 96,
  
  // mm를 px로 변환 (96 DPI 기준)
  mmToPx: (mm) => mm * (96 / 25.4),
  
  // px를 mm로 변환
  pxToMm: (px) => px * (25.4 / 96),
  
  // A4 크기 (px)
  A4_WIDTH_PX: 210 * (96 / 25.4),
  A4_HEIGHT_PX: 297 * (96 / 25.4)
};
```

### 헤더 컴포넌트

`src/components/Header.js` 파일을 생성하여 앱 헤더를 구현합니다:

```jsx
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
```

### 애플리케이션 진입점

`public/index.html` 파일을 생성하여 앱의 진입점을 설정합니다:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>A4 PDF Export for Confluence</title>
  <style>
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
      background-color: #F4F5F7;
    }
    
    #root {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="bundle.js"></script>
</body>
</html>
```

### 웹팩 설정

`webpack.config.js` 파일을 생성하여 웹팩 설정을 구성합니다:

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 3000,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
};
```

## 배포 및 테스트

1. Confluence 인스턴스에 앱 배포:
   - 개발 과정에서는 ngrok과 같은 도구를 사용하여 로컬 서버를 외부에 노출
   - `ngrok http 3000`을 실행하여 공개 URL 획득
   - `atlassian-connect.json`의 `baseUrl`을 ngrok URL로 업데이트

2. Confluence 관리자 설정에서 앱 설치:
   - Confluence 관리자 콘솔 > Add-ons > Manage add-ons > Upload add-on
   - ngrok URL + `/atlassian-connect.json` 입력

3. 테스트 및 디버깅:
   - 콘솔 로그와 네트워크 요청을 모니터링하여 문제 해결
   - 개발자 도구의 Elements 패널을 사용하여 DOM 구조 확인
   - 예상치 못한 스타일 문제는 스타일 디버거를 사용하여 해결 