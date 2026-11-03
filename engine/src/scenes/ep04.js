window.CHEAP = true; window.FELT = true;
// Episode 4, flannelgraph cut: "Goddard and Sons" (Victor's building) built from the felt cutout kit (kit/cutouts) on felt boards.
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


  const VICTOR = { ...C.neville, name: 'victor', coat: '#7A4E3A', sleeve: '#7A4E3A', lapel: '#5A3A2A', scarf: '#C9963A', pants: '#4A3A30', hat: 'flatcap', hatCol: '#5E5A4E', band: '#5E5A4E', torso: 8.2, leg: 5.2 };
  const STRANGER = { ...C.skeptic, name: 'stranger', coat: '#2E3A52', sleeve: '#2E3A52', lapel: '#E9DFC8', tie: '#8C3B3B', hat: 'fedora', hatCol: '#22222A', band: '#8C3B3B', glasses: false };
  let SIGNG = null;
  function sign(x, y, w, a = 1, gl = 0) {   // the felt marquee: GODDARD AND SONS (a < 1: only imagined)
    if (window.CUEMODE || a <= 0) return;
    if (!SIGNG) { const g = createGraphics(900, 200); g.pixelDensity(1); const c = g.drawingContext;
      c.fillStyle = '#3A2A22'; c.beginPath(); c.roundRect(14, 20, 872, 170, 26); c.fill(); c.fillStyle = '#F6F0E2'; c.beginPath(); c.roundRect(4, 6, 872, 170, 26); c.fill();
      c.fillStyle = '#7A2E2A'; c.beginPath(); c.roundRect(22, 24, 836, 134, 18); c.fill();
      c.fillStyle = '#F4C04A'; c.font = 'bold 74px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('GODDARD AND SONS', 440, 94); SIGNG = g; }
    if (gl > 0) glow(x, y, w * .7, '#FFD27A', gl);
    flushBrush(); tint(255, 255 * a); image(SIGNG, x - w / 2, y - w * 100 / 900, w, w * 200 / 900); noTint();
  }
  const BLD = [560, 1460, 820];
  function building(t, t0, o = {}) {   // the block-long building on the widest part of main street
    P('city_brownstone', BLD[0], BLD[1], BLD[2], { in: o.in === undefined ? stagger(t0, 3) : o.in, sx: o.sx ?? 1.55, sway: .003, a: o.a ?? 1, tint: o.tint });
  }
  function mainStreet(t, t0, o = {}) { board(o.board || 'day'); const e = i => o.still ? null : stagger(t0, i, .07);
    P('island_sun', 880, 400, 190, { in: e(0), sway: .02 }); P('island_cloud', 250, 430, 150, { in: e(1), sway: .02 });
    P('city_rowhouses', 120, 1380, 380, { in: e(2), sway: .004 }); P('city_streetlamp', 990, 1560, 520, { in: e(4), sway: .015 }); }

  // ---------- shots ----------
  function shHook(t, lt) {   // Emery walks to work past a building; a sign that isn't there yet flickers over its door
    const t0 = t - lt, ws = WT('hook', 'sign'), walk = ease(seg(t, t0, t0 + 2.2));
    camBegin(540, 1000, 1.0); mainStreet(t, t0); building(t, t0);
    if (t > ws - .2) { sign(BLD[0], 1120, 620, .45 + .2 * Math.sin(t * 6), .5); cue('ghostsign', ws - .1, 'sparkle', 560, 300); }
    host(t, lerp(-150, 300, walk), 1830, 34, { mood: t > ws ? 'awe' : 'neutral', look: t > ws - .2 ? .6 : 1, lookY: t > ws ? -.5 : 0, dy: walk < 1 ? -.15 * Math.abs(Math.sin(t * 8)) : 0 });
    camEnd();
  }
  function shVerse(t, lt) {      // Paul by candlelight; on "calleth" a faint star; on "were" it is solid
    const t0 = t - lt, wc = WT('verse', 'calleth'), ww = WT('verse', 'were'), solid = ease(seg(t, ww - .1, ww + .4));
    camBegin(540, 1050, 1.0 + .02 * lt); board('plum'); glow(540, 1050, 600, '#FFD27A', .4 + .5 * solid);
    P('prop_candle', 120, 1700, 300, { in: stagger(t0, 0) });
    if (t > wc - .1) { P('bible_star', 680, 760, 300, { in: wc - .1, snd: 'pop', sway: .04, a: .35 + .65 * solid }); if (solid > 0) cue('solid', ww, 'chime', 680, 300); }
    person(440, 1840, 40, C.paul, { in: stagger(t0, 1), mood: 'wise', aL: t > wc - .2 ? .8 : .2, look: .6, key: 'paul', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // a solid house (things that are), a ghost house (things that be not); call it first: it fills in
    const t0 = t - lt, wa = WT('meaning', 'are'), wn = WT('meaning', 'not'), wf = WT('meaning', 'first'), fill = ease(seg(t, wf - .1, wf + .5));
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wa - .2) P('life_house', 250, 1420, 330, { in: wa - .2, sway: .004 });
    if (t > wn - .2) { if (fill > 0) glow(760, 1250, 360, '#FFD27A', fill); P('life_house', 760, 1420, 330, { in: wn - .2, snd: 'pop', sway: .004, a: .3 + .7 * fill }); if (fill > 0) cue('fill', wf, 'chime', 760, 300); }
    host(t, 520, 1820, 34, { in: t0 + .02, mood: 'warm', aR: t > wf - .2 ? .4 : -1.2, look: t > wn ? .6 : -.4 });
    camEnd();
  }
  function shVictor(t, lt) {     // Victor, eighteen: an empty grey purse peels away; a thought cloud
    const t0 = t - lt, wm = WT('victor', 'money'), wd = WT('victor', 'dream');
    camBegin(540, 1050, 1.04); mainStreet(t, t0, { board: 'sand' });
    if (t > wm - .2) P('life_coinbag', 760, 1500, 200, { in: wm - .2, out: wm + 1.2, tint: [150, 150, 150], snd: 'pop' });
    person(480, 1840, 32, VICTOR, { in: stagger(t0, 5), mood: t > wd - .2 ? 'hopeful' : t > wm ? 'sad' : 'neutral', look: t > wd ? .3 : 0, lookY: t > wd ? -.6 : 0, key: 'vic', aL: t > wm && t < wd ? .1 : -1.2, aR: t > wm && t < wd ? .1 : -1.2 });
    if (t > wd - .2) { P('island_cloud', 700, 1000, 330, { in: wd - .2, snd: 'pop', sway: .02 }); P('city_brownstone', 700, 1000, 150, { in: wd, snd: false, sx: 1.5 }); }
    camEnd();
  }
  function shDream(t, lt) {      // the building presses on and stretches to a whole block
    const t0 = t - lt, wb = WT('dream', 'building'), wk = WT('dream', 'block'), wide = ease(seg(t, wk - .3, wk + .5));
    camBegin(540, 1000, 1.0); mainStreet(t, t0);
    if (t > wb - .2) building(t, t0, { in: wb - .2, sx: lerp(.9, 1.55, wide) }); if (wide > 0 && wide < 1) cue('stretch', wk - .2, 'creak', 560, 600);
    person(870, 1840, 28, VICTOR, { in: stagger(t0, 5), mood: 'awe', look: -1, lookY: -.4, key: 'vic' });
    camEnd();
  }
  function shTwice(t, lt) {      // he stops across the street, morning and evening; on "Goddard" he sees the sign
    const t0 = t - lt, wt = WT('twice', 'twice'), wg = WT('twice', 'goddard'), eve = Math.abs(Math.sin(Math.PI * seg(t, wt, wt + 1.6)));
    camBegin(540, 1000, 1.0); board('day'); if (eve > .05) board('warm', eve);
    P('city_rowhouses', 120, 1380, 380, {}); building(t, t0, { in: null });
    if (t > wg - .2) { sign(BLD[0], 1120, 620, .55 + .15 * Math.sin(t * 5), .8); cue('see', wg - .1, 'sparkle', 560, 300); }
    person(880, 1840, 30, VICTOR, { in: stagger(t0, 0), mood: t > wg ? 'beam' : 'hopeful', look: -1, lookY: t > wg ? -.5 : -.2, key: 'vic' });
    camEnd();
  }
  function shYears(t, lt, dur) { // two years: days and nights flicker by, the clock spins, the sign always there in his eye
    const t0 = t - lt, k = seg(t, t0, t0 + dur), dn = Math.sin(k * TAU * 6) > 0;
    camBegin(540, 1000, 1.0); board(dn ? 'day' : 'night'); building(t, t0, { in: null });
    sign(BLD[0], 1120, 620, .55, .6);
    P('room_clock', 880, 560, 200, { in: t0, rot: k * TAU * 8, sway: 0, snd: 'ticks' });
    person(880, 1840, 30, VICTOR, { mood: 'determined', look: -1, lookY: -.4, key: 'vic' });
    camEnd();
  }
  function shStranger(t, lt) {   // a stranger walks up and hands over the deed; ten felt dots: paid back over ten years
    const t0 = t - lt, ws = WT('stranger', 'stranger'), wt = WT('stranger', 'ten'), wk = ease(seg(t, ws - .4, ws + .8));
    camBegin(540, 1000, 1.0); mainStreet(t, t0, { still: true }); building(t, t0, { in: null });
    person(lerp(-150, 520, wk), 1840, 30, STRANGER, { mood: 'happy', look: 1, key: 'str', aR: wk > .95 ? .4 : -1.2,
      holdR: wk > .9 && t < wt ? (x, y, u) => P('prop_scroll', x, y + u, u * 4, { sway: .02, snd: false, tint: [255, 230, 170] }) : null });
    person(840, 1840, 30, VICTOR, { mood: t > ws + 1 ? 'joy' : 'surprised', look: -1, key: 'vic', aL: t > wt - .2 ? .3 : -1.2 });
    tally(t, 130, 800, 10, Array.from({ length: 10 }, (_, i) => wt + .05 + i * .07), 92);
    camEnd();
  }
  function shFoundation(t, lt) { // the real sign goes up; the family stands in front; the cloud in Victor's head was first
    const t0 = t - lt, wi = WT('foundation', 'imagination');
    camBegin(540, 1000, 1.0); mainStreet(t, t0, { still: true }); building(t, t0, { in: null });
    sign(BLD[0], 1120, 620, 1, .9 * ease(seg(t, t0, t0 + .6))); cue('realsign', t0 + .1, 'chime', 560, 400);
    person(300, 1850, 26, C.neville, { in: stagger(t0, 1), mood: 'happy', look: .4, key: 'nev' }); person(560, 1850, 30, VICTOR, { in: stagger(t0, 2), mood: 'beam', key: 'vic' });
    person(820, 1850, 26, C.paul, { in: stagger(t0, 3), mood: 'wise', look: -.4, key: 'dad' });
    if (t > wi - .2) { P('island_cloud', 760, 1180, 260, { in: wi - .2, snd: 'pop' }); sign(760, 1170, 200, .9); }
    camEnd();
  }
  function shGuts(t, lt) {       // nothing outside: everything peels away; he imagines anyway
    const t0 = t - lt, wn = WT('guts', 'nothing'), wg = WT('guts', 'guts'), wb = WT('guts', 'believe'), lit = ease(seg(t, wg - .2, wg + .6));
    camBegin(540, 1000, 1.0); board('night'); if (lit > 0) glow(540, 1300, 600, '#FFD27A', lit * .8);
    P('city_rowhouses', 200, 1380, 380, { out: wn }); P('city_streetlamp', 900, 1560, 520, { out: wn + .1 });
    person(540, 1840, 32, VICTOR, { mood: t > wg - .2 ? 'determined' : 'sad', look: 0, lookY: t > wb ? -.6 : 0, key: 'vic' });
    if (t > wb - .2) { P('island_cloud', 540, 1060, 330, { in: wb - .2, snd: 'pop' }); sign(540, 1050, 260, 1); }
    camEnd();
  }
  function shMillions(t, lt) {   // money rains on the family business
    const t0 = t - lt, wt = WT('millions', 'thirty'), rain = t > wt - .3;
    camBegin(540, 1000, 1.0); mainStreet(t, t0, { still: true }); building(t, t0, { in: null }); sign(BLD[0], 1120, 620, 1, .5);
    if (rain) { for (let i = 0; i < 7; i++) { const ti = wt - .3 + i * .18; if (t > ti) P('prop_money', 120 + i * 140, lerp(300, 1650 - (i % 3) * 40, ease(seg(t, ti, ti + .8))), 140, { rot: (i % 2 ? .3 : -.3), sway: .05, snd: false }); } cue('cash4', wt, 'cash', 540, 400); }
    person(560, 1850, 30, VICTOR, { mood: rain ? 'joy' : 'happy', key: 'vic', aL: rain ? .6 : -1.2, aR: rain ? .6 : -1.2 });
    camEnd();
  }
  function shLesson(t, lt) {     // the building as it was (grey) and as it would be (with the sign), until it was
    const t0 = t - lt, wu = WT('lesson', 'until'), done = ease(seg(t, wu - .1, wu + .7)), g = lerp(150, 255, done);
    camBegin(540, 1000, 1.0); board('day');
    building(t, t0, { in: null, tint: [g, g, g] });
    sign(BLD[0], 1120, 620, .4 + .6 * done, .9 * done); if (done > 0) cue('until', wu, 'chime', 560, 400);
    person(870, 1840, 28, VICTOR, { mood: done > .5 ? 'beam' : 'determined', look: -1, lookY: -.4, key: 'vic' });
    camEnd();
  }
  function shClose(t, lt) {      // Emery on his way to work: what are you calling? a cloud over his head
    const t0 = t - lt, wc = WT('close', 'calling');
    camBegin(540, 1000, 1.0); mainStreet(t, t0, { still: true });
    if (t > wc - .2) { P('island_cloud', 640, 880, 300, { in: wc - .2, snd: 'pop' }); P('bible_star', 640, 840, 120, { in: wc, snd: false, sway: .05 }); }
    host(t, 540, 1830, 38, { in: t0 + .05, mood: 'warm', look: 0, aR: t > wc ? .3 : -1.2 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'change'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .1, shVerse], [S('meaning') - .1, shMeaning], [S('victor') - .15, shVictor], [S('dream') - .1, shDream], [S('twice') - .15, shTwice],
    [S('years') - .1, shYears], [S('stranger') - .15, shStranger], [S('foundation') - .1, shFoundation], [S('guts') - .15, shGuts], [S('millions') - .1, shMillions],
    [S('lesson') - .15, shLesson], [S('close') - .1, shClose], [S('cta') - .1, shCta], [S('comment') - .1, shComment],
  ]);
})();
