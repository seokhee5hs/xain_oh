// 환경에 따라 API 베이스 URL 동적 설정
const getAPIBase = () => {
  const hostname = window.location.hostname;
  
  // 로컬 환경
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // 프로덕션 환경 (GitHub Pages 또는 배포된 서버)
  // 현재 도메인의 API 서버로 요청 (같은 도메인)
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  return `${protocol}//${hostname}${port}/api`;
};

const API_BASE = getAPIBase();

let authToken = localStorage.getItem('authToken');
let currentEditId = null;
let currentSection = 'publications';

// Form field definitions for each section
const formFields = {
  publications: [
    { name: 'title', label: '논문 제목', type: 'text', required: true },
    { name: 'authors', label: '저자명', type: 'text', required: true, placeholder: '저자1, 저자2' },
    { name: 'type', label: '논문 유형', type: 'select', options: ['Journal', 'Conference', 'Workshop'], required: true },
    { name: 'journal', label: '학술지/학술대회명', type: 'text', required: true },
    { name: 'year', label: '발표 연도', type: 'number', required: true },
    { name: 'doi', label: 'DOI', type: 'text', placeholder: '10.xxxx/xxxxx' },
    { name: 'url', label: '논문 링크', type: 'text', placeholder: 'https://...' },
    { name: 'abstract', label: '요약', type: 'textarea' },
  ],
  achievements: [
    { name: 'title', label: '성과명', type: 'text', required: true },
    { name: 'category', label: '분류', type: 'select', options: ['Academic', 'Government', 'Industry', 'Award'], required: true },
    { name: 'year', label: '연도', type: 'number' },
    { name: 'institution', label: '기관/단체', type: 'text' },
    { name: 'amount', label: '규모/금액', type: 'text', placeholder: '예: 5억원' },
    { name: 'status', label: '상태', type: 'select', options: ['Ongoing', 'Completed'] },
    { name: 'description', label: '설명', type: 'textarea' },
    { name: 'details', label: '세부 내용', type: 'text', placeholder: '쉼표로 구분' },
  ],
  projects: [
    { name: 'title', label: '프로젝트명', type: 'text', required: true },
    { name: 'tag', label: 'Tag', type: 'text', required: true, placeholder: 'AI NPC, XR UX, ...' },
    { name: 'description', label: '설명', type: 'textarea' },
    { name: 'status', label: '상태', type: 'select', options: ['Planning', 'In Progress', 'Completed'] },
    { name: 'startDate', label: '시작일', type: 'date' },
    { name: 'endDate', label: '종료일', type: 'date' },
    { name: 'team', label: '팀원', type: 'text', placeholder: '이름1, 이름2' },
    { name: 'technologies', label: '기술 스택', type: 'text', placeholder: 'Unity, Python, ...' },
    { name: 'results', label: '결과', type: 'textarea' },
  ],
  members: [
    { name: 'name', label: '이름', type: 'text', required: true },
    { name: 'role', label: '직책', type: 'select', options: ['PI', 'Graduate', 'Undergraduate', 'Collaborator'], required: true },
    { name: 'title', label: '직위', type: 'text' },
    { name: 'email', label: '이메일', type: 'email' },
    { name: 'phone', label: '전화', type: 'tel' },
    { name: 'bio', label: '소개', type: 'textarea' },
    { name: 'status', label: '상태', type: 'select', options: ['Active', 'Alumni', 'Visiting'] },
    { name: 'joinDate', label: '가입일', type: 'date' },
    { name: 'researchAreas', label: '연구 분야', type: 'text', placeholder: 'XR, AI, NPC' },
  ],
};

