/**
 * Atlassian Connect 앱 설치 이벤트 핸들러
 * Vercel 서버리스 함수로 구현됨
 */
module.exports = (req, res) => {
  try {
    // 요청 메서드 검증
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // 설치 데이터 로깅
    console.log('App installation data:', req.body);

    // 여기서 보안 검증 및 데이터 저장을 구현할 수 있습니다
    // JWT 인증을 사용할 경우 공유 시크릿 저장이 필요합니다

    // 성공 응답
    res.status(200).json({ status: 'installed' });
  } catch (error) {
    console.error('Installation error:', error);
    res.status(500).json({ error: 'Installation failed' });
  }
}; 