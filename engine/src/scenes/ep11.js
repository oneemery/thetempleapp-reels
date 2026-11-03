window.CHEAP = true; window.FELT = true;
// Episode 11, flannelgraph cut: "The Ride" (the blind woman in San Francisco) built from the felt cutout kit (kit/cutouts) on felt boards.
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









  const BLIND = { ...C.dreamer, name: 'blind', coat: '#7A4E8A', sleeve: '#7A4E8A', stripes: null, hair: '#5A3A24', skin: '#E6B48C', torso: 7.2, leg: 4.6, w: 4.6, glasses: true };
  const FRIEND = { ...C.dreamer, name: 'friend', coat: '#E07A4F', sleeve: '#E07A4F', stripes: null, hair: '#2B1E19', skin: '#C98E62', torso: 7.0, leg: 4.4, w: 4.4 };
  const HELPER = { ...C.blake, name: 'helper', coat: '#2E3A52', sleeve: '#2E3A52', lapel: '#F3EBDC', hat: 'fedora', hatCol: '#22222A', band: '#8C3B3B' };
  const BARMAN = { ...C.skeptic, name: 'barman', coat: '#F3EBDC', sleeve: '#F3EBDC', lapel: '#22222A', tie: '#22222A', hat: null, glasses: false };
  const STRANGER = { ...C.neville, name: 'stranger', coat: '#5A4636', sleeve: '#5A4636', lapel: '#3E3026', scarf: '#3F8F8A', hat: 'flatcap', hatCol: '#3E3026', band: '#3E3026' };
  const cane = (x, y, u) => { if (window.CUEMODE) return; flushBrush(); push(); noStroke(); fill(246, 240, 226); rect(x - u * .12, y, u * .24, u * 7.5, u * .1); fill(184, 70, 58); rect(x - u * .13, y + u * 6.2, u * .26, u * 1.3); pop(); };
  function sitIn(t, cx, by, h, spec, o = {}) { P('room_armchair', cx, by, h, { in: o.in, sway: .003 }); person(cx, by - h * .22, o.u || 22, spec, o); if (T > (o.in ?? -9) + .4) piecePart('room_armchair', cx, by, h, .58, 1); }
  const living = (t, t0, o = {}) => { board(o.night ? 'night' : 'warm'); P('room_window', 780, 860, 440, { in: o.still ? null : stagger(t0, 0) }); P('room_lamp', 160, 1150, 240, { in: o.still ? null : stagger(t0, 1) }); rug(560, 1900, 380, { in: o.still ? null : stagger(t0, 2) }); };
  const car = (x, y, s, o = {}) => P('city_car', x, y, s, { sway: 0, snd: false, ...o });

  // ---------- shots ----------
  function shHook(t, lt) {   // she can't see, so she imagines being driven: a car glides in
    const t0 = t - lt, wd = WT('hook', 'driven');
    camBegin(540, 1000, 1.0); board('plum');
    person(320, 1840, 32, BLIND, { in: t0 + .05, mood: t > wd ? 'beam' : 'neutral', look: .3, key: 'blind', hold: cane });
    if (t > wd - .4) { car(lerp(1300, 760, ease(seg(t, wd - .4, wd + .4))), 1800, 260); cue('carin', wd - .4, 'car', 760, 1); }
    camEnd();
  }
  function shVerse(t, lt) {      // Paul by candlelight: the evidence of things not seen
    const t0 = t - lt, wn = WT('verse', 'seen'), lit = ease(seg(t, wn - .2, wn + .5));
    camBegin(540, 1050, 1.0 + .02 * lt); board('plum'); glow(540, 1050, 600, '#FFD27A', .35 + .55 * lit);
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (t > wn - .2) P('bible_star', 700, 760, 260, { in: wn - .2, snd: 'chime', sway: .04, a: .5 + .5 * lit });
    person(440, 1840, 40, C.paul, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'paul', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // she couldn't see, but she could feel the end
    const t0 = t - lt, we = WT('meaning', 'end'), lit = ease(seg(t, we - .2, we + .5));
    camBegin(540, 1000, 1.0); board('plum'); if (lit > 0) { glow(540, 1350, 460, '#FFD27A', .7 * lit); car(760, 1500, 200, { in: we - .2, snd: 'pop', a: .6 }); }
    host(t, 380, 1830, 38, { in: t0 + .02, mood: t > we ? 'warm' : 'sleepy', look: .3 });
    camEnd();
  }
  function shWoman(t, lt) {      // San Francisco: fifteen minutes to work; then the bus is rerouted (it turns away)
    const t0 = t - lt, wr = WT('woman', 'rerouted'), go = ease(seg(t, wr - .2, wr + .8));
    camBegin(540, 1000, 1.0); board('day'); P('city_skyscraper', 820, 1300, 700, { in: stagger(t0, 0), sway: .004 }); P('city_rowhouses', 200, 1400, 420, { in: stagger(t0, 1) });
    P('room_clock', 540, 620, 180, { in: stagger(t0, 2) });
    P('life_bus', lerp(640, 1500, go), 1720, 420, { in: stagger(t0, 3), sway: .006, flip: go > 0 }); if (go > 0 && go < 1) cue('busoff', wr, 'car', 800, 1);
    person(260, 1850, 30, BLIND, { in: stagger(t0, 4), mood: t > wr ? 'worried' : 'happy', look: 1, key: 'blind', hold: cane });
    camEnd();
  }
  function shBuses(t, lt, dur) { // three buses, one after another; the clock spins from 15 minutes to two hours fifteen
    const t0 = t - lt, wt = WT('buses', 'two');
    camBegin(540, 1000, 1.0); board('day'); P('city_rowhouses', 200, 1400, 420, {}); P('city_streetlamp', 980, 1560, 520, {});
    for (let i = 0; i < 3; i++) { const ti = t0 + .3 + i * 1.1, k = ease(seg(t, ti, ti + 1.0)); if (k > 0 && k < 1) { P('life_bus', lerp(-300, 1400, k), 1720, 400, { sway: .006, snd: false, tint: [[255, 255, 255], [220, 235, 255], [255, 230, 200]][i] }); } if (t > ti) cue('bus' + i, ti, 'car', 540, 1); }
    tally(t, 400, 760, 3, [t0 + .4, t0 + 1.5, t0 + 2.6], 140);
    if (t > wt - .3) P('room_clock', 540, 1000, 220, { in: wt - .3, rot: ease(seg(t, wt - .3, wt + 1.2)) * TAU * 2.25, sway: 0, snd: 'ticks' });
    person(220, 1860, 28, BLIND, { mood: 'sad', look: 1, key: 'blind', hold: cane });
    camEnd();
  }
  function shDriven(t, lt) {     // she couldn't drive, but she could be driven: a car in a cloud
    const t0 = t - lt, wb = WT('driven', 'driven');
    camBegin(540, 1000, 1.0); board('plum');
    person(320, 1840, 32, BLIND, { in: t0 + .05, mood: t > wb ? 'determined' : 'neutral', look: .4, lookY: -.3, key: 'blind', hold: cane });
    if (t > wb - .3) { P('island_cloud', 740, 1060, 340, { in: wb - .3, snd: 'pop' }); car(740, 1040, 150, { in: wb - .1 }); }
    camEnd();
  }
  function shSat(t, lt) {        // the living room: "I will sit here and imagine that I am being driven to my office"
    const t0 = t - lt, wi = WT('sat', 'imagine'), lit = ease(seg(t, wi - .2, wi + .6));
    camBegin(540, 1000, 1.0); living(t, t0); if (lit > 0) glow(420, 1450, 420, '#FFD27A', .6 * lit);
    sitIn(t, 420, 1840, 440, BLIND, { in: stagger(t0, 3), mood: t > wi ? 'warm' : 'neutral', key: 'blind', talk: talk(t) });
    camEnd();
  }
  function shMotor(t, lt) {      // the motor's rhythm, the gasoline, the motion, the driver's sleeve: a ghost car around her chair
    const t0 = t - lt, wm = WT('motor', 'motor'), wsl = WT('motor', 'sleeve'), shake = Math.sin(t * 22) * 4;
    camBegin(480, 1350, 1.2); living(t, t0, { still: true });
    if (t > wm - .3) { car(480 + shake, 1900, 760, { in: wm - .3, a: .45, snd: false }); cue('motor', wm, 'car', 480, 2.5); }
    sitIn(t, 420, 1840, 440, BLIND, { mood: 'beam', key: 'blind', dy: Math.sin(t * 22) * .05, aR: t > wsl - .3 ? .5 : -1.2 });
    if (t > wsl - .2) { glow(620, 1440, 200, '#FFD27A', .6); cue('sleeve', wsl, 'sparkle', 620, 200); }
    camEnd();
  }
  function shStopped(t, lt) {    // "Thank you very much, sir." "The pleasure is all mine." The door shuts.
    const t0 = t - lt, wt = WT('stopped', 'thank'), wp = WT('stopped', 'pleasure'), wsh = WT('stopped', 'shut');
    camBegin(540, 1000, 1.0); board('day'); P('city_skyscraper', 820, 1300, 700, { in: stagger(t0, 0), sway: .004 });
    car(780, 1800, 340, { in: stagger(t0, 1) });
    person(600, 1850, 26, STRANGER, { in: stagger(t0, 2), mood: 'happy', look: -1, key: 'drv', talk: t > wp - .1 && t < wsh - .3 ? talk(t) : null });
    person(t > wsh - .4 ? 200 : 360, 1850, 30, BLIND, { in: stagger(t0, 3), mood: 'beam', look: 1, key: 'blind', hold: cane, talk: t > wt - .1 && t < wp - .1 ? talk(t) : null });
    if (t > wsh - .1) cue('door', wsh, 'door', 780, 400);
    camEnd();
  }
  function shTwice(t, lt) {      // two days in a row; she rides in it, she doesn't think about it
    const t0 = t - lt, wt = WT('twice', 'two'), wr = WT('twice', 'rode');
    camBegin(540, 1000, 1.0); living(t, t0, { still: true });
    tally(t, 400, 760, 2, [wt, wt + .2], 160);
    if (t > wr - .3) { car(420, 1900, 700, { in: wr - .3, a: .45, snd: false }); cue('ride2', wr, 'car', 420, 1.5); }
    sitIn(t, 420, 1840, 440, BLIND, { mood: 'beam', key: 'blind' });
    camEnd();
  }
  function shFriend(t, lt) {     // a friend mentions a newspaper story; she phones the man
    const t0 = t - lt, wn = WT('friend', 'newspaper'), wc = WT('friend', 'called');
    camBegin(540, 1000, 1.0); living(t, t0, { still: true });
    person(780, 1840, 30, FRIEND, { in: stagger(t0, 0), mood: 'happy', look: -1, key: 'friend', talk: t < wc ? talk(t) : null, hold: t > wn - .3 ? (x, y, u) => P('prop_scroll', x, y + u, u * 4, { sway: .02, snd: false }) : null });
    if (t > wc - .3) P('prop_telephone', 300, 1500, 220, { in: wc - .3, snd: 'chime' });
    person(400, 1840, 30, BLIND, { in: stagger(t0, 1), mood: t > wc ? 'hopeful' : 'neutral', look: 1, key: 'blind', hold: cane });
    camEnd();
  }
  function shBar(t, lt) {        // the bar: a stranger offers to drive her home; the man offers to drive her to work
    const t0 = t - lt, ws = WT('bar', 'stranger'), wi = WT('bar', 'if');
    camBegin(540, 1000, 1.0); board('sand'); P('room_painting', 300, 600, 220, { in: stagger(t0, 0) });
    const bx = 760, bby = 1500, bh = 800; P('city_ticketbooth', bx, bby, bh, { in: stagger(t0, 1), sway: 0, tint: [210, 180, 150] });
    person(bx, bby - bh * .2, 24, BARMAN, { in: stagger(t0, 2), mood: 'happy', look: -.6, key: 'bar', snd: false }); if (T > stagger(t0, 2) + .4) piecePart('city_ticketbooth', bx, bby, bh, .76, 1);
    person(200, 1850, 30, HELPER, { in: stagger(t0, 3), mood: t > wi ? 'beam' : 'warm', look: 1, key: 'help', talk: t > wi - .1 ? talk(t) : null });
    if (t > ws - .3) person(440, 1850, 30, STRANGER, { in: ws - .3, mood: 'happy', look: -1, key: 'str', aR: .9 });
    camEnd();
  }
  function shYear(t, lt, dur) {  // for over a year, two men drive her to work and back: under fifteen minutes again
    const t0 = t - lt, k = (t - t0) / dur;
    camBegin(540, 1000, 1.0); board('day'); P('city_skyscraper', 880, 1300, 680, { in: stagger(t0, 0), sway: .004 }); P('city_rowhouses', 160, 1400, 380, { in: stagger(t0, 1) });
    car(lerp(-100, 640, ease(seg(t, t0 + .2, t0 + 1.6))), 1800, 320, { in: stagger(t0, 2), snd: 'car' });
    tally(t, 130, 700, 12, Array.from({ length: 12 }, (_, i) => t0 + .4 + i * .12), 76);
    if (k > .55) P('room_clock', 540, 980, 200, { in: t0 + dur * .55, snd: 'chime' });
    camEnd();
  }
  function shLesson(t, lt) {     // not wanting a ride: being in one, all the way to "thank you"
    const t0 = t - lt, wb = WT('lesson', 'being'), wt = WT('lesson', 'thank'), lit = ease(seg(t, wb - .2, wb + .6));
    camBegin(540, 1000, 1.0); board('plum'); if (lit > 0) glow(540, 1400, 460, '#FFD27A', .7 * lit);
    if (t > wb - .2) car(540, 1900, 700, { in: wb - .2, a: .45, snd: 'pop' });
    person(540, 1840, 32, BLIND, { in: t0 + .05, mood: t > wt ? 'beam' : 'warm', key: 'blind', hold: cane });
    if (t > wt) cue('thanks', wt, 'chime', 540, 300);
    camEnd();
  }
  function shClose(t, lt) {      // what would it feel like to already be there?
    const t0 = t - lt, wt = WT('close', 'there');
    camBegin(540, 1000, 1.0); board('plum'); if (t > wt - .2) { P('island_cloud', 540, 1060, 300, { in: wt - .2, snd: 'pop' }); P('island_islandhouse', 540, 1040, 130, { in: wt, snd: false }); }
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0, aR: t > wt - .2 ? .3 : -1.2 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'feel'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('woman') - .12, shWoman], [S('buses') - .12, shBuses], [S('driven') - .12, shDriven], [S('sat') - .12, shSat], [S('motor') - .12, shMotor], [S('stopped') - .12, shStopped], [S('twice') - .12, shTwice], [S('friend') - .12, shFriend], [S('bar') - .12, shBar], [S('year') - .12, shYear], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
