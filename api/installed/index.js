/**
 * Atlassian Connect 앱 설치 이벤트 핸들러
 * 이 엔드포인트가 /installed URL로 매핑됩니다
 */
const { saveInstallationData } = require('../utils/atlassian');

module.exports = async (req, res) => {
  try {
    // 모든 요청 데이터 로깅
    console.log('Installation request received:');
    console.log('- Method:', req.method);
    console.log('- Headers:', JSON.stringify(req.headers));
    
    // body 파싱
    let body = req.body;
    
    if (!body || Object.keys(body).length === 0) {
      if (req.rawBody) {
        try {
          body = JSON.parse(req.rawBody.toString());
        } catch (e) {
          console.error('Body 파싱 오류:', e);
        }
      }
    }
    
    console.log('- Body:', JSON.stringify(body));
    
    // 필수 데이터 확인
    if (body && body.baseUrl && body.sharedSecret) {
      saveInstallationData(body);
      console.log('설치 완료! Base URL:', body.baseUrl);
    } else {
      console.warn('필수 설치 데이터 누락:', body);
    }
    
    // 성공 응답 (204: No Content는 Atlassian에서 권장하는 응답)
    res.status(204).end();
  } catch (error) {
    console.error('Installation error:', error);
    res.status(500).json({ error: 'Installation failed', details: error.message });
  }
}; 