import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { applyStyles } from './styleProcessor';

// A4 크기 상수 (mm)
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// A4 크기 (pt, jsPDF 기본 단위)
const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;

/**
 * PDF 생성 서비스
 */
class PdfGenerator {
  /**
   * HTML 콘텐츠를 A4 PDF로 변환
   * @param {string} title - 문서 제목
   * @param {string} htmlContent - HTML 콘텐츠
   * @param {Object} settings - PDF 설정
   * @returns {Promise<Blob>} - PDF Blob
   */
  async generatePdf(title, htmlContent, settings) {
    // HTML 요소 생성
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = `${A4_WIDTH_PT}px`;
    container.style.fontFamily = settings.fontFamily;
    document.body.appendChild(container);
    
    try {
      // 제목 추가
      const titleElement = document.createElement('h1');
      titleElement.textContent = title;
      titleElement.style.fontSize = `${settings.fontSize.title}px`;
      titleElement.style.fontFamily = settings.fontFamily;
      titleElement.style.marginBottom = '20px';
      container.appendChild(titleElement);
      
      // 본문 콘텐츠 추가
      const contentElement = document.createElement('div');
      contentElement.innerHTML = htmlContent;
      
      // 스타일 적용
      applyStyles(contentElement, settings);
      container.appendChild(contentElement);
      
      // 콘텐츠 높이를 기준으로 페이지 분할
      const contentHeight = container.offsetHeight;
      const contentWidth = container.offsetWidth;
      
      // 여백을 고려한 jsPDF 설정 (mm 단위)
      const marginLeft = settings.margin.left * 0.352778; // px to mm
      const marginTop = settings.margin.top * 0.352778;
      const marginRight = settings.margin.right * 0.352778;
      const marginBottom = settings.margin.bottom * 0.352778;
      
      // 사용 가능한 콘텐츠 영역 (mm)
      const availableWidth = A4_WIDTH_MM - marginLeft - marginRight;
      const availableHeight = A4_HEIGHT_MM - marginTop - marginBottom;
      const headerHeight = settings.header.show ? 15 : 0;
      const footerHeight = settings.footer.show ? 15 : 0;
      const actualAvailableHeight = availableHeight - headerHeight - footerHeight;

      // PDF 생성
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // HTML을 캔버스로 변환
      const canvas = await html2canvas(container, {
        scale: 3, // 고해상도를 위한 스케일 조정
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY
      });
      
      // 캔버스를 이미지로 변환
      const imgData = canvas.toDataURL('image/png');
      
      // 총 페이지 수 계산
      const totalPages = Math.ceil(contentHeight / (actualAvailableHeight * 2.83)); // mm to px
      
      // 각 페이지에 이미지 추가
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        // 컨텐츠 영역 계산
        const sourceY = i * (actualAvailableHeight * 2.83);
        const sourceHeight = Math.min(actualAvailableHeight * 2.83, contentHeight - sourceY);
        
        // 이미지 추가
        pdf.addImage(
          imgData,
          'PNG',
          marginLeft,
          marginTop + headerHeight,
          availableWidth,
          (sourceHeight / contentHeight) * availableWidth * (contentHeight / contentWidth),
          '',
          'FAST'
        );
        
        // 헤더 추가
        if (settings.header.show) {
          pdf.setFont(settings.fontFamily);
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          
          const headerText = settings.header.text;
          const headerWidth = pdf.getStringUnitWidth(headerText) * 9 / pdf.internal.scaleFactor;
          let headerX = marginLeft;
          
          if (settings.header.align === 'center') {
            headerX = marginLeft + (availableWidth - headerWidth) / 2;
          } else if (settings.header.align === 'right') {
            headerX = A4_WIDTH_MM - marginRight - headerWidth;
          }
          
          pdf.text(headerText, headerX, marginTop + 7);
          pdf.line(marginLeft, marginTop + 10, A4_WIDTH_MM - marginRight, marginTop + 10);
        }
        
        // 푸터 추가
        if (settings.footer.show) {
          pdf.setFont(settings.fontFamily);
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          
          const footerText = settings.footer.text;
          const footerWidth = pdf.getStringUnitWidth(footerText) * 9 / pdf.internal.scaleFactor;
          let footerX = marginLeft;
          
          if (settings.footer.align === 'center') {
            footerX = marginLeft + (availableWidth - footerWidth) / 2;
          } else if (settings.footer.align === 'right') {
            footerX = A4_WIDTH_MM - marginRight - footerWidth;
          }
          
          pdf.text(footerText, footerX, A4_HEIGHT_MM - marginBottom - 7);
          
          // 페이지 번호 추가
          if (settings.footer.showPageNumber) {
            const pageNumberText = `${i + 1} / ${totalPages}`;
            pdf.text(pageNumberText, A4_WIDTH_MM - marginRight - 20, A4_HEIGHT_MM - marginBottom - 7);
          }
          
          pdf.line(marginLeft, A4_HEIGHT_MM - marginBottom - 10, A4_WIDTH_MM - marginRight, A4_HEIGHT_MM - marginBottom - 10);
        }
      }
      
      // PDF 파일명 설정
      const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_A4.pdf`;
      
      // PDF 다운로드
      pdf.save(fileName);
      
      return pdf.output('blob');
    } finally {
      // 임시 요소 제거
      document.body.removeChild(container);
    }
  }
}

export default new PdfGenerator(); 