/**
 * Atlassian Connect 앱 설치 이벤트 핸들러
 * 이 엔드포인트가 /installed URL로 매핑됩니다
 */
const fs = require('fs').promises;
const path = require('path');

// 환경 변수 설정 함수
async function setEnvironmentVariables(data) {
  try {
    // Vercel 환경에서는 환경 변수를 직접 설정할 수 없으므로 파일에 저장
    const installDataDir = path.join('/tmp', 'install-data');
    
    try {
      await fs.mkdir(installDataDir, { recursive: true });
    } catch (err) {
      console.error('디렉토리 생성 오류:', err.message);
    }
    
    // 설치 데이터를 파일에 저장
    const installData = {
      clientKey: data.clientKey,
      sharedSecret: data.sharedSecret,
      baseUrl: data.baseUrl,
      productType: data.productType,
      installedAt: new Date().toISOString()
    };
    
    await fs.writeFile(
      path.join(installDataDir, `${data.clientKey}.json`),
      JSON.stringify(installData, null, 2)
    );
    
    console.log('설치 데이터 저장 완료:', data.clientKey);
    
    // 환경 변수로도 설정 (현재 요청에만 유효)
    process.env.CONFLUENCE_BASE_URL = data.baseUrl;
    process.env.SHARED_SECRET = data.sharedSecret;
    
    return true;
  } catch (error) {
    console.error('환경 변수 설정 오류:', error);
    return false;
  }
}

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
      await setEnvironmentVariables(body);
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