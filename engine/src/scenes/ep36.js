window.CHEAP = true; window.FELT = true;
// Episode 36, flannelgraph cut: "The Trust Deed" (R.S. pictures the property cared for) built from the felt cutout kit (kit/cutouts) on felt boards.
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
  const WIFE = { ...C.dreamer, name: 'rswife', coat: '#B8463A', sleeve: '#B8463A', stripes: null, hair: '#5A3A24', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const OWN = { ...C.dreamer, name: 'own', coat: '#7A4E8A', sleeve: '#7A4E8A', stripes: null, hair: '#E6B82A', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const OHUS = { ...C.blake, name: 'ohus', coat: '#6B5A4A', sleeve: '#6B5A4A', lapel: '#D9D4C8', pants: '#3A3A44', hat: null, hair: '#2B1E19', skin: '#E6B48C' };
  const NHUS = { ...C.blake, name: 'nhus', coat: '#3F6FB0', sleeve: '#3F6FB0', lapel: '#F3EBDC', pants: '#2E3A52', hat: null, hair: '#B5643A', skin: '#EFCBA6' };
  const NEIGH = { ...C.dreamer, name: 'neigh', coat: '#3F8F8A', sleeve: '#3F8F8A', stripes: null, hair: '#B8B2A8' };
  const GIRLS = ['#E6B82A', '#3F8F8A'].map((c, i) => ({ ...C.dreamer, name: 'g' + i, coat: c, sleeve: c, stripes: null, hair: ['#B5643A', '#5A3A24'][i], skin: '#EFCBA6' }));
  const JOB = { ...C.paul, name: 'job', coat: '#8C5A3C', sleeve: '#8C5A3C', pants: '#8C5A3C', sash: '#E6B82A', hair: '#ECE8DF', hairStyle: 'neat', beard: .6, beardCol: '#ECE8DF' };

  // the property: run down (grey, a rain cloud, a bare tree) or cared for (warm, flowers)
  function property(t, t0, o = {}) {
    const e = i => o.still ? null : stagger(t0, i), nice = o.nice || 0;
    board(o.board || 'day'); if (nice > 0) glow(700, 1250, 520, '#FFE2A8', .35 * nice);
    P('city_wintertree', 220, 1560, 340, { in: e(0), a: 1 - nice });
    P('life_house', 700, 1560, 620, { in: e(1), sway: .004, tint: nice > .5 ? null : [150, 138, 132] });
    if (o.room) P('life_house', 1000, 1560, 300, { in: o.room, snd: 'pop', sway: .004 });
    if (nice > .5) { P('life_flowers', 870, 1750, 210, { in: o.still ? null : (o.flowers || e(2)), snd: 'pop' }); P('life_flowers', 1010, 1740, 190, { in: o.still ? null : (o.flowers || e(2)) + .1, snd: false }); }
    else if (!o.noRain) P('sky_raincloud', 700, 900, 220, { in: e(2), sway: .03, snd: 'pop' });
  }
  const BX = 540, BBY = 1760, BH = 600;
  function hospBed(t, t0, o = {}) {
    board('plum'); glow(540, 1300, 520, '#F3F6FA', .25); P('room_window', 880, 1240, 300, { in: o.still ? null : stagger(t0, 0) });
    P('room_bed', BX, BBY, BH, { in: o.still ? null : stagger(t0, 1), sway: .002, tint: [235, 240, 248] }); const tin = o.still ? -9 : stagger(t0, 2);
    person(BX, BBY - BH * .44, 11, OWN, { in: o.still ? null : tin, mood: 'sad', key: 'ownbed', snd: false, aL: -1.2, aR: -1.2 });
    if (T > tin + .4) piecePart('room_bed', BX, BBY, BH, .43, 1);
  }
  function girls(t, x, y, u, tin, mood, k = '') { for (let i = 0; i < 2; i++) person(x + i * u * 6, y, u * (i ? .92 : 1), GIRLS[i], { in: tin == null ? null : tin + i * .1, mood, look: -1, key: 'girl' + i + k }); }
  function driveBy(t, t1, x1 = 400) {   // the car rolls in from the left and stops in front of the house
    const k = ease(seg(t, t1, t1 + 1.6)), hop = k < 1 ? Math.abs(Math.sin(t * 9)) * 8 : 0;
    P('city_car', lerp(-300, x1, k), 1820 - hop, 230, { rot: k < 1 ? -.03 * Math.sin(t * 9) : 0, sway: 0, snd: false });
    if (t > t1 && t < t1 + .1) cue('car' + t1.toFixed(1), t1, 'car', 540, 1.6);
  }

  // ---------- shots ----------
  function shHook(t, lt) {   // owed money on a run down house; no threats; he pictured driving past: "isn't the yard beautiful?"
    const t0 = t - lt, wn = WT('hook', 'never'), wp = WT('hook', 'pictured'), wb = WT('hook', 'beautiful');
    camBegin(540, 1050, 1.0);
    if (t < wp - .3) { property(t, t0); person(220, 1870, 26, RS, { in: wn - .3, mood: 'neutral', look: 1, key: 'rs' }); }
    else { property(t, wp - .3, { nice: 1 }); driveBy(t, wp - .2); if (t > wb - .2) { glow(700, 1100, 400, '#FFD27A', .5); cue('beau', wb, 'chime', 700, 300); } }
    camEnd();
  }
  function shVerse(t, lt) {      // Job: decree a thing; it shall be established; the light shall shine
    const t0 = t - lt, wd = WT('verse', 'decree'), wl = WT('verse', 'light');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(620, 1000, 600, '#FFD27A', .2 + .5 * ease(seg(t, wl - .2, wl + .6)));
    if (t > wd - .2) P('prop_scroll', 760, 1300, 300, { in: wd - .2, snd: 'pop', sway: .02 });
    if (t > wl - .2) P('bible_star', 760, 820, 180, { in: wl - .2, snd: 'sparkle', sway: .05 });
    person(330, 1840, 40, JOB, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'job' });
    camEnd();
  }
  function shMeaning(t, lt) {    // decree it, then let it be established
    const t0 = t - lt, we = WT('meaning', 'established');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > we - .2) { P('life_house', 780, 1500, 360, { in: we - .2, snd: 'pop', sway: .004 }); glow(780, 1300, 260, '#FFD27A', .5); }
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shDeed(t, lt) {       // a trust deed; payments in trouble; run down; money spent in bars
    const t0 = t - lt, wp = WT('deed', 'payments'), wt = WT('deed', 'trouble'), wr = WT('deed', 'run'), wo = WT('deed', 'owners');
    camBegin(540, 1050, 1.0);
    if (t < wr - .3) { board('plum'); person(330, 1860, 30, RS, { in: t0 + .05, mood: t > wt ? 'worried' : 'neutral', look: 1, key: 'rs', aR: .3 });
      if (t > wp - .2) P('prop_envelope', 720, 1300, 260, { in: wp - .2, snd: 'pop', sway: .03 }); if (t > wt - .2) P('sky_raincloud', 720, 1000, 200, { in: wt - .2, sway: .03, snd: 'pop' }); }
    else { property(t, wr - .3); if (t > wo - .2) { person(560, 1880, 24, OWN, { in: wo - .2, mood: 'skeptical', look: 1, key: 'own' }); person(860, 1880, 26, OHUS, { in: wo - .1, mood: 'skeptical', look: -1, key: 'ohus' }); } }
    camEnd();
  }
  function shGirls(t, lt) {      // two little girls, nine and eleven, not cared for
    const t0 = t - lt, wg = WT('girls', 'girls'), wc = WT('girls', 'cared');
    camBegin(540, 1050, 1.0); property(t, t0, { still: true, noRain: false });
    if (t > wg - .3) girls(t, 520, 1880, 16, wg - .3, t > wc ? 'sad' : 'neutral');
    camEnd();
  }
  function shDrive(t, lt) {      // in his imagination he drives his wife past: "isn't the yard beautiful? so neat and well cared for"
    const t0 = t - lt, wd = WT('drive', 'drove'), wb = WT('drive', 'beautiful'), wn = WT('drive', 'neat');
    camBegin(540, 1050, 1.0); property(t, t0, { nice: 1 }); driveBy(t, wd - .3);
    if (t > wd + 1.3) { person(150, 1870, 24, RS, { in: wd + 1.3, mood: 'happy', look: 1, key: 'rs', talk: talk(t), aR: t > wb ? .6 : -1.2 }); person(640, 1870, 22, WIFE, { in: wd + 1.4, mood: 'happy', look: -1, key: 'wife' }); }
    if (t > wb - .2) glow(700, 1100, 400, '#FFD27A', .5);
    if (t > wn) { stars(700, 1050, t, wn); cue('neat', wn, 'sparkle', 700, 300); }
    camEnd();
  }
  function shWords(t, lt) {      // "this is one trust deed we will never have to worry about"
    const t0 = t - lt, wn = WT('words', 'never'), ww = WT('words', 'worry');
    camBegin(540, 1050, 1.04); property(t, t0, { nice: 1, still: true }); P('city_car', 400, 1820, 230, { sway: 0 });
    person(150, 1870, 24, RS, { mood: t > ww ? 'beam' : 'happy', look: 1, key: 'rs', talk: talk(t) }); person(640, 1870, 22, WIFE, { mood: t > ww ? 'beam' : 'happy', look: -1, key: 'wife' });
    if (t > wn - .2) { glow(700, 1100, 420, '#FFD27A', .55); P('bible_star', 700, 800, 160, { in: wn - .2, snd: 'chime', sway: .05 }); }
    camEnd();
  }
  function shEvery(t, lt) {      // every time the property came to mind, he played the scene again
    const t0 = t - lt, wm = WT('every', 'mind'), wa = WT('every', 'again');
    camBegin(540, 1000, 1.0); board('plum'); person(300, 1860, 30, RS, { in: t0 + .05, mood: 'warm', look: 1, key: 'rs' });
    if (t > wm - .3) { P('island_cloud', 700, 1150, 480, { in: wm - .3, snd: 'pop', sway: .02 }); P('life_house', 700, 1100, 200, { in: wm - .1, snd: false, sway: .004 }); glow(700, 1050, 260, '#FFD27A', .4); }
    if (t > wa - .5) tally(t, 200, 700, 7, Array.from({ length: 7 }, (_, i) => wa - .5 + i * .12), 115);
    camEnd();
  }
  function shAccident(t, lt) {   // a car accident; in the hospital; her husband disappeared; the neighbors looked after the girls
    const t0 = t - lt, wa = WT('accident', 'accident'), wh = WT('accident', 'hospital'), wd = WT('accident', 'disappeared'), wn = WT('accident', 'neighbors');
    if (t < wh - .3) { const [sx, sy] = shakeCam(t, wa, 26); camBegin(540 + sx, 1050 + sy, 1.0); board('day'); P('city_car', 540, 1780, 300, { in: t0 + .05, sway: 0, rot: t > wa ? -.12 : 0 }); if (t > wa) cue('crash', wa, 'pat', 540, 300); }
    else if (t < wn - .3) { camBegin(540, 1050, 1.0); hospBed(t, wh - .3); if (t > wd - .3) { const go = ease(seg(t, wd, wd + 1.2)); person(lerp(240, -200, go), 1870, 26, OHUS, { in: wd - .3, mood: 'neutral', look: -1, key: 'ohus' }); } }
    else { camBegin(540, 1050, 1.0); property(t, wn - .3, { noRain: true }); person(300, 1870, 25, NEIGH, { in: wn - .3, mood: 'warm', look: 1, key: 'neigh', aR: .4 }); girls(t, 560, 1880, 16, wn - .1, 'neutral', 'n'); }
    camEnd();
  }
  function shVisit(t, lt) {      // he thought about visiting; but in his scene the family was happy; he kept imagining
    const t0 = t - lt, wv = WT('visit', 'visiting'), wh = WT('visit', 'happy'), wi = WT('visit', 'imagining');
    camBegin(540, 1000, 1.0); board('plum'); P('room_door', 880, 1560, 460, { in: t0 + .05 });
    person(lerp(360, 560, ease(seg(t, wv - .2, wv + .8))) - (t > wh ? 200 * ease(seg(t, wh - .2, wh + .6)) : 0), 1860, 30, RS, { in: t0 + .05, mood: t > wh ? 'warm' : 'worried', look: t > wh ? -1 : 1, key: 'rs' });
    if (t > wh - .3) { P('island_cloud', 560, 1050, 420, { in: wh - .3, snd: 'pop', sway: .02 }); person(500, 1000, 7, OWN, { in: wh - .2, mood: 'beam', key: 'co', snd: false }); person(590, 1000, 5, GIRLS[0], { in: wh - .1, mood: 'beam', key: 'cg0', snd: false }); person(640, 1000, 4.6, GIRLS[1], { in: wh, mood: 'beam', key: 'cg1', snd: false }); glow(560, 1000, 240, '#FFD27A', .45); }
    if (t > wi) cue('img', wi, 'chime', 560, 200);
    camEnd();
  }
  function shGone(t, lt) {       // she and the girls disappeared; but the payments kept coming
    const t0 = t - lt, wd = WT('gone', 'disappeared'), wp = WT('gone', 'payments'), go = ease(seg(t, wd - .2, wd + 1.4));
    camBegin(540, 1050, 1.0); property(t, t0, { still: true, noRain: true });
    if (go < 1) { person(lerp(500, 1300, go), 1870, 25, OWN, { mood: 'neutral', look: 1, key: 'own' }); girls(t, lerp(640, 1440, go), 1880, 16, null, 'neutral', 'g'); }
    if (t > wp - .2) for (let i = 0; i < 3; i++) P('prop_envelope', 260 + i * 70, lerp(700, 1500 + i * 30, ease(seg(t, wp - .2 + i * .25, wp + .5 + i * .25))), 160, { in: wp - .2 + i * .25, snd: i ? false : 'pop', rot: .1 * Math.sin(t * 3 + i), sway: 0 });
    camEnd();
  }
  function shBack(t, lt) {       // back with a new husband; payments up to date; girls happy; a room added
    const t0 = t - lt, wn = WT('back', 'husband'), wp = WT('back', 'date'), wg = WT('back', 'girls'), wr = WT('back', 'room');
    camBegin(540, 1050, 1.0); property(t, t0, { nice: 1, flowers: wg - .2, room: t > wr - .2 ? wr - .2 : 9999 });
    person(lerp(1300, 520, ease(seg(t, t0 + .1, t0 + 1.4))), 1870, 25, OWN, { in: t0 + .1, mood: 'happy', look: -1, key: 'own' });
    if (t > wn - .3) person(lerp(1400, 680, ease(seg(t, wn - .3, wn + .9))), 1870, 27, NHUS, { in: wn - .3, mood: 'warm', look: -1, key: 'nhus' });
    if (t > wp - .2) { P('prop_envelope', 200, 1100, 200, { in: wp - .2, snd: 'pop', sway: .03 }); cue('paid', wp, 'chime', 200, 200); }
    if (t > wg - .2) girls(t, 260, 1880, 16, wg - .2, 'beam', 'b');
    camEnd();
  }
  function shLesson(t, lt) {     // no threats, no eviction; he didn't force anyone; he pictured the end
    const t0 = t - lt, we = WT('lesson', 'end');
    camBegin(540, 1050, 1.0); board('plum');
    if (t > we - .3) { P('island_cloud', 720, 1200, 460, { in: we - .3, snd: 'pop', sway: .02 }); P('life_house', 720, 1150, 200, { in: we - .2, snd: false, sway: .004 }); glow(720, 1100, 280, '#FFD27A', .5); }
    person(300, 1860, 30, RS, { in: t0 + .05, mood: t > we ? 'beam' : 'warm', look: 1, key: 'rs' });
    camEnd();
  }
  function shClose(t, lt) {      // what place do you keep worrying about? drive past it tonight
    const t0 = t - lt, wd = WT('close', 'drive'), wg = WT('close', 'good');
    camBegin(540, 1000, 1.0); board('night'); P('island_moon', 820, 820, 110, { in: t0 + .1, snd: false });
    if (t > wd - .3) { P('island_cloud', 760, 1200, 360, { in: wd - .3, snd: 'pop' }); P('life_house', 760, 1160, 150, { in: wd - .2, snd: false, sway: .004 }); }
    if (t > wg - .2) glow(760, 1100, 240, '#FFD27A', .5);
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'worry'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('deed') - .12, shDeed], [S('girls') - .12, shGirls], [S('drive') - .12, shDrive], [S('words') - .12, shWords], [S('every') - .12, shEvery], [S('accident') - .12, shAccident], [S('visit') - .12, shVisit], [S('gone') - .12, shGone], [S('back') - .12, shBack], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
