window.CHEAP = true; window.FELT = true;
// Episode 20, flannelgraph cut: "The Cruise" (F.G. sails from her hospital bed) built from the felt cutout kit (kit/cutouts) on felt boards.
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


















  const FG = { ...C.dreamer, name: 'fg', coat: '#E6B82A', sleeve: '#E6B82A', stripes: null, hair: '#5A3A24', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const GIRL = { ...FG, name: 'girl', coat: '#B8463A', sleeve: '#B8463A' };
  const DAVID = { ...C.paul, name: 'david', coat: '#7A4E8A', sleeve: '#7A4E8A', pants: '#7A4E8A', sash: '#E6B82A', hair: '#B5643A', hairStyle: 'curls', beard: .4, beardCol: '#B5643A', skin: '#E6B48C' };
  const BX = 540, BBY = 1760, BH = 600;
  function hospBed(t, t0, o = {}) {    // her hospital bed by the window
    board('plum'); glow(540, 1300, 520, '#F3F6FA', .25); P('room_window', 880, 1240, 300, { in: o.still ? null : stagger(t0, 0) });
    P('room_bed', BX, BBY, BH, { in: o.still ? null : stagger(t0, 1), sway: .002, tint: [235, 240, 248] }); const tin = o.still ? -9 : stagger(t0, 2);
    person(BX, BBY - BH * .44, 11, FG, { in: o.still ? null : tin, mood: o.mood || 'neutral', key: 'fgbed', snd: false, aL: -1.2, aR: -1.2, lookY: o.up ? -.4 : 0, look: o.look || 0 });
    if (T > tin + .4) piecePart('room_bed', BX, BBY, BH, .43, 1);
  }
  function shipCloud(x, y, s, t, tin, k = '') {   // a thought cloud: her ship on blue water
    if (t < tin) return; P('island_cloud', x, y, s, { in: tin, snd: 'pop', sway: .02 });
    P('city_liner', x, y + s * .04, s * .5, { in: tin + .1, snd: false, sway: .01 });
  }
  function sea(t, t0, o = {}) { board('day'); P('island_sun', 870, 800, 180, { in: o.still ? null : stagger(t0, 0) }); P('island_waves', 540, 2000, 1100, { in: o.still ? null : stagger(t0, 1), sway: .01 }); }

  // ---------- shots ----------
  function shHook(t, lt) {   // from a hospital bed: the ship, the cabin, seven ports; then she won it
    const t0 = t - lt, ws = WT('hook', 'ship'), wp = WT('hook', 'ports'), ww = WT('hook', 'won');
    camBegin(540, 1050, 1.04); hospBed(t, t0, { mood: t > ww ? 'beam' : 'hopeful', up: true });
    shipCloud(400, 1050, 340, t, ws - .3);
    if (t > wp - .3) tally(t, 200, 760, 7, Array.from({ length: 7 }, (_, i) => wp - .3 + i * .08), 110);
    if (t > ww) { glow(540, 1300, 480, '#FFD27A', .6); cue('won', ww, 'sparkle', 540, 300); }
    camEnd();
  }
  function shVerse(t, lt) {      // David: delight thyself... he shall give thee the desires of thine heart
    const t0 = t - lt, wd = WT('verse', 'delight'), wh = WT('verse', 'desires');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, wd - .2, wd + .6)));
    P('bible_harp', 820, 1640, 300, { in: stagger(t0, 0) }); if (t > wh - .2) P('bible_star', 780, 800, 220, { in: wh - .2, snd: 'chime', sway: .04 });
    person(420, 1840, 40, DAVID, { in: stagger(t0, 1), mood: t > wd ? 'warm' : 'wise', aL: .8, look: .6, key: 'david', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // the desires of your heart (a palm in a cloud); delight in them first (glow)
    const t0 = t - lt, wf = WT('meaning', 'first');
    camBegin(540, 1000, 1.0); board('plum');
    P('island_cloud', 760, 1050, 360, { in: t0 + .1, snd: 'pop', sway: .02 }); P('island_palm', 760, 1080, 160, { in: t0 + .2, snd: false });
    if (t > wf - .2) glow(760, 1050, 300, '#FFD27A', .7);
    host(t, 330, 1830, 38, { in: t0 + .02, mood: t > wf ? 'warm' : 'neutral', look: .5 });
    camEnd();
  }
  function shDream(t, lt) {      // a little girl dreaming of the West Indies; no money, no time
    const t0 = t - lt, wi = WT('dream', 'indies'), wm = WT('dream', 'money');
    camBegin(540, 1000, 1.0); board('day');
    P('island_cloud', 700, 1050, 460, { in: t0 + .3, snd: 'pop', sway: .02 }); P('island_islandhouse', 620, 1080, 160, { in: t0 + .4, snd: false });
    if (t > wi - .2) P('island_palm', 790, 1060, 180, { in: wi - .2, snd: 'pop' });
    if (t > wm - .2) { P('sky_raincloud', 300, 1050, 200, { in: wm - .2, sway: .03, snd: 'pop' }); P('room_clock', 480, 1300, 120, { in: wm, snd: false }); }
    if (t < wm - .2) person(300, 1880, 18, GIRL, { in: t0 + .05, mood: 'hopeful', look: .6, lookY: -.4, key: 'girl' });
    else person(300, 1860, 28, FG, { in: wm - .2, mood: 'sad', look: .6, lookY: -.3, key: 'fg' });
    camEnd();
  }
  function shHospital(t, lt) {   // in the hospital for surgery; while getting better, the daydream grows
    const t0 = t - lt, wb = WT('hospital', 'better'), wd = WT('hospital', 'daydream');
    camBegin(540, 1050, 1.04); hospBed(t, t0, { mood: t > wb ? 'hopeful' : 'sleepy', up: t > wb });
    if (t > wd - .3) { shipCloud(420, 1050, 260 + 80 * ease(seg(t, wd - .3, wd + .8)), t, wd - .3); glow(420, 1050, 260, '#FFD27A', .4); }
    camEnd();
  }
  function shFolders(t, lt) {    // free travel folders; she picks her ship, her cabin, seven ports
    const t0 = t - lt, wf = WT('folders', 'folders'), ws = WT('folders', 'ship'), wc = WT('folders', 'cabin'), wp = WT('folders', 'ports');
    camBegin(540, 1050, 1.04); hospBed(t, t0, { still: true, mood: 'happy', look: -.4 });
    if (t > wf - .2) for (let i = 0; i < 3; i++) P('prop_scroll', 300 + i * 120, 1180, 120, { in: wf - .2 + i * .12, rot: (i - 1) * .25, sway: .03, tint: [[200, 230, 255], [255, 240, 200], [220, 255, 230]][i] });
    if (t > ws - .2) P('city_liner', 640, 960, 240, { in: ws - .2, snd: 'pop', sway: .01 });
    if (t > wc - .2) P('room_door', 940, 1030, 110, { in: wc - .2, snd: 'pop' });
    if (t > wp - .3) tally(t, 200, 760, 7, Array.from({ length: 7 }, (_, i) => wp - .3 + i * .1), 110);
    camEnd();
  }
  function shImagine(t, lt) {    // up the gangplank; out to open ocean; waves; tropical sun; salt air
    const t0 = t - lt, wg = WT('imagine', 'gangplank'), wo = WT('imagine', 'ocean'), ww = WT('imagine', 'waves'), wsu = WT('imagine', 'sun'), wsa = WT('imagine', 'salt');
    camBegin(540, 1000, 1.0);
    if (t < wg - .3) { hospBed(t, t0, { mood: 'sleepy' }); }
    else { const go = ease(seg(t, wo - .3, wo + 3)); sea(t, wg - .3); P('city_liner', lerp(600, 470, go), 1560, 620, { sway: .015, snd: false, in: wg - .3 });
      if (t > ww - .1) { for (let i = 0; i < 3; i++) { const k = seg(t, ww + i * .2, ww + i * .2 + .8); if (k > 0 && k < 1) glow(260 + i * 260, 1800, 80 + 160 * k, '#FFFFFF', .5 * (1 - k)); } cue('wv', ww, 'whoosh', 540, 400); }
      if (t > wsu - .2) glow(870, 800, 360, '#FFD27A', .7);
      person(lerp(860, 740, go), 1420, 12, FG, { in: wg - .2, mood: t > wsu ? 'beam' : 'joy', look: .6, lookY: t > wsu ? -.5 : 0, key: 'fgship', snd: false });
      if (t > wsa - .2) cue('salt', wsa, 'sparkle', 640, 300); }
    camEnd();
  }
  function shWeek(t, lt) {       // one whole week; the day before going home, she puts the folders away
    const t0 = t - lt, ww = WT('week', 'week'), wa = WT('week', 'away');
    camBegin(540, 1050, 1.04); hospBed(t, t0, { still: true, mood: t > wa ? 'neutral' : 'happy' });
    tally(t, 200, 760, 7, Array.from({ length: 7 }, (_, i) => ww - .3 + i * .12), 110);
    if (t < wa + .3) for (let i = 0; i < 3; i++) P('prop_scroll', 300 + i * 120, 1180, 120, { in: t0, out: wa, rot: (i - 1) * .25, sway: .03, snd: false, tint: [[200, 230, 255], [255, 240, 200], [220, 255, 230]][i] });
    camEnd();
  }
  function shTelegram(t, lt) {   // two months later a telegram: first place, a Caribbean cruise
    const t0 = t - lt, wt = WT('telegram', 'telegram'), wf = WT('telegram', 'first'), wc = WT('telegram', 'cruise');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wt - .2) P('prop_envelope', 540, 1060, 320, { in: wt - .2, snd: 'pop', sway: .03 });
    if (t > wf - .2) { glow(540, 1060, 340, '#FFD27A', .7); P('bible_star', 800, 820, 180, { in: wf - .2, snd: 'chime', sway: .04 }); }
    if (t > wc - .2) P('city_liner', 300, 820, 260, { in: wc - .2, snd: 'pop', sway: .01 });
    person(540, 1860, 30, FG, { in: t0 + .05, mood: t > wf ? 'joy' : 'surprised', look: 0, lookY: -.4, key: 'fg', aL: t > wf ? .7 : -1.2, aR: t > wf ? .7 : -1.2 });
    camEnd();
  }
  function shCoupon(t, lt) {     // months before: an entry at her local supermarket, forgotten
    const t0 = t - lt, we = WT('coupon', 'entry'), wf = WT('coupon', 'forgot');
    camBegin(540, 1000, 1.0); board('day'); P('city_brownstone', 700, 1300, 560, { in: stagger(t0, 0) }); P('life_flowers', 960, 1720, 180, { in: stagger(t0, 1) });
    if (t > we - .2) P('prop_ticket', 460, 1300, 160, { in: we - .2, snd: 'pop', sway: .04 });
    person(300, 1860, 30, FG, { in: t0 + .1, mood: t > wf ? 'neutral' : 'happy', look: 1, key: 'fg', aR: t > we && t < wf ? .4 : -1.2 });
    camEnd();
  }
  function shMatch(t, lt) {      // the same cabin, the exact ship, all seven ports
    const t0 = t - lt, wc = WT('match', 'cabin'), ws = WT('match', 'ship'), wp = WT('match', 'seven');
    camBegin(540, 1000, 1.0); sea(t, t0); P('city_liner', 540, 1560, 620, { in: t0 + .1, sway: .015 });
    if (t > wc - .1) { glow(640, 1480, 140, '#FFD27A', .8); cue('cabin', wc, 'sparkle', 640, 300); }
    if (t > ws - .1) glow(540, 1560, 420, '#FFD27A', .3);
    if (t > wp - .3) tally(t, 200, 760, 7, Array.from({ length: 7 }, (_, i) => wp - .3 + i * .1), 110);
    person(780, 1420, 12, FG, { in: t0 + .3, mood: 'beam', look: -.4, key: 'fgship', snd: false, aR: .7 });
    camEnd();
  }
  function shLesson(t, lt) {     // she didn't wait to win it; she took it first, from her bed
    const t0 = t - lt, wf = WT('lesson', 'first');
    camBegin(540, 1050, 1.04); hospBed(t, t0, { mood: t > wf ? 'beam' : 'hopeful', up: true });
    if (t > wf - .3) { shipCloud(420, 1050, 340, t, wf - .3, 'l'); glow(420, 1050, 280, '#FFD27A', .6); }
    camEnd();
  }
  function shClose(t, lt) {      // where would you go, if you went tonight?
    const t0 = t - lt, wt = WT('close', 'tonight');
    camBegin(540, 1000, 1.0); board('night'); if (t > wt - .3) { P('island_moon', 800, 1000, 140, { in: wt - .3, snd: 'chime' }); }
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'week'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('dream') - .12, shDream], [S('hospital') - .12, shHospital], [S('folders') - .12, shFolders], [S('imagine') - .12, shImagine], [S('week') - .12, shWeek], [S('telegram') - .12, shTelegram], [S('coupon') - .12, shCoupon], [S('match') - .12, shMatch], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
