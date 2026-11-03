window.CHEAP = true; window.FELT = true;
// Episode 25, flannelgraph cut: "The Swing" (L.H. lands on her feet) built from the felt cutout kit (kit/cutouts) on felt boards.
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























  const GIRL = { ...C.dreamer, name: 'girl', coat: '#E6B82A', sleeve: '#E6B82A', stripes: null, hair: '#5A3A24', skin: '#EFCBA6' };
  const LH = { ...C.dreamer, name: 'lh', coat: '#3F8F8A', sleeve: '#3F8F8A', stripes: null, hair: '#5A3A24', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const MOM = { ...C.dreamer, name: 'mom', coat: '#B8463A', sleeve: '#B8463A', stripes: null, hair: '#3B2A22', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const DOC = { ...C.skeptic, name: 'doc', coat: '#F3EBDC', sleeve: '#F3EBDC', lapel: '#D9D4C8', tie: '#3F6FB0', hat: null };
  const JOEL = { ...C.paul, name: 'joel', coat: '#8C5A3C', sleeve: '#8C5A3C', pants: '#8C5A3C', sash: '#3F8F8A', hair: '#5A4636', hairStyle: 'neat', beard: .6, beardCol: '#5A4636' };
  const SX = 540, STOP = 900, SL = 640;   // swing: centre x, top bar y, rope length
  function swingFrame(a = 1) {   // a felt swing set: two posts and a top bar
    if (window.CUEMODE || a <= 0) return; flushBrush(); push(); noStroke();
    fill(58, 42, 34, 255 * a); rect(SX - 330 + 6, STOP - 20 + 8, 660, 44, 14); rect(SX - 330 + 6, STOP + 8, 40, 960, 12); rect(SX + 290 + 6, STOP + 8, 40, 960, 12);
    fill(140, 90, 60, 255 * a); rect(SX - 330, STOP - 20, 660, 44, 14); rect(SX - 330, STOP, 40, 960, 12); rect(SX + 290, STOP, 40, 960, 12); pop();
  }
  function seatAt(ang) { return [SX + Math.sin(ang) * SL, STOP + Math.cos(ang) * SL]; }
  function swingSeat(ang, a = 1) { if (window.CUEMODE || a <= 0) return; const [x, y] = seatAt(ang); flushBrush(); push(); stroke(58, 42, 34, 255 * a); strokeWeight(7);
    line(SX - 60, STOP + 10, x - 60, y); line(SX + 60, STOP + 10, x + 60, y); noStroke(); fill(184, 70, 58, 255 * a); rect(x - 90, y - 8, 180, 28, 10); pop(); }
  function onSwing(t, ang, mood, key, o = {}) { const [x, y] = seatAt(ang); swingSeat(ang); person(x, y + 12, 15, GIRL, { mood, look: Math.sin(ang) > 0 ? 1 : -1, key, snd: false, aL: .9, aR: .9, ...o }); }
  function yard(t, t0, o = {}) { board('day'); P('island_sun', 880, 700, 150, { in: o.still ? null : t0 + .05 }); P('life_flowers', 140, 1740, 200, { in: o.still ? null : t0 + .1 }); swingFrame(); }
  const BX = 540, BBY = 1760, BH = 600;
  function herBed(t, t0, o = {}) {
    board('night'); P('room_window', 880, 1250, 260, { in: o.still ? null : stagger(t0, 0) }); P('island_moon', 900, 1230, 50, { in: o.still ? null : stagger(t0, 1), snd: false });
    P('room_bed', BX, BBY, BH, { in: o.still ? null : stagger(t0, 2), sway: .002 }); const tin = o.still ? -9 : stagger(t0, 3);
    person(BX, BBY - BH * .44, 11, LH, { in: o.still ? null : tin, mood: o.mood || 'sleepy', key: 'lbed', snd: false, aL: -1.2, aR: -1.2 });
    if (T > tin + .4) piecePart('room_bed', BX, BBY, BH, .43, 1);
  }
  function landing(t, tj, k) {   // the girl leaves the seat at the front of the swing and lands on her feet
    const [x0, y0] = seatAt(.5), x1 = x0 + 70, y1 = 1870, j = clamp((t - tj) / .7), x = lerp(x0, x1, j), y = lerp(y0, y1, j) - Math.sin(j * PI) * 220;
    person(x, y + 12, 15, GIRL, { mood: j >= 1 ? 'beam' : 'joy', look: 1, key: k, snd: false, aL: j < 1 ? .9 : .7, aR: j < 1 ? .9 : .7 });
    if (j >= 1) cue('land' + k, tj + .7, 'pop', x1, 300);
  }

  // ---------- shots ----------
  function shHook(t, lt) {   // a fall off a swing when she was little; thirty nine years; she went back and landed on her feet
    const t0 = t - lt, wf = WT('hook', 'fell'), wt = WT('hook', 'thirty'), wb = WT('hook', 'back'), wfe = WT('hook', 'feet');
    camBegin(540, 1050, 1.0);
    if (t < wt - .2) { yard(t, t0); const fall = clamp((t - wf) / .6); if (t < wf) onSwing(t, .5 * Math.sin(t * 2.4), 'happy', 'g1');
      else { swingSeat(.5 * Math.sin(t * 2.4)); const [x0, y0] = seatAt(-.5); person(lerp(x0, x0 - 40, fall), lerp(y0, 1870, fall * fall) + 12, 15, GIRL, { mood: 'worried', look: -1, key: 'g1', snd: false }); if (fall >= 1) cue('thud', wf + .6, 'door', 400, 300); } }
    else if (t < wb - .2) { board('plum'); P('sky_raincloud', 540, 1080, 220, { in: wt - .2, sway: .03, snd: 'pop' }); person(540, 1860, 30, LH, { in: wt - .2, mood: 'sad', look: 0, key: 'lh' }); }
    else { yard(t, wb - .2); if (t < wfe - .9) onSwing(t, .5 * Math.sin((t - wb) * 2.4 + 1.2), 'joy', 'g2'); else { swingSeat(.5 * Math.cos((t - wfe) * 2)); landing(t, wfe - .9, 'g2'); } if (t > wfe - .2) glow(SX + 380, 1700, 300, '#FFD27A', .5); }
    camEnd();
  }
  function shVerse(t, lt) {      // Joel: I will restore to you the years that the locust hath eaten
    const t0 = t - lt, wr = WT('verse', 'restore'), wy = WT('verse', 'years');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, wr - .2, wr + .6)));
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (t > wy - .2) P('room_clock', 780, 1000, 180, { in: wy - .2, snd: 'chime' });
    person(420, 1840, 40, JOEL, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'joel', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // even the years you already lost
    const t0 = t - lt, wl = WT('meaning', 'lost');
    camBegin(540, 1000, 1.0); board('plum'); P('room_clock', 780, 1100, 200, { in: t0 + .1, tint: t < wl ? [160, 160, 170] : null }); if (t > wl) glow(780, 1100, 240, '#FFD27A', .6);
    host(t, 360, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shFall(t, lt) {       // three or four, a very high swing; she falls backward and hurts her hip
    const t0 = t - lt, wb = WT('fall', 'backward'), wh = WT('fall', 'hip'), fall = clamp((t - wb + .1) / .6);
    camBegin(540, 1050, 1.0); yard(t, t0);
    if (t < wb - .1) onSwing(t, .6 * Math.sin(t * 2.4), 'joy', 'g');
    else { swingSeat(.6 * Math.sin(t * 2.4)); const [x0, y0] = seatAt(-.6); person(lerp(x0, x0 - 40, fall), lerp(y0, 1870, fall * fall) + 12, 15, GIRL, { mood: t > wh ? 'sad' : 'worried', look: -1, key: 'g', snd: false }); if (fall >= 1) cue('thud', wb + .5, 'door', 400, 300); }
    if (t > wh - .1) glow(seatAt(-.6)[0] - 40, 1780, 120, '#E05A4A', .6);
    camEnd();
  }
  function shPain(t, lt) {       // thirty nine years; the doctor puts it right; it comes back; a lot of money
    const t0 = t - lt, wd = WT('pain', 'doctor'), wb = WT('pain', 'back'), wm = WT('pain', 'money');
    camBegin(540, 1000, 1.0); board('plum'); P('sky_raincloud', 300, 1060, 220, { in: t0 + .2, sway: .03, snd: 'pop' });
    glow(300, 1650, 120 + 20 * Math.sin(t * 4), '#E05A4A', .45);
    if (t > wd - .2) person(760, 1860, 30, DOC, { in: wd - .2, mood: t > wb ? 'sad' : 'warm', look: -1, key: 'doc', aL: t < wb ? .4 : -1.2 });
    if (t > wm - .2) P('life_coinbag', 540, 1300, 150, { in: wm - .2, tint: [150, 150, 160], snd: 'pop' });
    person(300, 1860, 30, LH, { in: t0 + .05, mood: t > wb ? 'sad' : 'hopeful', look: 1, key: 'lh' });
    camEnd();
  }
  function shRevision(t, lt) {   // Neville on revision; that August it got worse; she tests it on the accident itself
    const t0 = t - lt, wa = WT('revision', 'august'), wt = WT('revision', 'test');
    camBegin(540, 1000, 1.0); board('plum');
    if (t < wa - .2) person(780, 1840, 32, C.neville, { in: t0 + .05, mood: 'warm', look: -1, key: 'nev', talk: talk(t), aL: .4 });
    else P('sky_raincloud', 700, 1050, 300, { in: wa - .2, sway: .04, snd: 'pop' });
    if (t > wt - .2) { P('island_cloud', 760, 1350, 260, { in: wt - .2, snd: 'pop' }); swingMini(760, 1260, 90, t); }
    person(320, 1860, 30, LH, { in: t0 + .05, mood: t > wt ? 'determined' : t > wa ? 'sad' : 'hopeful', look: 1, key: 'lh' });
    camEnd();
  }
  function swingMini(x, y, s, t) { if (window.CUEMODE) return; flushBrush(); push(); noStroke(); fill(140, 90, 60); rect(x - s, y - s * .6, s * 2, 10, 4); rect(x - s, y - s * .6, 8, s * 1.4, 4); rect(x + s - 8, y - s * .6, 8, s * 1.4, 4);
    const a = .4 * Math.sin(t * 2.4), sx = x + Math.sin(a) * s * .8, sy = y - s * .6 + Math.cos(a) * s * .8; stroke(58, 42, 34); strokeWeight(3); line(x, y - s * .6, sx, sy); noStroke(); fill(184, 70, 58); rect(sx - 20, sy - 4, 40, 10, 4); pop(); }
  function shNights(t, lt) {     // many nights before she could feel herself back there, a little girl playing; then it worked
    const t0 = t - lt, wg = WT('nights', 'girl'), ww = WT('nights', 'worked');
    camBegin(540, 1050, 1.04); herBed(t, t0, { mood: t > ww ? 'happy' : 'sleepy' });
    tally(t, 150, 760, 8, Array.from({ length: 8 }, (_, i) => t0 + .4 + i * .2), 110);
    if (t > wg - .3) { P('island_cloud', 400, 1050, 300, { in: wg - .3, snd: 'pop' }); swingMini(400, 950, 80, t); }
    if (t > ww) { glow(400, 960, 240, '#FFD27A', .6); cue('worked', ww, 'sparkle', 400, 300); }
    camEnd();
  }
  function shSwing(t, lt) {      // the wind as it goes higher; as it slows she jumps forward and lands on her feet
    const t0 = t - lt, wh = WT('swing', 'higher'), wj = WT('swing', 'jumped'), wf = WT('swing', 'feet'), amp = lerp(.3, .6, ease(seg(t, t0, wh))) * (t > wh ? lerp(1, .8, ease(seg(t, wh, wj))) : 1);
    camBegin(540, 1050, 1.0); yard(t, t0); glow(540, 1200, 600, '#FFE2A8', .25);
    if (t < wj - .1) { onSwing(t, amp * Math.sin((t - t0) * 2.4), 'joy', 'g'); if (t > wh - .2) for (let i = 0; i < 3; i++) { const k = ((t * 1.5 + i / 3) % 1); glow(lerp(1000, 100, k), 1100 + i * 120, 40, '#FFFFFF', .5 * (1 - k)); } }
    else { swingSeat(amp * Math.cos((t - wj) * 2)); landing(t, wj - .1, 'g'); }
    if (t > wf - .1) glow(SX + 380, 1700, 300, '#FFD27A', .6);
    camEnd();
  }
  function shMother(t, lt) {     // she runs to her mother, makes her watch, jumps again, lands safely on both feet
    const t0 = t - lt, wm = WT('mother', 'mother'), wj = WT('mother', 'jumped'), wf = WT('mother', 'feet');
    camBegin(540, 1050, 1.0); yard(t, t0, { still: true });
    person(170, 1860, 26, MOM, { in: t0 + .05, mood: t > wf ? 'joy' : 'warm', look: 1, key: 'mom', aL: t > wf ? .7 : -1.2 });
    if (t < wj - .9) { const r = ease(seg(t, t0, wm + .4)); swingSeat(.15 * Math.sin(t * 2)); person(lerp(seatAt(0)[0], 320, r), 1870, 15, GIRL, { mood: 'beam', look: -1, key: 'g', snd: false, aR: .6 }); }
    else if (t < wj - .1) onSwing(t, .5 * Math.sin((t - wj) * 3 + 1.5), 'joy', 'g');
    else { swingSeat(.5 * Math.cos((t - wj) * 2)); landing(t, wj - .1, 'g'); }
    if (t > wf) cue('mf', wf, 'sparkle', 900, 300);
    camEnd();
  }
  function shOver(t, lt) {       // over and over, until she fell asleep doing it
    const t0 = t - lt, wa = WT('over', 'asleep');
    camBegin(540, 1050, 1.04); herBed(t, t0, { mood: t > wa ? 'sleepy' : 'happy' }); if (t > wa) zzz(640, 1250, t, wa, .9);
    P('island_cloud', 400, 1050, 300, { in: t0 + .1, snd: 'pop' }); swingMini(400, 950, 80, t);
    camEnd();
  }
  function shResult(t, lt) {     // in two days the pain starts to go; in two months it's gone; after thirty nine years
    const t0 = t - lt, wd = WT('result', 'days'), wg = WT('result', 'gone'), wt = WT('result', 'thirty');
    camBegin(540, 1000, 1.0); board('day'); P('life_flowers', 160, 1740, 200, { in: t0 + .05 }); P('life_flowers', 920, 1740, 200, { in: t0 + .1 });
    if (t < wg) P('sky_raincloud', 540, 1060, 220, { in: t0 + .05, out: wg - .2, sway: .03, snd: false });
    if (t > wd - .3) tally(t, 470, 760, 2, [wd - .3, wd - .15], 140);
    if (t < wg) glow(540, 1650, 120 * (1 - ease(seg(t, wd, wg))), '#E05A4A', .45);
    if (t > wg) { glow(540, 1400, 480, '#FFD27A', .6); cue('gone', wg, 'sparkle', 540, 300); }
    person(540, 1860, 32, LH, { in: t0 + .05, mood: t > wg ? 'joy' : 'hopeful', look: 0, key: 'lh', aL: t > wt ? .7 : -1.2, aR: t > wt ? .7 : -1.2 });
    camEnd();
  }
  function shLesson(t, lt) {     // she didn't fight the pain; she changed the moment it started
    const t0 = t - lt, wm = WT('lesson', 'moment');
    camBegin(540, 1050, 1.0); board('plum');
    if (t < wm - .2) { P('sky_raincloud', 540, 1080, 260, { in: t0 + .05, sway: .04, snd: 'pop' }); person(540, 1860, 30, LH, { in: t0 + .05, mood: 'determined', look: 0, key: 'lh' }); }
    else { yard(t, wm - .2); onSwing(t, .5 * Math.sin((t - wm) * 2.4), 'beam', 'g'); glow(540, 1400, 400, '#FFD27A', .4); }
    camEnd();
  }
  function shClose(t, lt) {      // what moment would you go back and change?
    const t0 = t - lt, wc = WT('close', 'change');
    camBegin(540, 1000, 1.0); board('plum'); if (t > wc - .3) { P('island_cloud', 780, 1050, 280, { in: wc - .3, snd: 'pop' }); swingMini(780, 840, 80, t); }
    host(t, 380, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'replaying'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('fall') - .12, shFall], [S('pain') - .12, shPain], [S('revision') - .12, shRevision], [S('nights') - .12, shNights], [S('swing') - .12, shSwing], [S('mother') - .12, shMother], [S('over') - .12, shOver], [S('result') - .12, shResult], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
