/**
 * Atlassian Connect 앱 제거 이벤트 핸들러
 * Vercel 서버리스 함수로 구현됨
 */
module.exports = (req, res) => {
  try {
    // 요청 메서드 검증
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // 제거 데이터 로깅
    console.log('App uninstallation data:', req.body);

    // 여기서 앱 데이터 정리 및 삭제 로직을 구현할 수 있습니다

    // 성공 응답
    res.status(200).json({ status: 'uninstalled' });
  } catch (error) {
    console.error('Uninstallation error:', error);
    res.status(500).json({ error: 'Uninstallation failed' });
  }
}; 