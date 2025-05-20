/**
 * Atlassian Connect 앱 설치 이벤트 핸들러
 * 이 엔드포인트가 /installed URL로 매핑됩니다
 */
module.exports = (req, res) => {
  try {
    // 모든 요청 데이터 로깅
    console.log('Installation request received:');
    console.log('- Method:', req.method);
    console.log('- Headers:', JSON.stringify(req.headers));
    console.log('- Body:', req.body);
    console.log('- URL:', req.url);

    // 성공 응답 (204: No Content는 Atlassian에서 권장하는 응답)
    res.status(204).end();
  } catch (error) {
    console.error('Installation error:', error);
    res.status(500).json({ error: 'Installation failed', details: error.message });
  }
}; 