window.CHEAP = true; window.FELT = true;
// Episode 13, flannelgraph cut: "The Puppy" (the nine year old boy) built from the felt cutout kit (kit/cutouts) on felt boards.
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











  const BOY = { ...C.dreamer, name: 'boy' };
  const GRAN = { ...C.dreamer, name: 'gran', coat: '#2E3A52', sleeve: '#2E3A52', stripes: null, hair: '#D8D2C8', skin: '#EFCBA6', torso: 7.2, leg: 4.4, w: 4.8 };
  const DAD = { ...C.blake, name: 'dad', coat: '#5A4636', sleeve: '#5A4636' };
  const MOM = { ...C.dreamer, name: 'mom', coat: '#B8463A', sleeve: '#B8463A', stripes: null, hair: '#5A3A24', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  function dogShape(s, pose, g) {   // felt collie parts, grown by g
    const E = (x, y, w, h) => ellipse(x, y, w + 2 * g, h + 2 * g);
    if (pose === 'lie') { E(0, -s * .26, s * 1.5, s * .5); E(s * .8, -s * .42, s * .56, s * .5); E(s * 1.08, -s * .34, s * .34, s * .22); E(s * .64, -s * .58, s * .22, s * .34); for (let i = 0; i < 6; i++) E(-s * .74 - i * s * .07, -s * .22 + i * s * .02, s * .2, s * .2); return; }
    const up = pose === 'jump' ? -s * .3 : 0;
    for (const lx of [-s * .45, -s * .25, s * .25, s * .45]) E(lx, -s * .16 + up, s * .16, s * .36);
    E(0, -s * .5 + up, s * 1.3, s * .56); E(s * .66, -s * .86 + up, s * .54, s * .5); E(s * .96, -s * .8 + up, s * .36, s * .22); E(s * .5, -s * 1.02 + up, s * .2, s * .34);
    for (let i = 0; i < 7; i++) E(-s * .66 - i * s * .06, -s * .62 - i * s * .05 + up, s * .2, s * .2);
  }
  function dog(x, y, s, o = {}) {   // a felt sable collie with a white ruff: pose stand | lie | jump
    if (window.CUEMODE) return; s *= 1.8; const a = o.a ?? 1, pose = o.pose || 'stand'; if (o.gl) glow(x, y - s * .5, s * 1.6, '#FFD27A', o.gl);
    flushBrush(); push(); translate(x, y); if (o.flip) scale(-1, 1); noStroke();
    fill(30, 18, 12, 75 * a); push(); translate(6, 7); dogShape(s, pose, 0); pop();
    fill(246, 240, 226, 255 * a); dogShape(s, pose, s * .06); fill(196, 120, 52, 255 * a); dogShape(s, pose, 0);
    const up = pose === 'jump' ? -s * .3 : 0, hx = pose === 'lie' ? s * .8 : s * .66, hy = pose === 'lie' ? -s * .42 : -s * .86 + up;
    fill(250, 246, 236, 255 * a); ellipse(hx - s * .12, hy + s * .2, s * .34, s * .3); ellipse(hx + s * .3, hy + s * .06, s * .2, s * .14);
    fill(42, 36, 48, 255 * a); if (o.sleep) rect(hx - s * .02, hy - s * .04, s * .12, s * .03); else ellipse(hx + s * .04, hy - s * .04, s * .08, s * .1); ellipse(hx + s * .46, hy + s * .04, s * .1, s * .08); pop();
  }
  function bedroom(t, t0, o = {}) { board(o.day ? 'warm' : 'night'); P('room_window', 800, 860, 400, { in: o.still ? null : stagger(t0, 0) }); if (!o.day) glow(800, 800, 260, '#C8D8FF', .3); }
  function inBed(t, bx, bby, bh, o = {}) {   // the boy in bed, with an optional dog beside him (ghost or real)
    P('room_bed', bx, bby, bh, { in: o.in, sway: .002 });
    person(bx - bh * .12, bby - bh * .44, bh * .018, BOY, { in: o.in == null ? null : o.in + .1, mood: o.mood || 'sleepy', key: 'boybed', snd: false, aL: -1.2, aR: o.pet ? .4 : -1.2 });
    if (T > (o.in ?? -9) + .4) piecePart('room_bed', bx, bby, bh, .43, 1);
    if (o.dog != null) dog(bx + bh * .12, bby - bh * .36, bh * .1, { pose: 'lie', a: o.dog, sleep: true, gl: o.dog < 1 ? .4 : 0 });
  }

  // ---------- shots ----------
  function shHook(t, lt) {   // his father frowns at dogs; the boy sleeps with an imagined one anyway
    const t0 = t - lt, wn = WT('hook', 'night');
    camBegin(540, 1000, 1.0); bedroom(t, t0);
    person(170, 1840, 30, DAD, { in: t0 + .05, mood: 'determined', look: .6, key: 'dad', aL: -.3, aR: -.3 });
    inBed(t, 640, 1760, 560, { in: t0 + .1, dog: t > wn - .2 ? .55 : null }); if (t > wn - .2) cue('ghostdog', wn, 'sparkle', 700, 300);
    camEnd();
  }
  function shVerse(t, lt) {      // Jesus: believe that ye receive them
    const t0 = t - lt, wr = WT('verse', 'receive'), lit = ease(seg(t, wr - .2, wr + .5));
    camBegin(540, 1050, 1.0 + .02 * lt); board('sand'); glow(540, 1300, 520, '#FFE2A8', .35 + .55 * lit);
    P('sky_hill', 300, 1460, 360, { in: stagger(t0, 0), sway: 0 }); P('bible_olivetree', 880, 1560, 520, { in: stagger(t0, 1), sway: .02 });
    person(520, 1840, 36, JESUS, { in: stagger(t0, 2), mood: 'wise', key: 'jes', aL: t > wr - .2 ? .6 : -1.2, aR: t > wr - .2 ? .6 : -1.2 }); if (t > wr) cue('receive', wr, 'chime', 520, 300);
    camEnd();
  }
  function shMeaning(t, lt) {    // not "will": a grey cloud; "do": the dog is right here
    const t0 = t - lt, ww = WT('meaning', 'will'), wd = WT('meaning', 'do');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > ww - .2) { P('island_cloud', 760, 1000, 260, { in: ww - .2, out: wd - .1, snd: 'pop', tint: [170, 170, 170] }); }
    if (t > wd - .1) { dog(760, 1840, 120, { gl: .6 }); cue('do', wd, 'sparkle', 760, 300); }
    host(t, 360, 1830, 38, { in: t0 + .02, mood: 'warm', look: .6 });
    camEnd();
  }
  function shBoy(t, lt) {        // visiting his grandmother in New York; more than anything, a puppy
    const t0 = t - lt, wp = WT('boy', 'puppy');
    camBegin(540, 1000, 1.0); board('warm'); P('room_window', 760, 860, 420, { in: stagger(t0, 0) }); P('room_lamp', 160, 1150, 240, { in: stagger(t0, 1) }); rug(560, 1900, 360, { in: stagger(t0, 2) });
    person(300, 1840, 32, GRAN, { in: stagger(t0, 3), mood: 'warm', look: 1, key: 'gran' });
    person(620, 1870, 20, BOY, { in: stagger(t0, 4), mood: t > wp ? 'beam' : 'happy', look: t > wp ? .3 : -1, lookY: t > wp ? -.5 : 0, key: 'boy' });
    if (t > wp - .3) { P('island_cloud', 800, 1100, 280, { in: wp - .3, snd: 'pop' }); dog(800, 1140, 60, { pose: 'jump' }); }
    camEnd();
  }
  function shParents(t, lt) {    // his parents say no; his father hates having a dog around (a rain cloud)
    const t0 = t - lt, wn = WT('parents', 'no'), wh = WT('parents', 'hated');
    camBegin(540, 1000, 1.0); board('day'); P('life_house', 760, 1560, 640, { in: stagger(t0, 0), sway: .004 });
    person(560, 1860, 30, MOM, { in: stagger(t0, 1), mood: 'sad', look: -1, key: 'mom' }); person(860, 1860, 32, DAD, { in: stagger(t0, 2), mood: 'determined', look: -1, key: 'dad', aL: -.3, aR: -.3 });
    if (t > wh - .2) P('sky_raincloud', 860, 1160, 200, { in: wh - .2, snd: 'pop' });
    person(260, 1880, 20, BOY, { in: stagger(t0, 3), mood: t > wn ? 'sad' : 'hopeful', look: 1, key: 'boy' });
    camEnd();
  }
  function shHeard(t, lt) {      // grandmother tells the soldier's story; the boy decides to imagine a dog
    const t0 = t - lt, ws = WT('heard', 'soldier'), wd = WT('heard', 'dog');
    camBegin(540, 1000, 1.0); board('warm'); P('room_lamp', 160, 1150, 240, { in: stagger(t0, 0) });
    person(300, 1840, 32, GRAN, { in: stagger(t0, 1), mood: 'warm', look: 1, key: 'gran', talk: t < wd - .4 ? talk(t) : null });
    if (t > ws - .3) { P('island_cloud', 480, 1060, 300, { in: ws - .3, snd: 'pop', out: wd - .2 }); if (t < wd - .1) P('city_brownstone', 480, 1060, 120, { in: ws - .1, snd: false, out: wd - .2 }); }
    person(700, 1870, 20, BOY, { in: stagger(t0, 2), mood: t > wd ? 'determined' : 'awe', look: -1, key: 'boy' });
    if (t > wd - .2) { P('island_cloud', 760, 1180, 260, { in: wd - .2, snd: 'pop' }); dog(760, 1220, 56, {}); }
    camEnd();
  }
  function shNightly(t, lt) {    // every night: a dog lying in the bed beside him; he pets it and feels its fur
    const t0 = t - lt, wf = WT('nightly', 'fur');
    camBegin(600, 1250, 1.2); bedroom(t, t0);
    inBed(t, 600, 1760, 560, { in: stagger(t0, 1), dog: .6, pet: true, mood: t > wf ? 'beam' : 'sleepy' });
    if (t > wf - .2) { glow(690, 1520, 200, '#FFD27A', .7); cue('fur', wf, 'sparkle', 690, 200); }
    camEnd();
  }
  function shPlay(t, lt) {       // in imagination: playing, walking it (a cloud scene)
    const t0 = t - lt, wp = WT('play', 'playing'), ww = WT('play', 'walks');
    camBegin(540, 1000, 1.0); board('night'); glow(540, 1500, 600, '#FFE2A8', .5);
    P('island_cloud', 220, 700, 200, { in: t0 + .05, snd: 'pop' }); P('island_cloud', 860, 760, 220, { in: t0 + .15, snd: false }); P('sky_hill', 540, 1500, 560, { in: t0 + .1, sway: 0, a: .7 });
    const k = t - t0, wk = ease(seg(t, ww - .2, ww + 1.4)); person(lerp(260, 640, wk), 1840, 22, BOY, { mood: 'joy', look: 1, key: 'bc', snd: false, dy: -.3 * Math.abs(Math.sin(k * 7)) });
    dog(lerp(420, 820, wk), 1850, 80, { pose: Math.sin(k * 7) > 0 ? 'jump' : 'stand', a: .75, gl: .3 });
    camEnd();
  }
  function shNights(t, lt) {     // many nights: the moon, the dots
    const t0 = t - lt; camBegin(600, 1250, 1.2); bedroom(t, t0, { still: true }); P('island_moon', 360, 760, 160, { in: t0 + .05 });
    tally(t, 300, 920, 7, Array.from({ length: 7 }, (_, i) => t0 + .2 + i * .14), 100);
    inBed(t, 600, 1760, 560, { dog: .6 }); zzz(560, 1350, t, t0 + .3, .7);
    camEnd();
  }
  function shContest(t, lt) {    // the newspaper contest: Why I Would Like to Own a Dog
    const t0 = t - lt, wc = WT('contest', 'contest'), ww = WT('contest', 'write');
    camBegin(540, 1000, 1.0); board('sand'); P('room_painting', 300, 600, 220, { in: stagger(t0, 0) });
    if (t > wc - .3 && t < ww) { const k = seg(t, wc - .3, wc + .5), [x, y] = arcPt([1200, 800], [620, 1300], -240, ease(k)); P('prop_scroll', x, y, 200, { rot: k * 3, sway: 0, snd: false }); cue('paper', wc - .3, 'whoosh', 800, 300); }
    P('room_desk', 600, 1780, 400, { in: stagger(t0, 1) });
    person(600, 1620, 20, BOY, { in: stagger(t0, 2), mood: t > ww ? 'determined' : 'happy', look: 0, lookY: .5, key: 'boy', hold: t > ww - .2 ? (x, y, u) => P('prop_quill', x, y + u, u * 4, { sway: .03, snd: false }) : null });
    if (t > ww) cue('scribble', ww, 'ticks', 600, 1.2);
    camEnd();
  }
  function shWon(t, lt) {        // he wins: a collie puppy, handed over in a public ceremony
    const t0 = t - lt, wc = WT('won', 'collie'), wce = WT('won', 'ceremony');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1200, 520, '#FFD27A', .6);
    person(760, 1820, 30, GRAN, { in: stagger(t0, 0), mood: 'joy', look: -1, key: 'gran', aL: .5 });
    person(460, 1860, 22, BOY, { in: stagger(t0, 1), mood: 'joy', look: 0, key: 'boy', aL: .7, aR: .7 });
    if (t > wc - .2) { dog(620, 1880, 100, { gl: .5 }); cue('collie', wc, 'chime', 620, 300); }
    for (let i = 0; i < 5; i++) person(120 + i * 210, 1990, 12, [C.paul, C.skeptic, C.blake, MOM, C.neville][i], { in: stagger(t0, 2 + i, .05), mood: 'happy', key: 'cr' + i, snd: false, aL: t > wce ? .5 + .3 * Math.sin(t * 12 + i) : -1.2 });
    if (t > wce) { stars(540, 1100, t, wce); cue('cheer', wce, 'sparkle', 540, 500); }
    camEnd();
  }
  function shKept(t, lt) {       // home: his parents let him keep it (even his father smiles)
    const t0 = t - lt, wk = WT('kept', 'keep');
    camBegin(540, 1000, 1.0); board('day'); P('life_house', 760, 1560, 640, { in: stagger(t0, 0), sway: .004 });
    person(860, 1860, 32, DAD, { in: stagger(t0, 1), mood: t > wk ? 'happy' : 'skeptical', look: -1, key: 'dad' }); person(620, 1860, 30, MOM, { in: stagger(t0, 2), mood: 'happy', look: -1, key: 'mom' });
    person(300, 1880, 20, BOY, { in: stagger(t0, 3), mood: 'joy', look: 1, key: 'boy' }); dog(420, 1880, 90, { pose: t > wk ? 'jump' : 'stand' });
    if (t > wk) cue('keep', wk, 'pop', 420, 200);
    camEnd();
  }
  function shLesson(t, lt) {     // he went to sleep with one: now the real dog in the bed
    const t0 = t - lt, ws = WT('lesson', 'sleep');
    camBegin(600, 1250, 1.2); bedroom(t, t0);
    inBed(t, 600, 1760, 560, { in: stagger(t0, 1), dog: 1, mood: 'sleepy' }); if (t > ws) zzz(560, 1350, t, ws, .8);
    camEnd();
  }
  function shClose(t, lt) {      // what would you feel next to you tonight?
    const t0 = t - lt, wy = WT('close', 'yours');
    camBegin(540, 1000, 1.0); board('night'); P('island_moon', 820, 520, 180, { in: t0 + .1 });
    if (t > wy - .3) { P('island_cloud', 540, 1060, 300, { in: wy - .3, snd: 'pop' }); P('bible_star', 540, 1030, 120, { in: wy, snd: false }); }
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0, aR: t > wy - .2 ? .3 : -1.2 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'believing'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('boy') - .12, shBoy], [S('parents') - .12, shParents], [S('heard') - .12, shHeard], [S('nightly') - .12, shNightly], [S('play') - .12, shPlay], [S('nights') - .12, shNights], [S('contest') - .12, shContest], [S('won') - .12, shWon], [S('kept') - .12, shKept], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
