# 알림 신청 폼 → Google Sheets 연동 설정

`/api/notify` POST 라우트가 Google Sheets API를 호출해서 행을 추가합니다.
서비스 계정(Service Account) 방식이라 한 번만 설정하면 안정적으로 작동합니다.

---

## 1. Google Sheet 준비

1. 새 Google Sheet 만들기 (예: "HASLA · 알림 신청 명단")
2. **시트 탭 이름**을 `Sheet1`로 두거나, 다른 이름으로 두려면 나중에 `GOOGLE_SHEET_TAB_NAME` env로 지정.
3. 1행에 헤더(원하면) — 코드는 `A:G` 컬럼에 행을 추가합니다:

   | A | B | C | D | E | F | G |
   |---|---|---|---|---|---|---|
   | 일시 | 이메일 | 전화번호 | 언어 | source | 동의 | 동의버전 |

4. 주소창의 URL에서 **Sheet ID** 복사 (`/d/` 다음, `/edit` 전):
   `https://docs.google.com/spreadsheets/d/[이게_시트_ID입니다]/edit`

---

## 2. Google Cloud Service Account 생성

1. https://console.cloud.google.com 접속 (Google 계정 로그인)
2. 좌상단 프로젝트 선택 → **새 프로젝트** (이미 있으면 그거 사용)
3. 좌측 메뉴 [API 및 서비스] → [라이브러리] → **"Google Sheets API"** 검색 → **사용 설정**
4. 좌측 메뉴 [API 및 서비스] → [사용자 인증 정보] → 상단 [+ 사용자 인증 정보 만들기] → **서비스 계정**
   - 서비스 계정 이름: `hasla-notify` (자유)
   - [완료]
5. 만들어진 서비스 계정 클릭 → 상단 [키] 탭 → [키 추가] → **새 키 만들기** → **JSON** → JSON 파일 다운로드
6. JSON 파일 열어서 두 값 복사 보관:
   - `"client_email"`: `hasla-notify@...iam.gserviceaccount.com`
   - `"private_key"`: `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` (긴 문자열)

---

## 3. Sheet에 서비스 계정 공유

1. 1번에서 만든 Google Sheet 열기
2. 우측 상단 [공유] 버튼
3. 사람 추가 칸에 **서비스 계정 이메일**(`...iam.gserviceaccount.com`) 붙여넣기
4. 권한: **편집자** ← 중요
5. "이메일 알림 보내기" 체크 해제 → [공유]

서비스 계정이 시트의 편집자가 되어야 행 추가가 가능합니다.

---

## 4. Vercel 환경변수 설정

Vercel → hasla-gangneung 프로젝트 → Settings → **Environment Variables** → Create

3개 (필수) + 1개 (선택) 등록:

| Key | Value | Environment |
|---|---|---|
| `GOOGLE_SHEET_ID` | 1단계에서 복사한 Sheet ID | Production / Preview / Development |
| `GOOGLE_CLIENT_EMAIL` | 2단계의 client_email | 모두 |
| `GOOGLE_PRIVATE_KEY` | 2단계의 private_key (전체, 줄바꿈 포함) | 모두 |
| `GOOGLE_SHEET_TAB_NAME` | (선택) 시트 탭 이름이 `Sheet1`이 아니면 그 이름 | 모두 |

> **GOOGLE_PRIVATE_KEY 입력 주의**:
> JSON 파일에서 복사한 그대로 붙여넣으면 됩니다. 따옴표 안 붙여요.
> `\n`이 문자 그대로(역슬래시 + n) 들어있어도, 코드에서 자동으로 진짜 줄바꿈으로 변환합니다.
> 첫 줄 `-----BEGIN PRIVATE KEY-----`부터 마지막 줄 `-----END PRIVATE KEY-----`까지 전부 한 칸에 붙여넣으세요.

기존 `NEXT_PUBLIC_NOTIFY_ENDPOINT`는 더 이상 안 씁니다 — **삭제**해도 됩니다.

---

## 5. 재배포

Vercel → Deployments 탭 → 최신 배포 우측 [⋯] → **Redeploy** → Use existing Build Cache 체크 해제 → Redeploy

배포 완료까지 1~2분.

---

## 6. 동작 확인

### 환경변수 점검 (브라우저로)

`https://hasla-gangneung.vercel.app/api/notify` 를 그냥 브라우저에서 열어보세요.

다음과 같이 떠야 정상:
```json
{
  "ok": true,
  "env": {
    "GOOGLE_SHEET_ID": "set (1aBc2D…)",
    "GOOGLE_CLIENT_EMAIL": "hasla-notify@...iam.gserviceaccount.com",
    "GOOGLE_PRIVATE_KEY": "set",
    "GOOGLE_SHEET_TAB_NAME": "Sheet1 (default)"
  }
}
```

뭐 하나라도 `MISSING`이면 그 env가 등록 안 된 것.

### 실제 신청 테스트

`/feedback` 가서 알림 신청 폼에 본인 이메일 입력 + 동의 체크 → 신청하기.

성공하면:
- 폼에 초록색 "신청 완료!" 메시지
- Google Sheet에 새 행 즉시 추가됨

실패 시:
- Vercel → Deployments → 해당 배포 → Functions 로그에서 에러 확인 가능
- 가장 흔한 실수:
  - 시트에 서비스 계정 이메일을 **편집자**로 공유 안 함 (3단계)
  - GOOGLE_PRIVATE_KEY 복사할 때 일부 누락
  - 시트 탭 이름이 다른데 GOOGLE_SHEET_TAB_NAME 안 줌

---

설정 막히면 어디서 막혔는지 알려주세요!
