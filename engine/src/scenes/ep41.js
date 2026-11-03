window.CHEAP = true; window.FELT = true;
// Episode 41, felt sets cut: "Dee Dee" (U.K. and her granddaughter Kim; The Law and the Promise, ch 10 "Things Which Do Not Appear").
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
  const GRAN = { ...C.dreamer, name: 'gran', coat: '#7A4E8A', sleeve: '#7A4E8A', stripes: null, hair: '#ECE8DF', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.8 };
  const KIM = { ...C.dreamer, name: 'kim', coat: '#E6B82A', sleeve: '#E6B82A', stripes: null, pants: '#D9714E', hair: '#B5643A', skin: '#EFCBA6' };
  const MOM = { ...C.dreamer, name: 'mom', coat: '#3F8F8A', sleeve: '#3F8F8A', stripes: null, hair: '#5A3A24', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const DAD = { ...C.blake, name: 'dad', coat: '#3F6FB0', sleeve: '#3F6FB0', lapel: '#F3EBDC', pants: '#2E3A52', hat: null, hair: '#3B2A22', skin: '#EFCBA6' };
  const BABY = { ...C.dreamer, name: 'baby', coat: '#F3EBDC', sleeve: '#F3EBDC', stripes: null, pants: '#F3EBDC', hair: '#B5643A', skin: '#EFCBA6' };
  const PAULA = { ...C.paul, name: 'apostle' };
  function granRoom(t, night) {   // the grandmother's sitting room: soft lilac walls, her armchair
    room(t, night ? [150, 136, 160] : [214, 196, 214], night ? [90, 64, 46] : [128, 90, 64]);
    P('room_window', 700, 880, 380, { sway: 0, tint: night ? [120, 120, 160] : null }); P('room_painting', 330, 740, 200, { sway: 0 }); P('room_clock', 890, 640, 110, { sway: .02 });
    P('room_bookshelf', 880, 1250, 420, { sway: 0 }); P('room_rug', 540, 1580, 900, { sx: 1.5, sy: .32, sway: 0 }); P('room_lamp', 200, 1260, 360, { sway: 0 });
  }
  function kimRoom(t) {           // Kim's family living room: warm yellow, the phone on a little table
    room(t, [236, 214, 160], [140, 96, 60]);
    P('room_window', 330, 880, 360, { sway: 0 }); P('room_painting', 720, 720, 200, { sway: 0 }); P('room_clock', 880, 600, 110, { sway: .02 });
    P('home_sofa', 760, 1380, 320, { sway: 0 }); P('room_rug', 540, 1600, 880, { sx: 1.5, sy: .32, sway: 0 });
  }
  const phoneTable = (t, x, tr) => { P('home_kitchentable', x, 1560, 220, { sway: 0 }); P('prop_telephone', x, 1400, 110, { sway: .01, rot: tr != null && t > tr && t < tr + .9 ? .06 * Math.sin(t * 40) : 0 }); };
  // the grandmother in her armchair, Kim sitting on her lap (in imagination); ku = Kim's size
  function lap(t, mood, kmood, ku = 8, o = {}) {
    P('room_armchair', 470, 1660, 440, { sway: 0 });
    person(470, 1580, 21, GRAN, { mood, look: .4, key: 'gran', aR: .2, aL: .2, talk: o.talk });
    person(540, 1470, ku, KIM, { mood: kmood, look: -.6, key: 'kimlap', snd: false, talk: o.ktalk });
  }

  // ---------- shots ----------
  function shHook(t, lt) {      // hadn't seen her in a year; not even a picture; every day the little girl talked about her
    const t0 = t - lt, wp = WT('hook', 'picture'), wt = WT('hook', 'talked'), wh = WT('hook', 'hour');
    camBegin(560, 1220, 1.35); kimRoom(t); phoneTable(t, 760);
    person(500, 1580, 12, KIM, { in: t0 + .05, mood: t > wt ? 'beam' : 'happy', look: .4, key: 'kim', aR: t > wt ? .5 : -1.2 });
    if (t > wp - .2 && t < wt - .2) noSign(720, 640, 120, t, wp - .2);
    if (t > wt - .2) { P('island_cloud', 480, 1120, 300, { in: wt - .2, snd: 'pop', sway: .02 }); person(480, 1140, 7, GRAN, { in: wt - .1, mood: 'beam', key: 'granc', snd: false }); waves(600, 1440, t, wt); }
    if (t > wh - .2) { glow(880, 600, 120, '#FFD27A', .5); cue('hr', wh, 'ticks', 880, 1.2); }
    camEnd();
  }
  function shVerse(t, lt) {     // Hebrews 11:3: things which are seen were not made of things which do appear
    const t0 = t - lt, wf = WT('verse', 'framed'), ws = WT('verse', 'seen'), wa = WT('verse', 'appear');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(620, 1000, 600, '#FFD27A', .2 + .5 * ease(seg(t, wf - .2, wf + .6)));
    P('prop_scroll', 760, 1320, 300, { in: t0 + .2, snd: 'pop', sway: .02 });
    if (t > wf - .2) P('bible_star', 760, 860, 170, { in: wf - .2, snd: 'sparkle', sway: .05 });
    if (t > ws - .2) P('island_cloud', 860, 1120, 220, { in: ws - .2, snd: false, sway: .02 });
    person(330, 1840, 40, PAULA, { in: stagger(t0, 1), mood: t > wa ? 'wise' : 'warm', aL: .8, look: .6, key: 'apostle' });
    camEnd();
  }
  function shMeaning(t, lt) {   // what you see started where nobody could see it
    const t0 = t - lt, ws = WT('meaning', 'started'), wn = WT('meaning', 'nobody');
    camBegin(540, 960, 1.0); granRoom(t);
    host(t, 380, 1540, 22, { in: t0 + .02, look: .6 });
    if (t > ws - .3) { P('island_cloud', 700, 1060, 360, { in: ws - .3, snd: 'pop', sway: .02 }); P('life_flowers', 700, 1060, 120, { in: ws - .1, snd: false, sway: .02 }); }
    if (t > wn - .2) { P('life_flowers', 700, 1560, 200, { in: wn + .3, snd: 'pop', sway: .02 }); glow(700, 1000, 220, '#FFD27A', .45); }
    camEnd();
  }
  function shBorn(t, lt) {      // when Kim was born, her grandmother took care of her for one month
    const t0 = t - lt, wb = WT('born', 'born'), wm = WT('born', 'month');
    camBegin(560, 1220, 1.35); kimRoom(t);
    P('room_bed', 760, 1560, 300, { sway: 0, tint: [250, 236, 240] });
    person(440, 1560, 21, GRAN, { in: t0 + .05, mood: 'beam', look: .6, key: 'gran', aR: .3 });
    if (t > wb - .2) { person(560, 1420, 6, BABY, { in: wb - .2, mood: 'sleepy', key: 'baby', snd: 'pop' }); glow(560, 1380, 150, '#FFD27A', .45); }
    if (t > wm - .3) tally(t, 270, 760, 4, [wm - .3, wm - .2, wm - .1, wm], 180);
    camEnd();
  }
  function shGap(t, lt) {       // then not again for more than a year; and only for two weeks
    const t0 = t - lt, wy = WT('gap', 'year'), ww = WT('gap', 'weeks');
    camBegin(540, 960, 1.0); granRoom(t);
    person(440, 1560, 21, GRAN, { in: t0 + .05, mood: t > ww ? 'warm' : 'sad', look: .6, key: 'gran' });
    if (t > wy - .4) tally(t, 150, 700, 12, Array.from({ length: 12 }, (_, i) => wy - .4 + i * .06), 70);
    if (t > ww - .3) { P('prop_suitcase', 700, 1580, 220, { in: ww - .3, snd: 'pop', sway: .01 }); tally(t, 420, 880, 2, [ww - .1, ww + .05], 240); }
    camEnd();
  }
  function shLap(t, lt) {       // every day, in imagination, she took Kim on her lap; cuddled her, talked to her
    const t0 = t - lt, wi = WT('lap', 'imagination'), wl = WT('lap', 'lap'), wc = WT('lap', 'cuddled');
    camBegin(540, 960, 1.0); granRoom(t);
    glow(500, 1350, 380, '#FFD27A', .25 + .3 * ease(seg(t, wi, wl + .5)));
    if (t < wl - .2) { P('room_armchair', 470, 1660, 440, { sway: 0 }); person(470, 1580, 21, GRAN, { in: t0 + .05, mood: 'warm', look: .4, key: 'gran' }); if (t > wi - .3) P('island_cloud', 700, 900, 300, { in: wi - .3, snd: 'pop', sway: .02 }); }
    else { lap(t, t > wc ? 'beam' : 'warm', 'happy'); cue('lap', wl, 'chime', 540, 300); if (t > wc) stars(510, 1250, t, wc); }
    camEnd();
  }
  function shWords(t, lt) {     // God is growing through me; God is loving through me
    const t0 = t - lt, wg = WT('words', 'growing'), wl = WT('words', 'loving');
    camBegin(540, 960, 1.0); granRoom(t); glow(500, 1350, 380, '#FFD27A', .45);
    lap(t, 'warm', 'happy', 8, { talk: talk(t) });
    if (t > wg - .2) P('life_flowers', 780, 1300, 180, { in: wg - .2, snd: 'pop', sway: .02 });
    if (t > wl - .2) { stars(510, 1200, t, wl); cue('love', wl, 'sparkle', 510, 300); }
    camEnd();
  }
  function shMe(t, lt) {        // at first Kim would only answer "me"; now she finishes the whole sentence
    const t0 = t - lt, wm = WT('me', 'me'), ww = WT('me', 'whole');
    camBegin(540, 960, 1.0); granRoom(t); glow(500, 1350, 380, '#FFD27A', .45);
    lap(t, t > ww ? 'beam' : 'warm', t > ww ? 'beam' : 'happy', 8, { ktalk: t > wm - .1 && t < wm + .4 || t > ww - .3 ? talk(t) : null });
    if (t > ww - .2) { stars(540, 1300, t, ww); cue('whole', ww, 'chime', 540, 300); }
    camEnd();
  }
  function shHeavier(t, lt) {   // month after month the Kim on her lap got bigger and heavier
    const t0 = t - lt, wb = WT('heavier', 'bigger'), wh = WT('heavier', 'heavier');
    camBegin(540, 960, 1.0); granRoom(t); glow(500, 1350, 380, '#FFD27A', .4);
    tally(t, 220, 700, 6, Array.from({ length: 6 }, (_, i) => t0 + .2 + i * .25), 128);
    const g = ease(seg(t, t0 + .2, wh + .6));
    lap(t, 'beam', 'happy', lerp(7, 10.5, g));
    if (t > wh) cue('hv', wh, 'pat', 540, 300);
    camEnd();
  }
  function shPicture(t, lt) {   // in real life, no visit, no picture; at most a name
    const t0 = t - lt, wp = WT('picture', 'picture'), wn = WT('picture', 'name');
    camBegin(560, 1220, 1.35); kimRoom(t); phoneTable(t, 760);
    person(500, 1580, 12, KIM, { in: t0 + .05, mood: 'neutral', look: .4, key: 'kim' });
    if (t > wp - .2) noSign(720, 640, 120, t, wp - .2);
    if (t > wn - .2) { P('prop_envelope', 330, 1260, 170, { in: wn - .2, snd: 'pop', sway: .03 }); }
    camEnd();
  }
  function shTalk(t, lt) {      // every day she starts talking about her, to no one in particular; sometimes for an hour
    const t0 = t - lt, wt = WT('talk', 'talking'), wh = WT('talk', 'hour');
    camBegin(560, 1220, 1.35); kimRoom(t);
    if (t > t0 + .3) { person(720, 1420, 17, MOM, { in: t0 + .3, mood: 'surprised', look: -.8, key: 'mom' }); person(820, 1430, 18, DAD, { in: t0 + .4, mood: 'surprised', look: -.8, key: 'dad' }); }
    person(480, 1580, 12, KIM, { in: t0 + .05, mood: 'beam', look: .2, key: 'kim', aL: .4, aR: .4 });
    if (t > wt - .2) { waves(560, 1460, t, wt); P('island_cloud', 460, 1160, 280, { in: wt - .2, snd: 'pop', sway: .02 }); person(460, 1180, 7, GRAN, { in: wt - .1, mood: 'beam', key: 'granc', snd: false }); }
    if (t > wh - .2) { glow(880, 600, 120, '#FFD27A', .5); cue('hr', wh, 'ticks', 880, 1.2); }
    camEnd();
  }
  function shPhone(t, lt) {     // or she goes to the phone and pretends to call her
    const t0 = t - lt, wp = WT('phone', 'phone'), wc = WT('phone', 'call');
    camBegin(560, 1220, 1.35); kimRoom(t);
    const go = ease(seg(t, wp - .4, wp + .5)); phoneTable(t, 720, wc);
    person(lerp(420, 620, go), 1580, 12, KIM, { in: t0 + .05, mood: 'beam', look: .6, key: 'kim', aR: t > wc ? .6 : -1.2 });
    if (t > wc) { waves(800, 1330, t, wc); cue('ring', wc, 'ring', 720, 200); }
    camEnd();
  }
  function shDee(t, lt) {       // "my Dee Dee loves me. my Dee Dee always comes to see me every day."
    const t0 = t - lt, wl = WT('dee', 'loves'), we = WT('dee', 'every');
    camBegin(560, 1220, 1.35); kimRoom(t); phoneTable(t, 720);
    person(600, 1580, 12, KIM, { in: t0 + .05, mood: 'beam', look: .4, key: 'kim', aR: .6 });
    if (t > wl - .3) { P('island_cloud', 540, 1060, 380, { in: wl - .3, snd: 'pop', sway: .02 }); person(500, 1090, 8, GRAN, { in: wl - .2, mood: 'beam', key: 'granc', snd: false }); person(580, 1080, 5, KIM, { in: wl - .1, mood: 'beam', key: 'kimc', snd: false }); glow(540, 1020, 240, '#FFD27A', .5); }
    if (t > we - .2) { stars(540, 980, t, we); cue('every', we, 'sparkle', 540, 300); }
    camEnd();
  }
  function shWonder(t, lt) {    // her family and friends said, we just don't understand it
    const t0 = t - lt, wu = WT('wonder', 'understand');
    camBegin(560, 1220, 1.35); kimRoom(t);
    person(330, 1560, 20, MOM, { in: t0 + .05, mood: t > wu ? 'surprised' : 'neutral', look: .6, key: 'mom' });
    person(760, 1550, 21, DAD, { in: t0 + .1, mood: t > wu ? 'surprised' : 'neutral', look: -.6, key: 'dad', aL: .3 });
    person(540, 1600, 12, KIM, { in: t0 + .15, mood: 'beam', look: 0, key: 'kim' });
    camEnd();
  }
  function shLesson(t, lt) {    // she couldn't be there in person; she showed up every day in imagination; Kim felt it
    const t0 = t - lt, ws = WT('lesson', 'showed'), wf = WT('lesson', 'felt');
    camBegin(540, 960, 1.0); granRoom(t, true);
    P('room_armchair', 400, 1660, 440, { sway: 0 }); person(400, 1580, 21, GRAN, { in: t0 + .05, mood: t > ws ? 'beam' : 'warm', look: .5, key: 'gran' });
    if (t > ws - .3) { P('island_cloud', 700, 1060, 380, { in: ws - .3, snd: 'pop', sway: .02 }); person(700, 1090, 8, KIM, { in: ws - .2, mood: 'beam', key: 'kimc', snd: false }); glow(700, 1020, 260, '#FFD27A', .5); }
    if (t > wf - .2) { stars(700, 980, t, wf); cue('felt', wf, 'chime', 700, 300); }
    camEnd();
  }
  function shClose(t, lt) {     // who do you miss? tonight, hold them in your imagination; let them feel it
    const t0 = t - lt, wm = WT('close', 'miss'), wh = WT('close', 'hold'), wf = WT('close', 'feel');
    camBegin(540, 960, 1.0); board('night'); P('island_moon', 860, 470, 110, { sway: .01 }); street(t, { night: true });
    at('city_rowhouses', 200, 0, 560, { tint: [150, 150, 170] }); at('life_house', 545, 0, 560, { tint: [150, 150, 170] }); at('city_apartment', 930, 0, 600, { tint: [150, 150, 170] });
    P('city_streetlamp', 860, 1480, 640, { sway: .003 }); glow(860, 880, 220, '#FFE2A8', .4);
    host(t, 420, 1500, 22, { in: t0 + .02, look: .5, mood: t > wf ? 'beam' : 'warm' });
    if (t > wm - .3) P('island_cloud', 640, 1000, 300, { in: wm - .3, snd: 'pop', sway: .02 });
    if (t > wh - .2) { person(610, 1020, 7, GRAN, { in: wh - .2, mood: 'beam', key: 'gc', snd: false }); person(670, 1015, 4.5, KIM, { in: wh - .1, mood: 'beam', key: 'kc', snd: false }); }
    if (t > wf - .2) { glow(640, 940, 220, '#FFD27A', .55); stars(640, 920, t, wf); cue('fl', wf, 'chime', 640, 300); }
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: the phone tracks your state; dip on "spending"; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'holding'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('born') - .12, shBorn], [S('gap') - .12, shGap], [S('lap') - .12, shLap],
    [S('words') - .12, shWords], [S('me') - .12, shMe], [S('heavier') - .12, shHeavier], [S('picture') - .12, shPicture], [S('talk') - .12, shTalk], [S('phone') - .12, shPhone],
    [S('dee') - .12, shDee], [S('wonder') - .12, shWonder], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
