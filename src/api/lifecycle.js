/**
 * Atlassian Connect 앱의 라이프사이클 이벤트 처리
 */

// 설치 이벤트 처리
export const handleInstalled = async (req, res) => {
  try {
    const installationData = req.body;
    console.log('App installed:', installationData);
    
    // 여기서 설치 데이터를 저장할 수 있습니다
    // 예: 클라이언트 키, 공유 보안 비밀, baseUrl 등
    
    // 성공 응답
    res.status(200).json({ status: 'installed' });
  } catch (error) {
    console.error('Installation error:', error);
    res.status(500).json({ error: 'Installation failed' });
  }
};

// 제거 이벤트 처리
export const handleUninstalled = async (req, res) => {
  try {
    const uninstallData = req.body;
    console.log('App uninstalled:', uninstallData);
    
    // 여기서 설치 데이터를 제거할 수 있습니다
    
    // 성공 응답
    res.status(200).json({ status: 'uninstalled' });
  } catch (error) {
    console.error('Uninstallation error:', error);
    res.status(500).json({ error: 'Uninstallation failed' });
  }
}; 