window.CHEAP = true; window.FELT = true;
// Episode 35, flannelgraph cut: "Like Heaven" (G.B. pictures the boy happy) built from the felt cutout kit (kit/cutouts) on felt boards.
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

































  const GB = { ...C.dreamer, name: 'gb', coat: '#C9963A', sleeve: '#C9963A', stripes: null, hair: '#5A3A24', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const TCH = { ...C.blake, name: 'tch', coat: '#3F6FB0', sleeve: '#3F6FB0', lapel: '#F3EBDC', pants: '#2E3A52', hat: null, hair: '#3B2A22', skin: '#EFCBA6' };
  const BOY = { ...C.dreamer, name: 'boyr', coat: '#B8463A', sleeve: '#B8463A', stripes: null, hair: '#E6B82A', skin: '#EFCBA6' };
  const MOM = { ...C.dreamer, name: 'momr', coat: '#4A3A52', sleeve: '#4A3A52', stripes: null, hair: '#2B1E19' };
  const GMA = { ...C.dreamer, name: 'gmar', coat: '#5E6B3A', sleeve: '#5E6B3A', stripes: null, hair: '#B8B2A8' };
  const NEWT = { ...C.dreamer, name: 'newt', coat: '#3F8F8A', sleeve: '#3F8F8A', stripes: null, hair: '#B5643A', torso: 7.2, leg: 4.6, w: 4.6 };
  const KIDS = ['#3F6FB0', '#E6B82A', '#7A4E8A'].map((c, i) => ({ ...C.dreamer, name: 'k' + i, coat: c, sleeve: c, stripes: null, hair: ['#2B1E19', '#B5643A', '#3B2A22'][i] }));
  const ISAIAH = { ...C.paul, name: 'isaiah', coat: '#3F6FB0', sleeve: '#3F6FB0', pants: '#3F6FB0', sash: '#E6B82A', hair: '#ECE8DF', hairStyle: 'neat', beard: .6, beardCol: '#ECE8DF' };
  function school(t, t0, o = {}) { board('day'); P('city_brownstone', 720, 1500, 640, { in: o.still ? null : t0 + .05, tint: [230, 200, 170] }); P('city_wintertree', 220, 1500, 340, { in: o.still ? null : t0 + .1 }); }
  const BX = 540, BBY = 1760, BH = 600;
  function herBed(t, t0, o = {}) {
    board('night'); P('room_window', 880, 1250, 260, { in: o.still ? null : stagger(t0, 0) }); P('island_moon', 900, 1230, 50, { in: o.still ? null : stagger(t0, 1), snd: false });
    P('room_bed', BX, BBY, BH, { in: o.still ? null : stagger(t0, 2), sway: .002 }); const tin = o.still ? -9 : stagger(t0, 3);
    person(BX, BBY - BH * .44, 11, GB, { in: o.still ? null : tin, mood: o.mood || 'sleepy', key: 'gbed', snd: false, aL: -1.2, aR: -1.2 });
    if (T > tin + .4) piecePart('room_bed', BX, BBY, BH, .43, 1);
  }
  function happyBoy(x, y, s, t, tin, k = '') { if (t < tin) return; P('island_cloud', x, y, s, { in: tin, snd: 'pop', sway: .02 }); person(x, y - s * .08, s * .02, BOY, { in: tin + .1, mood: 'beam', key: 'hb' + k, snd: false, aL: .6 + .2 * Math.sin(t * 8), aR: .6 + .2 * Math.sin(t * 8 + 1) }); }

  // ---------- shots ----------
  function shHook(t, lt) {   // no teacher would take him; she pictured him happy; "it's like heaven around school"
    const t0 = t - lt, wp = WT('hook', 'pictured'), wh = WT('hook', 'heaven');
    camBegin(540, 1050, 1.0);
    if (t < wp - .3) { school(t, t0); P('sky_raincloud', 540, 1000, 220, { in: t0 + .2, sway: .03, snd: 'pop' }); person(560, 1870, 18, BOY, { in: t0 + .1, mood: 'determined', look: 0, key: 'boy' }); }
    else if (t < wh - .4) { herBed(t, wp - .3, { mood: 'happy' }); happyBoy(400, 1060, 300, t, wp - .1); }
    else { board('plum'); glow(540, 1300, 520, '#FFD27A', .5); person(540, 1860, 30, TCH, { in: wh - .4, mood: 'beam', look: 0, key: 'tch', aL: .7, aR: .7 }); cue('heaven', wh, 'chime', 540, 300); }
    camEnd();
  }
  function shVerse(t, lt) {      // Isaiah: all thy children taught of the LORD; great shall be their peace
    const t0 = t - lt, wc = WT('verse', 'children'), wp = WT('verse', 'peace');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, wp - .2, wp + .6)));
    if (t > wc - .2) for (let i = 0; i < 3; i++) person(700 + i * 110, 1870, 15, KIDS[i], { in: wc - .2 + i * .1, mood: t > wp ? 'beam' : 'happy', look: -1, key: 'vk' + i });
    person(380, 1840, 40, ISAIAH, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'isaiah', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // great peace, even for the hardest kid in school
    const t0 = t - lt, wh = WT('meaning', 'hardest');
    camBegin(540, 1000, 1.0); board('plum'); if (t > wh - .2) { person(780, 1870, 18, BOY, { in: wh - .2, mood: 'happy', look: -1, key: 'boy' }); glow(780, 1600, 220, '#FFD27A', .4); }
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shSchool(t, lt) {     // too young to expel; no teacher would take him
    const t0 = t - lt, we = WT('school', 'expelled'), wn = WT('school', 'none');
    camBegin(540, 1050, 1.0); school(t, t0);
    person(260, 1860, 28, TCH, { in: t0 + .05, mood: t > wn ? 'worried' : 'neutral', look: 1, key: 'tch' });
    person(560, 1870, 18, BOY, { in: we - .3, mood: 'determined', look: Math.sin(t * 3) > 0 ? 1 : -1, key: 'boy' });
    if (t > wn - .2) P('sky_raincloud', 560, 1100, 200, { in: wn - .2, sway: .03, snd: 'pop' });
    camEnd();
  }
  function shFamily(t, lt) {     // his mother and grandmother camped at the school, making trouble
    const t0 = t - lt, wm = WT('family', 'mother'), wg = WT('family', 'grandmother'), wt = WT('family', 'trouble');
    camBegin(540, 1050, 1.0); school(t, t0, { still: true });
    person(560, 1870, 18, BOY, { mood: 'determined', look: 1, key: 'boy' });
    if (t > wm - .2) person(760, 1860, 26, MOM, { in: wm - .2, mood: t > wt ? 'determined' : 'skeptical', look: -1, key: 'mom', talk: t > wt ? talk(t) : 0, aL: t > wt ? .5 : -1.2 });
    if (t > wg - .2) person(930, 1860, 25, GMA, { in: wg - .2, mood: 'determined', look: -1, key: 'gma', talk: t > wt ? talk(t + 1) : 0 });
    camEnd();
  }
  function shWhy(t, lt) {        // she wanted to help the boy, and her husband
    const t0 = t - lt, wb = WT('why', 'boy'), wh = WT('why', 'husband');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1300, 520, '#FFE2A8', .3);
    if (t > wb - .2) person(800, 1870, 17, BOY, { in: wb - .2, mood: 'neutral', look: -1, key: 'boy' });
    if (t > wh - .2) person(620, 1860, 28, TCH, { in: wh - .2, mood: 'worried', look: -1, key: 'tch' });
    person(300, 1860, 28, GB, { in: t0 + .05, mood: 'warm', look: 1, key: 'gb' });
    camEnd();
  }
  function shImagine(t, lt) {    // every night: the boy as a perfectly normal, happy kid
    const t0 = t - lt, wh = WT('imagine', 'happy');
    camBegin(540, 1050, 1.04); herBed(t, t0, { mood: 'happy' }); happyBoy(400, 1060, 300, t, wh - .4);
    camEnd();
  }
  function shWords(t, lt) {      // her husband: "I can't believe how normal he's acting... what a relief"
    const t0 = t - lt, wn = WT('words', 'normal'), wr = WT('words', 'relief');
    camBegin(540, 1050, 1.04); herBed(t, t0, { still: true, mood: 'beam' });
    P('island_cloud', 540, 1100, 520, { in: t0 + .1, snd: 'pop' }); person(470, 1040, 10, TCH, { in: t0 + .2, mood: t > wr ? 'beam' : 'happy', key: 'tc', snd: false, talk: talk(t) }); person(610, 1040, 7, BOY, { in: wn - .2, mood: 'beam', key: 'bc', snd: false });
    if (t > wr - .2) glow(540, 1000, 300, '#FFD27A', .5);
    camEnd();
  }
  function shMonths(t, lt) {     // every night, about two months
    const t0 = t - lt, wm = WT('months', 'months');
    camBegin(540, 1050, 1.04); herBed(t, t0, { still: true }); zzz(640, 1250, t, t0 + .2, .9); happyBoy(400, 1060, 300, t, -9, 'm');
    tally(t, 150, 760, 8, Array.from({ length: 8 }, (_, i) => wm - .5 + i * .1), 110);
    camEnd();
  }
  function shHeaven(t, lt) {     // he comes home: "It's like heaven around school"; almost her exact words
    const t0 = t - lt, wh = WT('heaven', 'heaven'), we = WT('heaven', 'exact');
    camBegin(540, 1000, 1.0); board('plum'); P('room_door', 880, 1560, 460, { in: t0 + .05 }); glow(540, 1300, 520, '#FFE2A8', .3 + (t > wh ? .3 : 0));
    person(lerp(880, 700, ease(seg(t, t0 + .1, t0 + 1))), 1860, 28, TCH, { in: t0 + .1, mood: 'beam', look: -1, key: 'tch', talk: talk(t), aL: t > wh ? .6 : -1.2 });
    person(320, 1860, 28, GB, { in: t0 + .05, mood: t > we ? 'joy' : 'happy', look: 1, key: 'gb' });
    if (t > wh) cue('hv', wh, 'chime', 540, 300);
    camEnd();
  }
  function shAway(t, lt) {       // the grandmother and mother leave town; a new teacher; the boy does well
    const t0 = t - lt, wo = WT('away', 'town'), wn = WT('away', 'teacher'), ww = WT('away', 'well'), go = ease(seg(t, wo - .3, wo + 1.4));
    camBegin(540, 1050, 1.0); school(t, t0, { still: true });
    if (t < wn - .2) { person(lerp(760, 1300, go), 1860, 26, MOM, { mood: 'neutral', look: 1, key: 'mom' }); person(lerp(930, 1450, go), 1860, 25, GMA, { mood: 'neutral', look: 1, key: 'gma' }); }
    else person(760, 1860, 27, NEWT, { in: wn - .2, mood: 'warm', look: -1, key: 'newt', aL: .4 });
    person(560, 1870, 18, BOY, { mood: t > ww ? 'beam' : 'neutral', look: 1, key: 'boy' });
    if (t > ww) { glow(560, 1650, 220, '#FFD27A', .5); cue('well', ww, 'sparkle', 560, 300); }
    camEnd();
  }
  function shLesson(t, lt) {     // she didn't fight the women; she pictured the relief
    const t0 = t - lt, wr = WT('lesson', 'relief');
    camBegin(540, 1050, 1.0); board('plum');
    if (t < wr - .3) { person(700, 1860, 26, MOM, { in: t0 + .05, mood: 'determined', look: -1, key: 'mom' }); person(860, 1860, 25, GMA, { in: t0 + .1, mood: 'determined', look: -1, key: 'gma' }); }
    else { happyBoy(700, 1300, 380, t, wr - .3, 'l'); glow(700, 1150, 280, '#FFD27A', .5); }
    person(300, 1860, 28, GB, { in: t0 + .05, mood: t > wr ? 'beam' : 'neutral', look: 1, key: 'gb' });
    camEnd();
  }
  function shClose(t, lt) {      // who would you see happy, if you pictured them tonight?
    const t0 = t - lt, wp = WT('close', 'pictured');
    camBegin(540, 1000, 1.0); board('night'); P('island_moon', 820, 820, 110, { in: t0 + .1, snd: false });
    if (t > wp - .3) { P('island_cloud', 780, 1200, 320, { in: wp - .3, snd: 'pop' }); glow(780, 1100, 220, '#FFD27A', .5); }
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'seeing'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('school') - .12, shSchool], [S('family') - .12, shFamily], [S('why') - .12, shWhy], [S('imagine') - .12, shImagine], [S('words') - .12, shWords], [S('months') - .12, shMonths], [S('heaven') - .12, shHeaven], [S('away') - .12, shAway], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
