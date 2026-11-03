window.CHEAP = true; window.FELT = true;
// Episode 37, flannelgraph cut: "Sold" (J.R. buys her son's warts) built from the felt cutout kit (kit/cutouts) on felt boards.
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
    if (window.CUEMODE || a <= 0) return; const key = txt + col;
    if (!SIGNS[key]) { const g = createGraphics(600, 220); g.pixelDensity(1); const c = g.drawingContext;
      c.fillStyle = '#3A2A22'; c.beginPath(); c.roundRect(14, 20, 572, 190, 24); c.fill(); c.fillStyle = '#F6F0E2'; c.beginPath(); c.roundRect(4, 6, 572, 190, 24); c.fill();
      c.fillStyle = col; c.beginPath(); c.roundRect(20, 22, 540, 158, 16); c.fill();
      c.fillStyle = '#F6F0E2'; c.font = 'bold 100px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 290, 104); SIGNS[key] = g; }
    flushBrush(); tint(255, 255 * a); image(SIGNS[key], x - w / 2, y - w * 110 / 600, w, w * 220 / 600); noTint();
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

  function livingRoom(t, night) {
    room(t, night ? [150, 140, 150] : [222, 200, 168], night ? [90, 64, 46] : [120, 80, 52]);
    P('room_window', 700, 880, 400, { sway: 0, tint: night ? [120, 120, 160] : null }); P('room_painting', 330, 740, 200, { sway: 0 }); P('room_clock', 890, 640, 110, { sway: .02 });
    P('room_lamp', 230, 1260, 380, { sway: 0 }); P('room_rug', 540, 1580, 900, { sx: 1.5, sy: .32, sway: 0 });
  }
  function kitchen(t) { room(t, [226, 214, 176], [150, 120, 90]); P('home_fridge', 300, 1240, 520, { sway: 0 }); P('home_stove', 560, 1240, 380, { sway: 0 }); P('room_window', 790, 900, 320, { sway: 0 }); P('home_kitchentable', 760, 1450, 300, { sway: 0 }); }
  function clinic(t) { room(t, [214, 226, 228], [170, 170, 176]); P('office_diploma', 420, 660, 170, { sway: 0 }); P('office_filecabinet', 270, 1240, 360, { sway: 0 }); P('office_watercooler', 860, 1250, 320, { sway: 0 }); P('room_bed', 700, 1330, 300, { sway: 0, tint: [235, 240, 248] }); }
  function homeStreet(t, o = {}) {
    board(o.night ? 'night' : 'day'); if (!o.night) { P('island_sun', 870, 460, 180, { sway: .02 }); P('island_cloud', 260, 520, 230, { sway: .02 }); } else P('island_moon', 860, 470, 110, { sway: .01 });
    street(t, o); const tn = o.night ? [150, 150, 170] : undefined;
    at('city_apartment', 160, 0, 600, { tint: tn }); at('life_house', 545, 0, 560, { tint: tn }); at('city_rowhouses', 960, 0, 560, { tint: tn });
  }
  const JR = { ...C.dreamer, name: 'jr', coat: '#3F8F8A', sleeve: '#3F8F8A', stripes: null, hair: '#5A3A24', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const SON = { ...C.dreamer, name: 'jrson', coat: '#E6B82A', sleeve: '#E6B82A', stripes: null, hair: '#B5643A', skin: '#EFCBA6' };
  const DOC = { ...C.skeptic, name: 'doc', coat: '#F3EBDC', sleeve: '#F3EBDC', lapel: '#D9D4C8', tie: '#3F6FB0', hat: null };
  const PSALM = { ...C.paul, name: 'psalmist', coat: '#7A4E8A', sleeve: '#7A4E8A', pants: '#7A4E8A', sash: '#E6B82A', hair: '#B5643A', hairStyle: 'curls', beard: .4, beardCol: '#B5643A', skin: '#E6B48C' };
  const OLD = { ...C.dreamer, name: 'oldw', coat: '#5E6B3A', sleeve: '#5E6B3A', stripes: null, hair: '#ECE8DF' };
  const BUYERS = ['#B8463A', '#3F6FB0', '#7A4E8A'].map((c, i) => ({ ...C.blake, name: 'buy' + i, coat: c, sleeve: c, lapel: '#F3EBDC', pants: '#3A3A44', hat: null, hair: ['#2B1E19', '#B5643A', '#3B2A22'][i], skin: ['#EFCBA6', '#C98E62', '#E6B48C'][i] }));
  const WARTS = [[-.55, -.5], [.5, -.8], [-.45, -1.3], [.6, -1.6], [-.6, -2.0], [.45, -2.3], [-.3, -.9], [.3, -1.25]];
  function warts(x, y, u, a = 1) {   // little felt bumps on the boy's legs
    if (window.CUEMODE || a <= .02) return; flushBrush(); push(); noStroke();
    for (const [dx, dy] of WARTS) { const r = u * .26; fill(30, 18, 12, 70 * a); ellipse(x + dx * u + 2, y + dy * u + 3, r * 2, r * 2); fill(150, 104, 70, 255 * a); ellipse(x + dx * u, y + dy * u, r * 2, r * 2); fill(186, 140, 100, 255 * a); ellipse(x + dx * u - r * .3, y + dy * u - r * .3, r * .8, r * .8); }
    pop();
  }
  function son(t, x, y, u, o = {}) { person(x, y, u, SON, { mood: 'neutral', look: -1, key: 'son', ...o }); if (o.in == null || t > o.in + .3) warts(x, y, u, o.wa == null ? 1 : o.wa); }
  function home(t, t0, o = {}) { livingRoom(t, o.board === 'night'); P('home_sofa', 820, 1390, 320, { sway: 0 }); }

  // ---------- shots ----------
  function shHook(t, lt) {   // warts for years; she bought them; a month later all gone
    const t0 = t - lt, wb = WT('hook', 'bought'), wg = WT('hook', 'gone'), fade = 1 - ease(seg(t, wg - 1.2, wg));
    camBegin(540, 960, 1.0); home(t, t0);
    son(t, 560, 1545, 22, { in: t0 + .05, mood: t > wg ? 'beam' : 'sad', wa: fade });
    if (t > wb - .2 && t < wg - 1.2) P('life_coinbag', 300, 1300, 200, { in: wb - .2, snd: 'pop', out: wg - 1.3 });
    if (t > wg - .1) { glow(560, 1300, 260, '#FFD27A', .5); cue('gone', wg, 'sparkle', 560, 300); }
    camEnd();
  }
  function shVerse(t, lt) {      // Psalm 33:9: he spake, and it was done; he commanded, and it stood fast
    const t0 = t - lt, wd = WT('verse', 'done'), wf = WT('verse', 'fast');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(620, 1000, 600, '#FFD27A', .2 + .5 * ease(seg(t, wf - .2, wf + .6)));
    if (t > wd - .2) P('bible_star', 760, 900, 200, { in: wd - .2, snd: 'chime', sway: .05 });
    person(330, 1840, 40, PSALM, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'psalm', talk: talk(t) });
    camEnd();
  }
  function shMeaning(t, lt) {    // he said it, and it stood
    const t0 = t - lt, ws = WT('meaning', 'stood');
    camBegin(540, 960, 1.0); livingRoom(t); P('home_sofa', 820, 1390, 320, { sway: 0 }); if (t > ws - .2) { P('bible_star', 700, 1050, 170, { in: ws - .2, snd: 'sparkle', sway: .05 }); glow(700, 980, 240, '#FFD27A', .5); }
    host(t, 420, 1520, 22, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shSon(t, lt) {        // ten years old; lots of big warts on his legs; bothered him for years
    const t0 = t - lt, ww = WT('son', 'warts'), wb = WT('son', 'bothered');
    camBegin(540, 960, 1.0 + .08 * ease(seg(t, ww - .3, ww + 1))); home(t, t0);
    son(t, 540, 1545, 22, { in: t0 + .05, mood: t > wb ? 'sad' : 'neutral', look: 0 });
    if (t > wb - .2) P('sky_raincloud', 540, 1000, 200, { in: wb - .2, sway: .03, snd: 'pop' });
    camEnd();
  }
  function shDoctor(t, lt) {     // he wanted them gone, but refused to see a doctor
    const t0 = t - lt, wd = WT('doctor', 'doctor'), wr = WT('doctor', 'refused');
    camBegin(540, 960, 1.0); clinic(t);
    son(t, 380, 1545, 22, { mood: t > wr ? 'determined' : 'warm', look: t > wr ? (Math.sin(t * 7) > 0 ? 1 : -1) : 1 });
    if (t > wd - .3) person(800, 1530, 23, DOC, { in: wd - .3, mood: 'neutral', look: -1, key: 'doc' });
    camEnd();
  }
  function shTale(t, lt) {       // since she was a little girl: an old wives' tale; buy a wart and it goes away
    const t0 = t - lt, wt = WT('tale', 'tale'), wb = WT('tale', 'buy'), wa = WT('tale', 'away');
    camBegin(540, 960, 1.0); kitchen(t); person(300, 1530, 22, JR, { in: t0 + .05, mood: 'wise', look: 1, key: 'jr' });
    if (t > wt - .4) { P('island_cloud', 700, 950, 460, { in: wt - .4, snd: 'pop', sway: .02 }); person(640, 920, 9, OLD, { in: wt - .3, mood: 'wise', key: 'oldc', snd: false, talk: talk(t) }); }
    if (t > wb - .2) P('prop_money', 790, 890, 110, { in: wb - .2, snd: 'pop', sway: .04 });
    if (t > wa - .2) cue('away', wa, 'sparkle', 740, 300);
    camEnd();
  }
  function shGame(t, lt) {       // a game: she would pay him for every wart
    const t0 = t - lt, wg = WT('game', 'game'), wp = WT('game', 'pay');
    camBegin(540, 960, 1.0); home(t, t0, { still: true });
    person(300, 1530, 22, JR, { in: t0 + .05, mood: 'happy', look: 1, key: 'jr', talk: talk(t) }); son(t, 640, 1545, 22, { mood: t > wp ? 'happy' : 'neutral' });
    if (t > wp - .2) { P('life_coinbag', 470, 1350, 180, { in: wp - .2, snd: 'pop', sway: .03 }); cue('cash', wp, 'cash', 470, 300); }
    if (t > wg) glow(470, 1350, 200, '#FFD27A', .35);
    camEnd();
  }
  function shPrice(t, lt) {      // they agreed on a price he thought was fair
    const t0 = t - lt, wa = WT('price', 'agreed'), wf = WT('price', 'fair');
    camBegin(540, 960, 1.04); home(t, t0, { still: true });
    person(300, 1530, 22, JR, { mood: 'happy', look: 1, key: 'jr', aR: t > wf ? .5 : -1.2 }); son(t, 640, 1545, 22, { mood: t > wf ? 'beam' : 'happy', aL: t > wf ? .5 : -1.2 });
    P('prop_money', 470, 1350, 200, { in: wa - .2, snd: 'pop', sway: .04 }); if (t > wf) { glow(470, 1350, 220, '#FFD27A', .5); cue('fair', wf, 'chime', 470, 300); }
    camEnd();
  }
  function shWords(t, lt) {      // "these warts aren't yours anymore. I've bought them, and they belong to me."
    const t0 = t - lt, wb = WT('words', 'bought'), wm = WT('words', 'me');
    camBegin(540, 960, 1.0); home(t, t0); glow(540, 1300, 520, '#FFE2A8', .3);
    person(300, 1530, 22, JR, { in: t0 + .05, mood: 'warm', look: 1, key: 'jr', talk: talk(t), aR: t > wb ? .5 : -1.2 }); son(t, 680, 1545, 22, { in: t0 + .1, mood: 'surprised' });
    if (t > wb - .2) { sign(560, 900, 420, 'SOLD', '#B8463A', ease(seg(t, wb - .2, wb + .2))); cue('sold', wb, 'pat', 560, 300); }
    if (t > wm - .1) glow(300, 1250, 240, '#FFD27A', .45);
    camEnd();
  }
  function shGoneSaid(t, lt) {   // they will disappear: a day, two days, a month
    const t0 = t - lt, wd = WT('gone', 'day'), w2 = WT('gone', 'two'), wmo = WT('gone', 'month');
    camBegin(540, 960, 1.0); home(t, t0, { still: true, board: 'night' }); P('island_moon', 820, 1130, 60, { in: t0 + .1, snd: false });
    person(300, 1530, 22, JR, { mood: 'warm', look: 1, key: 'jr', talk: talk(t) }); son(t, 640, 1545, 22, { mood: 'warm' });
    tally(t, 300, 760, 3, [wd - .1, w2 - .1, wmo - .1], 240);
    camEnd();
  }
  function shTen(t, lt) {        // within ten days, they started to fade
    const t0 = t - lt, wt = WT('ten', 'ten'), wf = WT('ten', 'fade');
    camBegin(540, 960, 1.06); home(t, t0, { still: true });
    son(t, 540, 1545, 22, { mood: t > wf ? 'happy' : 'neutral', look: 0, wa: 1 - .55 * ease(seg(t, wf - .3, wf + 1)) });
    tally(t, 130, 760, 10, Array.from({ length: 10 }, (_, i) => wt - .3 + i * .08), 92);
    camEnd();
  }
  function shMonth(t, lt) {      // after one month, every single wart was gone
    const t0 = t - lt, wg = WT('month', 'gone');
    camBegin(540, 960, 1.06); home(t, t0, { still: true });
    son(t, 540, 1545, 22, { mood: t > wg ? 'joy' : 'happy', look: 0, wa: .45 * (1 - ease(seg(t, wg - .8, wg))), aL: t > wg ? .7 : -1.2, aR: t > wg ? .7 : -1.2 });
    if (t > wg) { glow(540, 1300, 300, '#FFD27A', .55); stars(540, 1220, t, wg); cue('allgone', wg, 'sparkle', 540, 400); }
    camEnd();
  }
  function shOthers(t, lt) {     // she bought warts from others: five, seven, ten cents; every one disappeared
    const t0 = t - lt, ws = [WT('others', 'five'), WT('others', 'seven'), WT('others', 'ten')], wd = WT('others', 'disappeared');
    camBegin(540, 960, 1.0); homeStreet(t); P('street_tree', 990, 1470, 600, { sway: .006 });
    person(220, 1530, 22, JR, { in: t0 + .05, mood: 'warm', look: 1, key: 'jr', aR: .4 });
    for (let i = 0; i < 3; i++) { person(480 + i * 210, 1535, 20, BUYERS[i], { in: t0 + .15 + i * .1, mood: t > wd ? 'beam' : 'neutral', look: -1, key: 'b' + i }); if (t > ws[i] - .2) P('prop_money', 480 + i * 210, 1060, 110, { in: ws[i] - .2, snd: 'pop', sway: .04 }); }
    if (t > wd) { glow(690, 1250, 380, '#FFD27A', .45); cue('dis', wd, 'sparkle', 690, 400); }
    camEnd();
  }
  function shLesson(t, lt) {     // she didn't fight the warts; she changed who they belonged to
    const t0 = t - lt, wb = WT('lesson', 'belonged');
    camBegin(540, 960, 1.0); home(t, t0);
    person(320, 1530, 22, JR, { in: t0 + .05, mood: t > wb ? 'beam' : 'warm', look: 1, key: 'jr' }); son(t, 700, 1545, 22, { in: t0 + .1, mood: 'beam', wa: 0 });
    if (t > wb - .2) { sign(520, 950, 380, 'SOLD', '#B8463A', ease(seg(t, wb - .2, wb + .2))); glow(520, 950, 260, '#FFD27A', .4); }
    camEnd();
  }
  function shClose(t, lt) {      // what are you still holding onto that isn't yours anymore?
    const t0 = t - lt, wh = WT('close', 'holding'), wy = WT('close', 'yours');
    camBegin(540, 960, 1.0); homeStreet(t, { night: true }); P('city_streetlamp', 860, 1480, 640, { sway: .003 }); glow(860, 880, 220, '#FFE2A8', .4);
    if (t > wh - .3) { P('island_cloud', 760, 1000, 320, { in: wh - .3, snd: 'pop' }); }
    if (t > wy - .2) { sign(760, 980, 240, 'SOLD', '#B8463A', ease(seg(t, wy - .2, wy + .2))); glow(760, 960, 220, '#FFD27A', .45); }
    host(t, 420, 1520, 22, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('son') - .12, shSon], [S('doctor') - .12, shDoctor], [S('tale') - .12, shTale], [S('game') - .12, shGame], [S('price') - .12, shPrice], [S('words') - .12, shWords], [S('gone') - .12, shGoneSaid], [S('ten') - .12, shTen], [S('month') - .12, shMonth], [S('others') - .12, shOthers], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
