window.CHEAP = true; window.FELT = true;
// Episode 14, flannelgraph cut: "Toes in the Sand" (the niece, the aunt, and Florida) built from the felt cutout kit (kit/cutouts) on felt boards.
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












  const WIFE = { ...C.dreamer, name: 'wife', coat: '#3F6FB0', sleeve: '#3F6FB0', stripes: null, hair: '#B5643A', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.4 };
  const AUNT = { ...C.dreamer, name: 'aunt', coat: '#7A4E8A', sleeve: '#7A4E8A', stripes: null, hair: '#C8C2B8', skin: '#EFCBA6', torso: 7.2, leg: 4.4, w: 4.8 };
  const HUSB = { ...C.skeptic, name: 'husband', coat: '#5E6B3A', sleeve: '#5E6B3A', lapel: '#4A5230', tie: '#4A5230', pants: '#4A5230', hat: 'cap', hatCol: '#4A5230', band: '#C9963A', glasses: false };
  const RUTH = { ...C.paul, name: 'ruth', coat: '#B8463A', sleeve: '#B8463A', pants: '#B8463A', sash: '#E6B82A', hair: '#3B2A22', hairStyle: 'curls', beard: 0, skin: '#C98E62', w: 4.6 };
  const NAOMI = { ...C.paul, name: 'naomi', coat: '#6B7A8F', sleeve: '#6B7A8F', pants: '#6B7A8F', sash: '#E9DFC8', hair: '#D8D2C8', hairStyle: 'neat', beard: 0, skin: '#C98E62', w: 4.8 };
  function shoes(x, y, s) { if (window.CUEMODE) return; flushBrush(); push(); translate(x, y); noStroke(); for (const dx of [-s * .4, s * .4]) { fill(30, 18, 12, 70); ellipse(dx + 4, 5, s * .7, s * .3); fill(246, 240, 226); ellipse(dx, 0, s * .76, s * .36); fill(58, 40, 34); ellipse(dx, 0, s * .66, s * .28); } pop(); }
  function beach(t, t0, o = {}) { const e = i => o.still ? null : stagger(t0, i, .05);
    P('island_sun', 860, 440, 200, { in: e(0), sway: .03 }); P('island_palm', 900, 1500, 560, { in: e(1), sway: .04 + .02 * Math.sin(t * 2) });
    for (let i = 0; i < 4; i++) P('island_waves', 140 + i * 270, 1520, 120, { in: e(2 + i), sway: .02 });
    for (let i = 0; i < 4; i++) P('sky_beach', 140 + i * 270, 1700 + (i % 2) * 10, 150, { in: e(6 + i), sway: 0 }); }

  // ---------- shots ----------
  function shHook(t, lt) {   // the orders said Europe; off come the shoes; the sand of Florida
    const t0 = t - lt, ws = WT('hook', 'shoes'), wf = WT('hook', 'florida'), warm = ease(seg(t, ws, wf + .3));
    camBegin(540, 1000, 1.0); board('night'); if (warm > 0) board('warm', warm);
    if (t > ws) beach(t, ws); else P('prop_scroll', 760, 1200, 220, { in: t0 + .1, tint: [170, 170, 170], snd: 'pop' });
    person(360, 1860, 30, WIFE, { in: t0 + .05, mood: t > ws ? 'beam' : 'sad', look: .3, key: 'wife' }); person(600, 1860, 30, AUNT, { in: t0 + .1, mood: t > ws ? 'warm' : 'neutral', look: -.3, key: 'aunt' });
    if (t > ws - .2 && t < wf) shoes(480, 1900, 70);
    camEnd();
  }
  function shVerse(t, lt) {      // Ruth goes with Naomi: whither thou goest, I will go
    const t0 = t - lt, wg = WT('verse', 'go'), walk = ease(seg(t, wg - .2, wg + 2.5));
    camBegin(540, 1050, 1.0 + .02 * lt); board('sand'); glow(540, 1300, 520, '#FFE2A8', .5);
    P('sky_hill', 300, 1460, 360, { in: stagger(t0, 0), sway: 0 }); P('bible_olivetree', 900, 1560, 480, { in: stagger(t0, 1), sway: .02 }); P('bible_citygate', 860, 1500, 360, { in: stagger(t0, 2), sway: .003 });
    person(lerp(300, 520, walk), 1860, 32, NAOMI, { in: stagger(t0, 3), mood: 'warm', look: 1, key: 'naomi' }); person(lerp(150, 380, walk), 1860, 30, RUTH, { in: stagger(t0, 4), mood: t > wg ? 'determined' : 'hopeful', look: 1, key: 'ruth', aR: t > wg - .2 ? .2 : -1.2 });
    camEnd();
  }
  function shMeaning(t, lt) {    // she decided where she would be: a star pressed onto the map of her life
    const t0 = t - lt, wd = WT('meaning', 'decided');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wd - .2) { P('island_palm', 780, 1500, 360, { in: wd - .2, snd: 'pop', sway: .04 }); P('bible_star', 780, 900, 160, { in: wd, snd: 'chime' }); glow(780, 1100, 300, '#FFD27A', .6); }
    host(t, 340, 1830, 38, { in: t0 + .02, mood: t > wd ? 'warm' : 'neutral', look: .6 });
    camEnd();
  }
  function shHusband(t, lt) {    // Atlantic City: the officer and his wife by the pier
    const t0 = t - lt; camBegin(540, 1000, 1.0); board('day');
    P('island_cloud', 260, 480, 160, { in: stagger(t0, 0) }); for (let i = 0; i < 4; i++) P('island_waves', 140 + i * 270, 1500, 120, { in: stagger(t0, 1 + i, .05), sway: .02 }); P('city_pier', 860, 1600, 300, { in: stagger(t0, 5) });
    person(360, 1860, 32, HUSB, { in: stagger(t0, 6), mood: 'happy', look: 1, key: 'hus' }); person(600, 1860, 30, WIFE, { in: stagger(t0, 7), mood: 'happy', look: -1, key: 'wife' });
    camEnd();
  }
  function shOrders(t, lt) {     // his unit is ordered overseas: a liner pulls away toward Europe
    const t0 = t - lt, wo = WT('orders', 'ordered'), we = WT('orders', 'europe'), go = ease(seg(t, we - .4, we + 1.4));
    camBegin(540, 1000, 1.0); board('day'); for (let i = 0; i < 4; i++) P('island_waves', 140 + i * 270, 1500, 120, { sway: .02 });
    P('city_liner', lerp(560, 1400, go), 1460, 380, { in: t0 + .1, sway: .01, snd: false }); if (go > 0) cue('horn', we - .3, 'horn', 700, 600);
    if (t > wo - .3 && t < we) P('prop_scroll', 360, 1200, 200, { in: wo - .3, snd: 'pop', tint: [170, 170, 170] });
    person(300, 1860, 30, WIFE, { in: t0 + .05, mood: t > wo ? 'sad' : 'neutral', look: 1, key: 'wife' });
    camEnd();
  }
  function shHope(t, lt) {       // she hoped for Florida: a cloud with a palm; together
    const t0 = t - lt, wf = WT('hope', 'florida'), wt = WT('hope', 'together');
    camBegin(540, 1000, 1.0); board('warm');
    if (t > wf - .3) { P('island_cloud', 540, 1060, 400, { in: wf - .3, snd: 'pop' }); P('island_palm', 500, 1040, 180, { in: wf - .1, snd: false }); P('island_sun', 620, 960, 80, { in: wf, snd: false }); }
    person(380, 1860, 32, HUSB, { in: t0 + .05, mood: 'warm', look: 1, key: 'hus' }); person(680, 1860, 30, WIFE, { in: t0 + .1, mood: t > wt ? 'beam' : 'hopeful', look: -1, key: 'wife', aL: t > wt ? .3 : -1.2 });
    if (t > wt) glow(530, 1500, 260, '#FFC0A0', .6);
    camEnd();
  }
  function shAunt(t, lt) {       // the aunt: lights out, shoes off
    const t0 = t - lt, wl = WT('aunt', 'lights'), ws = WT('aunt', 'shoes'), dark = ease(seg(t, wl - .1, wl + .4));
    camBegin(540, 1000, 1.0); board('warm'); if (dark > 0) board('night', dark);
    P('room_window', 780, 860, 420, { in: stagger(t0, 0) }); P('room_lamp', 160, 1150, 240, { in: stagger(t0, 1) }); if (dark < 1) glow(160, 1000, 300, '#FFC07A', .6 * (1 - dark)); if (t > wl) cue('click', wl, 'pat', 160, 200);
    person(380, 1860, 30, AUNT, { in: stagger(t0, 2), mood: 'warm', look: 1, key: 'aunt', talk: t < wl ? talk(t) : null }); person(640, 1860, 30, WIFE, { in: stagger(t0, 3), mood: 'hopeful', look: -1, key: 'wife' });
    if (t > ws - .1) { shoes(520, 1910, 70); cue('shoes', ws, 'pat', 520, 200); }
    camEnd();
  }
  function shImagine(t, lt) {    // the dark room becomes Florida: breeze, salt air, toes in the sand
    const t0 = t - lt, wb = WT('imagine', 'breeze'), wsa = WT('imagine', 'sand'), warm = ease(seg(t, t0 + .3, wb + .4));
    camBegin(540, 1000, 1.0); board('night'); if (warm > 0) board('warm', warm);
    if (t > t0 + .3) beach(t, t0 + .3); if (t > wb) cue('breeze', wb, 'whoosh', 540, 600);
    const wiggle = t > wsa - .2 ? Math.abs(Math.sin((t - wsa) * 8)) * .2 : 0;
    person(380, 1860, 30, AUNT, { mood: 'sleepy', key: 'aunt', dy: -wiggle }); person(640, 1860, 30, WIFE, { mood: t > wsa ? 'beam' : 'sleepy', key: 'wife', dy: -wiggle });
    if (t > wsa) cue('sand', wsa, 'sparkle', 520, 300);
    camEnd();
  }
  function shHours(t, lt) {      // within forty eight hours: new orders, Florida, instructor
    const t0 = t - lt, wc = WT('hours', 'changed'), wf = WT('hours', 'florida'), gold = ease(seg(t, wc - .2, wc + .4));
    camBegin(540, 1000, 1.0); board('day'); tally(t, 400, 700, 2, [t0 + .3, t0 + .5], 140);
    person(380, 1860, 32, HUSB, { in: t0 + .05, mood: t > wf ? 'joy' : 'surprised', look: 1, key: 'hus', aR: .4, holdR: (x, y, u) => P('prop_scroll', x, y + u, u * 4.5, { tint: [255, lerp(170, 214, gold), lerp(170, 90, gold)], sway: .02, snd: false }) });
    if (t > wf - .2) { P('island_palm', 760, 1560, 420, { in: wf - .2, snd: 'chime', sway: .04 }); P('island_sun', 840, 600, 180, { in: wf, snd: false }); }
    camEnd();
  }
  function shTrain(t, lt, dur) { // five days later she boards a train to join him
    const t0 = t - lt, k = ease(seg(t, t0 + .8, t0 + dur));
    camBegin(540, 1000, 1.0); board('day'); tally(t, 300, 700, 5, Array.from({ length: 5 }, (_, i) => t0 + .1 + i * .1), 120);
    P('life_train', lerp(540, 1500, k), 1700, 420, { in: t0 + .2, sway: .006, snd: false }); if (k > 0) cue('train', t0 + .8, 'car', 700, 2);
    if (k < .1) person(540, 1860, 28, WIFE, { mood: 'joy', look: 1, key: 'wife', aR: .8 });
    camEnd();
  }
  function shStayed(t, lt) {     // her aunt stays home: it was her niece's desire, not hers
    const t0 = t - lt; camBegin(540, 1000, 1.0); board('warm'); P('room_window', 760, 860, 420, { in: stagger(t0, 0) });
    sitIn2(t, 420, 1840, 420, AUNT, { in: stagger(t0, 1), mood: 'warm', key: 'aunt', aR: .4 + .3 * Math.sin(t * 8) });
    if (t > t0 + .4) { P('island_cloud', 760, 1080, 260, { in: t0 + .4, snd: 'pop' }); person(760, 1120, 6, WIFE, { in: t0 + .5, mood: 'joy', key: 'wc', snd: false }); }
    camEnd();
  }
  function sitIn2(t, cx, by, h, spec, o = {}) { P('room_armchair', cx, by, h, { in: o.in, sway: .003 }); person(cx, by - h * .22, 22, spec, o); if (T > (o.in ?? -9) + .4) piecePart('room_armchair', cx, by, h, .58, 1); }
  function shLesson(t, lt) {     // they didn't argue with the orders: Florida first, barefoot, in the dark
    const t0 = t - lt, wb = WT('lesson', 'barefoot'), wd = WT('lesson', 'dark');
    camBegin(540, 1000, 1.0); board('night'); if (t > wb - .2) beach(t, wb - .2);
    if (t < wb) P('prop_scroll', 540, 1200, 200, { in: t0 + .1, out: wb - .3, tint: [170, 170, 170], snd: 'pop' });
    person(400, 1860, 30, AUNT, { in: t0 + .05, mood: 'sleepy', key: 'aunt' }); person(660, 1860, 30, WIFE, { in: t0 + .1, mood: t > wd ? 'beam' : 'sleepy', key: 'wife' });
    camEnd();
  }
  function shClose(t, lt) {      // where would you put your feet tonight?
    const t0 = t - lt, wf = WT('close', 'feet');
    camBegin(540, 1000, 1.0); board('night'); if (t > wf - .2) for (let i = 0; i < 4; i++) P('sky_beach', 140 + i * 270, 1960, 140, { in: wf - .2 + i * .05, snd: i ? false : 'pop', sway: 0 });
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0, aR: t > wf - .2 ? .3 : -1.2 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'standing'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('husband') - .12, shHusband], [S('orders') - .12, shOrders], [S('hope') - .12, shHope], [S('aunt') - .12, shAunt], [S('imagine') - .12, shImagine], [S('hours') - .12, shHours], [S('train') - .12, shTrain], [S('stayed') - .12, shStayed], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
