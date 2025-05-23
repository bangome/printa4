import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import Header from './components/Header';
import PdfPreview from './components/PdfPreview';
import SettingsPanel from './components/SettingsPanel';
import confluenceApi from './api/confluence';
import pdfGenerator from './services/pdfGenerator';

// 기본 PDF 설정
const defaultSettings = {
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  },
  fontSize: {
    title: 18,
    heading1: 16,
    heading2: 14,
    body: 12
  },
  fontFamily: "'Noto Sans KR', sans-serif",
  header: {
    show: true,
    text: '',
    align: 'center'
  },
  footer: {
    show: true,
    text: '',
    showPageNumber: true,
    align: 'center'
  }
};

const App = () => {
  const [pageId, setPageId] = useState(null);
  const [pageTitle, setPageTitle] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAPReady, setIsAPReady] = useState(false);

  // AP 준비 상태 확인
  useEffect(() => {
    const handleAPReady = () => {
      console.log('AP ready in App component - 이벤트 수신');
      setIsAPReady(true);
    };

    window.addEventListener('APReady', handleAPReady);
    return () => {
      window.removeEventListener('APReady', handleAPReady);
    };
  }, []);

  // URL에서 pageId 파라미터 가져오기
  useEffect(() => {
    if (!isAPReady) return;

    const params = new URLSearchParams(window.location.search);
    const pageIdParam = params.get('pageId');
    if (pageIdParam) {
      console.log('페이지 ID 설정:', pageIdParam);
      setPageId(pageIdParam);
    } else {
      console.error('페이지 ID가 없습니다.');
      setError('페이지 ID가 없습니다.');
      setLoading(false);
    }
  }, [isAPReady]);

  // 페이지 콘텐츠 가져오기
  useEffect(() => {
    if (!pageId || !isAPReady) {
      console.log('페이지 콘텐츠 가져오기 대기:', { pageId, isAPReady });
      return;
    }

    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('페이지 콘텐츠 가져오기 시작:', pageId);
        
        const pageData = await confluenceApi.getPageContent(pageId);
        const htmlContent = await confluenceApi.getPageHtmlContent(pageId);
        
        console.log('페이지 데이터 가져오기 성공:', pageData);
        
        setPageTitle(pageData.title);
        setPageContent(htmlContent);
        
        // 헤더/푸터 기본값 설정
        setSettings(prev => ({
          ...prev,
          header: {
            ...prev.header,
            text: pageData.title
          },
          footer: {
            ...prev.footer,
            text: `Generated from Confluence - ${new Date().toLocaleDateString()}`
          }
        }));
      } catch (err) {
        console.error('페이지 콘텐츠 가져오기 오류:', err);
        setError('페이지 콘텐츠를 가져오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, [pageId, isAPReady]);

  // PDF 생성 메시지 이벤트 리스너
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data && event.data.action === 'generatePdf') {
        console.log('PDF 생성 요청 수신:', event.data);
        try {
          await pdfGenerator.generatePdf(pageTitle, pageContent, settings);
          console.log('PDF 생성 완료');
        } catch (error) {
          console.error('PDF 생성 중 오류 발생:', error);
          setError('PDF 생성에 실패했습니다.');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [pageTitle, pageContent, settings]);

  // 설정 변경 핸들러
  const handleSettingsChange = (newSettings) => {
    setSettings({
      ...settings,
      ...newSettings
    });
  };

  return (
    <div css={appStyles}>
      <Header title="A4 PDF Export" />
      
      {error && (
        <div css={errorStyles}>
          {error}
        </div>
      )}
      
      {loading ? (
        <div css={loadingStyles}>
          콘텐츠를 불러오는 중...
        </div>
      ) : (
        <div css={contentStyles}>
          <div css={previewContainerStyles}>
            <PdfPreview
              title={pageTitle}
              content={pageContent}
              settings={settings}
            />
          </div>
          <div css={settingsPanelStyles}>
            <SettingsPanel
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// 스타일
const appStyles = css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-height: 100vh;
  font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
`;

const contentStyles = css`
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 60px);
`;

const previewContainerStyles = css`
  flex: 1;
  padding: 20px;
  overflow: auto;
  background-color: #f4f5f7;
`;

const settingsPanelStyles = css`
  width: 320px;
  background-color: #ffffff;
  border-left: 1px solid #dfe1e6;
  overflow-y: auto;
  padding: 0 10px;
`;

const loadingStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: 16px;
`;

const errorStyles = css`
  padding: 16px;
  background-color: #ffebe6;
  color: #de350b;
  border-radius: 3px;
  margin: 16px;
`;

export default App; 