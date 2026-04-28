# XAIN Lab - XR AI NPC Interaction Lab

## 🚀 프로젝트 개요

XAIN Lab 웹사이트의 완전한 리팩토링으로, **Node.js 백엔드 + MongoDB + Admin Dashboard**를 포함한 현대적인 웹 애플리케이션으로 전환되었습니다.

### 주요 특징

✅ **페이지별 분리** - 각 섹션이 모듈화된 구조  
✅ **동적 콘텐츠** - 백엔드에서 데이터 관리  
✅ **관리자 대시보드** - 웹 UI로 쉽게 콘텐츠 추가/수정/삭제  
✅ **JWT 인증** - 안전한 관리자 로그인  
✅ **RESTful API** - 확장 가능한 백엔드 구조  

---

## 📁 프로젝트 구조

```
xain_oh/
├── server.js                    # Node.js 메인 서버
├── package.json                 # 의존성 정의
├── .env.example                 # 환경 변수 템플릿
│
├── config/
│   └── db.js                    # MongoDB 연결 설정
│
├── middleware/
│   └── auth.js                  # JWT 인증 미들웨어
│
├── models/                      # MongoDB 스키마
│   ├── Publication.js           # 논문 스키마
│   ├── Achievement.js           # 성과 스키마
│   ├── Project.js               # 프로젝트 스키마
│   └── Member.js                # 팀원 스키마
│
├── routes/                      # API 라우트
│   ├── auth.js                  # 로그인/인증
│   ├── publications.js          # 논문 CRUD
│   ├── achievements.js          # 성과 CRUD
│   ├── projects.js              # 프로젝트 CRUD
│   └── members.js               # 팀원 CRUD
│
├── admin/                       # 관리자 대시보드
│   ├── index.html               # 관리자 페이지
│   ├── admin.css                # 관리자 스타일
│   └── admin.js                 # 관리자 스크립트
│
├── public/                      # 프론트엔드 (정적 파일)
│   ├── index.html               # 메인 페이지
│   ├── styles.css               # 메인 스타일
│   ├── script.js                # 페이지 네비게이션
│   ├── js/
│   │   └── api.js               # API 호출 및 렌더링
│   ├── pics/                    # 이미지
│   └── ...
│
└── uploads/                     # 업로드된 파일 (나중 구현)
```

---

## 🛠️ 설치 및 실행

### 1️⃣ 사전 요구사항

- **Node.js** (v14 이상)
- **MongoDB** (로컬 또는 클라우드 - MongoDB Atlas)
- **npm** 또는 **yarn**

### 2️⃣ 백엔드 설정

```bash
# 1. 프로젝트 디렉토리 이동
cd xain_oh

# 2. 의존성 설치
npm install

# 3. .env 파일 생성 (.env.example 복사)
cp .env.example .env

# 4. .env 파일 수정 (본인 MongoDB URI 및 JWT 시크릿 입력)
vim .env
```

**.env 파일 예시:**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/xain_lab
JWT_SECRET=your_super_secret_key_here
ADMIN_EMAIL=admin@xainlab.ac.kr
ADMIN_PASSWORD=AdminPass123!
CLIENT_URL=http://localhost:3000
```

### 3️⃣ MongoDB 준비

**로컬 MongoDB 사용 시:**
```bash
# MongoDB 서버 실행
mongod
```

**MongoDB Atlas (클라우드) 사용 시:**
1. https://www.mongodb.com/cloud/atlas 방문
2. 계정 생성 및 Cluster 생성
3. Connection String 복사
4. `.env`의 `MONGODB_URI` 에 붙여넣기

### 4️⃣ 서버 시작

```bash
# 개발 모드 (nodemon으로 자동 재시작)
npm run dev

# 또는 프로덕션 모드
npm start
```

✅ 서버가 http://localhost:5000 에서 실행됩니다.

---

## 📊 관리자 대시보드 사용법

### 접근 방법

1. **브라우저에서 접속**
   ```
   http://localhost:5000/admin
   ```

2. **로그인**
   - 이메일: `admin@xainlab.ac.kr`
   - 비밀번호: `AdminPass123!` (.env에서 변경 가능)

### 대시보드 기능

#### 📄 논문 관리
- ✅ 논문 추가/수정/삭제
- 필드: 제목, 저자, 유형(Journal/Conference/Workshop), 학술지명, 발표연도, DOI, URL, 요약

#### 🏆 성과 관리
- ✅ 성과 추가/수정/삭제
- 필드: 성과명, 분류(Academic/Government/Industry/Award), 연도, 기관명, 규모/금액, 상태, 설명, 세부 내용

#### 🔬 프로젝트 관리
- ✅ 프로젝트 추가/수정/삭제
- 필드: 프로젝트명, 태그, 설명, 상태(Planning/In Progress/Completed), 시작일, 종료일, 팀원, 기술스택, 결과

#### 👥 팀원 관리
- ✅ 팀원 추가/수정/삭제
- 필드: 이름, 직책(PI/Graduate/Undergraduate/Collaborator), 직위, 이메일, 전화, 소개, 상태(Active/Alumni/Visiting), 가입일, 연구분야

---

## 🌐 API 엔드포인트

### 인증

```bash
# 로그인
POST /api/auth/login
Body: { "email": "admin@xainlab.ac.kr", "password": "AdminPass123!" }
Response: { "token": "jwt_token_here", "email": "...", "role": "admin" }

