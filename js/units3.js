/* Units 13-16: word problems, data & probability, geometry I & II */
(function () {
  const { R, pick, shuffle, gcd, lcm, fmt, neg, money, dec, r6, fr, frR, mixed, frOut, mk, num } = L;
  const nz = (a, b) => { let x; do { x = R(a, b); } while (x === 0); return x; };
  const usd = (n) => '$' + fmt(n);
  const pi = (n) => `${n}&pi;`;

  /* ---------- tiny SVG figure kit (strokes follow the theme via currentColor) ---------- */
  const S = (inner) => `<svg viewBox="0 0 240 150" class="fig" role="img" aria-hidden="true">${inner}</svg>`;
  const T = (x, y, t, a = 'middle') => `<text x="${x}" y="${y}" text-anchor="${a}">${t}</text>`;
  const sq = (x, y, dx, dy) => `<path d="M${x + dx * 10} ${y} l0 ${dy * 10} l${-dx * 10} 0" class="ra"/>`; // right-angle mark
  const F = {
    rect: (l, w) => S(`<rect x="50" y="30" width="140" height="80" class="f"/>${T(120, 130, l)}${T(40, 74, w, 'end')}`),
    tri: (b, h) => S(`<polygon points="40,115 200,115 120,25" class="f"/><line x1="120" y1="25" x2="120" y2="115" class="d"/>${sq(120, 115, -1, -1)}${T(120, 133, b)}${T(128, 74, h, 'start')}`),
    right: (a, b, c) => S(`<polygon points="50,115 190,115 50,30" class="f"/>${sq(50, 115, 1, -1)}${T(120, 133, a)}${T(40, 78, b, 'end')}${T(128, 64, c, 'start')}`),
    circle: (lab, diam) => S(`<circle cx="120" cy="75" r="55" class="f"/>` + (diam ? `<line x1="65" y1="75" x2="175" y2="75"/>${T(120, 66, lab)}` : `<line x1="120" y1="75" x2="175" y2="75"/><circle cx="120" cy="75" r="2.5" class="dot"/>${T(148, 68, lab)}`)),
    trap: (b1, b2, h) => S(`<polygon points="50,115 190,115 160,35 80,35" class="f"/><line x1="160" y1="35" x2="160" y2="115" class="d"/>${sq(160, 115, -1, -1)}${T(120, 28, b1)}${T(120, 133, b2)}${T(168, 80, h, 'start')}`),
    box: (l, w, h) => S(`<polygon points="40,60 140,60 140,125 40,125" class="f"/><polygon points="40,60 80,30 180,30 140,60" class="f2"/><polygon points="140,60 180,30 180,95 140,125" class="f2"/>${T(90, 142, l)}${T(32, 96, h, 'end')}${T(172, 118, w, 'start')}`),
    cyl: (r, h) => S(`<ellipse cx="120" cy="38" rx="50" ry="14" class="f"/><path d="M70 38 V108 A50 14 0 0 0 170 108 V38" class="f"/><line x1="120" y1="38" x2="170" y2="38" class="d"/>${T(146, 32, r)}${T(178, 82, h, 'start')}`),
    angle: (deg) => {
      const th = deg * Math.PI / 180, ex = 120 + 85 * Math.cos(th), ey = 110 - 85 * Math.sin(th), m = th / 2, m2 = (Math.PI + th) / 2;
      return S(`<line x1="25" y1="110" x2="215" y2="110"/><line x1="120" y1="110" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}"/>${T((120 + 44 * Math.cos(m)).toFixed(1), (112 - 44 * Math.sin(m)).toFixed(1), deg + '&deg;')}${T((120 + 36 * Math.cos(m2)).toFixed(1), (112 - 36 * Math.sin(m2)).toFixed(1), 'x')}`);
    },
  };
  const ext = { sqrtOK: (n) => Number.isInteger(Math.sqrt(n)) };

  /* ===================== 13. WORD PROBLEMS ===================== */
  UNITS.push({
    id: 'wordprob', icon: '13', title: 'Word Problems: Averages, Interest, Work & More',
    blurb: 'The classic Arithmetic Reasoning problem types, with a repeatable setup for each.',
    lessons: [
      { title: 'Averages', check: 'avg', body: `
        <div class="key"><b>Average = sum &divide; count.</b> So <b>sum = average &times; count</b>. That second form solves most average problems.</div>
        <div class="ex">Average of 5 numbers is 14, so their sum is 70. If four of them total 55, the fifth is 70 &minus; 55 = <b>15</b>.</div>` },
      { title: 'Averages: the score you need', check: 'avgneed', body: `
        <p>Find the total you need, subtract what you already have.</p>
        <div class="ex">Four tests average 80 (total 320). To average 82 over 5 tests you need a total of 410, so the 5th score = 410 &minus; 320 = <b>90</b>.</div>` },
      { title: 'Simple interest', check: 'interest', body: `
        <div class="key"><b>I = P &times; r &times; t</b> &nbsp;(principal &times; yearly rate &times; years). Turn the rate into a decimal. Total = P + I.</div>
        <div class="ex">$800 at 5% for 3 years: 800 &times; 0.05 &times; 3 = <b>$120</b> interest.</div>` },
      { title: 'Work problems', check: 'work', body: `
        <div class="key">Add the <b>rates</b> (jobs per hour). If A takes a hours and B takes b hours, together: 1/a + 1/b = 1/t.</div>
        <div class="ex">A: 6 hours, B: 3 hours &rarr; ${fr(1, 6)} + ${fr(1, 3)} = ${fr(1, 2)} of the job per hour &rarr; <b>2 hours</b>.</div>
        <p>Sanity check: working together must be faster than the faster worker alone.</p>` },
      { title: 'Translating words to equations', check: 'translate', body: `
        <ul><li>&ldquo;is&rdquo;, &ldquo;equals&rdquo;, &ldquo;results in&rdquo; &rarr; <b>=</b></li><li>&ldquo;sum&rdquo;, &ldquo;more than&rdquo;, &ldquo;increased by&rdquo; &rarr; <b>+</b></li><li>&ldquo;difference&rdquo;, &ldquo;less than&rdquo;, &ldquo;decreased by&rdquo; &rarr; <b>&minus;</b></li><li>&ldquo;product&rdquo;, &ldquo;times&rdquo;, &ldquo;of&rdquo; &rarr; <b>&times;</b></li><li>&ldquo;twice&rdquo; &rarr; 2 &times;, &ldquo;half&rdquo; &rarr; &divide; 2</li></ul>
        <div class="ex">&ldquo;5 more than 3 times a number is 26&rdquo; &rarr; 3x + 5 = 26 &rarr; x = <b>7</b>.</div>
        <div class="tip">&ldquo;Less than&rdquo; reverses order: &ldquo;4 less than x&rdquo; is x &minus; 4.</div>` },
      { title: 'Consecutive integers', check: 'consec', body: `
        <div class="key">Three consecutive integers: n, n + 1, n + 2 (sum = 3n + 3). Consecutive <b>even</b> or <b>odd</b> integers go up by <b>2</b>: n, n + 2, n + 4.</div>
        <div class="ex">Three consecutive integers sum to 72: 3n + 3 = 72 &rarr; n = 23, so they are 23, 24, 25.</div>` },
      { title: 'Two unknowns (tickets & coins)', check: 'tickets', body: `
        <p>Let one unknown be x and write the other in terms of x using the total.</p>
        <div class="ex">20 tickets: adult $5, child $3, revenue $84. Adults = a, children = 20 &minus; a: 5a + 3(20 &minus; a) = 84 &rarr; 2a + 60 = 84 &rarr; a = <b>12</b>.</div>
        <div class="tip">Another strategy: plug in the answer choices. Test one in the middle and adjust.</div>` },
    ],
    types: {
      avg: () => {
        if (R(0, 1)) {
          const m = R(72, 92); let d = [R(-12, 12), R(-12, 12), R(-12, 12)]; const d4 = -(d[0] + d[1] + d[2]); d.push(d4);
          if (Math.abs(d4) > 15) return UNITS[12].types.avg();
          const sc = shuffle(d.map((x) => m + x));
          return num(`A soldier's four test scores are ${sc.join(', ')}. What is the average score?`, m, `Sum = ${sc.reduce((a, b) => a + b, 0)}. Average = ${sc.reduce((a, b) => a + b, 0)} &divide; 4 = ${m}.`, { bad: [m + 1, m - 1, Math.max(...sc), Math.round(sc.reduce((a, b) => a + b, 0) / 3)] });
        }
        const m = R(10, 30), n = R(4, 6); const xs = Array.from({ length: n - 1 }, () => R(m - 6, m + 6)), last = m * n - xs.reduce((a, b) => a + b, 0);
        if (last < 1) return UNITS[12].types.avg();
        return num(`The average of ${n} numbers is ${m}. ${n - 1} of the numbers are ${xs.join(', ')}. What is the remaining number?`, last, `Total of all ${n} = ${m} &times; ${n} = ${m * n}. Known total = ${xs.reduce((a, b) => a + b, 0)}. Missing = ${last}.`, { bad: [m, m * n, Math.abs(last - m) || last + 2, last + 5] });
      },
      avgneed: () => {
        const A = R(70, 85), B = A + R(1, 2), need = 5 * B - 4 * A;
        return num(`Maya's average on her first 4 tests is ${A}. What score does she need on her 5th test to raise her average to ${B}?`, need, `Needed total = ${B} &times; 5 = ${5 * B}. Current total = ${A} &times; 4 = ${4 * A}. 5th test = ${5 * B} &minus; ${4 * A} = ${need}.`, { bad: [B, B + 1, (A + B) / 2 + 1, 2 * B - A].map((x) => Math.round(x)) });
      },
      interest: () => {
        const P = R(5, 20) * 100, r = R(3, 8), t = R(2, 5), I = P * r * t / 100, k = R(0, 2);
        if (k === 0) return num(`How much simple interest is earned on ${usd(P)} at ${r}% per year for ${t} years?`, I, `I = P &times; r &times; t = ${P} &times; ${r / 100} &times; ${t} = ${usd(I)}.`, { f: usd, bad: [P * r * t, P * r / 100, I + P, I * 2] });
        if (k === 1) return num(`Tom invests ${usd(P)} at ${r}% simple interest for ${t} years. What is the total amount at the end?`, P + I, `Interest = ${P} &times; ${r / 100} &times; ${t} = ${usd(I)}. Total = ${usd(P)} + ${usd(I)} = ${usd(P + I)}.`, { f: usd, bad: [I, P + P * r / 100, P * (1 + r / 100 * 1) * t, P + I * 2] });
        return num(`A ${usd(P)} loan earns ${usd(I)} in simple interest over ${t} years. What is the yearly interest rate?`, r, `r = I &divide; (P &times; t) = ${I} &divide; (${P} &times; ${t}) = ${r / 100} = ${r}%.`, { f: (n) => n + '%', bad: [r * 2, r + 1, r - 1, t] });
      },
      work: () => {
        const [a, b] = pick([[6, 3], [12, 4], [10, 15], [20, 30], [6, 12], [8, 8], [9, 18], [12, 6], [15, 10], [4, 12], [24, 8]]), t = a * b / (a + b);
        const who = pick([['Ana', 'Ben', 'paint a room'], ['Machine A', 'Machine B', 'fill an order'], ['Pump A', 'Pump B', 'fill a tank']]);
        return num(`${who[0]} can ${who[2]} in ${a} hours. ${who[1]} can do the same job in ${b} hours. Working together, how many hours will it take?`, t, `Rates: 1/${a} + 1/${b} = ${a + b}/${a * b} of the job per hour. Time = ${a * b}/${a + b} = ${fmt(t)} hours.`, { f: (n) => fmt(n) + ' hours', bad: [(a + b) / 2, a + b, Math.min(a, b), a * b / 2] });
      },
      translate: () => {
        const x = R(3, 20), m = R(2, 6), a = R(2, 9), t = R(0, 3);
        if (t === 0) return num(`${a} more than ${m} times a number is ${m * x + a}. What is the number?`, x, `${m}x + ${a} = ${m * x + a} &rarr; ${m}x = ${m * x} &rarr; x = ${x}.`, { bad: [m * x + a - a - m, (m * x + a) / m, m * x - a, x + a] });
        if (t === 1) return num(`A number is multiplied by ${m} and then decreased by ${a}. The result is ${m * x - a}. What is the number?`, x, `${m}x &minus; ${a} = ${m * x - a} &rarr; ${m}x = ${m * x} &rarr; x = ${x}.`, { bad: [x - a, x + 2 * a, (m * x - a) / m < 0 ? x + 1 : r6((m * x - a) / m), m * x] });
        if (t === 2) return num(`Twice the sum of a number and ${a} is ${2 * (x + a)}. What is the number?`, x, `2(x + ${a}) = ${2 * (x + a)} &rarr; x + ${a} = ${x + a} &rarr; x = ${x}.`, { bad: [x + a, x + 2 * a, x + a + 2, x - a < 0 ? x + 3 : x - a] });
        const e = 2 * x; return num(`Half of a number, decreased by ${a}, is ${x - a}. What is the number?`, e, `x/2 &minus; ${a} = ${x - a} &rarr; x/2 = ${x} &rarr; x = ${e}.`, { allowNeg: true, bad: [x, x - a, e + a, e - a] });
      },
      consec: () => {
        const t = R(0, 2);
        if (t === 0) { const n = R(10, 60), S = 3 * n + 3; return num(`The sum of three consecutive integers is ${S}. What is the smallest of the three?`, n, `n + (n+1) + (n+2) = 3n + 3 = ${S} &rarr; n = ${n}.`, { bad: [S / 3, n + 2, n - 1, n + 1].filter((x) => x !== n) }); }
        if (t === 1) { const a = 2 * R(8, 30), S = 2 * a + 2; return num(`The sum of two consecutive even integers is ${S}. What is the larger one?`, a + 2, `n + (n+2) = 2n + 2 = ${S} &rarr; n = ${a}. The larger is ${a + 2}.`, { bad: [a, S / 2, a + 4, a + 1] }); }
        const a = 2 * R(5, 25) + 1, S = 3 * a + 6; return num(`The sum of three consecutive odd integers is ${S}. What is the largest of the three?`, a + 4, `n + (n+2) + (n+4) = 3n + 6 = ${S} &rarr; n = ${a}. The largest is ${a + 4}.`, { bad: [a, a + 2, a + 6, S / 3 + 1] });
      },
      tickets: () => {
        const a = R(5, 18), c = R(5, 18), A = pick([8, 10, 12, 15]), C = pick([4, 5, 6, 7]), tot = a + c, rev = A * a + C * c;
        const it = pick([['tickets', 'adult', 'child'], ['tickets', 'adult', 'student']]);
        return num(`A show sold ${tot} tickets. Adult tickets cost ${usd(A)} and ${it[2]} tickets cost ${usd(C)}. Total sales were ${usd(rev)}. How many ${it[1]} tickets were sold?`, a, `Let a = adults. ${A}a + ${C}(${tot} &minus; a) = ${rev} &rarr; ${A - C}a + ${C * tot} = ${rev} &rarr; ${A - C}a = ${rev - C * tot} &rarr; a = ${a}.`, { bad: [c, a + 1, a - 1, Math.round(tot / 2)] });
      },
    },
  });

  /* ===================== 14. DATA & PROBABILITY ===================== */
  const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
  UNITS.push({
    id: 'probability', icon: '14', title: 'Data, Probability & Counting',
    blurb: 'Mean, median, mode, range, probability, the counting principle, permutations and combinations.',
    lessons: [
      { title: 'Mean', check: 'mean', body: `<p>The <b>mean</b> is the average: add them up, divide by how many.</p><div class="ex">4, 8, 9, 11, 13 &rarr; sum 45, 5 numbers &rarr; mean <b>9</b>.</div>` },
      { title: 'Median', check: 'median', body: `
        <div class="key"><b>Median</b> = the middle value <b>after sorting</b>. With an even count, average the two middle values.</div>
        <div class="ex">9, 3, 7, 1, 5 &rarr; sorted 1, 3, 5, 7, 9 &rarr; median <b>5</b>.</div>
        <div class="tip">The #1 mistake is skipping the sort.</div>` },
      { title: 'Mode & range', check: 'modrange', body: `<p><b>Mode</b> = most frequent value. <b>Range</b> = largest &minus; smallest.</p><div class="ex">2, 5, 5, 8, 11 &rarr; mode <b>5</b>, range 11 &minus; 2 = <b>9</b>.</div>` },
      { title: 'Probability basics', check: 'prob', body: `
        <div class="key"><b>P(event) = favorable outcomes &divide; total outcomes.</b> Always between 0 and 1.</div>
        <div class="ex">Bag: 5 red, 3 blue, 2 green. P(blue) = ${fr(3, 10)} (<i>total</i> is 10, not 7).</div>` },
      { title: 'Two events (AND / OR)', check: 'compound', body: `
        <ul><li><b>AND (independent):</b> multiply. Two heads in a row: ${fr(1, 2)} &times; ${fr(1, 2)} = ${fr(1, 4)}.</li>
        <li><b>Without replacement:</b> the second probability changes. 2 red in a row from 3 red + 2 blue: ${fr(3, 5)} &times; ${fr(2, 4)} = ${fr(3, 10)}.</li>
        <li><b>OR (can't both happen):</b> add.</li></ul>` },
      { title: 'The counting principle', check: 'count', body: `<div class="key">If one choice can be made in <b>m</b> ways and another in <b>n</b> ways, together there are <b>m &times; n</b> ways.</div><div class="ex">4 shirts &times; 3 pants &times; 2 hats = <b>24</b> outfits.</div>` },
      { title: 'Permutations & combinations', check: 'permcomb', body: `
        <div class="key"><b>Order matters</b> &rarr; permutation: P(n, r) = n &times; (n&minus;1) &times; &hellip; (r factors).<br><b>Order doesn't matter</b> &rarr; combination: C(n, r) = P(n, r) &divide; r!</div>
        <div class="ex">President + VP from 6 people (order matters): 6 &times; 5 = <b>30</b>. A 2-person team from 6: 30 &divide; 2 = <b>15</b>.</div>
        <p>Arranging all n things in a row: n! (5! = 5&times;4&times;3&times;2&times;1 = 120).</p>` },
    ],
    types: {
      mean: () => {
        const n = pick([5, 6, 4]), m = R(8, 40); let xs; do { xs = Array.from({ length: n - 1 }, () => m + R(-7, 7)); } while (false);
        const last = m * n - xs.reduce((a, b) => a + b, 0); xs.push(last); xs = shuffle(xs);
        if (xs.some((x) => x < 1)) return UNITS[13].types.mean();
        return num(`What is the mean (average) of ${xs.join(', ')}?`, m, `Sum = ${xs.reduce((a, b) => a + b, 0)}; ${xs.reduce((a, b) => a + b, 0)} &divide; ${n} = ${m}.`, { bad: [m + 1, m - 1, [...xs].sort((a, b) => a - b)[Math.floor(n / 2)], Math.max(...xs)] });
      },
      median: () => {
        const odd = R(0, 1) === 0; let xs;
        do { xs = Array.from({ length: odd ? pick([5, 7]) : 6 }, () => R(2, 60)); } while (new Set(xs).size < xs.length || (!odd && ([...xs].sort((a, b) => a - b)[2] + [...xs].sort((a, b) => a - b)[3]) % 2));
        const s = [...xs].sort((a, b) => a - b), n = s.length, med = odd ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
        return num(`What is the median of ${xs.join(', ')}?`, med, `Sorted: ${s.join(', ')}. ${odd ? 'The middle value is ' + med : 'The two middle values are ' + s[n / 2 - 1] + ' and ' + s[n / 2] + ', whose average is ' + med}.`, { bad: [xs[Math.floor(n / 2)], Math.round(xs.reduce((a, b) => a + b, 0) / n), s[n - 1], s[Math.floor(n / 2)] + 1] });
      },
      modrange: () => {
        let xs; do { xs = Array.from({ length: 7 }, () => R(3, 30)); const c = xs[R(0, 6)]; xs[R(0, 6)] = c; xs[R(0, 6)] = c; } while (false);
        const cnt = {}; xs.forEach((x) => (cnt[x] = (cnt[x] || 0) + 1)); const mx = Math.max(...Object.values(cnt)), modes = Object.keys(cnt).filter((k) => cnt[k] === mx);
        if (modes.length !== 1 || mx < 2) return UNITS[13].types.modrange();
        const s = [...xs].sort((a, b) => a - b);
        if (R(0, 1)) return num(`What is the mode of ${xs.join(', ')}?`, +modes[0], `${modes[0]} appears ${mx} times, more than any other value.`, { bad: [s[3], s[0], s[6], Math.round(xs.reduce((a, b) => a + b, 0) / 7)] });
        return num(`What is the range of ${xs.join(', ')}?`, s[6] - s[0], `Largest &minus; smallest = ${s[6]} &minus; ${s[0]} = ${s[6] - s[0]}.`, { bad: [s[6], s[6] + s[0], s[3], s[6] - s[0] + 1] });
      },
      prob: () => {
        const r = R(2, 8), b = R(2, 8), g = R(1, 6), t = r + b + g, c = pick([['red', r], ['blue', b], ['green', g]]);
        const other = t - c[1];
        return mk(`A bag has ${r} red, ${b} blue and ${g} green marbles. One is drawn at random. What is the probability it is ${c[0]}?`, frR(c[1], t), [frR(c[1], other), frR(other, t), frR(c[1] + 1, t), frR(c[1], t + 1), frR(c[1], t - 1 || t + 2)],
          `Favorable = ${c[1]}, total = ${t}. P = ${fr(c[1], t)}${gcd(c[1], t) > 1 ? ' = ' + frR(c[1], t) : ''}. (Use the <i>total</i> as the denominator.)`);
      },
      compound: () => {
        const t = R(0, 2);
        if (t === 0) { const k = pick([2, 3]); return mk(`A fair coin is flipped ${k} times. What is the probability of getting heads every time?`, fr(1, Math.pow(2, k)), [fr(1, 2 * k), fr(1, k), fr(k, Math.pow(2, k)), fr(1, Math.pow(2, k + 1))], `Each flip is ${fr(1, 2)}. Multiply: ${Array(k).fill(fr(1, 2)).join(' &times; ')} = ${fr(1, Math.pow(2, k))}.`); }
        if (t === 1) { const n = pick([4, 6, 8, 10, 12]); return mk(`A fair ${n}-sided die is rolled twice. What is the probability of rolling a 1 both times?`, fr(1, n * n), [fr(2, n), fr(1, 2 * n), fr(1, n), fr(2, n * n)], `P(first) = ${fr(1, n)} and P(second) = ${fr(1, n)}. Multiply: ${fr(1, n * n)}.`); }
        const r = R(3, 6), b = R(2, 5), tot = r + b;
        return mk(`A bag has ${r} red and ${b} blue marbles. Two are drawn <b>without replacement</b>. What is the probability that both are red?`, frR(r * (r - 1), tot * (tot - 1)), [frR(r * r, tot * tot), frR(2 * r, tot * 2), frR(r * (r - 1) + 1, tot * (tot - 1)), frR(r, tot), frR(r * (r - 1), tot * tot)],
          `First red: ${fr(r, tot)}. Then ${r - 1} red remain out of ${tot - 1}: ${fr(r - 1, tot - 1)}. Multiply: ${frR(r * (r - 1), tot * (tot - 1))}.`);
      },
      count: () => {
        const a = R(3, 8), b = R(2, 6), c = R(2, 5);
        if (R(0, 1)) return num(`A uniform comes with ${a} shirts and ${b} pairs of pants. How many different outfits are possible?`, a * b, `${a} &times; ${b} = ${a * b}.`, { bad: [a + b, a * b + a, a * b - b] });
        return num(`A menu offers ${a} entrees, ${b} sides and ${c} drinks. How many different meals (one of each) can be ordered?`, a * b * c, `${a} &times; ${b} &times; ${c} = ${a * b * c}.`, { bad: [a + b + c, a * b + c, a * b * c + a] });
      },
      permcomb: () => {
        const t = R(0, 2);
        if (t === 0) { const n = R(4, 6); return num(`In how many different orders can ${n} books be placed on a shelf?`, fact(n), `${Array.from({ length: n }, (_, i) => n - i).join(' &times; ')} = ${fact(n)}.`, { bad: [n * n, n * (n - 1), fact(n - 1), fact(n) / 2] }); }
        if (t === 1) { const n = R(5, 9); return num(`A squad of ${n} must choose a leader and a deputy (different people). How many ways can they be chosen?`, n * (n - 1), `Order matters: ${n} &times; ${n - 1} = ${n * (n - 1)}.`, { bad: [n * (n - 1) / 2, n * n, 2 * n, n + (n - 1)] }); }
        const n = R(5, 9), r = pick([2, 3]), c = r === 2 ? n * (n - 1) / 2 : n * (n - 1) * (n - 2) / 6, p = r === 2 ? n * (n - 1) : n * (n - 1) * (n - 2);
        return num(`How many different committees of ${r} people can be chosen from ${n} people?`, c, `Order doesn't matter, so divide the ordered count (${p}) by ${r}! = ${fact(r)}: ${c}.`, { bad: [p, n * r, c * 2, c + n] });
      },
    },
  });

  /* ===================== 15. GEOMETRY I ===================== */
  UNITS.push({
    id: 'geometry1', icon: '15', title: 'Geometry I: Angles, Perimeter & Area',
    blurb: 'Angle facts, triangle and polygon angle sums, perimeter, and the area formulas.',
    lessons: [
      { title: 'Angle basics', check: 'angles', body: `
        <div class="key"><b>Complementary</b> angles add to <b>90&deg;</b>. <b>Supplementary</b> angles (a straight line) add to <b>180&deg;</b>. Vertical angles are equal.</div>
        <div class="ex">The supplement of 65&deg; is 180 &minus; 65 = <b>115&deg;</b>. The complement is 90 &minus; 65 = 25&deg;.</div>` },
      { title: 'Triangle angles', check: 'tri', body: `
        <div class="key">The three angles of a triangle add to <b>180&deg;</b>. In an <b>isosceles</b> triangle the two base angles are equal.</div>
        <div class="ex">Angles 52&deg; and 71&deg;: third = 180 &minus; 123 = <b>57&deg;</b>.</div>` },
      { title: 'Polygon angles', check: 'poly', body: `
        <div class="key">Interior angles of an n-sided polygon add to <b>(n &minus; 2) &times; 180&deg;</b>. A <b>regular</b> polygon splits that evenly among n angles.</div>
        <div class="ex">Hexagon (n = 6): 4 &times; 180 = <b>720&deg;</b>; each angle in a regular hexagon = 720 &divide; 6 = 120&deg;.</div>` },
      { title: 'Perimeter', check: 'perimeter', body: `
        <p><b>Perimeter</b> = distance around. Rectangle: P = 2(l + w). Square: P = 4s. Add all sides for any polygon.</p>
        <div class="ex">A 12 &times; 7 rectangle: 2(12 + 7) = <b>38</b>.</div>
        <p>Missing side: if P = 30 and l = 10, then l + w = 15, so w = <b>5</b>.</p>` },
      { title: 'Area formulas', check: 'area', body: `
        <ul><li>Rectangle: <b>A = l &times; w</b> &nbsp; Square: <b>s<sup>2</sup></b></li><li>Triangle: <b>A = &frac12; &times; b &times; h</b></li><li>Parallelogram: <b>A = b &times; h</b> (use the <i>perpendicular</i> height, not the slanted side)</li><li>Trapezoid: <b>A = &frac12; (b<sub>1</sub> + b<sub>2</sub>) &times; h</b></li></ul>
        <div class="ex">Triangle, base 10, height 6: &frac12; &times; 10 &times; 6 = <b>30</b>.</div>` },
      { title: 'Composite shapes & cost', check: 'composite', body: `
        <p>Split an odd shape into rectangles, or take a big rectangle and <b>subtract</b> the piece that's missing.</p>
        <div class="key"><b>Units!</b> 1 sq yd = 9 sq ft. Pricing per square yard with measurements in feet needs a conversion.</div>
        <div class="ex">14 &times; 10 rectangle with a 4 &times; 3 corner removed: 140 &minus; 12 = <b>128</b>.</div>` },
    ],
    types: {
      angles: () => {
        const t = R(0, 3);
        if (t === 0) { const a = R(2, 8) * 10 + R(0, 1) * 5; return num(`What is the complement of a ${a}&deg; angle?`, 90 - a, `Complementary angles add to 90&deg;: 90 &minus; ${a} = ${90 - a}&deg;.`, { f: (n) => n + '&deg;', bad: [180 - a, a, 90 + a] }); }
        if (t === 1) { const a = pick([30, 40, 50, 55, 65, 70, 110, 120, 130, 145]); return num(`A ray meets a straight line, forming an angle of ${a}&deg; as shown. What is the measure of angle x?`, 180 - a, `Angles on a straight line add to 180&deg;: 180 &minus; ${a} = ${180 - a}&deg;.`, { f: (n) => n + '&deg;', bad: [90 - a > 0 ? 90 - a : a + 90, 360 - a, a, 180 + a], fig: F.angle(a) }); }
        if (t === 2) { const k = pick([2, 3]), x = R(15, 40), c = 180 - (k + 1) * x; return num(`Two angles are supplementary. One measures x&deg; and the other measures (${k}x + ${c})&deg;. What is x?`, x, `Supplementary: x + ${k}x + ${c} = 180 &rarr; ${k + 1}x = ${180 - c} &rarr; x = ${x}.`, { f: (n) => n + '&deg;', bad: [180 - c, (180 - c) / k, x + 5, x - 5].map((v) => r6(v)) }); }
        const a = R(2, 8) * 10 + 5; return num(`Two lines cross. One of the angles formed measures ${a}&deg;. What is the measure of the angle directly opposite it?`, a, `Vertical (opposite) angles are equal: ${a}&deg;.`, { f: (n) => n + '&deg;', bad: [180 - a, 90 - a < 0 ? a + 90 : 90 - a, 360 - a, 2 * a] });
      },
      tri: () => {
        const t = R(0, 2);
        if (t === 0) { const a = R(3, 9) * 10 + R(0, 1) * 2, b = R(3, 9) * 10 + R(1, 4); return num(`Two angles of a triangle measure ${a}&deg; and ${b}&deg;. What is the third angle?`, 180 - a - b, `180 &minus; (${a} + ${b}) = ${180 - a - b}&deg;.`, { f: (n) => n + '&deg;', bad: [180 - a, 180 - b, 360 - a - b, a + b] }); }
        if (t === 1) { const v = R(2, 12) * 8; return num(`An isosceles triangle has a vertex angle of ${v}&deg;. What is the measure of each base angle?`, (180 - v) / 2, `The other two angles share 180 &minus; ${v} = ${180 - v}&deg; equally: ${(180 - v) / 2}&deg; each.`, { f: (n) => n + '&deg;', bad: [180 - v, v / 2, (180 - v) / 2 + 10, 90 - v] }); }
        const a = R(2, 8) * 10 + 5; return num(`One acute angle of a right triangle measures ${a}&deg;. What is the other acute angle?`, 90 - a, `A right triangle has 90&deg; plus two acute angles totaling 90&deg;: 90 &minus; ${a} = ${90 - a}&deg;.`, { f: (n) => n + '&deg;', bad: [180 - a, 90 + a, a, 180 - a - 90 + 10] });
      },
      poly: () => {
        const names = { 5: 'pentagon', 6: 'hexagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon', 7: 'heptagon' };
        if (R(0, 1)) { const n = pick([5, 6, 7, 8, 9, 10]); return num(`What is the sum of the interior angles of a ${names[n]} (${n} sides)?`, (n - 2) * 180, `(n &minus; 2) &times; 180 = ${n - 2} &times; 180 = ${(n - 2) * 180}&deg;.`, { f: (x) => fmt(x) + '&deg;', bad: [n * 180, (n - 1) * 180, (n - 2) * 90, 360] }); }
        const n = pick([5, 6, 8, 9, 10, 12]), s = (n - 2) * 180; return num(`What is the measure of each interior angle of a regular ${names[n]}?`, s / n, `Total = ${s}&deg;. Divide among ${n} equal angles: ${s} &divide; ${n} = ${s / n}&deg;.`, { f: (x) => x + '&deg;', bad: [s / (n - 1), 360 / n, s, 180 - 360 / n + 10].map((v) => r6(v)) });
      },
      perimeter: () => {
        const t = R(0, 3), l = R(6, 20), w = R(3, l - 1);
        if (t === 0) return num(`What is the perimeter of the rectangle shown?`, 2 * (l + w), `P = 2(l + w) = 2(${l} + ${w}) = ${2 * (l + w)}.`, { bad: [l + w, l * w, 2 * l + w, 2 * (l + w) + 2], fig: F.rect(l, w) });
        if (t === 1) { const s = R(4, 25); return num(`A square has a side of ${s} feet. What is its perimeter?`, 4 * s, `P = 4 &times; ${s} = ${4 * s} feet.`, { f: (n) => n + ' feet', bad: [s * s, 2 * s, 4 * s + 4, s + 4] }); }
        if (t === 2) return num(`A rectangle has a perimeter of ${2 * (l + w)} and a length of ${l}. What is its width?`, w, `l + w = ${l + w}, so w = ${l + w} &minus; ${l} = ${w}.`, { bad: [l + w - 2, 2 * (l + w) - l, (2 * (l + w) - l) / 2 + 1, l - w] });
        const p = pick([2, 3, 4, 5]); return num(`A ${l} yard by ${w} yard field will be fenced. Fencing costs $${p} per yard. What is the total cost of the fence?`, 2 * (l + w) * p, `Perimeter = 2(${l} + ${w}) = ${2 * (l + w)} yards. Cost = ${2 * (l + w)} &times; $${p} = ${usd(2 * (l + w) * p)}.`, { f: usd, bad: [l * w * p, (l + w) * p, 2 * (l + w) + p] });
      },
      area: () => {
        const t = R(0, 4);
        if (t === 0) { const l = R(6, 20), w = R(3, 12); return num(`What is the area of the rectangle shown (square units)?`, l * w, `A = l &times; w = ${l} &times; ${w} = ${l * w}.`, { bad: [2 * (l + w), l + w, l * w + l, l * (w - 1)], fig: F.rect(l, w) }); }
        if (t === 1) { const b = R(3, 12) * 2, h = R(3, 14); return num(`What is the area of the triangle shown (square units)?`, b * h / 2, `A = &frac12; &times; b &times; h = &frac12; &times; ${b} &times; ${h} = ${b * h / 2}.`, { bad: [b * h, b + h, b * h / 4, b * h / 2 + b], fig: F.tri(b, h) }); }
        if (t === 2) { const b1 = R(3, 8) * 2, b2 = b1 + R(2, 5) * 2, h = R(3, 9); return num(`What is the area of the trapezoid shown (square units)?`, (b1 + b2) * h / 2, `A = &frac12;(b<sub>1</sub> + b<sub>2</sub>)h = &frac12;(${b1} + ${b2}) &times; ${h} = ${(b1 + b2) * h / 2}.`, { bad: [(b1 + b2) * h, b1 * b2, b2 * h, (b1 + b2) * h / 4], fig: F.trap(b1, b2, h) }); }
        if (t === 3) { const b = R(5, 15), h = R(3, 10), sl = h + R(1, 4); return num(`A parallelogram has a base of ${b}, a height of ${h}, and a slanted side of ${sl}. What is its area?`, b * h, `A = base &times; perpendicular height = ${b} &times; ${h} = ${b * h}. (The slanted side is a distractor.)`, { bad: [b * sl, 2 * (b + sl), b * h / 2, (b + h) * 2] }); }
        const s = R(3, 14); return num(`A square has a perimeter of ${4 * s}. What is its area?`, s * s, `Side = ${4 * s} &divide; 4 = ${s}. Area = ${s}<sup>2</sup> = ${s * s}.`, { bad: [4 * s, 2 * s, s * s * 4, s * s + s] });
      },
      composite: () => {
        const t = R(0, 2);
        if (t === 0) { const A = R(10, 20), B = R(8, 14), C = R(2, 5), D = R(2, 5); return num(`A rectangular plot measures ${A} ft by ${B} ft. A ${C} ft by ${D} ft rectangular corner is cut away to form an L-shape. What is the area of the L-shape?`, A * B - C * D, `${A} &times; ${B} = ${A * B}. Remove ${C} &times; ${D} = ${C * D}. Area = ${A * B - C * D} sq ft.`, { f: (n) => fmt(n) + ' sq ft', bad: [A * B + C * D, A * B, (A - C) * (B - D) + C * D, A * B - C - D] }); }
        if (t === 1) { const a = R(2, 6), b = R(2, 6), p = R(3, 6); return num(`A room is ${3 * a} feet by ${3 * b} feet. Carpet costs ${usd(p)} per <b>square yard</b>. What is the cost to carpet the room?`, a * b * p, `Room in yards: ${a} yd &times; ${b} yd = ${a * b} sq yd. Cost = ${a * b} &times; ${usd(p)} = ${usd(a * b * p)}.`, { f: usd, bad: [9 * a * b * p, 3 * a * b * p, a * b + p, 2 * (a + b) * p] }); }
        const l = R(8, 18), w = R(6, 12), p = R(2, 5); return num(`A rectangular floor measures ${l} feet by ${w} feet. Tile costs ${usd(p)} per square foot. How much will the tile cost?`, l * w * p, `Area = ${l} &times; ${w} = ${l * w} sq ft. Cost = ${l * w} &times; ${usd(p)} = ${usd(l * w * p)}.`, { f: usd, bad: [2 * (l + w) * p, (l + w) * p, l * w + p, l * w * p + l * w] });
      },
    },
  });

  /* ===================== 16. GEOMETRY II ===================== */
  const trip = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]];
  const sl = (dy, dx) => { const g = gcd(Math.abs(dy), Math.abs(dx)), n = dy / g, d = dx / g, s = n < 0 !== d < 0 ? '−' : '', N = Math.abs(n), D = Math.abs(d); return D === 1 ? s + N : s + `<span class="frac"><span>${N}</span><span>${D}</span></span>`; };
  const pt = (x, y) => `(${neg(x)}, ${neg(y)})`;
  UNITS.push({
    id: 'geometry2', icon: '16', title: 'Geometry II: Circles, Volume, Pythagorean & Coordinates',
    blurb: 'Circle formulas, volume, the Pythagorean theorem, similar figures, slope, midpoint and distance.',
    lessons: [
      { title: 'Circles', check: 'circle', body: `
        <div class="key"><b>Circumference C = 2&pi;r = &pi;d.</b> &nbsp; <b>Area A = &pi;r<sup>2</sup>.</b> Radius = half the diameter.</div>
        <div class="ex">r = 6: C = 12&pi;, A = <b>36&pi;</b> (square the radius <i>before</i> multiplying by &pi;).</div>
        <p>Answers on the ASVAB are usually left &ldquo;in terms of &pi;&rdquo;.</p>` },
      { title: 'Volume', check: 'volume', body: `
        <ul><li>Box: <b>V = l &times; w &times; h</b></li><li>Cube: <b>V = s<sup>3</sup></b></li><li>Cylinder: <b>V = &pi;r<sup>2</sup>h</b> (area of the circle times height)</li></ul>
        <div class="ex">A 6 &times; 5 &times; 4 box: 6 &times; 5 &times; 4 = <b>120</b> cubic units.</div>` },
      { title: 'The Pythagorean theorem', check: 'pyth', body: `
        <div class="key">In a <b>right triangle</b>: <b>a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></b>, where c is the hypotenuse (opposite the right angle, the longest side).</div>
        <div class="ex">Legs 6 and 8: 36 + 64 = 100, so c = <b>10</b>.</div>
        <p>Memorize the triples: <b>3-4-5, 5-12-13, 8-15-17, 7-24-25</b> and their multiples (6-8-10, 9-12-15&hellip;). The test loves them.</p>` },
      { title: 'Similar figures & proportions', check: 'similar', body: `
        <div class="key">Similar shapes have the same angles and <b>proportional sides</b>. Find the scale factor and multiply.</div>
        <div class="ex">A 6-ft pole casts a 4-ft shadow. A tree casts a 30-ft shadow. Scale = 30 &divide; 4 = 7.5, so the tree is 6 &times; 7.5 = <b>45 ft</b>.</div>` },
      { title: 'Coordinate geometry', check: 'coord', body: `
        <ul><li><b>Slope</b> = rise &divide; run = (y<sub>2</sub> &minus; y<sub>1</sub>) &divide; (x<sub>2</sub> &minus; x<sub>1</sub>)</li>
        <li><b>Midpoint</b> = average the x's and average the y's</li>
        <li><b>Distance</b>: make a right triangle from the horizontal and vertical differences, then use the Pythagorean theorem</li></ul>
        <div class="ex">(1, 2) to (5, 10): slope = 8 &divide; 4 = <b>2</b>. Midpoint = (3, 6).</div>` },
    ],
    types: {
      circle: () => {
        const t = R(0, 4), r = R(2, 12), d = 2 * r;
        if (t === 0) return mk(`What is the area of the circle shown? (in terms of &pi;)`, pi(r * r), [pi(2 * r), pi(r), pi(4 * r * r), pi(2 * r * r)], `A = &pi;r<sup>2</sup> = &pi;(${r})<sup>2</sup> = ${r * r}&pi;.`, F.circle('r = ' + r));
        if (t === 1) return mk(`What is the circumference of a circle with radius ${r}? (in terms of &pi;)`, pi(2 * r), [pi(r * r), pi(r), pi(4 * r), pi(2 * r + 2)], `C = 2&pi;r = 2 &times; ${r} &times; &pi; = ${2 * r}&pi;.`);
        if (t === 2) return mk(`What is the circumference of the circle shown? (in terms of &pi;)`, pi(d), [pi(2 * d), pi(d * d), pi(r), pi(d + 2)], `C = &pi;d = ${d}&pi;.`, F.circle('d = ' + d, true));
        if (t === 3) return num(`A circle has an area of ${pi(r * r)}. What is its radius?`, r, `&pi;r<sup>2</sup> = ${r * r}&pi; &rarr; r<sup>2</sup> = ${r * r} &rarr; r = ${r}.`, { bad: [r * r, r / 2 + r, 2 * r, r + 1] });
        return num(`A circle has a circumference of ${pi(d)}. What is its radius?`, r, `2&pi;r = ${d}&pi; &rarr; r = ${d} &divide; 2 = ${r}.`, { bad: [d, d * d, r + 1, r * r] });
      },
      volume: () => {
        const t = R(0, 3);
        if (t === 0) { const l = R(3, 12), w = R(2, 9), h = R(2, 8); return num(`What is the volume of the box shown (cubic units)?`, l * w * h, `V = l &times; w &times; h = ${l} &times; ${w} &times; ${h} = ${l * w * h}.`, { bad: [l + w + h, 2 * (l * w + w * h + l * h), l * w * h + l, l * w], fig: F.box(l, w, h) }); }
        if (t === 1) { const s = R(2, 9); return num(`What is the volume of a cube with edges of ${s} inches?`, s * s * s, `V = s<sup>3</sup> = ${s} &times; ${s} &times; ${s} = ${s * s * s} cubic inches.`, { f: (n) => fmt(n) + ' cu in', bad: [3 * s, s * s, 6 * s * s, s * s * s + s] }); }
        if (t === 2) { const r = R(2, 8), h = R(3, 12); return mk(`What is the volume of the cylinder shown? (in terms of &pi;)`, pi(r * r * h), [pi(2 * r * h), pi(r * h), pi(r * r), pi(r * r * h * 2)], `V = &pi;r<sup>2</sup>h = &pi; &times; ${r}<sup>2</sup> &times; ${h} = ${r * r * h}&pi;.`, F.cyl('r = ' + r, 'h = ' + h)); }
        const s = pick([2, 3, 4]), a = s * R(2, 5), b = s * R(2, 4), c = s * R(1, 3) + s; return num(`How many ${s}-inch cubes fit in a box that measures ${a} in by ${b} in by ${c} in?`, (a / s) * (b / s) * (c / s), `Along each edge: ${a / s}, ${b / s}, ${c / s} cubes. ${a / s} &times; ${b / s} &times; ${c / s} = ${(a / s) * (b / s) * (c / s)}.`, { bad: [Math.round(a * b * c / s), (a / s) + (b / s) + (c / s), a * b * c, Math.round(a * b * c / (s * s))] });
      },
      pyth: () => {
        const [a0, b0, c0] = pick(trip), k = pick([1, 1, 2]), a = a0 * k, b = b0 * k, c = c0 * k, t = R(0, 3);
        if (t === 0) return num(`What is the length of the hypotenuse of the right triangle shown?`, c, `a<sup>2</sup> + b<sup>2</sup> = ${a * a} + ${b * b} = ${a * a + b * b} = ${c}<sup>2</sup>, so c = ${c}.`, { bad: [a + b, c + 1, c - 1, a * b], fig: F.right(a, b, '?') });
        if (t === 1) return num(`In the right triangle shown, what is the length of the missing leg?`, b, `a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup> &rarr; b<sup>2</sup> = ${c * c} &minus; ${a * a} = ${b * b} &rarr; b = ${b}.`, { bad: [c - a, c + a, b + 1, b - 1], fig: F.right(a, '?', c) });
        if (t === 2) return num(`A ${c}-foot ladder leans against a wall with its base ${a} feet from the wall. How high up the wall does it reach?`, b, `The ladder is the hypotenuse: height<sup>2</sup> = ${c}<sup>2</sup> &minus; ${a}<sup>2</sup> = ${b * b}, so the height is ${b} feet.`, { f: (n) => n + ' feet', bad: [c - a, c + a, c, b + 1] });
        return num(`What is the length of the diagonal of a rectangle that is ${a} inches by ${b} inches?`, c, `The diagonal is the hypotenuse: &radic;(${a}<sup>2</sup> + ${b}<sup>2</sup>) = &radic;${c * c} = ${c} inches.`, { f: (n) => n + ' inches', bad: [a + b, c + 2, 2 * (a + b), a * b / 2] });
      },
      similar: () => {
        if (R(0, 1)) { const h = pick([5, 6, 8]), s = pick([2, 3, 4]), k = R(3, 12), s2 = s * k; return num(`A post that is ${h} feet tall casts a ${s}-foot shadow. At the same time, a tower casts a ${s2}-foot shadow. How tall is the tower?`, h * k, `Same scale: ${s2} &divide; ${s} = ${k}. Height = ${h} &times; ${k} = ${h * k} feet.`, { f: (n) => n + ' feet', bad: [h + (s2 - s), s2 + h, h * s2, h * k + h] }); }
        const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [9, 12, 15]]), k = R(2, 5);
        if (R(0, 1)) return num(`A triangle has sides ${a}, ${b} and ${c}. A similar triangle has a shortest side of ${a * k}. What is the length of its longest side?`, c * k, `Scale factor = ${a * k} &divide; ${a} = ${k}. Longest side = ${c} &times; ${k} = ${c * k}.`, { bad: [c + (a * k - a), c * k + k, b * k, c + k] });
        return num(`A triangle has sides ${a}, ${b} and ${c}. A similar triangle has a shortest side of ${a * k}. What is the perimeter of the larger triangle?`, (a + b + c) * k, `Scale factor = ${k}. Perimeter = ${a + b + c} &times; ${k} = ${(a + b + c) * k}.`, { bad: [a + b + c + 3 * (a * k - a), (a + b + c) + k, c * k, (a + b + c) * k - k] });
      },
      coord: () => {
        const t = R(0, 2);
        if (t === 0) { const x1 = R(-4, 4), y1 = R(-5, 5), dx = pick([1, 2, 3, 4]), dy = nz(-9, 9), x2 = x1 + dx, y2 = y1 + dy; return mk(`What is the slope of the line through ${pt(x1, y1)} and ${pt(x2, y2)}?`, sl(dy, dx), [sl(dx, dy), sl(-dy, dx), sl(dy, dx + 1), sl(dy + 1, dx), sl(-dx, dy)], `Slope = rise &divide; run = (${neg(y2)} &minus; ${neg(y1)}) &divide; (${neg(x2)} &minus; ${neg(x1)}) = ${neg(dy)} &divide; ${dx} = ${sl(dy, dx)}.`); }
        if (t === 1) { const x1 = R(-8, 8), y1 = R(-8, 8), x2 = x1 + 2 * nz(-5, 5), y2 = y1 + 2 * nz(-5, 5), mx = (x1 + x2) / 2, my = (y1 + y2) / 2; return mk(`What is the midpoint of the segment with endpoints ${pt(x1, y1)} and ${pt(x2, y2)}?`, pt(mx, my), [pt(my, mx), pt(x1 + x2, y1 + y2), pt((x2 - x1) / 2, (y2 - y1) / 2), pt(mx, my + 1), pt(mx + 1, my)], `Average the coordinates: ((${neg(x1)} + ${neg(x2)})/2, (${neg(y1)} + ${neg(y2)})/2) = ${pt(mx, my)}.`); }
        const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]), x1 = R(-4, 3), y1 = R(-4, 3), sx = R(0, 1) ? 1 : -1, sy = R(0, 1) ? 1 : -1, x2 = x1 + sx * a, y2 = y1 + sy * b;
        return num(`What is the distance between ${pt(x1, y1)} and ${pt(x2, y2)}?`, c, `Horizontal difference = ${a}, vertical difference = ${b}. Distance = &radic;(${a}<sup>2</sup> + ${b}<sup>2</sup>) = &radic;${c * c} = ${c}.`, { bad: [a + b, c + 1, c - 1, a * b] });
      },
    },
  });
})();
