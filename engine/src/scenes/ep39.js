window.CHEAP = true; window.FELT = true;
// Episode 39, felt sets cut: "Sound Investments" (Jimmie Fuller, Los Angeles, early 1950s; Neville, Sound Investments, 1953).
// Every story shot sits on a set (street, living room, office, lecture hall) so faces land mid frame, clear of the Reels caption zone.
// Plain plum board only for the verse and the Temple CTA.
(() => {
  const VL = id => VOICE_LINES.find(l => l.id === id);
  const WT = (id, w, n = 0) => { const L = VL(id), k = w.toLowerCase(); const h = L.words.filter(x => x[0].toLowerCase().replace(/[^a-z']/g, '') === k); return (h[n] || h[0] || ['', L.t0])[1]; };
  const S = id => VL(id).t0;
  const WORDS = VOICE_LINES.flatMap(L => L.words.map(w => ({ txt: String(w[0]).toLowerCase().replace(/[^a-z]/g, ''), a: w[1], b: Math.max(w[2], w[1] + .08) })));
  const ampAt = t => { if (typeof AMP === 'undefined') return 0; let s = 0, n = 0; for (let d = -2; d <= 1; d++) { const v = AMP[Math.floor(t * 24) + d]; if (v != null) { s += v * (d === 0 ? 2 : 1); n += d === 0 ? 2 : 1; } } return n ? s / n : 0; };
  const talk = t => {
    const w = WORDS.find(w => t >= w.a - .03 && t <= w.b + .02), a = ampAt(t), open0 = clamp((a - .1) / .55);
    if (!w || !w.txt) return { on: open0 > .35, open: open0 * .4, round: .2 };
    const k = clamp((t - w.a) / (w.b - w.a)), vs = w.txt.match(/[aeiouy]+/g) || ['a'], v = vs[Math.min(vs.length - 1, Math.floor(k * vs.length))];
    const round = /^(o|oo|ou|u|ow|oa)/.test(v) || /w/.test(w.txt[0]) && k < .3 ? .9 : /^(e|ee|i|ie|y|ea)/.test(v) ? .05 : .4;
    const lips = /^[mbp]/.test(w.txt) && k < .18 || /[mbp]$/.test(w.txt) && k > .85;
    return { on: true, open: lips ? 0 : clamp(.25 + open0 * .9) * (/^(i|ee|y)/.test(v) ? .7 : 1), round };
  };
  const C = CAST, P = piece;
  const host = (t, x, y, u, o = {}) => person(x, y, u, C.emery, { mood: 'warm', key: 'host', talk: talk(t), ...o });
  const stagger = (t0, i, g = .09) => t0 + .05 + i * g;
  const cue = (key, tt, type, x = 540, size = 400) => { CUELOG[key] = { t: tt, type, x, size }; };
  function stars(x, y, t, t0) { if (t < t0) return; const k = clamp((t - t0) / 1.4); boilSeed('stars'); for (let i = 0; i < 5; i++) { const a = t * 5 + i * TAU / 5; paint(starPts(x + Math.cos(a) * 90, y + Math.sin(a) * 30, 20 * (1 - k * .5), .45, 5, a), { wash: '#F4C04A', ink: PAL.ink, sw: .6 }); } }
  function tally(t, x0, y, n, ts, gap = 92) {
    for (let i = 0; i < n; i++) { const ti = ts[i]; if (t < ti) continue; CUELOG['tally' + i + '@' + ti.toFixed(2)] = { t: ti + .05, type: 'pat', x: x0 + i * gap, size: 120 };
      if (window.CUEMODE) continue; const k = backOut(seg(t, ti, ti + .3)); flushBrush(); noStroke();
      fill(30, 18, 12, 70); ellipse(x0 + i * gap + 5, y + 6, 64 * k, 64 * k); fill(246, 240, 226); ellipse(x0 + i * gap, y, 70 * k, 70 * k); fill(232, 184, 42); ellipse(x0 + i * gap, y, 54 * k, 54 * k); }
  }
  // felt coins: n gold dots in a little pile; t1 = when they start dropping away (one by one)
  function coins(t, x, y, n, tin, t1 = 1e9, r = 26) {
    if (t < tin || window.CUEMODE) return; flushBrush(); noStroke();
    for (let i = 0; i < n; i++) {
      const gone = seg(t, t1 + i * .12, t1 + i * .12 + .35); if (gone >= 1) continue;
      const k = backOut(seg(t, tin + i * .04, tin + i * .04 + .3)), cx = x + ((i % 5) - 2) * r * 1.5 + (Math.floor(i / 5) % 2) * r * .7, cy = y - Math.floor(i / 5) * r * .9 + gone * gone * 500;
      fill(30, 18, 12, 70 * (1 - gone)); ellipse(cx + 4, cy + 5, r * 2 * k, r * 1.4 * k);
      fill(246, 240, 226, 255 * (1 - gone)); ellipse(cx, cy, r * 2.1 * k, r * 1.5 * k); fill(232, 184, 42, 255 * (1 - gone)); ellipse(cx, cy, r * 1.7 * k, r * 1.1 * k);
    }
  }
  // a red felt "no" ring with a slash, pressed over something
  function noSign(x, y, r, t, tin) {
    if (t < tin || window.CUEMODE) return; const k = backOut(seg(t, tin, tin + .35)); flushBrush();
    push(); noFill(); stroke(30, 18, 12, 70); strokeWeight(r * .2 * k); ellipse(x + 6, y + 7, r * 2 * k, r * 2 * k); line(x - r * .7 * k + 6, y - r * .7 * k + 7, x + r * .7 * k + 6, y + r * .7 * k + 7);
    stroke(200, 58, 48); ellipse(x, y, r * 2 * k, r * 2 * k); line(x - r * .7 * k, y - r * .7 * k, x + r * .7 * k, y + r * .7 * k); pop();
  }
  function phone(x, y, u, t, a = 1) {   // a felt smartphone showing the Temple app
    if (window.CUEMODE) return; flushBrush(); push(); translate(x, y); rotate(-.1 + .02 * Math.sin(t * 2));
    const w = u * 3.6, h = u * 6.6; noStroke();
    fill(30, 18, 12, 80 * a); rect(-w / 2 + 7, -h + 9, w, h, u * .7);
    fill(246, 240, 226, 255 * a); rect(-w / 2 - u * .3, -h - u * .3, w + u * .6, h + u * .6, u * .9);
    fill(42, 36, 48, 255 * a); rect(-w / 2, -h, w, h, u * .7);
    fill(243, 230, 200, 255 * a); rect(-w / 2 + u * .35, -h + u * .6, w - u * .7, h - u * 1.3, u * .35);
    const im = (window.PLATES || {})['p:bible_temple']; if (im) { const s = w * .58; tint(255, 255 * a); image(im, -s / 2, -h + u * 1.0, s, s * im.height / im.width); noTint(); }
    stroke(210, 69, 58, 255 * a); strokeWeight(u * .24); noFill(); beginShape();
    for (let i = 0; i <= 8; i++) vertex(-w / 2 + u * .8 + i * (w - u * 1.6) / 8, -h * .2 - (i / 8) * h * .2 + Math.sin(i * 1.9) * u * .35); endShape(); pop();
  }
  // sound waves from a radio or a phone
  function waves(x, y, t, t0, s = 1) { if (t < t0 || window.CUEMODE) return; flushBrush(); push(); stroke(PAL.ink); strokeWeight(6 * s); noFill(); for (let i = 0; i < 3; i++) { const r = (50 + i * 38 + 30 * ((t * 1.5) % 1)) * s; arc(x, y, r, r, -.7, .7); } pop(); }

  // ---------- sets (depth: horizon, lawn, sidewalk, curb, road; room box) ----------
  const HZ = 1010, WALK0 = 1380, WALK1 = 1520, CURB = 1545;
  const ZY = z => lerp(HZ + 30, 1475, z), ZS = z => lerp(.6, 1, z), ZX = (x, z) => 540 + (x - 540) * lerp(.62, 1, z);
  const haze = z => { const k = Math.round(lerp(226, 255, z)); return [k, k, Math.round(k * .985)]; };
  const at = (name, x, z, h, o = {}) => P(name, ZX(x, z), ZY(z), h * ZS(z), { tint: haze(z), sway: 0, ...o });
  const who = (Sp, x, z, u, o = {}) => person(ZX(x, z), ZY(z), u * lerp(.45, 1, z), Sp, o);
  function fabric(bd, pts, col, a = 255) {
    const im = (window.PLATES || {})['b:' + bd]; if (!im || window.CUEMODE) return;
    flushBrush();
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    const vs = Math.min(1, (y1 - y0) / Math.max(1, x1 - x0) * im.width / im.height);
    push(); noStroke(); textureMode(NORMAL); tint(col[0], col[1], col[2], a); texture(im);
    beginShape(); for (const [x, y] of pts) vertex(x, y, 0, (x - x0) / Math.max(1, x1 - x0), (y - y0) / Math.max(1, y1 - y0) * vs); endShape(CLOSE); noTint(); pop();
    push(); noFill(); stroke(30, 18, 12, 60); strokeWeight(5); beginShape(); pts.forEach(p => vertex(p[0], p[1] + 3)); endShape(CLOSE); pop();
  }
  const band = (y0, y1) => [[-60, y0], [W + 60, y0], [W + 60, y1], [-60, y1]];
  function street(t, o = {}) {
    if (window.CUEMODE) return;
    const night = o.night ? .55 : 1, m = c => c.map(v => v * night);
    fabric('sand', band(HZ, WALK0), m(o.lawn || [150, 196, 112]));
    for (let i = 1; i < 6; i++) { const y = lerp(HZ, WALK0, (i / 6) ** 1.5); push(); stroke(70, 110, 50, 40); strokeWeight(2 + i * .7); line(-40, y, W + 40, y); pop(); }
    if (o.drive !== false) fabric('sand', [[505, HZ + 6], [585, HZ + 6], [800, WALK0], [380, WALK0]], m([196, 190, 182]));
    fabric('sand', band(WALK0, WALK1), m([214, 206, 196]));
    for (let x = -40; x < W + 40; x += 150) { push(); stroke(120, 110, 100, 90); strokeWeight(3); line(x, WALK0 + 6, x - 30, WALK1 - 4); pop(); }
    fabric('sand', band(WALK1, CURB), m([168, 160, 150]));
    fabric('sand', band(CURB, H + 60), m([104, 104, 110]));
    for (let x = -60; x < W + 60; x += 230) fabric('sand', [[x, 1735], [x + 130, 1735], [x + 130, 1752], [x, 1752]], m([240, 200, 70]));
  }
  // downtown: a paved plaza instead of a lawn (for the office and bank fronts)
  function downtown(t, o = {}) { street(t, { lawn: [188, 180, 170], drive: false, ...o }); }
  function room(t, wall = [232, 214, 186], flr = [150, 104, 70]) {
    if (window.CUEMODE) return;
    const BX0 = 170, BX1 = 910, BY0 = 330, BY1 = 1230;
    fabric('warm', [[-60, -60], [W + 60, -60], [BX1, BY0], [BX0, BY0]], wall.map(c => c * .82));
    fabric('warm', [[BX0, BY0], [BX1, BY0], [BX1, BY1], [BX0, BY1]], wall);
    fabric('warm', [[-60, -60], [BX0, BY0], [BX0, BY1], [-60, H + 60]], wall.map(c => c * .88));
    fabric('warm', [[W + 60, -60], [W + 60, H + 60], [BX1, BY1], [BX1, BY0]], wall.map(c => c * .9));
    fabric('sand', [[BX0, BY1], [BX1, BY1], [W + 60, H + 60], [-60, H + 60]], flr);
    push(); stroke(80, 50, 30, 50); for (let i = 1; i < 9; i++) { const x = lerp(BX0, BX1, i / 9), xb = lerp(-60, W + 60, i / 9); strokeWeight(3); line(x, BY1, xb, H + 60); } pop();
    push(); stroke(60, 40, 25, 80); strokeWeight(14); line(BX0, BY1, BX1, BY1); pop();
  }
  function smoke(px, py, t, t0, t1, o = {}) {
    if (window.CUEMODE || t < t0) return; flushBrush(); noStroke();
    const rate = o.rate || 7, life = o.life || 1.1, dir = o.dir || -1;
    for (let k = Math.floor(t0 * rate); k <= Math.floor(Math.min(t, t1) * rate); k++) {
      const born = k / rate, age = t - born; if (age < 0 || age > life) continue;
      const a = age / life, r = (10 + 34 * a) * (o.scale || 1) * (.8 + .4 * hash(k * 3.1));
      const x = px + dir * (30 + 120 * a) * (o.spread || 1) + 12 * Math.sin(k * 2.3), y = py - 50 * a - 8 * hash(k);
      fill(30, 18, 12, 50 * (1 - a)); ellipse(x + 3, y + 4, r * 2, r * 1.7);
      fill(236, 232, 226, 220 * (1 - a)); ellipse(x, y, r * 2, r * 1.7);
    }
  }

  // ---------- cast (Los Angeles, early 1950s) ----------
  const JIM = { ...C.emery, name: 'jim', coat: '#5C4A36', sleeve: '#5C4A36', suitV: '#3E3024', lapel: '#F3EBDC', tie: '#8C3B3B', tieStripe: '#C9963A', pants: '#3E3024', skin: '#5A3522', afro: false, hair: '#1C1513', hairStyle: 'neat', hat: 'fedora', hatCol: '#3A2E24', band: '#8C3B3B' };
  const JIMB = { ...JIM, name: 'jimb', hat: null };   // indoors, hat off
  const JWIFE = { ...C.dreamer, name: 'jwife', coat: '#3F8F8A', sleeve: '#3F8F8A', stripes: null, hair: '#1C1513', skin: '#6A4029', torso: 7.2, leg: 4.6, w: 4.6 };
  const BABY = { ...C.dreamer, name: 'baby', coat: '#F3EBDC', sleeve: '#F3EBDC', stripes: null, pants: '#F3EBDC', hair: '#1C1513', skin: '#6A4029' };
  const CALLER = { ...C.skeptic, name: 'caller', coat: '#3A3A44', sleeve: '#3A3A44', lapel: '#D9D4C8', tie: '#2E3A52', glasses: false, hat: 'fedora', hatCol: '#22222A', band: '#22222A', skin: '#EFCBA6', hair: '#8C7A5A' };
  const SEC = { ...C.dreamer, name: 'sec', coat: '#B8463A', sleeve: '#B8463A', stripes: null, hair: '#5A3A24', skin: '#C98E62', torso: 7.2, leg: 4.6, w: 4.6 };
  const CLERK = { ...C.skeptic, name: 'clerk', coat: '#6B7A8F', sleeve: '#F3EBDC', lapel: '#F3EBDC', tie: '#C9963A', hat: null, glasses: true, skin: '#9A6240', hair: '#1C1513' };
  const NEIGH1 = { ...C.skeptic, name: 'n1', coat: '#8C5A3C', hat: 'fedora', hatCol: '#5E5A4E', band: '#5E5A4E', glasses: false, skin: '#EFCBA6' };
  const NEIGH2 = { ...C.dreamer, name: 'n2', coat: '#7A4E8A', sleeve: '#7A4E8A', stripes: null, hair: '#E6B82A', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const PAULA = { ...C.paul, name: 'apostle' };

  // shared set dressings
  function livingRoom(t) {   // the Fullers' living room
    room(t, [222, 200, 168], [120, 80, 52]);
    P('room_window', 700, 880, 400, { sway: 0 }); P('room_painting', 330, 740, 200, { sway: 0 }); P('room_clock', 890, 640, 110, { sway: .02 });
    P('room_lamp', 230, 1260, 380, { sway: 0 }); P('room_rug', 540, 1580, 900, { sx: 1.5, sy: .32, sway: 0 });
  }
  function office(t) {        // Jimmie's real estate office
    room(t, [196, 206, 192], [118, 94, 70]);
    P('office_glassdoor', 780, 1236, 560, { sway: 0 }); P('office_diploma', 420, 660, 170, { sway: 0 }); P('office_filecabinet', 270, 1240, 360, { sway: 0 });
    P('office_coatrack', 960, 1290, 420, { sway: 0 });
  }
  function hall(t) {          // the lecture hall: stage, curtain, rows of chairs
    room(t, [150, 70, 70], [110, 74, 50]);
    fabric('sand', [[170, 1120], [910, 1120], [930, 1250], [150, 1250]], [96, 62, 40]);   // stage front
    for (let i = 0; i < 6; i++) P('room_chair', 250 + i * 116, 1420, 170, { sway: 0, tint: [230, 222, 214] });
  }
  function homeStreet(t, o = {}) {   // a Los Angeles block: palms, bungalows, a driveway
    board('day'); P('island_sun', 870, 460, 180, { sway: .02 }); P('island_cloud', 260, 520, 230, { sway: .02 });
    street(t, o);
    at('island_palm', 60, 0, 700); at('city_apartment', 160, 0, 600); at('life_house', 545, 0, 560); at('island_palm', 860, 0, 680); at('city_rowhouses', 1010, 0, 560);
  }
  function downtownSet(t, o = {}) {
    board('day'); P('island_cloud', 760, 520, 230, { sway: .02 });
    downtown(t, o);
    at('city_skyscraper', 120, 0, 900); at('street_shopfront', 520, 0, 600); at('town_bank', 930, 0, 640);
  }

  // ---------- shots ----------
  function shHook(t, lt) {      // $54; a quarter of a million; the man who insulted him; one of his best customers
    const t0 = t - lt, wf = WT('hook', 'fifty'), wq = WT('hook', 'quarter'), wi = WT('hook', 'insulted'), wc = WT('hook', 'customers');
    camBegin(540, 960, 1.0); downtownSet(t);
    P('street_tree', 990, 1470, 600, { sway: .006 }); P('city_streetlamp', 70, 1480, 620, { sway: .003 });
    who(JIM, 330, 1, 22, { in: t0 + .05, mood: t > wq ? 'beam' : t > wf ? 'determined' : 'neutral', look: .6, key: 'jim', aR: t > wq ? .5 : -1.2 });
    if (t > wf - .2) coins(t, 620, 1180, 5, wf - .2, wq - .3);
    if (t > wq - .3 && t < wi - .2) { P('life_coinbag', 640, 1240, 300, { in: wq - .3, snd: 'pop', sway: .02 }); glow(640, 1100, 260, '#FFD27A', .5); if (t > wq) stars(640, 1050, t, wq); cue('q', wq, 'sparkle', 640, 300); }
    if (t > wi - .2) { const sh = t > wc ? 0 : 1; who(CALLER, 760, .98, 22, { in: wi - .2, mood: t > wc ? 'beam' : 'determined', look: -.8, key: 'caller', aL: t > wc ? .5 : -1.2, lean: .04 * sh }); }
    if (t > wc - .2) { glow(545, 1150, 260, '#FFD27A', .4); cue('cust', wc, 'chime', 545, 300); }
    camEnd();
  }
  function shVerse(t, lt) {     // Philippians: think on these things
    const t0 = t - lt, wr = WT('verse', 'report'), wp = WT('verse', 'praise'), wt = WT('verse', 'think');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(620, 1000, 600, '#FFD27A', .2 + .5 * ease(seg(t, wr - .2, wr + .6)));
    P('prop_scroll', 760, 1320, 300, { in: t0 + .2, snd: 'pop', sway: .02 });
    if (t > wr - .2) P('bible_star', 760, 860, 170, { in: wr - .2, snd: 'sparkle', sway: .05 });
    if (t > wp - .2) P('bible_harp', 960, 1500, 220, { in: wp - .2, snd: 'pop', sway: .02 });
    person(330, 1840, 40, PAULA, { in: stagger(t0, 1), mood: t > wt ? 'wise' : 'warm', aL: .8, look: .6, key: 'apostle' });
    camEnd();
  }
  function shMeaning(t, lt) {   // only take in the good report
    const t0 = t - lt, wg = WT('meaning', 'good');
    camBegin(540, 960, 1.0); livingRoom(t); P('home_sofa', 780, 1390, 320, { sway: 0 });
    host(t, 420, 1520, 22, { in: t0 + .02, look: .6, aR: t > wg ? .4 : -1.2 });
    if (t > wg - .2) { P('prop_envelope', 700, 1120, 200, { in: wg - .2, snd: 'pop', sway: .03 }); glow(700, 1040, 200, '#FFD27A', .5); stars(700, 1000, t, wg); }
    camEnd();
  }
  function shEra(t, lt) {       // LA early fifties; deeds: never sold to Black people; 1948 Supreme Court; still lived by them
    const t0 = t - lt, wd = WT('era', 'deeds'), wn = WT('era', 'never'), ws = WT('era', 'supreme'), we = WT('era', 'enforced'), wpl = WT('era', 'plenty');
    camBegin(540, 960, 1.0); homeStreet(t);
    at('street_picketfence', 300, .3, 220); at('street_picketfence', 790, .3, 220);
    if (t < ws - .3) {
      P('street_tree', 990, 1470, 620, { sway: .006 }); P('street_mailbox', 200, 1500, 170, { sway: 0 });
      if (t > wd - .2) { P('prop_scroll', 540, 1500, 360, { in: wd - .2, snd: 'pop', sway: .02 }); }
      if (t > wn - .1) { noSign(540, 1340, 120, t, wn - .1); cue('no', wn, 'pat', 540, 300); }
    } else if (t < wpl - .3) {
      at('town_courthouse', 545, .6, 520, { in: ws - .3, snd: 'pop', tint: null });
      if (t > we - .2) { P('prop_scroll', 300, 1500, 260, { in: ws, snd: false, rot: -.2, sway: 0 }); noSign(300, 1380, 90, t, we - .2); cue('enf', we, 'pat', 300, 200); }
    } else {
      P('street_tree', 990, 1470, 620, { sway: .006 });
      who(NEIGH1, 280, .55, 22, { in: wpl - .3, mood: 'determined', look: .5, key: 'n1', aL: -.2 });
      who(NEIGH2, 760, .5, 22, { in: wpl - .2, mood: 'neutral', look: -.6, key: 'n2' });
      P('prop_scroll', 540, 1520, 300, { in: wpl, snd: 'pop', sway: .02 });
    }
    camEnd();
  }
  function shRadio(t, lt) {     // Jimmie heard Neville on the radio; a wife, a baby, and $54
    const t0 = t - lt, wr = WT('radio', 'radio'), ww = WT('radio', 'wife'), wb = WT('radio', 'baby'), wf = WT('radio', 'fifty');
    camBegin(540, 960, 1.0); livingRoom(t);
    P('home_kitchentable', 730, 1420, 300, { sway: 0 }); P('prop_radio', 730, 1180, 170, { in: t0 + .05, snd: 'pop', sway: 0 }); waves(830, 1110, t, t0 + .3);
    if (t > wr - .3) { P('island_cloud', 700, 1060, 300, { in: wr - .4, snd: false, sway: .02 }); person(700, 1030, 6, C.neville, { in: wr - .3, mood: 'wise', key: 'nevr', snd: false }); }
    person(330, 1530, 22, JIMB, { in: t0 + .05, mood: 'neutral', look: .8, key: 'jim', aR: .2 });
    if (t > ww - .2) person(500, 1460, 19, JWIFE, { in: ww - .2, mood: 'warm', look: .6, key: 'jwife' });
    if (t > wb - .2) person(585, 1470, 8, BABY, { in: wb - .2, mood: 'happy', look: .4, key: 'baby' });
    if (t > wf - .2) coins(t, 760, 1330, 5, wf - .2, 1e9, 32);
    camEnd();
  }
  function shTickets(t, lt) {   // $2 a meeting; their last $54 went on the meetings; one night they couldn't pay the sitter
    const t0 = t - lt, wt = WT('tickets', 'two'), wl = WT('tickets', 'last'), wsi = WT('tickets', 'sitter');
    camBegin(540, 960, 1.0);
    if (t < wsi - 1.2) {
      hall(t); person(540, 1125, 15, C.neville, { in: t0 + .05, mood: 'wise', look: 0, key: 'nev', aL: .5 });
      person(330, 1560, 22, JIM, { in: t0 + .05, mood: 'happy', look: .4, key: 'jim', aR: t > wt ? .3 : -1.2 }); person(520, 1580, 19, JWIFE, { in: t0 + .1, mood: 'happy', look: .3, key: 'jwife' });
      if (t > wt - .2) { P('prop_ticket', 760, 1540, 170, { in: wt - .2, snd: 'pop', sway: .04 }); P('prop_ticket', 880, 1560, 170, { in: wt - .1, snd: false, sway: .04 }); }
      if (t > wl - .3) coins(t, 790, 1360, 10, wl - .3, wl + .3, 30);
    } else {
      livingRoom(t); P('room_door', 820, 1240, 520, { sway: 0 });
      P('extra_grandma', 820, 1560, 400, { in: wsi - 1.1, snd: 'pop', sway: .01 });
      person(360, 1540, 22, JIMB, { in: wsi - 1.1, mood: 'worried', look: .8, key: 'jim', aL: .5, aR: .5 });
      if (t > wsi) noSign(360, 1180, 70, t, wsi);
    }
    camEnd();
  }
  function shThree(t, lt) {     // three years later: I still haven't proven your theory
    const t0 = t - lt, wy = WT('three', 'years'), wp = WT('three', 'proven');
    camBegin(540, 960, 1.0); downtownSet(t); at('city_church', 545, .05, 680, { tint: null });
    P('city_streetlamp', 980, 1480, 620, { sway: .003 });
    if (t > wy - .3) tally(t, 380, 760, 3, [wy - .3, wy - .15, wy], 140);
    who(JIM, 330, 1, 22, { in: t0 + .05, mood: t > wp - .3 ? 'worried' : 'neutral', look: .8, key: 'jim', aR: .3 });
    who(C.neville, 700, .97, 22, { in: t0 + .1, mood: 'wise', look: -.8, key: 'nev' });
    camEnd();
  }
  function shChange(t, lt) {    // he stopped going to the office; let his staff tell him good news; nothing else
    const t0 = t - lt, ws = WT('change', 'stopped'), wst = WT('change', 'staff'), wg = WT('change', 'good'), wn = WT('change', 'nothing');
    camBegin(540, 960, 1.0);
    if (t < wst - .3) {
      office(t); P('office_desk', 540, 1700, 380, { sway: 0 });
      const go = ease(seg(t, ws, ws + 1.2)); person(lerp(540, 800, go), 1480 - go * 60, 22 * (1 - go * .2), JIM, { in: t0 + .05, mood: 'determined', look: go > 0 ? 1 : 0, key: 'jim' });
    } else {
      livingRoom(t); P('room_armchair', 380, 1640, 420, { sway: 0 });
      person(380, 1560, 21, JIMB, { in: wst - .3, mood: t > wg ? 'beam' : 'warm', look: .8, key: 'jim', aR: .3 });
      P('prop_telephone', 600, 1500, 140, { in: wst - .3, snd: 'pop', sway: .02 }); waves(680, 1410, t, wst);
      if (t > wst - .2) { P('island_cloud', 760, 1100, 380, { in: wst - .2, snd: false, sway: .02 }); person(700, 1110, 7, SEC, { in: wst - .1, mood: 'beam', key: 'secc', snd: false }); person(800, 1110, 7, CLERK, { in: wst, mood: 'beam', key: 'clerkc', snd: false }); }
      if (t > wg - .2) { glow(760, 1050, 260, '#FFD27A', .5); stars(760, 1020, t, wg); cue('good', wg, 'chime', 760, 300); }
      if (t > wn - .2) P('sky_raincloud', 220, 860, 160, { in: wn - .2, out: wn + .5, snd: false, sway: .03 });
    }
    camEnd();
  }
  function shCall(t, lt) {      // a man called about some property; the first thing he said...
    const t0 = t - lt, wc = WT('call', 'called'), wf = WT('call', 'first');
    camBegin(540, 960, 1.0); downtownSet(t);
    P('street_phonebooth', 700, 1500, 620, { in: t0 + .05, snd: 'pop', sway: 0 });
    person(700, 1430, 20, CALLER, { in: t0 + .05, mood: t > wf ? 'determined' : 'neutral', look: -.4, key: 'caller', aL: .6 });
    if (t > wc - .2) { waves(820, 1100, t, wc); cue('ring', wc, 'ring', 700, 200); }
    if (t > wf) P('sky_raincloud', 700, 860, 200, { in: wf, snd: false, sway: .03 });
    P('street_newsstand', 230, 1500, 380, { sway: 0 });
    camEnd();
  }
  function shReply(t, lt) {     // he acted like he never heard it: perfectly all right, sir; I have all kinds of property
    const t0 = t - lt, wp = WT('reply', 'perfectly'), wk = WT('reply', 'kinds');
    camBegin(540, 960, 1.0); office(t);
    person(540, 1500, 22, JIMB, { in: t0 + .05, mood: t > wp - .2 ? 'warm' : 'neutral', look: .2, key: 'jim', talk: t > wp - .2 ? talk(t) : null });
    P('office_desk', 540, 1720, 380, { sway: 0 }); P('prop_telephone', 700, 1450, 130, { sway: .01 });
    if (t > wk - .3) { P('island_cloud', 540, 900, 520, { in: wk - .3, snd: 'pop', sway: .02 }); P('life_house', 380, 860, 160, { in: wk - .2, snd: false, sway: .004 }); P('city_apartment', 540, 870, 200, { in: wk - .1, snd: false, sway: .004 }); P('city_brownstone', 700, 860, 180, { in: wk, snd: false, sway: .004 }); }
    camEnd();
  }
  function shBack(t, lt) {      // a week later he called back; $37,000 worth; $25,000 to buy back his face
    const t0 = t - lt, wk = WT('back', 'week'), wt = WT('back', 'thirty'), wtw = WT('back', 'twenty'), wf = WT('back', 'face');
    camBegin(540, 960, 1.0); downtownSet(t); P('street_tree', 990, 1470, 600, { sway: .006 });
    if (t > wk - .3) tally(t, 270, 700, 7, Array.from({ length: 7 }, (_, i) => wk - .3 + i * .09), 90);
    // the caller drives up, idles in front of the office, toots the horn
    const T0 = t0, stopAt = 1.8, lx = lt < stopAt ? lerp(-500, 560, easeOut(clamp(lt / stopAt))) : 560, bob = (lt < stopAt ? 5 : 2) * Math.sin(lt * (lt < stopAt ? 14 : 22)), by = 1840;
    smoke(lx - 400, by - 40, lt, 0, 20, { scale: 1.4, rate: lt < stopAt ? 9 : 4, spread: lt < stopAt ? 1 : .4 });
    person(lx - 40, by - 125 + bob, 14, CALLER, { mood: t > wf ? 'happy' : 'worried', look: .8, key: 'caller' });
    P('car_win_sedan50s', lx, by + bob, 440, { sway: 0, snd: false });
    cue('drv', T0, 'drive', 0, stopAt + .2); cue('idl', T0 + stopAt, 'idle', 560, Math.max(1, VL('back').t1 - T0 - stopAt)); cue('hk', T0 + stopAt + .3, 'honk', 900);
    who(JIM, 820, .9, 22, { in: t0 + .05, mood: t > wt ? 'beam' : 'warm', look: -.8, key: 'jim' });
    if (t > wt - .2) { P('prop_money', 330, 1300, 200, { in: wt - .2, snd: 'pop', sway: .03 }); P('prop_money', 470, 1260, 200, { in: wt - .05, snd: false, sway: .03 }); P('life_coinbag', 400, 1150, 200, { in: wt + .1, snd: false, sway: .03 }); cue('cash', wt, 'chime', 400, 300); }
    if (t > wtw - .2) glow(400, 1150, 240, '#FFD27A', .45);
    camEnd();
  }
  function shSince(t, lt) {     // tens of thousands more; calls to thank him
    const t0 = t - lt, wth = WT('since', 'thousands'), wtk = WT('since', 'thank');
    camBegin(540, 960, 1.0); downtownSet(t); P('city_streetlamp', 80, 1480, 620, { sway: .003 });
    who(CALLER, 360, 1, 22, { in: t0 + .05, mood: t > wtk ? 'beam' : 'happy', look: .8, key: 'caller', aR: .5 });
    who(JIM, 700, 1, 22, { in: t0 + .1, mood: 'beam', look: -.8, key: 'jim', aL: .5 });
    if (t > wth - .2) { P('life_coinbag', 540, 1180, 240, { in: wth - .2, snd: 'pop', sway: .03 }); P('prop_money', 400, 1120, 180, { in: wth - .1, snd: false, sway: .03 }); P('prop_money', 690, 1120, 180, { in: wth, snd: false, sway: .03 }); }
    if (t > wtk - .2) { P('prop_envelope', 540, 860, 170, { in: wtk - .2, snd: 'pop', sway: .04 }); glow(540, 800, 200, '#FFD27A', .5); stars(540, 780, t, wtk); }
    camEnd();
  }
  function shProfit(t, lt) {    // $250,000 net profit; he started without a penny
    const t0 = t - lt, wt = WT('profit', 'two'), wp = WT('profit', 'penny'), wst = WT('profit', 'started');
    camBegin(540, 960, 1.0); homeStreet(t); at('car_convertible', 640, .35, 300); at('street_picketfence', 300, .3, 220);
    P('street_tree', 990, 1470, 620, { sway: .006 });
    who(JIM, 330, 1, 22, { in: t0 + .05, mood: 'beam', look: .6, key: 'jim' }); who(JWIFE, 500, .97, 19, { in: t0 + .1, mood: 'beam', look: -.3, key: 'jwife' }); who(BABY, 580, .97, 8, { in: t0 + .15, mood: 'happy', key: 'baby' });
    if (t > wt - .2 && t < wst - .2) { P('life_coinbag', 780, 1360, 340, { in: wt - .2, snd: 'pop', sway: .02 }); glow(780, 1200, 300, '#FFD27A', .55); stars(780, 1150, t, wt); cue('prof', wt + .4, 'sparkle', 780, 400); }
    if (t > wst - .2) { coins(t, 780, 1300, 1, wst - .2, 1e9, 30); if (t > wp) glow(780, 1300, 110, '#FFD27A', .5); }
    camEnd();
  }
  function shLesson(t, lt) {    // he didn't fight the insult; didn't spend his thought on it; he invested it
    const t0 = t - lt, wi = WT('lesson', 'insult'), ws = WT('lesson', 'spend'), wv = WT('lesson', 'invested');
    camBegin(540, 960, 1.0); office(t);
    person(540, 1500, 22, JIMB, { in: t0 + .05, mood: t > wv ? 'beam' : 'wise', look: .2, key: 'jim' });
    P('office_desk', 540, 1720, 380, { sway: 0 });
    if (t > wi - .2) P('sky_raincloud', 540, 980, 260, { in: wi - .2, out: ws + .1, snd: 'pop', sway: .03 });
    if (t > wv - .2) { P('life_coinbag', 760, 1180, 220, { in: wv - .2, snd: 'pop', sway: .02 }); glow(760, 1080, 220, '#FFD27A', .5); stars(760, 1050, t, wv); }
    camEnd();
  }
  function shClose(t, lt) {     // what did someone say to you today that you keep replaying? stop spending on it; hear the good report
    const t0 = t - lt, wr = WT('close', 'replaying'), ws = WT('close', 'stop'), wg = WT('close', 'good');
    camBegin(540, 960, 1.0); board('night'); P('island_moon', 860, 470, 110, { sway: .01 }); street(t, { night: true });
    at('city_rowhouses', 200, 0, 560, { tint: [150, 150, 170] }); at('life_house', 545, 0, 560, { tint: [150, 150, 170] }); at('city_apartment', 930, 0, 600, { tint: [150, 150, 170] });
    P('city_streetlamp', 860, 1480, 640, { sway: .003 }); glow(860, 880, 220, '#FFE2A8', .4);
    host(t, 420, 1500, 22, { in: t0 + .02, look: .5, mood: t > wg ? 'beam' : 'warm' });
    if (t > wr - .3) P('sky_raincloud', 640, 960, 230, { in: wr - .3, out: ws, snd: 'pop', sway: .03 });
    if (t > wg - .2) { P('prop_envelope', 640, 1060, 190, { in: wg - .2, snd: 'pop', sway: .04 }); glow(640, 990, 200, '#FFD27A', .55); stars(640, 960, t, wg); }
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: the phone tracks your state; dip on "spending"; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'spending'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wt - .2) { glow(700, 900, 460, '#FFD27A', ease(seg(t, wt - .2, wt + .5)) * (t > wg - .3 ? .5 : 1)); P('bible_temple', 700, 1160, 480, { in: wt - .2, snd: 'chime', sway: .006, out: wg - .3 }); }
    if (t > wg - .3) { P('sky_hill', 760, 1500, 520, { in: wg - .3, sway: 0 }); const up = ease(seg(t, we - .2, we + .8)); P('bible_star', 760, lerp(1180, 930, up), 170, { in: wg, sway: .05, snd: 'sparkle' }); }
    if (t > wmf - .1) { stars(760, 900, t, wmf); cue('mf', wmf, 'sparkle', 760, 400); }
    const dip = t > wsl - .2 ? Math.sin(Math.PI * seg(t, wsl - .2, wsl + .7)) : 0;
    host(t, 300, 1820, 36, { in: t0 + .1, aL: t > wt - .3 && t < wtr ? .35 : -1.2, aR: t > wtr - .2 ? .25 : -1.2, look: t > wt ? .5 : 0, dy: .5 * dip, lean: -.06 * dip, mood: dip > .3 ? 'worried' : 'warm',
      holdR: t > wtr - .2 ? (x, y, u) => phone(x, y + u * 1.2, u * 1.25, t, clamp((t - wtr + .2) / .3)) : null });
    if (t > wtr - .2) cue('phone', wtr - .1, 'pat', 300, 200);
    camEnd();
  }
  function shComment(t, lt, dur) {
    const t0 = t - lt, wc = WT('comment', 'comment'), wt = WT('comment', 'temple');
    camBegin(540, 1000, 1.0); board('plum');
    glow(560, 1000, 560, '#FFD27A', ease(seg(t, wt - .2, wt + .5)));
    if (t > wt - .2) P('bible_temple', 560, 1240, 600, { in: wt - .2, snd: 'chime', sway: .006 });
    host(t, 540, 1830, 40, { in: t0 + .02, aR: t > wc ? .5 : -1.2, mood: 'warm', look: 0 });
    camEnd();
    if (t > DUR - .9) { const kk = seg(t, DUR - .9, DUR - .1); iris(560, 1000, lerp(1300, 0, easeIn(kk)), PAL.ink); }
  }

  shots([
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('era') - .12, shEra], [S('radio') - .12, shRadio], [S('tickets') - .12, shTickets],
    [S('three') - .12, shThree], [S('change') - .12, shChange], [S('call') - .12, shCall], [S('reply') - .12, shReply], [S('back') - .12, shBack], [S('since') - .12, shSince],
    [S('profit') - .12, shProfit], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
