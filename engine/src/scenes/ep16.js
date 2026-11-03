window.CHEAP = true; window.FELT = true;
// Episode 16, flannelgraph cut: "The Producer" (the costume designer) built from the felt cutout kit (kit/cutouts) on felt boards.
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














  const DES = { ...C.dreamer, name: 'designer', coat: '#7A4E8A', sleeve: '#E6B82A', stripes: null, hair: '#2B1E19', skin: '#E6B48C', torso: 7.2, leg: 4.6, w: 4.4 };
  const PROD = { ...C.blake, name: 'producer', coat: '#22222A', sleeve: '#22222A', lapel: '#F3EBDC', pants: '#22222A', hat: 'fedora', hatCol: '#22222A', band: '#8C3B3B', hair: '#8C7A68' };
  const storm = (x, y, s, t, tin, tout) => { if (t > tin) P('sky_raincloud', x, y, s, { in: tin, out: tout, sway: .03, snd: 'pop' }); };
  const sketch = (x, y, u, tintc) => P('prop_scroll', x, y + u, u * 4.4, { sway: .02, snd: false, tint: tintc });
  function stage(t, t0, o = {}) { board('plum'); glow(540, 1150, 560, '#FFD27A', .35); const e = i => o.still ? null : stagger(t0, i);
    P('prop_candle', 140, 1700, 260, { in: e(0) }); P('prop_candle', 940, 1700, 260, { in: e(1) }); P('room_painting', 540, 1000, 240, { in: e(2) }); }
  function street(t, t0, o = {}) { board('day'); P('city_rowhouses', 200, 1400, 420, { in: o.still ? null : stagger(t0, 0) }); P('city_streetlamp', 980, 1560, 520, { in: o.still ? null : stagger(t0, 1) }); }

  // ---------- shots ----------
  function shHook(t, lt) {   // walking to work under a rain cloud, telling her boss off; far away, he hears nothing
    const t0 = t - lt, wn = WT('hook', 'never'), walk = ease(seg(t, t0, t0 + 3));
    camBegin(540, 1000, 1.0); street(t, t0); storm(lerp(200, 460, walk), 1150, 260, t, t0 + .3);
    person(lerp(200, 460, walk), 1860, 30, DES, { mood: 'determined', look: 1, key: 'des', talk: talk(t), aR: .2 + .3 * Math.abs(Math.sin(t * 5)) });
    if (t > wn - .3) person(880, 1860, 20, PROD, { in: wn - .3, mood: 'neutral', look: 0, key: 'prod' });
    camEnd();
  }
  function shVerse(t, lt) {      // Paul: whatsoever things are lovely... think on these things (flowers, then a star)
    const t0 = t - lt, wl = WT('verse', 'lovely'), wp = WT('verse', 'praise'), wt = WT('verse', 'think');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .4 + .4 * ease(seg(t, wt - .2, wt + .5)));
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (t > wl - .2) P('life_flowers', 820, 1740, 260, { in: wl - .2, snd: 'pop' }); if (t > wp - .2) P('bible_star', 760, 760, 220, { in: wp - .2, snd: 'chime', sway: .04 });
    person(420, 1840, 40, C.paul, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'paul', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // not on what he did yesterday: the rain cloud peels away
    const t0 = t - lt, wy = WT('meaning', 'yesterday');
    camBegin(540, 1000, 1.0); board('plum'); P('life_flowers', 800, 1740, 240, { in: t0 + .1 }); storm(540, 1060, 240, t, wy - .4, wy + .3);
    host(t, 540, 1830, 38, { in: t0 + .02, mood: t > wy + .3 ? 'warm' : 'neutral', look: 0 });
    camEnd();
  }
  function shDesigner(t, lt) {   // a costume designer and her sketches; the producer
    const t0 = t - lt, wp = WT('designer', 'producer');
    camBegin(540, 1000, 1.0); stage(t, t0);
    for (let i = 0; i < 3; i++) P('prop_scroll', 400 + i * 140, 1300, 160, { in: stagger(t0, 3 + i), rot: (i - 1) * .2, tint: [[255, 220, 220], [220, 230, 255], [255, 240, 200]][i] });
    person(260, 1860, 30, DES, { in: stagger(t0, 6), mood: 'happy', look: 1, key: 'des', hold: (x, y, u) => P('prop_quill', x, y + u, u * 4, { sway: .02, snd: false }) });
    if (t > wp - .3) person(820, 1860, 32, PROD, { in: wp - .3, mood: 'skeptical', look: -1, key: 'prod' });
    camEnd();
  }
  function shProducer(t, lt) {   // he rejects her best work: the sketch goes grey and drops
    const t0 = t - lt, wr = WT('producer', 'rejected'), wu = WT('producer', 'unfair'), drop = easeIn(seg(t, wr - .1, wr + .5));
    camBegin(540, 1000, 1.0); stage(t, t0, { still: true });
    person(820, 1860, 32, PROD, { mood: 'determined', look: -1, key: 'prod', aL: t < wr ? .3 : -1.2 });
    P('prop_scroll', lerp(700, 620, drop), lerp(1400, 1880, drop), 180, { rot: drop * 1.4, tint: t > wr ? [150, 150, 150] : null, sway: 0, snd: false }); if (t > wr) cue('reject', wr, 'door', 620, 300);
    person(280, 1860, 30, DES, { mood: t > wu ? 'sad' : 'worried', look: 1, key: 'des' });
    camEnd();
  }
  function shArgue(t, lt) {      // every morning on the way to the theatre: the argument in her head
    const t0 = t - lt, wh = WT('argue', 'head'), wf = WT('argue', 'face');
    camBegin(540, 1000, 1.0); street(t, t0, { still: true }); storm(500, 1060, 320, t, wh - .3);
    if (t > wh - .3) { P('island_cloud', 760, 900, 240, { in: wh - .1, snd: false }); person(760, 940, 7, PROD, { in: wh, mood: 'surprised', key: 'pc', snd: false }); }
    person(440, 1860, 30, DES, { mood: 'determined', look: 1, key: 'des', talk: talk(t), aR: .3 + .3 * Math.sin(t * 7) });
    camEnd();
  }
  function shNeville(t, lt) {    // Neville: people only echo what we whisper to them in secret (an echo ripples back)
    const t0 = t - lt, ww = WT('neville', 'whisper'), we = WT('neville', 'echo');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1200, 500, '#FFD27A', .35);
    person(300, 1840, 32, C.neville, { in: stagger(t0, 0), mood: 'warm', look: 1, key: 'nev', talk: talk(t), aR: .4 });
    person(780, 1840, 30, DES, { in: stagger(t0, 1), mood: t > we ? 'surprised' : 'neutral', look: -1, key: 'des' });
    if (t > we - .2) { for (let i = 0; i < 3; i++) { const k = seg(t, we + i * .25, we + i * .25 + 1); if (k > 0 && k < 1) glow(540, 1200, 100 + 400 * k, '#C8D8FF', .5 * (1 - k)); } cue('echo', we, 'chime', 540, 300); }
    camEnd();
  }
  function shImagine(t, lt) {    // something new: before sleep, on the way, during the day; he congratulates her
    const t0 = t - lt, wc = WT('imagine', 'congratulating'), wd = WT('imagine', 'designs');
    camBegin(540, 1000, 1.0); board('night'); P('island_moon', 930, 760, 140, { in: t0 + .1 });
    person(300, 1860, 30, DES, { in: t0 + .1, mood: 'hopeful', look: .4, lookY: -.4, key: 'des' });
    if (t > wc - .3) { P('island_cloud', 700, 1100, 460, { in: wc - .3, snd: 'pop' }); person(640, 1180, 12, PROD, { in: wc - .1, mood: 'beam', look: 1, key: 'pc', snd: false, aL: .6 + .3 * Math.sin(t * 10), aR: .6 + .3 * Math.sin(t * 10 + 1) }); }
    if (t > wd - .2) { P('prop_scroll', 780, 1120, 90, { in: wd - .2, tint: [255, 214, 120], snd: 'sparkle' }); glow(760, 1080, 200, '#FFD27A', .6); }
    camEnd();
  }
  function shThanks(t, lt) {     // and she thanks him for his praise and kindness
    const t0 = t - lt, wt = WT('thanks', 'thanking'), wk = WT('thanks', 'kindness');
    camBegin(540, 1000, 1.0); board('night');
    P('island_cloud', 540, 1300, 640, { in: t0 + .05, snd: false });
    person(430, 1380, 16, DES, { in: t0 + .1, mood: 'beam', look: 1, key: 'dc', snd: false, aR: t > wt ? .4 : -1.2 }); person(650, 1380, 17, PROD, { in: t0 + .15, mood: 'warm', look: -1, key: 'pc', snd: false });
    if (t > wk - .2) { glow(540, 1250, 300, '#FFD27A', .7); cue('kind', wk, 'chime', 540, 300); }
    camEnd();
  }
  function shChanged(t, lt) {    // and his behavior toward her changed: a warm handshake, a gold sketch
    const t0 = t - lt, wc = WT('changed', 'changed');
    camBegin(540, 1000, 1.0); stage(t, t0, { still: true }); if (t > wc - .2) glow(540, 1400, 420, '#FFD27A', .7);
    person(760, 1860, 32, PROD, { in: t0 + .05, mood: t > wc ? 'beam' : 'neutral', look: -1, key: 'prod', aL: t > wc - .2 ? .5 : -1.2, hold: t > wc - .2 ? (x, y, u) => sketch(x, y, u, [255, 214, 120]) : null });
    person(320, 1860, 30, DES, { in: t0 + .1, mood: t > wc ? 'joy' : 'neutral', look: 1, key: 'des' });
    if (t > wc) cue('changed', wc, 'sparkle', 540, 300);
    camEnd();
  }
  function shLesson(t, lt) {     // stop rehearsing the fight (the storm peels); rehearse the compliment (the star)
    const t0 = t - lt, wf = WT('lesson', 'fight'), wc = WT('lesson', 'compliment');
    camBegin(540, 1000, 1.0); board('plum'); storm(320, 1000, 260, t, t0 + .05, wf + .3);
    if (t > wc - .3) { P('bible_star', 760, 1000, 260, { in: wc - .3, snd: 'chime', sway: .04 }); glow(760, 980, 300, '#FFD27A', .7); }
    person(540, 1840, 32, DES, { in: t0 + .05, mood: t > wc ? 'beam' : 'determined', look: t > wc ? .6 : -.6, key: 'des' });
    camEnd();
  }
  function shClose(t, lt) {      // what are you rehearsing on your way to work?
    const t0 = t - lt, ww = WT('close', 'work');
    camBegin(540, 1000, 1.0); board('day'); P('city_rowhouses', 200, 1400, 420, { in: t0 + .05 }); storm(540, 1060, 240, t, WT('close', 'rehearsing') - .2);
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0, aR: t > ww - .2 ? .3 : -1.2 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'rehearsing'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('designer') - .12, shDesigner], [S('producer') - .12, shProducer], [S('argue') - .12, shArgue], [S('neville') - .12, shNeville], [S('imagine') - .12, shImagine], [S('thanks') - .12, shThanks], [S('changed') - .12, shChanged], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
