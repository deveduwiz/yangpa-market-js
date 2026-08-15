# Yangpa Market

중고 거래 마켓 플레이스 웹 애플리케이션

## 기술 스택

### Backend (be)

- Node.js + Express
- Sequelize ORM
- MySQL
- JWT 인증
- Multer (파일 업로드)
- bcrypt (비밀번호 해싱)

### Frontend (fe)

- React 19
- Vite
- React Router v7

## 프로젝트 구조

```
yangpa-market-test/
├── be/                    # 백엔드
│   ├── config/            # DB 설정
│   ├── controllers/       # 컨트롤러
│   ├── middleware/        # 인증 미들웨어
│   ├── models/            # Sequelize 모델 (User, Sale)
│   ├── routes/            # API 라우트
│   ├── seeders/           # 시드 데이터
│   ├── services/          # 비즈니스 로직
│   └── app.js             # 엔트리 포인트
│
└── fe/                    # 프론트엔드
    └── src/
        ├── components/    # 공통 컴포넌트
        └── pages/         # 페이지 컴포넌트
            ├── SignUp.jsx     # 회원가입
            ├── SignIn.jsx     # 로그인
            ├── SaleList.jsx   # 판매글 목록
            ├── SaleDetail.jsx # 판매글 상세
            └── SaleNew.jsx    # 판매글 등록
```

## 설치 및 실행

### 사전 요구사항

- Node.js
- MySQL

### 백엔드 설정

```bash
cd be

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일 편집
```

`.env` 파일 설정:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=yangpa_market
JWT_SECRET=your_jwt_secret
SALT_ROUNDS=n
```

```bash
# 시드 데이터 생성 (선택)
npm run seed

# 개발 서버 실행
npm run dev
```

백엔드 서버: http://localhost:3000

### 프론트엔드 설정

```bash
cd fe

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

---

# API 명세서

| 항목       | 값                        |
| ---------- | ------------------------- |
| 서버       | `be` (Express 4)          |
| 포트       | 3000                      |
| 베이스 URL | `http://localhost:3000`   |
| DB         | MySQL 8 / 스키마 `yangpa` |

## 공통

- 요청/응답 본문은 JSON (상품 등록만 `multipart/form-data`)
- 인증은 `Authorization: Bearer <token>` 헤더
- 토큰 payload는 `{ email }`
- 금액은 정수(원), 시각은 ISO 8601

## 엔드포인트 요약

| No  | 기능      | Method | Endpoint                      | 인증 |
| --- | --------- | ------ | ----------------------------- | ---- |
| 1   | 회원가입  | POST   | `/members/sign-up`            | —    |
| 2   | 로그인    | POST   | `/members/sign-in`            | —    |
| 3   | 상품 등록 | POST   | `/sales`                      | 필요 |
| 4   | 상품 목록 | GET    | `/sales`                      | 필요 |
| 5   | 상품 단건 | GET    | `/sales/:id`                  | 필요 |
| -   | 이미지    | -      | 정적 파일 (`/public/images/`) | —    |

---

## 1. POST /members/sign-up

회원가입.

**요청**

```json
{ "email": "a@naver.com", "name": "홍길동", "password": "1234" }
```

| 필드     | 타입   | 필수 | 제약                   |
| -------- | ------ | ---- | ---------------------- |
| email    | String | O    | 50자, 중복 불가        |
| name     | String | O    | 50자                   |
| password | String | O    | bcrypt로 해싱되어 저장 |

**응답 201**

```json
{
  "success": true,
  "member": { "name": "홍길동", "email": "a@naver.com" },
  "message": "회원가입이 완료되었습니다."
}
```

| 코드 | 상황               |
| ---- | ------------------ |
| 409  | 이미 가입된 이메일 |
| 500  | 서버 오류          |

## 2. POST /members/sign-in

로그인.

**요청**

```json
{ "email": "a@naver.com", "password": "1234" }
```

**응답 200**

```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "message": "로그인에 성공했습니다."
}
```

