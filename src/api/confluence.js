/**
 * Confluence API 래퍼
 */
class ConfluenceApi {
  constructor() {
    this.AP = window.AP;
  }

  /**
   * 현재 컨텍스트 정보 가져오기
   */
  async getContext() {
    if (!this.AP) {
      throw new Error('Atlassian Connect API가 로드되지 않았습니다.');
    }

    try {
      return await this.AP.context.getContext();
    } catch (error) {
      console.error('컨텍스트 정보를 가져오는데 실패했습니다:', error);
      throw error;
    }
  }

  /**
   * 페이지 콘텐츠 가져오기
   * @param {string} pageId - 가져올 페이지 ID
   */
  async getPageContent(pageId) {
    if (!this.AP) {
      throw new Error('Atlassian Connect API가 로드되지 않았습니다.');
    }

    try {
      // 컨텍스트 정보 가져오기
      const context = await this.getContext();
      const baseUrl = context.confluence.baseUrl;

      const response = await this.AP.request({
        url: `${baseUrl}/rest/api/content/${pageId}?expand=body.storage,version,title`,
        type: 'GET',
        contentType: 'application/json'
      });

      return JSON.parse(response.body);
    } catch (error) {
      console.error('페이지 콘텐츠를 가져오는데 실패했습니다:', error);
      throw error;
    }
  }

  /**
   * 페이지 HTML 콘텐츠 가져오기
   * @param {string} pageId - 가져올 페이지 ID
   */
  async getPageHtmlContent(pageId) {
    if (!this.AP) {
      throw new Error('Atlassian Connect API가 로드되지 않았습니다.');
    }

    try {
      // 컨텍스트 정보 가져오기
      const context = await this.getContext();
      const baseUrl = context.confluence.baseUrl;

      const response = await this.AP.request({
        url: `${baseUrl}/rest/api/content/${pageId}?expand=body.view`,
        type: 'GET',
        contentType: 'application/json'
      });

      const data = JSON.parse(response.body);
      return data.body.view.value;
    } catch (error) {
      console.error('페이지 HTML 콘텐츠를 가져오는데 실패했습니다:', error);
      throw error;
    }
  }

  /**
   * 페이지 첨부 파일 가져오기
   * @param {string} pageId - 페이지 ID
   */
  async getPageAttachments(pageId) {
    if (!this.AP) {
      throw new Error('Atlassian Connect API가 로드되지 않았습니다.');
    }

    try {
      const context = await this.getContext();
      const baseUrl = context.confluence.baseUrl;

      const response = await this.AP.request({
        url: `${baseUrl}/rest/api/content/${pageId}/child/attachment`,
        type: 'GET',
        contentType: 'application/json'
      });

      return JSON.parse(response.body);
    } catch (error) {
      console.error('페이지 첨부 파일을 가져오는데 실패했습니다:', error);
      throw error;
    }
  }
}

export default new ConfluenceApi(); 