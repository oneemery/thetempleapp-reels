window.CHEAP = true; window.FELT = true;
// Episode 28, flannelgraph cut: "Every Corner" (M.B. and her daughter) built from the felt cutout kit (kit/cutouts) on felt boards.
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


























  const MB = { ...C.dreamer, name: 'mb', coat: '#8C3B3B', sleeve: '#8C3B3B', stripes: null, hair: '#8C7A68', skin: '#EFCBA6', torso: 7.4, leg: 4.6, w: 4.8 };
  const DAU = { ...C.dreamer, name: 'dau', coat: '#3F6FB0', sleeve: '#3F6FB0', stripes: null, hair: '#B5643A', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.4 };
  const GRAN = { ...C.dreamer, name: 'gran', coat: '#4A3A52', sleeve: '#4A3A52', stripes: null, hair: '#F3EBDC', skin: '#EFCBA6', torso: 6.8, leg: 4.2, w: 4.8 };
  const KIDS = [0, 1, 2].map(i => ({ ...C.dreamer, name: 'gk' + i, coat: ['#E6B82A', '#3F8F8A', '#B8463A'][i], sleeve: ['#E6B82A', '#3F8F8A', '#B8463A'][i], stripes: null, hair: ['#B5643A', '#2B1E19', '#E6B82A'][i] }));
  const MAL = { ...C.paul, name: 'malachi', coat: '#3F8F8A', sleeve: '#3F8F8A', pants: '#3F8F8A', sash: '#C9963A', hair: '#9A958C', hairStyle: 'neat', beard: .6, beardCol: '#9A958C' };
  const SIGNS = {};
  function sign(x, y, w, txt, col = '#2F7A4A', a = 1) {
    if (window.CUEMODE || a <= 0) return; const key = txt + col;
    if (!SIGNS[key]) { const g = createGraphics(700, 220); g.pixelDensity(1); const c = g.drawingContext;
      c.fillStyle = '#3A2A22'; c.beginPath(); c.roundRect(14, 20, 672, 190, 24); c.fill(); c.fillStyle = '#F6F0E2'; c.beginPath(); c.roundRect(4, 6, 672, 190, 24); c.fill();
      c.fillStyle = col; c.beginPath(); c.roundRect(20, 22, 640, 158, 16); c.fill();
      c.fillStyle = '#F6F0E2'; c.font = 'bold 100px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 340, 104); SIGNS[key] = g; }
    flushBrush(); tint(255, 255 * a); image(SIGNS[key], x - w / 2, y - w * 110 / 700, w, w * 220 / 700); noTint();
  }
  function flood(t, t0, tx, ty, n = 10, a = 1) {   // felt bills drifting in from every corner toward a point
    if (t < t0) return; for (let i = 0; i < n; i++) { const ang = i / n * TAU + .3, k = ((t - t0) * .45 + i * .137) % 1, r = lerp(820, 60, ease(k));
      P('prop_money', tx + Math.cos(ang) * r, ty + Math.sin(ang) * r * .8, 150, { rot: ang + t, sway: 0, snd: false, a: a * (1 - k * k), in: t0 + i * .05 }); } }

  // ---------- shots ----------
  function shHook(t, lt) {   // $3,000, fast; no borrowing; within days a check for exactly that, and more
    const t0 = t - lt, wb = WT('hook', 'borrow'), wc = WT('hook', 'check'), wm = WT('hook', 'more');
    camBegin(540, 1000, 1.0); board('plum');
    if (t < wc - .2) P('sky_raincloud', 540, 1060, 240, { in: t0 + .1, sway: .03, snd: 'pop' });
    else { sign(540, 1120, 380, '$3,000', '#2F7A4A', ease(seg(t, wc - .2, wc + .2))); glow(540, 1120, 300, '#FFD27A', .6); }
    if (t > wm - .2) flood(t, wm - .2, 540, 1300, 8);
    person(380, 1860, 30, DAU, { in: t0 + .05, mood: t > wc ? 'joy' : 'worried', look: .4, key: 'dau' });
    person(700, 1860, 30, MB, { in: t0 + .1, mood: t > wc ? 'beam' : t > wb ? 'determined' : 'worried', look: -.4, key: 'mb' });
    camEnd();
  }
  function shVerse(t, lt) {      // Malachi: open you the windows of heaven, pour you out a blessing
    const t0 = t - lt, ww = WT('verse', 'windows'), wp = WT('verse', 'pour');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, wp - .2, wp + .6)));
    if (t > ww - .2) P('room_window', 790, 1050, 300, { in: ww - .2, snd: 'pop' });
    if (t > wp - .2) for (let i = 0; i < 5; i++) { const k = ((t - wp) * .7 + i * .2) % 1; P('life_coinbag', 720 + i * 30, lerp(1080, 1800, k), 70, { sway: 0, snd: false, in: wp - .2 + i * .1 }); }
    person(380, 1840, 40, MAL, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'mal', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // not enough room; more than you asked for
    const t0 = t - lt, wr = WT('meaning', 'room'), wm = WT('meaning', 'more');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wr - .2) for (let i = 0; i < 6; i++) P('life_coinbag', 680 + (i % 3) * 130, 1760 - Math.floor(i / 3) * 120, 130, { in: wr - .2 + i * .12, snd: 'pop' });
    if (t > wm - .2) glow(800, 1600, 300, '#FFD27A', .6);
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shNeed(t, lt) {       // serious money trouble; $3,000 right away
    const t0 = t - lt, wt = WT('need', 'thousand');
    camBegin(540, 1000, 1.0); board('plum'); P('sky_raincloud', 540, 960, 260, { in: t0 + .2, sway: .04, snd: 'pop' });
    if (t > wt - .3) sign(540, 1150, 380, '$3,000', '#8C3B3B', ease(seg(t, wt - .3, wt)));
    person(540, 1860, 32, DAU, { in: t0 + .05, mood: 'worried', look: 0, key: 'dau' });
    camEnd();
  }
  function shOffer(t, lt) {      // the mother offers to borrow it; no; help me with your imagination instead
    const t0 = t - lt, wb = WT('offer', 'borrow'), wn = WT('offer', 'no'), wi = WT('offer', 'imagination');
    camBegin(540, 1000, 1.0); board('plum');
    person(720, 1860, 30, MB, { in: t0 + .05, mood: t > wn ? 'surprised' : 'warm', look: -1, key: 'mb', aL: t > wb && t < wn + .3 ? .5 : -1.2, hold: t > wb - .2 && t < wn + .3 ? (x, y, u) => P('life_coinbag', x, y + u, u * 3, { sway: .02, snd: false }) : null });
    person(340, 1860, 30, DAU, { in: t0 + .05, mood: t > wi ? 'hopeful' : 'determined', look: t > wn && t < wi ? (Math.sin(t * 6) > 0 ? .8 : .2) : 1, key: 'dau' });
    if (t > wi - .3) { P('island_cloud', 540, 1100, 320, { in: wi - .3, snd: 'pop' }); glow(540, 1000, 240, '#FFD27A', .5); }
    camEnd();
  }
  function shPlan(t, lt) {       // money flooding toward her from every corner; no how; just joy
    const t0 = t - lt, wf = WT('plan', 'flooding'), wj = WT('plan', 'joy');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1400, 520, '#FFE2A8', .3 + (t > wj ? .3 : 0));
    flood(t, wf - .4, 540, 1450, 12);
    person(540, 1860, 32, DAU, { in: t0 + .05, mood: t > wj ? 'beam' : 'happy', look: 0, key: 'dau', aL: t > wj ? .7 : -1.2, aR: t > wj ? .7 : -1.2 });
    person(200, 1860, 26, MB, { in: t0 + .1, mood: t > wj ? 'joy' : 'happy', look: 1, key: 'mb' });
    camEnd();
  }
  function shMood(t, lt) {       // a few days later, happy and confident again; no money yet
    const t0 = t - lt, wh = WT('mood', 'happy'), wm = WT('mood', 'money');
    camBegin(540, 1000, 1.0); board('day'); P('island_sun', 820, 800, 180, { in: wh - .2 }); P('life_flowers', 160, 1740, 200, { in: t0 + .1 });
    if (t > wm - .2) P('life_coinbag', 820, 1720, 120, { in: wm - .2, tint: [170, 170, 180], snd: 'pop', a: .6 });
    person(500, 1860, 32, DAU, { in: t0 + .05, mood: t > wh ? 'beam' : 'neutral', look: 0, key: 'dau' });
    camEnd();
  }
  function shHome(t, lt) {       // the mother goes back East; calls her ninety one year old mother; come right away
    const t0 = t - lt, we = WT('home', 'east'), wc = WT('home', 'called'), wn = WT('home', 'ninety'), go = ease(seg(t, t0, wc - .3));
    camBegin(540, 1000, 1.0);
    if (t < wc - .3) { board('day'); P('city_rowhouses', 220, 1400, 420, { in: t0 + .05 }); P('life_train', lerp(700, -200, go), 1640, 520, { in: t0 + .1, snd: 'whoosh', sway: .01 }); }
    else { board('plum'); P('room_lamp', 160, 1500, 340, { in: wc - .3 }); person(340, 1860, 30, MB, { in: wc - .3, mood: 'warm', look: 1, key: 'mb', hold: (x, y, u) => P('prop_telephone', x, y + u, u * 2.6, { sway: .02, snd: false }) });
      if (t > wn - .3) { P('island_cloud', 780, 1200, 320, { in: wn - .3, snd: 'pop' }); person(780, 1220, 10, GRAN, { in: wn - .2, mood: 'warm', key: 'gc', snd: false, talk: talk(t) }); } }
    camEnd();
  }
  function shChecks(t, lt) {     // a check for $3,000 for the daughter; three more for the grandchildren, $1,500 in all
    const t0 = t - lt, wc = WT('checks', 'check'), wg = WT('checks', 'grandchildren'), wf = WT('checks', 'fifteen');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1300, 520, '#FFE2A8', .35); P('room_armchair', 760, 1820, 420, { in: t0 + .05 });
    person(760, 1720, 22, GRAN, { in: t0 + .1, mood: 'warm', look: -1, key: 'gran', aL: t > wc - .2 ? .5 : -1.2, snd: false });
    if (t > wc - .2) sign(500, 1060, 420, '$3,000', '#2F7A4A', ease(seg(t, wc - .2, wc + .2)));
    if (t > wg - .2) { for (let i = 0; i < 3; i++) sign(280 + i * 230, 1260, 200, '$', '#2F7A4A', ease(seg(t, wg - .2 + i * .1, wg + i * .1 + .2))); }
    if (t > wf - .2) sign(500, 1440, 380, '$1,500', '#3F6FB0', ease(seg(t, wf - .2, wf + .2)));
    person(320, 1860, 30, MB, { in: t0 + .05, mood: t > wc ? 'surprised' : 'warm', look: 1, key: 'mb' });
    camEnd();
  }
  function shMe(t, lt) {         // one more, for her: another $3,000; the day before, the grandmother decided to give while alive
    const t0 = t - lt, wh = WT('me', 'her'), wa = WT('me', 'another'), wd = WT('me', 'decided');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1300, 520, '#FFD27A', .4); P('room_armchair', 760, 1820, 420, { in: -9 });
    person(760, 1720, 22, GRAN, { mood: t > wd ? 'beam' : 'warm', look: -1, key: 'gran', aL: .5, snd: false });
    if (t > wa - .2) { sign(500, 1120, 440, '$3,000', '#C9963A', ease(seg(t, wa - .2, wa + .2))); cue('me', wa, 'sparkle', 520, 300); }
    if (t > wd - .2) { P('life_flowers', 960, 1760, 180, { in: wd - .2 }); glow(760, 1500, 260, '#FFD27A', .5); }
    person(320, 1860, 30, MB, { mood: t > wa ? 'joy' : 'surprised', look: 1, key: 'mb', aL: t > wa ? .7 : -1.2, aR: t > wa ? .7 : -1.2 });
    camEnd();
  }
  function shAnyway(t, lt) {     // would it have happened anyway? no; not like this
    const t0 = t - lt, wn = WT('anyway', 'no');
    camBegin(540, 1000, 1.0); board('plum'); if (t > wn) glow(540, 1400, 400, '#FFD27A', .4);
    person(540, 1860, 32, MB, { in: t0 + .05, mood: t > wn ? 'determined' : 'neutral', look: t > wn && t < wn + 1 ? (Math.sin(t * 7) > 0 ? .8 : -.8) : 0, key: 'mb' });
    camEnd();
  }
  function shLesson(t, lt) {     // the mood changed first; then the money found her
    const t0 = t - lt, wm = WT('lesson', 'mood'), wf = WT('lesson', 'found');
    camBegin(540, 1000, 1.0); board(t > wm ? 'day' : 'plum');
    if (t < wm) P('sky_raincloud', 540, 1060, 240, { in: t0 + .05, sway: .04, snd: false }); else P('island_sun', 820, 800, 180, { in: wm });
    if (t > wf - .4) flood(t, wf - .4, 540, 1450, 10);
    person(540, 1860, 32, DAU, { in: t0 + .05, mood: t > wf ? 'joy' : t > wm ? 'beam' : 'worried', look: 0, key: 'dau' });
    camEnd();
  }
  function shClose(t, lt) {      // what if it was flooding toward you, from every corner?
    const t0 = t - lt, wf = WT('close', 'flooding');
    camBegin(540, 1000, 1.0); board('plum'); if (t > wf - .3) flood(t, wf - .3, 540, 1400, 10, .8);
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'first'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('need') - .12, shNeed], [S('offer') - .12, shOffer], [S('plan') - .12, shPlan], [S('mood') - .12, shMood], [S('home') - .12, shHome], [S('checks') - .12, shChecks], [S('me') - .12, shMe], [S('anyway') - .12, shAnyway], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
