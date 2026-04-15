/**
 * Google Apps Script - 자연예쁨의원 상담 폼 수신
 *
 * ★ [중요] 배포 방법 - 반드시 순서대로 진행하세요
 * ──────────────────────────────────────────────────
 * 1. Google Sheets에서 "확장 프로그램" > "Apps Script" 열기
 * 2. 기존 코드 전체 선택 후 삭제, 이 코드 전체 붙여넣기
 * 3. 저장 (Ctrl+S / Cmd+S)
 * 4. "배포" > "새 배포" 클릭
 *    - 유형: 웹 앱 선택
 *    - 실행 사용자: 나 (본인 계정)
 *    - 액세스 권한: 모든 사용자 (Anonymous)
 *    - ↑ 이 설정이 없으면 외부에서 접근 불가
 * 5. "배포" 버튼 클릭 후 생성된 URL 복사
 * 6. script.js 파일의 SHEET_URL 상수에 복사한 URL 붙여넣기
 *
 * ★ [기존 배포가 있다면] 코드를 수정한 경우 반드시 "새 배포"를 해야 합니다.
 *    "배포 관리"에서 기존 배포를 편집해도 URL은 고정되지만
 *    새 버전이 적용되려면 "새 버전 배포"를 선택해야 합니다.
 *
 * [시트 컬럼 구조] (자동 생성됨)
 * A: 접수일시 | B: 이름 | C: 연락처 | D: 이메일
 * E: 고민유형 | F: 예상예산 | G: 희망일정 | H: 상세내용
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data  = {};

    // URLSearchParams(application/x-www-form-urlencoded)와 JSON 모두 지원
    if (e.postData && e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      // fetch + URLSearchParams 방식 (no-cors 호환)
      data = e.parameter;
    }

    // 첫 행에 헤더가 없으면 자동 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['접수일시', '이름', '연락처', '이메일', '고민유형', '예상예산', '희망일정', '상세내용']);
    }

    sheet.appendRow([
      new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      data.name    || '',
      data.phone   || '',
      data.email   || '',
      data.concern || '',
      data.budget  || '',
      data.date    || '',
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

// doGet: 배포 URL 접속 테스트용 (브라우저에서 URL 직접 열면 이 응답이 나옴)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: '자연예쁨의원 상담 폼 API — doGet OK' }))
    .setMimeType(ContentService.MimeType.JSON);
}
