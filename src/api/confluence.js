/**
 * Confluence API 래퍼
 */
class ConfluenceApi {
  constructor() {
    this.AP = null;
    this.maxRetries = 20;
    this.retryInterval = 250;
    this.initPromise = null;
    this.baseUrl = null;
    this.jwtToken = null;
    this.initAP();
  }

  /**
   * AP 객체 초기화
   */
  initAP() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const initHandler = () => {
        console.log('AP 객체 초기화 시작');
        window.AP.context.getContext((context) => {
          console.log('AP 컨텍스트 로드 완료:', context);
          this.AP = window.AP;
          this.baseUrl = context.confluence.baseUrl;
          
          // JWT 토큰 생성
          this.jwtToken = this.generateJWT();
          
          resolve(this.AP);
        });
      };

      // Confluence 공식 권장 초기화 방식
      if (window.AP && window.AP.confluence) {
        window.AP.confluence.on('ready', initHandler);
      } else {
        window.addEventListener('APReady', initHandler);
      }
    });

    return this.initPromise;
  }

  /**
   * JWT 생성 메서드
   */
  generateJWT() {
    const context = this.AP.context.getToken();
    return context.jwt;
  }

  /**
   * AP 객체 가용성 확인 및 대기
   */
  async waitForAP() {
    try {
      await this.initPromise;
      return this.AP;
    } catch (error) {
      console.error('AP 객체 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * 현재 컨텍스트 정보 가져오기
   */
  async getContext() {
    console.log('getContext 호출');
    await this.waitForAP();

    return new Promise((resolve, reject) => {
      this.AP.context.getContext((context) => {
        console.log('컨텍스트 정보:', context);
        resolve(context);
      });
    });
  }

  /**
   * 페이지 콘텐츠 가져오기
   * @param {string} pageId - 가져올 페이지 ID
   */
  async getPageContent(pageId) {
    await this.waitForAP();
    
    try {
      const response = await this.AP.request({
        url: `/rest/api/content/${pageId}?expand=body.storage,version,title`,
        type: 'GET',
        headers: {
          'Authorization': `JWT ${this.jwtToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      return JSON.parse(response.body);
    } catch (error) {
      console.error('페이지 콘텐츠 요청 실패:', error);
      throw error;
    }
  }

  /**
   * 페이지 HTML 콘텐츠 가져오기
   * @param {string} pageId - 가져올 페이지 ID
   */
  async getPageHtmlContent(pageId) {
    console.log('getPageHtmlContent 호출:', { pageId });
    await this.waitForAP();

    try {
      const context = await this.getContext();
      console.log('API 요청 URL 구성:', { baseUrl: this.baseUrl, pageId });

      const response = await this.AP.request({
        url: `${context.confluence.baseUrl}/wiki/rest/api/content/${pageId}?expand=body.view`,
        type: 'GET',
        contentType: 'application/json'
      });

      console.log('HTML 콘텐츠 응답:', response);
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
    await this.waitForAP();

    try {
      const context = await this.getContext();
      console.log('API 요청 URL 구성:', { baseUrl: this.baseUrl, pageId });

      const response = await this.AP.request({
        url: `${context.confluence.baseUrl}/wiki/rest/api/content/${pageId}/child/attachment`,
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