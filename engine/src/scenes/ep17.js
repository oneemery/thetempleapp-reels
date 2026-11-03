window.CHEAP = true; window.FELT = true;
// Episode 17, flannelgraph cut: "The Miracle" (the young man with the heart disease) built from the felt cutout kit (kit/cutouts) on felt boards.
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















  const DOC = { ...C.skeptic, name: 'doc', coat: '#F3EBDC', sleeve: '#F3EBDC', lapel: '#D9D4C8', tie: '#3F6FB0', hat: null };
  const SON = { ...C.blake, name: 'son', coat: '#8E8F96', sleeve: '#8E8F96', hat: null, hair: '#3B2A22', skin: '#E6B48C' };
  const WELL = { ...SON, name: 'well', coat: '#3F6FB0', sleeve: '#3F6FB0', lapel: '#F3EBDC' };
  const WIFE = { ...C.dreamer, name: 'wife', coat: '#B8463A', sleeve: '#B8463A', stripes: null, hair: '#5A3A24', skin: '#E6B48C', torso: 7.2, leg: 4.6, w: 4.6 };
  const KID1 = { ...C.dreamer, name: 'kid1', coat: '#E6B82A', sleeve: '#E6B82A', stripes: null, hair: '#3B2A22', skin: '#E6B48C' };
  const KID2 = { ...C.dreamer, name: 'kid2', coat: '#3F8F8A', sleeve: '#3F8F8A', stripes: null, hair: '#5A3A24', skin: '#E6B48C' };
  const JER = { ...C.paul, name: 'jeremiah', coat: '#5E6B3A', sleeve: '#5E6B3A', pants: '#5E6B3A', sash: '#C9963A', hair: '#9A958C', hairStyle: 'neat', beard: .6, beardCol: '#9A958C' };
  const BX = 560, BBY = 1760, BH = 600;
  function sickBed(t, t0, o = {}) {    // the son in bed, thin and tired; the blanket over him
    board('plum'); glow(560, 1300, 520, '#FFE2A8', .25);
    P('room_window', 880, 1240, 300, { in: o.still ? null : stagger(t0, 0) }); P('room_clock', 230, 1260, 150, { in: o.still ? null : stagger(t0, 1) });
    P('room_bed', BX, BBY, BH, { in: o.still ? null : stagger(t0, 2), sway: .002 });
    const tin = o.still ? -9 : stagger(t0, 3);
    person(BX, BBY - BH * .44, 11, SON, { in: o.still ? null : tin, mood: o.mood || 'sad', key: 'sonbed', snd: false, aL: -1.2, aR: -1.2, lookY: o.nod ? .35 * Math.max(0, Math.sin(t * 6)) : 0, look: o.look || 0 });
    if (T > tin + .4) piecePart('room_bed', BX, BBY, BH, .43, 1);
  }
  function docCloud(x, y, s, t, tin, o = {}) {   // a thought cloud: the doctor, amazed, checking again
    if (t < tin) return; P('island_cloud', x, y, s, { in: tin, snd: 'pop', sway: .02 });
    person(x, y + s * .12, s * .028, DOC, { in: tin + .1, mood: o.mood || 'surprised', look: Math.sin(t * 3) * .6, key: 'dc' + (o.k || ''), snd: false, aL: o.wave ? .6 + .3 * Math.sin(t * 10) : -1.2, aR: o.wave ? .6 + .3 * Math.sin(t * 10 + 1) : -1.2 });
  }

  // ---------- shots ----------
  function shHook(t, lt) {   // the doctor shakes his head; months later, the same doctor amazed
    const t0 = t - lt, wh = WT('hook', 'hope'), wm = WT('hook', 'months'), wr = WT('hook', 'miracle');
    camBegin(540, 1000, 1.0); board('plum');
    if (t < wm) { P('sky_raincloud', 540, 1050, 260, { in: wh - .3, out: wm, sway: .03, snd: 'pop' }); }
    if (t > wm - .2) P('room_clock', 820, 1000, 200, { in: wm - .2, snd: 'pop' });
    if (t > wr - .2) { glow(540, 1400, 520, '#FFD27A', .7); cue('miracle', wr, 'sparkle', 540, 300); }
    person(380, 1850, 32, DOC, { in: t0 + .05, mood: t > wr - .2 ? 'surprised' : t > wh - .2 ? 'sad' : 'neutral', look: t < wm ? (Math.sin(t * 6) > 0 ? .8 : -.2) : .6, key: 'doc', aL: t > wr ? .7 : -1.2, aR: t > wr ? .7 : -1.2 });
    camEnd();
  }
  function shVerse(t, lt) {      // Jeremiah: I will restore health unto thee (a glow), and heal thy wounds (a star)
    const t0 = t - lt, wr = WT('verse', 'restore'), wh = WT('verse', 'heal');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .3 + .5 * ease(seg(t, wr - .2, wr + .6)));
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (t > wh - .2) P('bible_star', 760, 760, 220, { in: wh - .2, snd: 'chime', sway: .04 });
    person(440, 1840, 40, JER, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'jer', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // not maybe (a grey cloud), I will (it goes; a star)
    const t0 = t - lt, ww = WT('meaning', 'will');
    camBegin(540, 1000, 1.0); board('plum');
    if (t < ww + .3) P('island_cloud', 540, 1050, 260, { in: t0 + .05, out: ww, tint: [170, 170, 180], snd: false });
    if (t > ww - .1) { P('bible_star', 540, 1050, 240, { in: ww - .1, snd: 'chime', sway: .04 }); glow(540, 1050, 300, '#FFD27A', .7); }
    host(t, 540, 1830, 38, { in: t0 + .02, mood: t > ww ? 'warm' : 'neutral', look: 0 });
    camEnd();
  }
  function shSon(t, lt) {        // a family friend's son, twenty eight, rare heart disease; the doctors held out no hope
    const t0 = t - lt, wn = WT('son', 'friend'), wd = WT('son', 'doctors');
    camBegin(560, 1150, 1.04); sickBed(t, t0);
    if (t > wn - .2) person(160, 1860, 26, C.neville, { in: wn - .2, mood: 'warm', look: 1, key: 'nev' });
    if (t > wd - .2) person(940, 1860, 26, DOC, { in: wd - .2, mood: 'sad', look: Math.sin(t * 6) > 0 ? -.8 : .2, key: 'doc' });
    camEnd();
  }
  function shBed(t, lt) {        // thin, tired, hard to breathe; his wife and two small children at home
    const t0 = t - lt, ww = WT('bed', 'wife'), wc = WT('bed', 'children');
    camBegin(560, 1150, 1.04); sickBed(t, t0, { still: true, mood: 'sleepy' });
    if (t > ww - .2) person(160, 1860, 28, WIFE, { in: ww - .2, mood: 'worried', look: 1, key: 'wife' });
    if (t > wc - .2) { person(900, 1880, 17, KID1, { in: wc - .2, mood: 'sad', look: -1, key: 'kid1' }); person(1000, 1880, 15, KID2, { in: wc - .05, mood: 'worried', look: -1, key: 'kid2' }); }
    camEnd();
  }
  function shNeville(t, lt) {    // Neville: change your attitude, change the condition; he nods
    const t0 = t - lt, wn = WT('neville', 'nodded');
    camBegin(560, 1150, 1.04); sickBed(t, t0, { still: true, mood: t > wn - .3 ? 'hopeful' : 'sleepy', nod: t > wn - .3, look: -.6 });
    person(170, 1860, 28, C.neville, { in: t0 + .05, mood: 'warm', look: 1, key: 'nev', talk: talk(t), aR: .4 });
    person(940, 1860, 26, WIFE, { in: t0 + .1, mood: 'hopeful', look: -1, key: 'wife' });
    camEnd();
  }
  function shImagine(t, lt) {    // imagine the doctor's face, unable to believe; checking again; it's a miracle
    const t0 = t - lt, wf = WT('imagine', 'face'), wc = WT('imagine', 'checking'), wm = WT('imagine', 'miracle');
    camBegin(560, 1150, 1.04); sickBed(t, t0, { still: true, mood: 'hopeful', look: .4 });
    docCloud(800, 1080, 360, t, wf - .3, { mood: t > wm ? 'beam' : 'surprised', wave: t > wm });
    if (t > wc) P('prop_scroll', 920, 1140, 70, { in: wc, sway: .05, snd: 'pop' });
    if (t > wm - .1) { glow(800, 1080, 260, '#FFD27A', .7); cue('mir', wm, 'sparkle', 800, 300); }
    camEnd();
  }
  function shPromise(t, lt) {    // he promises, his wife too; the next day Neville sails for New York
    const t0 = t - lt, ww = WT('promise', 'wife'), ws = WT('promise', 'sailed'), ship = ease(seg(t, ws - .3, ws + 2.5));
    camBegin(560, 1150, 1.04);
    if (t < ws - .3) { sickBed(t, t0, { still: true, mood: 'determined' }); if (t > ww - .2) person(940, 1860, 26, WIFE, { in: ww - .2, mood: 'determined', look: -1, key: 'wife', aR: .5 }); }
    else { board('day'); P('island_waves', 540, 1700, 1100, { sway: .01, in: ws - .3 }); P('city_liner', lerp(-200, 700, ship), 1500, 520, { sway: .01, snd: false }); cue('ship', ws, 'whoosh', 540, 300); }
    camEnd();
  }
  function shLetter(t, lt) {     // a letter months later: recovered; perfect health, back at work, going out again
    const t0 = t - lt, wr = WT('letter', 'recovered'), wp = WT('letter', 'perfect'), wo = WT('letter', 'going');
    camBegin(540, 1000, 1.0);
    if (t < wp - .3) { board('plum'); P('prop_envelope', 540, 1100, 360, { in: t0 + .1, snd: 'pop', sway: .03 }); if (t > wr - .1) { glow(540, 1100, 360, '#FFD27A', .7); cue('rec', wr, 'chime', 540, 300); }
      person(540, 1860, 30, C.neville, { in: t0 + .05, mood: t > wr ? 'joy' : 'neutral', look: 0, lookY: -.4, key: 'nev' }); }
    else { board('day'); P('city_rowhouses', 200, 1400, 420, { in: wp - .3 }); P('city_streetlamp', 980, 1560, 520, { in: wp - .2 });
      person(540, 1860, 34, WELL, { in: wp - .3, mood: 'beam', look: .3, key: 'well', aR: t > wo ? .6 + .2 * Math.sin(t * 8) : -1.2, hold: (x, y, u) => P('prop_suitcase', x, y + u * 1.6, u * 2.4, { sway: .02, snd: false }) });
      if (t > wo - .2) person(820, 1860, 28, WIFE, { in: wo - .2, mood: 'joy', look: -1, key: 'wife' }); }
    camEnd();
  }
  function shDoubted(t, lt) {    // from the day Neville left, he never doubted it would work
    const t0 = t - lt, wd = WT('doubted', 'doubted');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1200, 500, '#FFD27A', .4);
    if (t > wd - .2) P('bible_star', 760, 900, 200, { in: wd - .2, snd: 'chime', sway: .04 });
    person(420, 1860, 34, WELL, { in: t0 + .05, mood: 'warm', look: .4, key: 'well', talk: talk(t), aR: .3 });
    camEnd();
  }
  function shLesson(t, lt) {     // not getting better (a grey cloud); the doctor's face when he already was (the gold cloud)
    const t0 = t - lt, wb = WT('lesson', 'better'), wf = WT('lesson', 'face');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wb - .3 && t < wf) P('island_cloud', 300, 1000, 240, { in: wb - .3, out: wf - .2, tint: [170, 170, 180], snd: 'pop' });
    if (t > wf - .3) { docCloud(720, 980, 360, t, wf - .3, { mood: 'beam', wave: true, k: 'l' }); glow(720, 980, 280, '#FFD27A', .6); }
    person(320, 1860, 32, WELL, { in: t0 + .05, mood: t > wf ? 'beam' : 'neutral', look: .6, key: 'well' });
    camEnd();
  }
  function shClose(t, lt) {      // what does it look like, when it's already done?
    const t0 = t - lt, wd = WT('close', 'done');
    camBegin(540, 1000, 1.0); board('plum'); if (t > wd - .3) { P('bible_star', 540, 1050, 220, { in: wd - .3, snd: 'chime', sway: .04 }); glow(540, 1050, 300, '#FFD27A', .6); }
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'end'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('son') - .12, shSon], [S('bed') - .12, shBed], [S('neville') - .12, shNeville], [S('imagine') - .12, shImagine], [S('promise') - .12, shPromise], [S('letter') - .12, shLetter], [S('doubted') - .12, shDoubted], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
