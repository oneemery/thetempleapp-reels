window.CHEAP = true; window.FELT = true;
// Episode 42, felt sets cut: "The Visit" (M.L.J., San Francisco to her daughter's living room in London; The Law and the Promise, ch 8).
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
  const MUM = { ...C.dreamer, name: 'mum', coat: '#7A4E8A', sleeve: '#7A4E8A', stripes: null, hair: '#B8B2A8', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.8 };
  const DAU = { ...C.dreamer, name: 'dau', coat: '#3F6FB0', sleeve: '#3F6FB0', stripes: null, hair: '#5A3A24', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const HUS = { ...C.blake, name: 'hus', coat: '#5E6B3A', sleeve: '#5E6B3A', lapel: '#F3EBDC', pants: '#3A3A44', hat: null, hair: '#B5643A', skin: '#EFCBA6' };
  const PAULA = { ...C.paul, name: 'apostle' };
  function sfRoom(t, night) {   // the mother's living room in San Francisco
    room(t, night ? [150, 140, 150] : [222, 200, 168], night ? [90, 64, 46] : [120, 80, 52]);
    P('room_window', 700, 880, 400, { sway: 0, tint: night ? [120, 120, 160] : null }); P('room_painting', 330, 740, 200, { sway: 0 }); P('room_clock', 890, 640, 110, { sway: .02 });
    P('room_lamp', 230, 1260, 380, { sway: 0 }); P('room_rug', 540, 1580, 900, { sx: 1.5, sy: .32, sway: 0 });
  }
  function fireplace(t, x = 540) {   // a felt brick fireplace on the back wall, a little fire, a mantel clock
    if (window.CUEMODE) return;
    fabric('warm', [[x - 220, 820], [x + 220, 820], [x + 220, 1232], [x - 220, 1232]], [160, 82, 64]);
    for (let r = 0; r < 8; r++) { push(); stroke(100, 50, 40, 90); strokeWeight(3); line(x - 220, 820 + r * 52, x + 220, 820 + r * 52); pop(); }
    fabric('sand', [[x - 250, 790], [x + 250, 790], [x + 250, 830], [x - 250, 830]], [230, 220, 204]);
    fabric('sand', [[x - 120, 1000], [x + 120, 1000], [x + 120, 1232], [x - 120, 1232]], [40, 30, 30]);
    flushBrush(); noStroke(); const f = .8 + .2 * Math.sin(t * 9);
    fill(240, 140, 40); ellipse(x, 1200 - 30 * f, 120 * f, 120); fill(250, 210, 80); ellipse(x, 1205 - 20 * f, 70 * f, 70);
    glow(x, 1150, 200, '#FFB050', .35);
    P('room_clock', x + 150, 790, 90, { sway: 0 });
  }
  function londonRoom(t) {
    room(t, [176, 196, 186], [110, 80, 60]);
    fireplace(t, 540); P('room_painting', 260, 720, 160, { sway: 0 }); P('room_window', 860, 860, 280, { sway: 0, tint: [190, 200, 215] });
    P('room_armchair', 860, 1430, 300, { sway: 0 }); P('room_rug', 540, 1580, 900, { sx: 1.5, sy: .32, sway: 0 });
  }
  function londonStreet(t) {
    board('day'); P('island_cloud', 260, 520, 230, { sway: .02 }); P('island_cloud', 760, 600, 200, { sway: .02 });
    street(t, { drive: false, lawn: [170, 176, 160] });
    at('city_brownstone', 120, 0, 620); at('city_rowhouses', 545, 0, 600); at('city_brownstone', 970, 0, 620);
    P('street_phonebooth', 860, 1500, 560, { sway: 0 }); P('city_streetlamp', 90, 1480, 620, { sway: .003 }); P('street_mailbox', 300, 1500, 170, { sway: 0 });
  }
  const ghost = (t, x, y) => glow(x, y - 160, 210, '#FFF3D0', .5 + .1 * Math.sin(t * 3));

  // ---------- shots ----------
  function shHook(t, lt) {      // San Francisco; daughter in London; five days later a letter; her daughter had seen her
    const t0 = t - lt, wl = WT('hook', 'london'), wle = WT('hook', 'letter'), ws = WT('hook', 'seen');
    camBegin(540, 960, 1.0);
    if (t < wle - .3) { sfRoom(t); P('room_armchair', 400, 1660, 440, { sway: 0 }); person(400, 1580, 21, MUM, { in: t0 + .05, mood: 'warm', look: .6, key: 'mum' });
      if (t > wl - .3) { P('island_cloud', 700, 1060, 380, { in: wl - .3, snd: 'pop', sway: .02 }); P('street_phonebooth', 640, 1090, 150, { in: wl - .2, snd: false, sway: .01 }); person(740, 1090, 7, DAU, { in: wl - .1, mood: 'neutral', key: 'dauc', snd: false }); } }
    else { londonRoom(t); person(700, 1560, 20, DAU, { in: wle - .3, mood: t > ws ? 'surprised' : 'neutral', look: -.8, key: 'dau' });
      if (t > wle - .2) P('prop_envelope', 320, 1300, 200, { in: wle - .2, snd: 'pop', sway: .03 });
      if (t > ws - .2) { ghost(t, 360, 1560); person(360, 1560, 20, MUM, { in: ws - .2, mood: 'warm', look: .8, key: 'mumg', snd: false }); cue('seen', ws, 'chime', 360, 300); } }
    camEnd();
  }
  function shVerse(t, lt) {     // Colossians 2:5: absent in the flesh, yet with you in the spirit
    const t0 = t - lt, wa = WT('verse', 'absent'), ws = WT('verse', 'spirit');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(620, 1000, 600, '#FFD27A', .2 + .5 * ease(seg(t, ws - .2, ws + .6)));
    P('prop_scroll', 760, 1320, 300, { in: t0 + .2, snd: 'pop', sway: .02 });
    if (t > wa - .2) P('prop_envelope', 900, 1500, 160, { in: wa - .2, snd: false, sway: .03 });
    if (t > ws - .2) P('bible_dove', 760, 900, 200, { in: ws - .2, snd: 'sparkle', sway: .05 });
    person(330, 1840, 40, PAULA, { in: stagger(t0, 1), mood: t > ws ? 'wise' : 'warm', aL: .8, look: .6, key: 'apostle' });
    camEnd();
  }
  function shMeaning(t, lt) {   // where you go in imagination, you really go
    const t0 = t - lt, wi = WT('meaning', 'imagination'), wr = WT('meaning', 'really');
    camBegin(540, 960, 1.0); sfRoom(t); P('home_sofa', 800, 1390, 300, { sway: 0 });
    host(t, 400, 1540, 22, { in: t0 + .02, look: .6 });
    if (t > wi - .3) { P('island_cloud', 720, 1060, 360, { in: wi - .3, snd: 'pop', sway: .02 }); P('room_door', 720, 1110, 160, { in: wi - .2, snd: false, sway: .01 }); }
    if (t > wr - .2) { glow(720, 1000, 240, '#FFD27A', .55); stars(720, 980, t, wr); }
    camEnd();
  }
  function shSat(t, lt) {       // sitting in San Francisco; her daughter lived in London, England
    const t0 = t - lt, wl = WT('sat', 'london');
    camBegin(540, 960, 1.0); sfRoom(t); P('room_armchair', 400, 1660, 440, { sway: 0 });
    person(400, 1580, 21, MUM, { in: t0 + .05, mood: t > wl ? 'warm' : 'neutral', look: .6, key: 'mum' });
    if (t > wl - .3) { P('island_cloud', 720, 1060, 380, { in: wl - .3, snd: 'pop', sway: .02 }); P('street_phonebooth', 660, 1090, 150, { in: wl - .2, snd: false, sway: .01 }); person(770, 1090, 7, DAU, { in: wl - .1, mood: 'neutral', key: 'dauc', snd: false }); }
    camEnd();
  }
  function shRoom(t, lt) {      // she imagined her daughter's living room; surrounded herself with it; until she was standing in it
    const t0 = t - lt, wi = WT('room', 'imagined'), wsu = WT('room', 'surrounded'), wst = WT('room', 'standing');
    camBegin(540, 960, 1.0);
    if (t < wst - .3) { sfRoom(t, true); P('room_armchair', 400, 1660, 440, { sway: 0 }); person(400, 1580, 21, MUM, { in: t0 + .05, mood: 'wise', look: .3, key: 'mum' });
      if (t > wi - .3) { P('island_cloud', 640, 1000, 480, { in: wi - .3, snd: 'pop', sway: .02 }); glow(640, 960, 260 + 120 * ease(seg(t, wsu, wst)), '#FFD27A', .4); } }
    else { londonRoom(t); ghost(t, 360, 1560); person(360, 1560, 21, MUM, { in: wst - .3, mood: 'awe', look: .8, key: 'mumg' }); cue('arrive', wst - .2, 'whoosh', 360, 300); }
    camEnd();
  }
  function shFire(t, lt) {      // her daughter by the fireplace, face turned away
    const t0 = t - lt, wf = WT('fire', 'fireplace');
    camBegin(540, 960, 1.0); londonRoom(t);
    ghost(t, 300, 1560); person(300, 1560, 21, MUM, { mood: 'warm', look: .8, key: 'mumg' });
    person(660, 1500, 20, DAU, { in: t0 + .05, mood: 'neutral', look: 1, key: 'dau', aL: .2 });
    if (t > wf) glow(540, 1150, 240, '#FFB050', .3);
    camEnd();
  }
  function shEyes(t, lt) {      // she turned; their eyes met; startled and frightened
    const t0 = t - lt, wt = WT('eyes', 'turned'), wm = WT('eyes', 'met'), ws = WT('eyes', 'startled');
    camBegin(540, 960, 1.0 + .06 * ease(seg(t, wm - .2, wm + .6))); londonRoom(t);
    ghost(t, 300, 1560); person(300, 1560, 21, MUM, { mood: t > ws ? 'worried' : 'warm', look: .8, key: 'mumg' });
    person(660, 1500, 20, DAU, { mood: t > ws ? 'surprised' : 'neutral', look: t > wt ? -1 : 1, key: 'dau', aL: t > ws ? .6 : .2, aR: t > ws ? .6 : -1.2 });
    if (t > wm) cue('met', wm, 'pat', 480, 200);
    camEnd();
  }
  function shBack(t, lt) {      // it upset her so much that right away she was back in San Francisco
    const t0 = t - lt, wu = WT('back', 'upset'), wb = WT('back', 'back');
    camBegin(540, 960, 1.0);
    if (t < wb - .3) { londonRoom(t); ghost(t, 300, 1560); person(300, 1560, 21, MUM, { mood: 'worried', look: .8, key: 'mumg' }); person(660, 1500, 20, DAU, { mood: 'surprised', look: -1, key: 'dau', aL: .6, aR: .6 }); }
    else { sfRoom(t, true); P('room_armchair', 400, 1660, 440, { sway: 0 }); person(400, 1580, 21, MUM, { in: wb - .3, mood: 'surprised', look: .4, key: 'mum', aL: .4, aR: .4 }); cue('bk', wb - .25, 'whoosh', 400, 300); }
    camEnd();
  }
  function shLetter(t, lt) {    // five days later an airmail letter from London, written the same day
    const t0 = t - lt, wf = WT('letter', 'five'), wa = WT('letter', 'airmail'), wsd = WT('letter', 'same');
    camBegin(540, 960, 1.0); londonStreet(t);
    if (t > wf - .2) tally(t, 330, 760, 5, [wf - .2, wf - .1, wf, wf + .1, wf + .2], 105);
    if (t > wa - .3) { const k = ease(seg(t, wa - .3, wa + 1.4)); P('prop_envelope', lerp(300, 760, k), lerp(1480, 1000, k) - 140 * Math.sin(Math.PI * k), 170, { in: wa - .3, snd: 'pop', rot: .2 * Math.sin(t * 4), sway: 0 }); cue('fly', wa, 'whoosh', 540, 300); }
    if (t > wsd - .2) glow(760, 960, 200, '#FFD27A', .45);
    camEnd();
  }
  function shSeen(t, lt) {      // her daughter wrote she had seen her mother, as real as if she were there
    const t0 = t - lt, ws = WT('seen', 'seen'), wr = WT('seen', 'real');
    camBegin(540, 960, 1.0); sfRoom(t); P('room_armchair', 400, 1660, 440, { sway: 0 });
    person(400, 1580, 21, MUM, { in: t0 + .05, mood: t > wr ? 'awe' : 'neutral', look: .6, key: 'mum', aR: .3 });
    P('prop_envelope', 560, 1450, 140, { in: t0 + .1, snd: 'pop', sway: .02 });
    if (t > ws - .3) { P('island_cloud', 720, 1040, 420, { in: ws - .3, snd: 'pop', sway: .02 }); person(660, 1070, 7, MUM, { in: ws - .2, mood: 'warm', key: 'mumc', snd: false }); person(780, 1070, 7, DAU, { in: ws - .1, mood: 'surprised', key: 'dauc', snd: false }); }
    if (t > wr - .2) glow(720, 1000, 240, '#FFF3D0', .5);
    camEnd();
  }
  function shVanished(t, lt) {  // so frightened; before she could say a word, her mother vanished
    const t0 = t - lt, wv = WT('vanished', 'vanished');
    camBegin(540, 960, 1.0); londonRoom(t);
    person(660, 1500, 20, DAU, { in: t0 + .05, mood: 'surprised', look: -1, key: 'dau', aL: .6, aR: .6 });
    if (t < wv) { ghost(t, 300, 1560); person(300, 1560, 21, MUM, { mood: 'warm', look: .8, key: 'mumg' }); }
    else if (t < wv + .8) { const a = 1 - seg(t, wv, wv + .8); glow(300, 1400, 260 * (1 + (1 - a)), '#FFF3D0', a); }
    if (t > wv) cue('van', wv, 'whoosh', 300, 300);
    camEnd();
  }
  function shTime(t, lt) {      // the time matched, once you count the time difference
    const t0 = t - lt, wm = WT('time', 'exact'), wd = WT('time', 'difference');
    camBegin(540, 960, 1.0); sfRoom(t); P('room_armchair', 400, 1660, 440, { sway: 0 });
    person(400, 1580, 21, MUM, { in: t0 + .05, mood: t > wm ? 'awe' : 'neutral', look: .6, key: 'mum' });
    P('island_cloud', 720, 1040, 420, { in: t0 + .1, snd: 'pop', sway: .02 });
    P('room_clock', 650, 1040, 110, { in: t0 + .2, snd: false, sway: .02 }); P('room_clock', 790, 1040, 110, { in: t0 + .3, snd: false, sway: .02 });
    if (t > wm - .2) { glow(720, 990, 220, '#FFD27A', .55); stars(720, 960, t, wm); cue('mt', wm, 'chime', 720, 300); }
    if (t > wd - .2) cue('tk', wd - .2, 'ticks', 720, 1.0);
    camEnd();
  }
  function shHusband(t, lt) {   // her husband: your mother must have died, or she's dying; write to her right now
    const t0 = t - lt, wd = WT('husband', 'died'), ww = WT('husband', 'write');
    camBegin(540, 960, 1.0); londonRoom(t);
    person(380, 1540, 21, HUS, { in: t0 + .05, mood: t > wd ? 'worried' : 'neutral', look: .8, key: 'hus', aR: t > ww ? .5 : -1.2 });
    person(660, 1500, 20, DAU, { in: t0 + .1, mood: 'worried', look: -.8, key: 'dau' });
    if (t > ww - .2) { P('prop_envelope', 540, 1300, 170, { in: ww - .2, snd: 'pop', sway: .03 }); P('prop_quill', 620, 1300, 140, { in: ww - .1, snd: false, sway: .03 }); }
    camEnd();
  }
  function shAlive(t, lt) {     // she wasn't dying; very much alive, and excited
    const t0 = t - lt, wa = WT('alive', 'alive'), we = WT('alive', 'excited');
    camBegin(540, 960, 1.0); sfRoom(t); P('home_sofa', 800, 1390, 300, { sway: 0 });
    person(460, 1560, 21, MUM, { in: t0 + .05, mood: t > we ? 'joy' : 'beam', look: .4, key: 'mum', aL: t > we ? .7 : -1.2, aR: t > we ? .7 : -1.2 });
    if (t > wa - .2) { glow(460, 1300, 280, '#FFD27A', .5); P('life_flowers', 740, 1500, 180, { in: wa - .2, snd: 'pop', sway: .02 }); }
    if (t > we - .2) { stars(460, 1200, t, we); cue('ex', we, 'sparkle', 460, 300); }
    camEnd();
  }
  function shLesson(t, lt) {    // she never left her chair; but she was really there
    const t0 = t - lt, wc = WT('lesson', 'chair'), wr = WT('lesson', 'really');
    camBegin(540, 960, 1.0); sfRoom(t, true); P('room_armchair', 400, 1660, 440, { sway: 0 });
    person(400, 1580, 21, MUM, { in: t0 + .05, mood: t > wr ? 'beam' : 'wise', look: .5, key: 'mum' });
    if (t > wr - .3) { P('island_cloud', 720, 1060, 420, { in: wr - .3, snd: 'pop', sway: .02 }); person(670, 1090, 7, MUM, { in: wr - .2, mood: 'warm', key: 'mumc', snd: false }); person(780, 1090, 7, DAU, { in: wr - .1, mood: 'surprised', key: 'dauc', snd: false }); glow(720, 1020, 260, '#FFD27A', .5); cue('rl', wr, 'chime', 720, 300); }
    camEnd();
  }
  function shClose(t, lt) {     // where do you want to be? tonight, stand there in your imagination until it feels real
    const t0 = t - lt, ww = WT('close', 'where'), ws = WT('close', 'stand'), wr = WT('close', 'real');
    camBegin(540, 960, 1.0); board('night'); P('island_moon', 860, 470, 110, { sway: .01 }); street(t, { night: true });
    at('city_rowhouses', 200, 0, 560, { tint: [150, 150, 170] }); at('life_house', 545, 0, 560, { tint: [150, 150, 170] }); at('city_apartment', 930, 0, 600, { tint: [150, 150, 170] });
    P('city_streetlamp', 860, 1480, 640, { sway: .003 }); glow(860, 880, 220, '#FFE2A8', .4);
    host(t, 420, 1500, 22, { in: t0 + .02, look: .5, mood: t > wr ? 'beam' : 'warm' });
    if (t > ww - .3) P('island_cloud', 640, 1000, 300, { in: ww - .3, snd: 'pop', sway: .02 });
    if (t > ws - .2) P('room_door', 640, 1040, 130, { in: ws - .2, snd: false, sway: .01 });
    if (t > wr - .2) { glow(640, 940, 220, '#FFD27A', .55); stars(640, 920, t, wr); cue('rl', wr, 'chime', 640, 300); }
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: the phone tracks your state; dip on "spending"; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'going'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('sat') - .12, shSat], [S('room') - .12, shRoom], [S('fire') - .12, shFire],
    [S('eyes') - .12, shEyes], [S('back') - .12, shBack], [S('letter') - .12, shLetter], [S('seen') - .12, shSeen], [S('vanished') - .12, shVanished], [S('time') - .12, shTime],
    [S('husband') - .12, shHusband], [S('alive') - .12, shAlive], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
