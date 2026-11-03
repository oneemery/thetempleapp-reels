window.CHEAP = true; window.FELT = true;
// Episode 15, flannelgraph cut: "The Country Bed" (the apartment rented overnight) built from the felt cutout kit (kit/cutouts) on felt boards.
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













  const LADY = { ...C.dreamer, name: 'lady', coat: '#2E3A52', sleeve: '#2E3A52', stripes: null, hair: '#8C7A68', skin: '#EFCBA6', torso: 7.4, leg: 4.6, w: 4.6 };
  const AGENT = { ...C.skeptic, name: 'agent', coat: '#8E8F96', sleeve: '#8E8F96', hat: 'fedora', hatCol: '#3A3A44', band: '#22222A' };
  const TENANT = { ...C.blake, name: 'tenant', coat: '#4F6B4A', sleeve: '#4F6B4A', hat: 'fedora', hatCol: '#3A4F36', band: '#C9963A' };
  const ISAIAH = { ...C.paul, name: 'isaiah', coat: '#3F6FB0', sleeve: '#3F6FB0', pants: '#3F6FB0', sash: '#E6B82A', hair: '#ECE8DF', hairStyle: 'neat', beard: .6, beardCol: '#ECE8DF' };
  const SIGNS = {};
  function rentSign(x, y, w, rented, a = 1) {   // a felt sign: FOR RENT, or RENTED in green
    if (window.CUEMODE || a <= 0) return; const key = rented ? 'r' : 'f';
    if (!SIGNS[key]) { const g = createGraphics(600, 220); g.pixelDensity(1); const c = g.drawingContext;
      c.fillStyle = '#3A2A22'; c.beginPath(); c.roundRect(14, 20, 572, 190, 24); c.fill(); c.fillStyle = '#F6F0E2'; c.beginPath(); c.roundRect(4, 6, 572, 190, 24); c.fill();
      c.fillStyle = rented ? '#2F7A4A' : '#B8463A'; c.beginPath(); c.roundRect(20, 22, 540, 158, 16); c.fill();
      c.fillStyle = '#F6F0E2'; c.font = 'bold 96px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(rented ? 'RENTED' : 'FOR RENT', 290, 104); SIGNS[key] = g; }
    flushBrush(); tint(255, 255 * a); image(SIGNS[key], x - w / 2, y - w * 110 / 600, w, w * 220 / 600); noTint();
  }
  const APT = [560, 1520, 860];
  const apartment = (t, t0, o = {}) => P('city_apartment', APT[0], APT[1], APT[2], { in: o.in === undefined ? stagger(t0, 1) : o.in, sway: .004 });
  function country(x, y, s, t, tin) { if (t < tin) return; P('island_cloud', x, y, s, { in: tin, snd: 'pop', sway: .02 }); P('life_house', x, y - s * .02, s * .42, { in: tin + .1, snd: false }); }
  function bedScene(t, t0, o = {}) { board('night'); P('room_window', 780, 860, 420, { in: o.still ? null : stagger(t0, 0) }); P('sky_hill', 780, 1010, 130, { in: o.still ? null : stagger(t0, 1), sway: 0 }); P('island_moon', 830, 860, 60, { in: o.still ? null : stagger(t0, 2), snd: false });
    const bx = 480, bby = 1760, bh = 600; P('room_bed', bx, bby, bh, { in: o.still ? null : stagger(t0, 3), sway: .002 });
    person(bx, bby - bh * .44, 11, LADY, { in: o.still ? null : stagger(t0, 4), mood: 'sleepy', key: 'ladybed', snd: false, aL: -1.2, aR: -1.2 }); if (T > (o.still ? -9 : stagger(t0, 4)) + .4) piecePart('room_bed', bx, bby, bh, .43, 1); }

  // ---------- shots ----------
  function shHook(t, lt) {   // the apartment sits with its FOR RENT sign; she goes to sleep somewhere else
    const t0 = t - lt, ws = WT('hook', 'somewhere');
    camBegin(540, 1000, 1.0); board('day'); apartment(t, t0); rentSign(APT[0], 1220, 420, false);
    person(220, 1860, 30, LADY, { in: t0 + .1, mood: t > ws ? 'warm' : 'sad', look: t > ws ? .4 : 1, lookY: t > ws ? -.5 : 0, key: 'lady' });
    country(820, 860, 300, t, ws - .2);
    camEnd();
  }
  function shVerse(t, lt) {      // Isaiah: before they call, I will answer
    const t0 = t - lt, wa = WT('verse', 'answer'), lit = ease(seg(t, wa - .2, wa + .5));
    camBegin(540, 1050, 1.0 + .02 * lt); board('plum'); glow(540, 1050, 600, '#FFD27A', .35 + .55 * lit);
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (t > wa - .2) P('bible_star', 720, 760, 260, { in: wa - .2, snd: 'chime', sway: .04 });
    person(440, 1840, 40, ISAIAH, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'isa', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // the answer first (a star), then sleep like it came (the moon)
    const t0 = t - lt, wa = WT('meaning', 'answer'), ws = WT('meaning', 'sleep');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wa - .2) P('bible_star', 300, 900, 200, { in: wa - .2, snd: 'chime', sway: .04 }); if (t > ws - .2) { P('island_moon', 780, 900, 200, { in: ws - .2, snd: false }); zzz(860, 760, t, ws, .8); }
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0 });
    camEnd();
  }
  function shWoman(t, lt) {      // she comes to Neville: rent the city apartment to afford summer in the country
    const t0 = t - lt, wc = WT('woman', 'country'), wa = WT('woman', 'apartment');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1200, 500, '#FFD27A', .35);
    person(300, 1840, 32, C.neville, { in: stagger(t0, 0), mood: 'warm', look: 1, key: 'nev' }); person(760, 1840, 30, LADY, { in: stagger(t0, 1), mood: 'hopeful', look: -1, key: 'lady', talk: talk(t) });
    country(760, 1060, 260, t, wc - .2); if (t > wa - .2) { P('island_cloud', 400, 960, 240, { in: wa - .2, snd: 'pop' }); P('city_apartment', 400, 950, 110, { in: wa, snd: false }); }
    camEnd();
  }
  function shSeason(t, lt) {     // the season is over; months of nobody; the agent shrugs
    const t0 = t - lt, wo = WT('season', 'over'), wm = WT('season', 'months');
    camBegin(540, 1000, 1.0); board('sand'); apartment(t, t0, { in: null }); rentSign(APT[0], 1220, 420, false, 1);
    P('city_wintertree', 140, 1600, 480, { in: wo - .2, sway: .02 }); if (t > wm - .2) P('room_clock', 880, 620, 180, { in: wm - .2, rot: ease(seg(t, wm - .2, wm + 1.4)) * TAU * 4, sway: 0, snd: 'ticks' });
    const sh = Math.sin(Math.PI * seg(t, wm, wm + .9));
    person(820, 1860, 30, AGENT, { in: t0 + .1, mood: 'skeptical', look: -.4, key: 'agent', aL: -1.2 + 1.4 * sh, aR: -1.2 + 1.4 * sh });
    camEnd();
  }
  function shAdvice(t, lt) {     // Neville: imagine it already rented (the sign flips in a cloud)
    const t0 = t - lt, wr = WT('advice', 'rented'), wm = WT('advice', 'move');
    camBegin(540, 1000, 1.0); board('plum');
    person(300, 1840, 32, C.neville, { mood: 'warm', look: 1, key: 'nev', aR: .5, talk: talk(t) }); person(760, 1840, 30, LADY, { mood: t > wr ? 'hopeful' : 'neutral', look: -1, key: 'lady' });
    if (t > wr - .3) { P('island_cloud', 540, 1060, 400, { in: wr - .3, snd: 'pop' }); rentSign(540, 980, 280, true); cue('flip', wr, 'sparkle', 540, 300); }
    if (t > wm - .2) P('prop_suitcase', 640, 1020, 80, { in: wm - .2, snd: false });
    camEnd();
  }
  function shNatural(t, lt) {    // fall asleep as if in the country home: if she's there, it's rented
    const t0 = t - lt, wc = WT('natural', 'country'), wr = WT('natural', 'rented');
    camBegin(540, 1000, 1.0); board('night');
    person(300, 1840, 30, LADY, { in: t0 + .05, mood: 'sleepy', look: .4, key: 'lady' }); zzz(420, 1300, t, t0 + .4, .7);
    country(720, 1000, 380, t, wc - .3); if (t > wr - .2) { rentSign(720, 1280, 220, true); cue('rented', wr, 'chime', 720, 300); }
    camEnd();
  }
  function shBed(t, lt) {        // Thursday night: asleep in her bed in the country (though the house wasn't open yet)
    const t0 = t - lt, wo = WT('bed', 'open');
    camBegin(540, 1050, 1.04); bedScene(t, t0); glow(480, 1400, 380, '#FFE2A8', .5); zzz(600, 1250, t, t0 + .6, .9);
    if (t > wo - .2) P('island_cloud', 820, 1100, 200, { in: wo - .2, snd: 'pop', tint: [200, 200, 210] });
    camEnd();
  }
  function shFriday(t, lt) {     // Friday: a tenant arrives with his suitcase; the sign flips to RENTED
    const t0 = t - lt, wt = WT('friday', 'tenant'), wr = WT('friday', 'rented'), walk = ease(seg(t, wt - .4, wt + .8)), flip = t > wr - .1;
    camBegin(540, 1000, 1.0); board('day'); apartment(t, t0); rentSign(APT[0], 1220, 420, flip); if (flip) cue('rentedsign', wr, 'sparkle', APT[0], 400);
    if (t > wt - .4) person(lerp(1250, 760, walk), 1860, 30, TENANT, { in: wt - .4, mood: 'happy', look: -1, key: 'ten', hold: (x, y, u) => P('prop_suitcase', x, y + u * 1.6, u * 2.6, { sway: .02, snd: false }) });
    person(260, 1860, 28, AGENT, { in: t0 + .1, mood: flip ? 'joy' : 'surprised', look: 1, key: 'agent' });
    camEnd();
  }
  function shSaturday(t, lt) {   // Saturday morning: she phones Neville, so excited
    const t0 = t - lt, wc = WT('saturday', 'called');
    camBegin(540, 1000, 1.0); board('warm'); P('island_sun', 820, 520, 180, { in: t0 + .05 });
    P('prop_telephone', 520, 1560, 220, { in: t0 + .1, snd: 'chime' });
    person(300, 1860, 30, LADY, { in: t0 + .1, mood: 'joy', look: .5, key: 'lady', talk: talk(t), dy: -.3 * Math.abs(Math.sin(t * 6)) });
    if (t > wc) { P('island_cloud', 800, 1080, 280, { in: wc, snd: 'pop' }); person(800, 1120, 7, C.neville, { in: wc + .1, mood: 'beam', key: 'nevc', snd: false }); }
    camEnd();
  }
  function shLesson(t, lt) {     // not the agent's call (a grey phone fades); the night after (the bed in the country glows)
    const t0 = t - lt, wn = WT('lesson', 'night'), wc = WT('lesson', 'country');
    camBegin(540, 1000, 1.0); board('plum');
    P('prop_telephone', 280, 1300, 200, { in: t0 + .1, tint: [160, 160, 160], out: wn - .2 });
    if (t > wn - .3) { P('island_cloud', 640, 1100, 460, { in: wn - .3, snd: 'pop' }); P('room_bed', 600, 1100, 140, { in: wn - .1, snd: false }); P('life_house', 740, 1060, 110, { in: wn, snd: false }); }
    if (t > wc) glow(640, 1000, 340, '#FFD27A', .7);
    camEnd();
  }
  function shClose(t, lt) {      // where would you be sleeping tonight, if it was already done?
    const t0 = t - lt, wd = WT('close', 'done');
    camBegin(540, 1000, 1.0); board('night'); P('island_moon', 820, 520, 180, { in: t0 + .1 });
    if (t > wd - .3) { P('island_cloud', 540, 1060, 300, { in: wd - .3, snd: 'pop' }); P('room_bed', 540, 1050, 110, { in: wd - .1, snd: false }); }
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0, aR: t > wd - .2 ? .3 : -1.2 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'living'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('woman') - .12, shWoman], [S('season') - .12, shSeason], [S('advice') - .12, shAdvice], [S('natural') - .12, shNatural], [S('bed') - .12, shBed], [S('friday') - .12, shFriday], [S('saturday') - .12, shSaturday], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
