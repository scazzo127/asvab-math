/* Units 7-12: percents, ratios, rates, exponents & roots, equations, expressions & factoring */
(function () {
  const { R, pick, shuffle, gcd, lcm, fmt, neg, money, dec, r6, fr, frR, mixed, frOut, lin, quad, mk, num } = L;
  const nz = (a, b) => { let x; do { x = R(a, b); } while (x === 0); return x; };
  const ex = (parts) => parts.map(([c, v], i) => { const body = (Math.abs(c) === 1 && v) ? v : Math.abs(c) + v; return i === 0 ? (c < 0 ? '−' : '') + body : (c < 0 ? ' − ' : ' + ') + body; }).join('');
  const pctf = (n) => fmt(n) + '%';
  const usd = (n) => '$' + fmt(n);

  /* ===================== 7. PERCENTS ===================== */
  UNITS.push({
    id: 'percents', icon: '7', title: 'Percents',
    blurb: 'Percent of a number, finding the percent, the whole, percent change, discounts, tax and tips.',
    lessons: [
      { title: 'What percent means', check: 'convert', body: `
        <p><b>Percent</b> means &ldquo;out of 100.&rdquo; 35% = ${fr(35, 100)} = 0.35.</p>
        <div class="key"><b>Percent &rarr; decimal:</b> move the point 2 places left (7% = 0.07). <b>Decimal &rarr; percent:</b> 2 places right (0.6 = 60%).<br><b>Fraction &rarr; percent:</b> divide, then &times; 100. ${fr(3, 4)} = 0.75 = 75%.</div>
        <p>Memorize: 10% = ${fr(1, 10)}, 20% = ${fr(1, 5)}, 25% = ${fr(1, 4)}, 50% = ${fr(1, 2)}, 75% = ${fr(3, 4)}.</p>` },
      { title: 'Finding a percent of a number', check: 'of', body: `
        <div class="key"><b>Part = Percent &times; Whole</b> (change the percent to a decimal first).</div>
        <div class="ex">15% of 80: 0.15 &times; 80 = <b>12</b>.</div>
        <div class="tip">Mental math: 10% = move the point one place; 5% = half of that. 15% of 80 &rarr; 8 + 4 = 12.</div>` },
      { title: 'What percent? / What is the whole?', check: 'whatpct', body: `
        <div class="key"><b>Percent = Part &divide; Whole &times; 100.</b> The whole is the number after &ldquo;of.&rdquo;</div>
        <div class="ex">18 is what percent of 72? 18 &divide; 72 = 0.25 = <b>25%</b>.</div>
        <p>To find the <b>whole</b>: Whole = Part &divide; Percent. 30 is 20% of what? 30 &divide; 0.20 = <b>150</b>.</p>` },
      { title: 'Finding the whole', check: 'findwhole', body: `
        <p>Whenever you see &ldquo;<i>__ is __% of what number?</i>&rdquo; divide the part by the percent (as a decimal).</p>
        <div class="ex">45 is 30% of what number? 45 &divide; 0.30 = <b>150</b>.</div>
        <p>Check by multiplying back: 30% of 150 = 45 &#10003;.</p>` },
      { title: 'Percent increase & decrease', check: 'change', body: `
        <div class="key"><b>Percent change = (new &minus; old) &divide; <u>old</u> &times; 100.</b> Always divide by the <b>original</b> amount.</div>
        <div class="ex">Price rises from $40 to $50: change = 10; 10 &divide; 40 = 0.25 &rarr; <b>25% increase</b>.</div>
        <p>A decrease from 50 to 40 is only 20%, because the base changed.</p>` },
      { title: 'Discounts, tax & tips', check: 'money', body: `
        <ul><li><b>Discount:</b> sale price = price &times; (1 &minus; rate). 25% off &rarr; pay 75%.</li>
        <li><b>Tax / tip:</b> total = price &times; (1 + rate). 8% tax &rarr; pay 108%.</li></ul>
        <div class="ex">$60 jacket, 25% off: 60 &times; 0.75 = <b>$45</b>.</div>` },
    ],
    types: {
      convert: () => {
        if (R(0, 1)) { const d = pick([0.07, 0.35, 0.6, 0.08, 0.125, 0.9, 0.04, 1.2, 0.45, 0.015]); const a = r6(d * 100); return num(`Write ${d} as a percent.`, a, `Move the decimal point two places to the right: ${d} = ${pctf(a)}.`, { f: pctf, bad: [r6(d * 10), r6(d), r6(d * 1000), r6(d / 10)] }); }
        const [a, b] = pick([[1, 2], [3, 4], [1, 5], [7, 20], [3, 25], [9, 10], [1, 20], [11, 50], [2, 5], [13, 20]]); const v = r6(a * 100 / b);
        return num(`What is ${fr(a, b)} written as a percent?`, v, `${a} &divide; ${b} = ${r6(a / b)} = ${pctf(v)}.`, { f: pctf, bad: [r6(v / 10), r6(v * 10), 100 - v, r6(b * 100 / a)] });
      },
      of: () => {
        const p = pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 90]), b = R(2, 30) * 20, ans = p * b / 100;
        return num(`What is ${p}% of ${fmt(b)}?`, ans, `${p}% = ${p / 100}. ${p / 100} &times; ${fmt(b)} = ${fmt(ans)}.`, { bad: [ans * 10, ans / 10, p * b, b - ans] });
      },
      whatpct: () => {
        const p = pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80]), b = R(2, 20) * 20, part = p * b / 100;
        return num(`${part} is what percent of ${b}?`, p, `${part} &divide; ${b} = ${r6(part / b)} = ${pctf(p)}.`, { f: pctf, bad: [100 - p, r6(b / part * 100), r6(part / b * 10), p * 2] });
      },
      findwhole: () => {
        const p = pick([10, 20, 25, 40, 50, 60, 75, 80]), w = R(2, 30) * 20, part = p * w / 100;
        return num(`${part} is ${p}% of what number?`, w, `Whole = part &divide; percent = ${part} &divide; ${p / 100} = ${fmt(w)}.`, { bad: [r6(part * p / 100), part * 100, part + p, r6(part * p)] });
      },
      change: () => {
        const old = R(2, 15) * 20, p = pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75]), up = R(0, 1) === 0, nw = up ? old + old * p / 100 : old - old * p / 100, diff = Math.abs(nw - old);
        return num(`A price changes from ${usd(old)} to ${usd(nw)}. What is the percent ${up ? 'increase' : 'decrease'}?`, p,
          `Change = ${usd(diff)}. Divide by the <b>original</b> price: ${diff} &divide; ${old} = ${r6(diff / old)} = ${pctf(p)}.`, { f: pctf, bad: [r6(diff / nw * 100), 100 - p, diff, r6(p / 2)] });
      },
      money: () => {
        const t = R(0, 2);
        if (t === 0) { const x = R(2, 20) * 20, p = pick([10, 15, 20, 25, 30, 40, 50]), s = x * (100 - p) / 100; return num(`A jacket costs ${usd(x)} and is on sale for ${p}% off. What is the sale price?`, s, `Discount = ${p}% of ${x} = ${usd(x * p / 100)}. Sale price = ${x} &minus; ${x * p / 100} = ${usd(s)}.`, { f: usd, bad: [x * p / 100, x + x * p / 100, x - p] }); }
        if (t === 1) { const x = R(2, 12) * 20, tot = x * 1.15; return num(`A restaurant bill is ${usd(x)}. After adding a 15% tip, what is the total?`, tot, `Tip = 0.15 &times; ${x} = ${r6(x * 0.15)}. Total = ${x} + ${r6(x * 0.15)} = ${usd(tot)}.`, { f: (n) => '$' + n.toFixed(2).replace(/\.00$/, ''), bad: [r6(x * 0.15), x + 15, x * 1.5, r6(x * 1.015)] }); }
        const x = R(2, 10) * 25, tot = x * 1.08; return num(`A radio costs ${usd(x)} before an 8% sales tax. What is the total price?`, tot, `Tax = 0.08 &times; ${x} = ${x * 0.08}. Total = ${x} + ${x * 0.08} = ${usd(tot)}.`, { f: usd, bad: [x * 0.08, x + 8, r6(x * 1.8), x - x * 0.08] });
      },
    },
  });

  /* ===================== 8. RATIOS & PROPORTIONS ===================== */
  const rt = (a, b) => `${a}&nbsp;:&nbsp;${b}`;
  UNITS.push({
    id: 'ratios', icon: '8', title: 'Ratios & Proportions',
    blurb: 'Compare quantities, set up and solve proportions, split a total by a ratio.',
    lessons: [
      { title: 'Ratios', check: 'simplify', body: `
        <p>A <b>ratio</b> compares two quantities: 15 boys to 20 girls is 15 : 20, or ${fr(15, 20)}. Simplify it like a fraction: <b>3 : 4</b>.</p>
        <div class="key">Order matters. &ldquo;Boys <b>to</b> girls&rdquo; puts boys first.</div>` },
      { title: 'Proportions', check: 'proportion', body: `
        <p>A <b>proportion</b> says two ratios are equal: ${fr(3, 5)} = ${fr('x', 20)}.</p>
        <div class="key"><b>Cross-multiply:</b> 3 &times; 20 = 5 &times; x &rarr; 60 = 5x &rarr; x = <b>12</b>.</div>
        <div class="tip">Watch out for adding instead of multiplying. Going from 5 to 20 is &times;4, so 3 becomes 12, not 18.</div>` },
      { title: 'Splitting a total by a ratio', check: 'partwhole', body: `
        <div class="key">Add the ratio parts to get the number of equal shares. Total &divide; shares = value of one share.</div>
        <div class="ex">Red : blue = 3 : 5 and 40 marbles. Shares = 3 + 5 = 8. One share = 40 &divide; 8 = 5. Blue = 5 &times; 5 = <b>25</b>.</div>` },
      { title: 'Scale & direct proportion', check: 'scale', body: `
        <p>Map scales and recipes are proportions in disguise. Find the value of <b>one</b> unit, then scale it.</p>
        <div class="ex">1 inch = 25 miles, so 2.5 inches = 2.5 &times; 25 = <b>62.5 miles</b>.</div>` },
      { title: 'Direct proportion: unit price', check: 'direct', body: `
        <p>If 4 pens cost $6, one pen costs $6 &divide; 4 = $1.50, so 10 pens cost <b>$15</b>. Same idea as a recipe: 2 cups of flour for 18 cookies &rarr; 5 cups for 45 cookies.</p>` },
    ],
    types: {
      simplify: () => {
        let a, b; do { a = R(1, 9); b = R(1, 9); } while (a === b || gcd(a, b) !== 1); const g = R(2, 9);
        const it = pick([['men', 'women', 'A platoon has {A} men and {B} women. What is the ratio of men to women in lowest terms?'], ['red', 'blue', 'A bag holds {A} red and {B} blue chips. What is the ratio of red to blue chips in lowest terms?'], ['wins', 'losses', 'A team has {A} wins and {B} losses. What is the ratio of wins to losses in lowest terms?']]);
        return mk(it[2].replace('{A}', a * g).replace('{B}', b * g), rt(a, b), [rt(b, a), rt(a * g, b * g), rt(a + 1, b), rt(a, b + 1)], `Divide both numbers by ${g}: ${a * g} : ${b * g} = ${a} : ${b}. Keep the order the question gives.`);
      },
      proportion: () => {
        const b = R(3, 9), a = R(2, b - 1), k = R(2, 6), d = b * k, x = a * k;
        return num(`Solve for x: ${fr(a, b)} = ${fr('x', d)}`, x, `Cross-multiply: ${a} &times; ${d} = ${b}x, so x = ${a * d} &divide; ${b} = ${x}.`, { bad: [a + (d - b), a * d, d - b, x + k] });
      },
      partwhole: () => {
        let a, b; do { a = R(1, 7); b = R(2, 8); } while (a === b || gcd(a, b) !== 1); const k = R(2, 9), T = (a + b) * k;
        const nm = pick([['red', 'blue', 'marbles'], ['sugar', 'flour', 'cups of mix'], ['boys', 'girls', 'students']]);
        return num(`The ratio of ${nm[0]} to ${nm[1]} is ${a} : ${b}. There are ${T} ${nm[2]} in all. How many are ${nm[1]}?`, b * k, `Shares: ${a} + ${b} = ${a + b}. One share = ${T} &divide; ${a + b} = ${k}. ${nm[1]} = ${b} &times; ${k} = ${b * k}.`, { bad: [a * k, T / b, T - b, k] });
      },
      scale: () => {
        const M = pick([10, 20, 25, 30, 40, 50]), l = R(2, 9) + pick([0, 0.5]);
        return num(`On a map, 1 inch represents ${M} miles. How many miles are represented by ${l} inches?`, M * l, `${l} &times; ${M} = ${fmt(M * l)} miles.`, { f: (n) => fmt(n) + ' miles', bad: [M + l, r6(M / l), M * l * 2, M * l / 10] });
      },
      direct: () => {
        const u = pick([0.5, 0.75, 1.5, 2.5, 1.25, 2.25]), a = R(2, 8) * 4, n = R(5, 25), cost = a * u;
        if (R(0, 1)) return num(`If ${a} notebooks cost ${money(cost)}, how much do ${n} notebooks cost?`, n * u, `One notebook = ${money(cost)} &divide; ${a} = ${money(u)}. ${n} notebooks = ${n} &times; ${money(u)} = ${money(n * u)}.`, { f: money, bad: [cost + (n - a), cost * n / 10, cost * n, (n - a) * u + 1] });
        const k = R(2, 5), c = R(1, 4) * 2; return num(`A recipe uses ${c} cups of flour for 18 cookies. How many cups are needed for ${18 * k} cookies?`, c * k, `${18 * k} cookies is ${k} times 18 cookies, so use ${k} &times; ${c} = ${c * k} cups.`, { bad: [c + (18 * k - 18), c + k, c * k + c, c * (k - 1)] });
      },
    },
  });

  /* ===================== 9. RATES, UNITS & DISTANCE-RATE-TIME ===================== */
  UNITS.push({
    id: 'rates', icon: '9', title: 'Rates, Unit Conversion & Distance-Rate-Time',
    blurb: 'Unit prices, best buys, converting units, and the distance = rate × time family.',
    lessons: [
      { title: 'Unit rates & best buys', check: 'bestbuy', body: `
        <p>A <b>unit rate</b> is &ldquo;per one.&rdquo; $4.80 for 6 items &rarr; $4.80 &divide; 6 = $0.80 each.</p>
        <div class="key"><b>Best buy:</b> price &divide; size for each option. The <b>lowest</b> price per unit wins.</div>` },
      { title: 'Unit price practice', check: 'unit', body: `
        <p>Divide the total by the number of units. Include units in your answer (&ldquo;per ounce&rdquo;, &ldquo;per mile&rdquo;).</p>
        <div class="ex">$3.60 for 12 ounces &rarr; $3.60 &divide; 12 = <b>$0.30 per ounce</b>.</div>` },
      { title: 'Converting units', check: 'conv', body: `
        <p>Know these cold: 12 in = 1 ft &bull; 3 ft = 1 yd &bull; 5,280 ft = 1 mi &bull; 16 oz = 1 lb &bull; 2,000 lb = 1 ton &bull; 2 pt = 1 qt &bull; 4 qt = 1 gal &bull; 2 cups = 1 pt &bull; 60 s = 1 min &bull; 60 min = 1 hr &bull; 24 hr = 1 day &bull; 7 days = 1 wk</p>
        <div class="key">Going to a <b>smaller</b> unit &rarr; <b>multiply</b> (more of them). Going to a <b>larger</b> unit &rarr; <b>divide</b>.</div>
        <div class="ex">3 yards = 3 &times; 3 = <b>9 feet</b>. 48 inches = 48 &divide; 12 = <b>4 feet</b>.</div>` },
      { title: 'Distance = Rate × Time', check: 'drt', body: `
        <div class="key"><b>d = r &times; t</b> &nbsp;&rarr;&nbsp; r = d &divide; t &nbsp;and&nbsp; t = d &divide; r. Units must match (mph with hours).</div>
        <div class="ex">55 mph for 3 hours: 55 &times; 3 = <b>165 miles</b>.</div>` },
      { title: 'Multi-part trips', check: 'trip', body: `
        <ul><li><b>Opposite directions:</b> speeds <b>add</b>.</li>
        <li><b>Several legs:</b> compute each distance, then add.</li>
        <li><b>Average speed</b> = total distance &divide; total time (<i>not</i> the average of the speeds).</li></ul>
        <div class="ex">60 miles at 30 mph (2 h) and 60 miles at 60 mph (1 h): 120 miles in 3 h = <b>40 mph</b>, not 45.</div>` },
    ],
    types: {
      bestbuy: () => {
        const item = pick([['cereal', 'oz'], ['juice', 'oz'], ['detergent', 'oz'], ['rice', 'oz']]);
        let opts; do {
          const sizes = shuffle([8, 12, 16, 20, 24, 32, 48]).slice(0, 4);
          opts = sizes.map((s) => { const u = R(8, 20) / 100; return { s, p: Math.round(s * u * 100) / 100, u: Math.round(s * u * 100) / 100 / s }; });
        } while (opts.some((o) => o.p <= 0) || [...opts].sort((a, b) => a.u - b.u).some((o, i, arr) => i && o.u - arr[i - 1].u < 0.012));
        const best = opts.reduce((a, b) => (b.u < a.u ? b : a)), label = (o) => `${o.s} oz for ${money(o.p)}`;
        return mk(`Which ${item[0]} package is the <b>best buy</b> (lowest price per ounce)?`, label(best), opts.filter((o) => o !== best).map(label), `Price per ounce: ${opts.map((o) => `${money(o.p)}/${o.s} = $${o.u.toFixed(3)}`).join('; ')}. The lowest is ${label(best)}.`);
      },
      unit: () => {
        const n = pick([4, 5, 6, 8, 10, 12, 15, 20, 25]), u = pick([0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8, 1.2, 1.5]), tot = r6(n * u);
        return num(`${n} identical items cost ${money(tot)} in all. What is the price per item?`, u, `${money(tot)} &divide; ${n} = ${money(u)}.`, { f: money, bad: [r6(n / tot), r6(tot + n), r6(u * 10), r6(u / 10)] });
      },
      conv: () => {
        const T = [['feet', 'inches', 12], ['yards', 'feet', 3], ['miles', 'feet', 5280], ['pounds', 'ounces', 16], ['gallons', 'quarts', 4], ['quarts', 'pints', 2], ['pints', 'cups', 2], ['hours', 'minutes', 60], ['minutes', 'seconds', 60], ['days', 'hours', 24], ['weeks', 'days', 7], ['tons', 'pounds', 2000], ['yards', 'inches', 36]];
        const [big, small, f] = pick(T), k = f >= 1000 ? R(2, 5) : R(2, 12);
        if (R(0, 1)) return num(`How many ${small} are in ${k} ${big}?`, k * f, `1 ${big.replace(/s$/, '')} = ${fmt(f)} ${small}, so ${k} &times; ${fmt(f)} = ${fmt(k * f)}.`, { bad: [k + f, r6(k / f), k * f / 10, k * f * 2].filter(Number.isFinite) });
        return num(`How many ${big} are in ${fmt(k * f)} ${small}?`, k, `${fmt(f)} ${small} = 1 ${big.replace(/s$/, '')}, so ${fmt(k * f)} &divide; ${fmt(f)} = ${k}.`, { bad: [k * f * f, k + f, k * 2, k + 1] });
      },
      drt: () => {
        const t = R(0, 2), r = pick([35, 40, 45, 50, 55, 60, 65, 70]), h = pick([2, 3, 4, 5, 6, 2.5, 3.5]);
        if (t === 0) return num(`A truck travels at ${r} miles per hour for ${h} hours. How far does it go?`, r * h, `Distance = rate &times; time = ${r} &times; ${h} = ${fmt(r * h)} miles.`, { f: (n) => fmt(n) + ' miles', bad: [r + h, r / h, r * h + r] });
        if (t === 1) return num(`A convoy covers ${fmt(r * h)} miles in ${h} hours. What is its average speed?`, r, `Rate = distance &divide; time = ${fmt(r * h)} &divide; ${h} = ${r} mph.`, { f: (n) => fmt(n) + ' mph', bad: [r * h * h, r + 10, r - 5, h] });
        return num(`How many hours does it take to travel ${fmt(r * h)} miles at ${r} miles per hour?`, h, `Time = distance &divide; rate = ${fmt(r * h)} &divide; ${r} = ${h} hours.`, { f: (n) => fmt(n) + ' hours', bad: [r * h * r, h + 1, h * 2, r - h] });
      },
      trip: () => {
        const t = R(0, 2);
        if (t === 0) { const a = pick([40, 45, 50, 55]), b = pick([30, 35, 60, 65]), h = R(2, 5); return num(`Two trains leave the same station at the same time, traveling in <b>opposite</b> directions at ${a} mph and ${b} mph. How many miles apart are they after ${h} hours?`, (a + b) * h, `They separate at ${a} + ${b} = ${a + b} mph. ${a + b} &times; ${h} = ${(a + b) * h} miles.`, { f: (n) => fmt(n) + ' miles', bad: [Math.abs(a - b) * h, a * h, (a + b) * h / 2, (a + b) + h] }); }
        if (t === 1) { const a = pick([40, 50, 60]), b = pick([30, 45, 55]), h1 = R(1, 4), h2 = R(2, 5); return num(`A driver goes ${a} mph for ${h1} hour${h1 > 1 ? 's' : ''}, then ${b} mph for ${h2} hours. What is the total distance?`, a * h1 + b * h2, `${a} &times; ${h1} = ${a * h1}; ${b} &times; ${h2} = ${b * h2}. Total = ${a * h1 + b * h2} miles.`, { f: (n) => fmt(n) + ' miles', bad: [r6((a + b) / 2 * (h1 + h2)), (a + b) * h1, (a + b) * h2, a * h2 + b * h1] }); }
        const [a, b] = pick([[30, 60], [40, 60], [60, 90], [20, 30], [50, 75], [45, 90], [30, 45]]), avg = 2 * a * b / (a + b), d = R(2, 6) * 30;
        return num(`A car drives ${d} miles at ${a} mph, then returns the same ${d} miles at ${b} mph. What is its average speed for the whole trip?`, avg, `Total distance = ${2 * d}. Total time = ${d}/${a} + ${d}/${b} = ${r6(d / a + d / b)} h. Average = ${2 * d} &divide; ${r6(d / a + d / b)} = ${avg} mph (not ${(a + b) / 2}).`, { f: (n) => fmt(n) + ' mph', bad: [(a + b) / 2, a + b - avg, avg + 2] });
      },
    },
  });

  /* ===================== 10. EXPONENTS & ROOTS ===================== */
  UNITS.push({
    id: 'exponents', icon: '10', title: 'Exponents & Roots',
    blurb: 'Powers, exponent laws, square roots, simplifying radicals and scientific notation.',
    lessons: [
      { title: 'Exponents', check: 'exp', body: `
        <p>3<sup>4</sup> means 3 &times; 3 &times; 3 &times; 3 = 81. The exponent counts how many times the base is used as a factor (it is <b>not</b> 3 &times; 4).</p>
        <div class="key"><b>Watch the parentheses:</b> (&minus;3)<sup>2</sup> = (&minus;3)(&minus;3) = <b>9</b>, but &minus;3<sup>2</sup> = &minus;(3 &times; 3) = <b>&minus;9</b>. Also: any number<sup>0</sup> = 1.</div>` },
      { title: 'Exponent laws', check: 'rules', body: `
        <div class="key"><b>Same base:</b><br>multiply &rarr; <b>add</b> exponents: x<sup>3</sup> &middot; x<sup>4</sup> = x<sup>7</sup><br>divide &rarr; <b>subtract</b>: x<sup>8</sup> &divide; x<sup>2</sup> = x<sup>6</sup><br>power of a power &rarr; <b>multiply</b>: (x<sup>2</sup>)<sup>3</sup> = x<sup>6</sup></div>
        <p>Negative exponent = reciprocal: 2<sup>&minus;3</sup> = ${fr(1, 8)}.</p>` },
      { title: 'Square roots', check: 'sqrt', body: `
        <p>&radic;n asks &ldquo;what number times itself is n?&rdquo; Memorize squares to 15: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225.</p>
        <div class="ex">&radic;50 is between &radic;49 = 7 and &radic;64 = 8, but much closer to 7: about 7.07.</div>` },
      { title: 'Simplifying radicals', check: 'root', body: `
        <div class="key">Pull out the largest <b>perfect square</b> factor: &radic;(a &times; b) = &radic;a &times; &radic;b.</div>
        <div class="ex">&radic;72 = &radic;(36 &times; 2) = &radic;36 &times; &radic;2 = <b>6&radic;2</b>.</div>
        <p>Check: (6&radic;2)<sup>2</sup> = 36 &times; 2 = 72 &#10003;.</p>` },
      { title: 'Scientific notation', check: 'sci', body: `
        <p>Write a number as <b>(1 to 9.99&hellip;) &times; 10<sup>power</sup></b>.</p>
        <div class="ex">4,500,000: move the point 6 places left &rarr; <b>4.5 &times; 10<sup>6</sup></b>.</div>
        <div class="ex">0.00052: move 4 places right &rarr; <b>5.2 &times; 10<sup>&minus;4</sup></b>.</div>
        <p>Positive exponent = big number, negative = small number.</p>` },
    ],
    types: {
      exp: () => {
        const t = R(0, 3);
        if (t === 0) { const b = R(2, 5), e = R(2, 4); return num(`What is ${b}<sup>${e}</sup>?`, Math.pow(b, e), `${Array(e).fill(b).join(' &times; ')} = ${fmt(Math.pow(b, e))}.`, { bad: [b * e, Math.pow(b, e - 1), Math.pow(b, e + 1), Math.pow(b, e) + b] }); }
        if (t === 1) { const b = R(2, 6); return num(`What is (&minus;${b})<sup>2</sup>?`, b * b, `(&minus;${b})(&minus;${b}) = ${b * b}. The parentheses mean the negative is squared too.`, { bad: [-b * b, -2 * b, 2 * b] }); }
        if (t === 2) { const b = R(2, 6); return num(`What is &minus;${b}<sup>2</sup>?`, -b * b, `Without parentheses, only ${b} is squared: &minus;(${b} &times; ${b}) = &minus;${b * b}.`, { allowNeg: true, bad: [b * b, 2 * b, -2 * b] }); }
        const b = R(2, 4), c = R(2, 5), e = R(2, 3); return num(`What is ${b}<sup>${e}</sup> + ${c}<sup>2</sup> &minus; 7<sup>0</sup>?`, Math.pow(b, e) + c * c - 1, `${b}<sup>${e}</sup> = ${Math.pow(b, e)}, ${c}<sup>2</sup> = ${c * c}, and 7<sup>0</sup> = 1: ${Math.pow(b, e)} + ${c * c} &minus; 1 = ${Math.pow(b, e) + c * c - 1}.`, { bad: [Math.pow(b, e) + c * c, Math.pow(b, e) + c * c - 7, b * e + c * 2 - 1] });
      },
      rules: () => {
        const t = R(0, 4), a = R(2, 6), b = R(2, 5), X = (n) => `x<sup>${n}</sup>`;
        if (t === 0) return mk(`Simplify: ${X(a)} &middot; ${X(b)}`, X(a + b), [X(a * b), X(Math.abs(a - b) || a + b + 1), X(a + b + 1), X(a + b - 1), X(a + b + 2), X(a + b + 3)], `Same base, multiplying: add exponents. ${a} + ${b} = ${a + b}.`);
        if (t === 1) { const A = a + b; return mk(`Simplify: ${X(A)} &divide; ${X(b)}`, X(a), [X(A * b), X(A + b), X(a + 1), X(Math.max(1, a - 1))], `Dividing same base: subtract exponents. ${A} &minus; ${b} = ${a}.`); }
        if (t === 2) return mk(`Simplify: (${X(a)})<sup>${b}</sup>`, X(a * b), [X(a + b), X(a * b + 1), X(Math.pow(a, b)), X(a * b - 1), X(a * b + 2)], `Power of a power: multiply exponents. ${a} &times; ${b} = ${a * b}.`);
        if (t === 3) { const base = pick([2, 3, 4, 5]); return mk(`What is ${base}<sup>&minus;2</sup>?`, fr(1, base * base), [String(-base * base), String(base * base), fr(1, base * base + 1), fr(1, base * base + base)], `A negative exponent means reciprocal: ${base}<sup>&minus;2</sup> = ${fr(1, `${base}<sup>2</sup>`)} = ${fr(1, base * base)}.`); }
        const c = R(2, Math.min(5, a + b - 1)); return mk(`Simplify: ${X(a)} &middot; ${X(b)} &divide; ${X(c)}`, X(a + b - c), [X(a + b + c), X(a * b - c), X(a + b), X(a + b - c + 1), X(a + b - c + 2), X(a + b + c + 1)], `Multiply: add (${a} + ${b} = ${a + b}). Divide: subtract ${c}. Result: ${a + b - c}.`);
      },
      sqrt: () => {
        const t = R(0, 2);
        if (t === 0) { const n = R(4, 15); return num(`What is &radic;${n * n}?`, n, `${n} &times; ${n} = ${n * n}.`, { bad: [n * n / 2, n + 1, n - 1, n * 2] }); }
        if (t === 1) { const a = R(3, 12), b = R(3, 12); return num(`What is &radic;${a * a} + &radic;${b * b}?`, a + b, `&radic;${a * a} = ${a} and &radic;${b * b} = ${b}, so ${a + b}. (&radic;${a * a + b * b} would be a different number.)`, { bad: [a * b, a + b + 1, a * a + b * b, Math.abs(a - b)] }); }
        let n; do { n = R(3, 99); } while (Number.isInteger(Math.sqrt(n))); const lo = Math.floor(Math.sqrt(n)), s = (k) => `${k} and ${k + 1}`;
        return mk(`&radic;${n} is between which two consecutive whole numbers?`, s(lo), [s(lo - 1), s(lo + 1), s(lo - 2), s(lo + 2), s(lo + 3)].filter((x) => !x.startsWith('0') && !x.startsWith('-')), `${lo}<sup>2</sup> = ${lo * lo} and ${lo + 1}<sup>2</sup> = ${(lo + 1) * (lo + 1)}, and ${n} sits between those.`);
      },
      root: () => {
        let k, m; do { k = R(2, 7); m = pick([2, 3, 5, 6, 7]); } while (k === m);
        const n = k * k * m;
        return mk(`Simplify &radic;${n}.`, `${k}&radic;${m}`, [`${k * k}&radic;${m}`, `${m}&radic;${k}`, `${k}&radic;${m + 1}`, `${k + 1}&radic;${m}`], `${n} = ${k * k} &times; ${m}, so &radic;${n} = &radic;${k * k} &times; &radic;${m} = ${k}&radic;${m}.`);
      },
      sci: () => {
        const t = R(0, 2);
        if (t === 0) { const m = R(11, 99) / 10, p = R(3, 7), N = Math.round(m * Math.pow(10, p)); const s = (a, b) => `${a} &times; 10<sup>${b}</sup>`; return mk(`Write ${fmt(N)} in scientific notation.`, s(m, p), [s(m, p + 1), s(m, p - 1), s(r6(m * 10), p - 1), s(m, p + 2)], `Move the decimal point ${p} places left to get ${m}, so ${m} &times; 10<sup>${p}</sup>.`); }
        if (t === 1) { const m = R(11, 99) / 10, p = R(2, 5), N = Math.round(m * Math.pow(10, p)); return num(`What is ${m} &times; 10<sup>${p}</sup> in standard form?`, N, `Multiplying by 10<sup>${p}</sup> moves the decimal point ${p} places right: ${fmt(N)}.`, { bad: [N * 10, N / 10, N * 100, N / 100] }); }
        const m = R(11, 99) / 10, p = -R(3, 5), v = Number((m * Math.pow(10, p)).toFixed(-p + 1)); const s = (a, b) => `${a} &times; 10<sup>${b < 0 ? '&minus;' + (-b) : b}</sup>`;
        return mk(`Write ${v.toFixed(-p + 1)} in scientific notation.`, s(m, p), [s(m, p + 1), s(m, p - 1), s(m, -p), s(r6(m * 10), p - 1)], `Move the decimal point ${-p} places right to get ${m}, so ${m} &times; 10<sup>&minus;${-p}</sup>.`);
      },
    },
  });

  /* ===================== 11. SOLVING EQUATIONS ===================== */
  const opF = { '>': '&gt;', '<': '&lt;', '≥': '&ge;', '≤': '&le;' }, opR = { '>': '<', '<': '>', '≥': '≤', '≤': '≥' };
  UNITS.push({
    id: 'equations', icon: '11', title: 'Solving Equations & Inequalities',
    blurb: 'Isolate the variable, handle variables on both sides, fractions, substitution and inequalities.',
    lessons: [
      { title: 'One-step equations', check: 'onestep', body: `
        <div class="key"><b>Balance rule:</b> whatever you do to one side, do to the other. Use the <b>inverse operation</b> to undo.</div>
        <div class="ex">x + 7 = 19 &rarr; subtract 7: x = <b>12</b>. &nbsp; 3x = 42 &rarr; divide by 3: x = <b>14</b>.</div>` },
      { title: 'Two-step equations', check: 'twostep', body: `
        <div class="key">Undo <b>add/subtract first</b>, then undo <b>multiply/divide</b>.</div>
        <div class="ex">2x &minus; 5 = 17 &rarr; add 5: 2x = 22 &rarr; divide by 2: x = <b>11</b>.</div>
        <p>Always plug the answer back in to check.</p>` },
      { title: 'Variables on both sides & parentheses', check: 'multistep', body: `
        <ol><li>Distribute any parentheses.</li><li>Combine like terms.</li><li>Get variables on one side (subtract the smaller x-term).</li><li>Then solve like a two-step.</li></ol>
        <div class="ex">5x &minus; 3 = 2x + 12 &rarr; 3x &minus; 3 = 12 &rarr; 3x = 15 &rarr; x = <b>5</b>.</div>
        <div class="ex">3(x + 2) = 21 &rarr; 3x + 6 = 21 &rarr; 3x = 15 &rarr; x = <b>5</b>.</div>` },
      { title: 'Fractions in equations', check: 'fracEq', body: `
        <div class="key">Clear fractions by multiplying <b>every</b> term by the common denominator.</div>
        <div class="ex">${fr('x + 3', 4)} = 5 &rarr; x + 3 = 20 &rarr; x = <b>17</b>.</div>
        <div class="ex">${fr('x', 2)} + ${fr('x', 3)} = 10 &rarr; multiply by 6: 3x + 2x = 60 &rarr; x = <b>12</b>.</div>` },
      { title: 'Substituting into expressions', check: 'evaluate', body: `
        <p>Replace each letter with its value (use parentheses around negatives!), then follow order of operations.</p>
        <div class="ex">If x = 3 and y = &minus;2: 2x<sup>2</sup> &minus; y = 2(9) &minus; (&minus;2) = 18 + 2 = <b>20</b>.</div>` },
      { title: 'Inequalities', check: 'inequality', body: `
        <p>Solve exactly like an equation, with one big exception:</p>
        <div class="key">When you <b>multiply or divide by a negative</b>, <b>flip the inequality sign</b>.</div>
        <div class="ex">&minus;2x &lt; 8 &rarr; divide by &minus;2 and flip: x <b>&gt; &minus;4</b>.</div>
        <div class="ex">3x &minus; 4 &gt; 11 &rarr; 3x &gt; 15 &rarr; x <b>&gt; 5</b> (no flip: divided by a positive).</div>` },
    ],
    types: {
      onestep: () => {
        const x = nz(-12, 20), b = R(2, 15), t = R(0, 3);
        if (t === 0) return num(`Solve: x + ${b} = ${neg(x + b)}`, x, `Subtract ${b} from both sides: x = ${neg(x + b)} &minus; ${b} = ${neg(x)}.`, { allowNeg: true, bad: [x + 2 * b, -x, x - 1] });
        if (t === 1) return num(`Solve: x &minus; ${b} = ${neg(x - b)}`, x, `Add ${b} to both sides: x = ${neg(x - b)} + ${b} = ${neg(x)}.`, { allowNeg: true, bad: [x - 2 * b, -x, x + 1] });
        const a = pick([2, 3, 4, 5, 6, 7, 8]);
        if (t === 2) return num(`Solve: ${a}x = ${neg(a * x)}`, x, `Divide both sides by ${a}: x = ${neg(a * x)} &divide; ${a} = ${neg(x)}.`, { allowNeg: true, bad: [a * x * a, x + a, -x] });
        return num(`Solve: ${fr('x', a)} = ${neg(x)}`, a * x, `Multiply both sides by ${a}: x = ${neg(x)} &times; ${a} = ${neg(a * x)}.`, { allowNeg: true, bad: [x * 1 + a, -a * x, r6(x / a) === x ? x + 1 : r6(x / a)].filter((v) => v !== a * x) });
      },
      twostep: () => {
        const x = nz(-9, 15), a = pick([2, 3, 4, 5, 6]), b = nz(-12, 12);
        if (R(0, 1)) { const c = a * x + b; return num(`Solve: ${a}x ${b < 0 ? '&minus;' : '+'} ${Math.abs(b)} = ${neg(c)}`, x, `${b < 0 ? 'Add' : 'Subtract'} ${Math.abs(b)}: ${a}x = ${neg(c - b)}. Divide by ${a}: x = ${neg(x)}.`, { allowNeg: true, bad: [(c + b) / a, c - b, (c - b) * a, -x] }); }
        const m = pick([2, 3, 4, 5]), c = x * 1 + b; const xx = m * R(-6, 12) || m; const cc = xx / m + b;
        return num(`Solve: ${fr('x', m)} ${b < 0 ? '&minus;' : '+'} ${Math.abs(b)} = ${neg(cc)}`, xx, `${b < 0 ? 'Add' : 'Subtract'} ${Math.abs(b)}: ${fr('x', m)} = ${neg(cc - b)}. Multiply by ${m}: x = ${neg(xx)}.`, { allowNeg: true, bad: [cc - b, (cc + b) * m, -xx, cc * m] });
      },
      multistep: () => {
        const x = nz(-8, 12), t = R(0, 2);
        if (t === 0) { let a, c; do { a = R(2, 9); c = R(1, 8); } while (a <= c); const b = nz(-10, 10), d = (a - c) * x + b; return num(`Solve: ${a}x ${b < 0 ? '&minus;' : '+'} ${Math.abs(b)} = ${c}x ${d < 0 ? '&minus;' : '+'} ${Math.abs(d)}`.replace(/\+ 0$/, '').replace(/ [+−] 0$/, ''), x, `Subtract ${c}x: ${a - c}x ${b < 0 ? '&minus;' : '+'} ${Math.abs(b)} = ${neg(d)}. Then ${a - c}x = ${neg(d - b)}, so x = ${neg(x)}.`, { allowNeg: true, bad: [-x, (d + b) / (a - c), (d - b) / (a + c), x + 1] }); }
        if (t === 1) { const a = pick([2, 3, 4, 5]), b = R(1, 9), c = a * (x + b); return num(`Solve: ${a}(x ${b < 0 ? '&minus;' : '+'} ${b}) = ${neg(c)}`, x, `Distribute: ${a}x + ${a * b} = ${neg(c)}. Subtract ${a * b}: ${a}x = ${neg(c - a * b)}. Divide by ${a}: x = ${neg(x)}.`, { allowNeg: true, bad: [c / a, c / a + b, (c + a * b) / a, -x] }); }
        const a = pick([2, 3, 4]), b = R(1, 8), c = pick([1, 2, 3]), k = a * (x - b) + c * 1, e = k; return num(`Solve: ${a}(x &minus; ${b}) + ${c} = ${neg(e)}`, x, `Subtract ${c}: ${a}(x &minus; ${b}) = ${neg(e - c)}. Divide by ${a}: x &minus; ${b} = ${neg(x - b)}. Add ${b}: x = ${neg(x)}.`, { allowNeg: true, bad: [x - b, x + 2 * b, (e + c) / a + b, -x] });
      },
      fracEq: () => {
        if (R(0, 1)) { const b = R(2, 9), c = R(2, 9), a = nz(-6, 9), x = b * c - a; return num(`Solve: ${fr(`x ${a < 0 ? '&minus;' : '+'} ${Math.abs(a)}`, b)} = ${c}`, x, `Multiply both sides by ${b}: x ${a < 0 ? '&minus;' : '+'} ${Math.abs(a)} = ${b * c}. So x = ${neg(x)}.`, { allowNeg: true, bad: [b * c + a, c + a, b * c, -x] }); }
        const [a, b] = pick([[2, 3], [3, 4], [2, 5], [3, 6], [4, 5], [2, 4]]), l = lcm(a, b), x = l * R(1, 4), c = x / a + x / b;
        return num(`Solve: ${fr('x', a)} + ${fr('x', b)} = ${c}`, x, `Multiply every term by ${l}: ${l / a}x + ${l / b}x = ${l * c}, so ${l / a + l / b}x = ${l * c} and x = ${x}.`, { bad: [c * (a + b), l * c, x + l, c * 2] });
      },
      evaluate: () => {
        const x = R(2, 6), y = nz(-5, -1), a = R(2, 5), b = R(2, 5);
        if (R(0, 1)) return num(`If x = ${x} and y = ${neg(y)}, what is the value of ${a}x<sup>2</sup> &minus; y?`, a * x * x - y, `${a}(${x})<sup>2</sup> &minus; (${neg(y)}) = ${a * x * x} + ${-y} = ${a * x * x - y}.`, { allowNeg: true, f: neg, bad: [a * x * x + y, a * x * 2 - y, (a * x) * (a * x) - y] });
        return num(`If x = ${x} and y = ${neg(y)}, what is the value of ${a}x + ${b}y &minus; 3?`, a * x + b * y - 3, `${a}(${x}) + ${b}(${neg(y)}) &minus; 3 = ${a * x} + (${neg(b * y)}) &minus; 3 = ${neg(a * x + b * y - 3)}.`, { allowNeg: true, f: neg, bad: [a * x - b * y - 3, a * x + b * y + 3, a * x + b * -y - 3] });
      },
      inequality: () => {
        const xs = nz(-8, 8), a = nz(-5, 5), b = nz(-9, 9), op = pick(['>', '<', '≥', '≤']), c = a * xs + b;
        const ans = a < 0 ? opR[op] : op, sym = (o, v) => `x ${opF[o]} ${neg(v)}`;
        return mk(`Solve: ${lin(a, b)} ${opF[op]} ${neg(c)}`, sym(ans, xs), [sym(opR[ans], xs), sym(ans, -xs), sym(opR[ans], -xs), sym(ans, xs + 1)],
          `${b ? (b > 0 ? 'Subtract ' + b + ' from' : 'Add ' + -b + ' to') + ' both sides: ' : ''}${a === 1 ? 'x' : a === -1 ? '−x' : neg(a) + 'x'} ${opF[op]} ${neg(c - b)}. ${a < 0 ? 'Divide by ' + neg(a) + ' and <b>flip the sign</b>' : (Math.abs(a) === 1 ? 'Done' : 'Divide by ' + a + ' (no flip)')}: ${sym(ans, xs)}.`);
      },
    },
  });

  /* ===================== 12. EXPRESSIONS & FACTORING ===================== */
  const fac = (p, q) => { const [m, n] = [p, q].sort((x, y) => x - y); const f = (k) => (k < 0 ? `(x − ${-k})` : `(x + ${k})`); return f(m) + f(n); };
  UNITS.push({
    id: 'expressions', icon: '12', title: 'Expressions, FOIL & Factoring',
    blurb: 'Combine like terms, distribute, multiply binomials, factor and solve simple quadratics.',
    lessons: [
      { title: 'Combining like terms', check: 'like', body: `
        <p><b>Like terms</b> have the same variable part: 3x and &minus;x are like terms; 3x and 5 are not. Add the coefficients, keep the variable.</p>
        <div class="ex">3x + 5 &minus; x + 2 = (3x &minus; x) + (5 + 2) = <b>2x + 7</b>.</div>` },
      { title: 'The distributive property', check: 'distribute', body: `
        <div class="key">a(b + c) = ab + ac. Multiply the outside number by <b>every</b> term inside, and watch the signs.</div>
        <div class="ex">&minus;2(x + 5) + 4x = &minus;2x &minus; 10 + 4x = <b>2x &minus; 10</b>.</div>` },
      { title: 'Multiplying binomials (FOIL)', check: 'foil', body: `
        <div class="key"><b>F</b>irst, <b>O</b>uter, <b>I</b>nner, <b>L</b>ast.</div>
        <div class="ex">(x + 3)(x + 5) = x<sup>2</sup> + 5x + 3x + 15 = <b>x<sup>2</sup> + 8x + 15</b>.</div>
        <p>Shortcut for (x + p)(x + q): middle term = p + q, last term = p &times; q.</p>` },
      { title: 'Factoring trinomials', check: 'factor', body: `
        <p>Reverse FOIL. To factor x<sup>2</sup> + bx + c, find two numbers that <b>multiply to c</b> and <b>add to b</b>.</p>
        <div class="ex">x<sup>2</sup> + 7x + 12: pairs that multiply to 12: (3, 4) add to 7 &#10003; &rarr; <b>(x + 3)(x + 4)</b>.</div>
        <div class="tip">Check by FOIL-ing your answer back out.</div>` },
      { title: 'Difference of squares', check: 'diffsq', body: `
        <div class="key">a<sup>2</sup> &minus; b<sup>2</sup> = (a &minus; b)(a + b). No middle term, minus sign between two perfect squares.</div>
        <div class="ex">x<sup>2</sup> &minus; 49 = <b>(x &minus; 7)(x + 7)</b>.</div>` },
      { title: 'Solving quadratics by factoring', check: 'quadsolve', body: `
        <ol><li>Move everything to one side so it equals 0.</li><li>Factor.</li><li>Set each factor to 0 (zero-product rule).</li></ol>
        <div class="ex">x<sup>2</sup> &minus; 5x + 6 = 0 &rarr; (x &minus; 2)(x &minus; 3) = 0 &rarr; x = <b>2</b> or x = <b>3</b>.</div>
        <p>Careful: the factor (x + 4) gives x = <b>&minus;4</b>. The sign flips.</p>` },
    ],
    types: {
      like: () => {
        let a, b, c, d; do { a = nz(-6, 9); c = nz(-6, 9); b = nz(-9, 9); d = nz(-9, 9); } while (a + c === 0 || b + d === 0);
        const e = ex([[a, 'x'], [b, ''], [c, 'x'], [d, '']]);
        return mk(`Simplify: ${e}`, lin(a + c, b + d), [lin(a - c, b + d), lin(a + c, b - d), lin(a + c, -(b + d)), lin(a + c + b + d, 0), lin(-(a + c), b + d)], `Group like terms: (${neg(a)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}x) + (${neg(b)} ${d < 0 ? '−' : '+'} ${Math.abs(d)}) = ${lin(a + c, b + d)}.`);
      },
      distribute: () => {
        const p = pick([-5, -4, -3, -2, 2, 3, 4, 5]), a = nz(-5, 6), b = nz(-8, 8), q = nz(-4, 6), inner = lin(a, b);
        const ans = lin(p * a + q, p * b);
        return mk(`Simplify: ${p < 0 ? '−' + -p : p}(${inner}) ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}x`, ans, [lin(p * a + q, b), lin(p * a + q, -p * b), lin(p * a, p * b), lin(p + a + q, p * b), lin(p * a - q, p * b)], `Distribute ${neg(p)}: ${neg(p * a)}x ${p * b < 0 ? '−' : '+'} ${Math.abs(p * b)}. Then combine the x terms with ${neg(q)}x: ${ans}.`);
      },
      foil: () => {
        const t = R(0, 1);
        if (t === 0) { let p, q; do { p = nz(-9, 9); q = nz(-9, 9); } while (p + q === 0 || p === q); const f = (k) => (k < 0 ? `(x − ${-k})` : `(x + ${k})`);
          return mk(`Multiply: ${f(p)}${f(q)}`, quad(1, p + q, p * q), [quad(1, 0, p * q), quad(1, p + q, -p * q), quad(1, -(p + q), p * q), quad(1, p * q, p + q), quad(1, p + q, p + q)], `FOIL: x<sup>2</sup> + (${neg(p)} + ${neg(q)})x + (${neg(p)})(${neg(q)}) = ${quad(1, p + q, p * q)}.`); }
        const p = nz(-8, 8), f = p < 0 ? `(x − ${-p})` : `(x + ${p})`;
        return mk(`Expand: ${f}<sup>2</sup>`, quad(1, 2 * p, p * p), [quad(1, 0, p * p), quad(1, p, p * p), quad(1, 2 * p, -p * p), quad(1, -2 * p, p * p)], `${f}${f} = x<sup>2</sup> + ${neg(2 * p)}x + ${p * p}. Don't forget the middle term (2 &times; ${neg(p)} &times; x).`);
      },
      factor: () => {
        let p, q; do { p = nz(-9, 9); q = nz(-9, 9); } while (p === -q);
        const ex2 = [[p + 1, q], [p, q + 1], [p, -q], [-p, -q], [-p, q], [p + 2, q], [p, q - 1], [p + 1, q + 1]].filter(([m, n]) => m && n && m * n !== 0).map(([m, n]) => fac(m, n));
        return mk(`Factor: ${quad(1, p + q, p * q)}`, fac(p, q), ex2, `Need two numbers that multiply to ${neg(p * q)} and add to ${neg(p + q)}: ${neg(p)} and ${neg(q)}. So ${fac(p, q)}.`);
      },
      diffsq: () => {
        const k = R(2, 12), f = (a, b) => `(x ${a < 0 ? '−' : '+'} ${Math.abs(a)})(x ${b < 0 ? '−' : '+'} ${Math.abs(b)})`;
        return mk(`Factor: x<sup>2</sup> &minus; ${k * k}`, f(-k, k), [f(-k, -k), f(k, k), f(-k * k, 1), f(-k * k, k * k)], `Difference of squares: x<sup>2</sup> &minus; ${k}<sup>2</sup> = (x &minus; ${k})(x + ${k}).`);
      },
      quadsolve: () => {
        let p, q; do { p = nz(-9, 9); q = nz(-9, 9); } while (p === q);
        const s = (a, b) => { const [m, n] = [a, b].sort((x, y) => x - y); return `x = ${neg(m)} or x = ${neg(n)}`; };
        return mk(`Solve: ${quad(1, p + q, p * q)} = 0`, s(-p, -q), [s(p, q), s(p, -q), s(-p, q), s(-p + 1, -q), s(-p, -q - 1)], `Factor: ${fac(p, q)} = 0. Set each factor to 0: x = ${neg(-p)} or x = ${neg(-q)}.`);
      },
    },
  });
})();
