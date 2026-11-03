window.CHEAP = true; window.FELT = true;
// Episode 34, flannelgraph cut: "The Kitchen" (J.S. and her brother) built from the felt cutout kit (kit/cutouts) on felt boards.
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
































  const JS = { ...C.dreamer, name: 'js', coat: '#7A4E8A', sleeve: '#7A4E8A', stripes: null, hair: '#5A3A24', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const BRO = { ...C.blake, name: 'bro', coat: '#8C5A3C', sleeve: '#8C5A3C', lapel: '#F3EBDC', pants: '#3A3A44', hat: null, hair: '#3B2A22', skin: '#EFCBA6' };
  const SIL = { ...C.dreamer, name: 'sil', coat: '#3F8F8A', sleeve: '#3F8F8A', stripes: null, hair: '#E6B82A', skin: '#EFCBA6' };
  const DOC = { ...C.skeptic, name: 'doc', coat: '#F3EBDC', sleeve: '#F3EBDC', lapel: '#D9D4C8', tie: '#3F6FB0', hat: null };
  const PSALM = { ...C.paul, name: 'psalmist', coat: '#7A4E8A', sleeve: '#7A4E8A', pants: '#7A4E8A', sash: '#E6B82A', hair: '#B5643A', hairStyle: 'curls', beard: .4, beardCol: '#B5643A', skin: '#E6B48C' };
  const BX = 540, BBY = 1760, BH = 600;
  function hospBed(t, t0, o = {}) {
    board('plum'); glow(540, 1300, 520, '#F3F6FA', .25); P('room_window', 880, 1240, 300, { in: o.still ? null : stagger(t0, 0) });
    P('room_bed', BX, BBY, BH, { in: o.still ? null : stagger(t0, 1), sway: .002, tint: [235, 240, 248] }); const tin = o.still ? -9 : stagger(t0, 2);
    person(BX, BBY - BH * .44, 11, BRO, { in: o.still ? null : tin, mood: o.mood || 'sad', key: 'brobed', snd: false, aL: -1.2, aR: o.hand ? .2 : -1.2 });
    if (T > tin + .4) piecePart('room_bed', BX, BBY, BH, .43, 1);
  }
  function planks(x, y, t, a = 1) { if (window.CUEMODE || a <= 0) return; flushBrush(); push(); noStroke(); for (let i = 0; i < 3; i++) { fill(30, 18, 12, 70 * a); rect(x - 120 + 6, y + i * 34 + 6, 240, 24, 6); fill(196, 140, 84, 255 * a); rect(x - 120, y + i * 34, 240, 24, 6); } pop(); }
  function kitchen(t, t0, o = {}) { board('day'); glow(540, 1300, 520, '#FFE2A8', .3); const e = i => o.still ? null : stagger(t0, i);
    P('room_window', 760, 1100, 320, { in: e(0) }); P('room_desk', 760, 1720, 420, { in: e(1) }); P('room_chair', 300, 1840, 320, { in: e(2) }); if (T > (o.still ? -9 : e(3))) planks(760, 1440, t); }
  function worker(t, x, u, key, o = {}) { const sw = Math.sin(t * 6); person(x, 1860, u, BRO, { mood: 'beam', look: 1, key, aR: .3 + .5 * Math.max(0, sw), ...o }); }

  // ---------- shots ----------
  function shHook(t, lt) {   // a fourth major operation, little hope; she imagines him remodeling; no operation necessary
    const t0 = t - lt, wk = WT('hook', 'kitchen'), wn = WT('hook', 'necessary');
    camBegin(540, 1050, 1.0);
    if (t < wk - .3) { hospBed(t, t0); P('sky_raincloud', 540, 1000, 200, { in: t0 + .3, sway: .03, snd: 'pop' }); }
    else { kitchen(t, wk - .3); worker(t, 560, 30, 'bk'); if (t > wn - .2) { glow(540, 1400, 480, '#FFD27A', .5); cue('nec', wn, 'sparkle', 540, 300); } }
    camEnd();
  }
  function shVerse(t, lt) {      // I shall not die, but live
    const t0 = t - lt, wl = WT('verse', 'live');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, wl - .2, wl + .6)));
    P('bible_harp', 820, 1640, 300, { in: stagger(t0, 0) }); if (t > wl - .2) P('life_flowers', 800, 1250, 200, { in: wl - .2, snd: 'pop' });
    person(420, 1840, 40, PSALM, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'psalm', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // picture the life, not the illness
    const t0 = t - lt, wl = WT('meaning', 'life');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wl - .3) { P('island_cloud', 780, 1200, 340, { in: wl - .3, snd: 'pop' }); person(780, 1130, 9, BRO, { in: wl - .2, mood: 'beam', key: 'bc', snd: false, aR: .5 }); }
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shHospital(t, lt) {   // in hospital, in pain, a fourth operation; little hope
    const t0 = t - lt, wf = WT('hospital', 'fourth'), wh = WT('hospital', 'hope');
    camBegin(540, 1050, 1.04); hospBed(t, t0);
    if (t > wf - .3) tally(t, 330, 760, 4, [wf - .3, wf - .15, wf, wf + .15], 140);
    if (t > wh - .2) P('sky_raincloud', 540, 1040, 200, { in: wh - .2, sway: .03, snd: 'pop' });
    camEnd();
  }
  function shAsked(t, lt) {      // at home she asks what he really wants: to finish remodeling his kitchen
    const t0 = t - lt, wf = WT('asked', 'felt'), wk = WT('asked', 'kitchen');
    camBegin(540, 1000, 1.0); board('plum'); P('room_lamp', 160, 1500, 340, { in: t0 + .05 });
    if (t > wk - .3) { P('island_cloud', 700, 1250, 420, { in: wk - .3, snd: 'pop' }); P('room_desk', 700, 1180, 120, { in: wk - .2, snd: false }); person(640, 1180, 8, BRO, { in: wk - .1, mood: 'beam', key: 'bc2', snd: false }); }
    person(360, 1860, 30, JS, { in: t0 + .05, mood: t > wf ? 'hopeful' : 'worried', look: .5, lookY: t > wk ? -.3 : 0, key: 'js' });
    camEnd();
  }
  function shKitchen(t, lt) {    // she pictures him busy in that kitchen; she grips the back of a kitchen chair
    const t0 = t - lt, wg = WT('kitchen', 'gripping');
    camBegin(540, 1000, 1.0); kitchen(t, t0); worker(t, 640, 30, 'bk');
    if (t > wg - .3) { person(330, 1860, 28, JS, { in: wg - .3, mood: 'happy', look: 1, key: 'js', aR: .1 }); glow(300, 1660, 160, '#FFD27A', .4); }
    camEnd();
  }
  function shBedside(t, lt) {    // suddenly beside his bed; his strong hand clasps hers: I knew you would come, Jo
    const t0 = t - lt, wh = WT('bedside', 'hand'), wk = WT('bedside', 'knew');
    camBegin(540, 1050, 1.04); hospBed(t, t0, { still: false, mood: t > wk ? 'warm' : 'neutral', hand: t > wh - .2 });
    person(200, 1860, 26, JS, { in: t0 + .1, mood: t > wk ? 'beam' : 'surprised', look: 1, key: 'js', aR: t > wh - .2 ? .2 : -1.2 });
    if (t > wh) glow(330, 1500, 160, '#FFD27A', .5);
    camEnd();
  }
  function shRemember(t, lt) {      // all is better now; a voice: remember this moment; back home
    const t0 = t - lt, wr = WT('remember', 'remember'), wh = WT('remember', 'home');
    camBegin(540, 1050, 1.04);
    if (t < wh - .3) { hospBed(t, t0, { still: true, mood: 'warm', hand: true }); person(200, 1860, 26, JS, { mood: 'warm', look: 1, key: 'js', aR: .2 }); if (t > wr - .2) { glow(540, 900, 300, '#FFFFFF', .5); cue('rem', wr, 'chime', 540, 300); } }
    else { board('plum'); P('room_lamp', 160, 1500, 340, { in: wh - .3 }); person(420, 1860, 30, JS, { in: wh - .2, mood: 'hopeful', look: .3, key: 'jsh' }); }
    camEnd();
  }
  function shCall(t, lt) {       // his wife calls: the doctor can't explain it; no operation necessary
    const t0 = t - lt, wc = WT('call', 'called'), wd = WT('call', 'doctor'), wn = WT('call', 'necessary');
    camBegin(540, 1000, 1.0); board('plum'); P('room_lamp', 160, 1500, 340, { in: -9 });
    person(320, 1860, 30, JS, { in: t0 + .05, mood: t > wn ? 'joy' : 'surprised', look: 1, key: 'js', hold: (x, y, u) => P('prop_telephone', x, y + u, u * 2.6, { sway: .02, snd: false }) });
    if (t > wc - .3) { P('island_cloud', 760, 1250, 420, { in: wc - .3, snd: 'pop' }); person(700, 1180, 9, SIL, { in: wc - .2, mood: 'joy', key: 'silc', snd: false, talk: talk(t) }); if (t > wd - .2) person(820, 1180, 9, DOC, { in: wd - .2, mood: 'surprised', key: 'docc', snd: false }); }
    if (t > wn - .1) { glow(540, 1400, 420, '#FFD27A', .5); cue('nec2', wn, 'sparkle', 540, 300); }
    camEnd();
  }
  function shHome(t, lt) {       // released the next day; back to work Monday; well ever since
    const t0 = t - lt, ww = WT('home', 'work'), wl = WT('home', 'well');
    camBegin(540, 1000, 1.0); kitchen(t, t0); worker(t, 640, 30, 'bk2');
    if (t > ww - .2) glow(640, 1500, 300, '#FFD27A', .4); if (t > wl) cue('well', wl, 'sparkle', 640, 300);
    camEnd();
  }
  function shLesson(t, lt) {     // not him in the hospital getting better; him back in his kitchen
    const t0 = t - lt, wk = WT('lesson', 'kitchen');
    camBegin(540, 1050, 1.0);
    if (t < wk - .3) { hospBed(t, t0, { mood: 'neutral' }); P('island_cloud', 540, 1050, 260, { in: t0 + .3, tint: [170, 170, 180], snd: 'pop' }); }
    else { kitchen(t, wk - .3); worker(t, 640, 30, 'bk3'); glow(540, 1300, 420, '#FFD27A', .4); }
    camEnd();
  }
  function shClose(t, lt) {      // who could you see doing what they love, tonight?
    const t0 = t - lt, wl = WT('close', 'love');
    camBegin(540, 1000, 1.0); board('night'); P('island_moon', 820, 820, 110, { in: t0 + .1, snd: false });
    if (t > wl - .3) { P('island_cloud', 780, 1200, 320, { in: wl - .3, snd: 'pop' }); glow(780, 1100, 220, '#FFD27A', .5); }
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'picturing'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('hospital') - .12, shHospital], [S('asked') - .12, shAsked], [S('kitchen') - .12, shKitchen], [S('bedside') - .12, shBedside], [S('remember') - .12, shRemember], [S('call') - .12, shCall], [S('home') - .12, shHome], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
