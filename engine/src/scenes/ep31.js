window.CHEAP = true; window.FELT = true;
// Episode 31, flannelgraph cut: "The Corner Lot" (Dr. M. builds it in imagination) built from the felt cutout kit (kit/cutouts) on felt boards.
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





























  const DRM = { ...C.blake, name: 'drm', coat: '#F3EBDC', sleeve: '#F3EBDC', lapel: '#D9D4C8', pants: '#3A3A44', hat: null, hair: '#5A4636', skin: '#EFCBA6' };
  const WIFE = { ...C.dreamer, name: 'wife', coat: '#3F8F8A', sleeve: '#3F8F8A', stripes: null, hair: '#2B1E19', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const MRSX = { ...C.dreamer, name: 'mrsx', coat: '#7A4E8A', sleeve: '#7A4E8A', stripes: null, hair: '#B8B2A8', skin: '#EFCBA6', torso: 7.2, leg: 4.4, w: 4.8, hat: null };
  const CON = { ...C.blake, name: 'con', coat: '#C9963A', sleeve: '#C9963A', lapel: '#8C5A3C', pants: '#5A4636', hat: 'fedora', hatCol: '#8C5A3C', band: '#22222A' };
  const TEN = ['#B8463A', '#3F6FB0', '#5E6B3A'].map((c, i) => ({ ...C.dreamer, name: 'ten' + i, coat: c, sleeve: c, stripes: null, hair: ['#E6B82A', '#2B1E19', '#B5643A'][i] }));
  const HAB = { ...C.paul, name: 'habakkuk', coat: '#8C5A3C', sleeve: '#8C5A3C', pants: '#8C5A3C', sash: '#3F6FB0', hair: '#5A4636', hairStyle: 'neat', beard: .6, beardCol: '#5A4636' };
  const SIGNS = {};
  function sign(x, y, w, txt, col = '#2F7A4A', a = 1) {
    if (window.CUEMODE || a <= 0) return; const key = txt + col;
    if (!SIGNS[key]) { const g = createGraphics(700, 220); g.pixelDensity(1); const c = g.drawingContext;
      c.fillStyle = '#3A2A22'; c.beginPath(); c.roundRect(14, 20, 672, 190, 24); c.fill(); c.fillStyle = '#F6F0E2'; c.beginPath(); c.roundRect(4, 6, 672, 190, 24); c.fill();
      c.fillStyle = col; c.beginPath(); c.roundRect(20, 22, 640, 158, 16); c.fill();
      c.fillStyle = '#F6F0E2'; c.font = 'bold 96px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 340, 104); SIGNS[key] = g; }
    flushBrush(); tint(255, 255 * a); image(SIGNS[key], x - w / 2, y - w * 110 / 700, w, w * 220 / 700); noTint();
  }
  const blue = [150, 190, 255];
  function corner(t, t0, o = {}) { board('day'); const e = i => o.still ? null : stagger(t0, i);
    P('city_brownstone', 260, 1500, 420, { in: e(0), tint: [210, 190, 170] }); P('sky_hill', 760, 1560, 260, { in: e(1), sway: 0 });
    if (o.grow != null) P('city_apartment', 760, 1560, 720, { in: o.gin ?? -9, sy: Math.max(.02, o.grow), sway: 0, snd: false }); }
  function dream(x, y, s, t, tin, inner) { if (t < tin) return; P('island_cloud', x, y, s, { in: tin, snd: 'pop', sway: .02 }); if (t > tin + .1) inner(x, y, s); }

  // ---------- shots ----------
  function shHook(t, lt) {   // no money for the building, not even plans; a stranger walks in and builds it
    const t0 = t - lt, wp = WT('hook', 'plans'), ws = WT('hook', 'stranger'), wb = WT('hook', 'built');
    camBegin(540, 1000, 1.0); corner(t, t0, { grow: ease(seg(t, wb - .2, wb + 1.4)), gin: wb - .2 });
    if (t > wp - .2 && t < ws) P('sky_raincloud', 760, 1100, 220, { in: wp - .2, out: ws - .2, sway: .03, snd: 'pop' });
    person(500, 1860, 26, DRM, { in: t0 + .05, mood: t > wb ? 'joy' : t > wp ? 'sad' : 'hopeful', look: 1, key: 'drm' });
    if (t > ws - .3) person(900, 1860, 26, CON, { in: ws - .3, mood: 'happy', look: -1, key: 'con' });
    camEnd();
  }
  function shVerse(t, lt) {      // Habakkuk: write the vision, make it plain upon tables
    const t0 = t - lt, ww = WT('verse', 'write'), wp = WT('verse', 'plain'), wr = WT('verse', 'run');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, wp - .2, wp + .6)));
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (t > ww - .2) P('prop_scroll', 790, 1300, 260, { in: ww - .2, snd: 'pop', sway: .03 });
    person(420, 1840, 40, HAB, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'hab', hold: PROPS.quill || PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // write the vision; make it plain
    const t0 = t - lt, wp = WT('meaning', 'plain');
    camBegin(540, 1000, 1.0); board('plum'); P('prop_scroll', 780, 1400, 240, { in: t0 + .1, tint: blue, sway: .03 }); if (t > wp - .2) glow(780, 1260, 240, '#FFD27A', .5);
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shLot(t, lt) {        // fifteen years before: a corner lot; office and home; room left for an apartment building
    const t0 = t - lt, wb = WT('lot', 'bought'), wr = WT('lot', 'room');
    camBegin(540, 1000, 1.0); corner(t, t0, { grow: t > wr ? .25 + .05 * Math.sin(t * 3) : null, gin: wr });
    person(160, 1860, 26, DRM, { in: t0 + .05, mood: 'happy', look: 1, key: 'drm' }); person(320, 1860, 25, WIFE, { in: t0 + .1, mood: 'happy', look: 1, key: 'wife' });
    camEnd();
  }
  function shMoney(t, lt) {      // never the money; savings as security; not even a few hundred for plans
    const t0 = t - lt, ws = WT('money', 'savings'), wp = WT('money', 'plans');
    camBegin(540, 1000, 1.0); board('plum'); P('sky_raincloud', 540, 1000, 240, { in: t0 + .1, sway: .04, snd: 'pop' });
    if (t > ws - .2) P('life_coinbag', 760, 1500, 160, { in: ws - .2, snd: 'pop' });
    if (t > wp - .2) P('prop_scroll', 540, 1300, 160, { in: wp - .2, tint: [170, 170, 180], snd: 'pop' });
    person(300, 1860, 28, DRM, { in: t0 + .05, mood: 'sad', look: 1, key: 'drm' }); person(820, 1860, 27, WIFE, { in: t0 + .1, mood: 'worried', look: -1, key: 'wife' });
    camEnd();
  }
  function shBuild(t, lt) {      // built in imagination: plans, imaginary tenants, friends' congratulations
    const t0 = t - lt, wp = WT('build', 'plans'), wt = WT('build', 'tenants'), wc = WT('build', 'congratulations');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1300, 520, '#FFE2A8', .3);
    dream(560, 1300, 640, t, t0 + .2, (x, y, s) => { P('city_apartment', x, y - s * .02, s * .55, { in: t0 + .3, snd: false });
      if (t > wp - .2) P('prop_scroll', x - s * .32, y - s * .05, s * .18, { in: wp - .2, tint: blue, snd: false });
      if (t > wt - .2) for (let i = 0; i < 3; i++) person(x + s * .22 + i * 40, y - s * .06, 7, TEN[i], { in: wt - .2 + i * .1, mood: 'happy', key: 'tc' + i, snd: false }); });
    if (t > wc - .2) cue('congrats', wc, 'sparkle', 560, 300);
    person(240, 1860, 26, DRM, { in: t0 + .05, mood: t > wc ? 'beam' : 'happy', look: 1, lookY: -.3, key: 'drm' }); person(860, 1860, 25, WIFE, { in: t0 + .1, mood: t > wc ? 'beam' : 'happy', look: -1, lookY: -.3, key: 'wife' });
    camEnd();
  }
  function shMrsx(t, lt) {       // a friend touring the building: Doctor, I think it is beautiful; every day for weeks
    const t0 = t - lt, wd = WT('mrsx', 'doctor'), wb = WT('mrsx', 'beautiful'), ww = WT('mrsx', 'weeks');
    camBegin(540, 1000, 1.0); board('plum');
    dream(540, 1300, 640, t, t0 + .05, (x, y, s) => { P('city_apartment', x + s * .15, y - s * .02, s * .5, { in: t0 + .1, snd: false });
      person(x - s * .25, y - s * .06, 9, MRSX, { in: t0 + .3, mood: t > wb ? 'beam' : 'warm', look: 1, key: 'xc', snd: false, talk: t > wd - .2 && t < wb + .4 ? talk(t) : 0 }); });
    if (t > wb - .1) { sign(540, 960, 380, 'BEAUTIFUL', '#C9963A', ease(seg(t, wb - .1, wb + .2))); }
    if (t > ww - .3) tally(t, 200, 760, 7, Array.from({ length: 7 }, (_, i) => ww - .3 + i * .1), 110);
    person(240, 1860, 26, DRM, { in: t0 + .05, mood: 'beam', look: 1, lookY: -.3, key: 'drm' }); person(860, 1860, 25, WIFE, { in: t0 + .1, mood: 'beam', look: -1, lookY: -.3, key: 'wife' });
    camEnd();
  }
  function shStranger(t, lt) {   // a stranger, a contractor, wondering why the corner lot had no building
    const t0 = t - lt, wc = WT('stranger', 'contractor'), ww = WT('stranger', 'wondered');
    camBegin(540, 1000, 1.0); board('plum'); P('room_desk', 380, 1640, 360, { in: t0 + .05 }); P('room_door', 900, 1560, 440, { in: t0 + .1 });
    person(lerp(900, 680, ease(seg(t, t0 + .3, t0 + 1.4))), 1860, 30, CON, { in: t0 + .3, mood: 'happy', look: -1, key: 'con', talk: t > wc ? talk(t) : 0 });
    if (t > ww - .3) { P('island_cloud', 700, 1150, 280, { in: ww - .3, snd: 'pop' }); P('sky_hill', 700, 1080, 90, { in: ww - .2, snd: false, sway: 0 }); }
    person(260, 1860, 28, DRM, { in: t0 + .05, mood: t > wc ? 'surprised' : 'neutral', look: 1, key: 'drm' });
    camEnd();
  }
  function shPlans(t, lt) {      // blueprints he already had; a loan; he covers the rest himself, paid from rent
    const t0 = t - lt, wb = WT('plans', 'blueprints'), wl = WT('plans', 'loan'), wh = WT('plans', 'himself'), wr = WT('plans', 'rent');
    camBegin(540, 1000, 1.0); board('plum'); P('room_desk', 540, 1660, 420, { in: t0 + .05 });
    if (t > wb - .2) P('prop_scroll', 540, 1440, 220, { in: wb - .2, tint: blue, snd: 'pop', sway: .03 });
    if (t > wl - .2) P('life_coinbag', 380, 1260, 150, { in: wl - .2, snd: 'pop' });
    if (t > wh - .2) P('life_coinbag', 700, 1260, 110, { in: wh - .2, tint: [255, 214, 120], snd: 'pop' });
    if (t > wr - .2) glow(700, 1200, 200, '#FFD27A', .5);
    person(200, 1860, 26, DRM, { in: t0 + .05, mood: t > wh ? 'joy' : 'hopeful', look: 1, key: 'drm' }); person(880, 1860, 28, CON, { in: t0 + .1, mood: 'beam', look: -1, key: 'con', talk: talk(t) });
    camEnd();
  }
  function shSigned(t, lt) {     // they sign; building starts; most rented before it's finished
    const t0 = t - lt, ws = WT('signed', 'signed'), wst = WT('signed', 'started'), wr = WT('signed', 'rented');
    camBegin(540, 1000, 1.0); corner(t, t0, { grow: ease(seg(t, wst - .2, wr + .6)), gin: wst - .2 });
    if (t > ws - .1 && t < wst) P('prop_scroll', 540, 1300, 160, { in: ws - .1, snd: 'pop' });
    if (t > wr - .2) for (let i = 0; i < 3; i++) person(620 + i * 110, 1870, 18, TEN[i], { in: wr - .2 + i * .1, mood: 'happy', look: -.5, key: 'tn' + i });
    person(160, 1860, 26, DRM, { in: t0 + .05, mood: t > wr ? 'joy' : 'happy', look: 1, key: 'drm' }); person(320, 1860, 25, WIFE, { in: t0 + .1, mood: t > wr ? 'joy' : 'happy', look: 1, key: 'wife' });
    camEnd();
  }
  function shLast(t, lt) {       // one apartment empty; they imagine visiting its tenants; rented three days later
    const t0 = t - lt, we = WT('last', 'empty'), wv = WT('last', 'visiting'), wr = WT('last', 'rented');
    camBegin(540, 1000, 1.0); corner(t, t0, { still: true, grow: 1 });
    if (t > we - .2 && t < wr) sign(760, 1180, 220, 'EMPTY', '#8C3B3B');
    if (t > wv - .3 && t < wr) { P('island_cloud', 300, 1150, 300, { in: wv - .3, snd: 'pop' }); person(270, 1100, 8, DRM, { in: wv - .2, mood: 'happy', key: 'dv', snd: false }); person(330, 1100, 8, TEN[0], { in: wv - .1, mood: 'happy', key: 'tv', snd: false }); }
    if (t > wr - .2) { sign(760, 1180, 240, 'RENTED', '#2F7A4A', ease(seg(t, wr - .2, wr + .1))); cue('rented', wr, 'sparkle', 760, 300); }
    if (t > wr - .5) tally(t, 400, 760, 3, [wr - .5, wr - .3, wr - .1], 140);
    camEnd();
  }
  function shBeautiful(t, lt) {  // a month later the friend tours it: Doctor, I think it is beautiful
    const t0 = t - lt, wb = WT('beautiful', 'beautiful');
    camBegin(540, 1000, 1.0); corner(t, t0, { still: true, grow: 1 }); glow(760, 1200, 420, '#FFD27A', .25 + (t > wb ? .4 : 0));
    person(420, 1860, 26, MRSX, { in: t0 + .1, mood: t > wb ? 'beam' : 'warm', look: 1, lookY: -.3, key: 'mrsx', talk: t > wb - 1.2 && t < wb + .4 ? talk(t) : 0 });
    person(160, 1860, 26, DRM, { in: t0 + .05, mood: t > wb ? 'joy' : 'happy', look: 1, key: 'drm' });
    if (t > wb - .1) { sign(540, 960, 380, 'BEAUTIFUL', '#C9963A', ease(seg(t, wb - .1, wb + .2))); cue('beau', wb, 'chime', 540, 300); }
    camEnd();
  }
  function shLesson(t, lt) {     // no money in; a picture in, every day
    const t0 = t - lt, wn = WT('lesson', 'money'), wp = WT('lesson', 'picture');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wn - .2) P('life_coinbag', 300, 1500, 140, { in: wn - .2, tint: [170, 170, 180], snd: 'pop', out: wp - .2 });
    if (t > wp - .3) { dream(560, 1300, 560, t, wp - .3, (x, y, s) => P('city_apartment', x, y - s * .02, s * .5, { in: wp - .2, snd: false })); glow(560, 1100, 300, '#FFD27A', .5); }
    camEnd();
  }
  function shClose(t, lt) {      // what would you build, if you started in your imagination?
    const t0 = t - lt, wb = WT('close', 'build');
    camBegin(540, 1000, 1.0); board('plum'); if (t > wb - .3) dream(780, 1200, 340, t, wb - .3, (x, y, s) => P('city_apartment', x, y - s * .02, s * .5, { in: wb - .2, snd: false }));
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'building', 1), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('lot') - .12, shLot], [S('money') - .12, shMoney], [S('build') - .12, shBuild], [S('mrsx') - .12, shMrsx], [S('stranger') - .12, shStranger], [S('plans') - .12, shPlans], [S('signed') - .12, shSigned], [S('last') - .12, shLast], [S('beautiful') - .12, shBeautiful], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
