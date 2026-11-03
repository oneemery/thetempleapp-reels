window.CHEAP = true; window.FELT = true;
// Episode 19, flannelgraph cut: "The Penthouse" (the couple who imagined it together) built from the felt cutout kit (kit/cutouts) on felt boards.
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

















  const HUS = { ...C.blake, name: 'hus', coat: '#2E3A52', sleeve: '#2E3A52', lapel: '#F3EBDC', pants: '#2E3A52', hat: null, hair: '#3B2A22', skin: '#EFCBA6' };
  const WF = { ...C.dreamer, name: 'wf', coat: '#3F8F8A', sleeve: '#3F8F8A', stripes: null, hair: '#B5643A', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const WORKER = { ...C.skeptic, name: 'worker', coat: '#8C3B3B', sleeve: '#8C3B3B', hat: 'fedora', hatCol: '#22222A', band: '#E6B82A' };
  const MGR = { ...C.skeptic, name: 'mgr', coat: '#22222A', sleeve: '#22222A', hat: null };
  const FAM1 = { ...C.blake, name: 'fam1', coat: '#5E6B3A', sleeve: '#5E6B3A', hat: 'fedora', hatCol: '#3A4F36', band: '#C9963A' }, FAM2 = { ...C.dreamer, name: 'fam2', coat: '#C9963A', sleeve: '#C9963A', stripes: null, hair: '#2B1E19' };
  const FELT = {};
  function felt(key, x, y, w, h, draw, a = 1) {   // a cached felt cutout drawn once on a canvas
    if (window.CUEMODE || a <= 0) return;
    if (!FELT[key]) { const g = createGraphics(400, Math.round(400 * h / w)); g.pixelDensity(1); draw(g.drawingContext, 400, Math.round(400 * h / w)); FELT[key] = g; }
    flushBrush(); tint(255, 255 * a); image(FELT[key], x - w / 2, y - h / 2, w, h); noTint();
  }
  const rr = (c, x, y, w, h, r, col) => { c.fillStyle = col; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); };
  function mirror(x, y, w, a = 1) { felt('mirror', x, y, w, w * 1.6, (c, W, H) => { rr(c, 14, 18, W - 22, H - 24, 24, '#3A2A22'); rr(c, 4, 6, W - 22, H - 24, 24, '#F6F0E2'); rr(c, 22, 24, W - 58, H - 60, 14, '#C9963A');
    const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#E8EEF4'); g.addColorStop(.5, '#AFC0CF'); g.addColorStop(1, '#DCE6EE'); rr(c, 38, 40, W - 90, H - 92, 10, g);
    c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.moveTo(80, 70); c.lineTo(140, 70); c.lineTo(70, 200); c.lineTo(70, 120); c.fill(); }, a); }
  function fireplace(x, y, w, t, a = 1) { felt('fire', x, y, w, w * .9, (c, W, H) => { rr(c, 14, 18, W - 22, H - 24, 20, '#3A2A22'); rr(c, 4, 6, W - 22, H - 24, 20, '#F6F0E2'); rr(c, 20, 22, W - 54, H - 56, 12, '#9A4A32');
    c.fillStyle = '#7A3A26'; for (let r = 0; r < 6; r++) for (let k = 0; k < 6; k++) { c.fillRect(30 + k * 56 + (r % 2) * 28, 40 + r * 48, 44, 6); }
    rr(c, 80, 120, W - 194, H - 150, 60, '#2B1E19'); rr(c, 0, 10, W - 14, 46, 10, '#5A3A24'); }, a);
    if (a > 0) { const f = 1 + .08 * Math.sin(t * 13); paint(starPts(x, y + w * .12, w * .16 * f, .5, 5, t * 2), { wash: '#F4A13A', ink: PAL.ink, sw: .5 }); paint(starPts(x, y + w * .14, w * .08 * f, .5, 5, -t * 3), { wash: '#FFE08A', ink: PAL.ink, sw: .3 }); } }
  function room(t, t0, o = {}) { board('plum'); const e = i => o.still ? null : stagger(t0, i);
    P('room_window', 540, 1080, 460, { in: e(0) }); P('sky_hill', 540, 1170, 150, { in: e(0), sway: 0, snd: false }); P('city_skyscraper', 600, 1050, 160, { in: e(0), sway: 0, snd: false });
    if (T > (o.still ? -9 : e(1))) mirror(150, 1250, 220); if (T > (o.still ? -9 : e(2))) fireplace(920, 1560, 300, t); }
  const BX = 540, BBY = 1760, BH = 640;
  function twoBed(t, t0, o = {}) {    // husband and wife side by side in bed, eyes closed
    board('night'); P('room_window', 880, 1250, 260, { in: o.still ? null : stagger(t0, 0) }); P('island_moon', 900, 1230, 50, { in: o.still ? null : stagger(t0, 1), snd: false });
    P('room_bed', BX, BBY, BH, { in: o.still ? null : stagger(t0, 2), sway: .002 }); const tin = o.still ? -9 : stagger(t0, 3);
    person(BX - 70, BBY - BH * .44, 10, HUS, { in: o.still ? null : tin, mood: o.hm || 'sleepy', key: 'hbed', snd: false, aL: -1.2, aR: -1.2 });
    person(BX + 70, BBY - BH * .44, 10, WF, { in: o.still ? null : tin + .1, mood: o.wm || 'sleepy', key: 'wbed', snd: false, aL: -1.2, aR: -1.2 });
    if (T > tin + .4) piecePart('room_bed', BX, BBY, BH, .43, 1);
  }
  function viewCloud(x, y, s, t, tin, k = '') {   // a thought cloud: the window over the park
    if (t < tin) return; P('island_cloud', x, y, s, { in: tin, snd: 'pop', sway: .02 });
    P('room_window', x, y + s * .02, s * .34, { in: tin + .1, snd: false }); P('sky_hill', x, y + s * .06, s * .12, { in: tin + .1, sway: 0, snd: false });
  }

  // ---------- shots ----------
  function shHook(t, lt) {   // husband and wife asleep; each imagines the same thing, secretly
    const t0 = t - lt, ws = WT('hook', 'same');
    camBegin(540, 1050, 1.04); twoBed(t, t0);
    viewCloud(250, 1060, 260, t, ws - .3, 'a'); viewCloud(830, 1060, 260, t, ws - .1, 'b');
    camEnd();
  }
  function shVerse(t, lt) {      // Jesus: if two of you shall agree... it shall be done (two disciples, a star)
    const t0 = t - lt, wt = WT('verse', 'two'), wa = WT('verse', 'agree'), wh = WT('verse', 'heaven');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(540, 1050, 600, '#FFD27A', .3 + .4 * ease(seg(t, wh - .2, wh + .6)));
    person(330, 1840, 38, JESUS, { in: stagger(t0, 0), mood: 'warm', aL: .8, look: .6, key: 'jesus', hold: PROPS.scroll });
    if (t > wt - .2) { person(700, 1860, 28, DISC1, { in: wt - .2, mood: t > wa ? 'happy' : 'neutral', look: t > wa ? 1 : -1, key: 'd1' }); person(900, 1860, 28, DISC2, { in: wt, mood: t > wa ? 'happy' : 'neutral', look: -1, key: 'd2' }); }
    if (t > wh - .2) P('bible_star', 800, 820, 200, { in: wh - .2, snd: 'chime', sway: .04 });
    camEnd();
  }
  function shMeaning(t, lt) {    // two people (husband and wife), one picture (one cloud)
    const t0 = t - lt, wp = WT('meaning', 'picture');
    camBegin(540, 1000, 1.0); board('plum');
    person(300, 1860, 28, HUS, { in: t0 + .05, mood: 'warm', look: 1, key: 'hus' }); person(780, 1860, 27, WF, { in: t0 + .2, mood: 'warm', look: -1, key: 'wf' });
    viewCloud(540, 1050, 380, t, wp - .3);
    camEnd();
  }
  function shCouple(t, lt) {     // a penthouse: his big window with a view, her wall of mirror, a real wood fire
    const t0 = t - lt, ww = WT('couple', 'window'), wm = WT('couple', 'mirror'), wf = WT('couple', 'fireplace');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > ww - .2) { P('room_window', 540, 1080, 420, { in: ww - .2, snd: 'pop' }); P('sky_hill', 540, 1160, 140, { in: ww - .1, sway: 0, snd: false }); }
    if (t > wm - .2) mirror(160, 1250, 200, ease(seg(t, wm - .2, wm + .1))); if (t > wf - .2) fireplace(920, 1560, 280, t, ease(seg(t, wf - .2, wf + .1)));
    if (t > wm) cue('mir', wm, 'sparkle', 160, 200); if (t > wf) cue('fire', wf, 'pop', 920, 300);
    person(380, 1860, 28, HUS, { in: t0 + .05, mood: 'happy', look: .4, lookY: t < wm ? -.3 : 0, key: 'hus' }); person(640, 1860, 27, WF, { in: t0 + .2, mood: 'happy', look: -.4, key: 'wf' });
    camEnd();
  }
  function shSearch(t, lt) {     // months of nothing: waiting lists everywhere
    const t0 = t - lt, wn = WT('search', 'nothing'), ww = WT('search', 'waiting');
    camBegin(540, 1000, 1.0); board('day'); P('city_apartment', 760, 1300, 560, { in: stagger(t0, 0) }); P('city_brownstone', 220, 1320, 480, { in: stagger(t0, 1) });
    if (t > wn - .2) P('sky_raincloud', 520, 980, 220, { in: wn - .2, sway: .03, snd: 'pop' });
    if (t > ww - .2) for (let i = 0; i < 3; i++) P('prop_scroll', 360 + i * 170, 1460, 130, { in: ww - .2 + i * .12, rot: (i - 1) * .2, sway: .03 });
    person(400, 1870, 26, HUS, { in: t0 + .05, mood: t > wn ? 'sad' : 'neutral', look: 1, key: 'hus' }); person(620, 1870, 25, WF, { in: t0 + .15, mood: t > wn ? 'worried' : 'neutral', look: -1, key: 'wf' });
    camEnd();
  }
  function shFifth(t, lt) {      // one on Fifth Avenue over the park; too much rent; they offer more and wait
    const t0 = t - lt, wr = WT('fifth', 'rent'), wo = WT('fifth', 'offered'), ww = WT('fifth', 'waited');
    camBegin(540, 1000, 1.0); board('day'); P('city_skyscraper', 760, 1230, 780, { in: stagger(t0, 0), sway: .004 }); P('city_wintertree', 220, 1500, 360, { in: stagger(t0, 1) }); P('life_flowers', 420, 1700, 200, { in: stagger(t0, 2) });
    if (t > wr - .2) P('prop_money', 380, 1050, 200, { in: wr - .2, snd: 'pop', sway: .04 });
    person(300, 1870, 26, HUS, { in: t0 + .05, mood: t > wr ? 'worried' : 'beam', look: 1, lookY: -.3, key: 'hus', aR: t > wo && t < ww ? .5 : -1.2 }); person(520, 1870, 25, WF, { in: t0 + .15, mood: t > ww ? 'hopeful' : t > wr ? 'worried' : 'beam', look: 1, lookY: -.3, key: 'wf' });
    if (t > ww) P('room_clock', 560, 1200, 160, { in: ww, snd: 'pop' });
    camEnd();
  }
  function shHusband(t, lt) {    // every night he imagines the window over the park, the terrace with friends
    const t0 = t - lt, wm = WT('husband', 'morning'), wt = WT('husband', 'terrace');
    camBegin(540, 1050, 1.04); twoBed(t, t0, { hm: t > wm ? 'happy' : 'sleepy' });
    viewCloud(330, 1060, 320, t, t0 + .5, 'h');
    if (t > wt - .2) { P('island_cloud', 800, 1060, 260, { in: wt - .2, snd: 'pop' }); person(760, 1100, 7, HUS, { in: wt, mood: 'beam', key: 'ht', snd: false }); person(840, 1100, 7, WF, { in: wt + .1, mood: 'beam', key: 'wt', snd: false }); }
    camEnd();
  }
  function shWife(t, lt) {       // without telling him, she does the same; for weeks; the owners don't decide
    const t0 = t - lt, wt = WT('wife', 'telling'), wsm = WT('wife', 'same'), ww = WT('wife', 'weeks');
    camBegin(540, 1050, 1.04); twoBed(t, t0, { still: true, hm: 'happy', wm: t > wsm ? 'happy' : 'sleepy' });
    viewCloud(270, 1060, 280, t, -9, 'h2'); viewCloud(810, 1060, 280, t, wsm - .3, 'w');
    if (t > ww - .2) tally(t, 290, 740, 6, Array.from({ length: 6 }, (_, i) => ww + i * .18), 100);
    camEnd();
  }
  function shBuilding(t, lt) {   // a worker in their own building: a penthouse here is empty
    const t0 = t - lt, wb = WT('building', 'building'), we = WT('building', 'empty');
    camBegin(540, 1000, 1.0); board('day'); P('city_apartment', 560, 1250, 760, { in: stagger(t0, 0) });
    if (t > we - .1) { glow(560, 900, 220, '#FFD27A', .8); cue('empty', we, 'sparkle', 560, 300); }
    person(200, 1870, 28, WORKER, { in: t0 + .1, mood: 'warm', look: 1, key: 'worker', talk: talk(t), aR: t > we ? .7 : -1.2 });
    person(660, 1870, 26, HUS, { in: t0 + .15, mood: t > we ? 'surprised' : 'neutral', look: -1, key: 'hus' }); person(880, 1870, 25, WF, { in: t0 + .2, mood: t > we ? 'joy' : 'neutral', look: -1, key: 'wf' });
    camEnd();
  }
  function shPromised(t, lt) {   // promised to another family; a waiting list; impossible; a few meetings; theirs
    const t0 = t - lt, wf = WT('promised', 'family'), wi = WT('promised', 'impossible'), wth = WT('promised', 'theirs');
    camBegin(540, 1000, 1.0); board('plum');
    if (t < wth - .3) { if (t > wf - .2) { person(780, 1870, 24, FAM1, { in: wf - .2, mood: 'happy', look: -1, key: 'f1' }); person(940, 1870, 22, FAM2, { in: wf - .05, mood: 'happy', look: -1, key: 'f2' }); }
      if (t > wi - .2) person(540, 1860, 28, MGR, { in: wi - .2, mood: 'determined', look: Math.sin(t * 6) > 0 ? -.8 : .2, key: 'mgr' }); }
    else { glow(540, 1300, 480, '#FFD27A', .7); P('bible_star', 540, 1000, 220, { in: wth - .3, snd: 'chime', sway: .04 }); }
    person(180, 1870, 26, HUS, { in: t0 + .05, mood: t > wth - .3 ? 'joy' : t > wi ? 'sad' : 'determined', look: 1, key: 'hus' }); person(360, 1870, 25, WF, { in: t0 + .1, mood: t > wth - .3 ? 'joy' : t > wi ? 'worried' : 'determined', look: 1, key: 'wf' });
    camEnd();
  }
  function shGot(t, lt) {        // the terrace, the giant window, the mirror, the fire; the rent close to plan
    const t0 = t - lt, wr = WT('got', 'rent');
    camBegin(540, 1000, 1.0); room(t, t0); glow(540, 1080, 360, '#FFE2A8', .4);
    if (t > wr - .2) P('life_coinbag', 760, 1700, 160, { in: wr - .2, snd: 'pop' });
    person(380, 1870, 28, HUS, { in: stagger(t0, 3), mood: 'beam', look: .4, key: 'hus' }); person(580, 1870, 27, WF, { in: stagger(t0, 4), mood: 'beam', look: -.4, key: 'wf' });
    camEnd();
  }
  function shLesson(t, lt) {     // not the one they chased (grey cloud, Fifth Avenue); everything they imagined (gold)
    const t0 = t - lt, wc = WT('lesson', 'chasing'), wi = WT('lesson', 'imagining');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wc - .3 && t < wi) { P('island_cloud', 320, 1050, 280, { in: wc - .3, out: wi - .2, tint: [170, 170, 180], snd: 'pop' }); P('city_skyscraper', 320, 1060, 140, { in: wc - .2, out: wi - .2, tint: [170, 170, 180], snd: false, sway: 0 }); }
    if (t > wi - .3) { viewCloud(720, 1050, 360, t, wi - .3, 'l'); glow(720, 1050, 280, '#FFD27A', .6); }
    person(300, 1870, 26, HUS, { in: t0 + .05, mood: t > wi ? 'beam' : 'neutral', look: .6, key: 'hus' }); person(480, 1870, 25, WF, { in: t0 + .1, mood: t > wi ? 'beam' : 'neutral', look: .6, key: 'wf' });
    camEnd();
  }
  function shClose(t, lt) {      // what are you seeing every night, with your eyes closed?
    const t0 = t - lt, wc = WT('close', 'closed');
    camBegin(540, 1000, 1.0); board('night'); P('island_moon', 820, 1000, 140, { in: t0 + .1, snd: false });
    host(t, 540, 1830, 38, { in: t0 + .02, mood: t > wc - .2 ? 'sleepy' : 'warm', look: 0 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'living'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('couple') - .12, shCouple], [S('search') - .12, shSearch], [S('fifth') - .12, shFifth], [S('husband') - .12, shHusband], [S('wife') - .12, shWife], [S('building') - .12, shBuilding], [S('promised') - .12, shPromised], [S('got') - .12, shGot], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
