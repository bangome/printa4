/**
 * Confluence 페이지 HTML 콘텐츠 가져오기 API
 */
module.exports = async (req, res) => {
  const { pageId } = req.query;
  
  try {
    // API 요청 로깅
    console.log(`페이지 HTML 콘텐츠 요청: pageId=${pageId}`);
    
    // 테스트용 HTML 콘텐츠
    const mockHtmlContent = `
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
    
    // 실제 구현에서는 Atlassian Connect JWT를 사용해 Confluence API에 요청을 보내야 합니다
    // 예: const response = await axios.get(`https://your-instance.atlassian.net/wiki/rest/api/content/${pageId}?expand=body.view`);
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(mockHtmlContent);
  } catch (error) {
    console.error('페이지 HTML 콘텐츠 가져오기 오류:', error);
    res.status(500).json({ 
      error: '페이지 HTML 콘텐츠를 가져오는데 실패했습니다.',
      details: error.message 
    });
  }
}; 