/* Units 1-6: whole numbers, integers, factors, fractions, fraction operations, decimals */
(function () {
  const { R, pick, shuffle, gcd, lcm, fmt, neg, money, dec, r6, fr, frR, mixed, frOut, mk, num } = L;
  const dc = (v) => (String(v).split('.')[1] || '').length; // decimal places
  const P = (x) => (x < 0 ? '(' + neg(x) + ')' : String(x)); // parenthesise negatives

  /* ===================== 1. WHOLE NUMBERS & ORDER OF OPERATIONS ===================== */
  UNITS.push({
    id: 'whole', icon: '1', title: 'Whole Numbers & Order of Operations',
    blurb: 'Place value, rounding, the four operations and PEMDAS. Everything else stands on this.',
    lessons: [
      { title: 'Place value', check: 'place', body: `
        <p>Every digit sits in a <b>place</b>, and the place decides what the digit is worth.</p>
        <p>In <b>3,482,615</b>: 3 = millions, 4 = hundred-thousands, 8 = ten-thousands, 2 = thousands, 6 = hundreds, 1 = tens, 5 = ones.</p>
        <div class="ex">The 4 is in the hundred-thousands place, so it is worth <b>400,000</b>, not 4.</div>
        <div class="tip">ASVAB tip: wrong answers are often "right digits, wrong place." Always check the size of your answer.</div>` },
      { title: 'Rounding & estimating', check: 'round', body: `
        <div class="key"><b>Rounding rule:</b> look at the digit just to the <i>right</i> of the place you are rounding to. <b>5 or more</b> &rarr; round up. <b>4 or less</b> &rarr; leave it.</div>
        <div class="ex">Round 4,586 to the nearest hundred. The hundreds digit is 5; the next digit is 8 (5 or more), so round up: <b>4,600</b>.</div>
        <p>Estimating is your fastest answer-eliminator: 398 &times; 21 is about 400 &times; 20 = 8,000, so any choice far from 8,000 is out.</p>` },
      { title: 'Adding & subtracting (word problems)', check: 'addsub', body: `
        <p>Line digits up by place value and carry/borrow. In word problems, watch for key words:</p>
        <ul><li><b>Add:</b> total, sum, altogether, more than, increased by</li>
        <li><b>Subtract:</b> left, remain, difference, fewer than, decreased by</li></ul>
        <div class="ex">1,248 boxes &minus; 367 shipped + 512 delivered: 1,248 &minus; 367 = 881, then 881 + 512 = <b>1,393</b>.</div>` },
      { title: 'Multiplying & dividing', check: 'muldiv', body: `
        <p>Multiply: break a number apart. 18 &times; 23 = 18 &times; 20 + 18 &times; 3 = 360 + 54 = <b>414</b>.</p>
        <p>Divide: ask &ldquo;how many times does it fit?&rdquo;</p>
        <div class="key"><b>Remainders:</b> if a question asks for <i>full</i> boxes, buses or groups, drop the remainder. Don't round up.</div>
        <div class="ex">150 items, 12 per box: 150 &divide; 12 = 12 remainder 6. That is <b>12 full boxes</b>.</div>` },
      { title: 'Order of operations (PEMDAS)', check: 'pemdas', body: `
        <div class="key"><b>P</b>arentheses &rarr; <b>E</b>xponents &rarr; <b>M</b>ultiply / <b>D</b>ivide (left to right) &rarr; <b>A</b>dd / <b>S</b>ubtract (left to right)</div>
        <div class="ex">7 + 3 &times; 4 &rarr; multiply first: 3 &times; 4 = 12, then 7 + 12 = <b>19</b> (not 40).</div>
        <div class="ex">(7 + 3) &times; 4 &rarr; parentheses first: 10 &times; 4 = <b>40</b>.</div>
        <p>Multiplication and division are partners: do whichever comes first, left to right. Same for addition and subtraction.</p>` },
    ],
    types: {
      place: () => {
        let s;
        do { s = String(R(1000000, 9999999)); } while (new Set(s).size < 7);
        const k = R(1, 5); // position from right (1 = tens ... 5 = hundred-thousands)
        const d = +s[s.length - 1 - k];
        if (d === 0) return UNITS[0].types.place();
        const val = d * Math.pow(10, k);
        const n = (+s).toLocaleString('en-US');
        return num(`What is the value of the digit <b>${d}</b> in ${n}?`, val,
          `The ${d} is in the ${['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands', 'hundred-thousands'][k]} place, so it is worth ${fmt(val)}.`,
          { bad: [d * Math.pow(10, k + 1), d * Math.pow(10, k - 1), d * Math.pow(10, k + 2)] });
      },
      round: () => {
        const n = R(1000, 99999), p = pick([10, 100, 1000]);
        const name = { 10: 'ten', 100: 'hundred', 1000: 'thousand' }[p];
        const ans = Math.round(n / p) * p, fl = Math.floor(n / p) * p, ce = Math.ceil(n / p) * p;
        return num(`Round ${fmt(n)} to the nearest <b>${name}</b>.`, ans,
          `Look one place to the right of the ${name}s. If that digit is 5 or more, round up; otherwise round down. ${fmt(n)} rounds to ${fmt(ans)}.`,
          { bad: [fl, ce, Math.round(n / (p * 10)) * p * 10, Math.round(n / (p / 10)) * (p / 10)] });
      },
      addsub: () => {
        if (R(0, 1)) {
          const a = R(1000, 2800), b = R(100, 450), c = R(100, 900);
          return num(`A warehouse holds ${fmt(a)} boxes. ${fmt(b)} boxes are shipped out and ${fmt(c)} new boxes arrive. How many boxes are in the warehouse now?`,
            a - b + c, `${fmt(a)} &minus; ${fmt(b)} = ${fmt(a - b)}, then ${fmt(a - b)} + ${fmt(c)} = ${fmt(a - b + c)}.`,
            { bad: [a + b + c, a - b - c, a + b - c] });
        }
        const a = R(1500, 3000), b = R(200, 600), c = R(200, 600);
        return num(`A unit starts the week with ${fmt(a)} gallons of fuel. It uses ${fmt(b)} gallons on Monday and ${fmt(c)} gallons on Tuesday. How many gallons are left?`,
          a - b - c, `Total used: ${fmt(b)} + ${fmt(c)} = ${fmt(b + c)}. Left: ${fmt(a)} &minus; ${fmt(b + c)} = ${fmt(a - b - c)}.`,
          { bad: [a - b + c, a + b + c, a - b] });
      },
      muldiv: () => {
        const t = R(0, 2);
        if (t === 0) {
          const a = R(12, 48), b = R(12, 35);
          return num(`A crate holds ${a} items. How many items are in ${b} crates?`, a * b,
            `${a} &times; ${b} = ${fmt(a * b)}.`, { bad: [a * (b - 1), a * b + a, a + b] });
        }
        if (t === 1) {
          const k = R(6, 24), q = R(5, 40), r = R(1, k - 1), n = k * q + r;
          return num(`${n} items are packed ${k} to a box. How many <b>full</b> boxes can be made?`, q,
            `${n} &divide; ${k} = ${q} remainder ${r}. The leftover ${r} items don't fill a box, so ${q} full boxes.`, { bad: [q + 1, r, q - 1] });
        }
        const b = R(6, 25), q = R(12, 60);
        return num(`${fmt(b * q)} &divide; ${b} = ?`, q, `${b} &times; ${q} = ${fmt(b * q)}, so the quotient is ${q}.`, { bad: [q + b, q * 10, q - 1] });
      },
      pemdas: () => {
        const t = R(1, 5); let expr, ans, bad, why;
        if (t === 1) { const a = R(2, 20), b = R(2, 9), c = R(2, 9); expr = `${a} + ${b} &times; ${c}`; ans = a + b * c; bad = [(a + b) * c]; why = `Multiply first: ${b} &times; ${c} = ${b * c}. Then ${a} + ${b * c} = ${ans}.`; }
        else if (t === 2) { const a = R(2, 12), b = R(2, 12), c = R(2, 9), d = R(1, 20); expr = `(${a} + ${b}) &times; ${c} &minus; ${d}`; ans = (a + b) * c - d; bad = [a + b * c - d, (a + b) * (c - d)]; why = `Parentheses: ${a + b}. Multiply: ${a + b} &times; ${c} = ${(a + b) * c}. Subtract ${d}: ${ans}.`; }
        else if (t === 3) { const a = R(3, 12), b = R(3, 12), d = pick([2, 3, 4, 5]), c = d * R(2, 12); expr = `${a} &times; ${b} &minus; ${c} &divide; ${d}`; ans = a * b - c / d; bad = [(a * b - c) / d, a * (b - c) / d]; why = `Do &times; and &divide; first: ${a * b} and ${c / d}. Then subtract: ${a * b} &minus; ${c / d} = ${ans}.`; }
        else if (t === 4) { const a = R(2, 15), b = R(2, 6) * 2, c = pick([2, 4]); expr = `${a} + ${b}<sup>2</sup> &divide; ${c}`; ans = a + (b * b) / c; bad = [(a + b * b) / c, (a + b) * (a + b) / c, a + b * 2 / c]; why = `Exponent first: ${b}<sup>2</sup> = ${b * b}. Divide: ${b * b} &divide; ${c} = ${b * b / c}. Add ${a}: ${ans}.`; }
        else { const a = R(30, 60), b = R(5, 12), c = R(1, 4), d = R(2, 3); expr = `${a} &minus; (${b} &minus; ${c}) &times; ${d}`; ans = a - (b - c) * d; bad = [(a - (b - c)) * d, a - b - c * d]; why = `Parentheses: ${b - c}. Multiply: ${b - c} &times; ${d} = ${(b - c) * d}. Subtract: ${a} &minus; ${(b - c) * d} = ${ans}.`; }
        return num(`Evaluate: ${expr}`, ans, why, { bad, allowNeg: true });
      },
    },
  });

  /* ===================== 2. INTEGERS & NEGATIVE NUMBERS ===================== */
  UNITS.push({
    id: 'integers', icon: '2', title: 'Integers & Negative Numbers',
    blurb: 'The number line, absolute value, and the sign rules for all four operations.',
    lessons: [
      { title: 'The number line & absolute value', check: 'order', body: `
        <p>Numbers get <b>larger to the right</b>. So &minus;2 &gt; &minus;10 (&minus;2 is closer to zero). A negative with a bigger digit is actually <i>smaller</i>.</p>
        <div class="key"><b>Absolute value</b> |x| = distance from zero, so it is never negative. |&minus;9| = 9 and |9| = 9.</div>
        <div class="ex">Order &minus;7, 3, &minus;2, 0 from least to greatest: &minus;7, &minus;2, 0, 3.</div>` },
      { title: 'Absolute value practice', check: 'abs', body: `
        <p>Do the absolute value <i>first</i>, as if the bars were parentheses.</p>
        <div class="ex">|&minus;9| &minus; |4| = 9 &minus; 4 = <b>5</b>.</div>
        <div class="ex">&minus;|&minus;5| = &minus;(5) = <b>&minus;5</b>. The minus <i>outside</i> the bars stays.</div>` },
      { title: 'Adding & subtracting integers', check: 'addsub', body: `
        <div class="key"><b>Same signs:</b> add the sizes, keep the sign. <b>Different signs:</b> subtract the sizes, keep the sign of the bigger one.<br><b>Subtracting</b> = adding the opposite: 6 &minus; (&minus;9) = 6 + 9.</div>
        <div class="ex">&minus;8 + 5: signs differ; 8 &minus; 5 = 3; bigger size is negative &rarr; <b>&minus;3</b>.</div>
        <div class="ex">4 &minus; 11 = 4 + (&minus;11) = <b>&minus;7</b>.</div>` },
      { title: 'Multiplying & dividing integers', check: 'muldiv', body: `
        <div class="key"><b>Same signs &rarr; positive. Different signs &rarr; negative.</b> (Works for &times; and &divide;.)<br>With several negatives: an <b>even</b> count gives positive, an <b>odd</b> count gives negative.</div>
        <div class="ex">(&minus;3)(&minus;4)(&minus;2): three negatives (odd) &rarr; negative. 3&times;4&times;2 = 24 &rarr; <b>&minus;24</b>.</div>` },
      { title: 'Mixing it together', check: 'mixed', body: `
        <p>Order of operations still rules: multiply/divide before add/subtract.</p>
        <div class="ex">&minus;3 + 4 &times; (&minus;2) = &minus;3 + (&minus;8) = <b>&minus;11</b>.</div>
        <p>Word problems: rise/gain = positive, drop/loss = negative. Keep a running total.</p>` },
    ],
    types: {
      order: () => {
        let a; do { a = [0, 1, 2, 3].map(() => R(-12, 12)); } while (new Set(a).size < 4);
        const least = R(0, 1) === 0;
        const ans = least ? Math.min(...a) : Math.max(...a);
        return mk(`Which number is the <b>${least ? 'least' : 'greatest'}</b>?`, neg(ans), a.filter((x) => x !== ans).map(neg),
          `On the number line, numbers to the right are larger. The ${least ? 'least' : 'greatest'} is ${neg(ans)}.`);
      },
      abs: () => {
        const a = R(2, 15), b = R(2, 15);
        if (R(0, 1)) { const ans = a - b; return num(`What is |&minus;${a}| &minus; |${b}|?`, ans, `|&minus;${a}| = ${a} and |${b}| = ${b}, so ${a} &minus; ${b} = ${neg(ans)}.`, { allowNeg: true, bad: [-a - b, a + b, -ans] }); }
        return num(`What is |&minus;${a}| + |&minus;${b}|?`, a + b, `Absolute values: ${a} + ${b} = ${a + b}.`, { bad: [-(a + b), a - b, b - a] });
      },
      addsub: () => {
        let a = R(-15, 15), b = R(-15, 15);
        if (!a) a = 7; if (!b) b = -4;
        if (R(0, 1)) return num(`${P(a)} + ${P(b)} = ?`, a + b, `${a < 0 === b < 0 ? 'Same signs: add sizes, keep the sign.' : 'Different signs: subtract sizes, keep the sign of the larger.'} Answer: ${neg(a + b)}.`, { allowNeg: true, bad: [-(a + b), a - b, Math.abs(a) + Math.abs(b)], f: neg });
        return num(`${P(a)} &minus; ${P(b)} = ?`, a - b, `Subtracting is adding the opposite: ${P(a)} + ${P(-b)} = ${neg(a - b)}.`, { allowNeg: true, bad: [a + b, -(a - b), b - a], f: neg });
      },
      muldiv: () => {
        const t = R(0, 2);
        if (t === 0) { const a = R(-12, 12) || 5, b = R(-12, 12) || -6; return num(`${P(a)} &times; ${P(b)} = ?`, a * b, `${(a < 0) === (b < 0) ? 'Same signs give a positive' : 'Different signs give a negative'}: ${Math.abs(a)} &times; ${Math.abs(b)} = ${Math.abs(a * b)}, so ${neg(a * b)}.`, { allowNeg: true, bad: [-(a * b), a + b], f: neg }); }
        if (t === 1) { const b = pick([-9, -8, -7, -6, -4, -3, 3, 4, 6, 7, 8, 9]), q = R(-12, 12) || 4; return num(`${neg(b * q)} &divide; ${P(b)} = ?`, q, `${Math.abs(b * q)} &divide; ${Math.abs(b)} = ${Math.abs(q)}. ${(b * q < 0) !== (b < 0) ? '' : ''}Signs ${(b < 0) === (q < 0) ? 'agree' : 'differ'} between dividend and divisor, so the answer is ${q > 0 ? 'positive' : 'negative'}: ${neg(q)}.`, { allowNeg: true, bad: [-q, Math.abs(q) + 1, b + q], f: neg }); }
        const a = R(2, 6), b = R(2, 6), c = R(2, 5), signs = [R(0, 1) ? -1 : 1, R(0, 1) ? -1 : 1, R(0, 1) ? -1 : 1];
        const f = [a * signs[0], b * signs[1], c * signs[2]];
        const ans = f[0] * f[1] * f[2], negs = f.filter((x) => x < 0).length;
        return num(`${f.map(P).join(' &times; ')} = ?`, ans, `${negs} negative factor${negs === 1 ? '' : 's'} &rarr; ${negs % 2 ? 'negative' : 'positive'}. ${a} &times; ${b} &times; ${c} = ${a * b * c}. Answer: ${neg(ans)}.`, { allowNeg: true, bad: [-ans, a + b + c], f: neg });
      },
      mixed: () => {
        const t = R(0, 3);
        if (t === 0) { const a = R(-9, -1), b = R(2, 6), c = R(-6, -2); return num(`${neg(a)} + ${b} &times; ${P(c)} = ?`, a + b * c, `Multiply first: ${b} &times; ${P(c)} = ${neg(b * c)}. Then ${neg(a)} + ${P(b * c)} = ${neg(a + b * c)}.`, { allowNeg: true, f: neg, bad: [(a + b) * c, -(a + b * c)] }); }
        if (t === 1) { const a = R(-9, -2), b = R(2, 5), c = R(-5, -2); return num(`${neg(a)} &minus; ${b} &times; ${P(c)} = ?`, a - b * c, `Multiply first: ${b} &times; ${P(c)} = ${neg(b * c)}. Then ${neg(a)} &minus; ${P(b * c)} = ${neg(a)} + ${-b * c} = ${neg(a - b * c)}.`, { allowNeg: true, f: neg, bad: [(a - b) * c, a + b * c] }); }
        if (t === 2) { const a = R(-9, -2), b = R(8, 14), c = R(-4, -2); return num(`(${neg(a)} + ${b}) &times; ${P(c)} = ?`, (a + b) * c, `Parentheses first: ${neg(a)} + ${b} = ${a + b}. Then ${a + b} &times; ${P(c)} = ${neg((a + b) * c)}.`, { allowNeg: true, f: neg, bad: [a + b * c, -(a + b) * c] }); }
        const a = R(-12, -3), b = R(8, 20), c = R(3, 9);
        return num(`At dawn it was ${neg(a)}&deg;F. It rose ${b}&deg; by noon, then fell ${c}&deg; by night. What was the night temperature?`, a + b - c,
          `${neg(a)} + ${b} = ${neg(a + b)}, then ${neg(a + b)} &minus; ${c} = ${neg(a + b - c)}&deg;F.`, { allowNeg: true, f: (x) => neg(x) + '&deg;F', bad: [a - b - c, a + b + c, -(a + b - c)] });
      },
    },
  });

  /* ===================== 3. FACTORS, MULTIPLES & PRIMES ===================== */
  const pf = (n) => { const m = {}; for (let p = 2; n > 1; p++) while (n % p === 0) { m[p] = (m[p] || 0) + 1; n /= p; } return m; };
  const pfStr = (n) => Object.entries(pf(n)).map(([p, e]) => (e > 1 ? `${p}<sup>${e}</sup>` : p)).join(' &times; ');
  const smallestFactor = (n) => { for (let p = 2; p * p <= n; p++) if (n % p === 0) return p; return n; };
  UNITS.push({
    id: 'factors', icon: '3', title: 'Factors, Multiples & Primes',
    blurb: 'Divisibility tests, prime factorization, GCF and LCM. The key to fractions.',
    lessons: [
      { title: 'Factors, multiples & divisibility', check: 'divis', body: `
        <p><b>Factors</b> divide evenly into a number (factors of 12: 1, 2, 3, 4, 6, 12). <b>Multiples</b> are what you get counting by it (multiples of 12: 12, 24, 36&hellip;).</p>
        <div class="key"><b>Quick tests:</b> 2 &mdash; ends in even digit &bull; 3 &mdash; digit sum divisible by 3 &bull; 4 &mdash; last two digits divisible by 4 &bull; 5 &mdash; ends in 0 or 5 &bull; 6 &mdash; even and divisible by 3 &bull; 9 &mdash; digit sum divisible by 9 &bull; 10 &mdash; ends in 0</div>
        <div class="ex">Is 531 divisible by 9? 5 + 3 + 1 = 9 &rarr; yes.</div>` },
      { title: 'Primes & prime factorization', check: 'primefact', body: `
        <p>A <b>prime</b> has exactly two factors: 1 and itself (2, 3, 5, 7, 11, 13&hellip;). 1 is not prime; 2 is the only even prime.</p>
        <p>To test a number, try dividing by small primes. 51 looks prime but 5 + 1 = 6, so 3 divides it: 51 = 3 &times; 17.</p>
        <div class="key"><b>Factor tree:</b> keep splitting until only primes remain.</div>
        <div class="ex">84 = 2 &times; 42 = 2 &times; 2 &times; 21 = 2 &times; 2 &times; 3 &times; 7 = <b>2<sup>2</sup> &times; 3 &times; 7</b>.</div>` },
      { title: 'Greatest common factor (GCF)', check: 'gcf', body: `
        <p>The <b>GCF</b> is the biggest number that divides both. Use prime factors: take the <b>shared</b> primes with the <b>smaller</b> exponents.</p>
        <div class="ex">18 = 2 &times; 3<sup>2</sup> and 24 = 2<sup>3</sup> &times; 3. Shared: 2<sup>1</sup> &times; 3<sup>1</sup> = <b>6</b>.</div>
        <p>Use it to simplify fractions and to split things into the largest equal groups.</p>` },
      { title: 'Least common multiple (LCM)', check: 'lcm', body: `
        <p>The <b>LCM</b> is the smallest number both divide into. Take <b>all</b> primes with the <b>larger</b> exponents.</p>
        <div class="ex">12 = 2<sup>2</sup> &times; 3 and 18 = 2 &times; 3<sup>2</sup>. LCM = 2<sup>2</sup> &times; 3<sup>2</sup> = <b>36</b>.</div>
        <div class="tip">Shortcut: GCF &times; LCM = the two numbers multiplied. Repeating-schedule problems ("both leave together again in&hellip;") are LCM problems.</div>` },
    ],
    types: {
      gcf: () => {
        const g = R(2, 12); let p, q; do { p = R(2, 9); q = R(2, 9); } while (p === q || gcd(p, q) !== 1);
        const a = g * p, b = g * q;
        return num(`What is the greatest common factor (GCF) of ${a} and ${b}?`, g, `${a} = ${g} &times; ${p} and ${b} = ${g} &times; ${q}; ${p} and ${q} share nothing further, so the GCF is ${g}.`, { bad: [lcm(a, b), Math.abs(a - b), g * 2, Math.min(p, q)] });
      },
      lcm: () => {
        let a, b; do { a = pick([4, 6, 8, 9, 10, 12, 14, 15, 18, 20]); b = pick([4, 6, 8, 9, 10, 12, 14, 15, 18, 20]); } while (a === b || a % b === 0 || b % a === 0);
        const l = lcm(a, b);
        if (R(0, 1)) return num(`Bus A leaves a stop every ${a} minutes and Bus B every ${b} minutes. They leave together at 8:00 AM. In how many minutes will they next leave together?`, l, `Find the LCM of ${a} and ${b}: ${l}.`, { f: (n) => n + ' minutes', bad: [a * b, gcd(a, b), Math.max(a, b)] });
        return num(`What is the least common multiple (LCM) of ${a} and ${b}?`, l, `Counting multiples of ${Math.max(a, b)} until ${Math.min(a, b)} divides evenly gives ${l}.`, { bad: [a * b, gcd(a, b), a + b, Math.max(a, b)] });
      },
      prime: () => {
        const primes = [53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113];
        const comps = [51, 57, 69, 77, 87, 91, 93, 111, 119, 121, 133, 143, 147];
        const p = pick(primes), c = shuffle(comps).slice(0, 3);
        return mk('Which of these numbers is <b>prime</b>?', String(p), c.map(String),
          `${c.map((x) => `${x} = ${smallestFactor(x)} &times; ${x / smallestFactor(x)}`).join('; ')}. Only ${p} has no factors other than 1 and itself.`);
      },
      divis: () => {
        const m = pick([3, 4, 6, 9]);
        const rule = { 3: 'The digits add to a multiple of 3.', 4: 'The last two digits form a multiple of 4.', 6: 'It is even and its digit sum is a multiple of 3.', 9: 'The digits add to a multiple of 9.' }[m];
        const c = m * R(Math.ceil(150 / m), Math.floor(900 / m));
        const w = []; for (const k of shuffle([1, 2, 3, 4, 5, -1, -2, 7])) { const x = c + k; if (x % m !== 0 && x > 99 && !w.includes(x)) w.push(x); if (w.length === 3) break; }
        return mk(`Which of these numbers is divisible by ${m}?`, String(c), w.map(String), `${c} is a multiple of ${m}. ${rule}`);
      },
      primefact: () => {
        const n = pick([36, 40, 48, 54, 60, 72, 84, 90, 96, 100, 108, 120, 126, 140, 150, 180, 200, 210]);
        const ws = []; for (const k of shuffle([-12, -10, -8, -6, -4, -2, 2, 4, 6, 8, 10, 12])) { const m = n + k; if (m > 1 && pfStr(m) !== pfStr(n)) ws.push(pfStr(m)); }
        return mk(`What is the prime factorization of ${n}?`, pfStr(n), ws, `Keep splitting into primes: ${n} = ${pfStr(n)}. Multiply back to check.`);
      },
    },
  });

  /* ===================== 4. FRACTIONS: BASICS ===================== */
  UNITS.push({
    id: 'fractions', icon: '4', title: 'Fractions: Meaning, Simplifying & Comparing',
    blurb: 'What a fraction is, equivalent fractions, mixed numbers and which is bigger.',
    lessons: [
      { title: 'What a fraction means', check: 'wordfrac', body: `
        <p>A fraction is <b>part &divide; whole</b>. ${fr(3, 8)} means 3 of 8 equal parts. The bottom number (<b>denominator</b>) names the size of the pieces; the top (<b>numerator</b>) counts them.</p>
        <div class="ex">12 of 32 students wear glasses: ${fr(12, 32)} = ${fr(3, 8)} of the class.</div>` },
      { title: 'Equivalent fractions & simplifying', check: 'simplify', body: `
        <p>Multiply or divide top <i>and</i> bottom by the same number and the value doesn't change.</p>
        <div class="key"><b>Simplest form:</b> divide top and bottom by their <b>GCF</b>.</div>
        <div class="ex">${fr(18, 24)}: the GCF of 18 and 24 is 6, so ${fr('18&divide;6', '24&divide;6')} = <b>${fr(3, 4)}</b>.</div>
        <div class="tip">Not sure of the GCF? Divide by 2s, 3s or 5s repeatedly until nothing divides both.</div>` },
      { title: 'Equivalent fractions practice', check: 'equiv', body: `
        <p>To build an equivalent fraction, multiply top and bottom by the <b>same</b> number: ${fr(3, 7)} = ${fr('3&times;4', '7&times;4')} = ${fr(12, 28)}.</p>
        <p>Adding the same number to top and bottom does <b>not</b> keep the value. That's a classic trap.</p>` },
      { title: 'Mixed numbers & improper fractions', check: 'mixed', body: `
        <div class="key"><b>Improper &rarr; mixed:</b> divide. ${fr(29, 6)}: 29 &divide; 6 = 4 remainder 5 &rarr; ${mixed(4, 5, 6)}.<br><b>Mixed &rarr; improper:</b> (whole &times; denominator) + numerator, over the denominator. ${mixed(3, 2, 7)} = ${fr('3&times;7+2', 7)} = ${fr(23, 7)}.</div>` },
      { title: 'Comparing fractions', check: 'compare', body: `
        <p>Three ways to compare:</p>
        <ul><li><b>Common denominator:</b> ${fr(3, 5)} vs ${fr(2, 3)} &rarr; ${fr(9, 15)} vs ${fr(10, 15)}, so ${fr(2, 3)} is bigger.</li>
        <li><b>Cross-multiply:</b> 3 &times; 3 = 9 vs 2 &times; 5 = 10; the bigger product wins on its side.</li>
        <li><b>Convert to decimals:</b> 0.6 vs 0.667.</li></ul>` },
    ],
    types: {
      wordfrac: () => {
        const t = pick([[32, 'students in a class', 'wear glasses'], [40, 'soldiers in a platoon', 'are on duty'], [60, 'cars in a lot', 'are red'], [24, 'players on a roster', 'are rookies']]);
        const n = pick([...Array(t[0] - 1).keys()].map((i) => i + 1).filter((i) => gcd(i, t[0]) > 1));
        return mk(`There are ${t[0]} ${t[1]}. ${n} of them ${t[2]}. What fraction ${t[2].replace(/^are /, 'are ').replace(/^wear /, 'wear ')}?`.replace('What fraction ' + t[2], 'What fraction of them ' + t[2]),
          frR(n, t[0]), [fr(n, t[0]), frR(t[0] - n, t[0]), frR(n, t[0] - n), frR(t[0], n)], `${n} out of ${t[0]} is ${fr(n, t[0])}; divide top and bottom by ${gcd(n, t[0])} to get ${frR(n, t[0])}.`);
      },
      simplify: () => {
        const g = R(2, 9); let a, b; do { a = R(1, 9); b = R(a + 1, 12); } while (gcd(a, b) !== 1);
        const n = a * g, d = b * g;
        const w = [fr(b, a), fr(a + 1, b), fr(a, b + 1), fr(a * 2 > b ? a : a * 2, b * 2)];
        for (const p of [2, 3, 5]) if (g % p === 0 && g / p > 1) w.unshift(fr(n / p, d / p));
        return mk(`Simplify ${fr(n, d)} to lowest terms.`, fr(a, b), w, `The GCF of ${n} and ${d} is ${g}. ${n} &divide; ${g} = ${a} and ${d} &divide; ${g} = ${b}, giving ${fr(a, b)}.`);
      },
      equiv: () => {
        const b = R(3, 11), a = R(1, b - 1), k = R(2, 6);
        const cands = [[a + k, b + k], [a * k, b + k], [a + k, b * k], [a * k + 1, b * k], [a * k, b * k + 1], [a * (k + 1), b * k], [a * k - 1, b * k]].filter(([n, d]) => n > 0 && n * b !== a * d);
        return mk(`Which fraction is equal to ${fr(a, b)}?`, fr(a * k, b * k), cands.map(([n, d]) => fr(n, d)),
          `Multiply top and bottom by the same number (${k}): ${fr(a, b)} = ${fr(a * k, b * k)}. Adding ${k} to each does not preserve the value.`);
      },
      mixed: () => {
        const w = R(2, 9), d = R(3, 9), r = R(1, d - 1);
        if (R(0, 1)) return mk(`Write ${fr(w * d + r, d)} as a mixed number.`, mixed(w, r, d), [mixed(w + 1, r, d), mixed(w + 2, r, d), mixed(w, (r % (d - 1)) + 1 === r ? Math.min(d - 1, r + 1) : (r % (d - 1)) + 1, d), mixed(w - 1 > 0 ? w - 1 : w + 3, r, d), mixed(w, r, d + 1)],
          `${w * d + r} &divide; ${d} = ${w} remainder ${r}, so ${mixed(w, r, d)}.`);
        return mk(`Write ${mixed(w, r, d)} as an improper fraction.`, fr(w * d + r, d), [fr(w + r, d), fr(w * r + d, d), fr((w + 1) * d + r, d), fr(w * d + r, d + 1)],
          `(${w} &times; ${d}) + ${r} = ${w * d + r}, over ${d}: ${fr(w * d + r, d)}.`);
      },
      compare: () => {
        let fs, vals; do {
          fs = [0, 1, 2, 3].map(() => { const d = R(3, 12); return [R(1, d - 1), d]; });
          vals = fs.map(([n, d]) => n / d).sort((x, y) => x - y);
        } while (vals.some((v, i) => i && v - vals[i - 1] < 0.03));
        const big = R(0, 1) === 0;
        const t = big ? fs.reduce((a, b) => (b[0] / b[1] > a[0] / a[1] ? b : a)) : fs.reduce((a, b) => (b[0] / b[1] < a[0] / a[1] ? b : a));
        return mk(`Which fraction is the <b>${big ? 'greatest' : 'least'}</b>?`, fr(...t), fs.filter((f) => f !== t).map((f) => fr(...f)),
          `As decimals: ${fs.map(([n, d]) => `${n}/${d} &asymp; ${(n / d).toFixed(2)}`).join(', ')}. The ${big ? 'largest' : 'smallest'} is ${t[0]}/${t[1]}.`);
      },
    },
  });

  /* ===================== 5. FRACTION OPERATIONS ===================== */
  const okF = (...c) => c.filter((x) => x !== null);
  const fo = (n, d) => (n > 0 && d > 0 ? frOut(n, d) : null);
  UNITS.push({
    id: 'fracops', icon: '5', title: 'Fraction Operations',
    blurb: 'Add, subtract, multiply and divide fractions and mixed numbers, including word problems.',
    lessons: [
      { title: 'Adding & subtracting fractions', check: 'addsub', body: `
        <div class="key">You need a <b>common denominator</b>. Convert, then add or subtract only the numerators.</div>
        <div class="ex">${fr(2, 3)} + ${fr(1, 4)} = ${fr(8, 12)} + ${fr(3, 12)} = <b>${fr(11, 12)}</b>.</div>
        <p>Never add the denominators. ${fr(1, 2)} + ${fr(1, 3)} is not ${fr(2, 5)}.</p>` },
      { title: 'Multiplying fractions', check: 'mul', body: `
        <div class="key">Top &times; top, bottom &times; bottom. Cancel common factors first to keep the numbers small.</div>
        <div class="ex">${fr(3, 4)} &times; ${fr(2, 9)}: cancel 3 with 9 and 2 with 4 &rarr; ${fr(1, 2)} &times; ${fr(1, 3)} = <b>${fr(1, 6)}</b>.</div>
        <p>&ldquo;Of&rdquo; means multiply: ${fr(3, 5)} of 40 = ${fr(3, 5)} &times; 40 = 24.</p>` },
      { title: 'Dividing fractions', check: 'div', body: `
        <div class="key"><b>Keep, Change, Flip:</b> keep the first fraction, change &divide; to &times;, flip the second.</div>
        <div class="ex">${fr(2, 3)} &divide; ${fr(4, 5)} = ${fr(2, 3)} &times; ${fr(5, 4)} = ${fr(10, 12)} = <b>${fr(5, 6)}</b>.</div>` },
      { title: 'Mixed numbers', check: 'mixedops', body: `
        <p>Turn mixed numbers into improper fractions first, then use the same rules.</p>
        <div class="ex">${mixed(1, 1, 2)} &times; ${mixed(2, 2, 3)} = ${fr(3, 2)} &times; ${fr(8, 3)} = ${fr(24, 6)} = <b>4</b>.</div>
        <div class="tip">Multiplying the whole parts and the fractions separately is a trap. It gives the wrong answer.</div>` },
      { title: 'Fraction word problems', check: 'word', body: `
        <p>Decide the operation from the story:</p>
        <ul><li><b>Combine</b> amounts &rarr; add. <b>How much is left</b> &rarr; subtract.</li>
        <li><b>Batches / times as much / of</b> &rarr; multiply.</li>
        <li><b>How many pieces fit in</b> &rarr; divide.</li></ul>` },
    ],
    types: {
      addsub: () => {
        let b, d; do { b = pick([2, 3, 4, 5, 6, 8, 9, 10, 12]); d = pick([2, 3, 4, 5, 6, 8, 9, 10, 12]); } while (b === d);
        let a = R(1, b - 1), c = R(1, d - 1); const add = R(0, 1) === 0;
        if (!add && a * d < c * b) { [a, c] = [c, a];[b, d] = [d, b]; }
        const n = add ? a * d + c * b : a * d - c * b, den = b * d;
        if (n <= 0) return UNITS[4].types.addsub();
        const l = lcm(b, d);
        const bad = okF(fo(add ? a + c : a - c, add ? b + d : Math.abs(b - d)), fo(n + 1, den), fo(n, den + b), fo(add ? a + c : Math.abs(a - c), l), fo(n - 1, den), fo(n + d, den));
        return mk(`${fr(a, b)} ${add ? '+' : '&minus;'} ${fr(c, d)} = ?`, frOut(n, den), bad,
          `Common denominator ${l}: ${fr(a * (l / b), l)} ${add ? '+' : '&minus;'} ${fr(c * (l / d), l)} = ${fr(a * (l / b) + (add ? 1 : -1) * c * (l / d), l)}${frR(n, den) !== frR(a * (l / b) + (add ? 1 : -1) * c * (l / d), l) ? '' : ''} &rarr; ${frOut(n, den)}.`);
      },
      mul: () => {
        let a, b, c, d; do { b = R(2, 9); d = R(2, 9); a = R(1, b - 1); c = R(1, d - 1); } while (a * d === b * c);
        const bad = okF(fo(a * d, b * c), fo(a * c + 1, b * d), fo(a + c, b + d), fo(a * c, b + d), fo(a * c, b * d + 1));
        return mk(`${fr(a, b)} &times; ${fr(c, d)} = ?`, frOut(a * c, b * d), bad, `Multiply tops and bottoms: ${fr(a * c, b * d)}${gcd(a * c, b * d) > 1 ? ' &rarr; ' + frOut(a * c, b * d) : ''}.`);
      },
      div: () => {
        let a, b, c, d; do { b = R(2, 9); d = R(2, 9); a = R(1, b - 1); c = R(1, d - 1); } while (a * d === b * c || a * c === b * d);
        const bad = okF(fo(a * c, b * d), fo(b * c, a * d), fo(a * d + 1, b * c), fo(a * d, b * c + 1), fo(a * d, b * c - 1));
        return mk(`${fr(a, b)} &divide; ${fr(c, d)} = ?`, frOut(a * d, b * c), bad, `Keep, change, flip: ${fr(a, b)} &times; ${fr(d, c)} = ${fr(a * d, b * c)}${gcd(a * d, b * c) > 1 || a * d > b * c ? ' &rarr; ' + frOut(a * d, b * c) : ''}.`);
      },
      mixedops: () => {
        const b = pick([2, 3, 4, 5, 6]), d = pick([2, 3, 4, 5, 6]), w1 = R(1, 4), w2 = R(1, 4), a = R(1, b - 1), c = R(1, d - 1);
        const n1 = w1 * b + a, n2 = w2 * d + c;
        if (R(0, 1)) {
          if (b === d) return UNITS[4].types.mixedops();
          const n = n1 * d + n2 * b, den = b * d;
          return mk(`${mixed(w1, a, b)} + ${mixed(w2, c, d)} = ?`, frOut(n, den), okF(fo(n + 1, den), fo(n - 1, den), `<span class="mixed">${w1 + w2}${fr(a + c, b + d)}</span>`, fo(n, den + 1)),
            `Convert: ${fr(n1, b)} + ${fr(n2, d)} = ${fr(n1 * d, den)} + ${fr(n2 * b, den)} = ${fr(n, den)} = ${frOut(n, den)}.`);
        }
        const n = n1 * n2, den = b * d;
        return mk(`${mixed(w1, a, b)} &times; ${mixed(w2, c, d)} = ?`, frOut(n, den), okF(fo(n + 1, den), fo(n - 1, den), `<span class="mixed">${w1 * w2}${fr(a * c, b * d)}</span>`, fo(n, den + 1)),
          `Improper fractions: ${fr(n1, b)} &times; ${fr(n2, d)} = ${fr(n, den)} = ${frOut(n, den)}.`);
      },
      word: () => {
        const t = R(0, 3);
        if (t === 0) { const [b, d] = pick([[2, 3], [3, 4], [4, 6], [2, 5], [3, 5]]); const a = 1, c = R(1, d - 1); const n = a * d + c * b; return mk(`Maria ran ${fr(a, b)} mile on Monday and ${fr(c, d)} mile on Tuesday. How many miles did she run in all?`, frOut(n, b * d), okF(fo(a + c, b + d), fo(n + 1, b * d), fo(n, b * d + 1), fo(n - 1, b * d)), `Add with a common denominator: ${fr(a * d, b * d)} + ${fr(c * b, b * d)} = ${frOut(n, b * d)} miles.`); }
        if (t === 1) { const b = pick([2, 3, 4, 8]), a = R(1, b - 1), w = R(2, 5); return mk(`A recipe needs ${fr(a, b)} cup of sugar per batch. How much sugar is needed for ${w} batches?`, frOut(a * w, b) + ' cups', okF(fo(a * w + 1, b), fo(a, b * w), fo(a + w, b), fo(a * w, b + 1)).map((x) => x + ' cups'), `${w} &times; ${fr(a, b)} = ${fr(a * w, b)} = ${frOut(a * w, b)} cups.`); }
        if (t === 2) { const [a, b] = pick([[3, 4], [1, 2], [2, 3], [5, 8], [3, 8]]), k = R(3, 12); const L2 = frOut(k * a, b); return num(`A board is ${L2} feet long. How many pieces ${fr(a, b)} foot long can be cut from it?`, k, `Divide: ${L2} &divide; ${fr(a, b)} = ${fr(k * a, b)} &times; ${fr(b, a)} = ${k}.`, { bad: [k + 1, k - 1, Math.round(k * a * a / b) || k + 2, k * 2] }); }
        const d = pick([3, 4, 5, 6, 8]), a = R(1, d - 1), q = R(3, 12), n = d * q;
        return num(`What is ${fr(a, d)} of ${n}?`, a * q, `${n} &divide; ${d} = ${q}; then ${q} &times; ${a} = ${a * q}.`, { bad: [q, (d - a) * q, a * n, n - a] });
      },
    },
  });

  /* ===================== 6. DECIMALS ===================== */
  UNITS.push({
    id: 'decimals', icon: '6', title: 'Decimals',
    blurb: 'Place value to the right of the point, all four operations, rounding and fraction conversion.',
    lessons: [
      { title: 'Decimal place value & comparing', check: 'compare', body: `
        <p>Places to the right of the point: <b>tenths, hundredths, thousandths</b>. In 0.<b>3</b>4<b>7</b>: 3 tenths, 4 hundredths, 7 thousandths.</p>
        <div class="key">To compare, line up the decimal points and pad with zeros: 0.5 = 0.500, so 0.500 &gt; 0.405 &gt; 0.054.</div>
        <p>A longer decimal is <i>not</i> a bigger decimal. That's the trap.</p>` },
      { title: 'Rounding decimals', check: 'round', body: `
        <p>Same rule as whole numbers: look one place to the right. 5+ rounds up.</p>
        <div class="ex">3.4762 to the nearest hundredth: the hundredths digit is 7 and the next digit is 6 &rarr; round up &rarr; <b>3.48</b>.</div>` },
      { title: 'Adding & subtracting decimals', check: 'addsub', body: `
        <div class="key"><b>Line up the decimal points.</b> Fill gaps with zeros.</div>
        <div class="ex">12.45 + 3.8 &rarr; 12.45 + 3.80 = <b>16.25</b>.</div>` },
      { title: 'Multiplying decimals', check: 'mul', body: `
        <div class="key">Multiply as if there were no points. Then put in as many decimal places as the two numbers have <b>combined</b>.</div>
        <div class="ex">0.6 &times; 0.07: 6 &times; 7 = 42; three decimal places total &rarr; <b>0.042</b>.</div>` },
      { title: 'Dividing decimals', check: 'div', body: `
        <div class="key">Make the divisor a whole number by moving the point; move the dividend's point the <b>same</b> distance.</div>
        <div class="ex">4.8 &divide; 0.6 &rarr; 48 &divide; 6 = <b>8</b>.</div>` },
      { title: 'Fractions &harr; decimals', check: 'convert', body: `
        <p><b>Fraction &rarr; decimal:</b> divide top by bottom. ${fr(3, 8)} = 3 &divide; 8 = 0.375.</p>
        <p><b>Decimal &rarr; fraction:</b> read the place value, then simplify. 0.35 = ${fr(35, 100)} = ${fr(7, 20)}.</p>
        <p>Worth memorizing: ${fr(1, 2)}=0.5, ${fr(1, 4)}=0.25, ${fr(3, 4)}=0.75, ${fr(1, 5)}=0.2, ${fr(1, 8)}=0.125, ${fr(1, 3)}&asymp;0.333</p>` },
      { title: 'Money & decimal word problems', check: 'word', body: `
        <p>Most ASVAB decimal problems are money. Keep two decimal places, and use estimation to catch misplaced points: 12 gallons at about $3.50 is about $42, not $4.20 or $420.</p>` },
    ],
    types: {
      compare: () => {
        let v; do { v = [0, 1, 2, 3].map(() => R(1, 999) / 1000); } while (new Set(v.map(String)).size < 4);
        const big = R(0, 1) === 0, ans = big ? Math.max(...v) : Math.min(...v);
        return mk(`Which decimal is the <b>${big ? 'greatest' : 'least'}</b>?`, dec(ans), v.filter((x) => x !== ans).map(dec), `Pad with zeros to compare: ${v.map((x) => x.toFixed(3)).join(', ')}. The ${big ? 'greatest' : 'least'} is ${dec(ans)}.`);
      },
      round: () => {
        const N = R(10000, 99999), p = R(1, 3), nm = ['tenth', 'hundredth', 'thousandth'][p - 1];
        const raw = N / 10000, ans = r6(Math.round(N / Math.pow(10, 4 - p)) / Math.pow(10, p));
        const fl = r6(Math.floor(N / Math.pow(10, 4 - p)) / Math.pow(10, p)), up = r6(fl + Math.pow(10, -p));
        return num(`Round ${raw.toFixed(4)} to the nearest <b>${nm}</b>.`, ans, `Look at the digit after the ${nm}s place. 5 or more rounds up, otherwise it stays. Answer: ${ans.toFixed(p)}.`, { f: (x) => Number(x).toFixed(p), bad: [fl, up, r6(Math.round(N / Math.pow(10, 4 - (p % 3) - 1)) / Math.pow(10, (p % 3) + 1))] });
      },
      addsub: () => {
        const a = R(100, 9999) / 100, b = R(10, 99) / 10;
        if (R(0, 1)) return num(`${a.toFixed(2)} + ${b.toFixed(1)} = ?`, a + b, `Line up the points: ${a.toFixed(2)} + ${b.toFixed(2)} = ${dec(a + b)}.`, { bad: [a + b / 10, a + b * 10] });
        const A = a + 10;
        return num(`${A.toFixed(2)} &minus; ${b.toFixed(1)} = ?`, A - b, `Line up the points: ${A.toFixed(2)} &minus; ${b.toFixed(2)} = ${dec(A - b)}.`, { bad: [A - b / 10, A - b * 10] });
      },
      mul: () => {
        const x = R(12, 99) / 10, y = pick([R(2, 9) / 10, R(2, 9) / 100]);
        const ans = r6(x * y);
        return num(`${dec(x)} &times; ${dec(y)} = ?`, ans, `Ignore the points: ${Math.round(x * Math.pow(10, dc(x)))} &times; ${Math.round(y * Math.pow(10, dc(y)))} = ${Math.round(x * Math.pow(10, dc(x))) * Math.round(y * Math.pow(10, dc(y)))}. Then put in ${dc(x) + dc(y)} decimal places (${dc(x)} + ${dc(y)}): ${dec(ans)}.`, { bad: [ans * 10, ans / 10, ans * 100] });
      },
      div: () => {
        const q = R(2, 40), b = pick([R(2, 9) / 10, R(2, 9) / 100]), a = r6(b * q);
        return num(`${dec(a)} &divide; ${dec(b)} = ?`, q, `Move both points the same distance until the divisor is whole: ${r6(a * (b < 0.1 ? 100 : 10))} &divide; ${b < 0.1 ? Math.round(b * 100) : Math.round(b * 10)} = ${q}.`, { bad: [q * 10, q / 10, q * 100, q + 1] });
      },
      convert: () => {
        if (R(0, 1)) {
          const d = pick([0.5, 0.25, 0.75, 0.2, 0.4, 0.6, 0.8, 0.35, 0.45, 0.15, 0.65, 0.85, 0.12, 0.16, 0.28, 0.375, 0.125, 0.04]);
          const k = (String(d).split('.')[1]).length, den = Math.pow(10, k), n = Math.round(d * den), g = gcd(n, den);
          return mk(`Write ${d} as a fraction in simplest form.`, frR(n, den), okF(g > 1 ? fr(n, den) : null, frR(den - n, den), frR(n, den * 10), frR(n + 1, den), n > 1 ? frR(n - 1, den) : null), `${d} = ${fr(n, den)}${g > 1 ? ' = ' + frR(n, den) : ''}.`);
        }
        const [a, b] = pick([[3, 8], [1, 8], [5, 8], [7, 8], [3, 4], [1, 4], [3, 5], [2, 5], [4, 5], [7, 20], [9, 20], [1, 20], [3, 25], [7, 10]]);
        const v = r6(a / b);
        return num(`Write ${fr(a, b)} as a decimal.`, v, `${a} &divide; ${b} = ${v}.`, { bad: [r6(a / b * 10), r6(a / b / 10), r6(b / a), r6(a / (b * 10) * 10 + 0.05)], f: dec });
      },
      word: () => {
        const t = R(0, 2);
        if (t === 0) { const p = pick([3.29, 3.49, 3.59, 3.79, 2.99]), g = R(8, 18); return num(`Gas costs $${p.toFixed(2)} per gallon. How much do ${g} gallons cost?`, p * g, `${g} &times; ${p.toFixed(2)} = ${money(p * g)}.`, { f: money, bad: [p * g / 10, p * g * 10, p * (g - 1)] }); }
        if (t === 1) { const a = R(300, 900) / 100, b = R(300, 900) / 100, pay = 20; return num(`Sam buys items costing ${money(a)} and ${money(b)} and pays with a $20 bill. How much change does he get?`, pay - a - b, `Total: ${money(a)} + ${money(b)} = ${money(a + b)}. Change: 20.00 &minus; ${money(a + b).slice(1)} = ${money(pay - a - b)}.`, { f: money, bad: [a + b, pay - a, pay - b, pay - a - b + 1] }); }
        const b = pick([0.25, 0.5, 0.75]), q = R(4, 20), a = r6(b * q);
        return num(`A rope ${dec(a)} feet long is cut into pieces ${dec(b)} feet long. How many pieces are there?`, q, `${dec(a)} &divide; ${dec(b)} = ${q}.`, { bad: [q * 10, q + 1, q - 1, q * 2] });
      },
    },
  });
})();
