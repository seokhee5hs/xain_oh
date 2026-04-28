# XAIN Lab 구조 전환 가이드

## 🎯 이전 구조 → 새로운 구조

### Before: 모든 콘텐츠가 index.html에 포함
```html
<!-- 이전: index.html (거대한 파일) -->
<section id="publications">
  <li>논문 1</li>
  <li>논문 2</li>
  <!-- 수작업으로 매번 수정 필요 -->
</section>
```

### After: 백엔드에서 관리
```
웹사이트 (index.html)
   ↓
 API 호출 (js/api.js)
   ↓
Node.js 백엔드 (server.js)
   ↓
MongoDB 데이터베이스
   ↓
관리자 대시보드 (admin/)
```

---

## 🚀 빠른 시작 (5분)

### Step 1: 환경 준비
```bash
npm install
cp .env.example .env
# .env 파일에서 MongoDB URI 설정
```

### Step 2: 서버 실행
```bash
npm run dev
```

### Step 3: 브라우저 확인
- 메인 사이트: http://localhost:5000
- 관리자: http://localhost:5000/admin
- 기본 계정: admin@xainlab.ac.kr / AdminPass123!

---

## 📊 데이터 흐름

### 1. 논문 추가 (관리자)
```
관리자 대시보드
  ↓
[+ 논문 추가] 클릭
  ↓
폼 작성 및 저장
  ↓
POST /api/publications (JWT 토큰)
  ↓
MongoDB에 저장
  ↓
응답: { success: true, id: "..." }
```

### 2. 논문 표시 (방문자)
```
웹사이트 로드
  ↓
GET /api/publications
  ↓
MongoDB에서 조회
  ↓
js/api.js에서 렌더링
  ↓
페이지에 표시
```

---

## 🔑 핵심 API

### Publications (논문)
```javascript
// 조회
GET /api/publications

// 추가 (관리자만)
POST /api/publications
{
  "title": "Thesis Title",
  "authors": "Author1, Author2",
  "type": "Journal",
  "journal": "Journal Name",
  "year": 2024,
  "doi": "10.xxxx/xxxxx",
  "url": "https://...",
  "abstract": "..."
}

// 수정
PUT /api/publications/:id

// 삭제
DELETE /api/publications/:id
```

### Achievements (성과)
```javascript
GET /api/achievements
POST /api/achievements
PUT /api/achievements/:id
DELETE /api/achievements/:id
```

### Projects (프로젝트)
```javascript
GET /api/projects
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id
```

### Members (팀원)
```javascript
GET /api/members
POST /api/members
PUT /api/members/:id
DELETE /api/members/:id
```

---

## 🎨 프론트엔드 수정 방법

### 정적 콘텐츠 (HTML에서 직접)
- Home, About, Research, Contact
- 파일: `index.html`

### 동적 콘텐츠 (관리자 대시보드에서)
- Publications, Achievements, Projects, Members
- 관리: `admin/` 접속

---

## 🔐 인증 방식

### JWT (JSON Web Token)
```
로그인
  ↓
토큰 발급 (7일 유효)
  ↓
LocalStorage에 저장
  ↓
모든 요청에 Authorization 헤더에 포함
  ↓
서버: 토큰 검증
```

---

## 📈 확장 방법

### 새로운 필드 추가 예시 (논문에 "키워드" 추가)

#### 1. 모델 수정 (models/Publication.js)
```javascript
const PublicationSchema = new mongoose.Schema({
  title: String,
  authors: String,
  // ... 기존 필드 ...
  keywords: [String],  // ← 추가
  createdAt: { type: Date, default: Date.now },
});
```

#### 2. 관리자 폼 수정 (admin/admin.js)
```javascript
const formFields = {
  publications: [
    { name: 'title', label: '논문 제목', type: 'text' },
    // ... 기존 필드 ...
    { name: 'keywords', label: '키워드', type: 'text', placeholder: 'keyword1, keyword2' },  // ← 추가
  ],
};
```

#### 3. 프론트엔드 렌더링 수정 (js/api.js)
```javascript
const html = pubs.map(pub => `
  <h3>${pub.title}</h3>
  <p>${pub.authors} • ${pub.year}</p>
  <p>키워드: ${pub.keywords?.join(', ')}</p>  <!-- ← 추가 -->
`);
```

---

## 🧪 테스트 방법

### cURL로 API 테스트
```bash
# 논문 조회
curl http://localhost:5000/api/publications

# 로그인
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@xainlab.ac.kr","password":"AdminPass123!"}'

# 논문 추가 (TOKEN 받은 후)
curl -X POST http://localhost:5000/api/publications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test","authors":"Author","type":"Journal","journal":"Journal","year":2024}'
```

### Postman으로 테스트
1. Postman 설치
2. `POST /api/auth/login` → 토큰 복사
3. `Headers`에 `Authorization: Bearer <token>` 추가
4. CRUD 작업 테스트

---

## 📊 데이터 마이그레이션

기존 index.html의 데이터를 MongoDB로 마이그레이션하려면:

### Option 1: 관리자 대시보드에서 수동 입력
1. admin 접속
2. 각 항목별로 추가

### Option 2: 스크립트로 자동 마이그레이션
```javascript
// migrate.js
const mongoose = require('mongoose');
const Publication = require('./models/Publication');

const oldData = [
  { title: '...', authors: '...', ... },
  // ...
];

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Publication.insertMany(oldData);
  console.log('Migration complete!');
}
```

---

## ⚙️ 환경 변수 설정

```env
# 서버
PORT=5000
NODE_ENV=development

# 데이터베이스
MONGODB_URI=mongodb://localhost:27017/xain_lab

# 보안
JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=admin@xainlab.ac.kr
ADMIN_PASSWORD=AdminPass123!

# CORS
CLIENT_URL=http://localhost:3000
```

---

## 🎓 학습 리소스

- [Express.js 공식 문서](https://expressjs.com)
- [MongoDB 공식 문서](https://docs.mongodb.com)
- [JWT 개념](https://jwt.io)
- [RESTful API 설계](https://restfulapi.net)

---

## 🆘 도움말

### 문제: "Cannot connect to MongoDB"
```bash
# MongoDB 실행 확인
mongod --version

# 또는 .env 확인
echo $MONGODB_URI
```

### 문제: "Admin 로그인 실패"
```bash
# 서버 로그 확인
npm run dev

# 또는 curl로 테스트
curl -X POST http://localhost:5000/api/auth/login -d '{...}'
```

### 문제: "Dynamic content not loading"
```javascript
// js/api.js 콘솔에서 확인
console.log(await API.getPublications());
```

---

**마지막 업데이트**: 2026-04-28
