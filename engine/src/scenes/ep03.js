window.CHEAP = true; window.FELT = true;
// Episode 3, flannelgraph cut: "Do Nothing" (Neville's army discharge) built from the felt cutout kit (kit/cutouts) on felt boards.
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

  const SOLDIER = { ...C.skeptic, name: 'soldier', coat: '#5E6B3A', sleeve: '#5E6B3A', lapel: '#4A5230', tie: '#4A5230', pants: '#4A5230', hat: 'cap', hatCol: '#4A5230', band: '#4A5230', glasses: false };
  const OFFICER = { ...C.blake, name: 'officer', coat: '#4F5A36', sleeve: '#4F5A36', lapel: '#C9963A', pants: '#3E4528', hat: 'cap', hatCol: '#3E4528', band: '#C9963A', hair: '#6B5A48' };
  const FRIEND = { ...C.skeptic, name: 'friend', coat: '#5E6B3A', sleeve: '#5E6B3A', lapel: '#4A5230', tie: '#4A5230', pants: '#4A5230', hat: 'cap', hatCol: '#4A5230', band: '#4A5230' };
  const NEV_ARMY = { ...C.neville, name: 'nevarmy', coat: '#5E6B3A', sleeve: '#5E6B3A', lapel: '#4A5230', scarf: '#4A5230', pants: '#4A5230', hat: 'cap', hatCol: '#4A5230', band: '#4A5230' };
  const WIFE = { ...C.dreamer, name: 'wife', coat: '#B8463A', sleeve: '#B8463A', stripes: null, hair: '#3B2A22', skin: '#EFCBA6' };
  const MOSES = { ...C.paul, name: 'moses', coat: '#8C5A3C', sleeve: '#8C5A3C', pants: '#8C5A3C', sash: '#C9963A', hair: '#ECE8DF', hairStyle: 'neat', beard: .65, beardCol: '#ECE8DF' };
  const CROWD = [C.paul, { ...C.paul, coat: '#6B7A8F', sleeve: '#6B7A8F', pants: '#6B7A8F', hairStyle: 'curls', hair: '#2B1E19', beard: 0 }, { ...C.paul, coat: '#B8463A', sleeve: '#B8463A', pants: '#B8463A', hairStyle: 'neat', hair: '#5A4636', beard: .3 }];
  function tally(t, x0, y, n, ts, gap = 92) {   // felt day counters: dot i presses on at ts[i]
    for (let i = 0; i < n; i++) { const ti = ts[i]; if (t < ti) continue; CUELOG['tally' + i + '@' + ti.toFixed(2)] = { t: ti + .05, type: 'pat', x: x0 + i * gap, size: 120 };
      if (window.CUEMODE) continue; const k = backOut(seg(t, ti, ti + .3)); flushBrush(); noStroke();
      fill(30, 18, 12, 70); ellipse(x0 + i * gap + 5, y + 6, 64 * k, 64 * k); fill(246, 240, 226); ellipse(x0 + i * gap, y, 70 * k, 70 * k); fill(232, 184, 42); ellipse(x0 + i * gap, y, 54 * k, 54 * k); }
  }

  function street(t, t0, o = {}) {     // a New York block at night
    const e = i => o.still ? null : stagger(t0, i, .07);
    P('sky_stars', 220, 430, 250, { in: e(0) }); P('island_moon', 870, 360, 220, { in: e(1), sway: .03, out: o.moonOut });
    P('city_skyscraper', 820, 1230, 780, { in: e(2), sway: .004 }); P('city_rowhouses', 230, 1250, 470, { in: e(3), sway: .004 });
    if (!o.noBrown) P('city_brownstone', 590, 1345, 780, { in: e(4), sway: .004, out: o.brownOut });
    P('city_wintertree', 120, 1440, 520, { in: e(5), sway: .025 }); P('city_streetlamp', 960, 1470, 640, { in: e(6), sway: .018 });
    P('sky_snowdrift', 860, 1880, 150, { in: e(7) }); P('sky_snowdrift', 170, 1900, 120, { in: e(8) });
  }

  function barracks(t, t0, o = {}) {   // night barracks: rows of olive cots with sleeping soldiers
    board('night'); const e = i => o.still ? null : stagger(t0, i, .04);
    P('room_window', 270, 900, 380, { in: e(0), sway: .004 }); P('room_window', 810, 900, 380, { in: e(1), sway: .004 }); P('room_clock', 540, 640, 170, { in: e(2) });
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) { const bx = 160 + c * 255 + r * 60, by = 1540 + r * 150, bh = 230 + r * 40;
      P('room_bed', bx, by, bh, { in: e(3 + r * 4 + c), tint: [150, 160, 120], sway: .002 });
      person(bx, by - bh * .44, 4.6 + r * .6, { ...SOLDIER, hat: null }, { mood: 'sleepy', key: 'sol' + r + c, snd: false, aL: -1.2, aR: -1.2, in: o.still ? null : e(3 + r * 4 + c) + .2 });
      if (T > (o.still ? -1 : e(3 + r * 4 + c) + .5)) piecePart('room_bed', bx, by, bh, .43, 1); }
  }
  const COT = [540, 1900, 400];   // Neville's cot, front and centre

  // ---------- shots ----------
  function shHook(t, lt) {   // checking the phone again and again; on "nothing" it goes down; nine felt days
    const t0 = t - lt, wc = WT('hook', 'checking'), wn = WT('hook', 'nothing'), w9 = WT('hook', 'nine');
    camBegin(540, 1000, 1.0); board('plum');
    const peek = t > wc - .2 && t < wn ? Math.max(0, Math.sin((t - wc) * 7)) : 0;
    host(t, 540, 1790, 40, { in: t0 + .02, mood: t > wn ? 'warm' : 'worried', look: t > wn ? 0 : .3, lookY: peek * .6,
      holdR: t > t0 + .3 && t < wn + .4 ? (x, y, u) => phone(x, y + u * 1.2 + (t > wn ? (t - wn) * 900 : 0), u * 1.25, t, 1) : null, aR: t < wn ? .1 + .3 * peek : -1.2 });
    if (t > wn) cue('putdown', wn, 'whoosh', 640, 200);
    tally(t, 172, 800, 9, Array.from({ length: 9 }, (_, i) => w9 + .05 + i * .08));
    camEnd();
  }
  function shVerse(t, lt, dur) {   // Exodus 14: Moses at the Red Sea, the army behind; "stand still"; the sea rises like walls
    const t0 = t - lt, ws = WT('verse', 'still'), wf = WT('verse', 'fight'), wp = WT('verse', 'peace'), rise = ease(seg(t, wf - .2, wf + 1.2));
    camBegin(540, 1000, 1.0 + .015 * lt); board('day');
    P('island_sun', 870, 420, 200, { in: stagger(t0, 0), sway: .02 }); P('bible_mountain', 230, 1180, 380, { in: stagger(t0, 1), sway: 0 });
    for (let i = 0; i < 4; i++) P('island_waves', 140 + i * 270, 1420, 120, { in: stagger(t0, 2 + i, .05), sway: .02 });
    if (rise > 0) { P('island_waves', lerp(140, 230, rise), 1420, lerp(120, 520, rise), { sway: .01, snd: false, rot: lerp(0, -.1, rise) }); P('island_waves', lerp(950, 860, rise), 1420, lerp(120, 520, rise), { sway: .01, snd: false, flip: true, rot: lerp(0, .1, rise) }); cue('sea', wf - .2, 'whoosh', 540, 900); }
    const still = t > ws - .1;
    for (let i = 0; i < 5; i++) person(60 + i * 46, 1560 + (i % 2) * 14, 6, SOLDIER, { in: stagger(t0, 6 + i, .05), mood: 'determined', look: 1, key: 'egy' + i, snd: false, lean: still ? 0 : .03 * Math.sin(t * 6 + i) });
    CROWD.forEach((sp, i) => person(560 + i * 120, 1840 - (i % 2) * 20, 22, sp, { in: stagger(t0, 11 + i), mood: still ? 'hopeful' : 'worried', look: -1, key: 'cr' + i, lean: still ? 0 : .04 * Math.sin(t * 7 + i) }));
    if (still) glow(420, 1300, 380, '#FFE2A8', .6 * ease(seg(t, ws - .1, ws + .5)));
    person(420, 1840, 30, MOSES, { in: stagger(t0, 14), mood: 'wise', look: -.5, key: 'moses', aL: still ? .9 : .2, hold: (x, y, u) => P('bible_staff', x, y + u * 3, u * 13, { sway: .01, snd: false }) });
    camEnd();
  }
  function shMeaning(t, lt) {    // a sealed gold scroll: done; a second one tries to press on and peels away
    const t0 = t - lt, wg = WT('meaning', 'give'), wd = WT('meaning', 'done'), wa = WT('meaning', 'again');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wd - .2) { glow(720, 1050, 380, '#FFD27A', .8 * ease(seg(t, wd - .2, wd + .4))); P('prop_scroll', 720, 1300, 420, { in: wd - .2, tint: [255, 214, 120], snd: 'chime', sway: .01 }); }
    if (t > wa - .5) P('prop_scroll', 760, 1260, 380, { in: wa - .5, out: wa + .2, tint: [170, 170, 170], sway: .02 });
    host(t, 300, 1790, 38, { in: t0 + .02, mood: t > wg - .1 && t < wd ? 'determined' : 'warm', aR: t > wd - .1 ? .3 : -1.2, look: t > wd ? .6 : 0 });
    camEnd();
  }
  function shDrafted(t, lt) {    // the draft notice flies in; the army uniform presses on over his suit; a cloud of home
    const t0 = t - lt, wd = WT('drafted', 'drafted'), wa = WT('drafted', 'army'), wp = WT('drafted', 'part'), ww = WT('drafted', 'wife');
    camBegin(540, 1000, 1.0); board('night'); street(t, t0, { noBrown: true });
    if (t > wd - .3 && t < wa + .2) { const k = seg(t, wd - .3, wd + .3), [x, y] = arcPt([-100, 900], [520, 1250], -240, ease(k)); P('prop_envelope', x, y, 140, { rot: k * 5, sway: 0, snd: false }); cue('draft', wd - .3, 'whoosh', 400, 300); }
    const army = t > wa; if (army) cue('uniform', wa, 'pat', 540, 500);
    person(540, 1830 - (army ? (1 - ease(seg(t, wa, wa + .3))) * 120 : 0), 32, army ? NEV_ARMY : C.neville, { in: stagger(t0, 9), mood: t > wp - .2 ? 'sad' : army ? 'surprised' : 'neutral', look: -.3, key: army ? 'nevA' : 'nev', snd: false, aL: t > wp - .2 && t < ww ? .2 : -1.2, aR: t > wp - .2 && t < ww ? .2 : -1.2 });
    if (t > ww - .2) { P('island_cloud', 800, 1000, 300, { in: ww - .2, snd: 'pop', sway: .02 }); P('city_brownstone', 800, 980, 160, { in: ww - .05, snd: false }); }
    feltSnow(t, 18, 1, 31);
    camEnd();
  }
  function shNo(t, lt) {         // the officer at his desk; the application turns grey; "no"
    const t0 = t - lt, wd = WT('no', 'discharge'), wn = WT('no', 'no');
    camBegin(540, 1050, 1.04); board('sand');
    P('room_painting', 300, 640, 240, { in: stagger(t0, 0) }); P('room_clock', 820, 620, 200, { in: stagger(t0, 1) });
    person(720, 1560, 32, OFFICER, { in: stagger(t0, 2), mood: t > wn - .2 ? 'determined' : 'skeptical', look: -1, key: 'off', aL: t > wn - .1 ? .3 : -1.2 });
    P('room_desk', 720, 1760, 420, { in: stagger(t0, 3), sway: .003 });
    if (t > wd - .3) P('prop_scroll', lerp(400, 640, ease(seg(t, wd - .3, wd + .3))), 1420, 200, { in: wd - .3, snd: 'whoosh', drop: 0, tint: t > wn ? [150, 150, 150] : null, rot: -.1 });
    if (t > wn) cue('stampno', wn, 'door', 640, 300);
    person(280, 1820, 30, NEV_ARMY, { in: stagger(t0, 4), mood: t > wn ? 'sad' : 'hopeful', look: 1, key: 'nevA', aR: t > wd - .4 && t < wd + .3 ? .3 : -1.2 });
    camEnd();
  }
  function shCot(t, lt) {        // the barracks; he lies down on his cot, closes his eyes, and goes home (the window warms)
    const t0 = t - lt, wc = WT('cot', 'closed'), wh = WT('cot', 'home'), warm = ease(seg(t, wh - .2, wh + .8));
    camBegin(540, lerp(1000, 1450, warm), lerp(1.0, 1.5, warm)); barracks(t, t0);
    const [bx, by, bh] = COT; P('room_bed', bx, by, bh, { in: stagger(t0, 12), tint: [150, 160, 120], sway: .002 });
    person(bx, by - bh * .44, 9.5, { ...NEV_ARMY, hat: null }, { in: stagger(t0, 13), mood: t > wc ? 'sleepy' : 'neutral', key: 'nevcot', snd: false, aL: -1.2, aR: -1.2 });
    if (T > stagger(t0, 13) + .4) piecePart('room_bed', bx, by, bh, .43, 1);
    if (warm > 0) { glow(bx, by - bh * .7, 300, '#FFC07A', warm); cue('gohome', wh - .1, 'sparkle', bx, 300); }
    camEnd();
  }
  function shHome(t, lt) {       // the apartment above Washington Square: the bed, his wife asleep, the window onto the square
    const t0 = t - lt, wf = WT('home', 'felt'), wt = WT('home', 'touched'), ww = WT('home', 'window'), wq = WT('home', 'square');
    camBegin(540, 1000, 1.0 + .015 * lt); board('warm');
    P('room_window', 790, 900, 560, { in: stagger(t0, 0), sway: .004 });
    P('city_wintertree', 700, 1060, 220, { in: stagger(t0, 1), snd: false, sway: .02 }); P('city_streetlamp', 880, 1080, 240, { in: stagger(t0, 2), snd: false, sway: .01 });
    P('room_lamp', 140, 1150, 260, { in: stagger(t0, 3) }); P('room_armchair', 300, 1640, 380, { in: stagger(t0, 4), sway: .004 });
    rug(560, 1880, 360, { in: stagger(t0, 5) });
    const bx = 760, bby = 1720, bh = 520; P('room_bed', bx, bby, bh, { in: stagger(t0, 6), sway: .003 });
    person(bx, bby - bh * .44, 9.5, WIFE, { in: stagger(t0, 7), mood: 'sleepy', key: 'wife', snd: false, aL: -1.2, aR: -1.2 });
    if (T > stagger(t0, 7) + .4) piecePart('room_bed', bx, bby, bh, .43, 1);
    const nx = t < wt ? 520 : t < ww ? lerp(520, 300, ease(seg(t, wt, wt + .6))) : lerp(300, 620, ease(seg(t, ww - .2, ww + .6)));
    person(nx, 1840, 30, C.neville, { in: stagger(t0, 8), mood: t > ww ? 'awe' : 'warm', look: t > ww - .2 ? 1 : t > wt ? -1 : 1, lookY: t > ww ? -.4 : 0, key: 'nev', aL: t > wf - .1 && t < ww ? .2 : -1.2, aR: t > ww ? .3 : -1.2 });
    if (t > wq - .2) glow(790, 900, 300, '#FFE2A8', .6 * ease(seg(t, wq - .2, wq + .5)));
    if (t > wf) cue('feel', wf, 'pat', 760, 300); if (t > wt) cue('touch', wt + .3, 'pat', 300, 300);
    camEnd();
  }
  function shVoice(t, lt) {      // 4 a.m. in the barracks: he wakes; a light and a voice
    const t0 = t - lt, wf = WT('heard', 'four'), wv = WT('heard', 'voice'), wn = WT('heard', 'nothing'), lit = ease(seg(t, wv - .2, wv + .6));
    camBegin(540, 1400, 1.3); barracks(t, t0, { still: true });
    const [bx, by, bh] = COT; P('room_bed', bx, by, bh, { tint: [150, 160, 120], sway: .002 });
    const up = t > wf - .3;
    person(bx, by - bh * .44 - (up ? 60 * ease(seg(t, wf - .3, wf)) : 0), 9.5, { ...NEV_ARMY, hat: null }, { mood: t > wv ? 'awe' : up ? 'surprised' : 'sleepy', key: 'nevcot', snd: false, aL: -1.2, aR: -1.2, lookY: t > wv ? -.8 : 0 });
    piecePart('room_bed', bx, by, bh, .43, 1);
    if (t > wf - .2) { P('room_clock', 540, 640, 170, { in: wf - .2, snd: 'ticks', drop: 40 }); }
    if (lit > 0) { glow(bx, by - 520, 560, '#FFF1C2', lit); cue('voicechime', wv, 'chime', bx, 400); }
    if (t > wn) stars(bx, by - 560, t, wn);
    camEnd();
  }
  function shNothing(t, lt) {    // he sits on his cot, arms folded, smiling: nothing
    const t0 = t - lt; camBegin(540, 1400, 1.3); barracks(t, t0, { still: true });
    const [bx, by, bh] = COT; P('room_bed', bx, by, bh, { tint: [150, 160, 120], sway: .002 });
    person(bx, by - 40, 14, NEV_ARMY, { in: t0 + .05, mood: 'beam', key: 'nevsit', aL: -.5, aR: -.5, snd: 'pop' });
    camEnd();
  }
  function shNine(t, lt) {       // nine felt days press on; the same officer hands him the gold discharge
    const t0 = t - lt, w9 = WT('nine', 'nine'), wd = WT('nine', 'discharged'), wn = WT('nine', 'no'), gold = ease(seg(t, wd - .2, wd + .4));
    camBegin(540, 1050, 1.0); board('sand');
    tally(t, 172, 820, 9, Array.from({ length: 9 }, (_, i) => t0 + .1 + i * ((w9 + .3 - t0) / 9)));
    person(720, 1560, 32, OFFICER, { in: stagger(t0, 0), mood: t > wd ? 'happy' : 'neutral', look: -1, key: 'off', aL: t > wd - .3 ? .4 : -1.2 });
    P('room_desk', 720, 1760, 420, { in: stagger(t0, 1), sway: .003 });
    if (t > wd - .3) P('prop_scroll', lerp(620, 420, ease(seg(t, wd - .3, wd + .4))), 1380, 220, { in: wd - .3, drop: 0, snd: 'whoosh', tint: [255, lerp(255, 214, gold), lerp(255, 90, gold)], rot: .1 });
    if (t > wd) { cue('disch', wd + .1, 'sparkle', 420, 300); glow(420, 1350, 300, '#FFD27A', gold); }
    person(280, 1820, 30, NEV_ARMY, { in: stagger(t0, 2), mood: t > wd ? 'joy' : 'hopeful', look: 1, key: 'nevA', aR: t > wd ? .5 : -1.2, dy: t > wd + .3 ? -.5 * Math.abs(Math.sin((t - wd) * 6)) * Math.exp(-(t - wd) * .9) : 0 });
    camEnd();
  }
  function shFriend(t, lt) {     // Neville's letter flies to his friend (glasses, army); the friend shrugs: "anyway"
    const t0 = t - lt, ww = WT('friend', 'wrote'), wa = WT('friend', 'anyway');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > ww && t < ww + 1.2) { const k = seg(t, ww, ww + 1.0), [x, y] = arcPt([300, 1350], [780, 1350], -300, ease(k)); P('prop_envelope', x, y, 130, { rot: k * 4, sway: 0, snd: false }); cue('letter3', ww, 'whoosh', 540, 300); }
    person(280, 1830, 30, C.neville, { in: stagger(t0, 0), mood: 'happy', look: 1, key: 'nev', aR: t > ww - .2 && t < ww + .4 ? .4 : -1.2, hold: t < ww ? (x, y, u) => P('prop_quill', x, y + u, u * 4, { sway: .02, snd: false }) : null });
    const sh = t > wa - .3 ? Math.sin(Math.PI * seg(t, wa - .3, wa + .4)) : 0;
    person(800, 1830, 30, FRIEND, { in: stagger(t0, 1), mood: t > wa - .3 ? 'skeptical' : 'neutral', look: -1, key: 'fr', aL: -1.2 + 1.5 * sh, aR: -1.2 + 1.5 * sh, talk: t > wa - 1.2 ? talk(t) : null });
    camEnd();
  }
  function shMillions(t, lt) {   // a parade of tiny soldiers marches out; the friend goes last
    const t0 = t - lt, wm = WT('millions', 'millions'), march = ease(seg(t, wm - .6, wm + 1.2));
    camBegin(540, 1000, 1.0); board('day');
    P('island_sun', 860, 430, 200, { in: stagger(t0, 0) }); P('sky_hill', 300, 1400, 360, { in: stagger(t0, 1), sway: 0 }); P('sky_hill', 820, 1380, 420, { in: stagger(t0, 2), sway: 0, flip: true });
    for (let i = 0; i < 18; i++) { const x = ((i * 63 + (t - t0) * 160) % 1300) - 110, row = i % 3; person(x, 1520 + row * 70, 5 + row, SOLDIER, { in: stagger(t0, 3 + i, .03), mood: 'happy', look: 1, key: 'm' + i, snd: false, dy: -.3 * Math.abs(Math.sin(t * 8 + i)) }); }
    if (t > wm) cue('march', wm, 'ticks', 540, 1.4);
    person(lerp(160, 1300, march), 1840, 28, FRIEND, { in: stagger(t0, 22), mood: 'neutral', look: 1, key: 'fr', lean: march > 0 && march < 1 ? -.1 : 0 });
    camEnd();
  }
  function shHard(t, lt) {       // one night (a moon) vs nine days (nine dots); his hand hovers and pulls back
    const t0 = t - lt, wo = WT('hard', 'one'), w9 = WT('hard', 'nine'), wa = WT('hard', 'again');
    camBegin(540, 1000, 1.0); board('night');
    if (t > wo - .2) P('island_moon', 240, 640, 200, { in: wo - .2, snd: 'chime', sway: .03 });
    tally(t, 172, 1050, 9, Array.from({ length: 9 }, (_, i) => w9 + i * .07));
    const reach = t > wa - .8 ? Math.sin(Math.PI * seg(t, wa - .8, wa + .3)) : 0;
    host(t, 540, 1810, 36, { in: t0 + .02, mood: reach > .3 ? 'determined' : 'warm', aR: -1.2 + 1.3 * reach, look: reach > .2 ? .5 : 0 });
    camEnd();
  }
  function shClose(t, lt) {      // stand still: everything stops swaying, the board warms
    const t0 = t - lt, ws = WT('close', 'still'), warm = ease(seg(t, ws - .2, ws + .8));
    camBegin(540, 1000, 1.0 + .03 * warm); board('night'); if (warm > 0) board('warm', warm);
    street(t, t0, { moonOut: ws - .1 });
    if (warm > 0) { glow(540, 1200, 600, '#FFD27A', .7 * warm); P('island_sun', 870, 360, 200, { in: ws, snd: 'chime' }); }
    host(t, 540, 1820, 38, { in: t0 + .1, mood: 'warm', look: 0 });
    feltSnow(t, 18, 1 - warm, 41);
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'slip'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .1, shVerse], [S('meaning') - .1, shMeaning], [S('drafted') - .15, shDrafted], [S('no') - .1, shNo], [S('cot') - .15, shCot],
    [S('home') - .15, shHome], [S('heard') - .15, shVoice], [S('nothing') - .1, shNothing], [S('nine') - .1, shNine], [S('friend') - .15, shFriend],
    [S('millions') - .1, shMillions], [S('hard') - .15, shHard], [S('close') - .1, shClose], [S('cta') - .1, shCta], [S('comment') - .1, shComment],
  ]);
})();
