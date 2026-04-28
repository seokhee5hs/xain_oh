/**
 * API 통합 스크립트
 * 백엔드에서 동적 데이터를 로드하여 페이지에 렌더링합니다
 */

const API_BASE = 'http://localhost:5000/api';

// API 함수
const API = {
  async getPublications() {
    try {
      const response = await fetch(`${API_BASE}/publications`);
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error('Failed to load publications:', error);
      return [];
    }
  },

  async getAchievements() {
    try {
      const response = await fetch(`${API_BASE}/achievements`);
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error('Failed to load achievements:', error);
      return [];
    }
  },

  async getProjects() {
    try {
      const response = await fetch(`${API_BASE}/projects`);
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error('Failed to load projects:', error);
      return [];
    }
  },

  async getMembers() {
    try {
      const response = await fetch(`${API_BASE}/members`);
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error('Failed to load members:', error);
      return [];
    }
  },
};

// 렌더링 함수
const Render = {
  async publications(container) {
    const pubs = await API.getPublications();
    if (!pubs.length) {
      container.innerHTML = '<p style="color: var(--muted); grid-column: 1/-1;">논문이 없습니다</p>';
      return;
    }

    const grouped = {};
    pubs.forEach((pub) => {
      if (!grouped[pub.year]) grouped[pub.year] = [];
      grouped[pub.year].push(pub);
    });

    const html = Object.entries(grouped)
      .sort(([a], [b]) => b - a)
      .map(
        ([year, items]) => `
      <div class="publications-section">
        <h3>${year}</h3>
        <ul class="publication-list">
          ${items
            .map(
              (pub) => `
            <li>
              <span class="pub-type">${pub.type}</span>
              <span class="pub-title">${pub.title}</span>
              <span class="pub-authors">${pub.authors}</span>
              <span class="pub-journal">${pub.journal}</span>
              ${pub.doi ? `<span class="pub-doi"><a href="https://doi.org/${pub.doi}" target="_blank">DOI</a></span>` : ''}
            </li>
          `
            )
            .join('')}
        </ul>
      </div>
    `
      )
      .join('');
    container.innerHTML = html;
  },

  async achievements(container) {
    const achievements = await API.getAchievements();
    if (!achievements.length) {
      container.innerHTML = '<p style="color: var(--muted); grid-column: 1/-1;">성과가 없습니다</p>';
      return;
    }

    const grouped = {};
    achievements.forEach((a) => {
      if (!grouped[a.category]) grouped[a.category] = [];
      grouped[a.category].push(a);
    });

    const categoryLabels = {
      Academic: '학술 발표',
      Government: '정부 과제',
      Industry: '산학 협력',
      Award: '수상 및 인정',
    };

    const html = Object.entries(grouped)
      .map(
        ([category, items]) => `
      <article class="achievement-card">
        <h3>${categoryLabels[category] || category}</h3>
        <ul>
          ${items.map((item) => `<li>${item.title}${item.year ? ` (${item.year})` : ''}</li>`).join('')}
        </ul>
      </article>
    `
      )
      .join('');
    container.innerHTML = html;
  },

  async projects(container) {
    const projects = await API.getProjects();
    if (!projects.length) {
      container.innerHTML = '<p style="color: var(--muted); grid-column: 1/-1;">프로젝트가 없습니다</p>';
      return;
    }

    const html = projects
      .map(
        (project) => `
      <article>
        <p class="tag">${project.tag}</p>
        <h3>${project.title}</h3>
        <p>${project.description || ''}</p>
      </article>
    `
      )
      .join('');
    container.innerHTML = html;
  },

  async members(container) {
    const members = await API.getMembers();
    if (!members.length) {
      container.innerHTML = '<p style="color: var(--muted); grid-column: 1/-1;">팀원이 없습니다</p>';
      return;
    }

    const grouped = {
      Graduate: { label: 'Graduate Researchers', members: [] },
      Undergraduate: { label: 'Undergraduate Researchers', members: [] },
      Collaborator: { label: 'Collaborators', members: [] },
    };

    members.filter((m) => m.role !== 'PI').forEach((m) => {
      if (grouped[m.role]) grouped[m.role].members.push(m);
    });

    const html = Object.values(grouped)
      .filter((g) => g.members.length > 0)
      .map(
        (group) => `
      <article>
        <h3>${group.label}</h3>
        <p>${group.members.map((m) => m.name).join(', ')}</p>
      </article>
    `
      )
      .join('');
    container.innerHTML = html;
  },
};

// 페이지 로드 시 동적 콘텐츠 로드
window.addEventListener('load', () => {
  Render.publications(document.getElementById('publicationsList'));
  Render.achievements(document.getElementById('achievementsList'));
  Render.projects(document.getElementById('projectsList'));
  Render.members(document.getElementById('membersList'));
});
