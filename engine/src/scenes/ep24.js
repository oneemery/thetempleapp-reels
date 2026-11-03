window.CHEAP = true; window.FELT = true;
// Episode 24, flannelgraph cut: "Something Wonderful" (T.K. feels it now) built from the felt cutout kit (kit/cutouts) on felt boards.
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






















  const TK = { ...C.dreamer, name: 'tk', coat: '#6B7A8F', sleeve: '#6B7A8F', stripes: null, hair: '#B8B2A8', skin: '#EFCBA6', torso: 7.4, leg: 4.6, w: 4.8 };
  const TKW = { ...TK, name: 'tkw', coat: '#3F8F8A', sleeve: '#3F8F8A' };
  const MAN = { ...C.blake, name: 'man', coat: '#8C5A3C', sleeve: '#8C5A3C', hat: 'fedora', hatCol: '#5A3A24', band: '#22222A' };
  const RICH = { ...C.blake, name: 'rich', coat: '#22222A', sleeve: '#22222A', lapel: '#E6B82A', pants: '#22222A', hat: 'fedora', hatCol: '#22222A', band: '#E6B82A', hair: '#ECE8DF' };
  const ISAIAH = { ...C.paul, name: 'isaiah', coat: '#3F6FB0', sleeve: '#3F6FB0', pants: '#3F6FB0', sash: '#E6B82A', hair: '#ECE8DF', hairStyle: 'neat', beard: .6, beardCol: '#ECE8DF' };
  const SIGNS = {};
  function sign(x, y, w, txt, col = '#2F7A4A', a = 1) {
    if (window.CUEMODE || a <= 0) return; const key = txt + col;
    if (!SIGNS[key]) { const g = createGraphics(600, 220); g.pixelDensity(1); const c = g.drawingContext;
      c.fillStyle = '#3A2A22'; c.beginPath(); c.roundRect(14, 20, 572, 190, 24); c.fill(); c.fillStyle = '#F6F0E2'; c.beginPath(); c.roundRect(4, 6, 572, 190, 24); c.fill();
      c.fillStyle = col; c.beginPath(); c.roundRect(20, 22, 540, 158, 16); c.fill();
      c.fillStyle = '#F6F0E2'; c.font = 'bold 100px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 290, 104); SIGNS[key] = g; }
    flushBrush(); tint(255, 255 * a); image(SIGNS[key], x - w / 2, y - w * 110 / 600, w, w * 220 / 600); noTint();
  }
  const BX = 540, BBY = 1760, BH = 600;
  function herBed(t, t0, o = {}) {
    board('night'); P('room_window', 880, 1250, 260, { in: o.still ? null : stagger(t0, 0) }); P('island_moon', 900, 1230, 50, { in: o.still ? null : stagger(t0, 1), snd: false });
    P('room_bed', BX, BBY, BH, { in: o.still ? null : stagger(t0, 2), sway: .002 }); const tin = o.still ? -9 : stagger(t0, 3);
    person(BX, BBY - BH * .44, 11, TK, { in: o.still ? null : tin, mood: o.mood || 'sleepy', key: 'tkbed', snd: false, aL: -1.2, aR: -1.2 });
    if (T > tin + .4) piecePart('room_bed', BX, BBY, BH, .43, 1);
  }
  function wonder(x, y, t, k = 1) { glow(x, y, 220 + 60 * Math.sin(t * 3), '#FFD27A', .55 * k); P('bible_star', x, y, 160 + 20 * Math.sin(t * 3), { sway: .05, snd: false }); }

  // ---------- shots ----------
  function shHook(t, lt) {   // fifty five, out of work, behind on rent; one sentence a night; then a check
    const t0 = t - lt, ws = WT('hook', 'sentence'), wc = WT('hook', 'check');
    camBegin(540, 1000, 1.0); board('plum');
    P('city_car', 760, 1700, 380, { in: t0 + .1, tint: [160, 160, 170] });
    if (t > ws - .2) wonder(540, 1020, t);
    if (t > wc - .2) { sign(780, 1260, 300, '$2,500', '#2F7A4A', ease(seg(t, wc - .2, wc + .2))); cue('check', wc, 'sparkle', 780, 300); }
    person(320, 1860, 30, TK, { in: t0 + .05, mood: t > wc ? 'joy' : t > ws ? 'hopeful' : 'sad', look: .4, key: 'tk' });
    camEnd();
  }
  function shVerse(t, lt) {      // Isaiah: behold, a new thing; now it shall spring forth
    const t0 = t - lt, wn = WT('verse', 'new'), ws = WT('verse', 'spring');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, ws - .2, ws + .6)));
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (t > ws - .2) P('life_flowers', 800, 1720, 260, { in: ws - .2, snd: 'pop' }); if (t > wn - .2) P('bible_star', 780, 1000, 200, { in: wn - .2, snd: 'chime', sway: .04 });
    person(420, 1840, 40, ISAIAH, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'isaiah', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // now, not someday
    const t0 = t - lt, wn = WT('meaning', 'now'), ws = WT('meaning', 'someday');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wn - .2) wonder(780, 1080, t); if (t > ws - .2) P('room_clock', 780, 1500, 140, { in: ws - .2, tint: [160, 160, 170], snd: false });
    host(t, 360, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shSituation(t, lt) {  // no family; the car falling apart; rent late; bank almost empty
    const t0 = t - lt, wc = WT('situation', 'car'), wr = WT('situation', 'rent'), wb = WT('situation', 'bank');
    camBegin(540, 1000, 1.0); board('day'); P('city_apartment', 760, 1300, 520, { in: t0 + .05 });
    if (t > wc - .2) P('city_car', 820, 1720, 360, { in: wc - .2, tint: [160, 160, 170], rot: .05, snd: 'pop' });
    if (t > wr - .2) P('prop_envelope', 560, 1080, 180, { in: wr - .2, tint: [230, 150, 140], snd: 'pop', sway: .04 });
    if (t > wb - .2) P('life_coinbag', 400, 1300, 130, { in: wb - .2, tint: [150, 150, 160], snd: 'pop' });
    person(300, 1860, 30, TK, { in: t0 + .05, mood: t > wb ? 'sad' : 'worried', look: 1, key: 'tk' });
    camEnd();
  }
  function shFirst(t, lt) {      // every single thing, one by one; worn out; too anxious to sleep
    const t0 = t - lt, wo = WT('first', 'one'), wa = WT('first', 'anxious');
    camBegin(540, 1050, 1.04); herBed(t, t0, { mood: t > wa ? 'worried' : 'neutral' });
    const items = ['city_car', 'life_coinbag', 'life_house', 'prop_envelope'];
    if (t > wo - .4) items.forEach((p, i) => { if (t > wo - .4 + i * .25) { P('island_cloud', 200 + i * 230, 960 + (i % 2) * 90, 170, { in: wo - .4 + i * .25, snd: 'pop', sway: .03 }); P(p, 200 + i * 230, 970 + (i % 2) * 90, 70, { in: wo - .3 + i * .25, snd: false }); } });
    if (t > wa - .2) P('sky_raincloud', 540, 1180, 200, { in: wa - .2, sway: .04, snd: 'pop' });
    camEnd();
  }
  function shWonder(t, lt) {     // one feeling: something wonderful is happening, not tomorrow, right now
    const t0 = t - lt, wf = WT('wonder', 'feeling'), wn = WT('wonder', 'now');
    camBegin(540, 1050, 1.04); herBed(t, t0, { still: true, mood: t > wf ? 'happy' : 'neutral' });
    if (t > wf - .2) wonder(540, 1040, t, ease(seg(t, wf - .2, wf + .4)));
    if (t > wn - .1) cue('now', wn, 'sparkle', 540, 300);
    camEnd();
  }
  function shWords(t, lt) {      // every night: isn't it wonderful! something marvelous is happening to me now!
    const t0 = t - lt, ww = WT('words', 'wonderful'), wm = WT('words', 'months');
    camBegin(540, 1050, 1.04); herBed(t, t0, { still: true, mood: t > ww ? 'beam' : 'happy' }); zzz(640, 1250, t, t0 + .3, .9);
    wonder(540, 1040, t, t > ww ? 1.2 : .8);
    if (t > wm - .4) tally(t, 150, 760, 8, Array.from({ length: 8 }, (_, i) => wm - .4 + i * .1), 110);
    camEnd();
  }
  function shFriend(t, lt) {     // a man she barely knew: going to New York; a minute's talk; forgotten
    const t0 = t - lt, wn = WT('friend', 'york'), wf = WT('friend', 'forgot');
    camBegin(540, 1000, 1.0); board('day'); P('city_rowhouses', 220, 1400, 420, { in: t0 + .05 }); P('city_wintertree', 900, 1500, 340, { in: t0 + .1 });
    if (t > wn - .3 && t < wf + .3) { P('island_cloud', 560, 1050, 280, { in: wn - .3, out: wf, snd: 'pop' }); P('city_skyscraper', 560, 1060, 130, { in: wn - .2, out: wf, snd: false, sway: 0 }); }
    person(320, 1860, 30, TKW, { in: t0 + .05, mood: 'happy', look: 1, key: 'tk' }); person(700, 1860, 30, MAN, { in: t0 + .1, mood: 'happy', look: -1, key: 'man', talk: talk(t) });
    camEnd();
  }
  function shCheck(t, lt) {      // a month later, same date, he comes to her door with a check for $2,500
    const t0 = t - lt, wd = WT('check', 'door'), wc = WT('check', 'check');
    camBegin(540, 1000, 1.0); board('plum'); P('room_door', 760, 1500, 520, { in: t0 + .05 });
    if (t > wd - .2) person(760, 1860, 30, MAN, { in: wd - .2, mood: 'beam', look: -1, key: 'man', aL: t > wc - .2 ? .5 : -1.2 });
    if (t > wc - .2) { sign(540, 1240, 300, '$2,500', '#2F7A4A', ease(seg(t, wc - .2, wc + .2))); glow(540, 1240, 260, '#FFD27A', .6); cue('chk', wc, 'sparkle', 540, 300); }
    person(320, 1860, 30, TKW, { in: t0 + .05, mood: t > wc ? 'surprised' : 'neutral', look: 1, key: 'tk' });
    camEnd();
  }
  function shFrom(t, lt) {       // from an old friend, unheard from in twenty five years, now rich; they met in New York
    const t0 = t - lt, wo = WT('from', 'old'), wr = WT('from', 'rich'), wn = WT('from', 'york');
    camBegin(540, 1000, 1.0); board('day'); P('city_skyscraper', 820, 1230, 780, { in: t0 + .05, sway: .004 });
    if (t > wo - .2) person(560, 1860, 30, RICH, { in: wo - .2, mood: t > wr ? 'warm' : 'neutral', look: -1, key: 'rich' });
    if (t > wr - .2) P('life_coinbag', 780, 1700, 160, { in: wr - .2, snd: 'pop' });
    if (t > wn - .3) person(300, 1860, 30, MAN, { in: wn - .3, mood: 'happy', look: 1, key: 'man', talk: talk(t) });
    camEnd();
  }
  function shMonthly(t, lt) {    // a check every month for two years; then papers: for the rest of her life
    const t0 = t - lt, wm = WT('monthly', 'month'), wp = WT('monthly', 'papers'), wl = WT('monthly', 'life');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1300, 500, '#FFE2A8', .4);
    if (t > wm - .3) tally(t, 100, 760, 9, Array.from({ length: 9 }, (_, i) => wm - .3 + i * .1), 110);
    if (t > wp - .2) P('prop_scroll', 760, 1200, 200, { in: wp - .2, snd: 'pop', sway: .04 });
    if (t > wl - .2) { glow(540, 1300, 520, '#FFD27A', .6); cue('life', wl, 'sparkle', 540, 300); }
    person(360, 1860, 30, TKW, { in: t0 + .05, mood: t > wl ? 'joy' : 'beam', look: .4, key: 'tk', hold: (x, y, u) => sign(x, y + u * 1.2, u * 7, '$', '#2F7A4A') });
    camEnd();
  }
  function shLesson(t, lt) {     // she stopped chasing the pieces; she felt the whole thing, right now
    const t0 = t - lt, wp = WT('lesson', 'pieces'), ww = WT('lesson', 'whole');
    camBegin(540, 1050, 1.04); herBed(t, t0, { mood: t > ww ? 'beam' : 'neutral' });
    if (t < ww) ['city_car', 'life_coinbag', 'life_house'].forEach((p, i) => { P('island_cloud', 240 + i * 280, 980, 160, { in: t0 + .3 + i * .1, out: ww - .2, tint: [170, 170, 180], snd: 'pop' }); P(p, 240 + i * 280, 990, 64, { in: t0 + .35 + i * .1, out: ww - .2, tint: [170, 170, 180], snd: false }); });
    if (t > ww - .2) wonder(540, 1040, t, ease(seg(t, ww - .2, ww + .4)) * 1.2);
    camEnd();
  }
  function shClose(t, lt) {      // what would right now feel like, if something wonderful was happening?
    const t0 = t - lt, ww = WT('close', 'wonderful');
    camBegin(540, 1000, 1.0); board('night'); if (t > ww - .3) wonder(780, 1050, t, ease(seg(t, ww - .3, ww + .3)));
    host(t, 380, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'feeling'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('situation') - .12, shSituation], [S('first') - .12, shFirst], [S('wonder') - .12, shWonder], [S('words') - .12, shWords], [S('friend') - .12, shFriend], [S('check') - .12, shCheck], [S('from') - .12, shFrom], [S('monthly') - .12, shMonthly], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
