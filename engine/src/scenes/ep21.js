window.CHEAP = true; window.FELT = true;
// Episode 21, flannelgraph cut: "The Ring" (L.S.E. goes to sleep married) built from the felt cutout kit (kit/cutouts) on felt boards.
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



















  const LSE = { ...C.dreamer, name: 'lse', coat: '#3F6FB0', sleeve: '#3F6FB0', stripes: null, hair: '#2B1E19', skin: '#E6B48C', torso: 7.2, leg: 4.6, w: 4.6 };
  const BRIDE = { ...LSE, name: 'bride', coat: '#F6F0E2', sleeve: '#F6F0E2' };
  const JE = { ...C.blake, name: 'je', coat: '#4F6B4A', sleeve: '#4F6B4A', lapel: '#F3EBDC', pants: '#2E3A30', hat: null, hair: '#5A4636', skin: '#EFCBA6' };
  const GROOM = { ...JE, name: 'groom', coat: '#22222A', sleeve: '#22222A', pants: '#22222A' };
  const PAL1 = { ...C.dreamer, name: 'pal1', coat: '#C9963A', sleeve: '#C9963A', stripes: null, hair: '#B5643A' };
  const OTHER = { ...C.skeptic, name: 'other', coat: '#8E8F96', sleeve: '#8E8F96', hat: null };
  const SAGE = { ...C.paul, name: 'sage', coat: '#3F6FB0', sleeve: '#3F6FB0', pants: '#3F6FB0', sash: '#E6B82A', hair: '#9A958C', hairStyle: 'neat', beard: .6, beardCol: '#9A958C' };
  const ROOM3 = [{ ...PAL1, name: 'r1' }, { ...PAL1, name: 'r2', coat: '#7A4E8A', sleeve: '#7A4E8A', hair: '#2B1E19' }, { ...PAL1, name: 'r3', coat: '#3F8F8A', sleeve: '#3F8F8A', hair: '#E6B82A' }];
  function ring(x, y, s, t, a = 1) {   // a gold wedding band that glints
    if (window.CUEMODE || a <= 0) return; flushBrush(); push(); noFill(); stroke(58, 42, 34, 255 * a); strokeWeight(s * .3); ellipse(x + s * .06, y + s * .08, s, s * .82);
    stroke(232, 184, 42, 255 * a); strokeWeight(s * .22); ellipse(x, y, s, s * .82); stroke(255, 236, 160, 220 * a); strokeWeight(s * .07); arc(x, y, s * .9, s * .72, PI * 1.1, PI * 1.5); pop();
    glow(x, y, s * 2.2, '#FFD27A', .35 * a * (1 + .3 * Math.sin(t * 5)));
  }
  const BX = 540, BBY = 1760, BH = 600;
  function herBed(t, t0, o = {}) {
    board('night'); P('room_window', 880, 1250, 260, { in: o.still ? null : stagger(t0, 0) }); P('island_moon', 900, 1230, 50, { in: o.still ? null : stagger(t0, 1), snd: false });
    P('room_bed', BX, BBY, BH, { in: o.still ? null : stagger(t0, 2), sway: .002 }); const tin = o.still ? -9 : stagger(t0, 3);
    person(BX, BBY - BH * .44, 11, LSE, { in: o.still ? null : tin, mood: o.mood || 'sleepy', key: 'lbed', snd: false, aL: -1.2, aR: -1.2 });
    if (T > tin + .4) piecePart('room_bed', BX, BBY, BH, .43, 1);
  }
  function coupleCloud(x, y, s, t, tin, k = '') {
    if (t < tin) return; P('island_cloud', x, y, s, { in: tin, snd: 'pop', sway: .02 });
    person(x - s * .12, y + s * .14, s * .026, BRIDE, { in: tin + .1, mood: 'beam', look: 1, key: 'cb' + k, snd: false });
    person(x + s * .12, y + s * .14, s * .027, GROOM, { in: tin + .15, mood: 'warm', look: -1, key: 'cg' + k, snd: false });
  }

  // ---------- shots ----------
  function shHook(t, lt) {   // one blind date; she has to move away; he may not know her name; he found her
    const t0 = t - lt, wm = WT('hook', 'move'), wn = WT('hook', 'name'), wf = WT('hook', 'found'), go = ease(seg(t, wm - .2, wm + 1.4));
    camBegin(540, 1000, 1.0); board('day'); P('city_rowhouses', 220, 1400, 420, { in: t0 + .05 });
    if (t > wn - .2 && t < wf - .3) P('sky_raincloud', 800, 1050, 200, { in: wn - .2, out: wf - .3, sway: .03, snd: 'pop' });
    person(t < wf - .3 ? lerp(420, 180, go) : 380, 1860, 30, LSE, { in: t0 + .05, mood: t > wf ? 'joy' : t > wm ? 'sad' : 'happy', look: t > wf ? 1 : -1, key: 'lse', hold: t > wm - .2 && t < wf - .3 ? (x, y, u) => P('prop_suitcase', x, y + u * 1.6, u * 2.4, { sway: .02, snd: false }) : null });
    if (t < wm + .4) person(700, 1860, 31, JE, { in: t0 + .1, out: wm + .4, mood: 'happy', look: -1, key: 'je' });
    if (t > wf - .3) { person(700, 1860, 31, JE, { in: wf - .3, mood: 'beam', look: -1, key: 'je2' }); glow(540, 1500, 420, '#FFD27A', .5); cue('found', wf, 'sparkle', 540, 300); }
    camEnd();
  }
  function shVerse(t, lt) {      // Proverbs: whoso findeth a wife findeth a good thing
    const t0 = t - lt, wf = WT('verse', 'findeth'), wl = WT('verse', 'lord');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, wl - .2, wl + .6)));
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (t > wf - .2) ring(780, 900, 120, t, ease(seg(t, wf - .2, wf + .2)));
    person(420, 1840, 40, SAGE, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'sage', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // findeth: she didn't have to chase him
    const t0 = t - lt, wc = WT('meaning', 'chase'), wf = WT('meaning', 'finding');
    camBegin(540, 1000, 1.0); board('plum'); ring(760, 1050, 140, t); if (t > wc - .2) glow(760, 1050, 300, '#FFD27A', .5);
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5, aR: t > wc ? .3 : -1.2 });
    camEnd();
  }
  function shDate(t, lt) {       // last August, a blind date: everything she wanted in a husband
    const t0 = t - lt, wh = WT('date', 'husband');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1300, 520, '#FFE2A8', .4); P('room_lamp', 160, 1500, 360, { in: stagger(t0, 0) }); P('prop_candle', 540, 1500, 200, { in: stagger(t0, 1) });
    person(360, 1860, 30, LSE, { in: stagger(t0, 2), mood: t > wh ? 'beam' : 'happy', look: 1, key: 'lse' }); person(720, 1860, 31, JE, { in: stagger(t0, 3), mood: 'happy', look: -1, key: 'je', talk: talk(t) });
    if (t > wh - .2) { P('bible_star', 540, 1000, 180, { in: wh - .2, snd: 'chime', sway: .04 }); }
    camEnd();
  }
  function shMoved(t, lt) {      // two days later her job moves her; the friend leaves; does he know her name?
    const t0 = t - lt, wc = WT('moved', 'city'), wf = WT('moved', 'friend'), wn = WT('moved', 'name'), tr = ease(seg(t, wc - .3, wc + 2));
    camBegin(540, 1000, 1.0); board('day'); P('city_rowhouses', 220, 1400, 420, { in: t0 + .05 });
    if (t > wc - .3) P('life_train', lerp(1300, 700, tr), 1640, 520, { in: wc - .3, snd: 'whoosh', sway: .01 });
    person(380, 1860, 30, LSE, { in: t0 + .05, mood: t > wn ? 'worried' : 'sad', look: 1, key: 'lse', hold: (x, y, u) => P('prop_suitcase', x, y + u * 1.6, u * 2.4, { sway: .02, snd: false }) });
    if (t > wf - .2 && t < wn) person(lerp(160, -100, ease(seg(t, wf + .3, wn))), 1860, 28, PAL1, { in: wf - .2, mood: 'neutral', look: -1, key: 'pal' });
    if (t > wn - .2) P('sky_raincloud', 420, 1060, 220, { in: wn - .2, sway: .03, snd: 'pop' });
    camEnd();
  }
  function shThink(t, lt) {      // other dates, but she can't stop thinking of him; then Neville on revising the day
    const t0 = t - lt, wt = WT('think', 'thinking'), wn = WT('think', 'neville');
    camBegin(540, 1000, 1.0); board('plum');
    if (t < wn - .2) { person(760, 1860, 30, OTHER, { in: t0 + .1, mood: 'happy', look: -1, key: 'other', talk: talk(t) });
      if (t > wt - .3) { P('island_cloud', 380, 1080, 300, { in: wt - .3, snd: 'pop' }); person(380, 1120, 9, JE, { in: wt - .1, mood: 'happy', key: 'jc', snd: false }); } }
    else { person(760, 1840, 32, C.neville, { in: wn - .2, mood: 'warm', look: -1, key: 'nev', talk: talk(t), aL: .4 }); }
    person(300, 1860, 30, LSE, { in: t0 + .05, mood: t > wn ? 'hopeful' : 'neutral', look: t > wn ? 1 : -.3, lookY: t > wt && t < wn ? -.4 : 0, key: 'lse' });
    camEnd();
  }
  function shNight(t, lt) {      // every night: waking in her own home, married; not sharing an apartment with three others
    const t0 = t - lt, wh = WT('night', 'home'), wa = WT('night', 'apartment');
    camBegin(540, 1050, 1.04); herBed(t, t0, { mood: t > wh ? 'happy' : 'sleepy' });
    if (t > wh - .3) { P('island_cloud', 330, 1060, 300, { in: wh - .3, snd: 'pop' }); P('life_house', 330, 1080, 120, { in: wh - .2, snd: false }); glow(330, 1060, 220, '#FFD27A', .5); }
    if (t > wa - .3) { P('island_cloud', 780, 1000, 260, { in: wa - .3, tint: [170, 170, 180], snd: 'pop' }); for (let i = 0; i < 3; i++) person(720 + i * 60, 1040, 6, ROOM3[i], { in: wa - .1 + i * .08, mood: 'neutral', key: 'rm' + i, snd: false }); }
    camEnd();
  }
  function shRing(t, lt) {       // she turns an imaginary band on her left hand: this is wonderful! I really am Mrs. J.E.!
    const t0 = t - lt, wb = WT('ring', 'band'), ww = WT('ring', 'wonderful');
    camBegin(540, 1050, 1.04); herBed(t, t0, { still: true, mood: t > ww ? 'beam' : 'happy' });
    if (t > wb - .2) ring(540, 1150, 90 + 20 * Math.sin(t * 3), t, ease(seg(t, wb - .2, wb + .2)));
    if (t > ww) { glow(540, 1300, 420, '#FFD27A', .5); cue('wonder', ww, 'sparkle', 540, 300); }
    camEnd();
  }
  function shMonth(t, lt) {      // she fell asleep in that feeling, every night for a month
    const t0 = t - lt, wn = WT('month', 'night');
    camBegin(540, 1050, 1.04); herBed(t, t0, { still: true, mood: 'sleepy' }); zzz(640, 1250, t, t0 + .2, .9); glow(540, 1400, 380, '#FFE2A8', .4);
    tally(t, 150, 760, 8, Array.from({ length: 8 }, (_, i) => wn - .2 + i * .12), 110);
    camEnd();
  }
  function shFound(t, lt) {      // the first week of October, he found her
    const t0 = t - lt, wf = WT('found', 'found'), walk = ease(seg(t, wf - 1, wf));
    camBegin(540, 1000, 1.0); board('day'); P('city_brownstone', 220, 1320, 480, { in: t0 + .05 }); P('city_wintertree', 900, 1500, 360, { in: t0 + .1 });
    person(lerp(1200, 680, walk), 1860, 31, JE, { in: t0 + .1, mood: t > wf ? 'beam' : 'hopeful', look: -1, key: 'je' });
    person(360, 1860, 30, LSE, { in: t0 + .05, mood: t > wf ? 'joy' : 'neutral', look: t > wf - .3 ? 1 : 0, key: 'lse' });
    if (t > wf) { glow(520, 1500, 420, '#FFD27A', .6); cue('found', wf, 'sparkle', 520, 300); }
    camEnd();
  }
  function shMarried(t, lt) {    // proposal in November, announced in January, married in May; happier than she dreamed
    const t0 = t - lt, wp = WT('married', 'proposed'), wj = WT('married', 'january'), wm = WT('married', 'may'), wh = WT('married', 'happier');
    camBegin(540, 1000, 1.0);
    if (t < wm - .2) { board('plum'); if (t > wp - .2) ring(540, 1050, 120, t, ease(seg(t, wp - .2, wp + .2))); if (t > wj - .2) P('prop_envelope', 800, 1050, 200, { in: wj - .2, snd: 'pop' });
      person(340, 1860, 30, LSE, { in: t0 + .05, mood: 'joy', look: 1, key: 'lse' }); person(720, 1860, 31, JE, { in: t0 + .1, mood: 'beam', look: -1, key: 'je' }); }
    else { board('day'); glow(540, 1400, 560, '#FFD27A', .6); P('life_flowers', 160, 1720, 240, { in: wm - .2 }); P('life_flowers', 920, 1720, 240, { in: wm - .1 });
      person(400, 1860, 30, BRIDE, { in: wm - .2, mood: 'beam', look: 1, key: 'bride', hold: (x, y, u) => P('life_flowers', x, y + u, u * 2.6, { sway: .02, snd: false }) }); person(680, 1860, 31, GROOM, { in: wm - .1, mood: 'beam', look: -1, key: 'groom' });
      if (t > wh - .2) P('bible_star', 540, 980, 200, { in: wh - .2, snd: 'chime', sway: .04 }); }
    camEnd();
  }
  function shLesson(t, lt) {     // not wondering if he'd call (a grey phone); she went to sleep married (gold cloud)
    const t0 = t - lt, wc = WT('lesson', 'call'), wm = WT('lesson', 'married');
    camBegin(540, 1050, 1.04); herBed(t, t0, { mood: t > wm ? 'beam' : 'worried' });
    if (t > wc - .3 && t < wm - .2) P('prop_telephone', 300, 1080, 160, { in: wc - .3, out: wm - .3, tint: [160, 160, 170], snd: 'pop' });
    if (t > wm - .3) { coupleCloud(400, 1040, 340, t, wm - .3); glow(400, 1040, 260, '#FFD27A', .6); }
    camEnd();
  }
  function shClose(t, lt) {      // what's on your hand, when you fall asleep?
    const t0 = t - lt, wh = WT('close', 'hand');
    camBegin(540, 1000, 1.0); board('night'); P('island_moon', 820, 1000, 140, { in: t0 + .1, snd: false });
    if (t > wh - .2) ring(760, 1500, 80, t, ease(seg(t, wh - .2, wh + .2)));
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: .3, aR: t > wh - .2 ? .3 : -1.2 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'sleep'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('date') - .12, shDate], [S('moved') - .12, shMoved], [S('think') - .12, shThink], [S('night') - .12, shNight], [S('ring') - .12, shRing], [S('month') - .12, shMonth], [S('found') - .12, shFound], [S('married') - .12, shMarried], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
