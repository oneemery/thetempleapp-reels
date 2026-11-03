window.CHEAP = true; window.FELT = true;
// Episode 38, flannelgraph cut: "The Letter" (F.B. rewrites the agent's letter) built from the felt cutout kit (kit/cutouts) on felt boards.
// One voice (Emery, narrator and host). Every set piece presses onto the board with its own felt pat; characters are paper puppets.
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
  // felt snow: each flake its own little felt dot with a shadow
  function feltSnow(t, n, a = 1, seed = 1) {
    flushBrush(); noStroke();
    for (let i = 0; i < n; i++) {
      const sp = 55 + 65 * hash(i * 7.1 + seed), r = 7 + 7 * hash(i * 2.9 + seed), x = (hash(i * 3.3 + seed) * W + 26 * Math.sin(t * .8 + i)) % W, y = (hash(i * 5.7 + seed) * (H + 200) + t * sp) % (H + 200) - 100;
      fill(30, 18, 12, 60 * a); ellipse(x + 3, y + 4, r * 2, r * 2); fill(246, 240, 228, 235 * a); ellipse(x, y, r * 2, r * 2);
    }
  }
  function stars(x, y, t, t0) { if (t < t0) return; const k = clamp((t - t0) / 1.4); boilSeed('stars'); for (let i = 0; i < 5; i++) { const a = t * 5 + i * TAU / 5; paint(starPts(x + Math.cos(a) * 90, y + Math.sin(a) * 30, 20 * (1 - k * .5), .45, 5, a), { wash: '#F4C04A', ink: PAL.ink, sw: .6 }); } }
  const zzz = (x, y, t, t0, s = 1) => { if (t > t0) emote('zzz', x, y, 40 * s, seg(t, t0, t0 + .4), t - t0); };
  const shakeCam = (t, t0, amt = 22) => t > t0 ? shakeXY(t - t0, amt * Math.exp(-(t - t0) * 5)) : [0, 0];
  const cue = (key, tt, type, x = 540, size = 400) => { CUELOG[key] = { t: tt, type, x, size }; };

  const JESUS = { ...C.paul, name: 'jesus', coat: '#F3EBDC', sleeve: '#F3EBDC', pants: '#F3EBDC', sash: '#B8463A', skin: '#C98E62', hair: '#3B2A22', hairStyle: 'neat', beard: .5, beardCol: '#3B2A22', flare: .14 };
  const DISC1 = { ...C.paul, name: 'disc1', coat: '#6B7A8F', sleeve: '#6B7A8F', pants: '#6B7A8F', sash: '#C9963A', skin: '#C98E62', hair: '#2B1E19', hairStyle: 'neat', beard: .3, beardCol: '#2B1E19' };
  const DISC2 = { ...C.paul, name: 'disc2', coat: '#8C5A3C', sleeve: '#8C5A3C', pants: '#8C5A3C', sash: '#3F8F8A', skin: '#E6B48C', hair: '#5A4636', hairStyle: 'curls', beard: 0 };
  const rug = (x, y, w, o = {}) => P('room_rug', x, y, w * 1.3, { sx: 1.5, sy: .32, sway: 0, drop: 90, ...o });   // lies flat on the floor
  function phone(x, y, u, t, a = 1) {   // a felt smartphone showing the Temple app: the temple and a rising state line
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
  function tally(t, x0, y, n, ts, gap = 92) {   // felt day counters: dot i presses on at ts[i]
    for (let i = 0; i < n; i++) { const ti = ts[i]; if (t < ti) continue; CUELOG['tally' + i + '@' + ti.toFixed(2)] = { t: ti + .05, type: 'pat', x: x0 + i * gap, size: 120 };
      if (window.CUEMODE) continue; const k = backOut(seg(t, ti, ti + .3)); flushBrush(); noStroke();
      fill(30, 18, 12, 70); ellipse(x0 + i * gap + 5, y + 6, 64 * k, 64 * k); fill(246, 240, 226); ellipse(x0 + i * gap, y, 70 * k, 70 * k); fill(232, 184, 42); ellipse(x0 + i * gap, y, 54 * k, 54 * k); }
  }
  const RS = { ...C.blake, name: 'rs', coat: '#5E6B3A', sleeve: '#5E6B3A', lapel: '#F3EBDC', pants: '#3A3A44', hat: null, hair: '#3B2A22', skin: '#EFCBA6' };
  const SIGNS = {};
  function sign(x, y, w, txt, col = '#2F7A4A', a = 1) {
    if (window.CUEMODE || a <= 0) return; const key = txt + col; if (FGON) w *= 1.5;
    if (!SIGNS[key]) { const g = createGraphics(600, 220); g.pixelDensity(1); const c = g.drawingContext;
      c.fillStyle = '#3A2A22'; c.beginPath(); c.roundRect(14, 20, 572, 190, 24); c.fill(); c.fillStyle = '#F6F0E2'; c.beginPath(); c.roundRect(4, 6, 572, 190, 24); c.fill();
      c.fillStyle = col; c.beginPath(); c.roundRect(20, 22, 540, 158, 16); c.fill();
      c.fillStyle = '#F6F0E2'; c.font = 'bold 100px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 290, 104); SIGNS[key] = g; }
    flushBrush(); tint(255, 255 * a); image(SIGNS[key], x - w / 2, y - w * 110 / 600, w, w * 220 / 600); noTint();
  }
  const LBL = {};
  function label(x, y, w, txt, col = '#2F7A4A', a = 1) {   // like sign(), but the text shrinks to fit
    if (window.CUEMODE || a <= 0) return; const key = txt + col; if (FGON) w *= 1.5;
    if (!LBL[key]) { const g = createGraphics(600, 220); g.pixelDensity(1); const c = g.drawingContext;
      c.fillStyle = '#3A2A22'; c.beginPath(); c.roundRect(14, 20, 572, 190, 24); c.fill(); c.fillStyle = '#F6F0E2'; c.beginPath(); c.roundRect(4, 6, 572, 190, 24); c.fill();
      c.fillStyle = col; c.beginPath(); c.roundRect(20, 22, 540, 158, 16); c.fill();
      let fs = 100; c.font = `bold ${fs}px Georgia, serif`; while (c.measureText(txt).width > 500 && fs > 30) { fs -= 4; c.font = `bold ${fs}px Georgia, serif`; }
      c.fillStyle = '#F6F0E2'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 290, 104); LBL[key] = g; }
    flushBrush(); tint(255, 255 * a); image(LBL[key], x - w / 2, y - w * 110 / 600, w, w * 220 / 600); noTint();
  }
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

  // old felt-board shots placed onto a set: everything drawn after fg() is scaled so the front row stands mid frame
  let FGON = false; const FGS = 22 / 30;
  function fg() { if (window.CUEMODE || FGON) return; push(); translate(540 * (1 - FGS), 1530 - 1860 * FGS); scale(FGS); FGON = true; }
  function camEnd2() { if (FGON) { pop(); FGON = false; } camEnd(); }
  function livingRoom(t, night) {
    room(t, night ? [150, 140, 150] : [222, 200, 168], night ? [90, 64, 46] : [120, 80, 52]);
    P('room_window', 700, 880, 400, { sway: 0, tint: night ? [120, 120, 160] : null }); P('room_painting', 330, 740, 200, { sway: 0 }); P('room_clock', 890, 640, 110, { sway: .02 });
    P('room_lamp', 230, 1260, 380, { sway: 0 }); P('room_rug', 540, 1580, 900, { sx: 1.5, sy: .32, sway: 0 }); P('home_sofa', 820, 1390, 300, { sway: 0 });
  }
  function hall(t) {   // a little theater in his mind: curtain wall, stage, footlights
    room(t, [150, 70, 70], [110, 74, 50]);
    fabric('sand', [[170, 1120], [910, 1120], [930, 1250], [150, 1250]], [96, 62, 40]);
    for (let i = 0; i < 6; i++) P('room_chair', 250 + i * 116, 1420, 170, { sway: 0, tint: [230, 222, 214] });
  }
  function agentOffice(t) { room(t, [196, 206, 192], [118, 94, 70]); P('office_glassdoor', 780, 1236, 560, { sway: 0 }); P('office_diploma', 420, 660, 170, { sway: 0 }); P('office_filecabinet', 270, 1240, 360, { sway: 0 }); P('office_coatrack', 960, 1290, 420, { sway: 0 }); }
  function lotStreet(t, night) {
    board(night ? 'night' : 'day'); if (!night) { P('island_sun', 870, 460, 180, { sway: .02 }); P('island_cloud', 260, 520, 230, { sway: .02 }); } else P('island_moon', 860, 470, 110, { sway: .01 });
    street(t, { drive: false, night }); const tn = night ? [150, 150, 170] : undefined;
    at('city_apartment', 120, 0, 600, { tint: tn }); at('city_rowhouses', 990, 0, 560, { tint: tn }); at('street_picketfence', 120, .3, 220, { tint: tn }); at('street_picketfence', 960, .3, 220, { tint: tn });
    if (night) { P('city_streetlamp', 860, 1480, 640, { sway: .003 }); glow(860, 880, 220, '#FFE2A8', .4); }
  }
  const FB = { ...C.blake, name: 'fb', coat: '#8C5A3C', sleeve: '#8C5A3C', lapel: '#F3EBDC', pants: '#3A3A44', hat: null, hair: '#3B2A22', skin: '#EFCBA6' };
  const AGENT = { ...C.skeptic, name: 'agent', coat: '#2E3A52', sleeve: '#2E3A52', lapel: '#D9D4C8', tie: '#B8463A', hat: null };
  const JOHN = { ...C.paul, name: 'john', coat: '#3F6FB0', sleeve: '#3F6FB0', pants: '#3F6FB0', sash: '#E6B82A', hair: '#5A3A24', hairStyle: 'curls', beard: .4, beardCol: '#5A3A24' };
  function lot(t, t0, o = {}) { const e = i => o.still ? null : stagger(t0, i); lotStreet(t); fg(); P('city_wintertree', 220, 1560, 300, { in: e(1) }); }
  function office(t, t0, o = {}) { const e = i => o.still ? null : stagger(t0, i); agentOffice(t); fg(); P('room_bookshelf', 880, 1560, 420, { in: e(0) }); P('room_desk', 560, 1780, 460, { in: e(1), sway: .004 }); P('room_lamp', 470, 1500, 200, { in: e(2) }); }
  function letter(x, y, w, t, tin, txt, col, o = {}) { if (t < tin) return; P('prop_envelope', x, y, w, { in: tin, snd: o.snd == null ? 'pop' : o.snd, sway: .03, rot: o.rot || 0 }); if (txt) label(x, y - w * .62, w * .95, txt, col, ease(seg(t, tin + .1, tin + .4))); }

  // ---------- shots ----------
  function shHook(t, lt) {   // "nothing's selling, wait"; he rewrote the letter; three days later a deposit
    const t0 = t - lt, wn = WT('hook', 'selling'), wr = WT('hook', 'rewrote'), wd = WT('hook', 'deposit');
    camBegin(540, 960, 1.0);
    if (t < wd - .6) { livingRoom(t); fg(); person(300, 1860, 30, FB, { in: t0 + .05, mood: t > wr ? 'determined' : 'sad', look: 1, key: 'fb' });
      letter(720, 1400, 300, t, t0 + .2, t > wr ? 'SOLD!' : 'WAIT', t > wr ? '#2F7A4A' : '#6B6B6B'); if (t > wr) cue('rw', wr, 'whoosh', 720, 300); }
    else { lot(t, wd - .6); label(640, 1360, 380, 'SOLD', '#B8463A', ease(seg(t, wd - .3, wd))); person(300, 1860, 30, FB, { in: wd - .5, mood: 'beam', look: 1, key: 'fb' }); if (t > wd) cue('dep', wd, 'cash', 640, 300); }
    camEnd2();
  }
  function shVerse(t, lt) {      // Revelation 21:5: Behold, I make all things new. Write.
    const t0 = t - lt, wn = WT('verse', 'new'), ww = WT('verse', 'write');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(620, 1000, 600, '#FFD27A', .2 + .5 * ease(seg(t, wn - .2, wn + .6)));
    if (t > wn - .2) P('bible_star', 760, 880, 200, { in: wn - .2, snd: 'chime', sway: .05 });
    if (t > ww - .2) P('prop_quill', 780, 1360, 260, { in: ww - .2, snd: 'pop', sway: .04 });
    person(330, 1840, 40, JOHN, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'john', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // even a letter you already got
    const t0 = t - lt, wl = WT('meaning', 'letter');
    camBegin(540, 960, 1.0); livingRoom(t); fg(); letter(780, 1450, 280, t, wl - .2, null);
    if (t > wl) glow(780, 1350, 220, '#FFD27A', .4);
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd2();
  }
  function shLot(t, lt) {        // a lot that was a burden; in late July he wrote to an agent
    const t0 = t - lt, wb = WT('lot', 'burden'), ww = WT('lot', 'wrote');
    camBegin(540, 960, 1.0); lot(t, t0); label(640, 1380, 340, 'FOR SALE', '#B8463A', ease(seg(t, t0 + .4, t0 + .7)));
    person(300, 1860, 30, FB, { in: t0 + .1, mood: t > wb ? 'worried' : 'neutral', look: 1, key: 'fb' });
    if (t > wb - .2) P('sky_raincloud', 640, 950, 200, { in: wb - .2, sway: .03, snd: 'pop' });
    if (t > ww - .2) letter(820, 1150, 200, t, ww - .2, null);
    camEnd2();
  }
  function shReply(t, lt) {      // the agent wrote back: standstill; wait until after the new year
    const t0 = t - lt, ws = WT('reply', 'standstill'), wy = WT('reply', 'year');
    camBegin(540, 960, 1.0); office(t, t0);
    person(560, 1860, 32, AGENT, { in: t0 + .1, mood: 'skeptical', look: -1, key: 'agent', talk: talk(t) });
    if (t > ws - .2) letter(240, 1400, 260, t, ws - .2, 'WAIT', '#6B6B6B');
    if (t > wy - .2) P('sky_raincloud', 240, 1000, 180, { in: wy - .2, sway: .03, snd: 'pop' });
    camEnd2();
  }
  function shRewrite(t, lt) {    // in imagination he rewrote it: the agent eager; he read it over and over
    const t0 = t - lt, wr = WT('rewrite', 'rewrote'), we = WT('rewrite', 'eager'), wo = WT('rewrite', 'over');
    camBegin(540, 960, 1.0); livingRoom(t); fg(); person(300, 1860, 30, FB, { in: t0 + .05, mood: t > we ? 'happy' : 'wise', look: 1, key: 'fb', aR: t > wo ? .4 + .1 * Math.sin(t * 5) : -1.2 });
    if (t > wr - .4) { P('island_cloud', 720, 1250, 520, { in: wr - .4, snd: 'pop', sway: .02 }); letter(720, 1260, 220, t, wr - .2, t > we - .2 ? 'EAGER!' : 'WAIT', t > we - .2 ? '#2F7A4A' : '#6B6B6B', { snd: false }); }
    if (t > we - .2) { glow(720, 1150, 260, '#FFD27A', .45); cue('eager', we, 'sparkle', 720, 300); }
    camEnd2();
  }
  function shProducer(t, lt) {   // a play in his mind; as producer he picked the theme: sold, for a profit
    const t0 = t - lt, wp = WT('producer', 'producer'), ws = WT('producer', 'sold');
    camBegin(540, 960, 1.0); hall(t); fg();
    if (t > wp - .2) label(700, 900, 380, 'PRODUCER', '#7A4E8A', ease(seg(t, wp - .2, wp + .1)));
    if (t > ws - .3) { label(700, 1300, 360, 'SOLD', '#B8463A', ease(seg(t, ws - .3, ws))); glow(700, 1250, 260, '#FFD27A', .45); cue('theme', ws, 'chime', 700, 300); }
    person(300, 1860, 30, FB, { in: t0 + .05, mood: 'happy', look: 1, key: 'fb' });
    camEnd2();
  }
  function shAuthor(t, lt) {     // as author he wrote the scene: the office, a handshake, "thank you, sir", "a pleasure"
    const t0 = t - lt, wa = WT('author', 'author'), wo = WT('author', 'office'), wh = WT('author', 'hands'), wpl = WT('author', 'pleasure');
    camBegin(540, 960, 1.0);
    if (t < wo - .3) { hall(t); fg(); label(700, 900, 380, 'AUTHOR', '#3F6FB0', ease(seg(t, wa - .2, wa + .1))); P('prop_quill', 700, 1400, 260, { in: wa - .1, snd: 'pop', sway: .04 }); person(300, 1860, 30, FB, { in: t0 + .05, mood: 'happy', look: 1, key: 'fb' }); }
    else { office(t, wo - .3); const near = ease(seg(t, wh - .4, wh));
      person(lerp(220, 360, near), 1860, 30, FB, { in: wo - .2, mood: 'beam', look: 1, key: 'fb', aR: t > wh - .2 ? .2 : -1.2, talk: t < wpl - .4 ? talk(t) : 0 });
      person(lerp(820, 640, near), 1860, 32, AGENT, { in: wo - .1, mood: 'beam', look: -1, key: 'agent', aL: t > wh - .2 ? .2 : -1.2, talk: t > wpl - .4 ? talk(t) : 0 });
      if (t > wh) cue('shake', wh, 'pat', 500, 200); if (t > wpl) glow(500, 1450, 300, '#FFD27A', .45); }
    camEnd2();
  }
  function shDirector(t, lt) {   // as director he rehearsed the actor until it felt real; he felt the relief
    const t0 = t - lt, wd = WT('director', 'director'), wa = WT('director', 'actor'), wr = WT('director', 'relief');
    camBegin(540, 960, 1.0); hall(t); fg();
    label(700, 820, 360, 'DIRECTOR', '#B8463A', ease(seg(t, wd - .2, wd + .1))); if (t > wa - .2) label(700, 1060, 300, 'ACTOR', '#2F7A4A', ease(seg(t, wa - .2, wa + .1)));
    person(300, 1860, 30, FB, { in: t0 + .05, mood: t > wr ? 'beam' : 'happy', look: 1, key: 'fb' });
    if (t > wr - .2) { glow(300, 1500, 300, '#FFD27A', .5); cue('rel', wr, 'chime', 300, 300); }
    camEnd2();
  }
  function shCall(t, lt) {       // three days later the agent called: a deposit, at his price
    const t0 = t - lt, wc = WT('call', 'called'), wd = WT('call', 'deposit'), wp = WT('call', 'price');
    camBegin(540, 960, 1.0); livingRoom(t); fg();
    tally(t, 200, 700, 3, [t0 + .2, t0 + .35, t0 + .5], 120);
    if (t > wc - .2) P('prop_telephone', 760, 1600, 260, { in: wc - .2, snd: 'pop', rot: t < wd ? .06 * Math.sin(t * 40) : 0 });
    person(300, 1860, 30, FB, { in: t0 + .05, mood: t > wd ? 'joy' : 'surprised', look: 1, key: 'fb' });
    if (t > wd - .2) { P('prop_money', 760, 1150, 220, { in: wd - .2, snd: 'pop', sway: .04 }); cue('cash', wd, 'cash', 760, 300); }
    if (t > wp) glow(760, 1150, 260, '#FFD27A', .45);
    camEnd2();
  }
  function shSign(t, lt) {       // the next day he signed in the agent's office, held out his hand: "thank you, sir"
    const t0 = t - lt, ws = WT('sign', 'signed'), wh = WT('sign', 'hand'), near = ease(seg(t, wh - .4, wh));
    camBegin(540, 960, 1.0); office(t, t0);
    if (t > ws - .2) { P('prop_envelope', 560, 1440, 160, { in: ws - .2, snd: 'pop', sway: 0 }); P('prop_quill', 620, 1420, 140, { in: ws - .1, snd: false, sway: .02 }); }
    person(lerp(220, 360, near), 1860, 30, FB, { in: t0 + .05, mood: 'beam', look: 1, key: 'fb', aR: t > wh - .2 ? .2 : -1.2, talk: talk(t) });
    person(lerp(820, 640, near), 1860, 32, AGENT, { in: t0 + .1, mood: 'happy', look: -1, key: 'agent', aL: t > wh - .2 ? .2 : -1.2 });
    camEnd2();
  }
  function shPleasure(t, lt) {   // "it was a pleasure doing business with you." just like the scene
    const t0 = t - lt, wpl = WT('pleasure', 'pleasure'), wsc = WT('pleasure', 'scene');
    camBegin(540, 960, 1.04); office(t, t0, { still: true });
    person(360, 1860, 30, FB, { mood: 'joy', look: 1, key: 'fb', aR: .2 }); person(640, 1860, 32, AGENT, { mood: 'beam', look: -1, key: 'agent', aL: .2, talk: talk(t) });
    if (t > wpl) glow(500, 1450, 300, '#FFD27A', .45);
    if (t > wsc - .3) { P('island_cloud', 500, 950, 420, { in: wsc - .3, snd: 'pop', sway: .02 }); person(450, 900, 8, FB, { in: wsc - .2, mood: 'beam', key: 'cfb', snd: false }); person(560, 900, 8.5, AGENT, { in: wsc - .2, mood: 'beam', key: 'cag', snd: false }); cue('match', wsc, 'chime', 500, 300); }
    camEnd2();
  }
  function shJoy(t, lt) {        // the real joy wasn't the sale; it was the proof that it works
    const t0 = t - lt, wp = WT('joy', 'proof'), ww = WT('joy', 'works');
    camBegin(540, 960, 1.0); livingRoom(t); fg(); person(300, 1860, 30, FB, { in: t0 + .05, mood: t > ww ? 'beam' : 'happy', look: 1, key: 'fb' });
    if (t < wp - .3) P('life_coinbag', 740, 1550, 200, { in: t0 + .2, snd: 'pop', out: wp - .4 });
    else { P('bible_star', 740, 1150, 260, { in: wp - .3, snd: 'chime', sway: .05 }); glow(740, 1150, 300, '#FFD27A', .55); }
    if (t > ww) stars(740, 1150, t, ww);
    camEnd2();
  }
  function shLesson(t, lt) {     // he didn't accept the first letter; he rewrote it
    const t0 = t - lt, wr = WT('lesson', 'rewrote');
    camBegin(540, 960, 1.0); livingRoom(t); fg(); person(300, 1860, 30, FB, { in: t0 + .05, mood: t > wr ? 'beam' : 'determined', look: 1, key: 'fb' });
    letter(720, 1450, 320, t, t0 + .15, t > wr - .1 ? 'SOLD!' : 'WAIT', t > wr - .1 ? '#2F7A4A' : '#6B6B6B');
    if (t > wr - .1) { glow(720, 1250, 280, '#FFD27A', .45); cue('rw2', wr, 'whoosh', 720, 300); }
    camEnd2();
  }
  function shClose(t, lt) {      // what letter would you rewrite tonight?
    const t0 = t - lt, wl = WT('close', 'letter'), wr = WT('close', 'rewrite');
    camBegin(540, 960, 1.0); lotStreet(t, true); fg();
    if (t > wl - .3) { P('island_cloud', 780, 1250, 360, { in: wl - .3, snd: 'pop' }); letter(780, 1270, 170, t, wl - .2, null, null, { snd: false }); }
    if (t > wr - .2) glow(780, 1180, 220, '#FFD27A', .45);
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd2();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'accepting'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('lot') - .12, shLot], [S('reply') - .12, shReply], [S('rewrite') - .12, shRewrite], [S('producer') - .12, shProducer], [S('author') - .12, shAuthor], [S('director') - .12, shDirector], [S('call') - .12, shCall], [S('sign') - .12, shSign], [S('pleasure') - .12, shPleasure], [S('joy') - .12, shJoy], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
