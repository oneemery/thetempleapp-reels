window.CHEAP = true; window.FELT = true;
// Episode 32, flannelgraph cut: "Paid in Full" (E.C.A. pays the painter first) built from the felt cutout kit (kit/cutouts) on felt boards.
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






























  const ECA = { ...C.dreamer, name: 'eca', coat: '#5E6B3A', sleeve: '#5E6B3A', stripes: null, hair: '#B8B2A8', skin: '#EFCBA6', torso: 7.2, leg: 4.4, w: 4.8 };
  const PAINTER = { ...C.blake, name: 'painter', coat: '#F3EBDC', sleeve: '#F3EBDC', lapel: '#C9963A', pants: '#F3EBDC', hat: 'fedora', hatCol: '#F3EBDC', band: '#B8463A' };
  const BRO = { ...C.blake, name: 'bro', coat: '#3A3A44', sleeve: '#3A3A44', hat: 'fedora', hatCol: '#22222A', band: '#8C7A68' };
  const LADY = { ...C.dreamer, name: 'lady', coat: '#2E3A52', sleeve: '#2E3A52', stripes: null, hair: '#ECE8DF', skin: '#EFCBA6' };
  const HAG = { ...C.paul, name: 'haggai', coat: '#7A4E3A', sleeve: '#7A4E3A', pants: '#7A4E3A', sash: '#E6B82A', hair: '#9A958C', hairStyle: 'neat', beard: .6, beardCol: '#9A958C' };
  const SIGNS = {};
  function sign(x, y, w, txt, col = '#2F7A4A', a = 1) {
    if (window.CUEMODE || a <= 0) return; const key = txt + col;
    if (!SIGNS[key]) { const g = createGraphics(700, 220); g.pixelDensity(1); const c = g.drawingContext;
      c.fillStyle = '#3A2A22'; c.beginPath(); c.roundRect(14, 20, 672, 190, 24); c.fill(); c.fillStyle = '#F6F0E2'; c.beginPath(); c.roundRect(4, 6, 672, 190, 24); c.fill();
      c.fillStyle = col; c.beginPath(); c.roundRect(20, 22, 640, 158, 16); c.fill();
      c.fillStyle = '#F6F0E2'; c.font = 'bold 84px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 340, 104); SIGNS[key] = g; }
    flushBrush(); tint(255, 255 * a); image(SIGNS[key], x - w / 2, y - w * 110 / 700, w, w * 220 / 700); noTint();
  }
  const OLD = [165, 155, 145];
  function house(x, by, s, t, tin, fresh = 0) { P('life_house', x, by, s, { in: tin, tint: fresh >= 1 ? null : [lerp(OLD[0], 255, fresh), lerp(OLD[1], 255, fresh), lerp(OLD[2], 255, fresh)] }); if (fresh > .5) glow(x, by - s * .4, s * .6, '#FFE2A8', .3 * fresh); }
  function dream(x, y, s, t, tin, inner) { if (t < tin) return; P('island_cloud', x, y, s, { in: tin, snd: 'pop', sway: .02 }); if (t > tin + .1) inner(x, y, s); }

  // ---------- shots ----------
  function shHook(t, lt) {   // couldn't afford paint; paid the painter in imagination; two weeks later, $7,000
    const t0 = t - lt, wc = WT('hook', 'check'), ws = WT('hook', 'seven');
    camBegin(540, 1000, 1.0); board('day'); house(700, 1560, 500, t, t0 + .05, ease(seg(t, wc - .2, wc + .8)));
    if (t > wc - .2 && t < ws - .2) sign(540, 1080, 340, 'PAID IN FULL', '#2F7A4A', ease(seg(t, wc - .2, wc + .1)));
    if (t > ws - .2) { sign(540, 1080, 340, '$7,000', '#C9963A', ease(seg(t, ws - .2, ws + .2))); glow(540, 1080, 260, '#FFD27A', .6); cue('seven', ws, 'sparkle', 540, 300); }
    person(260, 1860, 28, ECA, { in: t0 + .05, mood: t > ws ? 'joy' : t > wc ? 'beam' : 'sad', look: 1, key: 'eca' });
    camEnd();
  }
  function shVerse(t, lt) {      // Haggai: the glory of this latter house greater than of the former
    const t0 = t - lt, wg = WT('verse', 'glory'), wl = WT('verse', 'latter');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, wg - .2, wg + .6)));
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (t > wl - .2) P('bible_temple', 790, 1300, 300, { in: wl - .2, snd: 'chime' });
    person(420, 1840, 40, HAG, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'hag', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // an old house; a greater glory
    const t0 = t - lt, wg = WT('meaning', 'glory');
    camBegin(540, 1000, 1.0); board('plum'); house(780, 1560, 380, t, t0 + .1, ease(seg(t, wg - .3, wg + .5)));
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shHouse(t, lt) {      // old but hers; paint outside, decorating inside; no money
    const t0 = t - lt, wh = WT('house', 'hers'), wm = WT('house', 'money');
    camBegin(540, 1000, 1.0); board('day'); house(700, 1560, 520, t, t0 + .05, 0);
    if (t > wh - .1) glow(700, 1300, 260, '#FFE2A8', .3);
    if (t > wm - .2) P('sky_raincloud', 300, 1060, 200, { in: wm - .2, sway: .03, snd: 'pop' });
    person(280, 1860, 28, ECA, { in: t0 + .05, mood: t > wm ? 'sad' : 'warm', look: 1, key: 'eca' });
    camEnd();
  }
  function shTold(t, lt) {       // live as if it was already done
    const t0 = t - lt, wd = WT('told', 'done');
    camBegin(540, 1000, 1.0); board('plum'); person(760, 1840, 30, C.neville, { in: t0 + .05, mood: 'warm', look: -1, key: 'nev', talk: talk(t), aL: .4 });
    if (t > wd - .2) { glow(540, 1300, 300, '#FFD27A', .5); cue('done', wd, 'chime', 540, 300); }
    person(300, 1860, 28, ECA, { in: t0 + .1, mood: t > wd ? 'hopeful' : 'neutral', look: 1, key: 'eca' });
    camEnd();
  }
  function shImagine(t, lt) {    // fresh rooms; the new paint outside; a check to the contractor, paid in full
    const t0 = t - lt, wr = WT('imagine', 'rooms'), wo = WT('imagine', 'outside'), wc = WT('imagine', 'check');
    camBegin(540, 1000, 1.0);
    if (t < wo - .3) { board('plum'); glow(540, 1300, 560, '#FFE2A8', .5); P('room_painting', 300, 1100, 220, { in: t0 + .1 }); P('room_lamp', 860, 1520, 360, { in: t0 + .2 }); P('room_armchair', 600, 1820, 440, { in: t0 + .3 }); P('room_rug', 540, 1900, 600, { in: t0 + .35, sway: 0 });
      person(320, 1860, 26, ECA, { in: t0 + .1, mood: 'beam', look: 1, key: 'eca' }); }
    else { board('day'); house(720, 1560, 520, t, wo - .3, 1);
      if (t > wc - .4) { person(860, 1860, 26, PAINTER, { in: wc - .4, mood: 'beam', look: -1, key: 'painter' }); sign(560, 1120, 320, 'PAID IN FULL', '#2F7A4A', ease(seg(t, wc - .2, wc + .1))); }
      person(320, 1860, 28, ECA, { in: wo - .3, mood: 'beam', look: 1, lookY: -.3, key: 'eca2', aR: t > wc ? .5 : -1.2 }); }
    camEnd();
  }
  function shOften(t, lt) {      // as often as she could by day, and every night before sleep
    const t0 = t - lt, wd = WT('often', 'day'), wn = WT('often', 'night');
    camBegin(540, 1000, 1.0); board(t > wn - .2 ? 'night' : 'day');
    if (t > wn - .2) P('island_moon', 820, 820, 120, { in: wn - .2, snd: 'chime' }); else P('island_sun', 820, 820, 150, { in: wd - .2 });
    dream(540, 1350, 460, t, t0 + .1, (x, y, s) => P('life_house', x, y - s * .02, s * .45, { in: t0 + .2, snd: false }));
    person(320, 1860, 26, ECA, { in: t0 + .05, mood: 'happy', look: .5, lookY: -.3, key: 'eca' });
    camEnd();
  }
  function shLetter(t, lt) {     // two weeks later: a registered letter from Lloyd's of London; $7,000 from a woman she never met
    const t0 = t - lt, wl = WT('letter', "lloyd's"), wi = WT('letter', 'inherited'), wn = WT('letter', 'never');
    camBegin(540, 1000, 1.0); board('plum');
    P('prop_envelope', 540, 1300, 300, { in: t0 + .2, snd: 'pop', sway: .03 }); if (t > wl - .2) sign(540, 1020, 320, "LLOYD'S", '#2E3A52', ease(seg(t, wl - .2, wl + .1)));
    if (t > wi - .2) { sign(540, 1500, 400, '$7,000', '#C9963A', ease(seg(t, wi - .2, wi + .2))); glow(540, 1400, 300, '#FFD27A', .6); cue('inh', wi, 'sparkle', 540, 300); }
    if (t > wn - .2) { P('island_cloud', 860, 1150, 220, { in: wn - .2, tint: [200, 200, 210], snd: 'pop' }); person(860, 1110, 7, LADY, { in: wn - .1, mood: 'warm', key: 'lc', snd: false }); }
    person(260, 1860, 28, ECA, { in: t0 + .05, mood: t > wi ? 'surprised' : 'neutral', look: 1, key: 'eca' });
    camEnd();
  }
  function shWho(t, lt) {        // forty years before she knew the brother; a small favor fifteen years ago; never heard again
    const t0 = t - lt, wb = WT('who', 'brother'), wf = WT('who', 'favor'), wn = WT('who', 'never');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wb - .3) { P('island_cloud', 340, 1200, 300, { in: wb - .3, tint: [200, 200, 210], snd: 'pop' }); person(340, 1150, 9, BRO, { in: wb - .2, mood: 'warm', key: 'bc', snd: false }); }
    if (t > wf - .3) { P('island_cloud', 760, 1200, 300, { in: wf - .3, tint: [200, 200, 210], snd: 'pop' }); P('prop_envelope', 720, 1140, 70, { in: wf - .2, snd: false }); person(800, 1150, 8, LADY, { in: wf - .1, mood: 'warm', key: 'lc2', snd: false }); }
    if (t > wn) glow(760, 1150, 220, '#B8C0CC', .3);
    person(540, 1860, 28, ECA, { in: t0 + .05, mood: 'neutral', look: 0, lookY: -.4, key: 'eca' });
    camEnd();
  }
  function shEnough(t, lt) {     // until now: $7,000; more than enough for the house, and more
    const t0 = t - lt, ws = WT('enough', 'seven'), wh = WT('enough', 'house');
    camBegin(540, 1000, 1.0); board('day'); house(700, 1560, 520, t, t0 + .05, ease(seg(t, wh - .3, wh + .8)));
    if (t > ws - .2) { sign(540, 980, 400, '$7,000', '#C9963A', ease(seg(t, ws - .2, ws + .2))); glow(540, 1050, 260, '#FFD27A', .5); }
    person(280, 1860, 28, ECA, { in: t0 + .05, mood: 'joy', look: 1, key: 'eca', aL: t > wh ? .7 : -1.2, aR: t > wh ? .7 : -1.2 });
    camEnd();
  }
  function shLesson(t, lt) {     // she paid in imagination first; the money had to catch up
    const t0 = t - lt, wf = WT('lesson', 'first'), wc = WT('lesson', 'catch');
    camBegin(540, 1000, 1.0); board('plum');
    dream(540, 1250, 460, t, t0 + .05, (x, y, s) => sign(x, y - s * .3, s * .8, 'PAID IN FULL', '#2F7A4A'));
    if (t > wc - .3) { for (let i = 0; i < 4; i++) { const k = ((t - wc) * .6 + i * .25) % 1; P('life_coinbag', lerp(-80, 540, ease(k)), 1800, 110, { in: wc - .3 + i * .1, sway: 0, snd: false }); } }
    if (t > wf) glow(540, 1150, 300, '#FFD27A', .5);
    camEnd();
  }
  function shClose(t, lt) {      // what bill would you pay today, in your mind, in full?
    const t0 = t - lt, wf = WT('close', 'full');
    camBegin(540, 1000, 1.0); board('plum'); if (t > wf - .3) { P('island_cloud', 780, 1200, 320, { in: wf - .3, snd: 'pop' }); sign(780, 1060, 260, 'PAID', '#2F7A4A', ease(seg(t, wf - .2, wf + .2))); }
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'done'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('house') - .12, shHouse], [S('told') - .12, shTold], [S('imagine') - .12, shImagine], [S('often') - .12, shOften], [S('letter') - .12, shLetter], [S('who') - .12, shWho], [S('enough') - .12, shEnough], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
