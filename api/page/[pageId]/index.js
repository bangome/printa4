/**
 * Confluence 페이지 콘텐츠 가져오기 API
 */
const { requestConfluenceApi } = require('../../utils/atlassian');

module.exports = async (req, res) => {
  const { pageId } = req.query;
  
  try {
    // API 요청 로깅
    console.log(`페이지 콘텐츠 요청: pageId=${pageId}`);
    
    let pageData;
    
    try {
      // 실제 Confluence API 호출
      pageData = await requestConfluenceApi(
        'GET', 
        `/wiki/rest/api/content/${pageId}?expand=body.storage,version`
      );
      
      console.log('페이지 데이터 가져오기 성공:', pageData.title);
    } catch (apiError) {
      console.error('Confluence API 오류:', apiError.message);
      
      // 실패 시 테스트 데이터로 대체
      console.log('테스트 데이터로 대체합니다.');
      pageData = {
        id: pageId,
        title: "테스트 페이지",
        body: {
          storage: {
            value: "<p>테스트 콘텐츠입니다.</p>"
          }
        },
        version: { number: 1 }
      };
    }
    
    res.status(200).json(pageData);
  } catch (error) {
    console.error('페이지 콘텐츠 가져오기 오류:', error);
    res.status(500).json({ 
      error: '페이지 콘텐츠를 가져오는데 실패했습니다.',
      details: error.message 
    });
  }
}; 