// DOM Elements
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const formModal = document.getElementById('formModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const dynamicForm = document.getElementById('dynamicForm');
const notification = document.getElementById('notification');
const navItems = document.querySelectorAll('.nav-item');

// Initialize
window.addEventListener('load', () => {
  if (authToken) {
    verifyToken();
  } else {
    showLoginPage();
  }
});

// Login Handler
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('로그인 실패');
    const data = await response.json();
    authToken = data.token;
    localStorage.setItem('authToken', authToken);
    showNotification('로그인 성공!', 'success');
    showDashboard();
  } catch (error) {
    showNotification('로그인 실패: ' + error.message, 'error');
  }
});

// Logout Handler
logoutBtn.addEventListener('click', () => {
  authToken = null;
  localStorage.removeItem('authToken');
  currentEditId = null;
  showNotification('로그아웃되었습니다', 'success');
  showLoginPage();
});

// Navigation Handlers
navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((i) => i.classList.remove('active'));
    item.classList.add('active');
    currentSection = item.dataset.section;
    switchSection();
  });
});

// Modal Handlers
closeModalBtn.addEventListener('click', closeModal);
formModal.addEventListener('click', (e) => {
  if (e.target === formModal) closeModal();
});

// Add buttons
document.getElementById('addPublicationBtn')?.addEventListener('click', () => openForm('publications'));
document.getElementById('addAchievementBtn')?.addEventListener('click', () => openForm('achievements'));
document.getElementById('addProjectBtn')?.addEventListener('click', () => openForm('projects'));
document.getElementById('addMemberBtn')?.addEventListener('click', () => openForm('members'));

// Functions
function showLoginPage() {
  loginPage.classList.add('active');
  dashboardPage.classList.remove('active');
}

function showDashboard() {
  loginPage.classList.remove('active');
  dashboardPage.classList.add('active');
  loadSection('publications');
}

function switchSection() {
  document.querySelectorAll('.content-section').forEach((section) => {
    section.classList.remove('active');
  });
  document.getElementById(currentSection).classList.add('active');
  loadSection(currentSection);
}

async function verifyToken() {
  try {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    if (response.ok) {
      showDashboard();
    } else {
      authToken = null;
      showLoginPage();
    }
  } catch (error) {
    authToken = null;
    showLoginPage();
  }
}

async function loadSection(section) {
  try {
    const response = await fetch(`${API_BASE}/${section}`);
    const items = await response.json();
    renderItems(section, items);
  } catch (error) {
    showNotification(`${section} 로드 실패`, 'error');
  }
}

function renderItems(section, items) {
  const container = document.getElementById(`${section}List`);
  if (!items.length) {
    container.innerHTML = '<p style="color: var(--muted); grid-column: 1/-1;">추가된 항목이 없습니다</p>';
    return;
  }

  container.innerHTML = items.map((item) => `
    <div class="item-card">
      <h3>${getItemTitle(section, item)}</h3>
      <p>${getItemSubtitle(section, item)}</p>
      ${getItemMeta(section, item)}
      <div class="item-actions">
        <button class="btn btn-ghost btn-small" onclick="editItem('${section}', '${item._id}')">수정</button>
        <button class="btn btn-danger btn-small" onclick="deleteItem('${section}', '${item._id}')">삭제</button>
      </div>
    </div>
  `).join('');
}

function getItemTitle(section, item) {
  switch (section) {
    case 'publications': return item.title;
    case 'achievements': return item.title;
    case 'projects': return item.title;
    case 'members': return item.name;
  }
}

function getItemSubtitle(section, item) {
  switch (section) {
    case 'publications': return `${item.authors} • ${item.year}`;
    case 'achievements': return `${item.category}${item.year ? ' • ' + item.year : ''}`;
    case 'projects': return item.status;
    case 'members': return item.role;
  }
}

