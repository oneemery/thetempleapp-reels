window.CHEAP = true; window.FELT = true;
// Episode 22, flannelgraph cut: "The Piano" (R.O. finds her furniture in one day) built from the felt cutout kit (kit/cutouts) on felt boards.
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




















  const RO = { ...C.dreamer, name: 'ro', coat: '#8C3B3B', sleeve: '#8C3B3B', stripes: null, hair: '#3B2A22', skin: '#EFCBA6', torso: 7.4, leg: 4.6, w: 4.6 };
  const MAID = { ...C.dreamer, name: 'maid', coat: '#22222A', sleeve: '#22222A', stripes: null, hair: '#5A3A24', skin: '#C98E62' };
  const KIDA = { ...C.dreamer, name: 'kida', coat: '#3F6FB0', sleeve: '#3F6FB0', stripes: null, hair: '#3B2A22', skin: '#EFCBA6' };
  const KIDB = { ...KIDA, name: 'kidb', coat: '#E6B82A', sleeve: '#E6B82A' };
  const SUPER = { ...C.skeptic, name: 'super', coat: '#5E6B3A', sleeve: '#5E6B3A', hat: null };
  const COP = { ...C.blake, name: 'cop', coat: '#2E3A52', sleeve: '#2E3A52', lapel: '#E6B82A', pants: '#2E3A52', hat: 'fedora', hatCol: '#2E3A52', band: '#E6B82A' };
  const DET = { ...C.blake, name: 'det', coat: '#A88B5E', sleeve: '#A88B5E', lapel: '#7A6040', pants: '#5A4636', hat: 'fedora', hatCol: '#5A4636', band: '#22222A' };
  const SAVIOR = { ...C.paul, name: 'jesus', coat: '#F3EBDC', sleeve: '#F3EBDC', pants: '#F3EBDC', sash: '#B8463A', skin: '#C98E62', hair: '#3B2A22', hairStyle: 'neat', beard: .5, beardCol: '#3B2A22', flare: .14 };
  const FELT = {};
  function felt(key, x, y, w, h, draw, a = 1) {
    if (window.CUEMODE || a <= 0) return;
    if (!FELT[key]) { const g = createGraphics(400, Math.round(400 * h / w)); g.pixelDensity(1); draw(g.drawingContext, 400, Math.round(400 * h / w)); FELT[key] = g; }
    flushBrush(); tint(255, 255 * a); image(FELT[key], x - w / 2, y - h / 2, w, h); noTint();
  }
  const rr = (c, x, y, w, h, r, col) => { c.fillStyle = col; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); };
  function piano(x, y, w, a = 1, pics = true) {   // a felt upright piano with the children's pictures on top
    felt('piano' + (pics ? 'p' : ''), x, y, w, w * .9, (c, W, H) => { rr(c, 14, 70, W - 22, H - 78, 18, '#3A2A22'); rr(c, 4, 60, W - 22, H - 78, 18, '#F6F0E2'); rr(c, 18, 74, W - 50, H - 106, 12, '#2B1E19');
      rr(c, 40, H * .5, W - 94, 54, 6, '#F6F0E2'); c.fillStyle = '#2B1E19'; for (let i = 0; i < 12; i++) c.fillRect(56 + i * 24, H * .5, 10, 30);
      rr(c, 40, H * .5 + 70, 24, H * .3, 6, '#3A2A22'); rr(c, W - 90, H * .5 + 70, 24, H * .3, 6, '#3A2A22');
      if (pics) { [[70, '#C9963A'], [170, '#B8463A'], [260, '#3F8F8A']].forEach(([px, col]) => { rr(c, px, 10, 70, 70, 6, '#F6F0E2'); rr(c, px + 8, 18, 54, 54, 4, col); c.fillStyle = '#EFCBA6'; c.beginPath(); c.arc(px + 35, 40, 12, 0, 7); c.fill(); }); } }, a);
  }
  function sitIn(t, cx, by, h, spec, o = {}) { P('room_armchair', cx, by, h, { in: o.in, sway: .003 }); person(cx, by - h * .22, o.u || 22, spec, o); if (T > (o.in ?? -9) + .4) piecePart('room_armchair', cx, by, h, .58, 1); }
  function home(t, t0, o = {}) {   // her furnished apartment: a painting, the piano with the pictures, her chair
    board('plum'); glow(540, 1300, 520, '#FFE2A8', .3 + (o.warm || 0)); const e = i => o.still ? null : stagger(t0, i);
    P('room_painting', 300, 1000, 200, { in: e(0) }); if (T > (o.still ? -9 : e(1))) piano(780, 1620, 420, 1);
    if (!o.sit) P('room_armchair', 320, 1820, 520, { in: e(2), sway: .003 });
  }
  function emptyRoom(t, t0) { board('plum'); glow(540, 1300, 520, '#B8C0CC', .2); P('room_window', 540, 1080, 300, { in: t0 + .05 }); }

  // ---------- shots ----------
  function shHook(t, lt) {   // police and detectives searched the warehouses; she found it in one day, eyes closed
    const t0 = t - lt, wd = WT('hook', 'detectives'), wf = WT('hook', 'found'), we = WT('hook', 'closed');
    camBegin(540, 1000, 1.0);
    if (t < wf - .3) { board('day'); P('city_brownstone', 260, 1300, 460, { in: t0 + .05, tint: [190, 190, 200] }); P('city_apartment', 800, 1300, 520, { in: t0 + .1, tint: [190, 190, 200] });
      person(380, 1860, 30, COP, { in: t0 + .1, mood: 'determined', look: Math.sin(t * 4) > 0 ? 1 : -1, key: 'cop' }); if (t > wd - .2) person(700, 1860, 30, DET, { in: wd - .2, mood: 'skeptical', look: Math.sin(t * 3) > 0 ? 1 : -1, key: 'det' }); }
    else { home(t, wf - .3, { warm: t > we ? .3 : 0, sit: true }); sitIn(t, 320, 1820, 520, RO, { in: wf - .2, mood: t > we ? 'sleepy' : 'hopeful', look: .4, key: 'ro', snd: false }); if (t > we) { glow(540, 1400, 480, '#FFD27A', .5); cue('eyes', we, 'sparkle', 540, 300); } }
    camEnd();
  }
  function shVerse(t, lt) {      // Luke 15: the woman who lost a coin; rejoice with me, I have found it
    const t0 = t - lt, wc = WT('verse', 'coin'), wf = WT('verse', 'found'), wr = WT('verse', 'rejoice');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, wr - .2, wr + .6)));
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (t > wc - .2) P('life_coinbag', 780, 980, 150, { in: wc - .2, snd: 'pop', tint: t < wf ? [150, 150, 160] : null, sway: .04 });
    if (t > wf) glow(780, 980, 200, '#FFD27A', .7);
    person(420, 1840, 40, SAVIOR, { in: stagger(t0, 1), mood: 'warm', aL: .8, look: .6, key: 'jesus', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // lost things can be found; not always by looking harder
    const t0 = t - lt, wf = WT('meaning', 'found'), wh = WT('meaning', 'harder');
    camBegin(540, 1000, 1.0); board('plum'); if (t > wf - .2) { P('life_coinbag', 780, 1100, 160, { in: wf - .2, snd: 'pop' }); glow(780, 1100, 200, '#FFD27A', .6); }
    host(t, 360, 1830, 38, { in: t0 + .02, mood: t > wh ? 'warm' : 'neutral', look: .5, lookY: t > wh - .3 && t < wh + .6 ? .4 : 0 });
    camEnd();
  }
  function shTrip(t, lt) {       // she takes her children to Europe for a year; leaves the apartment with her maid
    const t0 = t - lt, we = WT('trip', 'europe'), wm = WT('trip', 'maid'), go = ease(seg(t, we - .2, we + 2));
    camBegin(540, 1000, 1.0);
    if (t < wm - .5) { board('day'); P('island_waves', 540, 2000, 1100, { in: t0 + .05, sway: .01 }); P('city_liner', lerp(700, 380, go), 1560, 600, { in: t0 + .1, sway: .015 });
      person(lerp(880, 560, go), 1420, 12, RO, { in: t0 + .2, mood: 'happy', look: -1, key: 'ros', snd: false }); person(lerp(930, 610, go), 1440, 8, KIDA, { in: t0 + .3, mood: 'happy', key: 'kas', snd: false }); person(lerp(970, 650, go), 1440, 7, KIDB, { in: t0 + .35, mood: 'happy', key: 'kbs', snd: false }); }
    else { home(t, wm - .5); person(560, 1860, 28, MAID, { in: wm - .3, mood: 'neutral', look: 0, key: 'maid' }); }
    camEnd();
  }
  function shBack(t, lt) {       // she comes back: the maid gone, the furniture gone; the super shrugs
    const t0 = t - lt, wg = WT('back', 'gone'), ws = WT('back', 'super');
    camBegin(540, 1000, 1.0); emptyRoom(t, t0);
    person(300, 1860, 30, RO, { in: t0 + .05, mood: t > wg ? 'surprised' : 'happy', look: 1, key: 'ro', hold: (x, y, u) => P('prop_suitcase', x, y + u * 1.6, u * 2.4, { sway: .02, snd: false }) });
    if (t > ws - .2) person(780, 1860, 30, SUPER, { in: ws - .2, mood: 'neutral', look: -1, key: 'super', aL: .5 + .2 * Math.sin(t * 6), aR: .5 + .2 * Math.sin(t * 6 + 2) });
    camEnd();
  }
  function shHotel(t, lt) {      // a hotel; police; private detectives; every warehouse in the city; nothing
    const t0 = t - lt, wp = WT('hotel', 'police'), wd = WT('hotel', 'detectives'), ww = WT('hotel', 'warehouse'), wn = WT('hotel', 'nothing');
    camBegin(540, 1000, 1.0); board('day'); P('city_skyscraper', 820, 1230, 780, { in: t0 + .05, sway: .004 });
    if (t > ww - .2) { P('city_brownstone', 240, 1320, 420, { in: ww - .2, tint: [190, 190, 200] }); }
    if (t > wn - .2) P('sky_raincloud', 540, 1000, 240, { in: wn - .2, sway: .03, snd: 'pop' });
    person(420, 1860, 30, RO, { in: t0 + .05, mood: t > wn ? 'sad' : 'worried', look: 1, key: 'ro' });
    if (t > wp - .2) person(640, 1860, 28, COP, { in: wp - .2, mood: t > wn ? 'sad' : 'determined', look: -1, key: 'cop' });
    if (t > wd - .2) person(840, 1860, 28, DET, { in: wd - .2, mood: t > wn ? 'sad' : 'skeptical', look: -1, key: 'det' });
    camEnd();
  }
  function shImagine(t, lt) {    // in the hotel room she closes her eyes: her apartment, her chair, her things
    const t0 = t - lt, wc = WT('imagine', 'closed'), wa = WT('imagine', 'apartment'), wch = WT('imagine', 'chair');
    camBegin(540, 1000, 1.0);
    if (t < wa - .3) { board('plum'); P('room_chair', 540, 1700, 300, { in: t0 + .05 }); person(540, 1640, 22, RO, { in: t0 + .1, mood: t > wc ? 'sleepy' : 'hopeful', key: 'ro', snd: false }); }
    else { home(t, wa - .3, { warm: .3, sit: true }); sitIn(t, 320, 1820, 520, RO, { in: wch - .2, mood: 'sleepy', look: .4, key: 'roc', snd: false }); }
    camEnd();
  }
  function shPiano(t, lt) {      // she looks at the piano and the children's pictures until it's real
    const t0 = t - lt, wp = WT('piano', 'piano'), wr = WT('piano', 'real'), wch = WT('piano', 'chair');
    camBegin(lerp(540, 700, ease(seg(t, wp - .2, wp + 1.2))), lerp(1000, 1300, ease(seg(t, wp - .2, wp + 1.2))), 1 + .25 * ease(seg(t, wp - .2, wp + 1.2)));
    home(t, t0, { still: true, warm: t > wr ? .3 : 0, sit: true }); sitIn(t, 320, 1820, 520, RO, { mood: t > wr ? 'happy' : 'sleepy', look: .5, key: 'roc', snd: false });
    if (t > wr) { glow(780, 1450, 260, '#FFD27A', .6); cue('real', wr, 'sparkle', 780, 300); }
    camEnd();
  }
  function shBank(t, lt) {       // next day, leaving the bank, she walks toward her empty apartment by mistake
    const t0 = t - lt, wa = WT('bank', 'apartment'), wm = WT('bank', 'mistake'), go = ease(seg(t, wa - .4, wm + .5));
    camBegin(540, 1000, 1.0); board('day'); P('city_skyscraper', 200, 1230, 640, { in: t0 + .05, sway: .004 }); P('city_apartment', 860, 1320, 460, { in: t0 + .1 });
    person(lerp(300, 640, go), 1860, 30, RO, { in: t0 + .05, mood: t > wm ? 'surprised' : 'neutral', look: 1, key: 'ro' });
    camEnd();
  }
  function shAnkles(t, lt) {     // about to turn back, she sees ankles she knows: the maid; she takes her arm
    const t0 = t - lt, wk = WT('ankles', 'ankles'), wm = WT('ankles', 'maid'), wa = WT('ankles', 'arm'), wf = WT('ankles', 'furniture');
    camBegin(t < wm ? 760 : 540, t < wm ? 1700 : 1000, t > wk - .2 && t < wm ? 2.0 : 1.0); board('day'); P('city_apartment', 860, 1320, 460, { in: -9 });
    person(320, 1860, 30, RO, { mood: t > wm ? 'determined' : 'neutral', look: 1, key: 'ro', aR: t > wa ? .2 : -1.2 });
    if (t > wk - .4) person(t > wa ? 520 : 760, 1860, 28, MAID, { in: wk - .4, mood: t > wa ? 'worried' : 'neutral', look: t > wm ? -1 : 1, key: 'maid' });
    if (t > wm) cue('maid', wm, 'pop', 600, 300);
    camEnd();
  }
  function shTaxi(t, lt) {       // the maid, scared, takes her by taxi to the stored furniture; everything back in one day
    const t0 = t - lt, wt = WT('taxi', 'taxi'), ws = WT('taxi', 'stored'), wb = WT('taxi', 'back'), go = ease(seg(t, wt - .2, wt + 1.5));
    camBegin(540, 1000, 1.0);
    if (t < ws - .3) { board('day'); P('city_rowhouses', 220, 1400, 420, { in: t0 + .05 }); if (t > wt - .2) P('city_car', lerp(1300, 600, go), 1700, 420, { in: wt - .2, snd: 'whoosh', tint: [255, 214, 90], sway: .01 });
      person(260, 1860, 28, MAID, { in: t0 + .05, mood: 'worried', look: 1, key: 'maid' }); }
    else { home(t, ws - .3, { warm: t > wb ? .3 : 0 }); person(540, 1860, 30, RO, { in: ws - .2, mood: t > wb ? 'joy' : 'happy', look: 0, key: 'ro', aL: t > wb ? .7 : -1.2, aR: t > wb ? .7 : -1.2 }); if (t > wb) cue('back', wb, 'sparkle', 540, 300); }
    camEnd();
  }
  function shLesson(t, lt) {     // the detectives searched the whole city; she sat back down in her own chair
    const t0 = t - lt, wc = WT('lesson', 'city'), wch = WT('lesson', 'chair');
    camBegin(540, 1000, 1.0);
    if (t < wch - .6) { board('day'); P('city_skyscraper', 820, 1230, 780, { in: t0 + .05, tint: [190, 190, 200], sway: .004 }); person(420, 1860, 30, DET, { in: t0 + .1, mood: 'skeptical', look: Math.sin(t * 4) > 0 ? 1 : -1, key: 'det' }); }
    else { home(t, wch - .6, { warm: .35, sit: true }); sitIn(t, 320, 1820, 520, RO, { in: wch - .4, mood: 'warm', look: .5, key: 'roc', snd: false }); }
    camEnd();
  }
  function shClose(t, lt) {      // what would it feel like, if it was already back?
    const t0 = t - lt, wb = WT('close', 'back');
    camBegin(540, 1000, 1.0); board('plum'); if (t > wb - .3) { glow(540, 1300, 420, '#FFD27A', .5); P('room_armchair', 820, 1700, 300, { in: wb - .3, snd: 'pop' }); }
    host(t, 420, 1830, 38, { in: t0 + .02, mood: 'warm', look: .2 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'sitting'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('trip') - .12, shTrip], [S('back') - .12, shBack], [S('hotel') - .12, shHotel], [S('imagine') - .12, shImagine], [S('piano') - .12, shPiano], [S('bank') - .12, shBank], [S('ankles') - .12, shAnkles], [S('taxi') - .12, shTaxi], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
