/**
 * HTML 요소에 스타일 적용
 * @param {HTMLElement} element - 스타일을 적용할 HTML 요소
 * @param {Object} settings - 스타일 설정
 */
export const applyStyles = (element, settings) => {
  if (!element) return;
  
  // 기본 스타일 설정
  element.style.fontFamily = settings.fontFamily;
  element.style.fontSize = `${settings.fontSize.body}px`;
  
  // 제목 스타일 설정
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    switch (heading.tagName.toLowerCase()) {
      case 'h1':
        heading.style.fontSize = `${settings.fontSize.heading1}px`;
        break;
      case 'h2':
        heading.style.fontSize = `${settings.fontSize.heading2}px`;
        break;
      case 'h3':
        heading.style.fontSize = `${settings.fontSize.heading2 - 2}px`;
        break;
      case 'h4':
      case 'h5':
      case 'h6':
        heading.style.fontSize = `${settings.fontSize.body + 2}px`;
        break;
    }
    heading.style.fontFamily = settings.fontFamily;
  });
  
  // 이미지 너비 제한
  const images = element.querySelectorAll('img');
  images.forEach(img => {
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
  });
  
  // 테이블 스타일 설정
  const tables = element.querySelectorAll('table');
  tables.forEach(table => {
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '16px';
    
    const cells = table.querySelectorAll('th, td');
    cells.forEach(cell => {
      cell.style.border = '1px solid #DFE1E6';
      cell.style.padding = '8px';
    });
    
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(cell => {
      cell.style.backgroundColor = '#F4F5F7';
      cell.style.fontWeight = 'bold';
    });
  });
  
  // 리스트 스타일 설정
  const lists = element.querySelectorAll('ul, ol');
  lists.forEach(list => {
    list.style.paddingLeft = '24px';
    list.style.marginBottom = '16px';
  });
  
  // 링크 스타일 설정
  const links = element.querySelectorAll('a');
  links.forEach(link => {
    link.style.color = '#0052CC';
    link.style.textDecoration = 'none';
  });
  
  // 코드 블록 스타일 설정
  const codeBlocks = element.querySelectorAll('pre, code');
  codeBlocks.forEach(block => {
    block.style.fontFamily = 'monospace';
    block.style.backgroundColor = '#F4F5F7';
    block.style.padding = '8px';
    block.style.borderRadius = '3px';
    block.style.whiteSpace = 'pre-wrap';
    block.style.overflowX = 'auto';
  });
  
  // 콘텐츠 맥락 유지 스타일 설정
  element.style.pageBreakInside = 'avoid';
  element.style.breakInside = 'avoid';
  
  // 여백 없는 요소 조정
  element.querySelectorAll('p').forEach(p => {
    p.style.marginTop = '0';
    p.style.marginBottom = '16px';
  });
  
  return element;
};

/**
 * Confluence 마크업을 A4에 최적화된 HTML로 변환
 * @param {string} htmlContent - Confluence HTML 콘텐츠
 * @returns {string} - 최적화된 HTML
 */
export const optimizeForA4 = (htmlContent) => {
  // 임시 컨테이너 생성
  const container = document.createElement('div');
  container.innerHTML = htmlContent;
  
  // 메타 태그, 스크립트 제거
  container.querySelectorAll('script, style, meta').forEach(el => el.remove());
  
  // Confluence 특정 스타일 제거
  container.querySelectorAll('[class^="confluence-"]').forEach(el => {
    el.removeAttribute('class');
  });
  
  // 불필요한 속성 제거
  container.querySelectorAll('*').forEach(el => {
    el.removeAttribute('data-*');
    el.removeAttribute('id');
  });
  
  // 페이지 나누기를 위한 클래스 적용
  container.querySelectorAll('h1, h2').forEach(heading => {
    heading.style.pageBreakBefore = 'always';
    heading.style.breakBefore = 'page';
  });
  
  // 이미지 주변에 페이지 나누기 방지
  container.querySelectorAll('img').forEach(img => {
    const wrapper = document.createElement('div');
    wrapper.style.pageBreakInside = 'avoid';
    wrapper.style.breakInside = 'avoid';
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
  });
  
  // 테이블 주변에 페이지 나누기 방지
  container.querySelectorAll('table').forEach(table => {
    table.style.pageBreakInside = 'avoid';
    table.style.breakInside = 'avoid';
  });
  
  return container.innerHTML;
};

/**
 * A4 페이지에 맞게 콘텐츠 분할
 * @param {HTMLElement} container - 콘텐츠 컨테이너
 * @param {number} pageHeight - 페이지 높이 (px)
 * @returns {Array<HTMLElement>} - 페이지별로 분할된 요소 배열
 */
export const splitContentIntoPages = (container, pageHeight) => {
  const pages = [];
  let currentPage = document.createElement('div');
  let currentHeight = 0;
  
  // 각 자식 요소를 순회하며 페이지 나누기
  Array.from(container.childNodes).forEach(node => {
    const clone = node.cloneNode(true);
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(clone);
    document.body.appendChild(tempDiv);
    
    const nodeHeight = tempDiv.offsetHeight;
    document.body.removeChild(tempDiv);
    
    // 요소가 페이지에 들어갈 수 있는지 확인
    if (currentHeight + nodeHeight > pageHeight) {
      // 현재 페이지가 비어있지 않으면 페이지 배열에 추가
      if (currentPage.childNodes.length > 0) {
        pages.push(currentPage);
        currentPage = document.createElement('div');
        currentHeight = 0;
      }
      
      // 요소가 한 페이지보다 크면 요소 분할 필요
      if (nodeHeight > pageHeight) {
        // 복잡한 요소 분할은 구현하지 않고, 요소를 그대로 추가
        currentPage.appendChild(node.cloneNode(true));
        pages.push(currentPage);
        currentPage = document.createElement('div');
        currentHeight = 0;
      } else {
        currentPage.appendChild(node.cloneNode(true));
        currentHeight = nodeHeight;
      }
    } else {
      currentPage.appendChild(node.cloneNode(true));
      currentHeight += nodeHeight;
    }
  });
  
  // 마지막 페이지 추가
  if (currentPage.childNodes.length > 0) {
    pages.push(currentPage);
  }
  
  return pages;
};

/**
 * A4 관련 유틸리티 함수
 */
export const a4Utils = {
  // A4 크기 상수 (mm)
  A4_WIDTH_MM: 210,
  A4_HEIGHT_MM: 297,
  
  // DPI (dots per inch)
  DPI: 96,
  
  // mm를 px로 변환 (96 DPI 기준)
  mmToPx: (mm) => mm * (96 / 25.4),
  
  // px를 mm로 변환
  pxToMm: (px) => px * (25.4 / 96),
  
  // A4 크기 (px)
  A4_WIDTH_PX: 210 * (96 / 25.4),
  A4_HEIGHT_PX: 297 * (96 / 25.4)
}; 