function getItemMeta(section, item) {
  if (section === 'publications') {
    return `<div class="item-meta"><span class="item-badge">${item.type}</span><span class="item-badge">${item.journal}</span></div>`;
  }
  if (section === 'achievements') {
    return `<div class="item-meta"><span class="item-badge">${item.category}</span>${item.amount ? `<span class="item-badge">${item.amount}</span>` : ''}</div>`;
  }
  if (section === 'projects') {
    return `<div class="item-meta"><span class="item-badge">${item.tag}</span></div>`;
  }
  if (section === 'members') {
    return `<div class="item-meta"><span class="item-badge">${item.status}</span></div>`;
  }
  return '';
}

function openForm(section) {
  currentSection = section;
  currentEditId = null;
  document.getElementById('modalTitle').textContent = `${section} 추가`;
  renderForm(section, {});
  formModal.classList.add('active');
}

function editItem(section, id) {
  currentEditId = id;
  currentSection = section;
  document.getElementById('modalTitle').textContent = `${section} 수정`;
  loadAndRenderForm(section, id);
  formModal.classList.add('active');
}

async function loadAndRenderForm(section, id) {
  try {
    const response = await fetch(`${API_BASE}/${section}/${id}`);
    const item = await response.json();
    renderForm(section, item);
  } catch (error) {
    showNotification('데이터 로드 실패', 'error');
  }
}

function renderForm(section, item) {
  const fields = formFields[section];
  const form = dynamicForm;
  form.innerHTML = '';

  fields.forEach((field) => {
    const value = item[field.name] || '';
    let input;

    if (field.type === 'select') {
      input = document.createElement('div');
      input.className = 'form-group';
      input.innerHTML = `
        <label for="${field.name}">${field.label}</label>
        <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
          <option value="">선택하세요</option>
          ${field.options.map((opt) => `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`).join('')}
        </select>
      `;
    } else if (field.type === 'textarea') {
      input = document.createElement('div');
      input.className = 'form-group';
      input.innerHTML = `
        <label for="${field.name}">${field.label}</label>
        <textarea id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>${value}</textarea>
      `;
    } else {
      input = document.createElement('div');
      input.className = 'form-group';
      input.innerHTML = `
        <label for="${field.name}">${field.label}</label>
        <input type="${field.type}" id="${field.name}" name="${field.name}" value="${value}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>
      `;
    }
    form.appendChild(input);
  });

  const actions = document.createElement('div');
  actions.className = 'form-actions';
  actions.innerHTML = `
    <button type="button" class="btn btn-ghost" onclick="closeModal()">취소</button>
    <button type="submit" class="btn btn-primary">저장</button>
  `;
  form.appendChild(actions);
  form.onsubmit = (e) => handleFormSubmit(e, section);
}

async function handleFormSubmit(e, section) {
  e.preventDefault();
  const formData = new FormData(dynamicForm);
  const data = Object.fromEntries(formData);

  // Parse array fields
  if (data.details) data.details = data.details.split(',').map((s) => s.trim());
  if (data.team) data.team = data.team.split(',').map((s) => s.trim());
  if (data.technologies) data.technologies = data.technologies.split(',').map((s) => s.trim());
  if (data.researchAreas) data.researchAreas = data.researchAreas.split(',').map((s) => s.trim());

  try {
    const url = currentEditId
      ? `${API_BASE}/${section}/${currentEditId}`
      : `${API_BASE}/${section}`;
    const method = currentEditId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('저장 실패');
    showNotification('저장되었습니다', 'success');
    closeModal();
    loadSection(section);
  } catch (error) {
    showNotification('저장 실패: ' + error.message, 'error');
  }
}

async function deleteItem(section, id) {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  try {
    const response = await fetch(`${API_BASE}/${section}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    if (!response.ok) throw new Error('삭제 실패');
    showNotification('삭제되었습니다', 'success');
    loadSection(section);
  } catch (error) {
    showNotification('삭제 실패: ' + error.message, 'error');
  }
}

function closeModal() {
  formModal.classList.remove('active');
  currentEditId = null;
}

function showNotification(message, type = 'success') {
  notification.textContent = message;
  notification.className = `notification show ${type}`;
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}
