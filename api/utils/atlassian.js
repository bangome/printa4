/**
 * Atlassian API 연동 유틸리티
 */
const axios = require('axios');
const jwt = require('atlassian-jwt');

// 설치 데이터를 메모리에 저장하기 위한 변수
let cachedInstallData = null;

/**
 * 설치 데이터 저장
 * @param {Object} data - 설치 데이터
 */
function saveInstallationData(data) {
  cachedInstallData = {
    clientKey: data.clientKey,
    sharedSecret: data.sharedSecret,
    baseUrl: data.baseUrl,
    productType: data.productType,
    installedAt: new Date().toISOString()
  };
  
  console.log('설치 데이터 메모리에 저장 완료:', data.clientKey);
  return true;
}

/**
 * 설치 데이터 불러오기
 * @returns {Object|null} - 설치 데이터 객체
 */
function loadInstallationData() {
  if (cachedInstallData) {
    return cachedInstallData;
  }
  
  console.warn('저장된 설치 데이터가 없습니다.');
  return null;
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
  
  // URI 경로와 쿼리 분리
  const url = new URL(path.startsWith('http') ? path : `${baseUrl}${path}`);
  const apiPath = url.pathname;
  const query = url.search ? url.search.substr(1) : '';
  
  // QSH 생성용 요청 객체
  const request = {
    method: method,
    path: apiPath,
    query: query
  };
  
  console.log('QSH 생성 요청:', request);
  
  const token = jwt.encode({
    iss: 'com.yourcompany.a4-pdf-export',
    iat,
    exp,
    qsh: jwt.createQueryStringHash(request)
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
  const installData = loadInstallationData();
  
  const baseUrl = process.env.CONFLUENCE_BASE_URL || 
                 (installData && installData.baseUrl) || 
                 'https://your-instance.atlassian.net';
                 
  const sharedSecret = process.env.SHARED_SECRET || 
                      (installData && installData.sharedSecret) || 
                      'dummy-secret-for-testing';
  
  console.log('API 요청:', method, url);
  console.log('Base URL:', baseUrl);
  
  try {
    const token = generateJWT(method, url, baseUrl, sharedSecret);
    
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    console.log('전체 URL:', fullUrl);
    
    const response = await axios({
      method,
      url: fullUrl,
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
  loadInstallationData,
  saveInstallationData
}; 