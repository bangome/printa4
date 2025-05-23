/**
 * Confluence 페이지 HTML 콘텐츠 가져오기 API
 */
const { requestConfluenceApi, loadInstallationData } = require('../../../utils/atlassian');

module.exports = async (req, res) => {
  const { pageId } = req.query;
  
  try {
    // API 요청 로깅
    console.log(`페이지 HTML 콘텐츠 요청: pageId=${pageId}`);
    
    // 설치 데이터 확인
    const installData = loadInstallationData();
    console.log('설치 데이터 확인:', installData ? '있음' : '없음');
    
    // 테스트 모드 활성화
    const useTestMode = true; // true로 설정하여 항상 테스트 데이터 사용
    let htmlContent;
    
    if (!useTestMode) {
      try {
        // 실제 Confluence API 호출
        const pageData = await requestConfluenceApi(
          'GET', 
          `/wiki/rest/api/content/${pageId}?expand=body.view`
        );
        
        htmlContent = pageData.body.view.value;
        console.log('페이지 HTML 콘텐츠 가져오기 성공');
      } catch (apiError) {
        console.error('Confluence API 오류:', apiError.message);
        useTestMode = true;
      }
    }
    
    if (useTestMode) {
      // 테스트 데이터로 대체
      console.log('테스트 HTML 콘텐츠 사용');
      htmlContent = `
        <h1>테스트 페이지 제목</h1>
        <p>이것은 테스트용 HTML 콘텐츠입니다.</p>
        <h2>소제목</h2>
        <p>더미 텍스트입니다. 이 텍스트는 실제 Confluence 콘텐츠 대신 보여집니다.</p>
        <ul>
          <li>목록 항목 1</li>
          <li>목록 항목 2</li>
          <li>목록 항목 3</li>
        </ul>
      `;
    }
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(htmlContent);
  } catch (error) {
    console.error('페이지 HTML 콘텐츠 가져오기 오류:', error);
    res.status(500).json({ 
      error: '페이지 HTML 콘텐츠를 가져오는데 실패했습니다.',
      details: error.message 
    });
  }
}; 