window.CHEAP = true; window.FELT = true;
// Episode 7, flannelgraph cut: "Two Letters" (the grandmother) built from the felt cutout kit (kit/cutouts) on felt boards.
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





  const GRAN = { ...C.dreamer, name: 'gran', coat: '#8C5A3C', sleeve: '#8C5A3C', stripes: null, hair: '#D8D2C8', skin: '#EFCBA6', torso: 7.2, leg: 4.4, w: 4.8, hw: 2.4, hh: 2.7 };
  const DIL = { ...C.dreamer, name: 'dil', coat: '#3F6FB0', sleeve: '#3F6FB0', stripes: null, hair: '#2B1E19', skin: '#E6B48C', torso: 7.2, leg: 4.6, w: 4.4 };
  const SON = { ...C.neville, name: 'son', coat: '#4F6B4A', sleeve: '#4F6B4A', lapel: '#3A4F36', scarf: '#C9963A', pants: '#3A3A44', hat: null, hair: '#5A4636', torso: 7.8, leg: 5 };
  const KID = { ...C.dreamer, name: 'grandson' };
  function sitIn(t, cx, by, h, spec, o = {}) {
    P('room_armchair', cx, by, h, { in: o.in, sway: .003 }); person(cx, by - h * .22, o.u || 22, spec, o); if (T > (o.in ?? -9) + .4) piecePart('room_armchair', cx, by, h, .58, 1);
  }
  const storm = (x, y, s, t, tin, tout) => { if (t > tin) { P('sky_raincloud', x, y, s, { in: tin, out: tout, sway: .03, snd: 'pop' }); } };
  const envHand = (x, y, u) => P('prop_envelope', x, y + u * .6, u * 3.6, { sway: .03, snd: false });

  // ---------- shots ----------
  function shHook(t, lt) {   // she argues under a rain cloud; far away behind a closed door, the daughter in law hears nothing
    const t0 = t - lt, wn = WT('hook', 'never');
    camBegin(540, 1000, 1.0); board('plum');
    storm(330, 1100, 300, t, t0 + .3);
    person(330, 1840, 32, GRAN, { in: t0 + .05, mood: 'determined', look: 1, key: 'gran', talk: talk(t), aR: .2 + .3 * Math.abs(Math.sin(t * 5)) });
    P('room_door', 860, 1640, 620, { in: t0 + .2, sway: .003 }); if (t > wn - .2) person(860, 1860, 20, DIL, { in: wn - .2, mood: 'neutral', look: 0, key: 'dil' });
    camEnd();
  }
  function shVerse(t, lt) {      // Proverbs: the wise king with his scroll; a glow at the heart
    const t0 = t - lt, wh = WT('verse', 'heart'), lit = ease(seg(t, wh - .2, wh + .5));
    camBegin(540, 1050, 1.0 + .02 * lt); board('plum'); glow(540, 1300, 520, '#FFD27A', .35 + .5 * lit);
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); P('bible_crown', 560, 780, 220, { in: stagger(t0, 1), sway: .03 });
    person(540, 1840, 40, C.paul, { in: stagger(t0, 2), mood: 'wise', aL: .6, key: 'paul', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // out loud: a little pop; inside: the rain cloud that stays
    const t0 = t - lt, wl = WT('meaning', 'loud'), wi = WT('meaning', 'inside');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wl - .2) P('island_cloud', 780, 1000, 200, { in: wl - .2, out: wl + .6, snd: 'pop' });
    if (t > wi - .2) { P('island_cloud', 540, 1060, 300, { in: wi - .2, snd: 'pop' }); P('sky_raincloud', 540, 1040, 160, { in: wi, snd: false, sway: .04 }); }
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0, aR: t > wi - .2 ? .3 : -1.2 });
    camEnd();
  }
  function shFight(t, lt) {      // the daughter in law points her out of the house; for two years the family is gone from her
    const t0 = t - lt, wo = WT('fight', 'ordered'), wc = WT('fight', 'contact'), walk = ease(seg(t, wo + .3, wo + 1.5));
    camBegin(540, 1000, 1.0); board('day'); P('life_house', 760, 1560, 700, { in: stagger(t0, 0), sway: .004 });
    person(640, 1860, 30, DIL, { in: stagger(t0, 1), mood: 'determined', look: -1, key: 'dil', aL: t > wo - .2 ? .5 : -1.2, out: wc + .2 });
    person(860, 1860, 30, SON, { in: stagger(t0, 2), mood: 'worried', look: -1, key: 'son', out: wc + .35 }); person(980, 1860, 20, KID, { in: stagger(t0, 3), mood: 'sad', look: -1, key: 'kid', out: wc + .5 });
    person(lerp(440, 160, walk), 1860, 30, GRAN, { in: stagger(t0, 4), mood: t > wo ? 'sad' : 'worried', look: walk > .1 && walk < 1 ? -1 : 1, key: 'gran' });
    if (t > wc) tally(t, 400, 760, 2, [wc + .3, wc + .5], 140);
    camEnd();
  }
  function shGifts(t, lt) {      // a gift sails off to the grandson; then the daily argument, rain on "selfish"
    const t0 = t - lt, wg = WT('gifts', 'gifts'), wa = WT('gifts', 'argued'), ws = WT('gifts', 'selfish');
    camBegin(540, 1000, 1.0); board('sand');
    if (t > wg - .3 && t < wg + .9) { const k = seg(t, wg - .3, wg + .8), [x, y] = arcPt([380, 1500], [1200, 1100], -300, ease(k)); P('prop_trunk', x, y, 120, { tint: [220, 90, 80], rot: k * 3, sway: 0, snd: false }); cue('gift', wg - .3, 'whoosh', 700, 300); }
    storm(380, 1100, 300, t, wa - .2);
    person(380, 1840, 32, GRAN, { in: stagger(t0, 0), mood: t > wa ? 'determined' : 'hopeful', look: 1, key: 'gran', talk: t > wa ? talk(t) : null, aR: t > wg - .3 && t < wg + .2 ? .5 : -1.2 });
    if (t > ws) { cue('rain', ws, 'whoosh', 380, 300); stars(380, 1200, t, ws); }
    camEnd();
  }
  function shLecture(t, lt) {    // Neville speaks on the game of life; the rain cloud over her lifts
    const t0 = t - lt, wr = WT('lecture', 'realized'), wc = WT('lecture', 'change'), lit = ease(seg(t, wr - .1, wr + .6));
    camBegin(540, 1000, 1.0); board('plum'); glow(700, 1300, 500, '#FFD27A', .5 * lit);
    person(300, 1840, 34, C.neville, { in: stagger(t0, 0), mood: 'warm', look: 1, key: 'nev', aR: .4, talk: t < wr ? talk(t) : null });
    sitIn(t, 760, 1840, 420, GRAN, { in: stagger(t0, 1), mood: t > wc - .2 ? 'determined' : t > wr ? 'surprised' : 'neutral', look: -1, key: 'gran' });
    storm(760, 1160, 240, t, stagger(t0, 2), wr);
    camEnd();
  }
  function shLetters(t, lt) {    // night: she imagines two letters, one in each hand (ghostly, glowing)
    const t0 = t - lt, wt = WT('letters', 'two'), wl = WT('letters', 'loving'), lit = ease(seg(t, wt - .2, wt + .6));
    camBegin(540, 1000, 1.0); board('night'); P('room_window', 760, 860, 440, { in: stagger(t0, 0) }); P('room_lamp', 160, 1150, 240, { in: stagger(t0, 1) }); glow(160, 1000, 300, '#FFC07A', .6);
    if (lit > 0) glow(540, 1400, 420, '#FFE2A8', .7 * lit); if (t > wt) cue('two', wt, 'sparkle', 540, 300);
    person(540, 1840, 34, GRAN, { in: stagger(t0, 2), mood: t > wl ? 'beam' : 'hopeful', key: 'gran', aL: t > wt - .1 ? .6 : -1.2, aR: t > wt + .2 ? .6 : -1.2,
      hold: t > wt - .1 ? envHand : null, holdR: t > wt + .2 ? envHand : null });
    camEnd();
  }
  function shRead(t, lt) {       // she reads them over and over in her chair, and falls asleep happy
    const t0 = t - lt, wf = WT('read', 'asleep'), wh = WT('read', 'happy');
    camBegin(480, 1300, 1.2); board('night'); P('room_lamp', 160, 1150, 240, {}); glow(420, 1450, 420, '#FFD27A', .6);
    sitIn(t, 420, 1840, 440, GRAN, { mood: t > wf - .2 ? 'sleepy' : 'beam', key: 'gran', look: .3, lookY: t < wf ? .4 : 0, aR: .3, holdR: envHand });
    zzz(560, 1280, t, wf, .9);
    camEnd();
  }
  function shNights(t, lt, dur) { // eight nights: moon, eight felt dots
    const t0 = t - lt, we = WT('nights', 'eight');
    camBegin(540, 1000, 1.0); board('night'); P('island_moon', 820, 560, 200, { in: t0 + .1 });
    tally(t, 140, 1000, 8, Array.from({ length: 8 }, (_, i) => t0 + .4 + i * Math.max(.12, (we - t0 - .2) / 8)), 115);
    sitIn(t, 540, 1840, 420, GRAN, { mood: 'sleepy', key: 'gran', aR: .3, holdR: envHand }); zzz(680, 1300, t, t0 + .3, .8);
    camEnd();
  }
  function shNinth(t, lt) {      // the ninth morning: one envelope through the door, two letters inside
    const t0 = t - lt, we = WT('ninth', 'envelope'), wt = WT('ninth', 'two'), open = t > wt - .2;
    camBegin(540, 1000, 1.0); board('day'); P('room_door', 300, 1500, 880, { in: stagger(t0, 0), sway: .003 }); rug(600, 1880, 320, { in: stagger(t0, 1) });
    tally(t, 140, 700, 9, Array.from({ length: 9 }, (_, i) => t0 + .1 + i * .05), 100);
    if (t > we - .3 && !open) { const k = seg(t, we - .3, we + .4), [x, y] = arcPt([320, 1100], [700, 1320], -240, ease(k)); P('prop_envelope', x, y, 150, { rot: k * 5, sway: 0, snd: false }); cue('env9', we - .3, 'whoosh', 500, 300); }
    if (open) { P('prop_scroll', 620, 1200, 170, { in: wt - .2, rot: -.2, snd: 'chime' }); P('prop_scroll', 820, 1200, 170, { in: wt, rot: .2, snd: false }); glow(720, 1150, 300, '#FFD27A', .7); }
    person(760, 1840, 32, GRAN, { in: stagger(t0, 2), mood: open ? 'joy' : 'surprised', look: -.6, lookY: -.3, key: 'gran', aL: open ? .6 : -1.2, aR: open ? .6 : -1.2 });
    camEnd();
  }
  function shInvite(t, lt) {     // the family, waving her in; almost exactly what she imagined
    const t0 = t - lt, wv = WT('invite', 'visit'), wi = WT('invite', 'imagined');
    camBegin(540, 1000, 1.0); board('warm'); P('life_house', 760, 1560, 700, { in: stagger(t0, 0), sway: .004 });
    person(620, 1860, 30, DIL, { in: stagger(t0, 1), mood: 'happy', look: -1, key: 'dil', aL: t > wv - .3 ? .3 + .3 * Math.sin(t * 8) : -1.2 });
    person(840, 1860, 30, SON, { in: stagger(t0, 2), mood: 'beam', look: -1, key: 'son' }); person(980, 1860, 20, KID, { in: stagger(t0, 3), mood: 'joy', look: -1, key: 'kid', aR: .6 });
    person(260, 1860, 30, GRAN, { in: stagger(t0, 4), mood: 'beam', look: 1, key: 'gran', holdR: envHand });
    if (t > wi - .2) { P('island_cloud', 260, 1060, 240, { in: wi - .2, snd: 'pop' }); P('prop_envelope', 260, 1050, 100, { in: wi, snd: false }); }
    camEnd();
  }
  function shLesson(t, lt) {     // two years of arguing: a shut grey door; eight nights of letters: the door opens to warm light
    const t0 = t - lt, wo = WT('lesson', 'opened'), open = ease(seg(t, wo - .2, wo + .6));
    camBegin(540, 1000, 1.0); board('night'); if (open > 0) board('warm', open);
    if (open > 0) glow(560, 1250, 420 * (.4 + .6 * open), '#FFD27A', 1);
    P('room_door', lerp(560, 400, open), 1600, 880, { in: stagger(t0, 0), sx: lerp(1, .3, open), sway: .003, tint: open > 0 ? null : [150, 150, 150] });
    storm(760, 900, 220, t, stagger(t0, 1), wo - .2); if (open > 0) { P('prop_envelope', 760, 940, 130, { in: wo, snd: 'chime' }); cue('open', wo, 'creak', 560, 600); }
    camEnd();
  }
  function shClose(t, lt) {      // who are you arguing with in your head?
    const t0 = t - lt, wh = WT('close', 'head');
    camBegin(540, 1000, 1.0); board('plum'); storm(540, 1060, 260, t, wh - .2);
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0, aR: t > wh - .2 ? .3 : -1.2 });
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('fight') - .12, shFight], [S('gifts') - .12, shGifts], [S('lecture') - .12, shLecture], [S('letters') - .12, shLetters], [S('read') - .12, shRead], [S('nights') - .12, shNights], [S('ninth') - .12, shNinth], [S('invite') - .12, shInvite], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
