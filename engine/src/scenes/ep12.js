window.CHEAP = true; window.FELT = true;
// Episode 12, flannelgraph cut: "Say Hi" (the artist's foot and Ed) built from the felt cutout kit (kit/cutouts) on felt boards.
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










  const ARTIST = { ...C.dreamer, name: 'artist', coat: '#E6B82A', sleeve: '#3F8F8A', stripes: ['#D2453A', '#E6B82A', '#3F8F8A', '#7A4E8A'], hair: '#2B1E19', skin: '#C98E62', torso: 7.2, leg: 4.6, w: 4.6 };
  const JAN = { ...C.skeptic, name: 'janitor', coat: '#8E8F96', sleeve: '#8E8F96', lapel: '#6B6D74', tie: '#6B6D74', hat: 'cap', hatCol: '#6B6D74', band: '#6B6D74', glasses: false };
  const ED = { ...C.blake, name: 'ed', coat: '#2E3A52', sleeve: '#2E3A52' };
  const SINGER = { ...C.dreamer, name: 'singer', coat: '#B8463A', sleeve: '#B8463A', stripes: null, hair: '#E6B82A', skin: '#EFCBA6', torso: 7.2, leg: 4.6 };
  function sitIn(t, cx, by, h, spec, o = {}) { P('room_armchair', cx, by, h, { in: o.in, sway: .003 }); person(cx, by - h * .22, o.u || 22, spec, o); if (T > (o.in ?? -9) + .4) piecePart('room_armchair', cx, by, h, .58, 1); }
  const sore = (x, y, k, t) => { if (k > 0) glow(x, y, 120 + 60 * k + 15 * Math.sin(t * 6), '#FF5A4A', .9 * k); };
  const brush = (x, y, u) => P('prop_quill', x, y + u, u * 4, { sway: .02, snd: false });
  const meetCloud = (x, y, s, tin, t, smile) => { if (t < tin) return; P('island_cloud', x, y, s, { in: tin, snd: 'pop', sway: .02 });
    person(x - s * .14, y + s * .02, s * .026, ARTIST, { in: tin + .1, mood: smile ? 'beam' : 'neutral', look: 1, key: 'ac' + x, snd: false, aR: smile ? .5 : -1.2 });
    person(x + s * .14, y + s * .02, s * .028, ED, { in: tin + .15, mood: smile ? 'beam' : 'skeptical', look: smile ? -1 : 1, key: 'ec' + x, snd: false, aL: smile ? .5 : -1.2 }); };
  function school(t, t0, o = {}) { board(o.night ? 'night' : 'sand'); const e = i => o.still ? null : stagger(t0, i);
    P('room_painting', 300, 620, 240, { in: e(0) }); P('room_painting', 760, 640, 200, { in: e(1), flip: true });
    for (let i = 0; i < 2; i++) { P('room_desk', 260 + i * 520, 1620, 300, { in: e(2 + i), sway: .003 }); if (!o.noChairs) P('room_chair', 260 + i * 520, 1340, 200, { in: e(4 + i), rot: PI, sway: 0 }); } }

  // ---------- shots ----------
  function shHook(t, lt) {   // a burning foot; her imagination points somewhere else (Ed, in a cloud)
    const t0 = t - lt, we = WT('hook', 'else');
    camBegin(540, 1000, 1.0); board('plum'); sore(380, 1830, 1, t);
    person(380, 1840, 32, ARTIST, { in: t0 + .05, mood: t > we ? 'surprised' : 'worried', look: .5, lookY: t > we ? -.4 : .5, key: 'art' });
    if (t > we - .3) { P('island_cloud', 760, 1040, 300, { in: we - .3, snd: 'pop' }); person(760, 1080, 8, ED, { in: we - .1, mood: 'skeptical', key: 'edc', snd: false }); }
    camEnd();
  }
  function shVerse(t, lt) {      // Jesus: when ye stand praying, forgive
    const t0 = t - lt, wf = WT('verse', 'forgive'), lit = ease(seg(t, wf - .2, wf + .5));
    camBegin(540, 1050, 1.0 + .02 * lt); board('sand'); glow(540, 1300, 520, '#FFE2A8', .35 + .55 * lit);
    P('sky_hill', 300, 1460, 360, { in: stagger(t0, 0), sway: 0 }); P('bible_olivetree', 880, 1560, 520, { in: stagger(t0, 1), sway: .02 });
    person(520, 1840, 36, JESUS, { in: stagger(t0, 2), mood: 'wise', key: 'jes', aL: t > wf - .2 ? .6 : -1.2, aR: t > wf - .2 ? .6 : -1.2 });
    camEnd();
  }
  function shMeaning(t, lt) {    // anything, anyone: small rain clouds pop and clear
    const t0 = t - lt, wa = WT('meaning', 'anything'), wo = WT('meaning', 'anyone');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wa - .2) P('sky_raincloud', 300, 900, 160, { in: wa - .2, out: wo + .6, snd: 'pop' }); if (t > wo - .2) P('sky_raincloud', 780, 860, 160, { in: wo - .2, out: wo + .8, snd: 'pop' });
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0 });
    camEnd();
  }
  function shArtist(t, lt) {     // the art school: chairs left up on the desks
    const t0 = t - lt, wj = WT('artist', 'janitor');
    camBegin(540, 1000, 1.0); school(t, t0);
    person(540, 1860, 30, ARTIST, { in: stagger(t0, 6), mood: t > wj ? 'skeptical' : 'happy', look: t > wj ? -.6 : 0, key: 'art', hold: brush });
    camEnd();
  }
  function shChair(t, lt) {      // a chair slips and hits her right foot; she snaps at the janitor, then forgets it
    const t0 = t - lt, ws = WT('chair', 'slipped'), wh = WT('chair', 'hit'), wsn = WT('chair', 'snapped'), wf = WT('chair', 'forgot'), fall = easeIn(seg(t, ws - .1, wh));
    camBegin(540, 1000, 1.0); school(t, t0, { still: true, noChairs: true });
    P('room_chair', 520, lerp(1350, 1860, fall), 200, { rot: lerp(PI, PI * 1.6, fall), sway: 0, snd: false }); if (t > wh) { cue('thud', wh, 'door', 520, 300); sore(540, 1840, 1 - ease(seg(t, wf - .3, wf + .4)), t); }
    if (t > wsn - .3) person(880, 1860, 28, JAN, { in: wsn - .3, mood: 'surprised', look: -1, key: 'jan' });
    person(540, 1860, 30, ARTIST, { mood: t > wf ? 'happy' : t > wsn ? 'determined' : t > wh ? 'surprised' : 'neutral', look: t > wsn && t < wf ? 1 : 0, lookY: t > wh && t < wsn ? .6 : 0, key: 'art', talk: t > wsn - .1 && t < wf - .2 ? talk(t) : null, hold: brush });
    camEnd();
  }
  function shNight(t, lt) {      // three hours of drawing; the foot swells, purple and hot
    const t0 = t - lt, wsw = WT('night', 'swollen'), wp = WT('night', 'pain'), k = ease(seg(t, wsw - .3, wp + .3));
    camBegin(540, 1000, 1.0); board('night'); P('room_lamp', 160, 1150, 240, { in: stagger(t0, 0) }); glow(160, 1000, 300, '#FFC07A', .6);
    P('room_painting', 720, 1300, 420, { in: stagger(t0, 1) }); P('room_clock', 760, 620, 180, { in: stagger(t0, 2), rot: ease(seg(t, t0 + .3, wsw)) * TAU * 3, sway: 0 });
    sore(400, 1840, k, t);
    person(400, 1840, 32, ARTIST, { in: stagger(t0, 3), mood: k > .5 ? 'worried' : 'warm', look: t > wp ? 0 : 1, lookY: t > wsw ? .6 : 0, key: 'art', hold: brush, aR: .2 });
    camEnd();
  }
  function shLight(t, lt) {      // she tries to melt the foot into light; her imagination says no
    const t0 = t - lt, wl = WT('light', 'light'), wn = WT('light', 'no'), lit = ease(seg(t, wl - .4, wl + .3)) * (1 - ease(seg(t, wn - .1, wn + .2))), [sx, sy] = shakeCam(t, wn, 12);
    camBegin(480 + sx, 1300 + sy, 1.2); board('night'); P('room_lamp', 160, 1150, 240, {});
    sore(480, 1860, 1, t); if (lit > 0) glow(480, 1840, 260, '#FFFFFF', lit);
    sitIn(t, 480, 1840, 440, ARTIST, { mood: t > wn ? 'surprised' : 'determined', key: 'art' });
    if (t > wn - .1) cue('no', wn, 'door', 480, 300);
    camEnd();
  }
  function shAsked(t, lt) {      // "what do you want?" "Go to bed and review the day's events." (a cloud with a bed)
    const t0 = t - lt, wb = WT('asked', 'bed');
    camBegin(480, 1300, 1.2); board('night'); P('room_lamp', 160, 1150, 240, {}); sore(480, 1860, 1, t);
    sitIn(t, 480, 1840, 440, ARTIST, { mood: 'hopeful', lookY: -.5, key: 'art', talk: t < wb - .6 ? talk(t) : null });
    if (t > wb - .3) { P('island_cloud', 760, 1080, 280, { in: wb - .3, snd: 'pop' }); P('room_bed', 760, 1080, 120, { in: wb - .1, snd: false }); }
    camEnd();
  }
  function shEd(t, lt) {         // in bed, going over the day: Ed, who hasn't spoken to her for a year
    const t0 = t - lt, we = WT('ed', 'ed'), wy = WT('ed', 'year');
    camBegin(540, 1050, 1.04); board('night'); P('room_window', 780, 860, 420, { in: stagger(t0, 0) });
    const bx = 480, bby = 1760, bh = 600; P('room_bed', bx, bby, bh, { in: stagger(t0, 1), sway: .002 });
    person(bx, bby - bh * .44, 11, ARTIST, { in: stagger(t0, 2), mood: t > we ? 'sad' : 'neutral', key: 'artbed', snd: false, aL: -1.2, aR: -1.2 }); if (T > stagger(t0, 2) + .4) piecePart('room_bed', bx, bby, bh, .43, 1);
    if (t > we - .3) { P('island_cloud', 760, 1000, 300, { in: we - .3, snd: 'pop' }); person(760, 1040, 8, ED, { in: we - .1, mood: 'skeptical', look: 1, key: 'edc', snd: false }); }
    if (t > wy) tally(t, 200, 640, 1, [wy], 100);
    camEnd();
  }
  function shHi(t, lt) {         // in imagination: "Hi!" "Hi!" and a smile, twice
    const t0 = t - lt, wh = WT('hi', 'hi'), ws = WT('hi', 'smiled'), wc = WT('hi', 'couple');
    camBegin(540, 1050, 1.04); board('night'); const bx = 480, bby = 1760, bh = 600; P('room_bed', bx, bby, bh, {});
    person(bx, bby - bh * .44, 11, ARTIST, { mood: t > ws ? 'beam' : 'hopeful', key: 'artbed', snd: false, aL: -1.2, aR: -1.2 }); piecePart('room_bed', bx, bby, bh, .43, 1);
    meetCloud(620, 1080, 520, t0 + .1, t, t > wh - .1); if (t > wh) cue('hi', wh, 'chime', 620, 300); if (t > ws) glow(620, 1040, 300, '#FFD27A', .6);
    if (t > wc) tally(t, 440, 640, 2, [wc, wc + .3], 140);
    camEnd();
  }
  function shConcert(t, lt) {    // her imagination says go to a concert: her friend's debut, a huge ovation
    const t0 = t - lt, wc = WT('concert', 'concert'), wd = WT('concert', 'debut'), wo = WT('concert', 'ovation');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1100, 520, '#FFD27A', .6);
    P('prop_candle', 200, 1500, 220, { in: stagger(t0, 0) }); P('prop_candle', 880, 1500, 220, { in: stagger(t0, 1) });
    person(540, 1560, 30, SINGER, { in: wd - .3, mood: 'joy', key: 'singer', aL: .6, aR: .6, talk: t > wd && t < wo ? talk(t) : null });
    for (let i = 0; i < 6; i++) person(120 + i * 168, 1900, 14, [ARTIST, ED, C.paul, C.blake, C.skeptic, C.dreamer][i], { in: stagger(t0, 2 + i, .05), mood: t > wo ? 'joy' : 'happy', look: 0, key: 'aud' + i, snd: false, aL: t > wo ? .4 + .4 * Math.sin(t * 14 + i) : -1.2, aR: t > wo ? .4 + .4 * Math.sin(t * 14 + i + 1) : -1.2 });
    if (t > wo) { stars(540, 1100, t, wo); cue('ovation', wo, 'sparkle', 540, 600); cue('clap', wo + .1, 'ticks', 540, 1.5); }
    camEnd();
  }
  function shMorning(t, lt) {    // morning: the foot is normal; one tiny pink spot
    const t0 = t - lt, wn = WT('morning', 'normal'), wp = WT('morning', 'pink');
    camBegin(540, 1000, 1.0); board('warm'); P('room_window', 760, 860, 440, { in: stagger(t0, 0) }); P('island_sun', 760, 820, 160, { in: stagger(t0, 1), snd: false });
    if (t > wp - .2) glow(560, 1840, 50, '#FF8A8A', .7);
    person(560, 1840, 32, ARTIST, { in: stagger(t0, 2), mood: t > wn ? 'joy' : 'surprised', lookY: .6, key: 'art', dy: t > wn ? -.3 * Math.abs(Math.sin((t - wn) * 6)) : 0 });
    if (t > wn) cue('normal', wn, 'sparkle', 560, 300);
    camEnd();
  }
  function shBrushes(t, lt) {    // the unwashed brushes from last night: it was real
    const t0 = t - lt, wb = WT('brushes', 'brushes');
    camBegin(540, 1050, 1.06); board('warm'); P('room_desk', 720, 1760, 420, { in: stagger(t0, 0) });
    if (t > wb - .2) { for (let i = 0; i < 3; i++) P('prop_quill', 640 + i * 70, 1460, 200, { in: wb - .2 + i * .08, rot: (i - 1) * .2, snd: i ? false : 'pop', tint: [[210, 69, 58], [63, 143, 138], [230, 184, 42]][i] }); }
    person(330, 1840, 32, ARTIST, { in: stagger(t0, 1), mood: 'awe', look: 1, key: 'art' });
    camEnd();
  }
  function shLesson(t, lt) {     // she went after the foot; her imagination went after Ed
    const t0 = t - lt, wf = WT('lesson', 'foot'), we = WT('lesson', 'ed');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wf - .2) { P('island_cloud', 280, 1000, 260, { in: wf - .2, snd: 'pop', out: we + .4 }); if (t < we + .5) sore(280, 980, .7, t); }
    meetCloud(760, 1060, 400, we - .2, t, true);
    host(t, 540, 1830, 36, { in: t0 + .02, mood: 'warm', look: t > we ? .6 : -.6 });
    camEnd();
  }
  function shClose(t, lt) {      // who are you still not saying hi to?
    const t0 = t - lt, wh = WT('close', 'hi');
    camBegin(540, 1000, 1.0); board('plum'); meetCloud(540, 1080, 420, wh - .3, t, false);
    host(t, 540, 1830, 38, { in: t0 + .02, mood: 'warm', look: 0, aR: t > wh - .2 ? .3 : -1.2 });
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('artist') - .12, shArtist], [S('chair') - .12, shChair], [S('night') - .12, shNight], [S('light') - .12, shLight], [S('asked') - .12, shAsked], [S('ed') - .12, shEd], [S('hi') - .12, shHi], [S('concert') - .12, shConcert], [S('morning') - .12, shMorning], [S('brushes') - .12, shBrushes], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