# 토큰 검증
GET /api/auth/verify
Header: Authorization: Bearer <token>
```

### 논문 API

```bash
# 모든 논문 조회
GET /api/publications

# 특정 논문 조회
GET /api/publications/:id

# 논문 추가 (인증 필요)
POST /api/publications
Header: Authorization: Bearer <token>
Body: { title, authors, type, journal, year, ... }

# 논문 수정
PUT /api/publications/:id
Header: Authorization: Bearer <token>

# 논문 삭제
DELETE /api/publications/:id
Header: Authorization: Bearer <token>
```

### 성과/프로젝트/팀원

동일한 패턴으로:
- `/api/achievements`
- `/api/projects`
- `/api/members`

---

## 🎨 프론트엔드 구조

### 페이지 구성

1. **Home** - 소개 및 주요 메시지
2. **About** - 연구실 소개 및 원칙
3. **Research** - 연구 분야 4개 카드
4. **Projects** - 진행 중인 프로젝트 (동적 로드)
5. **Achievements** - 성과 및 수주 현황 (동적 로드)
6. **Publications** - 학술 논문 (동적 로드)
7. **Members** - 팀원 정보 (동적 로드)
8. **Contact** - 연락처 정보

### 동적 콘텐츠 로딩

**js/api.js**에서 백엔드로부터 데이터를 가져와 자동으로 렌더링합니다:

```javascript
const API = {
  async getPublications() { /* ... */ },
  async getAchievements() { /* ... */ },
  async getProjects() { /* ... */ },
  async getMembers() { /* ... */ },
};
```

---

## 📝 논문 추가 예시

### 관리자 대시보드에서:
1. "📄 논문 관리" 클릭
2. "+ 논문 추가" 클릭
3. 폼 작성:
   - 제목: "Interactive Storytelling in XR"
   - 저자: "Oh Seok Hee, Kim Min Jae"
   - 유형: "Conference"
   - 학술지명: "CHI 2024"
   - 발표연도: 2024
   - DOI: "10.1145/xxxxx"
4. "저장" 클릭

### 웹사이트에 자동 반영:
- Publications 페이지에 즉시 표시됨
- 연도별로 정렬됨

---

## 🔐 보안 설정

### 프로덕션 배포 시 필수 조치

1. **JWT_SECRET 변경**
   ```env
   JWT_SECRET=your_random_secure_key_at_least_32_chars_long
   ```

2. **기본 관리자 비밀번호 변경**
   ```env
   ADMIN_PASSWORD=NewSecurePassword123!
   ```

3. **CORS 설정 (배포된 프론트엔드 URL로 제한)**
   ```javascript
   // server.js
   app.use(cors({
     origin: process.env.CLIENT_URL,
     credentials: true
   }));
   ```

4. **HTTPS 활성화**
   - Let's Encrypt 무료 SSL 인증서 사용

---

## 🚀 배포 가이드

### Render.com (권장)

1. GitHub에 푸시
2. https://render.com 방문
3. "New" → "Web Service"
4. GitHub 저장소 연결
5. 환경 변수 설정
6. 배포

### Heroku

```bash
# Heroku CLI 설치 후
heroku create xain-lab
heroku addons:create mongolab:sandbox
git push heroku main
```

### AWS, Google Cloud, Azure
- EC2/App Engine/App Service에 배포
- 자세한 가이드는 각 서비스 문서 참조

---

## 🐛 트러블슈팅

### "MongoDB connection failed"
```bash
# MongoDB 서버 확인
mongod --version

# 또는 MongoDB Atlas URI 확인
# .env의 MONGODB_URI 정확한지 확인
```

### "CORS error"
```javascript
// server.js에서 CORS 활성화 확인
app.use(cors());
```

### "Admin page not loading"
- Node.js 서버가 실행 중인지 확인
- http://localhost:5000/api/health 접속
- 브라우저 개발자 도구에서 네트워크 탭 확인

---

## 📚 주요 라이브러리

- **Express** - 웹 프레임워크
- **Mongoose** - MongoDB ODM
- **JWT** - 토큰 인증
- **bcryptjs** - 비밀번호 해싱
- **CORS** - 크로스 도메인 요청
- **Helmet** - 보안 헤더

---

## 🎯 다음 단계

### Phase 2 구현 예정
- [ ] 파일 업로드 (프로필 사진, 논문 PDF)
- [ ] 이메일 알림
- [ ] 고급 검색 및 필터링
- [ ] 사용자 댓글/피드백
- [ ] SEO 최적화
- [ ] 다국어 지원 (EN/KO)
- [ ] 모바일 앱

---

## 📞 연락처

- **이메일**: your.email@university.ac.kr
- **웹사이트**: http://localhost:3000 (또는 배포 URL)
- **관리자 대시보드**: http://localhost:5000/admin

---

## 📄 라이선스

MIT License - 자유롭게 수정 및 배포 가능

---

## 🤝 기여 방법

1. Fork the repository
2. Feature branch 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. Branch 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

---

**마지막 업데이트**: 2026-04-28