| 코드 | 상황                 |
| ---- | -------------------- |
| 401  | 비밀번호 불일치      |
| 404  | 존재하지 않는 이메일 |

## 3. POST /sales (인증 필요)

상품 등록. `Content-Type: multipart/form-data`

| 필드        | 타입 | 필수 | 설명                    |
| ----------- | ---- | ---- | ----------------------- |
| title       | text | O    | 상품명 (50자)           |
| description | text | O    | 설명                    |
| price       | text | O    | 가격 (정수 문자열)      |
| photo       | file | O    | 이미지 1장 (100MB 이하) |

판매자(`email`)는 토큰에서 결정되며 요청 본문으로 받지 않습니다.

**응답 201**

```json
{
  "success": true,
  "data": {
    "id": 7,
    "title": "양파 10kg",
    "description": "국산 햇양파입니다",
    "price": 18000,
    "photo": "onion_1754000000000.png",
    "email": "a@naver.com",
    "createdAt": "2026-08-09T02:11:00.000Z",
    "updatedAt": "2026-08-09T02:11:00.000Z"
  },
  "message": "post 등록 성공"
}
```

| 코드 | 상황       |
| ---- | ---------- |
| 400  | photo 누락 |
| 401  | 토큰 없음  |
| 403  | 토큰 무효  |
| 500  | 서버 오류  |

## 4. GET /sales (인증 필요)

상품 목록.

| 쿼리  | 타입   | 기본값 | 설명                                    |
| ----- | ------ | ------ | --------------------------------------- |
| page  | Int    | 1      | 페이지 번호 (1부터)                     |
| size  | Int    | 10     | 페이지당 개수                           |
| email | String | —      | 지정 시 해당 판매자 상품만              |
| query | String | —      | 지정 시 title이 query를 포함하는 상품만 |

정렬은 `createdAt DESC` 고정입니다.

**응답 200**

```json
{
  "success": true,
  "data": [
    /* sale 객체 배열 */
  ],
  "count": 42,
  "message": "sales 조회성공"
}
```

`count`는 필터가 적용된 전체 건수입니다. 총 페이지 수는 `Math.ceil(count / size)`로 계산합니다.

## 5. GET /sales/:id (인증 필요)

상품 단건.

**응답 200**

```json
{
  "success": true,
  "data": {
    /* sale 1건 */
  },
  "message": "sale 조회성공"
}
```

## 이미지

`express.static`으로 `public/` 디렉터리를 정적 서빙합니다.

이미지 URL: `http://localhost:3000/images/{filename}`

**예시**

```
http://localhost:3000/images/1234567890-123456789.jpg
```

---

## 에러 코드

| 코드 | 의미                  | 발생 상황                          |
| ---- | --------------------- | ---------------------------------- |
| 400  | Bad Request           | photo 누락, 입력값 형식 오류       |
| 401  | Unauthorized          | Bearer 토큰 없음 / 비밀번호 불일치 |
| 403  | Forbidden             | 토큰이 유효하지 않음 (위조·만료)   |
| 404  | Not Found             | 존재하지 않는 이메일 / 리소스 없음 |
| 409  | Conflict              | 이미 가입된 이메일                 |
| 500  | Internal Server Error | DB 오류 등 서버 내부 오류          |

에러 응답 형태:

```json
{ "message": "에러 설명" }
```

## sale 객체

| 필드        | 타입   | 설명                 |
| ----------- | ------ | -------------------- |
| id          | Int    | 상품 번호            |
| title       | String | 상품명               |
| description | String | 설명                 |
| price       | Int    | 판매가 (원)          |
| email       | String | 판매자 이메일        |
| photo       | String | 이미지 파일명        |
| createdAt   | String | 등록 시각 (ISO 8601) |
| updatedAt   | String | 수정 시각 (ISO 8601) |

---

# DB 명세서

- DBMS: MySQL 8
- 스키마: `yangpa`
- ORM: Sequelize (`timestamps: true`, `paranoid: true`)
- 문자셋: `utf8mb4` / `utf8mb4_general_ci`

