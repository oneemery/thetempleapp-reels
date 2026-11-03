window.CHEAP = true; window.FELT = true;
// Episode 8, flannelgraph cut: "The Scarf" (the father on Mother's Day) built from the felt cutout kit (kit/cutouts) on felt boards.
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






  const DAU = { ...C.dreamer, name: 'daughter', coat: '#7A4E8A', sleeve: '#7A4E8A', stripes: null, hair: '#3B2A22', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.4 };
  const GIRL = { ...C.dreamer, name: 'girl', coat: '#E07A4F', sleeve: '#E07A4F', stripes: null, hair: '#3B2A22', skin: '#EFCBA6' };
  const MOM = { ...C.dreamer, name: 'mom', coat: '#3F8F8A', sleeve: '#3F8F8A', stripes: null, hair: '#5A3A24', skin: '#EFCBA6', torso: 7.2, leg: 4.4, w: 4.8 };
  const DAD = { ...C.blake, name: 'dad', coat: '#5A4636', sleeve: '#5A4636', lapel: '#F3EBDC', hair: '#9A958C', hat: 'fedora', hatCol: '#3A2A22', band: '#8C3B3B' };
  const SALES = { ...C.skeptic, name: 'sales', coat: '#2E3A52', sleeve: '#2E3A52', hat: null };
  function sitIn(t, cx, by, h, spec, o = {}) { P('room_armchair', cx, by, h, { in: o.in, sway: .003 }); person(cx, by - h * .22, o.u || 22, spec, o); if (T > (o.in ?? -9) + .4) piecePart('room_armchair', cx, by, h, .58, 1); }
  const storm = (x, y, s, t, tin, tout) => { if (t > tin) P('sky_raincloud', x, y, s, { in: tin, out: tout, sway: .03, snd: 'pop' }); };
  function scarf(x, y, s, a = 1, gl = 0) {   // a felt stone marten scarf: a soft brown fur band with cream tips
    if (window.CUEMODE || a <= 0) return; s *= 1.6; if (gl > 0) glow(x, y, s * 1.6, '#FFD27A', gl);
    flushBrush(); push(); translate(x, y); noStroke(); const pts = []; for (let i = 0; i <= 14; i++) { const k = i / 14; pts.push([(k - .5) * s * 1.6, Math.sin(k * PI) * s * .45 - s * .2]); }
    fill(30, 18, 12, 70 * a); for (const [px, py] of pts) ellipse(px + 5, py + 6, s * .34, s * .3);
    fill(246, 240, 226, 255 * a); for (const [px, py] of pts) ellipse(px, py, s * .4, s * .36);
    pts.forEach(([px, py], i) => { const tip = i < 2 || i > 12; fill(tip ? 233 : 107, tip ? 222 : 74, tip ? 200 : 50, 255 * a); ellipse(px, py, s * .32, s * .28); }); pop();
  }
  const hugCloud = (x, y, s, tin, t) => { if (t < tin) return; P('island_cloud', x, y, s, { in: tin, snd: 'pop', sway: .02 }); person(x - s * .1, y + s * .02, s * .025, DAU, { in: tin + .1, mood: 'beam', look: 1, key: 'hcd' + x, snd: false, aR: .6 }); person(x + s * .12, y + s * .02, s * .027, DAD, { in: tin + .15, mood: 'beam', look: -1, key: 'hcf' + x, snd: false, aL: .6 }); };

  // ---------- shots ----------
  function shHook(t, lt) {   // years without a hug; then, every night, in her head (a cloud with the hug, a moon)
    const t0 = t - lt, wn = WT('hook', 'night');
    camBegin(540, 1000, 1.0); board(t > wn - .2 ? 'night' : 'plum');
    person(320, 1840, 32, DAU, { in: t0 + .05, mood: t > wn ? 'warm' : 'sad', look: .5, lookY: t > wn ? -.4 : 0, key: 'dau' });
    hugCloud(700, 1080, 360, wn - .2, t); if (t > wn - .2) P('island_moon', 860, 560, 180, { in: wn, snd: false });
    camEnd();
  }
  function shVerse(t, lt) {      // Jesus with a lamb: wise as serpents, harmless as doves
    const t0 = t - lt, wh = WT('verse', 'harmless'), lit = ease(seg(t, wh - .2, wh + .6));
    camBegin(540, 1050, 1.0 + .02 * lt); board('sand'); glow(540, 1300, 520, '#FFE2A8', .4 + .5 * lit);
    P('sky_hill', 300, 1460, 360, { in: stagger(t0, 0), sway: 0 }); P('bible_olivetree', 880, 1560, 520, { in: stagger(t0, 1), sway: .02 });
    person(480, 1840, 36, JESUS, { in: stagger(t0, 2), mood: 'wise', look: .5, key: 'jes', aR: t > wh - .2 ? .5 : -1.2 });
    if (t > wh - .2) P('bible_lamb', 720, 1860, 230, { in: wh - .2, snd: 'chime', sway: .02 });
    camEnd();
  }
  function shMeaning(t, lt) {    // harmless even to those who hurt you: a rain cloud, then a glow at the heart
    const t0 = t - lt, wh = WT('meaning', 'hurt'), wi = WT('meaning', 'inside'), lit = ease(seg(t, wi - .2, wi + .6));
    camBegin(540, 1000, 1.0); board('plum'); storm(540, 1060, 260, t, wh - .2, wi - .1); if (lit > 0) glow(540, 1420, 360, '#FFD27A', .8 * lit);
    host(t, 540, 1830, 38, { in: t0 + .02, mood: t > wi ? 'warm' : t > wh ? 'sad' : 'neutral', look: 0 });
    camEnd();
  }
  function shParents(t, lt) {    // the parents split when she was six; she stays with her mother; her father walks off
    const t0 = t - lt, ws = WT('parents', 'six'), wm = WT('parents', 'mother'), go = ease(seg(t, WT('parents', 'split') - .1, ws + .8));
    camBegin(540, 1000, 1.0); board('day'); P('life_house', 740, 1560, 660, { in: stagger(t0, 0), sway: .004 });
    person(lerp(560, -150, go), 1860, 30, DAD, { in: stagger(t0, 1), mood: 'neutral', look: go > .05 ? -1 : 1, key: 'dad' });
    if (t > ws - .3) person(740, 1870, 18, GIRL, { in: ws - .3, mood: t > wm ? 'sad' : 'neutral', look: -1, key: 'girl' });
    if (t > wm - .3) person(900, 1860, 30, MOM, { in: wm - .3, mood: 'warm', look: -1, key: 'mom', aL: .2 });
    camEnd();
  }
  function shChecks(t, lt) {     // Christmas: an envelope with five dollars; later ten; a rain cloud of resentment
    const t0 = t - lt, wc = WT('checks', 'christmas'), wf = WT('checks', 'five'), wt = WT('checks', 'ten'), wr = WT('checks', 'resented');
    camBegin(540, 1000, 1.0); board('night'); P('city_wintertree', 180, 1600, 560, { in: stagger(t0, 0), sway: .02 }); P('room_window', 760, 900, 420, { in: stagger(t0, 1) });
    if (t > wc - .2 && t < wf + 1) { const k = seg(t, wc - .2, wc + .6), [x, y] = arcPt([1200, 900], [640, 1300], -240, ease(k)); P('prop_envelope', x, y, 140, { rot: k * 4, sway: 0, snd: false }); cue('xmas', wc - .2, 'whoosh', 800, 300); }
    if (t > wf - .1) P('prop_money', 640, 1260, t > wt ? 200 : 130, { in: wf - .1, snd: 'cash', sway: .03, tint: [180, 200, 170] });
    storm(420, 1150, 260, t, wr - .2);
    person(420, 1840, 32, DAU, { in: stagger(t0, 2), mood: t > wr ? 'determined' : 'neutral', look: 1, key: 'dau' });
    feltSnow(t, 18, 1, 51);
    camEnd();
  }
  function shLecture(t, lt) {    // Neville speaks; she sees her resentment; the cloud lifts
    const t0 = t - lt, ws = WT('lecture', 'saw'), lit = ease(seg(t, ws - .1, ws + .6));
    camBegin(540, 1000, 1.0); board('plum'); glow(760, 1300, 500, '#FFD27A', .5 * lit);
    person(300, 1840, 34, C.neville, { in: stagger(t0, 0), mood: 'warm', look: 1, key: 'nev', aR: .4, talk: t < ws ? talk(t) : null });
    sitIn(t, 760, 1840, 420, DAU, { in: stagger(t0, 1), mood: t > ws ? 'surprised' : 'neutral', look: -1, key: 'dau' });
    storm(760, 1160, 240, t, stagger(t0, 2), ws);
    camEnd();
  }
  function shHug(t, lt) {        // night: she imagines hugging her father, over and over, then falls asleep content
    const t0 = t - lt, wh = WT('hug', 'hugging'), wf = WT('hug', 'asleep');
    camBegin(540, 1000, 1.0); board('night'); P('room_lamp', 140, 1150, 240, { in: stagger(t0, 0) }); glow(140, 1000, 300, '#FFC07A', .6);
    sitIn(t, 320, 1840, 420, DAU, { in: stagger(t0, 1), mood: t > wf - .2 ? 'sleepy' : 'beam', look: .5, key: 'dau' });
    hugCloud(720, 1100, 380, wh - .2, t); if (t > wh) glow(720, 1100, 300, '#FFD27A', .5);
    zzz(440, 1300, t, wf, .8);
    camEnd();
  }
  function shStore(t, lt) {      // the fur department: she tries on the scarf, then hands it back
    const t0 = t - lt, wsc = WT('store', 'scarf'), wb = WT('store', 'back'), back = ease(seg(t, wb - .3, wb + .4));
    camBegin(540, 1000, 1.0); board('sand'); P('room_painting', 300, 600, 220, { in: stagger(t0, 0) });
    const bx = 760, bby = 1500, bh = 800; P('city_ticketbooth', bx, bby, bh, { in: stagger(t0, 1), sway: 0, tint: [255, 230, 210] });
    person(bx, bby - bh * .2, 24, SALES, { in: stagger(t0, 2), mood: 'neutral', look: -.6, key: 'sales', snd: false }); if (T > stagger(t0, 2) + .4) piecePart('city_ticketbooth', bx, bby, bh, .76, 1);
    person(320, 1840, 32, DAU, { in: stagger(t0, 3), mood: t > wb - .3 ? 'sad' : t > wsc ? 'beam' : 'hopeful', look: 1, key: 'dau', aR: t > wsc - .3 && back < 1 ? .4 : -1.2 });
    if (t > wsc - .3) scarf(lerp(420, 700, back), lerp(1380, 1250, back), 120, 1, t < wb ? .4 : 0);
    camEnd();
  }
  function shRemember(t, lt) {   // walking out: she remembers Neville (a cloud with him in it)
    const t0 = t - lt, wn = WT('remember', 'neville'), walk = ease(seg(t, t0, t0 + 2));
    camBegin(540, 1000, 1.0); board('day'); P('city_rowhouses', 200, 1400, 400, { in: stagger(t0, 0) }); P('city_streetlamp', 980, 1560, 520, { in: stagger(t0, 1) });
    person(lerp(200, 520, walk), 1840, 32, DAU, { mood: t > wn ? 'hopeful' : 'neutral', look: t > wn ? .2 : 1, lookY: t > wn ? -.5 : 0, key: 'dau' });
    if (t > wn - .2) { P('island_cloud', 760, 1060, 320, { in: wn - .2, snd: 'pop' }); person(760, 1100, 7, C.neville, { in: wn, mood: 'warm', key: 'nevc', snd: false }); }
    camEnd();
  }
  function shWearing(t, lt) {    // in imagination she puts it back on: a glowing ghost scarf; she strolls on
    const t0 = t - lt, wb = WT('wearing', 'back'), wr = WT('wearing', 'real'), stroll = ease(seg(t, wr, wr + 2.5));
    camBegin(540, 1000, 1.0); board('day'); P('city_rowhouses', 200, 1400, 400, {}); P('city_streetlamp', 980, 1560, 520, {});
    const x = lerp(520, 760, stroll);
    person(x, 1840, 32, DAU, { mood: t > wr ? 'beam' : 'hopeful', look: 1, key: 'dau', aR: t > wb - .2 ? .3 : -1.2 });
    if (t > wb - .2) { scarf(x + 70, 1380, 110, t > wr ? .75 : .45, .6); cue('ghostscarf', wb - .1, 'sparkle', x, 300); }
    camEnd();
  }
  function shForgot(t, lt) {     // she never connects the two: both clouds drift off
    const t0 = t - lt, wf = WT('forgot', 'forgot');
    camBegin(540, 1000, 1.0); board('warm');
    hugCloud(280, 1000, 300, t0, t); P('island_cloud', 780, 1000, 300, { in: t0, out: wf, snd: false }); scarf(780, 1010, 90, t < wf ? 1 : 0);
    if (t > wf) { cue('drift', wf, 'whoosh', 540, 300); }
    person(540, 1840, 32, DAU, { in: t0 + .05, mood: 'neutral', look: 0, key: 'dau' });
    camEnd();
  }
  function shDoorbell(t, lt) {   // Mother's Day: the doorbell; her father at the door; the hug
    const t0 = t - lt, wd = WT('doorbell', 'doorbell'), wf = WT('doorbell', 'father'), wh = WT('doorbell', 'hugged'), hug = ease(seg(t, wh - .3, wh + .3));
    camBegin(540, 1000 + 60 * hug, 1.0 + .12 * hug); board('warm'); P('life_flowers', 860, 1620, 260, { in: stagger(t0, 0) });
    P('room_door', 300, 1600, 880, { in: stagger(t0, 1), sx: t > wf - .4 ? .3 : 1, sway: .003 }); if (t > wd - .1) cue('ding', wd, 'chime', 300, 300);
    if (t > wf - .4) person(lerp(360, 470, hug), 1840, 30, DAD, { in: wf - .4, mood: hug > .5 ? 'beam' : 'hopeful', look: 1, key: 'dad', aR: hug > .3 ? .6 : -1.2 });
    person(lerp(760, 610, hug), 1840, 32, DAU, { in: stagger(t0, 2), mood: t > wf ? (hug > .3 ? 'beam' : 'surprised') : 'neutral', look: -1, key: 'dau', aL: hug > .3 ? .6 : -1.2 });
    if (hug > .9) { glow(540, 1400, 420, '#FFD27A', .7); cue('hug', wh, 'sparkle', 540, 300); }
    camEnd();
  }
  function shPackage(t, lt) {    // he hands her a package: the first gift in years; inside, the stone marten scarf
    const t0 = t - lt, wp = WT('package', 'package'), ws = WT('package', 'scarf'), open = t > ws - .3;
    camBegin(540, 1050, 1.08); board('warm');
    person(330, 1840, 30, DAD, { in: t0 + .02, mood: 'warm', look: 1, key: 'dad', aR: t > wp - .2 && !open ? .4 : -1.2 });
    if (t > wp - .2 && !open) P('prop_trunk', 470, 1420, 150, { in: wp - .2, tint: [220, 90, 80], snd: 'pop' });
    person(720, 1840, 32, DAU, { in: t0 + .05, mood: open ? 'awe' : 'surprised', look: -1, key: 'dau', aL: open ? .6 : -1.2, aR: open ? .6 : -1.2 });
    if (open) { scarf(560, 1260, 160, 1, .9); cue('scarf', ws - .2, 'sparkle', 560, 400); }
    camEnd();
  }
  function shLesson(t, lt) {     // the grudge goes first (the rain cloud peels), then the door opens on the gift
    const t0 = t - lt, wg = WT('lesson', 'grudge'), wd = WT('lesson', 'door'), open = ease(seg(t, wd - .3, wd + .5));
    camBegin(540, 1000, 1.0); board('plum'); storm(540, 900, 260, t, t0, wg + .2);
    if (open > 0) glow(560, 1250, 420, '#FFD27A', open);
    P('room_door', lerp(560, 400, open), 1600, 880, { in: t0 + .1, sx: lerp(1, .3, open), sway: .003, snd: false });
    if (open > .5) scarf(600, 1300, 140, 1, .6); if (open > 0) cue('dooro', wd - .3, 'creak', 560, 500);
    camEnd();
  }
  function shClose(t, lt) {      // who are you still holding something against?
    const t0 = t - lt, wa = WT('close', 'against');
    camBegin(540, 1000, 1.0); board('plum'); storm(540, 1060, 260, t, wa - .3);
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0, aR: t > wa - .2 ? .3 : -1.2 });
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('parents') - .12, shParents], [S('checks') - .12, shChecks], [S('lecture') - .12, shLecture], [S('hug') - .12, shHug], [S('store') - .12, shStore], [S('remember') - .12, shRemember], [S('wearing') - .12, shWearing], [S('forgot') - .12, shForgot], [S('doorbell') - .12, shDoorbell], [S('package') - .12, shPackage], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
