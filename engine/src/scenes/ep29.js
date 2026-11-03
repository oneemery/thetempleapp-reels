window.CHEAP = true; window.FELT = true;
// Episode 29, flannelgraph cut: "Barefoot" (V.H. runs on the beach) built from the felt cutout kit (kit/cutouts) on felt boards.
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



























  const VH = { ...C.dreamer, name: 'vh', coat: '#B8463A', sleeve: '#B8463A', stripes: null, hair: '#5A3A24', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const VHB = { ...VH, name: 'vhb', coat: '#E6B82A', sleeve: '#E6B82A' };
  const LITTLE = { ...VH, name: 'little', coat: '#3F8F8A', sleeve: '#3F8F8A' };
  const PA = { ...C.blake, name: 'pa', coat: '#F3EBDC', sleeve: '#F3EBDC', hat: 'fedora', hatCol: '#E9DFC8', band: '#3F6FB0' }, MA = { ...C.dreamer, name: 'ma', coat: '#3F6FB0', sleeve: '#3F6FB0', stripes: null, hair: '#2B1E19' };
  const DOC = { ...C.skeptic, name: 'doc', coat: '#F3EBDC', sleeve: '#F3EBDC', lapel: '#D9D4C8', tie: '#3F6FB0', hat: null };
  const DOC2 = { ...DOC, name: 'doc2', hair: '#9A958C', glasses: false };
  const ISAIAH = { ...C.paul, name: 'isaiah', coat: '#3F6FB0', sleeve: '#3F6FB0', pants: '#3F6FB0', sash: '#E6B82A', hair: '#ECE8DF', hairStyle: 'neat', beard: .6, beardCol: '#ECE8DF' };
  function beach(t, t0, o = {}) { const e = i => o.still ? null : stagger(t0, i, .05);
    P('island_sun', 860, 820, 170, { in: e(0), sway: .03 }); P('island_palm', 920, 1500, 520, { in: e(1), sway: .04 + .02 * Math.sin(t * 2) });
    for (let i = 0; i < 4; i++) P('island_waves', 140 + i * 270, 1520, 120, { in: e(2 + i), sway: .02 });
    for (let i = 0; i < 4; i++) P('sky_beach', 140 + i * 270, 1700 + (i % 2) * 10, 150, { in: e(6 + i), sway: 0 }); }
  function splash(x, y, t, t1) { for (let i = 0; i < 3; i++) { const k = seg(t, t1 + i * .25, t1 + i * .25 + .8); if (k > 0 && k < 1) glow(x + i * 60, y, 60 + 120 * k, '#FFFFFF', .5 * (1 - k)); } }
  const BX = 540, BBY = 1760, BH = 600;
  function wires(a) { if (window.CUEMODE || a <= 0) return; flushBrush(); push(); stroke(120, 120, 130, 220 * a); strokeWeight(6); noFill();
    for (let i = 0; i < 5; i++) { const y = BBY - BH * .36 + i * 34; line(BX - 120, y, BX + 140, y + 10); } pop(); }
  function herBed(t, t0, o = {}) {
    board(o.day ? 'plum' : 'night'); P('room_window', 880, 1250, 260, { in: o.still ? null : stagger(t0, 0) }); if (!o.day) P('island_moon', 900, 1230, 50, { in: o.still ? null : stagger(t0, 1), snd: false });
    P('room_bed', BX, BBY, BH, { in: o.still ? null : stagger(t0, 2), sway: .002 }); const tin = o.still ? -9 : stagger(t0, 3);
    person(BX, BBY - BH * .44, 11, VH, { in: o.still ? null : tin, mood: o.mood || 'sad', key: 'vbed', snd: false, aL: -1.2, aR: -1.2 });
    if (T > tin + .4) piecePart('room_bed', BX, BBY, BH, .43, 1); wires(o.wires ?? 0);
  }
  function runner(t, t0, x0, x1, dur, key, u = 24) { const k = ((t - t0) / dur) % 1, x = lerp(x0, x1, k), hop = Math.abs(Math.sin((t - t0) * 9)) * 18;
    person(x, 1780 - hop, u, VHB, { mood: 'joy', look: x1 > x0 ? 1 : -1, key, snd: false, aL: .4 + .3 * Math.sin(t * 9), aR: .4 - .3 * Math.sin(t * 9) }); }

  // ---------- shots ----------
  function shHook(t, lt) {   // barely able to stand; every day, in her mind, barefoot on the beach
    const t0 = t - lt, wm = WT('hook', 'mind'), wb = WT('hook', 'beach');
    camBegin(540, 1050, 1.04); herBed(t, t0, { day: true, wires: 1, mood: t > wm ? 'hopeful' : 'sad' });
    if (t > wm - .3) { P('island_cloud', 400, 1080, 340, { in: wm - .3, snd: 'pop' }); P('sky_beach', 400, 1040, 140, { in: wm - .2, snd: false, sway: 0 }); if (t > wb - .2) person(lerp(330, 470, ((t - wb) * .4) % 1), 1000, 6, VHB, { in: wb - .2, mood: 'joy', key: 'vc', snd: false }); }
    camEnd();
  }
  function shVerse(t, lt) {      // Isaiah: renew their strength; run and not be weary; walk and not faint
    const t0 = t - lt, wr = WT('verse', 'renew'), wru = WT('verse', 'run');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, wr - .2, wr + .6)));
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (t > wru - .2) P('bible_star', 790, 1000, 200, { in: wru - .2, snd: 'chime', sway: .04 });
    person(420, 1840, 40, ISAIAH, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'isaiah', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // they shall run, even if it starts in your mind
    const t0 = t - lt, wm = WT('meaning', 'mind');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wm - .3) { P('island_cloud', 780, 1150, 320, { in: wm - .3, snd: 'pop' }); P('sky_beach', 780, 1110, 130, { in: wm - .2, snd: false, sway: 0 }); person(lerp(720, 840, ((t - wm) * .4) % 1), 1070, 6, VHB, { in: wm - .1, mood: 'joy', key: 'mc', snd: false }); }
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shSick(t, lt) {       // a serious blood clot condition; spreading; hardened arteries; arthritis
    const t0 = t - lt, wb = WT('sick', 'blood'), ws = WT('sick', 'spread');
    camBegin(540, 1050, 1.04); herBed(t, t0, { day: true, mood: 'sad' });
    if (t > wb - .2) { const k = ease(seg(t, ws - .2, ws + 1.2)); glow(540, 1500, 80 + 260 * k, '#E05A4A', .35); }
    camEnd();
  }
  function shDoctors(t, lt) {    // her doctors disagreed; nothing helped
    const t0 = t - lt, wd = WT('doctors', 'agree'), wn = WT('doctors', 'nothing');
    camBegin(540, 1050, 1.04); herBed(t, t0, { day: true, still: true, mood: 'sad' });
    person(170, 1860, 26, DOC, { in: t0 + .05, mood: t > wd ? 'skeptical' : 'neutral', look: 1, key: 'doc', talk: t > wd - .3 && t < wn ? talk(t) : 0 });
    person(920, 1860, 26, DOC2, { in: t0 + .1, mood: t > wd ? 'determined' : 'neutral', look: -1, key: 'doc2', talk: t > wd && t < wn ? talk(t + 1) : 0 });
    if (t > wn - .2) P('sky_raincloud', 540, 1000, 200, { in: wn - .2, sway: .03, snd: 'pop' });
    camEnd();
  }
  function shBed(t, lt) {        // she gave up what she loved; wires from hips to toes; heavy stockings to touch the floor
    const t0 = t - lt, ww = WT('bed', 'wires'), ws = WT('bed', 'stockings');
    camBegin(540, 1050, 1.04); herBed(t, t0, { day: true, still: true, mood: 'sad', wires: ease(seg(t, ww - .3, ww + .3)) });
    if (t > ws - .2) { P('island_cloud', 330, 1080, 260, { in: ws - .2, tint: [170, 170, 180], snd: 'pop' }); }
    camEnd();
  }
  function shPostcard(t, lt) {   // a friend's postcard of a beach; summers by the sea with her parents
    const t0 = t - lt, wp = WT('postcard', 'postcard'), ws = WT('postcard', 'summers'), wg = WT('postcard', 'girl');
    camBegin(540, 1050, 1.04); herBed(t, t0, { day: true, still: true, wires: 1, mood: t > ws ? 'happy' : 'neutral' });
    if (t > wp - .2) { const k = ease(seg(t, wp - .2, wp + .3)); flushBrush(); push(); noStroke(); fill(58, 42, 34, 255 * k); rect(608, 1128, 240, 160, 10); fill(246, 240, 226, 255 * k); rect(600, 1120, 240, 160, 10); pop(); P('sky_beach', 720, 1260, 110, { in: wp - .1, snd: 'pop', sway: 0 }); P('island_waves', 720, 1200, 70, { in: wp, snd: false, sway: .02 }); }
    if (t > ws - .3) { P('island_cloud', 330, 1080, 340, { in: ws - .3, snd: 'pop' }); person(280, 1020, 7, PA, { in: ws - .2, mood: 'happy', key: 'pa', snd: false }); person(340, 1020, 7, MA, { in: ws - .1, mood: 'happy', key: 'ma', snd: false });
      if (t > wg - .2) person(390, 1020, 5, LITTLE, { in: wg - .2, mood: 'joy', key: 'lit', snd: false }); }
    camEnd();
  }
  function shBeach(t, lt) {      // running free on the beach: wet sand, icy water over her toes, crashing waves; every day for a week
    const t0 = t - lt, ws = WT('beach', 'sand'), wi = WT('beach', 'icy'), wc = WT('beach', 'crashing'), wd = WT('beach', 'day');
    camBegin(540, 1000, 1.0); board('day'); beach(t, t0);
    runner(t, t0 + .3, 100, 980, 4, 'run');
    if (t > wi - .1) splash(400, 1560, t, wi);
    if (t > wc - .1) { splash(200, 1500, t, wc); cue('waves', wc, 'whoosh', 540, 400); }
    if (t > wd - .3) tally(t, 200, 760, 7, Array.from({ length: 7 }, (_, i) => wd - .3 + i * .1), 110);
    camEnd();
  }
  function shPain(t, lt) {       // one morning, moving to the couch, a terrible pain; can't sit up or lie down; over a minute
    const t0 = t - lt, wc = WT('pain', 'couch'), wp = WT('pain', 'pain'), wm = WT('pain', 'minute');
    camBegin(540, 1000, 1.0); board('plum'); P('room_window', 840, 1100, 300, { in: t0 + .05 }); P('room_armchair', 540, 1820, 520, { in: t0 + .1 });
    person(540, 1820 - 520 * .22, 22, VH, { in: wc - .3, mood: t > wp ? 'worried' : 'neutral', key: 'vh', snd: false, look: t > wp ? (Math.sin(t * 20) * .3) : 0 });
    if (T > wc + .1) piecePart('room_armchair', 540, 1820, 520, .58, 1);
    if (t > wp - .1) { glow(540, 1500, 300 + 40 * Math.sin(t * 12), '#E05A4A', .5); cue('pain', wp, 'door', 540, 300); }
    if (t > wm - .3) P('room_clock', 220, 1300, 160, { in: wm - .3, snd: 'pop' });
    camEnd();
  }
  function shFree(t, lt) {       // when it stopped she was free; the wires cut; not little by little; instantly
    const t0 = t - lt, wf = WT('free', 'free'), wc = WT('free', 'cut'), wi = WT('free', 'instantly');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1400, 520, '#FFD27A', .2 + .5 * ease(seg(t, wf - .2, wf + .6)));
    if (t < wc + .4) { const k = ease(seg(t, wc - .1, wc + .4)); flushBrush(); push(); stroke(120, 120, 130, 220 * (1 - k)); strokeWeight(6); for (let i = 0; i < 4; i++) { const y = 1640 + i * 40; line(440 - k * 120, y, 520 - k * 60, y + 6); line(560 + k * 60, y, 640 + k * 120, y + 6); } pop(); }
    if (t > wc) cue('cut', wc, 'pop', 540, 300); if (t > wi) cue('inst', wi, 'sparkle', 540, 300);
    person(540, 1860, 32, VH, { in: t0 + .05, mood: t > wf ? 'joy' : 'surprised', look: 0, key: 'vh', aL: t > wi ? .8 : -1.2, aR: t > wi ? .8 : -1.2 });
    camEnd();
  }
  function shLesson(t, lt) {     // she didn't imagine her legs getting better; she imagined running
    const t0 = t - lt, wr = WT('lesson', 'running');
    camBegin(540, 1000, 1.0);
    if (t < wr - .3) { board('plum'); P('island_cloud', 540, 1150, 300, { in: t0 + .1, tint: [170, 170, 180], snd: 'pop' }); person(540, 1860, 30, VH, { in: t0 + .05, mood: 'neutral', look: 0, key: 'vh' }); }
    else { board('day'); beach(t, wr - .3); runner(t, wr - .3, 980, 100, 4, 'run2'); }
    camEnd();
  }
  function shClose(t, lt) {      // where would you run, if nothing was holding you?
    const t0 = t - lt, wr = WT('close', 'run');
    camBegin(540, 1000, 1.0); board('plum'); if (t > wr - .3) { P('island_cloud', 780, 1150, 320, { in: wr - .3, snd: 'pop' }); P('sky_beach', 780, 1110, 130, { in: wr - .2, snd: false, sway: 0 }); }
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'holding'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('sick') - .12, shSick], [S('doctors') - .12, shDoctors], [S('bed') - .12, shBed], [S('postcard') - .12, shPostcard], [S('beach') - .12, shBeach], [S('pain') - .12, shPain], [S('free') - .12, shFree], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
