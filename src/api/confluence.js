/**
 * Confluence API 래퍼
 */
class ConfluenceApi {
  constructor() {
    this.AP = null;
    this.maxRetries = 10;
    this.retryInterval = 500;
    this.initAP();
  }

  /**
   * AP 객체 초기화
   */
  initAP() {
    const tryInit = (retryCount = 0) => {
      if (typeof AP !== 'undefined' && AP.ready) {
        console.log('AP 객체 초기화 - AP.ready 사용 가능');
        this.AP = AP;
        return;
      }

      if (retryCount < this.maxRetries) {
        console.log(`AP 객체 초기화 재시도 (${retryCount + 1}/${this.maxRetries})`);
        setTimeout(() => tryInit(retryCount + 1), this.retryInterval);
      } else {
        console.error('AP 객체 초기화 실패 - 최대 재시도 횟수 초과');
      }
    };

    // APReady 이벤트 리스너 등록
    window.addEventListener('APReady', () => {
      console.log('AP 객체 초기화 - APReady 이벤트 수신');
      this.AP = window.AP;
    });

    // 초기화 시작
    tryInit();
  }

  /**
   * AP 객체 가용성 확인 및 대기
   */
  async waitForAP() {
    const waitForAPReady = () => {
      return new Promise((resolve, reject) => {
        if (this.AP) {
          resolve();
          return;
        }

        let retryCount = 0;
        const checkAP = () => {
          if (this.AP) {
            resolve();
          } else if (retryCount < this.maxRetries) {
            retryCount++;
            setTimeout(checkAP, this.retryInterval);
          } else {
            reject(new Error('AP 객체 초기화 타임아웃'));
          }
        };

        checkAP();
      });
    };

    await waitForAPReady();
  }

  /**
   * 현재 컨텍스트 정보 가져오기
   */
  async getContext() {
    console.log('getContext 호출');
    await this.waitForAP();

    try {
      const context = await this.AP.context.getContext();
      console.log('컨텍스트 정보:', context);
      return context;
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
    console.log('getPageContent 호출:', { pageId });
    await this.waitForAP();

    try {
      // 컨텍스트 정보 가져오기
      const context = await this.getContext();
      const baseUrl = context.confluence.baseUrl;
      console.log('API 요청 URL 구성:', { baseUrl, pageId });

      const response = await this.AP.request({
        url: `${baseUrl}/rest/api/content/${pageId}?expand=body.storage,version,title`,
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
      // 컨텍스트 정보 가져오기
      const context = await this.getContext();
      const baseUrl = context.confluence.baseUrl;
      console.log('API 요청 URL 구성:', { baseUrl, pageId });

      const response = await this.AP.request({
        url: `${baseUrl}/rest/api/content/${pageId}?expand=body.view`,
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