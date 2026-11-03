window.CHEAP = true; window.FELT = true;
// Episode 23, flannelgraph cut: "The Dance Teacher" (E.O.L. Jr., four scenes in a row) built from the felt cutout kit (kit/cutouts) on felt boards.
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





















  const EOL = { ...C.blake, name: 'eol', coat: '#3F6FB0', sleeve: '#3F6FB0', lapel: '#F3EBDC', pants: '#22222A', hat: null, hair: '#3B2A22', skin: '#EFCBA6' };
  const GIRL = { ...C.dreamer, name: 'girl', coat: '#B8463A', sleeve: '#B8463A', stripes: null, hair: '#E6B82A', skin: '#EFCBA6' };
  const DANCER = { ...C.dreamer, name: 'dancer', coat: '#7A4E8A', sleeve: '#7A4E8A', stripes: null, hair: '#2B1E19', skin: '#E6B48C' };
  const PARTNER = { ...C.blake, name: 'partner', coat: '#5E6B3A', sleeve: '#5E6B3A', hat: 'fedora', hatCol: '#3A4F36', band: '#C9963A' };
  const BOSS = { ...C.skeptic, name: 'boss', coat: '#22222A', sleeve: '#22222A', hat: null };
  const TEACH = { ...C.skeptic, name: 'teacher', coat: '#8C3B3B', sleeve: '#8C3B3B', hat: null };
  const MURRAY = { ...C.blake, name: 'murray', coat: '#22222A', sleeve: '#22222A', lapel: '#E6B82A', pants: '#22222A', hat: null, hair: '#ECE8DF', skin: '#EFCBA6' };
  const SAVIOR = { ...C.paul, name: 'jesus', coat: '#F3EBDC', sleeve: '#F3EBDC', pants: '#F3EBDC', sash: '#B8463A', skin: '#C98E62', hair: '#3B2A22', hairStyle: 'neat', beard: .5, beardCol: '#3B2A22', flare: .14 };
  const CROWD = ['#3F6FB0', '#B8463A', '#3F8F8A', '#C9963A', '#7A4E8A', '#5E6B3A'].map((c, i) => ({ ...C.dreamer, name: 'crowd' + i, coat: c, sleeve: c, stripes: null, hair: ['#2B1E19', '#B5643A', '#E6B82A', '#5A3A24'][i % 4] }));
  const SIGNS = {};
  function sign(x, y, w, txt, col = '#3F6FB0', a = 1) {   // a felt sign with one word
    if (window.CUEMODE || a <= 0) return; const key = txt + col;
    if (!SIGNS[key]) { const g = createGraphics(600, 220); g.pixelDensity(1); const c = g.drawingContext;
      c.fillStyle = '#3A2A22'; c.beginPath(); c.roundRect(14, 20, 572, 190, 24); c.fill(); c.fillStyle = '#F6F0E2'; c.beginPath(); c.roundRect(4, 6, 572, 190, 24); c.fill();
      c.fillStyle = col; c.beginPath(); c.roundRect(20, 22, 540, 158, 16); c.fill();
      c.fillStyle = '#F6F0E2'; c.font = 'bold 100px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 290, 104); SIGNS[key] = g; }
    flushBrush(); tint(255, 255 * a); image(SIGNS[key], x - w / 2, y - w * 110 / 600, w, w * 220 / 600); noTint();
  }
  function studio(x, y, s, t, tin, label = 'DANCE', col = '#3F6FB0') { if (t < tin) return; P('city_brownstone', x, y, s, { in: tin }); if (t > tin + .2) sign(x, y - s * .62, s * .7, label, col, ease(seg(t, tin + .2, tin + .5))); }
  const BX = 540, BBY = 1760, BH = 600;
  function hisBed(t, t0, o = {}) {
    board('night'); P('room_window', 880, 1250, 260, { in: o.still ? null : stagger(t0, 0) }); P('island_moon', 900, 1230, 50, { in: o.still ? null : stagger(t0, 1), snd: false });
    P('room_bed', BX, BBY, BH, { in: o.still ? null : stagger(t0, 2), sway: .002 }); const tin = o.still ? -9 : stagger(t0, 3);
    person(BX, BBY - BH * .44, 11, EOL, { in: o.still ? null : tin, mood: o.mood || 'sleepy', key: 'ebed', snd: false, aL: -1.2, aR: -1.2 });
    if (T > tin + .4) piecePart('room_bed', BX, BBY, BH, .43, 1);
  }
  function dream(x, y, s, t, tin, inner) { if (t < tin) return; P('island_cloud', x, y, s, { in: tin, snd: 'pop', sway: .02 }); if (t > tin + .1) inner(x, y, s); }
  function crowd(t, y0, u, tin, clap = false) { for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { const x = 120 + i * 168 + r * 84; if (x > 1000) continue;
    person(x, y0 + r * 90, u, CROWD[(i + r * 2) % 6], { in: tin == null ? null : tin + (i + r) * .05, mood: clap ? 'beam' : 'happy', look: 0, lookY: -.4, key: 'cr' + r + i, snd: false, aL: clap ? .5 + .3 * Math.sin(t * 14 + i) : -1.2, aR: clap ? .5 + .3 * Math.sin(t * 14 + i + 1) : -1.2 }); } }

  // ---------- shots ----------
  function shHook(t, lt) {   // he came to prove Neville wrong; then it happened four times in a row
    const t0 = t - lt, ww = WT('hook', 'wrong'), wf = WT('hook', 'four');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wf - .3) { tally(t, 340, 900, 4, [wf - .3, wf - .15, wf, wf + .15], 130); glow(540, 900, 300, '#FFD27A', .5); }
    person(540, 1860, 32, EOL, { in: t0 + .05, mood: t > wf ? 'surprised' : 'skeptical', look: 0, key: 'eol', aL: t < wf ? -.2 : .6, aR: t < wf ? -.2 : .6 });
    if (t < ww + .5) person(880, 1860, 26, C.neville, { in: t0 + .2, mood: 'warm', look: -1, key: 'nev' });
    camEnd();
  }
  function shVerse(t, lt) {      // Jesus: if thou canst believe, all things are possible
    const t0 = t - lt, wb = WT('verse', 'believe'), wp = WT('verse', 'possible');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, wp - .2, wp + .6)));
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (t > wp - .2) P('bible_star', 800, 1000, 200, { in: wp - .2, snd: 'chime', sway: .04 });
    person(420, 1840, 40, SAVIOR, { in: stagger(t0, 1), mood: 'warm', aL: .8, look: .6, key: 'jesus', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // if thou canst; even a skeptic can start
    const t0 = t - lt, ws = WT('meaning', 'skeptic'), wst = WT('meaning', 'start');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > ws - .2) person(820, 1860, 24, EOL, { in: ws - .2, mood: t > wst ? 'hopeful' : 'skeptical', look: -1, key: 'eol' });
    if (t > wst - .1) glow(820, 1500, 260, '#FFD27A', .5);
    host(t, 360, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shStart(t, lt) {      // nineteen, a dance teacher, stuck; a young woman brings him; ridiculous
    const t0 = t - lt, ws = WT('start', 'stuck'), ww = WT('start', 'woman'), wr = WT('start', 'ridiculous');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1300, 520, '#FFE2A8', .3);
    if (t < ww - .3) { const sw = Math.sin(t * 4); person(400 + 30 * sw, 1860, 30, EOL, { in: t0 + .05, mood: t > ws ? 'neutral' : 'happy', look: 1, key: 'eol', aR: .4 }); person(640 + 30 * sw, 1860, 28, DANCER, { in: t0 + .1, mood: 'happy', look: -1, key: 'dancer', aL: .4 });
      if (t > ws - .2) P('sky_raincloud', 520, 1060, 220, { in: ws - .2, sway: .03, snd: 'pop' }); }
    else { person(380, 1860, 30, EOL, { in: ww - .3, mood: t > wr ? 'skeptical' : 'neutral', look: 1, key: 'eol2', aL: t > wr ? -.2 : -1.2, aR: t > wr ? -.2 : -1.2 }); person(700, 1860, 28, GIRL, { in: ww - .2, mood: 'happy', look: -1, key: 'girl', talk: talk(t) }); }
    camEnd();
  }
  function shWant(t, lt) {       // his own Arthur Murray studio; no money; very hard to get
    const t0 = t - lt, ws = WT('want', 'studio'), wm = WT('want', 'money');
    camBegin(540, 1000, 1.0); board('day');
    dream(700, 1020, 460, t, ws - .3, (x, y, s) => { P('city_brownstone', x, y + s * .06, s * .36, { in: ws - .2, snd: false }); sign(x, y - s * .2, s * .32, 'DANCE', '#3F6FB0'); });
    if (t > wm - .2) P('sky_raincloud', 280, 1050, 200, { in: wm - .2, sway: .03, snd: 'pop' });
    person(300, 1860, 30, EOL, { in: t0 + .05, mood: t > wm ? 'worried' : 'hopeful', look: 1, lookY: -.4, key: 'eol' });
    camEnd();
  }
  function shFirst(t, lt) {      // asleep running his own studio; three weeks; a call from Reno; a partnership
    const t0 = t - lt, ww = WT('first', 'weeks'), wc = WT('first', 'called'), wp = WT('first', 'partnership'), wb = WT('first', 'borrowed');
    camBegin(540, 1050, 1.04);
    if (t < wc - .3) { hisBed(t, t0, { mood: 'happy' }); dream(400, 1040, 320, t, t0 + .6, (x, y, s) => { P('city_brownstone', x, y + s * .06, s * .36, { in: t0 + .7, snd: false }); sign(x, y - s * .2, s * .32, 'DANCE'); });
      if (t > ww - .3) tally(t, 380, 760, 3, [ww - .3, ww - .15, ww], 140); }
    else { board('day'); studio(760, 1300, 480, t, wc - .3, 'RENO', '#8C3B3B');
      person(560, 1860, 30, PARTNER, { in: wc - .2, mood: t > wp ? 'beam' : 'worried', look: -1, key: 'partner', aL: t > wp ? .45 + .12 * Math.sin(t * 9) : -1.2 });
      person(280, 1860, 30, EOL, { in: wc - .1, mood: t > wp ? 'joy' : 'surprised', look: 1, key: 'eol', aR: t > wp ? .45 + .12 * Math.sin(t * 9) : -1.2, hold: t > wb - .2 ? (x, y, u) => P('prop_suitcase', x, y + u * 1.6, u * 2.4, { sway: .02, snd: false }) : null });
      if (t > wp) cue('part', wp, 'sparkle', 420, 300); }
    camEnd();
  }
  function shSecond(t, lt) {     // the boss praises Reno, suggests a second studio; partner leaves for Bakersfield
    const t0 = t - lt, wp = WT('second', 'praising'), wb = WT('second', 'bakersfield'), ww = WT('second', 'word'), go = ease(seg(t, wb, wb + 1.4));
    camBegin(540, 1000, 1.0);
    if (t < wb - .5) { hisBed(t, t0, { mood: 'happy' }); if (t > wp - .3) dream(420, 1040, 340, t, wp - .3, (x, y, s) => { person(x - s * .12, y + s * .14, s * .026, BOSS, { in: wp - .2, mood: 'beam', look: 1, key: 'bc', snd: false, aL: .5 }); person(x + s * .12, y + s * .14, s * .026, EOL, { in: wp - .1, mood: 'beam', look: -1, key: 'ec', snd: false }); }); }
    else { board('day'); studio(760, 1300, 480, t, -9, 'RENO', '#8C3B3B');
      person(lerp(560, -150, go), 1860, 30, PARTNER, { in: wb - .5, mood: 'happy', look: -1, key: 'partner', hold: (x, y, u) => P('prop_suitcase', x, y + u * 1.6, u * 2.4, { sway: .02, snd: false }) });
      person(400, 1860, 30, EOL, { in: wb - .4, mood: t > ww ? 'beam' : 'surprised', look: -1, key: 'eol' }); if (t > ww) { glow(760, 1100, 300, '#FFD27A', .5); cue('word', ww, 'sparkle', 760, 300); } }
    camEnd();
  }
  function shBet(t, lt) {        // another teacher bets his little studio can't be the convention's main topic
    const t0 = t - lt, wb = WT('bet', 'bet'), wm = WT('bet', 'months');
    camBegin(540, 1000, 1.0); board('day'); studio(760, 1300, 360, t, t0 + .05, 'RENO', '#8C3B3B');
    person(320, 1860, 30, TEACH, { in: t0 + .05, mood: 'skeptical', look: 1, key: 'teach', talk: talk(t), aR: t > wb ? .5 : -1.2 });
    person(560, 1860, 30, EOL, { in: t0 + .1, mood: 'determined', look: -1, key: 'eol' });
    if (t > wm - .3) tally(t, 380, 760, 3, [wm - .3, wm - .15, wm], 140);
    camEnd();
  }
  function shStage(t, lt) {      // every night: a huge crowd, nervous, then accepted; applause; Murray shakes his hand
    const t0 = t - lt, wn = WT('stage', 'nervous'), wa = WT('stage', 'applause'), wm = WT('stage', 'murray');
    camBegin(540, 1050, 1.04); hisBed(t, t0, { mood: t > wa ? 'beam' : t > wn ? 'worried' : 'happy' });
    dream(540, 1090, 500, t, t0 + .5, (x, y, s) => { person(x - 60, y - s * .15, s * .02, EOL, { in: t0 + .6, mood: t > wa ? 'beam' : 'worried', look: 1, key: 'es', snd: false, aR: t > wm ? .45 + .12 * Math.sin(t * 9) : -1.2 });
      if (t > wm - .2) person(x + 60, y - s * .15, s * .02, MURRAY, { in: wm - .2, mood: 'warm', look: -1, key: 'ms', snd: false, aL: .45 + .12 * Math.sin(t * 9) });
      for (let i = 0; i < 5; i++) person(x - 140 + i * 70, y + s * .01, s * .009, CROWD[i], { in: t0 + .7 + i * .05, mood: t > wa ? 'beam' : 'happy', key: 'cs' + i, snd: false }); });
    if (t > wa) { glow(540, 1090, 320, '#FFD27A', .5); cue('clap', wa, 'sparkle', 540, 300); }
    camEnd();
  }
  function shHappened(t, lt) {   // the studio is the main topic; he's on that stage; the teacher still grumbles
    const t0 = t - lt, wst = WT('happened', 'stage'), wt = WT('happened', 'teacher');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1100, 460, '#FFD27A', .5);
    P('room_desk', 540, 1300, 300, { in: t0 + .05 });
    person(540, 1130, 22, EOL, { in: t0 + .1, mood: 'beam', look: 0, key: 'eol', talk: talk(t), aR: .5 });
    crowd(t, 1760, 13, t0 + .2, t > wst);
    if (t > wt - .2) person(940, 1500, 20, TEACH, { in: wt - .2, mood: 'skeptical', look: -1, key: 'teach', aL: -.2, aR: -.2 });
    camEnd();
  }
  function shFranchise(t, lt) {  // night after night, a studio in a big city; three weeks; Murray calls; a million and a half
    const t0 = t - lt, ww = WT('franchise', 'weeks'), wc = WT('franchise', 'called'), wm = WT('franchise', 'million');
    camBegin(540, 1050, 1.04);
    if (t < wc - .3) { hisBed(t, t0, { mood: 'happy' }); dream(400, 1040, 340, t, t0 + .4, (x, y, s) => P('city_skyscraper', x, y + s * .06, s * .5, { in: t0 + .5, snd: false, sway: 0 }));
      if (t > ww - .3) tally(t, 380, 760, 3, [ww - .3, ww - .15, ww], 140); }
    else { board('day'); P('city_skyscraper', 760, 1230, 760, { in: wc - .3, sway: .004 }); P('city_rowhouses', 220, 1400, 420, { in: wc - .2 });
      person(360, 1860, 30, EOL, { in: wc - .3, mood: t > wm ? 'joy' : 'surprised', look: 1, key: 'eol', hold: (x, y, u) => P('prop_telephone', x, y + u, u * 2.6, { sway: .02, snd: false }) });
      if (t > wm - .1) { glow(760, 1100, 420, '#FFD27A', .6); cue('city', wm, 'sparkle', 760, 300); } }
    camEnd();
  }
  function shLesson(t, lt) {     // three weeks, almost every time; he kept falling asleep in the next scene
    const t0 = t - lt, ws = WT('lesson', 'scene');
    camBegin(540, 1050, 1.04); hisBed(t, t0, { mood: 'happy' });
    tally(t, 380, 760, 3, [t0 + .3, t0 + .5, t0 + .7], 140);
    if (t > ws - .3) { dream(400, 1040, 320, t, ws - .3, (x, y, s) => { P('city_brownstone', x, y + s * .06, s * .36, { in: ws - .2, snd: false }); sign(x, y - s * .2, s * .32, 'NEXT', '#2F7A4A'); }); glow(400, 1040, 260, '#FFD27A', .5); }
    camEnd();
  }
  function shClose(t, lt) {      // what's your next scene?
    const t0 = t - lt, wn = WT('close', 'next');
    camBegin(540, 1000, 1.0); board('night'); if (t > wn - .3) { P('island_cloud', 780, 1050, 300, { in: wn - .3, snd: 'pop' }); glow(780, 1050, 220, '#FFD27A', .5); }
    host(t, 380, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'scene'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('start') - .12, shStart], [S('want') - .12, shWant], [S('first') - .12, shFirst], [S('second') - .12, shSecond], [S('bet') - .12, shBet], [S('stage') - .12, shStage], [S('happened') - .12, shHappened], [S('franchise') - .12, shFranchise], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
