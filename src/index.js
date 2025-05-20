import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
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
      
      // PDF 생성 모듈 지연 로딩
      const pdfGeneratorModule = await import('./services/pdfGenerator');
      const pdfGenerator = pdfGeneratorModule.default;
      
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