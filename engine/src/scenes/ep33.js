window.CHEAP = true; window.FELT = true;
// Episode 33, flannelgraph cut: "The Palace Gates" (M.F. falls asleep in England) built from the felt cutout kit (kit/cutouts) on felt boards.
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































  const MF = { ...C.dreamer, name: 'mf', coat: '#B8463A', sleeve: '#B8463A', stripes: null, hair: '#3B2A22', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const HUS = { ...C.blake, name: 'hus', coat: '#2E3A52', sleeve: '#2E3A52', lapel: '#F3EBDC', hat: null, hair: '#5A4636' };
  const STR = { ...C.blake, name: 'str', coat: '#5E6B3A', sleeve: '#5E6B3A', hat: 'fedora', hatCol: '#3A4F36', band: '#C9963A', hair: '#9A958C' };
  const GUESTS = ['#7A4E8A', '#C9963A', '#3F8F8A'].map((c, i) => ({ ...C.dreamer, name: 'g' + i, coat: c, sleeve: c, stripes: null, hair: ['#2B1E19', '#E6B82A', '#B5643A'][i] }));
  const JOSH = { ...C.paul, name: 'joshua', coat: '#8C3B3B', sleeve: '#8C3B3B', pants: '#8C3B3B', sash: '#C9963A', hair: '#3B2A22', hairStyle: 'neat', beard: .5, beardCol: '#3B2A22' };
  function gates(x, by, w, h, a = 1) {   // felt iron gates with gold tips
    if (window.CUEMODE || a <= 0) return; flushBrush(); push(); noStroke(); const n = 9;
    fill(30, 18, 12, 70 * a); rect(x - w / 2 + 6, by - h * .78 + 8, w, 18, 6);
    for (let i = 0; i < n; i++) { const bx = x - w / 2 + i * w / (n - 1); fill(30, 18, 12, 70 * a); rect(bx - 6 + 6, by - h + 8, 14, h, 6); }
    for (let i = 0; i < n; i++) { const bx = x - w / 2 + i * w / (n - 1); fill(40, 40, 48, 255 * a); rect(bx - 7, by - h, 14, h, 6); fill(232, 184, 42, 255 * a); triangle(bx - 14, by - h + 6, bx + 14, by - h + 6, bx, by - h - 26); }
    fill(40, 40, 48, 255 * a); rect(x - w / 2, by - h * .78, w, 18, 6); rect(x - w / 2, by - h * .2, w, 18, 6); pop(); }
  function palace(t, t0, o = {}) { board(o.night ? 'night' : 'day'); if (o.night) P('island_moon', 900, 1000, 100, { in: o.still ? null : t0 + .05, snd: false });
    P('bible_temple', 540, 1480, 560, { in: o.still ? null : t0 + .1, tint: [235, 225, 210] }); gates(540, 1860, 900, 560); }
  function sea(t, t0) { board('day'); P('island_sun', 860, 820, 170, { in: t0 + .05 }); P('island_waves', 540, 2000, 1100, { in: t0 + .1, sway: .01 }); }

  // ---------- shots ----------
  function shHook(t, lt) {   // no money for Europe; every night, holding the palace gates; two months later, the ocean
    const t0 = t - lt, wn = WT('hook', 'night'), wm = WT('hook', 'months'), go = ease(seg(t, wm - .2, wm + 3));
    camBegin(540, 1000, 1.0);
    if (t < wn - .3) { board('plum'); P('sky_raincloud', 540, 1060, 220, { in: t0 + .1, sway: .03, snd: 'pop' }); person(400, 1860, 28, MF, { in: t0 + .05, mood: 'sad', look: 1, key: 'mf' }); person(660, 1860, 29, HUS, { in: t0 + .1, mood: 'sad', look: -1, key: 'hus' }); }
    else if (t < wm - .2) { palace(t, wn - .3, { night: true }); person(540, 1900, 30, MF, { in: wn - .2, mood: 'beam', look: 0, lookY: -.4, key: 'mfg', aL: 1.2, aR: 1.2 }); }
    else { sea(t, wm - .2); P('city_liner', lerp(700, 420, go), 1560, 620, { in: wm - .2, sway: .015 }); person(lerp(860, 600, go), 1420, 12, MF, { in: wm, mood: 'joy', look: -1, key: 'mfs', snd: false }); person(lerp(920, 660, go), 1420, 12, HUS, { in: wm + .1, mood: 'joy', look: -1, key: 'hss', snd: false }); }
    camEnd();
  }
  function shVerse(t, lt) {      // Joshua: every place the sole of your foot shall tread upon, I have given you
    const t0 = t - lt, ws = WT('verse', 'sole'), wg = WT('verse', 'given');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, wg - .2, wg + .6)));
    if (t > ws - .2) P('sky_hill', 790, 1700, 220, { in: ws - .2, snd: 'pop', sway: 0 });
    person(420, 1840, 40, JOSH, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'josh', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // stand there first, even in your mind
    const t0 = t - lt, wm = WT('meaning', 'mind');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wm - .3) { P('island_cloud', 780, 1200, 340, { in: wm - .3, snd: 'pop' }); P('bible_temple', 780, 1120, 150, { in: wm - .2, snd: false, tint: [235, 225, 210] }); }
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shCouple(t, lt) {     // just married; a year in Europe; on their budget, another planet
    const t0 = t - lt, we = WT('couple', 'europe'), wp = WT('couple', 'planet');
    camBegin(540, 1000, 1.0); board('plum'); P('life_flowers', 540, 1740, 220, { in: t0 + .05 });
    if (t > we - .3) { P('island_cloud', 540, 1150, 340, { in: we - .3, snd: 'pop' }); P('bible_temple', 540, 1070, 140, { in: we - .2, snd: false, tint: [235, 225, 210] }); }
    if (t > wp - .2) P('island_moon', 820, 820, 120, { in: wp - .2, snd: 'pop' });
    person(330, 1860, 28, MF, { in: t0 + .05, mood: t > wp ? 'sad' : 'beam', look: 1, key: 'mf' }); person(760, 1860, 29, HUS, { in: t0 + .1, mood: t > wp ? 'sad' : 'beam', look: -1, key: 'hus' });
    camEnd();
  }
  function shMovie(t, lt) {      // a movie of the area around Buckingham Palace; she fell in love with it
    const t0 = t - lt, wb = WT('movie', 'buckingham'), wl = WT('movie', 'love');
    camBegin(540, 1000, 1.0); board('night');
    if (!window.CUEMODE) { flushBrush(); push(); noStroke(); fill(30, 18, 12, 90); rect(178, 888, 740, 470, 12); fill(246, 240, 226); rect(170, 880, 740, 470, 12); fill(170, 200, 230); rect(190, 900, 700, 430, 8); pop(); }
    if (t > wb - .3) P('bible_temple', 540, 1300, 320, { in: wb - .3, tint: [235, 225, 210], snd: 'pop' });
    if (t > wl - .2) glow(540, 1100, 360, '#FFD27A', .5);
    person(540, 1880, 28, MF, { in: t0 + .05, mood: t > wl ? 'beam' : 'happy', look: 0, lookY: -.5, key: 'mf' });
    camEnd();
  }
  function shGates(t, lt) {      // at night, outside the iron gates; cold bars gripped tight; looking at the palace
    const t0 = t - lt, wb = WT('gates', 'bars'), wp = WT('gates', 'palace');
    camBegin(540, 1050, t > wb - .3 ? 1.25 : 1.0); palace(t, t0, { night: true });
    person(540, 1900, 30, MF, { in: t0 + .3, mood: t > wp ? 'beam' : 'happy', look: 0, lookY: -.4, key: 'mfg', aL: t > wb - .2 ? 1.2 : -1.2, aR: t > wb - .2 ? 1.2 : -1.2 });
    if (t > wb) glow(540, 1500, 160, '#C8D8FF', .4);
    camEnd();
  }
  function shNights(t, lt) {     // many, many nights, full of joy, asleep there: I persisted in falling asleep in England
    const t0 = t - lt, wj = WT('nights', 'joy'), we = WT('nights', 'england');
    camBegin(540, 1050, 1.0); palace(t, t0, { night: true, still: true });
    person(540, 1900, 30, MF, { mood: t > wj ? 'beam' : 'happy', look: 0, lookY: -.4, key: 'mfg', aL: 1.2, aR: 1.2 });
    tally(t, 150, 760, 8, Array.from({ length: 8 }, (_, i) => t0 + .3 + i * .18), 110);
    if (t > we - .2) { zzz(660, 1350, t, we - .2, .9); glow(540, 1500, 300, '#FFD27A', .4); }
    camEnd();
  }
  function shParty(t, lt) {      // her husband meets a stranger at a party
    const t0 = t - lt, ws = WT('party', 'stranger');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1300, 520, '#FFE2A8', .4); P('room_lamp', 140, 1500, 340, { in: t0 + .05 });
    for (let i = 0; i < 3; i++) person(300 + i * 90, 1700, 14, GUESTS[i], { in: t0 + .1 + i * .05, mood: 'happy', look: .3, key: 'g' + i, snd: false, talk: talk(t + i) });
    person(560, 1860, 30, HUS, { in: t0 + .1, mood: 'happy', look: 1, key: 'hus', talk: t > ws ? talk(t) : 0 });
    if (t > ws - .3) person(820, 1860, 30, STR, { in: ws - .3, mood: 'warm', look: -1, key: 'str' });
    camEnd();
  }
  function shFellowship(t, lt) { // within a month: a teaching fellowship at a great university in England
    const t0 = t - lt, wt = WT('fellowship', 'teaching'), wu = WT('fellowship', 'university');
    camBegin(540, 1000, 1.0); board('day');
    if (t > wu - .3) { P('city_apartment', 760, 1500, 560, { in: wu - .3, tint: [215, 200, 180] }); P('city_wintertree', 300, 1500, 300, { in: wu - .2 }); }
    if (t > wt - .2) { P('prop_scroll', 540, 1260, 180, { in: wt - .2, snd: 'pop', sway: .04 }); glow(540, 1180, 220, '#FFD27A', .5); cue('fel', wt, 'sparkle', 540, 300); }
    person(300, 1860, 28, HUS, { in: t0 + .05, mood: t > wt ? 'joy' : 'hopeful', look: 1, key: 'hus' }); person(540, 1860, 28, STR, { in: t0 + .1, mood: 'beam', look: -1, key: 'str' });
    camEnd();
  }
  function shOcean(t, lt) {      // within another month, crossing the Atlantic; everything in the way melted
    const t0 = t - lt, wa = WT('ocean', 'atlantic'), wm = WT('ocean', 'melted'), go = ease(seg(t, t0, t0 + 6));
    camBegin(540, 1000, 1.0); sea(t, t0);
    P('city_liner', lerp(700, 380, go), 1560, 620, { in: t0 + .1, sway: .015 });
    person(lerp(860, 560, go), 1420, 12, MF, { in: t0 + .3, mood: 'joy', look: -1, key: 'mfs', snd: false }); person(lerp(920, 620, go), 1420, 12, HUS, { in: t0 + .4, mood: 'joy', look: -1, key: 'hss', snd: false });
    if (t < wm + .2) P('sky_raincloud', 300, 1050, 180, { in: t0 + .2, out: wm, sway: .03, snd: false });
    if (t > wm) cue('melt', wm, 'sparkle', 300, 300);
    camEnd();
  }
  function shHappiest(t, lt) {   // one of the happiest years of her life
    const t0 = t - lt, wh = WT('happiest', 'happiest');
    camBegin(540, 1000, 1.0); palace(t, t0, { night: false }); if (t > wh - .2) glow(540, 1400, 480, '#FFD27A', .5);
    person(440, 1900, 28, MF, { in: t0 + .05, mood: 'beam', look: .3, key: 'mf' }); person(640, 1900, 29, HUS, { in: t0 + .1, mood: 'beam', look: -.3, key: 'hus' });
    camEnd();
  }
  function shLesson(t, lt) {     // she didn't plan the trip; she held the gates
    const t0 = t - lt, wg = WT('lesson', 'gates');
    camBegin(540, 1000, 1.0);
    if (t < wg - .3) { board('plum'); P('prop_scroll', 540, 1300, 200, { in: t0 + .05, tint: [170, 170, 180], snd: 'pop' }); person(540, 1860, 30, MF, { in: t0 + .05, mood: 'neutral', look: 0, key: 'mf' }); }
    else { palace(t, wg - .3, { night: true }); person(540, 1900, 30, MF, { in: wg - .2, mood: 'beam', look: 0, lookY: -.4, key: 'mfg', aL: 1.2, aR: 1.2 }); glow(540, 1500, 260, '#FFD27A', .4); }
    camEnd();
  }
  function shClose(t, lt) {      // what are your hands holding, when you fall asleep?
    const t0 = t - lt, wh = WT('close', 'hands');
    camBegin(540, 1000, 1.0); board('night'); P('island_moon', 820, 820, 110, { in: t0 + .1, snd: false });
    if (t > wh - .2) glow(540, 1500, 200, '#FFD27A', .5);
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0, aL: t > wh - .2 ? .3 : -1.2, aR: t > wh - .2 ? .3 : -1.2 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'night'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('couple') - .12, shCouple], [S('movie') - .12, shMovie], [S('gates') - .12, shGates], [S('nights') - .12, shNights], [S('party') - .12, shParty], [S('fellowship') - .12, shFellowship], [S('ocean') - .12, shOcean], [S('happiest') - .12, shHappiest], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
