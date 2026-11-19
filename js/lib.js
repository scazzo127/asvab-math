/* Helpers shared by all unit files. Classic script (no modules) so it also works from file://. */
(function (g) {
  const L = {};
  L.R = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  L.pick = (arr) => arr[L.R(0, arr.length - 1)];
  L.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = L.R(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  L.gcd = (a, b) => (b ? L.gcd(b, a % b) : Math.abs(a));
  L.lcm = (a, b) => (a / L.gcd(a, b)) * b;
  L.r6 = (x) => Math.round(x * 1e6) / 1e6;
  L.fmt = (n) => {
    n = L.r6(n);
    if (n < 0) return '\u2212' + L.fmt(-n);
    if (Number.isInteger(n)) return Math.abs(n) >= 1000 ? n.toLocaleString('en-US') : String(n);
    return String(n);
  };
  L.neg = (n) => (n < 0 ? '−' + Math.abs(n) : String(n)); // true minus sign
  L.money = (n) => '$' + (Math.round(n * 100) / 100).toFixed(2);
  L.dec = (n) => String(L.r6(n));
  L.pct = (n) => L.fmt(n) + '%';

  /* ---------- math markup ---------- */
  L.fr = (n, d) => `<span class="frac"><span>${n}</span><span>${d}</span></span>`;
  L.frR = (n, d) => { const g = L.gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : L.fr(n, d); };
  L.mixed = (w, n, d) => `<span class="mixed">${w}${L.fr(n, d)}</span>`;
  // reduced result; improper -> mixed number
  L.frOut = (n, d) => {
    const g = L.gcd(n, d); n /= g; d /= g;
    if (d === 1) return String(n);
    if (n > d) { const w = Math.floor(n / d), r = n % d; return L.mixed(w, r, d); }
    return L.fr(n, d);
  };
  L.sup = (b, e) => `${b}<sup>${e}</sup>`;

  // linear / quadratic text helpers (true minus signs)
  L.lin = (a, b, v = 'x') => {
    let s = '';
    if (a !== 0) s += (a === 1 ? '' : a === -1 ? '−' : L.neg(a)) + v;
    if (b !== 0) s += s ? (b > 0 ? ' + ' + b : ' − ' + Math.abs(b)) : L.neg(b);
    return s || '0';
  };
  L.quad = (a, b, c) => {
    let s = (a === 1 ? '' : a === -1 ? '−' : L.neg(a)) + 'x<sup>2</sup>';
    if (b) s += (b > 0 ? ' + ' : ' − ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'x';
    if (c) s += (c > 0 ? ' + ' : ' − ') + Math.abs(c);
    return s;
  };

  /* ---------- question builders ----------
     Every question: {text, fig?, choices:[4 html strings], answer:index, why}  */
  L.mk = (text, ans, wrongs, why, fig) => {
    const w = L.shuffle([...new Set(wrongs.filter((x) => x !== ans && x != null))]).slice(0, 3);
    if (w.length < 3) throw new Error('Not enough distractors for: ' + text + ' / ' + ans);
    const choices = L.shuffle([ans, ...w]);
    return { text, fig: fig || null, choices, answer: choices.indexOf(ans), why };
  };

  // numeric answer; `bad` = likely-mistake values listed first, then near-misses fill the rest
  L.num = (text, ans, why, o = {}) => {
    const f = o.f || L.fmt;
    ans = L.r6(ans);
    const isInt = Number.isInteger(ans);
    let step = 1;
    if (!isInt) {
      const s = String(ans).split('.')[1] || '';
      step = Math.pow(10, -Math.max(1, s.length));
    }
    const allowNeg = o.allowNeg || ans < 0;
    const ok = (x) => {
      x = L.r6(x);
      if (!isFinite(x) || x === ans) return false;
      if (!allowNeg && x < 0) return false;
      if (isInt && !Number.isInteger(x) && !o.allowFrac) return false;
      return true;
    };
    const bad = (o.bad || []).map(L.r6).filter(ok);
    const near = [ans + step, ans - step, ans + 2 * step, ans - 2 * step, ans + 10 * step, ans - 10 * step,
      ans * 2, ans / 2, ans * 10, ans / 10, ans + 5 * step, ans - 5 * step, ans + 3 * step, ans - 3 * step].map(L.r6).filter(ok);
    const pool = [...new Set(L.shuffle(bad).slice(0, 3))];
    for (const x of L.shuffle(near)) { if (pool.length >= 8) break; if (!pool.includes(x)) pool.push(x); }
    // dedupe on the *formatted* strings so different numbers that print alike can't collide with the answer
    const seen = new Set([f(ans)]), picked = [];
    for (const v of pool) { const t = f(v); if (!seen.has(t)) { seen.add(t); picked.push([v, t]); } if (picked.length === 3) break; }
    if (picked.length < 3) throw new Error('Not enough distractors for: ' + text + ' / ' + f(ans));
    const all = [[ans, f(ans)], ...picked].sort((x, y) => x[0] - y[0]); // numeric choices read best in ascending order
    return { text, fig: o.fig || null, choices: all.map((x) => x[1]), answer: all.findIndex((x) => x[0] === ans), why };
  };

  g.L = L;
  g.UNITS = [];
})(window);
