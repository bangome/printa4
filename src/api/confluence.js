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
      const tryInit = (retryCount = 0) => {
        if (typeof window.AP !== 'undefined') {
          console.log('AP 객체 초기화 - AP 객체 발견');
          window.AP.context.getContext((context) => {
            console.log('AP 초기화 완료 - 컨텍스트:', context);
            this.AP = window.AP;
            this.baseUrl = context.confluence ? context.confluence.baseUrl : context.url.displayUrl;
            resolve(this.AP);
          });
          return;
        }

        if (retryCount < this.maxRetries) {
          console.log(`AP 객체 초기화 재시도 (${retryCount + 1}/${this.maxRetries})`);
          setTimeout(() => tryInit(retryCount + 1), this.retryInterval);
        } else {
          const error = new Error('AP 객체 초기화 실패 - 최대 재시도 횟수 초과');
          console.error(error);
          reject(error);
        }
      };

      // APReady 이벤트 리스너 등록
      window.addEventListener('APReady', () => {
        console.log('AP 객체 초기화 - APReady 이벤트 수신');
        if (!this.AP && window.AP) {
          window.AP.context.getContext((context) => {
            this.AP = window.AP;
            this.baseUrl = context.confluence ? context.confluence.baseUrl : context.url.displayUrl;
            resolve(this.AP);
          });
        }
      });

      // 초기화 시작
      tryInit();
    });

    return this.initPromise;
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
    console.log('getPageContent 호출:', { pageId });
    await this.waitForAP();

    try {
      const context = await this.getContext();
      console.log('API 요청 URL 구성:', { baseUrl: this.baseUrl, pageId });

      const response = await this.AP.request({
        url: `${context.confluence.baseUrl}/wiki/rest/api/content/${pageId}?expand=body.storage,version,title`,
        type: 'GET',
        contentType: 'application/json'
      });

      console.log('페이지 콘텐츠 응답:', response);
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