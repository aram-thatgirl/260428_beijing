/* =========================================================
   SK China · Beijing AI Training — Student Dashboard script
   - prompt rendering · tab · copy · compare toggle · checklist
   ========================================================= */

(function () {
  'use strict';

  const PROMPTS = window.PROMPTS || [];

  const PART_LABEL = {
    1: 'Part 1 · AI 프롬프트 기초',
    2: 'Part 2 · 데이터 분석',
    3: 'Part 3 · AI 리서치',
    4: 'Part 4 · PPT 제작'
  };

  /* ---------- helpers ---------- */
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;',
      '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  const copyIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>`;

  function paneHTML(lang, text) {
    const langAttr = lang === 'zh' ? 'zh' : 'ko';
    const aria = lang === 'zh' ? 'Copy Chinese prompt' : 'Copy Korean prompt';
    return `
      <div class="prompt__pane${lang === 'kr' ? ' is-active' : ''}" data-lang="${lang}" lang="${langAttr}">
        <pre>${escapeHTML(text)}</pre>
        <button class="prompt__copy" data-copy="${lang}" aria-label="${aria}" type="button">
          ${copyIcon}<span class="label">Copy</span>
        </button>
      </div>`;
  }

  function comparePaneHTML(lang, text) {
    const langAttr = lang === 'zh' ? 'zh' : 'ko';
    const aria = lang === 'zh' ? 'Copy Chinese prompt' : 'Copy Korean prompt';
    return `
      <div class="prompt__pane" data-lang="${lang}" lang="${langAttr}">
        <pre>${escapeHTML(text)}</pre>
        <button class="prompt__copy" data-copy="${lang}" aria-label="${aria}" type="button">
          ${copyIcon}<span class="label">Copy</span>
        </button>
      </div>`;
  }

  function promptCard(p) {
    return `
      <article class="prompt" id="${p.id}" data-view="tabs">
        <header class="prompt__head">
          <div class="prompt__part">${PART_LABEL[p.part]}</div>
          <div class="prompt__title">
            ${escapeHTML(p.title_ko)}
            <span class="prompt__title-zh">${escapeHTML(p.title_zh)}</span>
          </div>
          <div class="prompt__intent">
            ${escapeHTML(p.intent_ko)}
            <span class="prompt__intent-zh">${escapeHTML(p.intent_zh)}</span>
          </div>
        </header>

        <div class="tabs" role="tablist">
          <button class="tab is-active" data-tab="kr" role="tab" type="button">한국어</button>
          <button class="tab" data-tab="zh" role="tab" type="button">中文</button>
        </div>

        <div class="prompt__body">
          ${paneHTML('kr', p.kr)}
          ${paneHTML('zh', p.zh)}

          <div class="prompt__compare">
            ${comparePaneHTML('kr', p.kr)}
            ${comparePaneHTML('zh', p.zh)}
          </div>
        </div>
      </article>
    `;
  }

  function renderPrompts() {
    const byPart = { 1: [], 2: [], 3: [], 4: [] };
    PROMPTS.forEach((p) => {
      if (byPart[p.part]) byPart[p.part].push(p);
    });

    Object.keys(byPart).forEach((part) => {
      const mount = document.querySelector(`[data-prompts="part${part}"]`);
      if (mount) mount.innerHTML = byPart[part].map(promptCard).join('');
    });
  }

  /* ---------- tab switching (within card) ---------- */
  function onTabClick(e) {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    const card = tab.closest('.prompt');
    if (!card) return;
    const lang = tab.dataset.tab;
    card.querySelectorAll('.tabs .tab').forEach((t) =>
      t.classList.toggle('is-active', t === tab));
    card.querySelectorAll('.prompt__body > .prompt__pane').forEach((p) =>
      p.classList.toggle('is-active', p.dataset.lang === lang));
  }

  /* ---------- copy ---------- */
  async function onCopyClick(e) {
    const btn = e.target.closest('.prompt__copy');
    if (!btn) return;
    e.preventDefault();
    const pane = btn.closest('.prompt__pane');
    const pre  = pane && pane.querySelector('pre');
    if (!pre) return;
    const text = pre.textContent;

    const flash = (ok) => {
      btn.classList.toggle('is-copied', ok);
      const label = btn.querySelector('.label');
      if (label) label.textContent = ok ? 'Copied' : 'Failed';
      setTimeout(() => {
        btn.classList.remove('is-copied');
        if (label) label.textContent = 'Copy';
      }, 1800);
    };

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        flash(true); return;
      }
      throw new Error('clipboard unavailable');
    } catch (_) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.top = '-999px';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        flash(ok);
      } catch (__) { flash(false); }
    }
  }

  /* ---------- global tabs/compare toggle ---------- */
  function onViewToggle(e) {
    const b = e.target.closest('.view-toggle button');
    if (!b) return;
    const wrap = b.closest('.view-toggle');
    const view = b.dataset.view;
    wrap.querySelectorAll('button').forEach((x) =>
      x.classList.toggle('is-active', x === b));
    // apply to every prompt on the page
    document.querySelectorAll('.prompt').forEach((card) => {
      card.dataset.view = view;
    });
  }

  /* ---------- checklist toggle ---------- */
  function onChecklistClick(e) {
    const li = e.target.closest('.checklist li');
    if (!li) return;
    li.classList.toggle('is-checked');
  }

  /* ---------- force CSV download (works in file://, preview, hosted) ---------- */
  function triggerBlobDownload(content, filename) {
    // UTF-8 BOM so Excel opens Korean/Chinese correctly
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  async function onDownloadClick(e) {
    const btn = e.target.closest('[data-csv]');
    if (!btn) return;
    e.preventDefault();

    const key = btn.getAttribute('data-csv');       // 'KR' or 'CN'
    const data = (window.CSV_DATA || {})[key];
    if (!data) return;

    const cta = btn.querySelector('.dl-card__cta span');
    const originalLabel = cta ? cta.textContent : null;
    if (cta) cta.textContent = '…';

    try {
      triggerBlobDownload(data.content, data.filename);
      if (cta) cta.textContent = 'Saved';
      setTimeout(() => { if (cta && originalLabel) cta.textContent = originalLabel; }, 1600);
    } catch (err) {
      if (cta && originalLabel) cta.textContent = originalLabel;
      console.error('Download failed:', err);
    }
  }

  /* ---------- scrollspy ---------- */
  function setupScrollSpy() {
    const links = document.querySelectorAll('.nav__list a[href^="#"]');
    const sections = Array.from(links).map((a) =>
      document.querySelector(a.getAttribute('href'))
    ).filter(Boolean);
    if (!('IntersectionObserver' in window) || sections.length === 0) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) => a.classList.toggle(
            'is-active',
            a.getAttribute('href') === '#' + entry.target.id
          ));
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach((s) => io.observe(s));
  }

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderPrompts();
    document.body.addEventListener('click', (e) => {
      onTabClick(e);
      onCopyClick(e);
      onViewToggle(e);
      onChecklistClick(e);
      onDownloadClick(e);
    });
    setupScrollSpy();
  });
})();
