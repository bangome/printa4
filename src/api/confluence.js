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
    const response = await fetch(`${this.baseUrl}/page/${pageId}`);
    if (!response.ok) {
      throw new Error('페이지 콘텐츠를 가져오는데 실패했습니다.');
    }
    return response.json();
  }

  /**
   * 페이지 HTML 콘텐츠 가져오기
   * @param {string} pageId - 가져올 페이지 ID
   */
  async getPageHtmlContent(pageId) {
    const response = await fetch(`${this.baseUrl}/page/${pageId}/html`);
    if (!response.ok) {
      throw new Error('페이지 HTML 콘텐츠를 가져오는데 실패했습니다.');
    }
    return response.text();
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