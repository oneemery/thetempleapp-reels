window.CHEAP = true; window.FELT = true;
// Episode 10, flannelgraph cut: "The Birthmark" (the aunt and the baby) built from the felt cutout kit (kit/cutouts) on felt boards.
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








  const AUNT = { ...C.dreamer, name: 'aunt', coat: '#3F8F8A', sleeve: '#3F8F8A', stripes: null, hair: '#3B2A22', skin: '#EFCBA6', torso: 7.0, leg: 4.6, w: 4.4 };
  const MOM = { ...C.dreamer, name: 'mom', coat: '#B8463A', sleeve: '#B8463A', stripes: null, hair: '#B5643A', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const DOC = { ...C.skeptic, name: 'doc', coat: '#F3EBDC', sleeve: '#F3EBDC', lapel: '#D9D4C8', tie: '#3F6FB0', hat: null };
  const DOC2 = { ...DOC, name: 'doc2', hair: '#9A958C', glasses: false };
  const ABEL = { ...C.paul, name: 'abel', coat: '#E9DFC8', sleeve: '#E9DFC8', pants: '#E9DFC8', sash: '#3F8F8A', hair: '#5A3A24', hairStyle: 'curls', beard: 0, skin: '#C98E62' };
  const CAIN = { ...C.paul, name: 'cain', coat: '#7A4E3A', sleeve: '#7A4E3A', pants: '#7A4E3A', sash: '#5E6B3A', hair: '#2B1E19', hairStyle: 'neat', beard: .3, beardCol: '#2B1E19', skin: '#C98E62' };
  const BOY = { ...C.dreamer, name: 'boy', coat: '#3F6FB0', sleeve: '#3F6FB0', stripes: null, hair: '#E6B82A', skin: '#EFCBA6' };
  function babyFace(x, y, s, mark = 0, o = {}) {   // a felt baby face; mark (0..1) is the birthmark over one side
    if (window.CUEMODE) return; const a = o.a ?? 1; if (o.gl) glow(x, y, s * 1.6, '#FFD27A', o.gl);
    flushBrush(); push(); translate(x, y); noStroke();
    fill(30, 18, 12, 70 * a); ellipse(5, 6, s, s * 1.05); fill(246, 240, 226, 255 * a); ellipse(0, 0, s * 1.12, s * 1.17);
    fill(239, 203, 166, 255 * a); ellipse(0, 0, s, s * 1.05);
    if (mark > 0) { fill(170, 70, 70, 200 * a * mark); ellipse(-s * .2, s * .02, s * .52, s * .78); ellipse(-s * .28, -s * .2, s * .36, s * .4); }
    fill(240, 150, 140, 120 * a); ellipse(s * .26, s * .14, s * .2, s * .13); if (mark < .5) ellipse(-s * .26, s * .14, s * .2, s * .13);
    fill(42, 36, 48, 255 * a); ellipse(-s * .17, -s * .05, s * .08, s * .1); ellipse(s * .17, -s * .05, s * .08, s * .1);
    stroke(150, 70, 60, 255 * a); strokeWeight(s * .04); noFill(); arc(0, s * .16, s * .26, s * .16, 0, PI); noStroke();
    fill(184, 120, 60, 255 * a); ellipse(0, -s * .48, s * .22, s * .16); pop();
  }
  const cloudFace = (x, y, s, mark, tin, t, o = {}) => { if (t < tin) return; P('island_cloud', x, y, s, { in: tin, snd: o.snd ?? 'pop', sway: .02, out: o.out }); if (o.out == null || t < o.out) babyFace(x, y - s * .4, s * .42, mark, { gl: o.gl }); };

  // ---------- shots ----------
  function shHook(t, lt) {   // the doctor shakes his head; the aunt keeps seeing the face, no mark
    const t0 = t - lt, wa = WT('hook', 'aunt'), ww = WT('hook', 'without');
    camBegin(540, 1000, 1.0); board('plum');
    person(220, 1840, 30, DOC, { in: t0 + .05, mood: 'determined', look: Math.sin(t * 6) > 0 ? .8 : -.2, key: 'doc' });
    person(760, 1840, 32, AUNT, { in: t0 + .1, mood: t > ww ? 'beam' : 'hopeful', look: -.3, lookY: -.4, key: 'aunt' });
    cloudFace(720, 1060, 340, t > ww ? 0 : .8, wa - .2, t, { gl: t > ww ? .6 : 0 }); if (t > ww) cue('clear', ww, 'sparkle', 720, 300);
    camEnd();
  }
  function shVerse(t, lt) {      // Abel with his lamb, Cain with his harvest; Abel's offering glows
    const t0 = t - lt, we = WT('verse', 'excellent'), lit = ease(seg(t, we - .2, we + .5));
    camBegin(540, 1050, 1.0 + .02 * lt); board('sand'); P('sky_hill', 540, 1440, 460, { in: stagger(t0, 0), sway: 0 });
    if (lit > 0) glow(320, 1350, 380, '#FFD27A', .8 * lit);
    person(320, 1840, 34, ABEL, { in: stagger(t0, 1), mood: 'warm', look: .4, key: 'abel', aR: .4 }); P('bible_lamb', 470, 1860, 200, { in: stagger(t0, 2), sway: .02 });
    person(800, 1840, 34, CAIN, { in: stagger(t0, 3), mood: t > we ? 'skeptical' : 'neutral', look: -.4, key: 'cain', hold: (x, y, u) => P('bible_olivetree', x, y + u * 2, u * 6, { sway: .02, snd: false, tint: [200, 190, 150] }) });
    if (t > we) cue('excellent', we, 'chime', 320, 300);
    camEnd();
  }
  function shMeaning(t, lt) {    // faith: hold the unseen (a glowing cloud); Cain calls it luck (a grey coin purse)
    const t0 = t - lt, wf = WT('meaning', 'faith'), wl = WT('meaning', 'luck');
    camBegin(540, 1000, 1.0); board('plum');
    cloudFace(300, 1000, 300, 0, wf - .2, t, { gl: .5 });
    if (t > wl - .2) P('life_coinbag', 800, 1300, 220, { in: wl - .2, tint: [160, 160, 160], snd: 'pop' });
    host(t, 540, 1830, 36, { in: t0 + .02, mood: 'warm', look: t > wl ? .6 : -.6 });
    camEnd();
  }
  function shBaby(t, lt) {       // a perfect baby in his crib; on "birthmark" the mark appears
    const t0 = t - lt, wb = WT('baby', 'birthmark'), m = ease(seg(t, wb - .2, wb + .4));
    camBegin(540, 1050, 1.08); board('warm'); P('room_window', 760, 860, 420, { in: stagger(t0, 0) }); P('room_lamp', 160, 1150, 240, { in: stagger(t0, 1) });
    P('room_bed', 540, 1760, 520, { in: stagger(t0, 2), sway: .002, tint: [200, 220, 255] });
    babyFace(540, 1440, 150, m); piecePart('room_bed', 540, 1760, 520, .5, 1);
    camEnd();
  }
  function shDoctors(t, lt) {    // the doctor, then every specialist: nothing can be done
    const t0 = t - lt, wn = WT('doctors', 'nothing'), ws = WT('doctors', 'specialist');
    camBegin(540, 1000, 1.0); board('sand'); P('room_painting', 300, 600, 220, { in: stagger(t0, 0) });
    person(780, 1840, 32, MOM, { in: stagger(t0, 1), mood: 'worried', look: -1, key: 'mom', aL: .3, hold: (x, y, u) => babyFace(x, y - u * .6, u * 5.4, 1) });
    person(220, 1840, 30, DOC, { in: stagger(t0, 2), mood: 'determined', look: t > wn && t < wn + 1 ? (Math.sin(t * 7) > 0 ? 1 : -.2) : 1, key: 'doc' });
    if (t > ws - .3) person(440, 1840, 30, DOC2, { in: ws - .3, mood: 'sad', look: Math.sin(t * 7 + 1) > 0 ? 1 : -.2, key: 'doc2' });
    camEnd();
  }
  function shAunt(t, lt) {       // the aunt remembers Neville: an assumption, persisted in, hardens into fact
    const t0 = t - lt, wn = WT('aunt', 'neville'), wf = WT('aunt', 'fact'), lit = ease(seg(t, wf - .2, wf + .5));
    camBegin(540, 1000, 1.0); board('plum'); if (lit > 0) glow(540, 1350, 460, '#FFD27A', .7 * lit);
    person(540, 1840, 32, AUNT, { in: t0 + .05, mood: t > wf ? 'determined' : 'hopeful', look: 0, lookY: -.3, key: 'aunt' });
    if (t > wn - .2) { P('island_cloud', 760, 1040, 300, { in: wn - .2, snd: 'pop' }); person(760, 1080, 7, C.neville, { in: wn, mood: 'warm', key: 'nevc', snd: false }); }
    if (t > wf) cue('fact', wf, 'chime', 540, 300);
    camEnd();
  }
  function shImagined(t, lt) {   // every time she thinks of him: the perfect face, again and again
    const t0 = t - lt, wo = WT('imagined', 'often'), wp = WT('imagined', 'perfect');
    camBegin(540, 1000, 1.0); board('night'); P('room_lamp', 160, 1150, 240, { in: stagger(t0, 0) }); glow(160, 1000, 300, '#FFC07A', .6);
    person(380, 1840, 32, AUNT, { in: stagger(t0, 1), mood: 'beam', look: .4, lookY: -.4, key: 'aunt' });
    const k = Math.floor(Math.max(0, t - t0 - .3) / 1.4), pulse = (t - t0 - .3) % 1.4;
    cloudFace(760, 1000, 340, 0, t0 + .3, t, { gl: .5 + .3 * Math.sin(pulse * 4), snd: 'pop' });
    for (let i = 0; i < Math.min(k, 4); i++) cue('again' + i, t0 + .3 + (i + 1) * 1.4, 'sparkle', 760, 200);
    if (t > wp) tally(t, 330, 700, 5, Array.from({ length: 5 }, (_, i) => wp + i * .15), 110);
    camEnd();
  }
  function shHard(t, lt) {       // it wasn't easy: a rain cloud tries; the face holds
    const t0 = t - lt, we = WT('hard', 'easy'), wk = WT('hard', 'kept');
    camBegin(540, 1000, 1.0); board('night'); if (t > we - .2) P('sky_raincloud', 300, 900, 220, { in: we - .2, out: wk, snd: 'pop' });
    person(380, 1840, 32, AUNT, { mood: t > wk ? 'determined' : 'worried', look: .4, lookY: -.4, key: 'aunt' });
    cloudFace(760, 1000, 340, 0, t0, t, { gl: t > wk ? .7 : .3, snd: false });
    camEnd();
  }
  function shVisit(t, lt) {      // the eight month birthday: she walks to her sister's door
    const t0 = t - lt, walk = ease(seg(t, t0, t0 + 1.8));
    camBegin(540, 1000, 1.0); board('day'); P('life_house', 760, 1560, 660, { in: stagger(t0, 0), sway: .004 }); P('life_flowers', 300, 1720, 220, { in: stagger(t0, 1) });
    tally(t, 140, 700, 8, Array.from({ length: 8 }, (_, i) => t0 + .2 + i * .1), 110);
    person(lerp(-150, 520, walk), 1860, 30, AUNT, { mood: 'hopeful', look: 1, key: 'aunt' });
    camEnd();
  }
  function shResult(t, lt) {     // his skin is perfect: no trace of a mark
    const t0 = t - lt, wp = WT('result', 'perfect'), lit = ease(seg(t, wp - .2, wp + .5));
    camBegin(540, 1050, 1.06); board('warm'); if (lit > 0) glow(620, 1300, 420, '#FFD27A', lit);
    person(380, 1840, 30, AUNT, { in: t0 + .05, mood: t > wp ? 'joy' : 'awe', look: 1, key: 'aunt', aL: t > wp ? .6 : -1.2, aR: t > wp ? .6 : -1.2 });
    person(760, 1840, 32, MOM, { in: t0 + .1, mood: 'beam', look: -1, key: 'mom', aL: .3, hold: (x, y, u) => babyFace(x, y - u * .6, u * 5.4, 0) });
    if (t > wp) cue('perfect', wp, 'sparkle', 700, 300);
    camEnd();
  }
  function shThree(t, lt) {      // three years old: a healthy boy in the sun
    const t0 = t - lt, wh = WT('three', 'healthy');
    camBegin(540, 1000, 1.0); board('day'); P('island_sun', 840, 460, 220, { in: stagger(t0, 0) }); P('sky_hill', 540, 1460, 520, { in: stagger(t0, 1), sway: 0 });
    tally(t, 400, 760, 3, [t0 + .3, t0 + .45, t0 + .6], 140);
    person(540, 1860, 22, BOY, { in: stagger(t0, 2), mood: 'joy', key: 'boy', aL: t > wh ? .6 : -1.2, aR: t > wh ? .6 : -1.2, dy: t > wh ? -.4 * Math.abs(Math.sin((t - wh) * 6)) : 0 });
    camEnd();
  }
  function shLuck(t, lt) {       // "luck": a grey coin purse; faith: the purse peels away and a star stays
    const t0 = t - lt, wl = WT('luck', 'luck'), wf = WT('luck', 'faith', 1);
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wl - .2) P('life_coinbag', 540, 1200, 260, { in: wl - .2, out: wf - .3, tint: [160, 160, 160], snd: 'pop' });
    if (t > wf - .3) { P('bible_star', 540, 1100, 280, { in: wf - .3, snd: 'chime', sway: .04 }); glow(540, 1050, 380, '#FFD27A', .8); }
    host(t, 260, 1840, 32, { in: t0 + .02, mood: 'warm', look: .6 });
    camEnd();
  }
  function shLesson(t, lt) {     // two faces: the one with the mark fades; the one she kept looking at stays
    const t0 = t - lt, wm = WT('lesson', 'mark'), wf = WT('lesson', 'face');
    camBegin(540, 1000, 1.0); board('night');
    if (t > wm - .2) babyFace(300, 1000, 200, 1, { a: 1 - ease(seg(t, wf - .2, wf + .6)) });
    if (t > wf - .2) babyFace(760, 1000, 220, 0, { gl: .8 });
    person(540, 1840, 32, AUNT, { in: t0 + .05, mood: t > wf ? 'beam' : 'determined', look: t > wf ? .6 : -.6, lookY: -.4, key: 'aunt' });
    camEnd();
  }
  function shClose(t, lt) {      // what are you seeing every time you think of it?
    const t0 = t - lt, ws = WT('close', 'seeing');
    camBegin(540, 1000, 1.0); board('plum'); if (t > ws - .2) P('island_cloud', 540, 1060, 300, { in: ws - .2, snd: 'pop' });
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0, aR: t > ws - .2 ? .3 : -1.2 });
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('baby') - .12, shBaby], [S('doctors') - .12, shDoctors], [S('aunt') - .12, shAunt], [S('imagined') - .12, shImagined], [S('hard') - .12, shHard], [S('visit') - .12, shVisit], [S('result') - .12, shResult], [S('three') - .12, shThree], [S('luck') - .12, shLuck], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
