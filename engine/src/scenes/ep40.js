window.CHEAP = true; window.FELT = true;
// Episode 40, felt sets cut: "I Will Hear It For You" (Chicago businessman, $250,000 needed, $350,000 raised; Neville lecture, via freeneville.substack.com).
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

  // ---------- cast ----------
  const BIZ = { ...C.blake, name: 'biz', coat: '#3A4A6B', sleeve: '#3A4A6B', lapel: '#F3EBDC', pants: '#2E3A52', hat: 'fedora', hatCol: '#2B2A33', band: '#8C3B3B', hair: '#5A3A24', skin: '#EFCBA6' };
  const BIZB = { ...BIZ, name: 'bizb', hat: null };
  const BROKER = { ...C.skeptic, name: 'broker', coat: '#5C4A36', sleeve: '#5C4A36', lapel: '#D9D4C8', tie: '#B8463A', glasses: true, hat: 'fedora', hatCol: '#3A2E24', band: '#3A2E24', skin: '#E6B48C', hair: '#3B2A22' };
  const FR1 = { ...C.blake, name: 'fr1', coat: '#8C5A3C', sleeve: '#8C5A3C', lapel: '#F3EBDC', pants: '#3A3A44', hat: null, hair: '#2B1E19', skin: '#9A6240' };
  const FR2 = { ...C.dreamer, name: 'fr2', coat: '#3F8F8A', sleeve: '#3F8F8A', stripes: null, hair: '#B5643A', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const PROPHET = { ...C.paul, name: 'isaiah', coat: '#3F6FB0', sleeve: '#3F6FB0', pants: '#3F6FB0', sash: '#E6B82A', hair: '#ECE8DF', beard: .6, beardCol: '#ECE8DF' };
  const NEV = C.neville, NEVB = { ...C.neville, name: 'nevb', hat: null };

  function livingRoom(t, night) {
    room(t, night ? [150, 140, 150] : [222, 200, 168], night ? [90, 64, 46] : [120, 80, 52]);
    P('room_window', 700, 880, 400, { sway: 0, tint: night ? [120, 120, 160] : null }); P('room_painting', 330, 740, 200, { sway: 0 }); P('room_clock', 890, 640, 110, { sway: .02 });
    P('room_lamp', 230, 1260, 380, { sway: 0 }); P('room_rug', 540, 1580, 900, { sx: 1.5, sy: .32, sway: 0 });
  }
  function office(t) {
    room(t, [196, 206, 192], [118, 94, 70]);
    P('office_glassdoor', 780, 1236, 560, { sway: 0 }); P('office_diploma', 420, 660, 170, { sway: 0 }); P('office_filecabinet', 270, 1240, 360, { sway: 0 }); P('office_coatrack', 960, 1290, 420, { sway: 0 });
  }
  function hall(t) {
    room(t, [150, 70, 70], [110, 74, 50]);
    fabric('sand', [[170, 1120], [910, 1120], [930, 1250], [150, 1250]], [96, 62, 40]);
    for (let i = 0; i < 6; i++) P('room_chair', 250 + i * 116, 1420, 170, { sway: 0, tint: [230, 222, 214] });
  }
  function chicago(t, o = {}) {   // downtown Chicago: towers, a factory, a bank
    board(o.night ? 'night' : 'day'); if (!o.night) P('island_cloud', 760, 520, 230, { sway: .02 });
    street(t, { lawn: [188, 180, 170], drive: false, night: o.night });
    const tn = o.night ? [150, 150, 170] : undefined;
    at('city_skyscraper', 110, 0, 950, { tint: tn }); at('city_factory', 520, 0, 560, { tint: tn }); at('town_bank', 940, 0, 640, { tint: tn });
  }
  // a falling felt stock line
  function chart(x, y, w, h, t, t0) {
    if (t < t0 || window.CUEMODE) return; const k = ease(seg(t, t0, t0 + 1.2)); flushBrush();
    push(); noStroke(); fill(30, 18, 12, 60); rect(x - w / 2 + 8, y - h + 8, w, h, 18); fill(246, 240, 226); rect(x - w / 2, y - h, w, h, 18);
    noFill(); stroke(200, 58, 48); strokeWeight(12); beginShape();
    const n = 9; for (let i = 0; i <= Math.round(n * k); i++) vertex(x - w / 2 + 40 + i * (w - 80) / n, y - h + 50 + (i / n) * (h - 100) + (i % 2 ? -26 : 14)); endShape(); pop();
  }
  const deskPhone = (t, x, y, s, tr) => { P('prop_telephone', x, y, 130 * s, { sway: .01, rot: tr != null && t > tr && t < tr + .9 ? .06 * Math.sin(t * 40) : 0 }); };

  // ---------- shots ----------
  function shHook(t, lt) {      // needed a quarter of a million in the worst market; turned down; one call; raised 350k
    const t0 = t - lt, wq = WT('hook', 'quarter'), ww = WT('hook', 'worst'), wt = WT('hook', 'turned'), wp = WT('hook', 'phone'), wr = WT('hook', 'raised');
    camBegin(540, 960, 1.0); chicago(t); P('city_streetlamp', 70, 1480, 620, { sway: .003 }); P('street_newsstand', 930, 1500, 360, { sway: 0 });
    who(BIZ, 400, 1, 22, { in: t0 + .05, mood: t > wr ? 'beam' : t > ww ? 'worried' : 'determined', look: .6, key: 'biz', aR: t > wr ? .5 : -1.2 });
    if (t > wq - .2 && t < wt) P('life_coinbag', 660, 1180, 220, { in: wq - .2, snd: 'pop', sway: .02, out: wt - .3 });
    if (t > ww - .2 && t < wr - .3) P('sky_raincloud', 400, 860, 220, { in: ww - .2, out: wr - .4, snd: 'pop', sway: .03 });
    if (t > wt - .2 && t < wp - .2) { noSign(660, 1060, 110, t, wt - .2); cue('no', wt, 'pat', 660, 300); }
    if (t > wp - .3) { deskPhone(t, 660, 1180, 1.3, wp - .3); waves(760, 1080, t, wp); cue('ring', wp - .1, 'ring', 660, 200); }
    if (t > wr - .2) { P('life_coinbag', 660, 1000, 320, { in: wr - .2, snd: 'pop', sway: .02 }); glow(660, 900, 300, '#FFD27A', .55); stars(660, 860, t, wr); cue('cash', wr + .3, 'cash', 660, 300); }
    camEnd();
  }
  function shVerse(t, lt) {     // Isaiah 65:24: before they call, I will answer; while they are yet speaking, I will hear
    const t0 = t - lt, wa = WT('verse', 'answer'), wh = WT('verse', 'hear');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(620, 1000, 600, '#FFD27A', .2 + .5 * ease(seg(t, wa - .2, wa + .6)));
    P('prop_scroll', 760, 1320, 300, { in: t0 + .2, snd: 'pop', sway: .02 });
    if (t > wa - .2) P('bible_star', 760, 860, 170, { in: wa - .2, snd: 'sparkle', sway: .05 });
    if (t > wh - .2) waves(860, 1050, t, wh - .2, 1.3);
    person(330, 1840, 40, PROPHET, { in: stagger(t0, 1), mood: t > wa ? 'wise' : 'warm', aL: .8, look: .6, key: 'isaiah' });
    camEnd();
  }
  function shMeaning(t, lt) {   // the answer comes first; you just have to hear it
    const t0 = t - lt, wa = WT('meaning', 'answer'), wh = WT('meaning', 'hear');
    camBegin(540, 960, 1.0); livingRoom(t); P('home_sofa', 800, 1390, 300, { sway: 0 });
    host(t, 420, 1520, 22, { in: t0 + .02, look: .6 });
    if (t > wa - .2) { P('home_kitchentable', 730, 1560, 260, { in: wa - .2, snd: 'pop', sway: 0 }); deskPhone(t, 730, 1350, 1.1); glow(730, 1280, 200, '#FFD27A', .5); }
    if (t > wh - .2) { waves(820, 1250, t, wh - .2); stars(730, 1200, t, wh); }
    camEnd();
  }
  function shStart(t, lt) {     // a business in Chicago in March; special technical instruments; needed $250,000
    const t0 = t - lt, wc = WT('start', 'chicago'), wi = WT('start', 'instruments'), wn = WT('start', 'needed');
    camBegin(540, 960, 1.0); chicago(t); P('street_tree', 990, 1470, 600, { sway: .006 });
    who(BIZ, 380, 1, 22, { in: t0 + .05, mood: 'determined', look: .6, key: 'biz', aR: t > wi ? .3 : -1.2 });
    if (t > wi - .2) { P('prop_radio', 640, 1300, 170, { in: wi - .2, snd: 'pop', sway: .02 }); P('room_clock', 760, 1260, 120, { in: wi - .05, snd: false, sway: .02 }); }
    if (t > wn - .2) { P('life_coinbag', 660, 1060, 260, { in: wn - .2, snd: 'pop', sway: .02 }); glow(660, 960, 220, '#FFD27A', .35); }
    camEnd();
  }
  function shMarket(t, lt) {    // market at its lowest; stocks dropping ten and fifteen points a day; nobody had money
    const t0 = t - lt, ws = WT('market', 'stocks'), wn = WT('market', 'nobody');
    camBegin(540, 960, 1.0); chicago(t); P('street_newsstand', 250, 1500, 380, { in: t0 + .05, snd: 'pop', sway: 0 }); P('city_streetlamp', 980, 1480, 620, { sway: .003 });
    who(BIZ, 560, 1, 22, { in: t0 + .1, mood: t > ws ? 'worried' : 'neutral', look: -.6, key: 'biz' });
    chart(700, 1100, 420, 300, t, ws - .3); if (t > ws) cue('chart', ws, 'whoosh', 700, 300);
    if (t > wn - .2) { P('prop_money', 330, 1080, 170, { in: wn - .2, snd: 'pop', sway: .03 }); noSign(330, 1010, 100, t, wn); }
    camEnd();
  }
  function shMonths(t, lt) {    // March went by; April went by; everyone turned him down
    const t0 = t - lt, wm = WT('months', 'march'), wa = WT('months', 'april'), we = WT('months', 'everyone');
    camBegin(540, 960, 1.0); office(t);
    person(540, 1500, 22, BIZB, { in: t0 + .05, mood: t > we ? 'sad' : 'worried', look: .2, key: 'biz' });
    P('office_desk', 540, 1720, 380, { sway: 0 }); deskPhone(t, 700, 1450, 1);
    tally(t, 420, 760, 2, [wm, wa], 240);
    if (t > we - .2) { P('extra_businessman', 850, 1560, 360, { in: we - .2, out: we + .9, snd: 'pop', sway: .01 }); P('extra_businessman', 200, 1560, 340, { in: we - .05, out: we + 1.1, snd: false, sway: .01 }); }
    camEnd();
  }
  function shCall(t, lt) {      // in May he called Neville: too close to it; papers, brokers, friends; couldn't stop believing it
    const t0 = t - lt, wc = WT('call', 'called'), wp = WT('call', 'papers'), wb = WT('call', 'brokers'), wf = WT('call', 'friends'), ws = WT('call', 'stop');
    camBegin(540, 960, 1.0); office(t);
    person(540, 1500, 22, BIZB, { in: t0 + .05, mood: t > wp ? 'worried' : 'neutral', look: .2, key: 'biz', aR: .4 });
    P('office_desk', 540, 1720, 380, { sway: 0 }); deskPhone(t, 700, 1450, 1, wc - .2); if (t > wc) { waves(800, 1370, t, wc); cue('ring', wc - .2, 'ring', 700, 200); }
    if (t > wp - .2) P('sky_raincloud', 330, 820, 170, { in: wp - .2, snd: 'pop', sway: .03 });
    if (t > wb - .2) P('sky_raincloud', 560, 760, 190, { in: wb - .2, snd: false, sway: .03 });
    if (t > wf - .2) P('sky_raincloud', 790, 820, 170, { in: wf - .2, snd: false, sway: .03 });
    if (t > ws) glow(540, 1200, 200, '#4A4A66', .25);
    camEnd();
  }
  function shHear(t, lt) {      // Neville: all right; I will hear it for you
    const t0 = t - lt, wh = WT('hear', 'hear');
    camBegin(540, 960, 1.0); livingRoom(t); P('room_armchair', 400, 1640, 420, { sway: 0 });
    person(400, 1560, 21, NEVB, { in: t0 + .05, mood: t > wh ? 'wise' : 'warm', look: .8, key: 'nev', aR: .3 });
    P('home_kitchentable', 690, 1610, 300, { sway: 0 }); deskPhone(t, 690, 1400, 1.6);
    if (t > wh - .2) { waves(780, 1330, t, wh - .2); glow(680, 1330, 220, '#FFD27A', .5); cue('hear', wh, 'chime', 680, 300); }
    camEnd();
  }
  function shReverse(t, lt) {   // he hung up but didn't leave the phone; turned the call around; the man calling back: he has the money
    const t0 = t - lt, wt = WT('reverse', 'turned'), wc = WT('reverse', 'calling'), wd = WT('reverse', 'dollars');
    camBegin(540, 960, 1.0); livingRoom(t, true); P('room_armchair', 400, 1640, 420, { sway: 0 });
    person(400, 1560, 21, NEVB, { in: t0 + .05, mood: t > wd ? 'beam' : 'wise', look: .8, key: 'nev' });
    P('home_kitchentable', 690, 1610, 300, { sway: 0 }); deskPhone(t, 690, 1400, 1.6, wc - .2);
    if (t > wt - .3) { P('island_cloud', 640, 1000, 460, { in: wt - .3, snd: 'pop', sway: .02 }); person(600, 1030, 8, BIZB, { in: wt - .2, mood: t > wd ? 'beam' : 'happy', key: 'bizc', snd: false, aR: .5 }); }
    if (t > wc) { waves(780, 1330, t, wc); cue('ring', wc - .2, 'ring', 680, 200); }
    if (t > wd - .2) { P('life_coinbag', 730, 1000, 120, { in: wd - .2, snd: 'pop', sway: .02 }); glow(660, 960, 260, '#FFD27A', .5); }
    camEnd();
  }
  function shStayed(t, lt) {    // he stayed there until he was convinced it had already happened
    const t0 = t - lt, wc = WT('stayed', 'convinced');
    camBegin(540, 960, 1.0); livingRoom(t, true); P('room_armchair', 400, 1640, 420, { sway: 0 });
    glow(500, 1300, 320, '#FFD27A', .2 + .45 * ease(seg(t, t0, wc + .4)));
    person(400, 1560, 21, NEVB, { mood: t > wc ? 'beam' : 'wise', look: .8, key: 'nev' });
    P('home_kitchentable', 690, 1610, 300, { sway: 0 }); deskPhone(t, 690, 1400, 1.6);
    if (t > wc) { stars(540, 1150, t, wc); cue('conv', wc, 'sparkle', 540, 300); }
    camEnd();
  }
  function shBroker(t, lt) {    // out of the blue a broker called; looked into it; offered to underwrite it for $250,000
    const t0 = t - lt, wb = WT('broker', 'broker'), wu = WT('broker', 'underwrite');
    camBegin(540, 960, 1.0); office(t);
    person(430, 1500, 22, BIZB, { in: t0 + .05, mood: t > wu ? 'beam' : t > wb ? 'surprised' : 'worried', look: .5, key: 'biz' });
    if (t > wb - .3) { const k = ease(seg(t, wb - .3, wb + .9)); person(lerp(820, 700, k), 1470, 21, BROKER, { in: wb - .3, mood: 'warm', look: -.8, key: 'broker', aL: t > wu ? .4 : -1.2 }); }
    P('office_desk', 430, 1720, 380, { sway: 0 }); deskPhone(t, 300, 1450, 1, t0);
    if (t > wu - .2) { P('prop_money', 560, 1250, 200, { in: wu - .2, snd: 'pop', sway: .03 }); P('life_coinbag', 600, 1120, 200, { in: wu, snd: false, sway: .02 }); glow(580, 1150, 240, '#FFD27A', .5); cue('cash', wu + .2, 'cash', 580, 300); }
    camEnd();
  }
  function shFriends(t, lt) {   // his friends called: a hundred thousand dollars of shares
    const t0 = t - lt, wf = WT('friends', 'friends'), wh = WT('friends', 'hundred');
    camBegin(540, 960, 1.0); chicago(t); P('street_tree', 990, 1470, 600, { sway: .006 });
    who(BIZ, 300, 1, 22, { in: t0 + .05, mood: 'beam', look: .6, key: 'biz' });
    if (t > wf - .3) { who(FR1, 560, .98, 22, { in: wf - .3, mood: 'happy', look: -.6, key: 'fr1', aR: .4 }); who(FR2, 760, .96, 19, { in: wf - .15, mood: 'happy', look: -.6, key: 'fr2' }); }
    if (t > wh - .2) { P('prop_money', 560, 1050, 180, { in: wh - .2, snd: 'pop', sway: .03 }); P('prop_money', 760, 1080, 170, { in: wh, snd: false, sway: .03 }); cue('cash', wh + .2, 'cash', 660, 300); }
    camEnd();
  }
  function shTotal(t, lt) {     // needed 250, raised 350; sat in Neville's audience with a letter listing every fact
    const t0 = t - lt, wn = WT('total', 'needed'), wr = WT('total', 'raised'), wa = WT('total', 'audience'), wl = WT('total', 'letter');
    camBegin(540, 960, 1.0);
    if (t < wa - .4) {
      chicago(t); who(BIZ, 400, 1, 22, { in: t0 + .05, mood: t > wr ? 'joy' : 'happy', look: .6, key: 'biz', aL: t > wr ? .7 : -1.2, aR: t > wr ? .7 : -1.2 });
      if (t > wn - .2) P('life_coinbag', 640, 1200, 200, { in: wn - .2, snd: 'pop', sway: .02 });
      if (t > wr - .2) { P('life_coinbag', 760, 1240, 260, { in: wr - .2, snd: 'pop', sway: .02 }); glow(700, 1100, 300, '#FFD27A', .55); stars(700, 1050, t, wr); cue('raise', wr, 'sparkle', 700, 400); }
    } else {
      hall(t); person(540, 1125, 15, NEV, { in: wa - .4, mood: 'wise', look: 0, key: 'nev', aL: .5 });
      person(400, 1560, 22, BIZ, { in: wa - .3, mood: 'beam', look: .4, key: 'biz', aR: .4 });
      if (t > wl - .2) { P('prop_envelope', 620, 1420, 170, { in: wl - .2, snd: 'pop', sway: .03 }); glow(620, 1360, 160, '#FFD27A', .45); }
    }
    camEnd();
  }
  function shLesson(t, lt) {    // he couldn't hear the good news himself; so someone heard it for him
    const t0 = t - lt, wc = WT('lesson', 'couldnt'), ws = WT('lesson', 'someone');
    camBegin(540, 960, 1.0); office(t);
    person(540, 1500, 22, BIZB, { in: t0 + .05, mood: t > ws + .6 ? 'beam' : 'worried', look: .2, key: 'biz' });
    P('office_desk', 540, 1720, 380, { sway: 0 }); deskPhone(t, 700, 1450, 1);
    if (t > ws - .3) { P('island_cloud', 540, 980, 440, { in: ws - .3, snd: 'pop', sway: .02 }); person(500, 1010, 8, NEVB, { in: ws - .2, mood: 'wise', key: 'nevc', snd: false }); P('prop_telephone', 610, 1000, 60, { in: ws - .1, snd: false, sway: .02 }); glow(540, 950, 240, '#FFD27A', .45); }
    camEnd();
  }
  function shClose(t, lt) {     // who needs good news? tonight, hear their call, already answered
    const t0 = t - lt, wn = WT('close', 'needs'), wh = WT('close', 'hear'), wa = WT('close', 'answered');
    camBegin(540, 960, 1.0); board('night'); P('island_moon', 860, 470, 110, { sway: .01 }); street(t, { night: true });
    at('city_rowhouses', 200, 0, 560, { tint: [150, 150, 170] }); at('life_house', 545, 0, 560, { tint: [150, 150, 170] }); at('city_apartment', 930, 0, 600, { tint: [150, 150, 170] });
    P('city_streetlamp', 860, 1480, 640, { sway: .003 }); glow(860, 880, 220, '#FFE2A8', .4);
    host(t, 420, 1500, 22, { in: t0 + .02, look: .5, mood: t > wa ? 'beam' : 'warm' });
    if (t > wn - .3) P('island_cloud', 640, 1000, 300, { in: wn - .3, snd: 'pop', sway: .02 });
    if (t > wh - .2) { P('prop_telephone', 640, 990, 110, { in: wh - .2, snd: false, sway: .02 }); waves(720, 930, t, wh); }
    if (t > wa - .2) { glow(640, 940, 220, '#FFD27A', .55); stars(640, 920, t, wa); cue('ans', wa, 'chime', 640, 300); }
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: the phone tracks your state; dip on "spending"; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'hearing'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('start') - .12, shStart], [S('market') - .12, shMarket], [S('months') - .12, shMonths],
    [S('call') - .12, shCall], [S('hear') - .12, shHear], [S('reverse') - .12, shReverse], [S('stayed') - .12, shStayed], [S('broker') - .12, shBroker], [S('friends') - .12, shFriends],
    [S('total') - .12, shTotal], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