## 요구사항 명세

1. 회원 정보는 이메일, 이름, 비밀번호 정보를 가지고 이메일로 식별한다.
2. 회원은 상품 등록을 통해 상품을 판매할 수 있다.
3. 상품 정보는 상품명, 설명, 가격, 사진 정보를 가지고 대리키를 이용해서 식별한다.
4. 한 회원은 여러 상품을 등록할 수 있고, 하나의 상품은 반드시 한 명의 판매자에 속한다.
5. 상품 사진은 파일명만 저장하고 실제 파일은 서버의 파일 시스템에 보관한다.
6. 회원 탈퇴와 상품 삭제는 실제 행을 지우지 않고 삭제 일시를 기록한다.
7. 모든 테이블은 생성 일시와 수정 일시를 가진다.
8. 상품 목록은 최신 등록순으로 정렬하며 페이지 단위로 나누어 조회한다.
9. 검색어를 입력해서 검색어를 포함하는 상품을 조회한다.
10. 상품 등록과 조회는 로그인한 회원만 가능하다.
11. 상품을 등록한 회원은 탈퇴할 수 없다.

## ERD

```
user (1) ──< (N) sale
      email        email
```

`user.email`을 부모 키로, `sale.email`을 자식 키로 연결합니다.

## user

회원 정보.

| 컬럼      | 타입         | NULL | 키  | 설명                      |
| --------- | ------------ | ---- | --- | ------------------------- |
| email     | VARCHAR(50)  | N    | UQ  | 로그인 ID 겸 FK 참조 대상 |
| name      | VARCHAR(50)  | N    |     | 표시 이름                 |
| password  | VARCHAR(200) | N    |     | bcrypt 해시               |
| createdAt | DATETIME     | N    |     | 가입 시각                 |
| updatedAt | DATETIME     | N    |     | 수정 시각                 |
| deletedAt | DATETIME     | Y    |     | 탈퇴 시각 (soft delete)   |

- `email`은 UNIQUE. 중복 가입 시 409를 반환합니다.
- `password`는 평문을 저장하지 않으며 어떤 응답에도 포함되지 않습니다.

## sale

판매 상품.

| 컬럼        | 타입               | NULL | 키  | 설명                    |
| ----------- | ------------------ | ---- | --- | ----------------------- |
| id          | INT AUTO_INCREMENT | N    | PK  | 상품 번호               |
| title       | VARCHAR(50)        | N    |     | 상품명                  |
| description | TEXT               | N    |     | 상품 설명               |
| price       | INT                | N    |     | 판매가 (원, 0 이상)     |
| email       | VARCHAR(50)        | N    | FK  | 판매자 → `user.email`   |
| photo       | VARCHAR(200)       | N    |     | 저장된 이미지 파일명    |
| createdAt   | DATETIME           | N    |     | 등록 시각               |
| updatedAt   | DATETIME           | N    |     | 수정 시각               |
| deletedAt   | DATETIME           | Y    |     | 삭제 시각 (soft delete) |

- `photo`에는 파일명만 저장하고, 실제 파일은 서버의 `public/images/` 디렉터리에 둡니다.
- `email`은 토큰에서 추출한 값을 씁니다. 클라이언트가 보낸 값을 신뢰하지 않습니다.

## 조회 규칙

- 목록은 `createdAt DESC` 정렬, `limit`/`offset` 페이지네이션.
- `paranoid: true`이므로 삭제된 행은 기본 조회에서 자동 제외됩니다.

## 알려진 제약

- `sale.email`은 논리적 FK일 뿐 DB 레벨 제약이 아닙니다. Sequelize `associate`로만 연결돼 있습니다.
- 상품을 등록한 회원은 탈퇴 불가 — 애플리케이션 레벨에서 삭제 전 등록 상품 여부를 확인합니다.
- 회원당 상품 수, 상품당 이미지 수(현재 1장) 제한은 애플리케이션 레벨에서만 관리합니다.
