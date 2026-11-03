window.CHEAP = true; window.FELT = true;
// Episode 2 v2, flannelgraph cut: "Where Are You Staying" (You Are In Barbados retold) built from the felt cutout kit (kit/cutouts) on felt boards.
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

  // ---------- sets ----------
  function street(t, t0, o = {}) {     // a New York block at night
    const e = i => o.still ? null : stagger(t0, i, .07);
    P('sky_stars', 220, 430, 250, { in: e(0) }); P('island_moon', 870, 360, 220, { in: e(1), sway: .03, out: o.moonOut });
    P('city_skyscraper', 820, 1230, 780, { in: e(2), sway: .004 }); P('city_rowhouses', 230, 1250, 470, { in: e(3), sway: .004 });
    if (!o.noBrown) P('city_brownstone', 590, 1345, 780, { in: e(4), sway: .004, out: o.brownOut });
    P('city_wintertree', 120, 1440, 520, { in: e(5), sway: .025 }); P('city_streetlamp', 960, 1470, 640, { in: e(6), sway: .018 });
    P('sky_snowdrift', 860, 1880, 150, { in: e(7) }); P('sky_snowdrift', 170, 1900, 120, { in: e(8) });
  }
  function study(t, t0, warm, o = {}) { // Abdullah's study
    const e = i => o.still ? null : stagger(t0, i);
    board('plum');
    P('room_bookshelf', 190, 1390, 900, { in: e(0), sway: .004 }); P('room_window', 640, 1000, 560, { in: e(1), sway: .004 });
    if (warm > 0) { glow(640, 760, 380, '#FFC07A', warm); P('island_sun', 700, 820, 200 * warm, { sway: .05, snd: false }); P('island_palm', 560, 960, 300 * warm, { sway: .05, snd: false }); }
    P('room_radiator', 640, 1360, 250, { in: e(2) }); if (!o.noDesk) { P('room_desk', 930, 1420, 400, { in: e(3), sway: .004 }); P('room_lamp', 960, 1110, 230, { in: e(4) }); }
    rug(540, 1790, 330, { in: e(5) });
    if (warm > 0) glow(540, 1200, 900, '#FF9A5A', warm * .25);
  }

  // ---------- shots ----------
  function shHook(t, lt) {   // "Where are you staying? I don't mean where your house is. I mean where you are staying, inside."
    const t0 = t - lt, wh = WT('hook', 'house'), wi = WT('hook', 'inside'), ins = ease(seg(t, wi - .1, wi + .6));
    camBegin(540, lerp(1000, 1080, ins), lerp(1.0, 1.12, ins)); board('plum');
    if (t > wh - .1) P('city_brownstone', 230, 1300, 600, { in: wh - .1, sway: .01, out: wi - .15 });
    if (ins > 0) glow(540, 1350, 520, '#FFC766', .9 * ins);
    host(t, 540, 1780, 40, { in: t0 + .02, aL: t > wh - .1 && t < wi ? .45 : -1.2, aR: t > wi - .05 ? -.25 : -1.2, look: t > wh && t < wi ? -.6 : 0, mood: t > wi ? 'warm' : 'neutral' });
    if (t > wi - .1) { P('island_cloud', 780, 1060, 300, { in: wi - .1, snd: 'pop', sway: .02 }); P('island_islandhouse', 780, 1010, 150, { in: wi + .05, snd: false, sway: .03 }); }
    if (t > wi) cue('inside', wi, 'chime', 540, 300);
    feltSnow(t, 10, .7 * (1 - ins), 3);
    camEnd();
  }
  function shVerse(t, lt, dur) {   // John 1:38: two disciples follow Jesus; he turns; no address; "come and see"
    const t0 = t - lt, wj = WT('verse', 'jesus'), wa = WT('verse', 'address'), wc = WT('verse', 'come'), ws = WT('verse', 'see');
    camBegin(540, 1000, 1.0 + .02 * lt); board('sand');
    P('island_sun', 850, 430, 200, { in: stagger(t0, 0), sway: .02 }); P('island_cloud', 280, 480, 160, { in: stagger(t0, 1), sway: .02 });
    P('sky_hill', 300, 1460, 360, { in: stagger(t0, 2), sway: 0 }); P('sky_hill', 820, 1440, 420, { in: stagger(t0, 3), sway: 0, flip: true });
    P('bible_olivetree', 900, 1560, 560, { in: stagger(t0, 4), sway: .02 }); P('bible_tent', 160, 1560, 300, { in: stagger(t0, 5), sway: .004 });
    const walk = ease(seg(t, t0 + .4, wj + .6)), bob = k => Math.abs(Math.sin(t * 7 + k)) * 14 * (1 - walk);
    const jx = lerp(1300, 760, ease(seg(t, t0 + .2, wj)));
    if (t > wc - .1) glow(jx, 1350, 420, '#FFE2A8', .7 * ease(seg(t, wc - .1, ws + .4)));
    person(lerp(-200, 200, walk), 1830 - bob(0), 28, DISC1, { mood: t > wa ? 'surprised' : 'hopeful', look: 1, key: 'd1', aL: t > WT('verse', 'question') - .1 && t < wa ? .3 : -1.2 });
    person(lerp(-420, 400, walk), 1840 - bob(1.3), 30, DISC2, { mood: t > ws ? 'awe' : 'hopeful', look: 1, key: 'd2' });
    if (t > wa - .1) P('prop_envelope', 560, 1080, 150, { in: wa - .1, out: wa + .7, snd: 'pop', sway: .04, rot: -.1 });
    person(jx, 1830, 32, JESUS, { mood: 'wise', look: t > wj ? -1 : -.3, key: 'jes', aL: t > wc - .15 ? lerp(-1.2, .9, ease(seg(t, wc - .15, wc + .2))) + .25 * Math.sin((t - wc) * 7) * (t < ws + .8 ? 1 : 0) : -1.2 });
    camEnd();
  }
  function shMeaning(t, lt) {    // a house is a place; a state is morning and night; then: Neville and Abdullah
    const t0 = t - lt, wp = WT('meaning', 'place'), ww = WT('meaning', 'wake'), wa = WT('meaning', 'asleep'), wn = WT('meaning', 'neville'), wb = WT('meaning', 'abdullah');
    if (t < wn - .15) {
      const night = ease(seg(t, wa - .2, wa + .5)); camBegin(540, 1000, 1.0); board('day'); if (night > 0) board('night', night);
      P('life_house', 700, 1460, 520, { in: stagger(t0, 0), sway: .006, out: wp + .05 });
      if (t > ww - .1) P('island_sun', 760, 700, 230, { in: ww - .1, out: wa - .1, snd: 'chime', sway: .03 });
      if (t > wa - .1) P('island_moon', 760, 700, 230, { in: wa - .1, sway: .03 });
      if (t > ww - .1) rug(700, 1800, 360, { in: ww });
      host(t, 300, 1800, 36, { in: t0 + .02, aR: t > ww - .1 ? .3 : -1.2, look: .5, mood: 'warm' });
      if (t > wa) zzz(760, 1100, t, wa + .2, .8);
      camEnd(); return;
    }
    camBegin(540, 1000, 1.0 + .015 * (t - wn)); study(t, wn - .1, 0);
    person(780, 1800, 30, C.neville, { in: wn - .1, mood: 'hopeful', look: -.6, key: 'nev' });
    if (t > wb - .2) person(320, 1800, 34, C.abdullah, { in: wb - .2, mood: 'wise', look: .6, key: 'abd' });
    camEnd();
  }
  function shPut(t, lt) {        // a man keeps pointing Neville to a door; Neville doesn't trust him and walks the other way
    const t0 = t - lt, wm = WT('put', 'meet'), wt = WT('put', 'trust'), wo = WT('put', 'off'), go = ease(seg(t, wo - .3, wo + .9));
    camBegin(540, 1000, 1.0); board('night'); street(t, t0);
    person(300, 1820, 28, C.skeptic, { in: stagger(t0, 9), mood: t > wt ? 'skeptical' : 'happy', look: .6, key: 'man', aR: t > wm - .2 ? .5 + .2 * Math.sin(t * 8) : -1.2, talk: t < wt ? talk(t) : null });
    person(lerp(720, 1350, go), 1830, 30, C.neville, { in: stagger(t0, 10), mood: t > wt - .1 ? 'skeptical' : 'neutral', look: t > wo - .3 ? 1 : -.7, key: 'nev', lean: go > 0 && go < 1 ? -.1 : 0 });
    if (t > wo - .3) cue('walkoff', wo - .2, 'whoosh', 900, 300);
    P('room_clock', 880, 760, 200, { in: wt, rot: ease(seg(t, wo - .3, wo + 1.2)) * TAU * 2, sway: 0 });
    feltSnow(t, 22, 1, 5);
    camEnd();
  }
  function shLate(t, lt) {       // the lecture: rows of chairs; Abdullah walks up; the clock spins six months
    const t0 = t - lt, ws = WT('late', 'six'), wl = WT('late', 'late'), ww = WT('late', 'walked');
    camBegin(540, 1000, 1.0); board('sand');
    const spin = ease(seg(t, ws - .2, wl + .3)) * TAU * 3;
    P('room_clock', 820, 640, 330, { in: stagger(t0, 0), rot: spin, sway: 0, snd: 'pat' }); if (t > ws - .2 && t < wl + .3) cue('ticks', ws - .2, 'ticks', 820, wl - ws + .5);
    P('room_painting', 300, 640, 260, { in: stagger(t0, 1) });
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) P('room_chair', 170 + c * 250 + r * 40, 1300 + r * 230, 300, { in: stagger(t0, 2 + r * 4 + c, .06), sway: .006 });
    person(lerp(1300, 780, ease(seg(t, ww - .2, ww + 1))), 1800, 28, C.neville, { mood: t > wl ? 'surprised' : 'neutral', look: -1, key: 'nev', dy: t > wl ? -.25 * Math.exp(-(t - wl) * 4) : 0 });
    const ax = lerp(-180, 330, ease(seg(t, ws - 1.4, ws - .1)));
    person(ax, 1800, 32, C.abdullah, { mood: t > ws ? 'wise' : 'neutral', aL: t > ws ? .3 : -1.2, look: 1, key: 'abd', lean: t < ws ? .04 * Math.sin(t * 9) : 0 });
    camEnd();
  }
  function shHow(t, lt) {        // "how do you know me?" a cloud of robed brothers over Abdullah; the clock again
    const t0 = t - lt, wk = WT('how', 'know'), wb = WT('how', 'brothers'), ws = WT('how', 'six');
    camBegin(560, 1150, 1.15); board('sand');
    P('room_painting', 300, 640, 260, { still: true });
    person(330, 1800, 34, C.abdullah, { mood: 'wise', look: 1, key: 'abd', aL: t > wb ? .4 : -1.2 });
    person(780, 1800, 28, C.neville, { mood: t > wk - .3 && t < wb ? 'worried' : t > ws ? 'surprised' : 'skeptical', look: -1, key: 'nev', aR: t > wk - .3 && t < wb ? .2 : -1.2 });
    if (t > wb - .2) { P('island_cloud', 330, 1040, 330, { in: wb - .2, snd: 'pop', sway: .02 });
      [[230, -.4], [330, 0], [430, .4]].forEach(([x, lk], i) => person(x, 1000, 7, i === 1 ? DISC1 : DISC2, { in: wb + i * .1, mood: 'wise', look: lk, key: 'bro' + i, snd: false })); }
    if (t > ws - .2) { P('room_clock', 840, 760, 200, { in: ws - .2, rot: ease(seg(t, ws, ws + 1)) * TAU * 2, sway: 0, snd: 'ticks' }); }
    camEnd();
  }
  function shHome(t, lt, dur) {   // the snowy street; Neville broke on the stoop; the car drives by; on "Barbados" a thought cloud
    const t0 = t - lt, wb = WT('home', 'barbados'), wbr = WT('home', 'broke');
    camBegin(540, lerp(900, 1000, ease(seg(lt, 0, dur))), lerp(1.08, 1.0, ease(seg(lt, 0, dur)))); board('night');
    street(t, t0);
    person(590, 1520, 22, C.neville, { in: stagger(t0, 9), mood: t > wb ? 'happy' : 'sad', look: t > wb ? -.2 : 0, lookY: t > wb ? -1 : .4, key: 'nev', aL: t > wbr && t < wb ? .1 : -1.2, aR: t > wbr && t < wb ? .1 : -1.2 });
    { const k = ease(seg(t, t0 + 1.2, t0 + 4.2)); if (k > 0 && k < 1) { const hop = Math.abs(Math.sin(t * 9)) * 10 * (1 - k); P('city_car', lerp(-300, 1380, k), 1700 - hop, 190, { rot: -.04 * Math.sin(t * 9) * (1 - k), sway: 0, snd: false }); cue('car', t0 + 1.2, 'car', 540, 2.9); } }
    if (t > wb - .15) { P('island_cloud', 600, 1020, 230, { in: wb - .15, sway: .02, snd: 'pop' }); P('island_sun', 680, 930, 90, { in: wb + .05, snd: false }); P('island_palm', 520, 960, 130, { in: wb + .12, snd: false }); }
    feltSnow(t, 26);
    camEnd();
  }
  function shAsk(t, lt) {        // the study: Neville asks; "you are in Barbados" warms the window; Abdullah walks off and shuts his door
    const t0 = t - lt, wb = WT('ask', 'barbados'), wt = WT('ask', 'turns'), ww = WT('ask', 'walks'), wd = WT('ask', 'door'), warm = ease(seg(t, wb - .1, wb + .8)) * (1 - .6 * ease(seg(t, wd, wd + .6)));
    const shut = easeIn(seg(t, wd - .4, wd)), dx = 900;
    camBegin(540, 1000, 1.0 + .012 * lt); study(t, t0, warm, { noDesk: true });
    if (t > wb - .1) cue('askchime', wb - .05, 'chime', 640, 300);
    P('room_door', lerp(1060, dx, shut), 1650, 1000, { in: stagger(t0, 6), sx: lerp(.28, 1, shut), sway: .003 });
    if (shut < .98) { const ax = lerp(700, dx, ease(seg(t, ww - .1, wd - .4))); person(ax, 1800, 34, C.abdullah, { in: stagger(t0, 7), mood: t > wb - .3 ? 'wise' : 'neutral', aR: t > wb - .2 && t < wt ? .5 : -1.2, look: t > wt ? 1 : -.6, key: 'abd' }); }
    if (t > wd - .05) cue('shut', wd, 'door', dx, 500);
    person(lerp(300, 480, ease(seg(t, ww, wd))), 1810, 30, C.neville, { in: stagger(t0, 8), mood: t > wd ? 'sad' : t > wb + .2 ? 'surprised' : 'worried', look: .8, lookY: t > wb + .2 && t < wt ? -.6 : 0, key: 'nev' });
    camEnd();
  }
  function shSleep(t, lt) {      // Neville in bed in the cold room; the room warms into Barbados
    const t0 = t - lt, wn = WT('sleep', 'night'), wa = WT('sleep', 'asleep'), wb = WT('sleep', 'barbados'), k = ease(seg(t, wn - .2, wb + .6));
    camBegin(540, 1050, 1.0 + .04 * ease(seg(lt, 0, 5))); board('night'); if (k > 0) board('warm', k);
    P('room_window', 540, 860, 520, { in: stagger(t0, 0) });
    if (k > 0) { glow(540, 620, 360, '#FFC07A', k); P('island_sun', 610, 640, 170 * k, { snd: false }); P('island_palm', 460, 800, 280 * k, { sway: .05, snd: false }); }
    P('room_radiator', 160, 1380, 220, { in: stagger(t0, 1) });
    rug(300, 1860, 260, { in: stagger(t0, 1.5) });
    const bx = 560, bby = 1720, bh = 640;
    P('room_bed', bx, bby, bh, { in: stagger(t0, 2), sway: .003 });
    person(bx, bby - bh * .44, 11.5, { ...C.neville, hat: null }, { in: stagger(t0, 3), mood: t > wa ? 'sleepy' : 'neutral', key: 'nevbed', snd: false, aL: -1.2, aR: -1.2 });
    if (T > stagger(t0, 3) + .4) piecePart('room_bed', bx, bby, bh, .43, 1);
    zzz(700, bby - bh * .85, t, wa + .4);
    if (k > .02) cue('sleepwarm', wn - .1, 'sparkle', 540, 300);
    feltSnow(t, 8, 1 - k, 11);
    camEnd();
  }
  function shLetter(t, lt) {     // the envelope flies through the door; money fans out
    const t0 = t - lt, wl = WT('letter', 'letter'), wm = WT('letter', 'money');
    camBegin(540, 1000, 1.0); board('sand');
    P('room_door', 380, 1450, 900, { in: stagger(t0, 0), sway: .003 }); P('room_clock', 820, 520, 220, { in: stagger(t0, 1) }); rug(600, 1800, 300, { in: stagger(t0, 2) });
    if (t > wl - .2 && t < wm + .1) { const kk = seg(t, wl - .2, wl + .5); const [x, y] = arcPt([400, 1050], [820, 1250], -260, ease(kk)); P('prop_envelope', x, y, 150, { rot: kk * 6, sway: 0 }); cue('env', wl - .2, 'whoosh', 600, 300); }
    person(820, 1800, 30, C.neville, { in: stagger(t0, 3), mood: t > wm ? 'joy' : t > wl ? 'surprised' : 'neutral', aL: t > wl + .4 ? .3 : -1.2, aR: t > wm ? .5 : -1.2, look: -.5, key: 'nev', dy: t > wm ? -.4 * Math.abs(Math.sin((t - wm) * 6)) * Math.exp(-(t - wm)) : 0 });
    if (t > wm) { const kk = backOut(seg(t, wm, wm + .35)); P('prop_money', 820, 1180, 260 * kk, { sway: .04, snd: false }); cue('cash', wm, 'cash', 820, 300); }
    camEnd();
  }
  function shThird(t, lt) {      // the ticket window: a grey third class ticket; Neville doesn't care, he's happy, and runs off
    const t0 = t - lt, w3 = WT('third', 'third'), wh = WT('third', 'happy'), wr = WT('third', 'runs');
    camBegin(540, 1000, 1.0); board('sand');
    const bx = 540, bby = 1500, bh = 900;
    P('city_ticketbooth', bx, bby, bh, { in: stagger(t0, 0), sway: 0 });
    person(bx, bby - bh * .2, 26, C.skeptic, { in: stagger(t0, 1), mood: 'skeptical', look: .5, aL: t > w3 - .2 ? -.2 : -1.2, key: 'agent', snd: false });
    if (T > stagger(t0, 1) + .4) piecePart('city_ticketbooth', bx, bby, bh, .76, 1);
    const rx = t > wr ? lerp(300, 1300, ease(seg(t, wr, wr + .7))) : 300;
    person(rx, 1820, 30, C.neville, { in: stagger(t0, 2), mood: t > wh - .2 ? 'joy' : t > w3 + .2 ? 'happy' : 'hopeful', look: .4, lookY: -.3, key: 'nev', lean: t > wr ? -.18 : 0, aL: t > wr ? .3 : t > wh - .2 ? .6 : -1.2, aR: t > wr ? -.3 : -1.2,
      hold: t > w3 + .3 ? (x, y, u) => P('prop_ticket', x, y + u * .9, u * 3, { tint: [150, 150, 150], sway: .03, snd: false }) : null,
      dy: t > wh - .2 && t < wr ? -.5 * Math.abs(Math.sin((t - wh) * 6)) : 0 });
    if (t > w3 - .2 && t < w3 + .3) P('prop_ticket', lerp(560, 340, ease(seg(t, w3 - .2, w3 + .3))), bby - bh * .2, 120, { tint: [150, 150, 150], sway: 0, rot: -.08, in: w3 - .2, drop: 0, snd: 'whoosh' });
    if (t > wr) cue('run', wr, 'whoosh', 800, 300);
    camEnd();
  }
  function doorway(t, t0, close, o = {}) {   // the study door, open (squashed to the hinge) or slammed
    board('plum'); rug(540, 1840, 300, { in: o.still ? null : stagger(t0, 0) });
    glow(540, 1050, 380, '#FFD27A', .6 * (1 - close));
  }
  function shStatus(t, lt) {     // Abdullah in his doorway, not impressed; "a man of your status"; "you went first class"
    const t0 = t - lt, wi = WT('status', 'impressed'), wst = WT('status', 'status'), wa = WT('status', 'already'), wf = WT('status', 'first');
    camBegin(540, 1000 + 60 * ease(seg(t, wst - .3, wst + .5)), 1.0 + .1 * ease(seg(t, wst - .3, wst + .5))); doorway(t, t0, 0);
    person(540, 1740, 34, C.abdullah, { in: stagger(t0, 1), mood: t > wa ? 'determined' : t > wi - .2 ? 'skeptical' : 'neutral', aL: t > wf - .1 ? .9 : t > wst - .2 ? .45 : .1, look: .6, key: 'abd' });
    P('room_door', 250, 1640, 1100, { in: stagger(t0, 2), sx: .3, sway: .003 });
    person(890, 1820, 30, C.neville, { in: stagger(t0, 3), mood: t > wa ? 'surprised' : t > wst ? 'worried' : 'joy', look: -1, aL: t < wi ? .5 : -1.2, key: 'nev',
      hold: t < wa ? (x, y, u) => P('prop_ticket', x, y + u * .9, u * 3, { tint: [150, 150, 150], sway: .03, snd: false }) : null });
    if (t > wf - .1) { glow(890, 1200, 300, '#FFD27A', .6 * ease(seg(t, wf - .1, wf + .5))); cue('firstspark', wf, 'sparkle', 890, 300); }
    camEnd();
  }
  function shSlam(t, lt) {       // SLAM: the door swings shut over Abdullah; "no invitation to follow him"
    const ws = WT('slam', 'slams'), sl = ws + .25, wf = WT('slam', 'follow'), k = easeIn(seg(t, ws - .1, sl)), [sx, sy] = shakeCam(t, sl);
    camBegin(540 + sx, 1000 + sy, 1.0); doorway(t, 0, k, { still: true });
    if (k < .98) person(540, 1740, 34, C.abdullah, { mood: 'determined', look: -1, key: 'abd' });
    P('room_door', lerp(250, 540, k), 1640, 1100, { sx: lerp(.3, 1, k), sway: .003 }); cue('slam', sl, 'door', 540, 900);
    const step = ease(seg(t, wf - .3, wf + .2)) * (1 - ease(seg(t, wf + .3, wf + .7)));
    person(890 - 120 * step, 1820, 30, C.neville, { mood: t > sl ? 'surprised' : 'worried', look: -1, key: 'nev', dy: t > sl ? -.6 * Math.exp(-(t - sl) * 5) : 0, lean: t > sl ? .12 * Math.exp(-(t - sl) * 3) : 0, aL: step > .2 ? .2 : -1.2 });
    stars(890, 1180, t, sl);
    camEnd();
    if (t > sl && t < sl + .08) flash(.5, '#FFFFFF');
  }
  function shSail(t, lt) {       // the dock: good news; the ticket turns gold; the ship's horn
    const t0 = t - lt, wg = WT('sail', 'good'), wf = WT('sail', 'first'), gold = ease(seg(t, wf - .2, wf + .4));
    camBegin(540, 1000, 1.0 + .015 * lt); board('day');
    P('island_sun', 880, 430, 220, { in: stagger(t0, 0), sway: .02 }); P('island_cloud', 260, 470, 170, { in: stagger(t0, 1), sway: .02 });
    P('city_liner', 640, 1330, 640, { in: stagger(t0, 2), sway: .01 });
    for (let i = 0; i < 4; i++) P('island_waves', 140 + i * 280, 1400 + (i % 2) * 14, 110, { in: stagger(t0, 3 + i, .05), sway: .02 });
    P('city_pier', 180, 1560, 300, { in: stagger(t0, 7) });
    if (t > wf + .3) cue('horn', wf + .3, 'horn', 640, 640);
    person(250, 1820, 30, C.skeptic, { in: stagger(t0, 8), mood: t > wg ? 'happy' : 'neutral', aR: t > wg ? .2 : -1.2, look: 1, key: 'agent' });
    person(760, 1820, 32, C.neville, { in: stagger(t0, 9), mood: t > wf ? 'awe' : 'hopeful', look: -1, key: 'nev', aL: .1,
      hold: (x, y, u) => P('prop_ticket', x - u * .5, y + u * .9, u * 3.2, { tint: gold > 0 ? [255, lerp(255, 214, gold), lerp(255, 90, gold)] : [150, 150, 150], sway: .02, snd: false }),
      dy: t > wf + .5 ? -.8 * Math.abs(Math.sin((t - wf - .5) * 5)) * Math.exp(-(t - wf - .5) * .8) : 0 });
    if (t > wf - .2 && t < wf + .2) cue('goldspark', wf - .1, 'sparkle', 760, 300);
    camEnd();
  }
  function shStayed(t, lt, dur) { // Neville already at home under the palm; on "caught up" the liner sails in behind him
    const t0 = t - lt, wst = WT('stayed', 'stayed'), wc = WT('stayed', 'caught'), ship = ease(seg(t, WT('stayed', 'world') - .3, wc + .6));
    camBegin(540, 1000, 1.0 + .02 * lt); board('warm');
    P('island_sun', 860, 430, 220, { in: stagger(t0, 0), sway: .02 }); P('island_cloud', 280, 520, 160, { in: stagger(t0, 1), sway: .02 });
    if (ship > 0) P('city_liner', lerp(-400, 300, ship), 1330, 420, { sway: .01, snd: false });
    for (let i = 0; i < 4; i++) P('island_waves', 140 + i * 280, 1400 + (i % 2) * 14, 100, { in: stagger(t0, 2 + i, .05), sway: .02 });
    for (let i = 0; i < 4; i++) P('sky_beach', 140 + i * 280, 1600, 130, { in: stagger(t0, 6 + i, .05), sway: 0 });
    P('island_islandhouse', 820, 1560, 400, { in: stagger(t0, 10) }); P('island_palm', 600, 1640, 560, { in: stagger(t0, 11), sway: .03 });
    if (ship > .05) cue('horn2', WT('stayed', 'world') - .2, 'horn', 300, 400);
    person(560, 1860, 28, C.neville, { in: stagger(t0, 12), mood: t > wst ? 'sleepy' : 'warm', look: -1, key: 'nev', lean: -.05, aL: -1.2 });
    if (t > wst) zzz(680, 1380, t, wst + .2, .8);
    camEnd();
  }
  function shClose(t, lt) {      // back on the street: on "staying" the brownstone and moon peel away and the island takes their place
    const t0 = t - lt, ws = WT('close', 'staying'), warm = ease(seg(t, ws - .1, ws + .9));
    camBegin(540, 1000, 1.0); board('night'); if (warm > 0) board('warm', warm);
    street(t, t0, { brownOut: ws - .15, moonOut: ws - .15 });
    if (t > ws) { glow(590, 1100, 420, '#FFC766', warm); P('island_islandhouse', 590, 1345, 520, { in: ws + .1, snd: 'chime' }); P('island_sun', 870, 360, 200, { in: ws + .3, snd: false }); }
    host(t, 860, 1820, 36, { in: t0 + .3, mood: 'warm', aL: t > ws - .2 ? .1 : -1.2, look: t > ws ? -.4 : 0 });
    feltSnow(t, 20, 1 - warm, 21);
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: the temple pressed on; the app in Emery's hand; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wm = WT('cta', 'manifesting'), wap = WT('cta', 'app'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'slip'),
      wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wt - .2) { glow(700, 900, 460, '#FFD27A', ease(seg(t, wt - .2, wt + .5)) * (t > wg - .3 ? .5 : 1)); P('bible_temple', 700, 1160, 480, { in: wt - .2, snd: 'chime', sway: .006, out: wg - .3 }); }
    if (t > wm - .1 && t < wap + .8) P('life_coinbag', 760, 1500, 200, { in: wm - .1, out: wap + .3, snd: 'pop', tint: [170, 170, 170] });
    if (t > wg - .3) { P('sky_hill', 760, 1500, 520, { in: wg - .3, sway: 0 }); const up = ease(seg(t, we - .2, we + .8)); P('bible_star', 760, lerp(1180, 930, up), 170, { in: wg, sway: .05, snd: 'sparkle' }); }
    if (t > wmf - .1) { stars(760, 900, t, wmf); cue('mf', wmf, 'sparkle', 760, 400); }
    const dip = t > wsl - .2 ? Math.sin(Math.PI * seg(t, wsl - .2, wsl + .7)) : 0;
    host(t, 300, 1820, 36, { in: t0 + .1, aL: t > wt - .3 && t < wap ? .35 : -1.2, aR: t > wap - .2 ? .25 : -1.2, look: t > wt ? .5 : 0, dy: .5 * dip, lean: -.06 * dip, mood: dip > .3 ? 'worried' : 'warm',
      holdR: t > wap - .2 ? (x, y, u) => phone(x, y + u * 1.2, u * 1.25, t, clamp((t - wap + .2) / .3)) : null });
    if (t > wap - .2) cue('phone', wap - .1, 'pat', 300, 200);
    camEnd();
  }
  function shComment(t, lt, dur) { // "Comment temple": the temple returns, Emery points to it; iris out
    const t0 = t - lt, wc = WT('comment', 'comment'), wt = WT('comment', 'temple');
    camBegin(540, 1000, 1.0); board('plum');
    glow(560, 1000, 560, '#FFD27A', ease(seg(t, wt - .2, wt + .5)));
    if (t > wt - .2) P('bible_temple', 560, 1240, 600, { in: wt - .2, snd: 'chime', sway: .006 });
    host(t, 540, 1830, 40, { in: t0 + .02, aR: t > wc ? .5 : -1.2, mood: 'warm', look: 0 });
    camEnd();
    if (t > DUR - .9) { const kk = seg(t, DUR - .9, DUR - .1); iris(560, 1000, lerp(1300, 0, easeIn(kk)), PAL.ink); }
  }

  shots([
    [0, shHook], [S('verse') - .1, shVerse], [S('meaning') - .1, shMeaning], [S('put') - .15, shPut], [S('late') - .15, shLate], [S('how') - .1, shHow],
    [S('home') - .15, shHome], [S('ask') - .15, shAsk], [S('sleep') - .15, shSleep], [S('letter') - .1, shLetter], [S('third') - .15, shThird],
    [S('status') - .15, shStatus], [S('slam') - .05, shSlam], [S('sail') - .15, shSail], [S('stayed') - .1, shStayed], [S('close') - .15, shClose],
    [S('cta') - .1, shCta], [S('comment') - .1, shComment],
  ]);
})();
