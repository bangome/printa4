/**
 * A4 유틸리티 함수 모음
 */

// A4 크기 상수 (mm)
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

// DPI (dots per inch)
export const DPI = 96;

// mm를 px로 변환 (96 DPI 기준)
export const mmToPx = (mm) => mm * (DPI / 25.4);

// px를 mm로 변환
export const pxToMm = (px) => px * (25.4 / DPI);

// A4 크기 (px)
export const A4_WIDTH_PX = mmToPx(A4_WIDTH_MM);
export const A4_HEIGHT_PX = mmToPx(A4_HEIGHT_MM);

/**
 * mm를 pt로 변환 (72 DPI 기준)
 * @param {number} mm - 밀리미터 값
 * @returns {number} - 포인트 값
 */
export const mmToPt = (mm) => mm * (72 / 25.4);

/**
 * pt를 mm로 변환
 * @param {number} pt - 포인트 값
 * @returns {number} - 밀리미터 값
 */
export const ptToMm = (pt) => pt * (25.4 / 72);

/**
 * A4 용지 상 콘텐츠 영역 계산
 * @param {Object} margins - 여백 설정 {top, right, bottom, left} (mm)
 * @returns {Object} - 콘텐츠 영역 {width, height} (mm)
 */
export const calculateContentArea = (margins) => {
  const contentWidth = A4_WIDTH_MM - margins.left - margins.right;
  const contentHeight = A4_HEIGHT_MM - margins.top - margins.bottom;
  
  return {
    width: contentWidth,
    height: contentHeight,
    widthPx: mmToPx(contentWidth),
    heightPx: mmToPx(contentHeight)
  };
};

/**
 * 텍스트의 A4 용지 내 위치 계산
 * @param {string} text - 텍스트
 * @param {string} align - 정렬 방식 ('left', 'center', 'right')
 * @param {Object} margins - 여백 설정 {left, right} (mm)
 * @param {number} fontSize - 폰트 크기 (pt)
 * @returns {number} - X 좌표 (mm)
 */
export const calculateTextPosition = (text, align, margins, fontSize) => {
  // 텍스트 너비 계산 (대략적인 근사치)
  const textWidthMm = (text.length * fontSize * 0.6) / 72 * 25.4;
  
  switch (align) {
    case 'center':
      return A4_WIDTH_MM / 2 - textWidthMm / 2;
    case 'right':
      return A4_WIDTH_MM - margins.right - textWidthMm;
    case 'left':
    default:
      return margins.left;
  }
};

/**
 * 페이지 수 계산
 * @param {number} contentHeight - 콘텐츠 높이 (px)
 * @param {number} availableHeight - 페이지당 사용 가능한 높이 (px)
 * @returns {number} - 필요한 페이지 수
 */
export const calculatePageCount = (contentHeight, availableHeight) => {
  return Math.ceil(contentHeight / availableHeight);
};

export default {
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  DPI,
  mmToPx,
  pxToMm,
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  mmToPt,
  ptToMm,
  calculateContentArea,
  calculateTextPosition,
  calculatePageCount
}; 