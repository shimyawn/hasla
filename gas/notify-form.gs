/**
 * HASLA — 정식 오픈 알림 신청 폼 → Google Sheets 저장 스크립트
 *
 * 설정 순서:
 *   1) 새 Google Sheet 만들기 (예: "HASLA · 알림 신청 명단")
 *      - 1행 헤더 추가: 일시 | 이메일 | 전화번호 | 언어 | source
 *   2) 시트의 [확장 프로그램] → [Apps Script] 열기
 *   3) 이 파일 내용 전체를 코드 영역에 붙여넣고 저장
 *   4) [배포] → [새 배포] → 유형: 웹 앱
 *      - 설명: HASLA notify form
 *      - 액세스: "본인" 으로 실행
 *      - 액세스 권한: "모든 사용자" (또는 "익명 사용자 포함")
 *   5) 발급된 웹 앱 URL을 복사 → Vercel 환경변수에 추가
 *      Key:   NEXT_PUBLIC_NOTIFY_ENDPOINT
 *      Value: <복사한 URL>
 *      재배포하면 폼이 활성화됩니다.
 *
 * 비고: 클라이언트는 mode:'no-cors' + Content-Type:text/plain 으로 보냅니다.
 *      그래서 응답을 읽지는 못하지만 시트에는 정상적으로 적재됩니다.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
    var data = {}
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents)
      } catch (parseErr) {
        // ignore — fall through with empty data
      }
    }
    sheet.appendRow([
      new Date(),
      data.email || '',
      data.phone || '',
      data.lang || '',
      data.source || '',
    ])
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

// 배포 확인용 — 웹 앱 URL을 브라우저로 열면 이 응답이 보입니다.
function doGet() {
  return ContentService
    .createTextOutput('HASLA notify endpoint OK')
    .setMimeType(ContentService.MimeType.TEXT)
}
