window.CHEAP = true; window.FELT = true;
// Episode 18, flannelgraph cut: "The Deal" (the New York bank executive) built from the felt cutout kit (kit/cutouts) on felt boards.
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
















  const BANKER = { ...C.blake, name: 'banker', coat: '#5A5F6E', sleeve: '#5A5F6E', lapel: '#F3EBDC', pants: '#3A3A44', hat: 'fedora', hatCol: '#3A3A44', band: '#8C3B3B', hair: '#5A4636', skin: '#EFCBA6' };
  const BOSS = { ...C.skeptic, name: 'boss', coat: '#22222A', sleeve: '#22222A', hat: null };
  const DIR = { ...C.blake, name: 'director', coat: '#2E3A52', sleeve: '#2E3A52', lapel: '#E6B82A', pants: '#2E3A52', hat: 'fedora', hatCol: '#2E3A52', band: '#E6B82A', hair: '#ECE8DF', skin: '#C98E62' };
  const DAVID = { ...C.paul, name: 'david', coat: '#7A4E8A', sleeve: '#7A4E8A', pants: '#7A4E8A', sash: '#E6B82A', hair: '#B5643A', hairStyle: 'curls', beard: .4, beardCol: '#B5643A', skin: '#E6B48C' };
  const BX = 520, BBY = 1760, BH = 600;
  function bank(t, t0, o = {}) { board('day'); P('city_skyscraper', 820, 1230, 780, { in: o.still ? null : stagger(t0, 0), sway: .004 }); P('city_brownstone', 240, 1300, 520, { in: o.still ? null : stagger(t0, 1), sway: .004 }); }
  function bedNight(t, t0, o = {}) {   // the banker in bed at night, before sleep
    board('night'); P('room_window', 880, 1240, 300, { in: o.still ? null : stagger(t0, 0) }); P('island_moon', 900, 1220, 60, { in: o.still ? null : stagger(t0, 1), snd: false });
    P('room_bed', BX, BBY, BH, { in: o.still ? null : stagger(t0, 2), sway: .002 }); const tin = o.still ? -9 : stagger(t0, 3);
    person(BX, BBY - BH * .44, 11, { ...BANKER, hat: null }, { in: o.still ? null : tin, mood: o.mood || 'sleepy', key: 'bankbed', snd: false, aL: -1.2, aR: -1.2 });
    if (T > tin + .4) piecePart('room_bed', BX, BBY, BH, .43, 1);
  }
  function dealCloud(x, y, s, t, tin, k = '') {   // a thought cloud: he and the director shake on the deal
    if (t < tin) return; P('island_cloud', x, y, s, { in: tin, snd: 'pop', sway: .02 });
    const shake = .45 + .12 * Math.sin(t * 9);
    person(x - s * .15, y + s * .14, s * .026, BANKER, { in: tin + .1, mood: 'beam', look: 1, key: 'bc' + k, snd: false, aR: shake });
    person(x + s * .15, y + s * .14, s * .026, DIR, { in: tin + .15, mood: 'warm', look: -1, key: 'dc' + k, snd: false, aL: shake });
  }

  // ---------- shots ----------
  function shHook(t, lt) {   // the boss says no raise; two months later, a far better job
    const t0 = t - lt, wi = WT('hook', 'impossible'), wm = WT('hook', 'months'), wb = WT('hook', 'beyond');
    camBegin(540, 1000, 1.0);
    if (t < wm - .2) { bank(t, t0); if (t > wi - .3) P('sky_raincloud', 400, 1050, 240, { in: wi - .3, sway: .03, snd: 'pop' });
      person(300, 1860, 30, BANKER, { in: t0 + .05, mood: t > wi ? 'sad' : 'hopeful', look: 1, key: 'banker' });
      person(780, 1860, 30, BOSS, { in: t0 + .1, mood: 'determined', look: Math.sin(t * 6) > 0 ? -.8 : .2, key: 'boss' }); }
    else { board('plum'); glow(540, 1300, 520, '#FFD27A', .6); if (t > wb - .2) { P('bible_star', 760, 1000, 200, { in: wb - .2, snd: 'chime', sway: .04 }); }
      P('life_coinbag', 760, 1640, 260, { in: wm, snd: 'pop' }); person(400, 1860, 32, BANKER, { in: wm - .2, mood: 'beam', look: .4, key: 'banker2' }); }
    camEnd();
  }
  function shVerse(t, lt) {      // David: commune with your own heart upon your bed, and be still
    const t0 = t - lt, wb = WT('verse', 'bed'), ws = WT('verse', 'still');
    camBegin(540, 1050, 1.0 + .015 * lt); board('night'); glow(560, 1050, 600, '#FFD27A', .25 + .4 * ease(seg(t, ws - .2, ws + .6)));
    P('bible_harp', 820, 1640, 300, { in: stagger(t0, 0) }); if (t > wb - .2) P('island_moon', 800, 760, 140, { in: wb - .2, snd: 'chime' });
    person(420, 1840, 40, DAVID, { in: stagger(t0, 1), mood: t > ws ? 'warm' : 'wise', aL: .8, look: .6, key: 'david', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // upon your bed (the bed), right before you sleep (the moon)
    const t0 = t - lt, wb = WT('meaning', 'bed'), ws = WT('meaning', 'sleep');
    camBegin(540, 1000, 1.0); board('night');
    if (t > wb - .2) P('room_bed', 820, 1500, 300, { in: wb - .2, snd: 'pop' }); if (t > ws - .2) P('island_moon', 820, 1000, 140, { in: ws - .2, snd: 'chime' });
    host(t, 380, 1830, 38, { in: t0 + .02, mood: 'warm', look: .4 });
    camEnd();
  }
  function shBanker(t, lt) {     // a big New York bank; no way up; no raise; maybe look elsewhere
    const t0 = t - lt, ww = WT('banker', 'way'), wb = WT('banker', 'bosses'), wh = WT('banker', 'hinted');
    camBegin(540, 1000, 1.0); bank(t, t0);
    if (t > ww - .2) P('sky_raincloud', 380, 1050, 220, { in: ww - .2, sway: .03, snd: 'pop' });
    person(300, 1860, 30, BANKER, { in: stagger(t0, 2), mood: t > ww ? 'sad' : 'neutral', look: t > wb ? 1 : 0, lookY: t > ww && t < wb ? -.4 : 0, key: 'banker' });
    if (t > wb - .2) person(780, 1860, 30, BOSS, { in: wb - .2, mood: 'determined', look: t > wh ? 1 : -1, key: 'boss', aR: t > wh ? .5 : -1.2 });
    camEnd();
  }
  function shWant(t, lt) {       // not a fortune: a comfortable home, good schools for his children
    const t0 = t - lt, wf = WT('want', 'fortune'), wh = WT('want', 'home'), ws = WT('want', 'schools');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wf - .2 && t < wh - .3) P('prop_money', 760, 1100, 220, { in: wf - .2, out: wh - .4, tint: [170, 170, 180], snd: 'pop' });
    if (t > wh - .2) P('life_house', 740, 1150, 360, { in: wh - .2, snd: 'pop' }); if (t > ws - .2) P('prop_books', 860, 1650, 200, { in: ws - .2, snd: 'pop' });
    person(320, 1860, 30, BANKER, { in: t0 + .05, mood: t > wh ? 'hopeful' : 'neutral', look: 1, key: 'banker' });
    camEnd();
  }
  function shDream(t, lt) {      // his dream job: managing the investments of a big foundation or a university
    const t0 = t - lt, wi = WT('dream', 'investment'), wu = WT('dream', 'university');
    camBegin(540, 1000, 1.0); board('plum');
    P('island_cloud', 700, 1050, 520, { in: t0 + .1, snd: 'pop', sway: .02 });
    if (t > wi - .2) P('life_coinbag', 620, 1060, 140, { in: wi - .2, snd: 'pop' }); if (t > wu - .2) P('bible_temple', 790, 1040, 170, { in: wu - .2, snd: 'pop' });
    person(280, 1860, 30, BANKER, { in: t0 + .05, mood: 'hopeful', look: .6, lookY: -.4, key: 'banker' });
    camEnd();
  }
  function shNeville(t, lt) {    // Neville: your job reflects how you see yourself; change that
    const t0 = t - lt, wc = WT('neville', 'change');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1200, 500, '#FFD27A', .3 + .4 * ease(seg(t, wc - .2, wc + .6)));
    person(300, 1840, 32, C.neville, { in: stagger(t0, 0), mood: 'warm', look: 1, key: 'nev', talk: talk(t), aR: .4 });
    person(780, 1840, 30, BANKER, { in: stagger(t0, 1), mood: t > wc ? 'hopeful' : 'neutral', look: -1, key: 'banker' });
    if (t > wc) cue('chg', wc, 'sparkle', 540, 300);
    camEnd();
  }
  function shNight(t, lt) {      // every night before sleep: the end of a great day, the deal closed
    const t0 = t - lt, wd = WT('night', 'deal'), wr = WT('night', 'role');
    camBegin(540, 1050, 1.04); bedNight(t, t0, { mood: t > wd ? 'happy' : 'sleepy' }); zzz(640, 1250, t, t0 + .8, .9);
    dealCloud(540, 1010, 360, t, wd - .3);
    if (t > wr - .1) { glow(540, 1010, 260, '#FFD27A', .6); cue('role', wr, 'sparkle', 560, 300); }
    camEnd();
  }
  function shEvery(t, lt) {      // from the first week of December, every night without missing one
    const t0 = t - lt, wd = WT('every', 'december'), we = WT('every', 'every'), wm = WT('every', 'missing');
    camBegin(540, 1050, 1.04); bedNight(t, t0, { still: true }); zzz(640, 1250, t, t0 + .2, .9);
    tally(t, 150, 820, 8, Array.from({ length: 8 }, (_, i) => wd + i * ((wm + .4 - wd) / 8)), 110);
    camEnd();
  }
  function shFeb(t, lt) {        // early February: the director of a great foundation asks; he says yes
    const t0 = t - lt, wd = WT('feb', 'director'), wy = WT('feb', 'yes');
    camBegin(540, 1000, 1.0); bank(t, t0, { still: true }); feltSnow(t, 40, .8);
    person(300, 1860, 30, BANKER, { in: t0 + .05, mood: t > wy ? 'joy' : t > wd ? 'surprised' : 'neutral', look: 1, key: 'banker', aR: t > wy - .2 ? .45 + .12 * Math.sin(t * 9) : -1.2 });
    if (t > wd - .3) person(760, 1860, 31, DIR, { in: wd - .3, mood: 'warm', look: -1, key: 'dir', aL: t > wy - .2 ? .45 + .12 * Math.sin(t * 9) : -1.2 });
    if (t > wy) { glow(530, 1500, 380, '#FFD27A', .6); cue('yes', wy, 'sparkle', 540, 300); }
    camEnd();
  }
  function shPay(t, lt) {        // much higher pay; far beyond what he hoped
    const t0 = t - lt, wp = WT('pay', 'pay'), wb = WT('pay', 'beyond');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1300, 500, '#FFD27A', .5);
    if (t > wp - .2) P('life_coinbag', 780, 1500, 220, { in: wp - .2, snd: 'pop' }); if (t > wb - .2) P('bible_star', 760, 980, 220, { in: wb - .2, snd: 'chime', sway: .04 });
    person(380, 1860, 32, BANKER, { in: t0 + .05, mood: 'beam', look: .5, key: 'banker' });
    camEnd();
  }
  function shLesson(t, lt) {     // not the man who was stuck (grey cloud); the man who closed the deal (gold cloud)
    const t0 = t - lt, ws = WT('lesson', 'stuck'), wd = WT('lesson', 'deal');
    camBegin(540, 1050, 1.04); bedNight(t, t0, { still: true, mood: t > wd ? 'happy' : 'sleepy' });
    if (t > ws - .3 && t < wd - .2) P('sky_raincloud', 320, 920, 220, { in: ws - .3, out: wd - .3, sway: .03, snd: 'pop' });
    if (t > wd - .3) { dealCloud(540, 1010, 360, t, wd - .3, 'l'); glow(540, 1010, 260, '#FFD27A', .6); }
    camEnd();
  }
  function shClose(t, lt) {      // who are you, when you fall asleep tonight?
    const t0 = t - lt, wa = WT('close', 'asleep');
    camBegin(540, 1000, 1.0); board('night'); if (t > wa - .3) P('island_moon', 800, 1000, 140, { in: wa - .3, snd: 'chime' });
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'asleep'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('banker') - .12, shBanker], [S('want') - .12, shWant], [S('dream') - .12, shDream], [S('neville') - .12, shNeville], [S('night') - .12, shNight], [S('every') - .12, shEvery], [S('feb') - .12, shFeb], [S('pay') - .12, shPay], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
