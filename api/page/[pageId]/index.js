/**
 * Confluence 페이지 콘텐츠 가져오기 API
 */
module.exports = async (req, res) => {
  const { pageId } = req.query;
  
  try {
    // API 요청 로깅
    console.log(`페이지 콘텐츠 요청: pageId=${pageId}`);
    
    // JWT 토큰으로 인증해야 하지만, 현재 테스트용으로 간단한 응답 반환
    const mockPageData = {
      id: pageId,
      title: "테스트 페이지",
      content: "<p>테스트 콘텐츠입니다.</p>",
      version: { number: 1 }
    };
    
    // 실제 구현에서는 Atlassian Connect JWT를 사용해 Confluence API에 요청을 보내야 합니다
    // 예: const response = await axios.get(`https://your-instance.atlassian.net/wiki/rest/api/content/${pageId}?expand=body.storage,version`);
    
    res.status(200).json(mockPageData);
  } catch (error) {
    console.error('페이지 콘텐츠 가져오기 오류:', error);
    res.status(500).json({ 
      error: '페이지 콘텐츠를 가져오는데 실패했습니다.',
      details: error.message 
    });
  }
}; 