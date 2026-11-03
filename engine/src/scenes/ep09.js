window.CHEAP = true; window.FELT = true;
// Episode 9, flannelgraph cut: "The Southern Cross" (the girl on the streetcar) built from the felt cutout kit (kit/cutouts) on felt boards.
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







  const GIRL = { ...C.dreamer, name: 'girl', coat: '#3F6FB0', sleeve: '#3F6FB0', stripes: null, hair: '#5A3A24', skin: '#EFCBA6', torso: 7.0, leg: 4.6, w: 4.4 };
  const DAD = { ...C.blake, name: 'dad', coat: '#5A4636', sleeve: '#5A4636', lapel: '#F3EBDC', hair: '#5A4636' };
  const AUNT = { ...C.dreamer, name: 'aunt', coat: '#7A4E8A', sleeve: '#7A4E8A', stripes: null, hair: '#C8C2B8', skin: '#EFCBA6', torso: 7.2, leg: 4.4, w: 4.8 };
  const LAWYER = { ...C.skeptic, name: 'lawyer', coat: '#2E3A52', sleeve: '#2E3A52', hat: null };
  const OFFICER = { ...C.skeptic, name: 'officer', coat: '#F3EBDC', sleeve: '#F3EBDC', lapel: '#D9D4C8', tie: '#22284A', pants: '#F3EBDC', hat: 'cap', hatCol: '#F6F0E2', band: '#22284A', glasses: false };
  const DAVID = { ...C.paul, name: 'david', coat: '#B8463A', sleeve: '#B8463A', pants: '#B8463A', sash: '#C9963A', hair: '#B5643A', hairStyle: 'curls', beard: .2, beardCol: '#B5643A' };
  const CROSS = [[0, -1], [0, 1.1], [-.8, -.1], [.9, .2], [.45, .55]];
  function southernCross(cx, cy, s, t, tin, gap = .25) { CROSS.forEach(([dx, dy], i) => { if (t > tin + i * gap) P('bible_star', cx + dx * s, cy + dy * s, i === 4 ? s * .35 : s * .6, { in: tin + i * gap, snd: i ? false : 'sparkle', sway: .05 }); }); }
  function sea(t, t0, o = {}) { for (let i = 0; i < 5; i++) P('island_waves', 100 + i * 240, (o.y || 1640) + (i % 2) * 16, o.h || 140, { in: o.still ? null : stagger(t0, i, .05), sway: .02, snd: i ? false : o.snd }); }
  function streetcar(t, x, o = {}) { P('life_bus', x, 1700, 520, { sway: .006, snd: false, tint: [235, 215, 160], ...o }); }
  const rain = (t, n = 22) => feltSnow(t * 2.2, n, .8, 61);

  // ---------- shots ----------
  function shHook(t, lt) {   // crying at the front of a streetcar in the rain; on "sea" the waves rise
    const t0 = t - lt, ws = WT('hook', 'sea');
    camBegin(540, 1000, 1.0); board('night'); P('sky_raincloud', 300, 520, 260, { in: t0 + .1 }); P('sky_raincloud', 800, 460, 220, { in: t0 + .2 });
    streetcar(t, 640, { in: t0 + .05 });
    person(300, 1840, 32, GIRL, { in: t0 + .1, mood: t > ws ? 'hopeful' : 'sad', look: .6, key: 'girl', aR: .2 });
    if (t > ws - .2) sea(t, ws - .2, { y: 1900, h: 160, snd: 'whoosh' }); rain(t);
    camEnd();
  }
  function shVerse(t, lt) {      // David with his harp: sow in tears, reap in joy
    const t0 = t - lt, wj = WT('verse', 'joy'), lit = ease(seg(t, wj - .2, wj + .5));
    camBegin(540, 1050, 1.0 + .02 * lt); board('sand'); glow(540, 1300, 520, '#FFE2A8', .35 + .6 * lit);
    P('sky_hill', 300, 1460, 360, { in: stagger(t0, 0), sway: 0 }); if (lit > 0) P('life_flowers', 820, 1720, 260, { in: wj - .1, snd: 'chime' });
    person(480, 1840, 38, DAVID, { in: stagger(t0, 1), mood: t > wj ? 'joy' : 'wise', look: .3, key: 'david', hold: (x, y, u) => P('bible_harp', x, y + u, u * 5, { sway: .02, snd: false }) });
    camEnd();
  }
  function shMeaning(t, lt) {    // the tear becomes a seed: flowers press on
    const t0 = t - lt, ws = WT('meaning', 'seed');
    camBegin(540, 1000, 1.0); board('plum'); P('sky_raincloud', 760, 900, 200, { in: t0 + .1, out: ws - .1 });
    if (t > ws - .2) { P('life_flowers', 760, 1520, 300, { in: ws - .2, snd: 'chime' }); glow(760, 1350, 300, '#FFD27A', .6); }
    host(t, 330, 1820, 38, { in: t0 + .02, mood: t > ws ? 'warm' : 'neutral', aR: t > ws - .2 ? .3 : -1.2, look: .6 });
    camEnd();
  }
  function shFather(t, lt) {     // her father in a cloud peels away; college books peel away; she goes to work
    const t0 = t - lt, wd = WT('father', 'died'), wc = WT('father', 'college'), ww = WT('father', 'work');
    camBegin(540, 1000, 1.0); board('plum');
    P('island_cloud', 760, 1000, 320, { in: t0 + .1, out: wd + .3, snd: 'pop' }); if (t < wd + .6) person(760, 1040, 7, DAD, { in: t0 + .2, mood: 'warm', key: 'dadc', snd: false, out: wd + .2 });
    if (t > wc - .3) P('prop_books', 760, 1500, 220, { in: wc - .3, out: wc + .8 });
    person(330, 1840, 32, GIRL, { in: t0 + .05, mood: t > wd ? 'sad' : 'warm', look: .6, key: 'girl', hold: t > ww - .2 ? (x, y, u) => P('prop_envelope', x, y + u, u * 3, { sway: .02, snd: false }) : null });
    camEnd();
  }
  function shEve(t, lt) {        // rainy Christmas Eve: the streetcar rolls in full of happy holiday chatter
    const t0 = t - lt, roll = ease(seg(t, t0, t0 + 2.4));
    camBegin(540, 1000, 1.0); board('night'); P('city_rowhouses', 200, 1400, 420, { in: stagger(t0, 0) }); P('city_streetlamp', 980, 1560, 520, { in: stagger(t0, 1) });
    P('city_wintertree', 820, 1500, 420, { in: stagger(t0, 2), sway: .02 });
    streetcar(t, lerp(-300, 600, roll)); if (roll > 0 && roll < 1) cue('car', t0, 'car', 540, 2.4);
    rain(t); camEnd();
  }
  function shFront(t, lt) {      // she stands out on the open front so no one sees her cry
    const t0 = t - lt; camBegin(420, 1300, 1.25); board('night'); streetcar(t, 640);
    P('sky_raincloud', 420, 900, 220, { in: t0 + .1 });
    person(300, 1840, 32, GIRL, { mood: 'sad', look: -.8, lookY: .3, key: 'girl', aR: .2 }); rain(t, 26);
    camEnd();
  }
  function shSalt(t, lt) {       // eyes closed, hand on the rail: the salt of the sea in the wind (waves rise around her)
    const t0 = t - lt, ws = WT('salt', 'sea'), wet = ease(seg(t, ws - .3, ws + .8));
    camBegin(420, lerp(1300, 1200, wet), 1.25); board('night'); if (wet > 0) board('day', wet * .5);
    streetcar(t, 640, { a: 1 - .5 * wet });
    person(300, 1840, 32, GIRL, { mood: t > ws ? 'warm' : 'sleepy', key: 'girl', aR: .2 });
    if (t > ws - .3) { sea(t, ws - .3, { y: 1920, h: 180 }); cue('wind', ws - .2, 'whoosh', 420, 600); }
    if (wet < .6) rain(t, 18);
    camEnd();
  }
  function shSamoa(t, lt) {      // not San Diego: the South Pacific, sailing into the Bay of Samoa
    const t0 = t - lt, wsp = WT('samoa', 'pacific'), wb = WT('samoa', 'samoa'), on = ease(seg(t, wsp - .3, wsp + .6));
    camBegin(540, 1000, 1.0); board('night'); if (on > 0) board('warm', on * .4);
    if (t < wsp) streetcar(t, 640, { out: wsp - .3 });
    if (t > wsp - .3) { P('island_palm', 880, 1360, 420, { in: wsp - .3, sway: .03, snd: 'pop' }); P('island_islandhouse', 720, 1380, 260, { in: wsp - .1, snd: false }); P('city_liner', 380, 1520, 380, { in: wsp, snd: false, sway: .01 }); sea(t, wsp, { y: 1620 }); }
    person(t > wsp ? 440 : 300, 1860, 26, GIRL, { mood: t > wb ? 'beam' : 'warm', look: 1, key: 'girl' });
    camEnd();
  }
  function shCross(t, lt, dur) { // she builds the Southern Cross star by star; everything else fades
    const t0 = t - lt, wsc = WT('cross', 'southern'), wf = WT('cross', 'faded');
    camBegin(540, 1000, 1.0); board('night'); P('sky_stars', 220, 500, 200, { in: t0, out: wf - .2 });
    southernCross(560, 760, 170, t, wsc - .2, .22); if (t > wsc) glow(560, 780, 380, '#FFF1C2', .5);
    sea(t, t0, { still: true, y: 1700 });
    person(540, 1860, 30, GIRL, { mood: 'awe', lookY: -.8, key: 'girl' });
    camEnd();
  }
  function shLawyer(t, lt) {     // a lawyer in Chicago writes: three thousand dollars in bonds
    const t0 = t - lt, wl = WT('lawyer', 'wrote'), wt = WT('lawyer', 'thousand');
    camBegin(540, 1000, 1.0); board('sand'); P('room_painting', 300, 600, 220, { in: stagger(t0, 0) }); P('room_clock', 820, 600, 180, { in: stagger(t0, 1) });
    person(720, 1560, 32, LAWYER, { in: stagger(t0, 2), mood: 'neutral', look: -1, key: 'law', aL: t > wl - .2 && t < wl + .6 ? .3 : -1.2 }); P('room_desk', 720, 1760, 420, { in: stagger(t0, 3) });
    if (t > wl && t < wl + 1.1) { const k = seg(t, wl, wl + 1), [x, y] = arcPt([660, 1350], [200, 1500], -260, ease(k)); P('prop_envelope', x, y, 140, { rot: k * 5, sway: 0, snd: false }); cue('mail', wl, 'whoosh', 400, 300); }
    if (t > wt - .2) for (let i = 0; i < 3; i++) P('prop_scroll', 220 + i * 120, 1560, 160, { in: wt - .2 + i * .12, tint: [190, 220, 170], snd: i ? false : 'cash', rot: (i - 1) * .2 });
    camEnd();
  }
  function shAunt(t, lt) {       // the aunt who went to Europe; if she never came back, the bonds go to her niece
    const t0 = t - lt, we = WT('aunt', 'europe'), wn = WT('aunt', 'niece'), wd = WT('aunt', 'died');
    camBegin(540, 1000, 1.0); board('plum');
    P('island_cloud', 640, 1000, 380, { in: t0 + .1, out: wd + .2, snd: 'pop' }); if (t < wd + .4) { person(560, 1060, 9, AUNT, { in: t0 + .2, mood: 'warm', key: 'auntc', snd: false, out: wd }); if (t > we - .2) P('city_liner', 720, 1060, 110, { in: we - .2, snd: false, out: wd + .1 }); }
    if (t > wn - .2) { for (let i = 0; i < 3; i++) P('prop_scroll', 260 + i * 70, 1500, 130, { in: wn - .2 + i * .1, tint: [190, 220, 170], snd: false, rot: (i - 1) * .2 }); glow(330, 1450, 260, '#FFD27A', .6); }
    person(330, 1840, 30, GIRL, { in: t0 + .05, mood: t > wd ? 'surprised' : 'neutral', look: .6, key: 'girl' });
    camEnd();
  }
  function shSailed(t, lt, dur) { // a month later she sails: the liner crosses the night sea into the bay
    const t0 = t - lt, k = ease(seg(t, t0, t0 + dur)), wn = WT('sailed', 'night');
    camBegin(540, 1000, 1.0); board('day'); if (t > wn - .3) board('night', ease(seg(t, wn - .3, wn + .4)));
    P('island_palm', 900, 1380, 460, { in: stagger(t0, 0), sway: .03 }); P('island_islandhouse', 760, 1420, 260, { in: stagger(t0, 1) });
    P('city_liner', lerp(-200, 420, k), 1560, 460, { sway: .012, snd: false }); sea(t, t0, { y: 1660 }); cue('horn', t0 + .5, 'horn', 300, 600);
    camEnd();
  }
  function shOfficer(t, lt) {    // "There is the Southern Cross": the officer points; it is just as she imagined
    const t0 = t - lt, wsc = WT('officer', 'cross'), wi = WT('officer', 'imagined');
    camBegin(540, 1000, 1.0); board('night'); southernCross(600, 700, 160, t, wsc - .3, .12); if (t > wsc) glow(600, 720, 360, '#FFF1C2', .6);
    sea(t, t0, { still: true, y: 1720 });
    person(280, 1850, 30, OFFICER, { in: stagger(t0, 0), mood: 'happy', look: .4, lookY: -.6, key: 'off', aR: t > wsc - .5 ? .9 : -1.2 });
    person(720, 1850, 30, GIRL, { in: stagger(t0, 1), mood: t > wi ? 'beam' : 'awe', lookY: -.8, key: 'girl' });
    if (t > wi - .2) cue('same', wi, 'chime', 600, 400);
    camEnd();
  }
  function shLesson(t, lt) {     // the same streetcar, the same tears, a different meaning: the sea and the stars around her
    const t0 = t - lt, wc = WT('lesson', 'changed');
    camBegin(420, 1300, 1.2); board('night'); streetcar(t, 640, { a: t > wc ? .5 : 1 });
    if (t > wc - .2) { southernCross(560, 900, 110, t, wc - .2, .08); sea(t, wc - .2, { y: 1940, h: 170 }); }
    person(300, 1840, 32, GIRL, { mood: t > wc ? 'beam' : 'sad', key: 'girl', aR: .2 }); if (t < wc) rain(t, 16);
    camEnd();
  }
  function shClose(t, lt) {      // what are you tasting right now, and what could it be instead?
    const t0 = t - lt, wi = WT('close', 'instead');
    camBegin(540, 1000, 1.0); board('night'); if (t > wi - .2) southernCross(560, 640, 110, t, wi - .2, .08);
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0, aR: t > wi - .2 ? .3 : -1.2 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'sinking'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('father') - .12, shFather], [S('eve') - .12, shEve], [S('front') - .12, shFront], [S('salt') - .12, shSalt], [S('samoa') - .12, shSamoa], [S('cross') - .12, shCross], [S('lawyer') - .12, shLawyer], [S('aunt') - .12, shAunt], [S('sailed') - .12, shSailed], [S('officer') - .12, shOfficer], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
