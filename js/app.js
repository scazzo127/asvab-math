/* ASVAB Math Builder: app logic. Hash-routed single page app, progress kept in localStorage. */
(function () {
  'use strict';
  const U = window.UNITS, L = window.L;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const LET = ['A', 'B', 'C', 'D'];
  const KEY = 'asvabmath.v1', PASS = 8, QUIZ_LEN = 10, TEST_LEN = 20, TEST_MIN = 30, MIN_FOR_TEST = 3, REVIEW_DAYS = 7, DAY = 864e5;

  /* ------------------------------------------------------------------ state */
  const defaults = () => ({ v: 1, name: 'Jonny', theme: 'auto', unlockAll: false, units: {}, stats: {}, streak: { last: '', count: 0 }, tests: [], answered: 0 });
  let mem = null;
  const load = () => { try { const raw = localStorage.getItem(KEY); if (raw) return Object.assign(defaults(), JSON.parse(raw)); } catch (e) { /* storage blocked */ } return mem || defaults(); };
  let S = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { mem = S; } };
  const applyTheme = () => { document.documentElement.dataset.theme = S.theme || 'auto'; };
  applyTheme();

  const byId = (id) => U.find((u) => u.id === id);
  const idx = (id) => U.findIndex((u) => u.id === id);
  const us = (id) => S.units[id] || (S.units[id] = { mastered: false, best: 0, tries: 0, lessons: 0, last: 0 });
  const mastered = (id) => !!(S.units[id] && S.units[id].mastered);
  const unlocked = (i) => S.unlockAll || i === 0 || mastered(U[i - 1].id);
  const masteredCount = () => U.filter((u) => mastered(u.id)).length;
  const nextIdx = () => { for (let i = 0; i < U.length; i++) if (!mastered(U[i].id) && unlocked(i)) return i; return -1; };
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const touchStreak = () => { const t = dayKey(); if (S.streak.last === t) return; const y = new Date(); y.setDate(y.getDate() - 1); S.streak.count = S.streak.last === dayKey(y) ? S.streak.count + 1 : 1; S.streak.last = t; };
  const liveStreak = () => { const y = new Date(); y.setDate(y.getDate() - 1); return S.streak.last === dayKey() || S.streak.last === dayKey(y) ? S.streak.count : 0; };
  const accOf = (uid, t) => { const a = S.stats[uid] && S.stats[uid][t]; return a && a[0] ? a[1] / a[0] : null; };
  const typeLabel = (u, t) => { const l = u.lessons.find((x) => x.check === t); return l ? l.title : t; };
  const record = (q, ok) => { const st = (S.stats[q.unit] = S.stats[q.unit] || {}), a = (st[q.type] = st[q.type] || [0, 0]); a[0]++; if (ok) a[1]++; S.answered = (S.answered || 0) + 1; touchStreak(); save(); };
  const dueUnits = () => U.filter((u) => mastered(u.id) && Date.now() - (S.units[u.id].last || 0) > REVIEW_DAYS * DAY);
  const weakSpots = () => { const out = []; U.forEach((u) => Object.keys(u.types).forEach((t) => { const a = S.stats[u.id] && S.stats[u.id][t]; if (a && a[0] >= 3 && a[1] / a[0] < 0.7) out.push({ u, t, acc: a[1] / a[0] }); })); return out.sort((x, y) => x.acc - y.acc).slice(0, 6); };

  /* ------------------------------------------------------------- questions */
  function gen(u, type, seen) {
    let q = null;
    for (let k = 0; k < 10; k++) {
      let c; try { c = u.types[type](); } catch (e) { continue; }
      q = c; const key = c.text + '|' + c.choices.join('|');
      if (!seen || !seen.has(key)) { if (seen) seen.add(key); break; }
    }
    if (!q) { const alt = Object.keys(u.types).filter((t) => t !== type); return gen(u, alt[L.R(0, alt.length - 1)], seen); }
    q.unit = u.id; q.type = type; return q;
  }
  function pickType(u) {
    const ts = Object.keys(u.types), w = ts.map((t) => { const a = accOf(u.id, t); return 1 + (a === null ? 0.5 : 1 - a) * 3; });
    let r = Math.random() * w.reduce((x, y) => x + y, 0);
    for (let i = 0; i < ts.length; i++) { r -= w[i]; if (r <= 0) return ts[i]; }
    return ts[0];
  }
  const qBody = (q, sel = -1, lock = false) => `${q.fig || ''}<div class="qtext">${q.text}</div><div class="choices">${q.choices.map((c, i) => `<button class="choice${sel === i ? ' sel' : ''}" data-i="${i}"${lock ? ' disabled' : ''}><span class="l">${LET[i]}</span><span>${c}</span></button>`).join('')}</div>`;

  /* ----------------------------------------------------------------- views */
  const app = $('#app');
  let sess = null, timer = null;
  function view(html, o = {}) {
    app.innerHTML = html; document.body.classList.toggle('focus', !!o.focus); window.scrollTo(0, 0);
    $$('#tabs a').forEach((a) => a.classList.toggle('on', a.dataset.tab === o.tab));
  }
  const header = (title, sub, back, extra = '') => `<div class="top slim">${back ? `<a class="back" href="${back}">&lsaquo; Back</a>` : ''}<h1>${title}</h1>${sub ? `<div class="sub">${sub}</div>` : ''}${extra}</div>`;
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

  /* ---- Home / path ---- */
  function home() {
    sess = null;
    const n = masteredCount(), ni = nextIdx(), st = liveStreak(), due = dueUnits(), weak = weakSpots();
    let hero;
    if (ni >= 0) {
      const u = U[ni], s = us(u.id), tot = u.lessons.length, done = s.lessons || 0, ready = done >= tot;
      hero = `<div class="card hero"><div class="kick">Up next &middot; Block ${ni + 1} of ${U.length}</div><h2>${u.title}</h2>
        <a class="btn primary block" href="${ready ? '#/quiz/' + u.id : '#/learn/' + u.id + '/' + Math.min(done, tot - 1)}">${ready ? 'Take the mastery quiz' : done ? 'Continue lessons' : 'Start the first lesson'}</a></div>`;
    } else hero = `<div class="card hero"><div class="kick">Complete</div><h2>Every block mastered! &#127881;</h2><a class="btn primary block" href="#/test">Take a mixed practice test</a></div>`;
    const extras = [];
    if (weak.length) extras.push(`<div class="card"><h2>Weak spots</h2><p class="muted small" style="margin:0 0 10px">${weak.slice(0, 3).map((w) => esc(typeLabel(w.u, w.t))).join(' &bull; ')}</p><a class="btn block sm" href="#/weak">Practice weak spots</a></div>`);
    if (due.length) extras.push(`<div class="card"><h2>Quick review</h2><p class="muted small" style="margin:0 0 10px">${due.length} mastered block${due.length > 1 ? 's' : ''} not seen in over a week. A few questions keep them fresh.</p><a class="btn block sm" href="#/due">Review now</a></div>`);
    const blocks = U.map((u, i) => {
      const s = us(u.id), m = s.mastered, open = unlocked(i), cur = i === ni, d = due.includes(u);
      const cls = m ? 'mastered' : cur ? 'current' : open ? '' : 'locked';
      const sub = m ? `Mastered &middot; best ${s.best}/${QUIZ_LEN}` : open ? ((s.lessons || 0) >= u.lessons.length ? 'Ready for the quiz' : s.lessons ? `Lesson ${s.lessons + 1} of ${u.lessons.length}` : `${u.lessons.length} lessons`) : 'Locked &middot; master the block below it';
      return `<a class="block ${cls}" href="#/unit/${u.id}"><div class="badge">${m ? '&#10003;' : open ? i + 1 : '&#128274;'}</div><div><div class="bt">${u.title}${d ? '<span class="tag due">review</span>' : ''}</div><div class="bs">${sub}</div></div><div class="chev">&rsaquo;</div></a>`;
    }).join('');
    view(`<div class="top"><div class="hi">${st ? '&#128293; ' + st + '-day streak' : 'ASVAB Math Builder'}</div><h1>Hey ${esc(S.name || 'there')}, let's build.</h1>
      <div class="sub">Master each block to unlock the next one.</div>
      <div class="meter"><i style="width:${pct(n, U.length)}%"></i></div><div class="mrow"><span>${n} of ${U.length} blocks mastered</span><span>${pct(n, U.length)}%</span></div></div>
      <div class="wrap">${hero}${extras.join('')}<h2 style="margin:6px 4px 10px;font-size:15px;color:var(--mute);text-transform:uppercase;letter-spacing:.6px">Your path, one block at a time</h2><div class="path">${blocks}</div></div>`, { tab: 'path' });
  }

  /* ---- Unit page ---- */
  function unitPage(id) {
    const i = idx(id); if (i < 0) return home();
    const u = U[i], s = us(id), open = unlocked(i), tot = u.lessons.length, done = s.lessons || 0, due = dueUnits().includes(u);
    const skills = Object.keys(u.types).map((t) => { const a = accOf(id, t), p = a === null ? 0 : Math.round(a * 100); return `<div class="sk"><span class="nm">${esc(typeLabel(u, t))}</span><span class="bar"><i class="${a === null ? '' : a >= 0.8 ? '' : a >= 0.6 ? 'mid' : 'low'}" style="width:${p}%"></i></span><span class="small muted" style="width:36px;text-align:right">${a === null ? '&ndash;' : p + '%'}</span></div>`; }).join('');
    const lessonLinks = u.lessons.map((l, k) => `<a class="step${k < done ? ' done' : ''}" style="margin-bottom:8px;padding:10px 12px" href="#/learn/${id}/${k}"><span class="n" style="flex-basis:30px;height:30px;font-size:14px">${k < done ? '&#10003;' : k + 1}</span><span><b style="font-size:15px">${l.title}</b></span></a>`).join('');
    let body;
    if (!open) {
      body = `<div class="card"><h2>&#128274; Locked</h2><p class="muted" style="margin-top:0">Master <b>${U[i - 1].title}</b> first, since this block builds on it.</p>
        <p style="margin:0 0 12px">Already know this material? Prove it: score ${PASS}/${QUIZ_LEN} on the quiz to test out.</p><a class="btn amber block" href="#/quiz/${id}">Test out of this block</a></div>`;
    } else {
      body = `<div class="steps">
        <a class="step${done >= tot ? ' done' : ''}" href="#/learn/${id}/${Math.min(done, tot - 1)}"><span class="n">${done >= tot ? '&#10003;' : '1'}</span><span><b>Learn</b><span class="s">${tot} short lessons with check-in questions &middot; ${done}/${tot} done</span></span></a>
        <a class="step" href="#/practice/${id}"><span class="n">2</span><span><b>Practice</b><span class="s">Unlimited questions, instant feedback. It focuses on your weak skills.</span></span></a>
        <a class="step${s.mastered ? ' done' : ''}" href="#/quiz/${id}"><span class="n">${s.mastered ? '&#10003;' : '3'}</span><span><b>Mastery quiz</b><span class="s">${QUIZ_LEN} questions, ${PASS} correct to master${s.tries ? ' &middot; best ' + s.best + '/' + QUIZ_LEN : ''}</span></span></a></div>`;
    }
    view(`<div class="top slim"><a class="back" href="#/">&lsaquo; Path</a><div class="hi">Block ${i + 1}${s.mastered ? ' &middot; Mastered &#10003;' : ''}${due ? ' &middot; review due' : ''}</div><h1>${u.title}</h1><div class="sub">${u.blurb}</div></div>
      <div class="wrap">${body}${open ? `<div class="card skills" style="margin-top:14px"><h2>Skills</h2>${skills}</div><details class="acc"><summary>Jump to a lesson</summary><div class="in">${lessonLinks}</div></details>` : ''}</div>`, { tab: 'path' });
  }

  /* ---- Lessons ---- */
  function learn(id, k) {
    const u = byId(id); if (!u) return home();
    const tot = u.lessons.length; k = Math.max(0, Math.min(k, tot - 1));
    const les = u.lessons[k], s = us(id); if ((s.lessons || 0) < k) { s.lessons = k; save(); }
    sess = { mode: 'check', unitId: id, k, seen: new Set(), answered: false };
    const pips = u.lessons.map((_, j) => `<i class="${j < k ? 'on' : j === k ? 'cur' : ''}"></i>`).join('');
    view(`${header(u.title, `Lesson ${k + 1} of ${tot}`, '#/unit/' + id)}<div class="wrap"><div class="pips">${pips}</div>
      <div class="card lesson"><h2>${les.title}</h2>${les.body}</div><div id="chk"></div>
      <div class="row" style="margin-top:14px">${k > 0 ? `<a class="btn" href="#/learn/${id}/${k - 1}">&lsaquo; Back</a>` : ''}
      ${k < tot - 1 ? `<a class="btn primary" href="#/learn/${id}/${k + 1}">Next lesson &rsaquo;</a>` : `<button class="btn primary" data-act="lfinish" data-id="${id}">Finish lessons &#10003;</button>`}</div></div>`, { focus: true });
    loadCheck();
  }
  function loadCheck() {
    const u = byId(sess.unitId), les = u.lessons[sess.k], q = gen(u, les.check, sess.seen);
    sess.q = q; sess.answered = false;
    $('#chk').innerHTML = `<div class="qcard"><div class="qmeta"><span>&#9998;&#65039; Check yourself</span></div>${qBody(q)}<div id="fb"></div><div class="qactions" id="qa"></div></div>`;
  }

  /* ---- Practice / review (instant feedback) ---- */
  function startPractice(id) {
    const u = byId(id); if (!u) return home();
    sess = { mode: 'practice', unitId: id, seen: new Set(), correct: 0, total: 0, streak: 0 };
    nextImmediate();
  }
  function startReview(kind) {
    let pool = [];
    if (kind === 'weak') pool = weakSpots().map((w) => ({ u: w.u, t: w.t }));
    else dueUnits().forEach((u) => Object.keys(u.types).forEach((t) => pool.push({ u, t })));
    if (!pool.length) return home();
    sess = { mode: 'review', kind, pool, seen: new Set(), correct: 0, total: 0, N: kind === 'weak' ? 10 : 8, units: {} };
    nextImmediate();
  }
  function nextImmediate() {
    if (sess.mode === 'review' && sess.total >= sess.N) return endReview();
    let q, u;
    if (sess.mode === 'practice') { u = byId(sess.unitId); q = gen(u, pickType(u), sess.seen); }
    else { const p = L.pick(sess.pool); u = p.u; q = gen(u, p.t, sess.seen); }
    sess.q = q; sess.answered = false;
    const title = sess.mode === 'practice' ? 'Practice' : sess.kind === 'weak' ? 'Weak spots' : 'Quick review';
    const sub = sess.mode === 'practice' ? u.title : `Question ${sess.total + 1} of ${sess.N}`;
    const back = sess.mode === 'practice' ? '#/unit/' + sess.unitId : '#/';
    view(`${header(title, sub, back)}<div class="wrap">
      ${sess.mode === 'review' ? `<div class="bar2"><i style="width:${pct(sess.total, sess.N)}%"></i></div>` : ''}
      <div class="qcard"><div class="qmeta"><span class="pill">${esc(typeLabel(u, q.type))}</span><span>${sess.total ? `&#10003; ${sess.correct}/${sess.total}` : ''}${sess.streak > 2 ? ' &middot; &#128293; ' + sess.streak : ''}</span></div>${qBody(q)}<div id="fb"></div><div class="qactions" id="qa"></div></div>
      ${sess.mode === 'practice' && sess.total ? `<div class="row" style="margin-top:14px"><button class="btn" data-act="pdone">Finish session</button></div>` : ''}</div>`, { focus: true });
  }
  function endReview() {
    const rows = Object.entries(sess.units);
    rows.forEach(([id, [c, n]]) => { if (mastered(id) && c / n >= 0.6) us(id).last = Date.now(); }); save();
    const p = pct(sess.correct, sess.total);
    view(`${header('Review done', '', '#/')}<div class="wrap"><div class="card score ${p >= 70 ? 'pass' : 'fail'}"><div class="big">${sess.correct}/${sess.total}</div><div class="lab">${p >= 70 ? 'Nicely done. Those blocks are fresh again.' : 'A few shaky spots. Re-read those lessons, then try again.'}</div></div>
      <div class="row"><a class="btn primary" href="#/">Back to path</a>${sess.kind === 'weak' ? '<a class="btn" href="#/weak">Go again</a>' : ''}</div></div>`, { tab: 'path' });
  }

  /* ---- Quiz (no feedback until the end) ---- */
  function startQuiz(id) {
    const u = byId(id); if (!u) return home();
    const ts = Object.keys(u.types); let order = [];
    while (order.length < QUIZ_LEN) order = order.concat(L.shuffle(ts));
    const seen = new Set();
    sess = { mode: 'quiz', unitId: id, i: 0, answers: [], qs: L.shuffle(order.slice(0, QUIZ_LEN)).map((t) => gen(u, t, seen)) };
    renderQuiz();
  }
  function renderQuiz() {
    const q = sess.qs[sess.i], n = sess.qs.length, u = byId(sess.unitId), sel = sess.answers[sess.i] ?? -1, last = sess.i === n - 1;
    view(`${header('Mastery quiz', u.title, '#/unit/' + sess.unitId)}<div class="wrap"><div class="bar2"><i style="width:${pct(sess.i, n)}%"></i></div>
      <div class="qcard"><div class="qmeta"><span>Question ${sess.i + 1} of ${n}</span><span>${PASS}/${n} to master</span></div>${qBody(q, sel)}
      <div class="qactions">${sess.i ? '<button class="btn" data-act="qprev">&lsaquo; Back</button>' : ''}<button class="btn primary" id="qnext" data-act="qnext"${sel < 0 ? ' disabled' : ''}>${last ? 'Finish' : 'Next &rsaquo;'}</button></div></div></div>`, { focus: true });
  }
  function finishQuiz() {
    const u = byId(sess.unitId), id = u.id, i = idx(id), s = us(id), qs = sess.qs;
    let score = 0; const missed = [];
    qs.forEach((q, j) => { const ok = sess.answers[j] === q.answer; record(q, ok); if (ok) score++; else missed.push([q, sess.answers[j]]); });
    const wasMastered = s.mastered, pass = score >= PASS; s.tries++; s.best = Math.max(s.best || 0, score);
    if (pass) { s.mastered = true; s.last = Date.now(); if (!s.lessons) s.lessons = u.lessons.length; } save();
    const nxt = U[i + 1];
    const miss = missed.map(([q, a]) => `<details class="miss"><summary>&#10007; ${q.text.length > 90 ? 'Question ' + (qs.indexOf(q) + 1) : q.text}</summary><div class="in">${q.fig || ''}${q.text.length > 90 ? `<div class="qtext" style="font-size:16px">${q.text}</div>` : ''}<p>You chose: <b>${a >= 0 && a != null ? q.choices[a] : '(no answer)'}</b><br>Correct: <b>${q.choices[q.answer]}</b></p><div class="fb ok">${q.why}</div></div></details>`).join('');
    view(`${header(pass ? 'Block mastered!' : 'Almost there', u.title, '#/unit/' + id)}<div class="wrap">
      <div class="card score ${pass ? 'pass' : 'fail'}"><div class="big">${score}/${qs.length}</div><div class="lab">${pass ? (wasMastered ? 'Still sharp.' : '<b>Nice.</b> ' + (nxt ? 'Next block unlocked: ' + nxt.title : 'That was the last block!')) : `You need ${PASS}. Review the explanations below, then retry. You'll get fresh questions.`}</div></div>
      <div class="row" style="margin-bottom:14px">${pass && nxt ? `<a class="btn primary" href="#/unit/${nxt.id}">Go to next block</a>` : `<button class="btn primary" data-act="qretry" data-id="${id}">Try again</button>`}<a class="btn" href="${pass ? '#/' : '#/learn/' + id + '/0'}">${pass ? 'Back to path' : 'Re-read lessons'}</a></div>
      ${missed.length ? `<h2 style="font-size:16px;margin:4px 2px 8px">Review your misses</h2>${miss}` : ''}</div>`, { tab: 'path' });
    if (pass && !wasMastered) confetti();
  }

  /* ---- Timed mixed test ---- */
  function testPool() { return U.filter((u) => S.unlockAll || mastered(u.id)); }
  function testIntro() {
    sess = null; const pool = testPool(), ok = pool.length >= MIN_FOR_TEST || S.unlockAll;
    const hist = (S.tests || []).slice(-5).reverse().map((t) => `<tr><td>${new Date(t.t).toLocaleDateString()}</td><td>${t.score}/${t.total}</td><td>${pct(t.score, t.total)}%</td></tr>`).join('');
    view(`<div class="top slim"><h1>Mixed practice test</h1><div class="sub">Questions pulled from every block you've mastered.</div></div><div class="wrap">
      <div class="card"><h2>${TEST_LEN} questions &middot; ${TEST_MIN} minutes</h2><p class="muted" style="margin-top:0">No calculator, just like the real thing. Answer everything you can, flag nothing, and review your misses at the end.</p>
      ${ok ? `<p class="small muted">Drawing from ${pool.length} mastered block${pool.length > 1 ? 's' : ''}.</p><button class="btn primary block" data-act="starttest">Start test</button>` : `<p><b>Unlocks after ${MIN_FOR_TEST} mastered blocks.</b> You have ${pool.length}.</p><a class="btn block" href="#/">Back to the path</a>`}</div>
      ${hist ? `<div class="card"><h2>Recent tests</h2><table class="ref"><tr><td>Date</td><td>Score</td><td>%</td></tr>${hist}</table></div>` : ''}</div>`, { tab: 'test' });
  }
  function startTest() {
    const pool = L.shuffle(testPool()), seen = new Set(), qs = [];
    for (let i = 0; i < TEST_LEN; i++) { const u = pool[i % pool.length]; qs.push(gen(u, pickType(u), seen)); }
    sess = { mode: 'test', i: 0, answers: [], qs: L.shuffle(qs), end: Date.now() + TEST_MIN * 60000 };
    renderTest();
    timer = setInterval(tick, 500);
  }
  const mmss = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  function tick() { if (!sess || sess.mode !== 'test') return; const left = sess.end - Date.now(), el = $('#timer'); if (el) { el.textContent = mmss(left); el.classList.toggle('low', left < 5 * 60000); } if (left <= 0) finishTest(true); }
  function renderTest() {
    const q = sess.qs[sess.i], n = sess.qs.length, sel = sess.answers[sess.i] ?? -1, last = sess.i === n - 1, answered = sess.answers.filter((a) => a != null && a >= 0).length;
    view(`<div class="top slim"><div class="hi">Mixed practice test</div><h1><span class="timer" id="timer">${mmss(sess.end - Date.now())}</span></h1><div class="sub">${answered} of ${n} answered</div></div><div class="wrap"><div class="bar2"><i style="width:${pct(sess.i + 1, n)}%"></i></div>
      <div class="qcard"><div class="qmeta"><span>Question ${sess.i + 1} of ${n}</span></div>${qBody(q, sel)}
      <div class="qactions">${sess.i ? '<button class="btn" data-act="tprev">&lsaquo; Back</button>' : ''}${last ? '<button class="btn primary" data-act="tfinish">Finish test</button>' : '<button class="btn primary" data-act="tnext">Next &rsaquo;</button>'}</div></div>
      ${!last ? '<div class="row" style="margin-top:12px"><button class="btn sm" data-act="tfinish">Finish early</button></div>' : ''}</div>`, { focus: true });
  }
  function finishTest() {
    if (!sess || sess.mode !== 'test') return; cleanup();
    const qs = sess.qs, by = {}; let score = 0; const missed = [];
    qs.forEach((q, j) => { const a = sess.answers[j], ok = a === q.answer; if (a != null && a >= 0) record(q, ok); if (ok) score++; else missed.push([q, a]); const b = (by[q.unit] = by[q.unit] || [0, 0]); b[1]++; if (ok) b[0]++; });
    (S.tests = S.tests || []).push({ t: Date.now(), score, total: qs.length, by }); S.tests = S.tests.slice(-20); save();
    const rows = Object.entries(by).map(([id, [c, n]]) => { const u = byId(id); return `<tr><td><a href="#/unit/${id}">${u.title}</a></td><td>${c}/${n}</td><td><span class="chip ${c / n >= 0.7 ? 'good' : 'bad'}">${pct(c, n)}%</span></td></tr>`; }).join('');
    const weak = Object.entries(by).filter(([, [c, n]]) => c / n < 0.7).map(([id]) => byId(id).title);
    const miss = missed.map(([q, a]) => `<details class="miss"><summary>&#10007; ${q.text.length > 90 ? esc(byId(q.unit).title) : q.text}</summary><div class="in">${q.fig || ''}${q.text.length > 90 ? `<div class="qtext" style="font-size:16px">${q.text}</div>` : ''}<p>You chose: <b>${a != null && a >= 0 ? q.choices[a] : '(no answer)'}</b><br>Correct: <b>${q.choices[q.answer]}</b></p><div class="fb ok">${q.why}</div></div></details>`).join('');
    const p = pct(score, qs.length);
    view(`${header('Test results', '', '#/test')}<div class="wrap"><div class="card score ${p >= 70 ? 'pass' : 'fail'}"><div class="big">${p}%</div><div class="lab">${score} of ${qs.length} correct${weak.length ? '<br>Brush up on: ' + weak.join(', ') : '<br>Strong across the board.'}</div></div>
      <div class="card"><h2>By block</h2><table class="ref">${rows}</table></div>${missed.length ? `<h2 style="font-size:16px;margin:4px 2px 8px">Review your misses</h2>${miss}` : ''}
      <div class="row" style="margin-top:12px"><button class="btn primary" data-act="starttest">New test</button><a class="btn" href="#/">Back to path</a></div></div>`, { tab: 'test' });
  }

  /* ---- More: progress, tips, formulas, install, backup ---- */
  const TIPS = `<ul><li><b>No calculator.</b> Practice by hand. Estimating (round, then compute) is the fastest way to throw out wrong choices.</li>
    <li><b>Eliminate first.</b> Cross out answers that are too big, too small, or the wrong units, then work with what's left.</li>
    <li><b>Plug in the answer choices</b> for equation problems. Start with a middle value.</li>
    <li><b>Read the last sentence first</b> to know what's being asked, then read the story.</li>
    <li><b>Watch units</b> (feet vs. yards, minutes vs. hours) and &ldquo;full&rdquo; vs. &ldquo;remaining.&rdquo;</li>
    <li><b>Draw it.</b> Sketch geometry and rate problems. A 5-second picture prevents most mistakes.</li>
    <li><b>Don't sink time</b> into one question. Make your best guess and move on.</li></ul>`;
  const FORMULAS = [
    ['Percents & rates', `<table class="ref"><tr><td>Part</td><td>Percent &times; Whole</td></tr><tr><td>Percent change</td><td>(new &minus; old) &divide; old &times; 100</td></tr><tr><td>Distance</td><td>d = r &times; t</td></tr><tr><td>Simple interest</td><td>I = P &times; r &times; t</td></tr><tr><td>Average</td><td>sum &divide; count</td></tr></table>`],
    ['Algebra', `<table class="ref"><tr><td>FOIL</td><td>(x + p)(x + q) = x<sup>2</sup> + (p + q)x + pq</td></tr><tr><td>Diff. of squares</td><td>a<sup>2</sup> &minus; b<sup>2</sup> = (a &minus; b)(a + b)</td></tr><tr><td>Exponents</td><td>x<sup>a</sup>x<sup>b</sup> = x<sup>a+b</sup>; (x<sup>a</sup>)<sup>b</sup> = x<sup>ab</sup>; x<sup>a</sup>/x<sup>b</sup> = x<sup>a&minus;b</sup></td></tr><tr><td>Inequality</td><td>Flip the sign when &times; or &divide; by a negative</td></tr></table>`],
    ['Geometry', `<table class="ref"><tr><td>Rectangle</td><td>A = lw &nbsp; P = 2(l + w)</td></tr><tr><td>Triangle</td><td>A = &frac12;bh</td></tr><tr><td>Trapezoid</td><td>A = &frac12;(b<sub>1</sub> + b<sub>2</sub>)h</td></tr><tr><td>Circle</td><td>A = &pi;r<sup>2</sup> &nbsp; C = 2&pi;r</td></tr><tr><td>Box / cylinder</td><td>V = lwh &nbsp; V = &pi;r<sup>2</sup>h</td></tr><tr><td>Pythagorean</td><td>a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup> (3-4-5, 5-12-13, 8-15-17, 7-24-25)</td></tr><tr><td>Triangle angles</td><td>sum = 180&deg;</td></tr><tr><td>Polygon angles</td><td>(n &minus; 2) &times; 180&deg;</td></tr><tr><td>Slope / midpoint</td><td>rise &divide; run; average the coordinates</td></tr></table>`],
    ['Counting & probability', `<table class="ref"><tr><td>Probability</td><td>favorable &divide; total</td></tr><tr><td>Counting principle</td><td>multiply the choices</td></tr><tr><td>Permutation</td><td>order matters: n(n&minus;1)&hellip;</td></tr><tr><td>Combination</td><td>order doesn't matter: P &divide; r!</td></tr></table>`],
    ['Conversions', `<table class="ref"><tr><td>Length</td><td>12 in = 1 ft &bull; 3 ft = 1 yd &bull; 5,280 ft = 1 mi</td></tr><tr><td>Weight</td><td>16 oz = 1 lb &bull; 2,000 lb = 1 ton</td></tr><tr><td>Liquid</td><td>2 cups = 1 pt &bull; 2 pt = 1 qt &bull; 4 qt = 1 gal</td></tr><tr><td>Time</td><td>60 s = 1 min &bull; 60 min = 1 hr &bull; 24 hr = 1 day</td></tr></table>`],
  ];
  function more() {
    sess = null;
    const rows = U.map((u, i) => { const s = us(u.id); return `<tr><td><a href="#/unit/${u.id}">${i + 1}. ${u.title}</a></td><td>${s.mastered ? '<span class="chip good">&#10003; ' + s.best + '/' + QUIZ_LEN + '</span>' : s.tries ? '<span class="chip">' + s.best + '/' + QUIZ_LEN + '</span>' : '&ndash;'}</td></tr>`; }).join('');
    view(`<div class="top slim"><h1>More</h1><div class="sub">Progress, tips, formula sheet and settings</div></div><div class="wrap">
      <div class="card"><h2>Your progress</h2><p style="margin:0 0 8px"><b>${masteredCount()}</b> of ${U.length} blocks mastered &middot; <b>${S.answered || 0}</b> questions answered${liveStreak() ? ' &middot; &#128293; ' + liveStreak() + '-day streak' : ''}</p><table class="ref w">${rows}</table></div>
      <details class="acc"><summary>Test-day tips</summary><div class="in">${TIPS}</div></details>
      <details class="acc"><summary>Formula &amp; conversion sheet</summary><div class="in">${FORMULAS.map(([t, h]) => `<h3 style="font-size:15px;margin:12px 0 4px">${t}</h3>${h}`).join('')}</div></details>
      <details class="acc"><summary>Put it on your phone</summary><div class="in"><p><b>iPhone / iPad (Safari):</b> tap Share, then <b>Add to Home Screen</b>.</p><p><b>Android (Chrome):</b> tap &#8942; menu, then <b>Install app</b> (or Add to Home screen).</p><p class="muted small">Once installed it opens full-screen and works offline. Progress is stored on that device, so use Backup below before switching phones.</p></div></details>
      <details class="acc" open><summary>Settings</summary><div class="in"><p style="margin:8px 0 4px"><b>Student name</b></p><input type="text" id="nm" value="${esc(S.name || '')}" maxlength="24" autocomplete="off">
        <p style="margin:12px 0 4px"><b>Appearance</b></p><select id="theme"><option value="auto"${S.theme === 'auto' ? ' selected' : ''}>Match my phone</option><option value="light"${S.theme === 'light' ? ' selected' : ''}>Light</option><option value="dark"${S.theme === 'dark' ? ' selected' : ''}>Dark</option></select>
        <label class="tg"><span><b>Unlock all blocks</b><br><span class="muted small">Skip the progression (teacher mode)</span></span><input type="checkbox" id="unl"${S.unlockAll ? ' checked' : ''}></label></div></details>
      <details class="acc"><summary>Backup &amp; reset</summary><div class="in"><p class="muted small">Progress lives on this device only. Export a backup to move it to another phone.</p>
        <div class="row"><button class="btn sm" data-act="export">Download backup</button><button class="btn sm" data-act="copy">Copy backup</button></div>
        <p style="margin:12px 0 4px"><b>Restore</b></p><textarea id="imp" placeholder="Paste a backup here"></textarea><button class="btn sm" style="margin-top:8px" data-act="import">Restore from backup</button>
        <p style="margin:16px 0 4px"><b>Start over</b></p><button class="btn sm danger" data-act="reset">Erase all progress</button></div></details></div>`, { tab: 'more' });
  }

  /* ------------------------------------------------------------ interaction */
  function confetti() {
    const c = document.createElement('div'); c.className = 'confetti'; const cols = ['#f5b82e', '#2a9d63', '#2f6fe4', '#d64545', '#fff'];
    for (let i = 0; i < 40; i++) { const e = document.createElement('i'); e.style.left = Math.random() * 100 + '%'; e.style.background = cols[i % cols.length]; e.style.animationDelay = Math.random() * 0.6 + 's'; e.style.animationDuration = 2 + Math.random() * 1.5 + 's'; c.appendChild(e); }
    document.body.appendChild(c); setTimeout(() => c.remove(), 4200);
  }
  function pick(i) {
    if (!sess) return;
    const m = sess.mode;
    if (m === 'quiz' || m === 'test') {
      sess.answers[sess.i] = i; $$('.choice').forEach((b, j) => b.classList.toggle('sel', j === i));
      const nb = $('#qnext'); if (nb) nb.disabled = false; return;
    }
    if (sess.answered || !sess.q) return; sess.answered = true;
    const q = sess.q, ok = i === q.answer; record(q, ok); sess.total = (sess.total || 0) + 1; if (ok) { sess.correct = (sess.correct || 0) + 1; sess.streak = (sess.streak || 0) + 1; } else sess.streak = 0;
    if (m === 'review') { const b = (sess.units[q.unit] = sess.units[q.unit] || [0, 0]); b[1]++; if (ok) b[0]++; }
    $$('.choice').forEach((b, j) => { b.disabled = true; if (j === q.answer) b.classList.add('ok'); else if (j === i) b.classList.add('no'); });
    $('#fb').innerHTML = `<div class="fb ${ok ? 'ok' : 'no'}"><b>${ok ? 'Correct!' : 'Not quite.'}</b> ${ok ? '' : `The answer is <b>${LET[q.answer]}</b>. `}${q.why}</div>`;
    const qa = $('#qa');
    qa.innerHTML = m === 'check' ? '<button class="btn primary" data-act="another">Try another</button>' : `<button class="btn primary" data-act="nextq">${m === 'review' && sess.total >= sess.N ? 'See results' : 'Next question'} &rsaquo;</button>`;
    const b = qa.querySelector('button'); if (b) b.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  const act = {
    another: () => loadCheck(),
    nextq: () => nextImmediate(),
    pdone: () => { const p = pct(sess.correct, sess.total), id = sess.unitId; view(`${header('Session done', '', '#/unit/' + id)}<div class="wrap"><div class="card score ${p >= 80 ? 'pass' : 'fail'}"><div class="big">${sess.correct}/${sess.total}</div><div class="lab">${p >= 80 ? 'Strong session. Try the mastery quiz when you feel ready.' : 'Keep going. Re-read a lesson if one skill keeps tripping you up.'}</div></div><div class="row"><a class="btn primary" href="#/quiz/${id}">Mastery quiz</a><a class="btn" href="#/practice/${id}">More practice</a></div></div>`, { tab: 'path' }); },
    lfinish: (el) => { const u = byId(el.dataset.id), s = us(u.id); s.lessons = u.lessons.length; save(); location.hash = '#/unit/' + u.id; },
    qnext: () => { if (sess.answers[sess.i] == null) return; if (sess.i < sess.qs.length - 1) { sess.i++; renderQuiz(); } else finishQuiz(); },
    qprev: () => { if (sess.i > 0) { sess.i--; renderQuiz(); } },
    qretry: (el) => startQuiz(el.dataset.id),
    starttest: () => startTest(),
    tnext: () => { if (sess.i < sess.qs.length - 1) { sess.i++; renderTest(); } },
    tprev: () => { if (sess.i > 0) { sess.i--; renderTest(); } },
    tfinish: () => { const un = sess.qs.length - sess.answers.filter((a) => a != null && a >= 0).length; if (!un || confirm(`${un} question${un > 1 ? 's are' : ' is'} unanswered. Finish the test now?`)) finishTest(); },
    export: () => { const b = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'asvab-math-progress.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); },
    copy: () => { const t = JSON.stringify(S); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => alert('Backup copied. Paste it somewhere safe.'), () => { const ta = $('#imp'); if (ta) { ta.value = t; ta.select(); alert('Copy blocked. The backup is in the box below. Select all and copy it.'); } }); },
    import: () => { try { const o = JSON.parse($('#imp').value.trim()); if (!o || typeof o !== 'object' || !o.units) throw 0; S = Object.assign(defaults(), o); save(); applyTheme(); alert('Progress restored.'); route(); } catch (e) { alert('That does not look like a valid backup.'); } },
    reset: () => { if (confirm('Erase ALL progress on this device? This cannot be undone.')) { const nm = S.name; S = defaults(); S.name = nm; save(); route(); } },
  };
  document.addEventListener('click', (e) => {
    const ch = e.target.closest('.choice'); if (ch && sess) { pick(+ch.dataset.i); return; }
    const a = e.target.closest('[data-act]'); if (a && act[a.dataset.act]) act[a.dataset.act](a, e);
  });
  document.addEventListener('change', (e) => {
    if (e.target.id === 'nm') { S.name = e.target.value.trim().slice(0, 24) || 'Jonny'; save(); }
    else if (e.target.id === 'theme') { S.theme = e.target.value; save(); applyTheme(); }
    else if (e.target.id === 'unl') { S.unlockAll = e.target.checked; save(); }
  });
  document.addEventListener('keydown', (e) => {
    if (!sess || /INPUT|TEXTAREA|SELECT/.test((e.target.tagName || ''))) return;
    const k = e.key.toLowerCase(), i = 'abcd'.indexOf(k) >= 0 ? 'abcd'.indexOf(k) : '1234'.indexOf(k);
    if (k.length === 1 && i >= 0 && $$('.choice').length > i && !$$('.choice')[i].disabled) { pick(i); return; }
    if (k === 'enter' && document.activeElement === document.body) { const b = $('#qnext:not([disabled])') || $('#qa button') || $('[data-act=tnext]'); if (b) b.click(); }
  });

  /* ----------------------------------------------------------------- router */
  function cleanup() { if (timer) { clearInterval(timer); timer = null; } }
  function route() {
    cleanup();
    const [a, b, c] = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    try {
      if (!a) return home();
      if (a === 'unit') return unitPage(b);
      if (a === 'learn') return learn(b, parseInt(c, 10) || 0);
      if (a === 'practice') return startPractice(b);
      if (a === 'quiz') return startQuiz(b);
      if (a === 'test') return testIntro();
      if (a === 'weak') return startReview('weak');
      if (a === 'due') return startReview('due');
      if (a === 'more') return more();
    } catch (err) { console.error(err); }
    home();
  }
  window.addEventListener('hashchange', route);
  route();

  /* ------------------------------------------------------------- PWA bits */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));
  }
  window.__asvab = { S: () => S, U, sess: () => sess }; // handy for debugging in the console
})();
