window.CHEAP = true; window.FELT = true;
// Episode 5, flannelgraph cut: "The Watch" (the Sacramento couple) built from the felt cutout kit (kit/cutouts) on felt boards.
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



  const HUSB = { ...C.neville, name: 'husband', coat: '#5A4636', sleeve: '#5A4636', lapel: '#3E3026', scarf: '#8C3B3B', pants: '#3E3026', hat: null, hair: '#2B1E19', torso: 7.6, leg: 4.8 };
  const WIFE = { ...C.dreamer, name: 'wife', coat: '#B8463A', sleeve: '#B8463A', stripes: null, hair: '#5A3A24', skin: '#EFCBA6', torso: 7.4, leg: 4.6, w: 4.6, hw: 2.3, hh: 2.7 };
  const JEWELER = { ...C.skeptic, name: 'jeweler', coat: '#E9DFC8', sleeve: '#E9DFC8', lapel: '#8E8F96', tie: '#2E3A52', hat: null };
  const THIEF = { ...C.blake, name: 'thief', coat: '#3A3A44', sleeve: '#3A3A44', lapel: '#22222A', pants: '#22222A', hat: 'flatcap', hatCol: '#22222A', band: '#22222A' };
  const COP = { ...C.skeptic, name: 'cop', coat: '#2E3A6B', sleeve: '#2E3A6B', lapel: '#22284A', tie: '#22284A', pants: '#22284A', hat: 'cap', hatCol: '#22284A', band: '#C9963A', glasses: false };
  function watch(x, y, s, a = 1, gl = 0) {   // a felt wristwatch: brown strap, gold case, cream face, two hands
    if (window.CUEMODE || a <= 0) return; if (gl > 0) glow(x, y, s * 2.4, '#FFD27A', gl);
    flushBrush(); push(); translate(x, y); rotate(-.15); noStroke();
    fill(30, 18, 12, 70 * a); rect(-s * .32 + 5, -s * 1.1 + 6, s * .64, s * 2.2, s * .2); ellipse(5, 6, s * 1.2, s * 1.2);
    fill(122, 74, 46, 255 * a); rect(-s * .32, -s * 1.1, s * .64, s * 2.2, s * .2);
    fill(244, 192, 74, 255 * a); ellipse(0, 0, s * 1.2, s * 1.2); fill(246, 240, 226, 255 * a); ellipse(0, 0, s * .92, s * .92);
    stroke(42, 36, 48, 255 * a); strokeWeight(s * .07); line(0, 0, 0, -s * .32); line(0, 0, s * .24, 0); pop();
  }
  function bedroom(t, t0, night, o = {}) { board(night ? 'night' : 'warm'); if (o.day > 0) board('warm', o.day); const e = i => o.still ? null : stagger(t0, i);
    P('room_window', 760, 900, 480, { in: e(0), sway: .004 }); P('room_lamp', 150, 1150, 240, { in: e(1) });
    P('room_desk', 300, 1660, 400, { in: e(2), sway: .003 }); P('prop_trunk', 300, 1300, 150, { in: e(3), tint: o.boxTint });
    rug(600, 1880, 340, { in: e(4) }); if (night) glow(150, 1000, 300, '#FFC07A', .6); }

  // ---------- shots ----------
  function shHook(t, lt) {   // a watch in Emery's hand; on "stole" it peels away; on "off" he mimes it anyway (a ghost watch)
    const t0 = t - lt, ws = WT('hook', 'watch') + .25, wo = WT('hook', 'off'), gone = ease(seg(t, ws, ws + .3));
    camBegin(540, 1000, 1.0); board('plum');
    if (t > ws) cue('stolen', ws, 'whoosh', 640, 300);
    host(t, 540, 1800, 40, { in: t0 + .02, mood: t > wo - .2 ? 'determined' : t > ws ? 'surprised' : 'warm', aR: .3,
      holdR: (x, y, u) => watch(x, y - u * 1.2, u * 1.6, t < ws ? 1 : t > wo - .2 ? .45 : 1 - gone, t > wo - .2 ? .5 : 0) });
    camEnd();
  }
  function shVerse(t, lt) {      // Paul by candlelight; faith lights up
    const t0 = t - lt, wf = WT('verse', 'faith'), lit = ease(seg(t, wf - .1, wf + .5));
    camBegin(540, 1050, 1.0 + .02 * lt); board('plum'); glow(560, 1050, 640, '#FFD27A', .35 + .55 * lit);
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (lit > 0) { P('bible_star', 700, 760, 260, { in: wf - .1, snd: 'chime', sway: .04 }); }
    person(440, 1840, 40, C.paul, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'paul', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // sight: an empty grey box; faith: the watch still glowing in it
    const t0 = t - lt, wg = WT('meaning', 'gone'), ws = WT('meaning', 'still'), f = ease(seg(t, ws - .2, ws + .5));
    camBegin(540, 1000, 1.0); board('plum');
    P('prop_trunk', 760, 1300, 300, { in: stagger(t0, 0), tint: f > 0 ? null : [150, 150, 150] });
    if (f > 0) watch(760, 1080, 70, f, f); if (t > ws) cue('still', ws, 'chime', 760, 300);
    host(t, 320, 1800, 36, { in: t0 + .02, mood: t > ws ? 'warm' : t > wg ? 'sad' : 'neutral', aR: t > ws - .2 ? .4 : -1.2, look: .6 });
    camEnd();
  }
  function shCouple(t, lt) {     // the gift: she hands him the wristwatch
    const t0 = t - lt, ww = WT('couple', 'wristwatch'), give = ease(seg(t, ww - .3, ww + .6));
    camBegin(540, 1000, 1.0); bedroom(t, t0, false);
    person(380, 1830, 30, WIFE, { in: stagger(t0, 5), mood: 'happy', look: 1, key: 'wife', aR: t > ww - .4 && give < 1 ? .4 : -1.2 });
    person(760, 1830, 32, HUSB, { in: stagger(t0, 6), mood: give >= 1 ? 'beam' : 'happy', look: -1, key: 'hus', aL: give >= 1 ? .3 : -1.2 });
    if (t > ww - .3) { const x = lerp(470, 680, give); watch(x, 1300 - 60 * Math.sin(Math.PI * give), 80, 1, give >= 1 ? .5 : 0); if (give >= 1) cue('gift', ww + .3, 'sparkle', 680, 300); }
    camEnd();
  }
  function shRitual(t, lt) {     // night: off, to her, into the box. morning: out of the box, back to him
    const t0 = t - lt, wb = WT('ritual', 'box'), wm = WT('ritual', 'morning'), day = ease(seg(t, wm - .3, wm + .3));
    camBegin(540, 1000, 1.0); bedroom(t, t0, true, { still: true, day });
    const p1 = ease(seg(t, t0 + .3, wb - .3)), p2 = ease(seg(t, wb - .3, wb + .3)), p3 = ease(seg(t, wm + .2, wm + 1.2));
    let wx, wy; if (t < wb - .3) { wx = lerp(720, 470, p1); wy = 1320; } else if (t < wm + .2) { wx = lerp(470, 300, p2); wy = lerp(1320, 1240, p2); } else { wx = lerp(300, 720, p3); wy = lerp(1240, 1320, p3) - 60 * Math.sin(Math.PI * p3); }
    if (!(t > wb + .3 && t < wm + .2)) watch(wx, wy, 78);
    if (t > wb - .1) cue('box', wb, 'pat', 300, 200); if (t > wm) cue('box2', wm + .2, 'pat', 300, 200);
    person(450, 1830, 30, WIFE, { mood: day > .5 ? 'happy' : 'sleepy', look: 1, key: 'wife', aR: .3 });
    person(760, 1830, 32, HUSB, { mood: day > .5 ? 'happy' : 'sleepy', look: -1, key: 'hus', aL: .3 });
    camEnd();
  }
  function shStolen(t, lt) {     // morning: the box is empty; they remember; stolen
    const t0 = t - lt, wg = WT('stolen', 'gone'), wr = WT('stolen', 'remembered'), wst = WT('stolen', 'stolen'), [sx, sy] = shakeCam(t, wst, 14);
    camBegin(540 + sx, 1000 + sy, 1.0); bedroom(t, t0, false, { still: true, boxTint: t > wg ? [170, 170, 170] : null });
    if (t > wg) cue('empty', wg, 'pop', 300, 200); if (t > wst) cue('stolen2', wst, 'door', 540, 400);
    person(450, 1830, 30, WIFE, { mood: t > wst ? 'sad' : t > wg ? 'surprised' : 'happy', look: -1, key: 'wife', aL: t > wg && t < wr ? .5 : -1.2 });
    person(760, 1830, 32, HUSB, { mood: t > wst ? 'worried' : t > wg ? 'surprised' : 'happy', look: -1, key: 'hus', lookY: t > wr && t < wst ? -.5 : 0 });
    if (t > wr - .2 && t < wst) { P('island_cloud', 600, 1050, 260, { in: wr - .2, snd: 'pop' }); watch(600, 1050, 64, .8); }
    camEnd();
  }
  function shChance(t, lt) {     // they look at each other: an opportunity to practice what we believe
    const t0 = t - lt, wo = WT('chance', 'opportunity'), lit = ease(seg(t, wo - .2, wo + .6));
    camBegin(560, 1250, 1.3); bedroom(t, t0, false, { still: true }); if (lit > 0) glow(600, 1350, 520, '#FFD27A', .7 * lit);
    person(450, 1830, 30, WIFE, { mood: t > wo ? 'determined' : 'sad', look: 1, key: 'wife' });
    person(760, 1830, 32, HUSB, { mood: t > wo ? 'determined' : 'worried', look: -1, key: 'hus', talk: talk(t) });
    if (t > wo) cue('chance', wo, 'chime', 600, 300);
    camEnd();
  }
  function shImagined(t, lt) {   // the same ritual with a ghost watch, night and morning
    const t0 = t - lt, wb = WT('imagined', 'box'), wm = WT('imagined', 'morning'), day = ease(seg(t, wm - .3, wm + .3));
    camBegin(540, 1000, 1.0); bedroom(t, t0, true, { still: true, day });
    const p1 = ease(seg(t, t0 + .4, wb - .4)), p2 = ease(seg(t, wb - .4, wb + .2)), p3 = ease(seg(t, wm + .2, wm + 1.4));
    let wx, wy; if (t < wb - .4) { wx = lerp(720, 470, p1); wy = 1320; } else if (t < wm + .2) { wx = lerp(470, 300, p2); wy = lerp(1320, 1240, p2); } else { wx = lerp(300, 720, p3); wy = 1320 - 60 * Math.sin(Math.PI * p3); }
    if (!(t > wb + .2 && t < wm + .2)) watch(wx, wy, 78, .5, .5);
    person(450, 1830, 30, WIFE, { mood: 'sleepy', look: 1, key: 'wife', aR: .3 });
    person(760, 1830, 32, HUSB, { mood: 'sleepy', look: -1, key: 'hus', aL: .3 });
    if (t > t0 + .3) cue('ghost', t0 + .4, 'sparkle', 600, 300);
    camEnd();
  }
  function shWeeks(t, lt) {      // fourteen felt days
    const t0 = t - lt, wt = WT('weeks', 'two');
    camBegin(540, 1000, 1.0); bedroom(t, t0, true, { still: true });
    tally(t, 120, 760, 7, Array.from({ length: 7 }, (_, i) => t0 + .3 + i * .12), 140); tally(t, 120, 880, 7, Array.from({ length: 7 }, (_, i) => t0 + 1.2 + i * .12), 140);
    person(600, 1830, 30, WIFE, { mood: 'sleepy', look: 1, key: 'wife' }); watch(600, 1260, 78, .5, .4);
    camEnd();
  }
  function shStore(t, lt) {      // the jewelry store: a man brings a gem; the owner sees the watch on his wrist
    const t0 = t - lt, wg = WT('store', 'gem'), wn = WT('store', 'noticed'), seen = ease(seg(t, wn - .1, wn + .5));
    camBegin(540, 1000 + 80 * seen, 1.0 + .15 * seen); board('sand');
    P('room_painting', 300, 620, 240, { in: stagger(t0, 0) }); P('room_clock', 820, 600, 190, { in: stagger(t0, 1) });
    const bx = 620, bby = 1500, bh = 860; P('city_ticketbooth', bx, bby, bh, { in: stagger(t0, 2), sway: 0, tint: [255, 235, 190] });
    person(bx, bby - bh * .2, 26, JEWELER, { in: stagger(t0, 3), mood: t > wn ? 'surprised' : 'neutral', look: -.6, key: 'jew', snd: false });
    if (T > stagger(t0, 3) + .4) piecePart('city_ticketbooth', bx, bby, bh, .76, 1);
    person(250, 1840, 30, THIEF, { in: stagger(t0, 4), mood: 'neutral', look: 1, key: 'thief', aR: t > wg - .3 ? .4 : -1.2,
      holdR: t > wg - .3 ? (x, y, u) => P('bible_star', x, y, u * 3, { tint: [170, 220, 255], sway: .03, snd: false }) : null,
      hold: (x, y, u) => watch(x, y - u * .3, u * 2.4, 1, .9 * seen) });
    camEnd();
  }
  function shPolice(t, lt) {     // "a closer look at the stone": into the office, the telephone, the police
    const t0 = t - lt, wo = WT('police', 'office'), wp = WT('police', 'police');
    camBegin(540, 1000, 1.0); board('sand');
    P('room_door', 820, 1560, 900, { in: stagger(t0, 0), sway: .003 }); P('room_desk', 820, 1780, 360, { in: stagger(t0, 1) });
    const jx = lerp(380, 820, ease(seg(t, t0 + .3, wo + .2)));
    person(jx, 1830, 30, JEWELER, { mood: t > wp ? 'determined' : 'neutral', look: 1, key: 'jew', hold: (x, y, u) => P('bible_star', x, y, u * 2.6, { tint: [170, 220, 255], sway: .03, snd: false }) });
    if (t > wp - .4) { P('prop_telephone', 920, 1440, 200, { in: wp - .4, snd: 'chime' }); }
    if (t > wp - .1) person(lerp(-200, 220, ease(seg(t, wp, wp + .7))), 1840, 30, COP, { mood: 'determined', look: 1, key: 'cop', snd: false });
    camEnd();
  }
  function shFound(t, lt) {      // the apartment: stolen jewelry everywhere; the watch goes home; others get their things back
    const t0 = t - lt, wt = WT('found', 'ten'), ww = WT('found', 'watch'), wf = WT('found', 'forever'), home = t > ww - .4;
    if (!home) { camBegin(540, 1000, 1.0); board('night');
      for (let i = 0; i < 5; i++) P(i % 2 ? 'life_coinbag' : 'prop_money', 180 + i * 180, 1500 - (i % 2) * 60, 170, { in: stagger(t0, i, .12), tint: [255, 230, 160], snd: i ? false : 'cash' });
      if (t > wt) stars(540, 1200, t, wt);
      person(540, 1840, 30, COP, { mood: 'surprised', look: 0, key: 'cop', aL: .4, aR: .4 }); camEnd(); return; }
    camBegin(540, 1000, 1.0); bedroom(t, ww - .4, false, { still: true });
    person(450, 1830, 30, WIFE, { mood: 'joy', look: 1, key: 'wife', aR: .3 }); person(760, 1830, 32, HUSB, { mood: 'beam', look: -1, key: 'hus', aL: .4 });
    watch(620, 1260, 84, 1, .8); cue('back', ww - .3, 'sparkle', 620, 300);
    if (t > wf - .3) for (let i = 0; i < 4; i++) P(['prop_money', 'life_coinbag', 'prop_envelope', 'bible_star'][i], 150 + i * 260, 700, 120, { in: wf - .3 + i * .1, snd: i ? false : 'chime', sway: .04, tint: [255, 230, 160] });
    camEnd();
  }
  function shLesson(t, lt) {     // the ritual goes on, and the watch is real again
    const t0 = t - lt, wu = WT('lesson', 'until'), back = ease(seg(t, wu - .1, wu + .6));
    camBegin(540, 1000, 1.0); bedroom(t, t0, true, { still: true });
    person(450, 1830, 30, WIFE, { mood: back > .5 ? 'joy' : 'determined', look: 1, key: 'wife', aR: .3 }); person(760, 1830, 32, HUSB, { mood: back > .5 ? 'beam' : 'determined', look: -1, key: 'hus', aL: .3 });
    watch(600, 1260, 84, .45 + .55 * back, .5 + .4 * back); if (back > 0) cue('real', wu, 'chime', 600, 300);
    camEnd();
  }
  function shClose(t, lt) {      // what have you stopped doing? an empty box, a ghost of the thing still in it
    const t0 = t - lt, ws = WT('close', 'see');
    camBegin(540, 1000, 1.0); board('plum');
    P('prop_trunk', 780, 1320, 260, { in: stagger(t0, 0), tint: [170, 170, 170] }); if (t > ws - .2) { watch(780, 1110, 60, .5, .6); cue('ghost2', ws - .1, 'sparkle', 780, 300); }
    host(t, 330, 1810, 38, { in: t0 + .02, mood: 'warm', aR: t > ws - .3 ? .4 : -1.2, look: .6 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'move'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .1, shVerse], [S('meaning') - .1, shMeaning], [S('couple') - .15, shCouple], [S('ritual') - .15, shRitual], [S('stolen') - .1, shStolen],
    [S('chance') - .1, shChance], [S('imagined') - .15, shImagined], [S('weeks') - .1, shWeeks], [S('store') - .15, shStore], [S('police') - .1, shPolice],
    [S('found') - .15, shFound], [S('lesson') - .15, shLesson], [S('close') - .1, shClose], [S('cta') - .1, shCta], [S('comment') - .1, shComment],
  ]);
})();
