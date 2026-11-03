window.CHEAP = true; window.FELT = true;
// Episode 1, flannelgraph cut: "You Are In Barbados" built from the felt cutout kit (kit/cutouts) on felt boards.
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

  // ---------- sets ----------
  function street(t, t0, o = {}) {     // a New York block at night
    const e = i => o.still ? null : stagger(t0, i, .07);
    P('sky_stars', 220, 430, 250, { in: e(0) }); P('island_moon', 870, 360, 220, { in: e(1), sway: .03 });
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
    P('room_radiator', 640, 1360, 250, { in: e(2) }); P('room_desk', 930, 1420, 400, { in: e(3), sway: .004 }); P('room_lamp', 960, 1110, 230, { in: e(4) });
    P('room_rug', 560, 1720, 330, { in: e(5), sway: 0 });
    if (warm > 0) glow(540, 1200, 900, '#FF9A5A', warm * .25);
  }

  // ---------- shots ----------
  function shHook(t, lt) {   // "Where are you staying? Not where you live. Where you're staying."
    const t0 = t - lt, wl = WT('hook', 'live'), ws = WT('hook', 'staying', 1);
    camBegin(540, 1000, 1.0); board('plum');
    host(t, 540, 1760, 40, { in: t0 + .02, aL: t > ws ? .4 : -1.2, aR: t > wl - .1 && t < ws ? .4 : -1.2, look: t > wl && t < ws ? -.6 : t > ws ? .6 : 0 });
    if (t > wl - .1) P('city_brownstone', 210, 1250, 560, { in: wl - .1, sway: .01, a: t > ws ? .45 : 1 });
    if (t > ws - .1) { glow(860, 1050, 380, '#FFC766', .8 * seg(t, ws, ws + .5)); P('island_islandhouse', 860, 1250, 360, { in: ws - .1, snd: 'chime' }); P('island_palm', 1000, 1260, 430, { in: ws, sway: .04 }); }
    feltSnow(t, 10, .7, 3);
    camEnd();
  }
  function shOpen(t, lt, dur) {   // the snowy street; Neville on the stoop; the car drives by; on "Barbados" a thought cloud
    const t0 = t - lt, wb = WT('open', 'barbados'), wn = WT('open', 'neville');
    camBegin(540, lerp(900, 1000, ease(seg(lt, 0, dur))), lerp(1.08, 1.0, ease(seg(lt, 0, dur)))); board('night');
    street(t, t0);
    person(590, 1520, 22, C.neville, { in: wn - .25, mood: t > wb ? 'happy' : 'sad', look: t > wb ? -.2 : 0, lookY: t > wb ? -1 : .4, key: 'nev' });
    { const k = ease(seg(t, t0 + 1.2, t0 + 4.2)); if (k > 0 && k < 1) { const hop = Math.abs(Math.sin(t * 9)) * 10 * (1 - k); P('city_car', lerp(-300, 1380, k), 1700 - hop, 190, { rot: -.04 * Math.sin(t * 9) * (1 - k), sway: 0, snd: false }); cue('car', t0 + 1.2, 'car', 540, 2.9); } }
    if (t > wb - .15) { P('island_cloud', 600, 1020, 230, { in: wb - .15, sway: .02, snd: 'pop' }); P('island_sun', 680, 930, 90, { in: wb + .05, snd: false }); P('island_palm', 520, 960, 130, { in: wb + .12, snd: false }); }
    host(t, 860, 1800, 34, { in: t0 + .7, aL: lerp(-1.2, -.1, ease(seg(lt, 1.2, 1.7))) });
    feltSnow(t, 26);
    camEnd();
  }
  function shRelate(t, lt) {     // close on Emery: a shrug
    const t0 = t - lt; camBegin(540, 1000, 1.0); board('night');
    street(t, t0, { still: true });
    const sh = spring(t, WT('relate', 'relatable') - .1, 7, 16);
    host(t, 540, 2250, 64, { mood: 'happy', aL: .25 + .35 * sh, aR: .25 + .35 * sh, key: 'hostclose' });
    feltSnow(t, 20, 1, 7);
    camEnd();
  }
  function shLate(t, lt) {       // the lecture: rows of chairs; Abdullah walks up; the clock spins six months
    const t0 = t - lt, ws = WT('late', 'six'), wl = WT('late', 'late');
    camBegin(540, 1000, 1.0); board('sand');
    const spin = ease(seg(t, ws - .2, wl + .3)) * TAU * 3;
    P('room_clock', 820, 640, 330, { in: stagger(t0, 0), rot: spin, sway: 0, snd: 'pat' }); if (t > ws - .2 && t < wl + .3) cue('ticks', ws - .2, 'ticks', 820, wl - ws + .5);
    P('room_painting', 300, 640, 260, { in: stagger(t0, 1) });
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) P('room_chair', 170 + c * 250 + r * 40, 1300 + r * 230, 300, { in: stagger(t0, 2 + r * 4 + c, .06), sway: .006 });
    const ax = lerp(-180, 330, ease(seg(lt, .5, 2.0)));
    person(ax, 1800, 32, C.abdullah, { mood: t > ws ? 'wise' : 'neutral', aL: t > ws ? .3 : -1.2, key: 'abd', lean: lt < 2 ? .04 * Math.sin(lt * 9) : 0 });
    person(780, 1800, 28, C.neville, { in: stagger(t0, 10), mood: t > wl ? 'surprised' : 'neutral', look: -1, key: 'nev', dy: t > wl ? -.25 * Math.exp(-(t - wl) * 4) : 0 });
    camEnd();
  }
  function shAsk(t, lt) {        // the study: Neville asks; on "Barbados" the window becomes the island
    const t0 = t - lt, wb = WT('ask', 'barbados'), warm = ease(seg(t, wb - .1, wb + .8));
    camBegin(540, 1000, 1.0 + .015 * lt); study(t, t0, warm);
    if (t > wb - .1) cue('askchime', wb - .05, 'chime', 640, 300);
    person(330, 1800, 34, C.abdullah, { in: stagger(t0, 7), mood: t > WT('ask', 'says') ? 'wise' : 'neutral', aL: t > wb - .2 ? .5 : -1.2, look: .6, key: 'abd' });
    person(800, 1800, 30, C.neville, { in: stagger(t0, 8), mood: t > wb + .2 ? 'surprised' : 'worried', look: -.8, lookY: t > wb + .2 ? -.6 : 0, key: 'nev' });
    camEnd();
  }
  function shHelp(t, lt) {       // deadpan: Abdullah back to his book, Neville looks at us
    camBegin(560, 1150, 1.22); study(t, 0, 1, { still: true });
    person(330, 1800, 34, C.abdullah, { mood: 'wise', look: -1, key: 'abd', hold: (x, y, u) => P('prop_bible', x, y + u * 1.6, u * 3.4, { sway: 0 }) });
    person(800, 1800, 30, C.neville, { mood: 'skeptical', look: 0, key: 'nev' });
    camEnd();
  }
  function shSleep(t, lt) {      // Neville in bed in the cold room; the room warms into Barbados
    const t0 = t - lt, wa = WT('sleep', 'asleep'), wb = WT('sleep', 'barbados'), k = ease(seg(t, WT('sleep', 'bed') - .3, wb + .6));
    camBegin(540, 1050, 1.0 + .04 * ease(seg(lt, 0, 5))); board('night'); if (k > 0) board('warm', k);
    P('room_window', 540, 860, 520, { in: stagger(t0, 0) });
    if (k > 0) { glow(540, 620, 360, '#FFC07A', k); P('island_sun', 610, 640, 170 * k, { snd: false }); P('island_palm', 460, 800, 280 * k, { sway: .05, snd: false }); }
    P('room_radiator', 160, 1380, 220, { in: stagger(t0, 1) });
    const bx = 560, bby = 1720, bh = 640;
    P('room_bed', bx, bby, bh, { in: stagger(t0, 2), sway: .003 });
    person(bx, bby - bh * .44, 11.5, { ...C.neville, hat: null }, { in: stagger(t0, 3), mood: t > wa ? 'sleepy' : 'neutral', key: 'nevbed', snd: false, aL: -1.2, aR: -1.2 });
    if (T > stagger(t0, 3) + .4) piecePart('room_bed', bx, bby, bh, .43, 1);
    zzz(700, bby - bh * .85, t, wa + .4);
    if (k > .02) cue('sleepwarm', WT('sleep', 'bed') - .2, 'sparkle', 540, 300);
    feltSnow(t, 8, 1 - k, 11);
    camEnd();
  }
  function shLetter(t, lt) {     // the envelope flies through the door; money fans out
    const t0 = t - lt, wl = WT('letter', 'letter'), wm = WT('letter', 'money');
    camBegin(540, 1000, 1.0); board('sand');
    P('room_door', 380, 1450, 900, { in: stagger(t0, 0), sway: .003 }); P('room_clock', 820, 520, 220, { in: stagger(t0, 1) }); P('room_rug', 600, 1760, 300, { in: stagger(t0, 2), sway: 0 });
    if (t > wl - .2 && t < wm + .1) { const kk = seg(t, wl - .2, wl + .5); const [x, y] = arcPt([400, 1050], [820, 1250], -260, ease(kk)); P('prop_envelope', x, y, 150, { rot: kk * 6, sway: 0 }); cue('env', wl - .2, 'whoosh', 600, 300); }
    person(820, 1800, 30, C.neville, { in: stagger(t0, 3), mood: t > wm ? 'joy' : t > wl ? 'surprised' : 'neutral', aL: t > wl + .4 ? .3 : -1.2, aR: t > wm ? .5 : -1.2, look: -.5, key: 'nev', dy: t > wm ? -.4 * Math.abs(Math.sin((t - wm) * 6)) * Math.exp(-(t - wm)) : 0 });
    if (t > wm) { const kk = backOut(seg(t, wm, wm + .35)); P('prop_money', 820, 1180, 260 * kk, { sway: .04, snd: false }); cue('cash', wm, 'cash', 820, 300); }
    camEnd();
  }
  function shThird(t, lt) {      // the ticket window: the clerk slides a grey third class ticket; Neville runs off
    const t0 = t - lt, w3 = WT('third', 'third'), wr = WT('third', 'runs');
    camBegin(540, 1000, 1.0); board('sand');
    const bx = 540, bby = 1500, bh = 900;
    P('city_ticketbooth', bx, bby, bh, { in: stagger(t0, 0), sway: 0 });
    person(bx, bby - bh * .2, 26, C.skeptic, { in: stagger(t0, 1), mood: 'skeptical', look: .5, aL: t > w3 - .2 ? -.2 : -1.2, key: 'agent', snd: false });
    if (T > stagger(t0, 1) + .4) piecePart('city_ticketbooth', bx, bby, bh, .76, 1);
    if (t > w3 - .2) P('prop_ticket', lerp(560, 400, ease(seg(t, w3 - .2, w3 + .4))), bby - bh * .2, 120, { tint: [150, 150, 150], sway: 0, rot: -.08, in: w3 - .2, drop: 0, snd: 'whoosh' });
    const rx = t > wr ? lerp(300, 1300, ease(seg(t, wr, wr + .7))) : 300;
    person(rx, 1820, 30, C.neville, { in: stagger(t0, 2), mood: t > w3 + .2 ? 'sad' : 'hopeful', look: .4, lookY: -.3, key: 'nev', lean: t > wr ? -.18 : 0, aL: t > wr ? .3 : -1.2, aR: t > wr ? -.3 : -1.2 });
    if (t > wr) cue('run', wr, 'whoosh', 800, 300);
    camEnd();
  }
  function doorway(t, t0, close, o = {}) {   // the study door, open (squashed to the hinge) or slammed
    board('plum'); P('room_rug', 540, 1760, 300, { in: o.still ? null : stagger(t0, 0), sway: 0 });
    glow(540, 1050, 380, '#FFD27A', .6 * (1 - close));
  }
  function shFirst(t, lt) {      // Abdullah in his doorway delivers the line; Neville protests
    const t0 = t - lt; camBegin(540, 1000, 1.0 + .02 * lt); doorway(t, t0, 0);
    person(540, 1740, 34, C.abdullah, { in: stagger(t0, 1), mood: t > WT('first', 'already') ? 'determined' : 'wise', aL: t > WT('first', 'first', 1) ? .7 : .2, look: .6, key: 'abd' });
    P('room_door', 250, 1640, 1100, { in: stagger(t0, 2), sx: .3, sway: .003 });
    person(890, 1820, 30, C.neville, { in: stagger(t0, 3), mood: 'worried', look: -1, aL: .2, key: 'nev' });
    camEnd();
  }
  function shDoor(t, lt) {       // SLAM: the door swings shut over Abdullah, the board shakes, stars circle Neville
    const wd = WT('door', 'door'), sl = wd + .05, k = easeIn(seg(t, wd - .35, sl)), [sx, sy] = shakeCam(t, sl);
    camBegin(540 + sx, 1000 + sy, 1.0); doorway(t, 0, k, { still: true });
    if (k < .98) person(540, 1740, 34, C.abdullah, { mood: 'wise', key: 'abd' });
    P('room_door', lerp(250, 540, k), 1640, 1100, { sx: lerp(.3, 1, k), sway: .003 }); cue('slam', sl, 'door', 540, 900);
    person(890, 1820, 30, C.neville, { mood: t > sl ? 'surprised' : 'worried', look: -1, key: 'nev', dy: t > sl ? -.6 * Math.exp(-(t - sl) * 5) : 0, lean: t > sl ? .12 * Math.exp(-(t - sl) * 3) : 0 });
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
      hold: (x, y, u) => P('prop_ticket', x - u * .5, y + u * .9, u * 3.2, { tint: gold > 0 ? [255, lerp(255, 214, gold), lerp(255, 90, gold)] : null, sway: .02, snd: false }),
      dy: t > wf + .5 ? -.8 * Math.abs(Math.sin((t - wf - .5) * 5)) * Math.exp(-(t - wf - .5) * .8) : 0 });
    if (t > wf - .2 && t < wf + .2) cue('goldspark', wf - .1, 'sparkle', 760, 300);
    camEnd();
  }
  function shRoomies(t, lt) {    // first class cabin: Neville squeezed between Paul (asleep) and Blake (startled)
    const t0 = t - lt; camBegin(540, 1100, 1.04); board('warm');
    P('room_painting', 540, 620, 300, { in: stagger(t0, 0) }); P('room_lamp', 200, 900, 220, { in: stagger(t0, 1) }); P('room_lamp', 880, 900, 220, { in: stagger(t0, 2), flip: true });
    P('room_bed', 820, 1420, 420, { in: stagger(t0, 3) }); P('prop_trunk', 230, 1440, 230, { in: stagger(t0, 4) });
    const rock = Math.sin(t * 1.6) * .02;
    person(230, 1860, 26, C.paul, { in: stagger(t0, 5), mood: 'sleepy', key: 'paul', lean: rock });
    person(540, 1860, 28, C.neville, { in: stagger(t0, 6), mood: 'beam', key: 'nev', lean: rock, aL: -.6, aR: -.6 });
    person(850, 1860, 26, C.blake, { in: stagger(t0, 7), mood: 'surprised', look: -1, key: 'blk', lean: rock });
    zzz(300, 1300, t, t0 + 1.0, .85); if (t > t0 + 1) cue('snore', t0 + 1.1, 'snore', 230, 300);
    camEnd();
  }
  const COSTUMES = [
    {}, { stripes: null, coat: '#3A3F4F', sleeve: '#3A3F4F', hat: 'fedora', hatCol: '#2B2A33', band: '#8C3B3B' }, { stripes: null, coat: '#E9DFC8', sleeve: '#E9DFC8', hat: 'cap', hatCol: '#3B2E5A', band: '#C9963A', robe: true, pants: '#E9DFC8' },
    { stripes: null, coat: '#5C6170', sleeve: '#5C6170', hat: 'flatcap', hatCol: '#5E5A4E', vest: '#8E8F96' }, { stripes: null, coat: '#A9784A', sleeve: '#A9784A', robe: true, pants: '#A9784A', sash: '#5E6B3A' }, {},
  ];
  function shCostume(t, lt) {    // same move, different costume: each costume is pressed on over the Dreamer
    const t0 = t - lt, we = WT('costume', 'every'), wc = WT('costume', 'costume');
    camBegin(540, 1050, 1.0); board('plum');
    glow(760, 1150, 520, '#FFE2A8', .5); P('room_rug', 760, 1820, 300, { in: stagger(t0, 0), sway: 0 });
    const n = COSTUMES.length - 1, step = (wc + .3 - we) / n, i = t < we ? 0 : Math.min(n, Math.floor((t - we) / step) + 1), ts = we + (i - 1) * step;
    for (let j = 1; j <= n; j++) cue('cos' + j, we + (j - 1) * step + .05, 'pat', 760, 500);
    const arm = i > 0 && i < n ? 1.2 * (1 - seg(t, ts + step * .6, ts + step)) : -1.2, p = i > 0 ? spring(t, ts, 9, 22) : 0;
    host(t, 300, 1800, 30, { in: stagger(t0, 1), aR: .2 });
    person(760, 1800 - (i > 0 ? (1 - ease(seg(t, ts, ts + .3))) * 120 : 0), 34, { ...C.dreamer, ...COSTUMES[i] }, { in: stagger(t0, 2), mood: 'joy', aL: arm, key: 'drm' + i, lean: .04 * p, snd: false });
    camEnd();
  }
  function shMove(t, lt, dur) {  // attention off the grey fact (left), onto the warm door (right) that opens onto the island
    const t0 = t - lt, wo = WT('move', 'off'), wp = WT('move', 'put'), wd = WT('move', 'done');
    camBegin(540, 1000, 1.0); board('night'); const open = ease(seg(t, wp, wd + .3));
    const fk = ease(seg(t, wo, wp));
    P('prop_scroll', 230, 1150, 420 * lerp(1, .55, fk), { in: stagger(t0, 0), tint: [150, 150, 158], sway: .01, a: lerp(1, .6, fk) });
    glow(820, 1150, 480 * (.3 + .7 * open), '#FFB86B', .9); board('warm', 0);
    if (open > 0) { P('island_sun', 840, 760, 160 * open, { snd: false }); P('island_islandhouse', 820, 1300, 300 * open, { snd: false }); }
    P('room_door', lerp(820, 690, open), 1460, 900, { in: stagger(t0, 1), sx: lerp(1, .25, open), sway: .003 }); if (open > 0) cue('dooropen', wp, 'creak', 820, 600);
    person(480, 1820, 32, C.dreamer, { in: stagger(t0, 2), mood: t > wd ? 'awe' : 'worried', ...turn(t, wp - .1, wp + .2, -.25, .25), look: t > wp ? 1 : -1, key: 'drm' });
    camEnd();
  }
  function shLive(t, lt) {       // visiting once (peek and back out) vs living there (walk in, nap under the palm)
    const t0 = t - lt, wv = WT('live', 'visit'), wo = WT('live', 'once'), wl = WT('live', 'live'), ws = WT('live', 'slept'), pz = ease(seg(t, ws - .3, ws + .8));
    camBegin(lerp(540, 760, pz), lerp(1000, 1250, pz), lerp(1.0, 1.5, pz)); board('warm');
    P('island_sun', 860, 450, 230, { in: stagger(t0, 0), sway: .02 }); P('island_cloud', 280, 520, 160, { in: stagger(t0, 1), sway: .02 });
    P('island_islandhouse', 760, 1330, 420, { in: stagger(t0, 2) }); P('island_palm', 1010, 1420, 640, { in: stagger(t0, 3), sway: .03 }); P('island_palm', 520, 1380, 520, { in: stagger(t0, 4), sway: .035, flip: true });
    for (let i = 0; i < 4; i++) P('sky_beach', 140 + i * 280, 1560, 120, { in: stagger(t0, 5 + i, .05), sway: 0 });
    let x = lerp(250, 480, ease(seg(t, wv - .3, wo))); if (t > wo) x = lerp(480, 200, ease(seg(t, wo, wo + .6))); if (t > wl - .2) x = lerp(200, 880, ease(seg(t, wl - .2, ws - .1)));
    const napping = t > ws - .1;
    person(x, 1820, 30, C.dreamer, { in: stagger(t0, 9), mood: napping ? 'sleepy' : t > wl ? 'determined' : t > wo ? 'worried' : 'happy', look: 1, key: 'drm', lean: napping ? -.08 : 0, aL: -1.2,
      hold: !napping ? (hx, hy, u) => P('prop_suitcase', hx, hy + u * 1.6, u * 2.6, { sway: .02, snd: false }) : null });
    if (napping) { P('prop_suitcase', 760, 1830, 120, { sway: 0, snd: false }); zzz(960, 1380, t, ws, .8); }
    camEnd();
  }
  function shVerse(t, lt) {      // Paul with his scroll by candlelight; the Dreamer turns gold on "transformed"
    const t0 = t - lt, wt = WT('verse', 'transformed'), wr = WT('verse', 'renewing'), g = t > wt + .3;
    camBegin(540, 1050, 1.0 + .03 * lt); board('plum');
    glow(540, 1050, 600, '#FFD27A', g ? 1 : .45);
    P('prop_candle', 120, 1700, 300, { in: stagger(t0, 0) }); P('bible_star', 540, 640, 300 * (g ? 1 : .0001), { sway: .04, snd: false });
    person(300, 1830, 32, C.paul, { in: stagger(t0, 1), mood: 'wise', aL: .8, hold: PROPS.scroll, key: 'paul' });
    const D = g ? { ...C.dreamer, stripes: null, coat: '#F0BE46', sleeve: '#F6D58A', cuff: '#FFF1C2' } : C.dreamer;
    person(760, 1830, 32, D, { in: stagger(t0, 2), mood: g ? 'awe' : 'neutral', look: -1, key: 'drm', aL: g ? .7 : -1.2, aR: g ? .7 : -1.2 });
    if (g) cue('gold', wt + .3, 'sparkle', 760, 400);
    camEnd();
    { const kk = 1 - Math.abs(t - (wt + .3)) / .25; if (kk > 0) flash(kk * .7, '#FFF4D6'); }
  }
  function shClose(t, lt) {      // back on the street: on "staying" the brownstone peels away and the island house takes its place
    const t0 = t - lt, ws = WT('close', 'staying'), warm = ease(seg(t, ws - .1, ws + .9));
    camBegin(540, 1000, 1.0); board('night'); if (warm > 0) board('warm', warm);
    street(t, t0, { brownOut: ws - .15 });
    if (t > ws) { glow(590, 1100, 420, '#FFC766', warm); P('island_islandhouse', 590, 1345, 520, { in: ws + .1, snd: 'chime' }); P('island_sun', 870, 360, 200, { in: ws + .3, snd: false }); }
    host(t, 860, 1820, 36, { in: t0 + .3, mood: 'warm', aL: t > ws - .2 ? .1 : -1.2, look: t > ws ? -.4 : 0 });
    feltSnow(t, 20, 1 - warm, 21);
    camEnd();
  }
  function shCta(t, lt, dur) {   // the call to action: the Temple pressed onto the board
    const t0 = t - lt, wt = WT('cta', 'temple');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wt - .2) { glow(560, 900, 520, '#FFD27A', ease(seg(t, wt - .2, wt + .5))); P('bible_temple', 560, 1180, 560, { in: wt - .2, snd: 'chime', sway: .006 }); }
    const wa = WT('cta', 'app');
    host(t, 330, 1820, 36, { in: t0 + .1, aR: t > wt - .3 ? .35 : -1.2, aL: t > wa - .2 ? .15 : -1.2, look: t > wt ? .5 : 0, hold: t > wa - .2 ? (x, y, u) => P('prop_telephone', x, y + u * 2.4, u * 7.5, { in: wa - .2, drop: 60, sway: .02 }) : null });
    camEnd();
    if (t > DUR - .9) { const kk = seg(t, DUR - .9, DUR - .1); iris(560, 900, lerp(1300, 0, easeIn(kk)), PAL.ink); }
  }

  shots([
    [0, shHook], [S('open') - .1, shOpen], [S('relate') - .1, shRelate], [S('late') - .15, shLate], [S('ask') - .15, shAsk], [S('help') - .05, shHelp],
    [S('sleep') - .15, shSleep], [S('letter') - .1, shLetter], [S('third') - .15, shThird], [S('first') - .15, shFirst], [S('door') - .05, shDoor], [S('sail') - .15, shSail],
    [S('roomies') - .1, shRoomies], [S('costume') - .15, shCostume], [S('move') - .15, shMove], [S('live') - .1, shLive], [S('verse') - .15, shVerse],
    [S('close') - .15, shClose], [S('cta') - .1, shCta],
  ]);
})();
