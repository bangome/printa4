/**
 * Confluence API 래퍼
 */
class ConfluenceApi {
  constructor() {
    this.baseUrl = '/api';
  }

  /**
   * 현재 컨텍스트 정보 가져오기
   */
  async getContext() {
    const response = await fetch(`${this.baseUrl}/context`);
    if (!response.ok) {
      throw new Error('컨텍스트 정보를 가져오는데 실패했습니다.');
    }
    return response.json();
  }

  /**
   * 페이지 콘텐츠 가져오기
   * @param {string} pageId - 가져올 페이지 ID
   */
  async getPageContent(pageId) {
    console.log(`API 호출: ${this.baseUrl}/page/${pageId}`);
    
    try {
      const response = await fetch(`${this.baseUrl}/page/${pageId}`);
      if (!response.ok) {
        console.error('API 응답 에러:', response.status, response.statusText);
        throw new Error('페이지 콘텐츠를 가져오는데 실패했습니다.');
      }
      return response.json();
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      
      // 테스트 데이터 반환
      console.log('테스트 데이터를 반환합니다.');
      return {
        id: pageId,
        title: "Confluence A4 PDF Export 테스트 페이지",
        body: {
          storage: {
            value: "<p>테스트 콘텐츠입니다.</p>"
          }
        },
        version: { number: 1 }
      };
    }
  }

  /**
   * 페이지 HTML 콘텐츠 가져오기
   * @param {string} pageId - 가져올 페이지 ID
   */
  async getPageHtmlContent(pageId) {
    console.log(`HTML API 호출: ${this.baseUrl}/page/${pageId}/html`);
    
    try {
      const response = await fetch(`${this.baseUrl}/page/${pageId}/html`);
      if (!response.ok) {
        console.error('HTML API 응답 에러:', response.status, response.statusText);
        throw new Error('페이지 HTML 콘텐츠를 가져오는데 실패했습니다.');
      }
      return response.text();
    } catch (error) {
      console.error('HTML API 호출 중 오류 발생:', error);
      
      // 테스트 HTML 반환
      console.log('테스트 HTML 데이터를 반환합니다.');
      return `
        <h1>Confluence A4 PDF Export 테스트</h1>
        <p>이것은 테스트용 HTML 콘텐츠입니다.</p>
        <h2>소제목</h2>
        <p>PDF 내보내기 애플리케이션 테스트를 위한 더미 콘텐츠입니다.</p>
        <ul>
          <li>Noto Sans KR 폰트 테스트</li>
          <li>PDF 변환 테스트</li>
          <li>A4 용지 규격 테스트</li>
        </ul>
        <p>한글 텍스트 예시: 안녕하세요, 반갑습니다. 이 애플리케이션은 Confluence 페이지를 A4 PDF로 변환합니다.</p>
      `;
    }
  }

  /**
   * 페이지 첨부 파일 가져오기
   * @param {string} pageId - 페이지 ID
   */
  async getPageAttachments(pageId) {
    const response = await fetch(`${this.baseUrl}/page/${pageId}/attachments`);
    if (!response.ok) {
      throw new Error('페이지 첨부 파일을 가져오는데 실패했습니다.');
    }
    return response.json();
  }
}

export default new ConfluenceApi(); 