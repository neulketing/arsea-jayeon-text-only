/**
 * Google Apps Script - 자연예쁨의원 상담 폼 수신
 *
 * [설치 방법]
 * 1. Google Sheets에서 확장 프로그램 > Apps Script 열기
 * 2. 기존 코드 전체 삭제 후 이 코드 붙여넣기
 * 3. 배포 > 새 배포 > 웹 앱 선택
 *    - 실행 사용자: 나
 *    - 액세스 권한: 모든 사용자
 * 4. 배포 URL 복사하여 script.js의 SHEET_URL에 붙여넣기
 *
 * [시트 컬럼 구조] (첫 번째 행에 헤더)
 * A: 접수일시 | B: 이름 | C: 연락처 | D: 이메일 | E: 고민유형 | F: 예상예산 | G: 희망일정 | H: 상세내용
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // 첫 행에 헤더가 없으면 자동 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['접수일시', '이름', '연락처', '이메일', '고민유형', '예상예산', '희망일정', '상세내용']);
    }

    sheet.appendRow([
      new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.concern || '',
      data.budget || '',
      data.date || '',
      data.details || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: '자연예쁨의원 상담 폼 API' }))
    .setMimeType(ContentService.MimeType.JSON);
}
