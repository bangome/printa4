/**
 * Atlassian API 연동 유틸리티
 */
const axios = require('axios');
const jwt = require('atlassian-jwt');
const fs = require('fs').promises;
const path = require('path');

/**
 * 최신 설치 데이터 불러오기
 * @returns {Promise<Object|null>} - 설치 데이터 객체
 */
async function loadInstallationData() {
  try {
    const installDataDir = path.join('/tmp', 'install-data');
    
    try {
      const files = await fs.readdir(installDataDir);
      if (!files || files.length === 0) {
        console.warn('설치 데이터 파일이 없습니다.');
        return null;
      }
      
      // 가장 최신 파일 찾기
      let latestFile = null;
      let latestTime = 0;
      
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        
        const filePath = path.join(installDataDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtimeMs > latestTime) {
          latestTime = stats.mtimeMs;
          latestFile = filePath;
        }
      }
      
      if (!latestFile) {
        console.warn('유효한 설치 데이터 파일이 없습니다.');
        return null;
      }
      
      // 파일 읽기
      const data = await fs.readFile(latestFile, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('설치 데이터 디렉토리 읽기 오류:', err.message);
      return null;
    }
  } catch (error) {
    console.error('설치 데이터 로드 오류:', error);
    return null;
  }
}

/**
 * JWT 토큰 생성
 * @param {string} method - HTTP 메소드
 * @param {string} path - API 경로
 * @param {string} baseUrl - Confluence 인스턴스 URL
 * @param {string} sharedSecret - 공유 시크릿
 * @returns {string} - JWT 토큰
 */
function generateJWT(method, path, baseUrl, sharedSecret) {
  const now = Math.floor(Date.now() / 1000);
  const iat = now;
  const exp = now + 60 * 10; // 10분 유효기간
  
  const token = jwt.encode({
    iss: 'com.yourcompany.a4-pdf-export',
    iat,
    exp,
    qsh: jwt.createQueryStringHash({
      method,
      path,
      baseUrl
    })
  }, sharedSecret);
  
  return token;
}

/**
 * Confluence API에 JWT 인증으로 요청 보내기
 * @param {string} method - HTTP 메소드
 * @param {string} url - 요청 URL
 * @param {Object} options - 요청 옵션
 * @returns {Promise<Object>} - API 응답
 */
async function requestConfluenceApi(method, url, options = {}) {
  // 환경 변수 또는 설치 데이터에서 값 가져오기
  const installData = await loadInstallationData();
  
  const baseUrl = process.env.CONFLUENCE_BASE_URL || 
                 (installData && installData.baseUrl) || 
                 'https://your-instance.atlassian.net';
                 
  const sharedSecret = process.env.SHARED_SECRET || 
                      (installData && installData.sharedSecret) || 
                      'dummy-secret-for-testing';
  
  console.log('API 요청:', method, url);
  console.log('Base URL:', baseUrl);
  
  const token = generateJWT(method, url, baseUrl, sharedSecret);
  
  try {
    const response = await axios({
      method,
      url: `${baseUrl}${url}`,
      headers: {
        'Authorization': `JWT ${token}`,
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    return response.data;
  } catch (error) {
    console.error('Confluence API 요청 오류:', error.message);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
    throw error;
  }
}

module.exports = {
  generateJWT,
  requestConfluenceApi,
  loadInstallationData
}; 