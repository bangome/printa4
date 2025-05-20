const express = require('express');
const router = express.Router();

// 컨텍스트 정보 가져오기
router.get('/context', (req, res) => {
  res.json({
    baseUrl: req.context.baseUrl,
    userId: req.context.userId,
    cloudId: req.context.cloudId
  });
});

// 페이지 정보 가져오기
router.get('/page/:pageId', async (req, res) => {
  try {
    const pageId = req.params.pageId;
    const httpClient = req.context.http;
    
    const response = await httpClient.get({
      url: `/rest/api/content/${pageId}?expand=body.storage,version`
    });
    
    res.json(response.body);
  } catch (error) {
    console.error('페이지 정보 가져오기 오류:', error);
    res.status(500).json({ error: '페이지 정보를 가져오는데 실패했습니다.' });
  }
});

// 페이지 HTML 콘텐츠 가져오기
router.get('/page/:pageId/html', async (req, res) => {
  try {
    const pageId = req.params.pageId;
    const httpClient = req.context.http;
    
    const response = await httpClient.get({
      url: `/rest/api/content/${pageId}?expand=body.view`
    });
    
    res.send(response.body.body.view.value);
  } catch (error) {
    console.error('페이지 HTML 콘텐츠 가져오기 오류:', error);
    res.status(500).json({ error: '페이지 HTML 콘텐츠를 가져오는데 실패했습니다.' });
  }
});

// 페이지 첨부 파일 가져오기
router.get('/page/:pageId/attachments', async (req, res) => {
  try {
    const pageId = req.params.pageId;
    const httpClient = req.context.http;
    
    const response = await httpClient.get({
      url: `/rest/api/content/${pageId}/child/attachment`
    });
    
    res.json(response.body);
  } catch (error) {
    console.error('페이지 첨부 파일 가져오기 오류:', error);
    res.status(500).json({ error: '페이지 첨부 파일을 가져오는데 실패했습니다.' });
  }
});

module.exports = router; 