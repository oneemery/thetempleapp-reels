window.CHEAP = true; window.FELT = true;
// Episode 30, flannelgraph cut: "The Top Shelf" (F.B. and the Flagstad album) built from the felt cutout kit (kit/cutouts) on felt boards.
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




























  const FB = { ...C.blake, name: 'fb', coat: '#3F6FB0', sleeve: '#3F6FB0', lapel: '#F3EBDC', pants: '#22222A', hat: null, hair: '#3B2A22', skin: '#EFCBA6' };
  const SALES = { ...C.skeptic, name: 'sales', coat: '#8C3B3B', sleeve: '#8C3B3B', hat: null, hair: '#5A4636' };
  const FRIEND = { ...C.blake, name: 'friend', coat: '#5E6B3A', sleeve: '#5E6B3A', hat: 'fedora', hatCol: '#3A4F36', band: '#C9963A' };
  const SAVIOR = { ...C.paul, name: 'jesus', coat: '#F3EBDC', sleeve: '#F3EBDC', pants: '#F3EBDC', sash: '#B8463A', skin: '#C98E62', hair: '#3B2A22', hairStyle: 'neat', beard: .5, beardCol: '#3B2A22', flare: .14 };
  const SIGNS = {};
  function sign(x, y, w, txt, col = '#2F7A4A', a = 1) {
    if (window.CUEMODE || a <= 0) return; const key = txt + col;
    if (!SIGNS[key]) { const g = createGraphics(700, 220); g.pixelDensity(1); const c = g.drawingContext;
      c.fillStyle = '#3A2A22'; c.beginPath(); c.roundRect(14, 20, 672, 190, 24); c.fill(); c.fillStyle = '#F6F0E2'; c.beginPath(); c.roundRect(4, 6, 672, 190, 24); c.fill();
      c.fillStyle = col; c.beginPath(); c.roundRect(20, 22, 640, 158, 16); c.fill();
      c.fillStyle = '#F6F0E2'; c.font = 'bold 96px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 340, 104); SIGNS[key] = g; }
    flushBrush(); tint(255, 255 * a); image(SIGNS[key], x - w / 2, y - w * 110 / 700, w, w * 220 / 700); noTint();
  }
  function album(x, y, s, t, a = 1, gold = false) {   // a felt record album: a sleeve with a disc peeking out
    if (window.CUEMODE || a <= 0) return; flushBrush(); push(); translate(x, y); noStroke();
    fill(30, 18, 12, 70 * a); rect(-s * .5 + 6, -s * .5 + 7, s, s, 8);
    fill(28, 26, 30, 255 * a); ellipse(s * .28, 0, s * .92, s * .92); fill(184, 70, 58, 255 * a); ellipse(s * .28, 0, s * .3, s * .3); fill(246, 240, 226, 255 * a); ellipse(s * .28, 0, s * .05, s * .05);
    fill(246, 240, 226, 255 * a); rect(-s * .5 - 4, -s * .5 - 4, s + 8, s + 8, 8); fill(gold ? 201 : 63, gold ? 150 : 111, gold ? 58 : 176, 255 * a); rect(-s * .5, -s * .5, s, s, 6);
    fill(246, 240, 226, 230 * a); ellipse(0, -s * .08, s * .42, s * .42); fill(58, 42, 34, 255 * a); rect(-s * .3, s * .26, s * .6, s * .06, 3); pop();
    if (gold) glow(x, y, s * 1.4, '#FFD27A', .5 * a);
  }
  function notes(x, y, t, a = 1) { if (window.CUEMODE || a <= 0) return; flushBrush(); push(); noStroke(); for (let i = 0; i < 3; i++) { const k = ((t * .4 + i / 3) % 1), nx = x + i * 70 + Math.sin(t * 2 + i) * 20, ny = y - k * 260;
    fill(58, 42, 34, 255 * a * (1 - k)); ellipse(nx, ny, 34, 26); rect(nx + 12, ny - 70, 7, 70); } pop(); }
  function shop(t, t0, o = {}) { board('plum'); glow(540, 1200, 560, '#FFE2A8', .25); const e = i => o.still ? null : stagger(t0, i);
    P('room_bookshelf', 240, 1700, 620, { in: e(0) }); P('room_bookshelf', 840, 1700, 620, { in: e(1) }); P('room_desk', 540, 1820, 380, { in: e(2) });
    if (!o.noTop) album(840, 1010, 90, t, 1); }

  // ---------- shots ----------
  function shHook(t, lt) {   // a dozen stores said it was gone; he imagined "yes, I have it"; then he looked up
    const t0 = t - lt, wg = WT('hook', 'gone'), wy = WT('hook', 'yes'), wu = WT('hook', 'up');
    camBegin(540, 1000, 1.0); shop(t, t0, { noTop: t < wu - .2 });
    if (t > wg - .2 && t < wy - .3) P('sky_raincloud', 540, 1000, 220, { in: wg - .2, out: wy - .3, sway: .03, snd: 'pop' });
    if (t > wy - .3) sign(540, 1060, 300, 'YES', '#2F7A4A', ease(seg(t, wy - .3, wy)) * (t < wu - .2 ? 1 : 1 - ease(seg(t, wu - .2, wu + .2))));
    if (t > wu - .2) { album(840, 1010, 90, t, 1, true); cue('up', wu, 'sparkle', 840, 300); }
    person(540, 1860, 30, FB, { in: t0 + .05, mood: t > wu ? 'surprised' : t > wy ? 'hopeful' : 'sad', look: t > wu ? .6 : 0, lookY: t > wu ? -.6 : 0, key: 'fb' });
    camEnd();
  }
  function shVerse(t, lt) {      // Jesus: ask, seek, knock
    const t0 = t - lt, wa = WT('verse', 'ask'), ws = WT('verse', 'seek'), wk = WT('verse', 'knock');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, wk - .2, wk + .6)));
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (t > wk - .2) P('room_door', 800, 1520, 420, { in: wk - .2, snd: 'door' });
    person(400, 1840, 40, SAVIOR, { in: stagger(t0, 1), mood: 'warm', aL: .8, look: .6, key: 'jesus', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // ask in your imagination; then go look
    const t0 = t - lt, wi = WT('meaning', 'imagination'), wl = WT('meaning', 'look');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wi - .3) { P('island_cloud', 780, 1150, 320, { in: wi - .3, snd: 'pop' }); album(780, 1000, 90, t, ease(seg(t, wi - .2, wi + .2))); }
    if (t > wl - .2) glow(780, 1000, 220, '#FFD27A', .5);
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5, lookY: t > wl ? -.3 : 0 });
    camEnd();
  }
  function shWant(t, lt) {       // he loved opera; Flagstad's complete Tristan and Isolde
    const t0 = t - lt, wo = WT('want', 'opera'), wt = WT('want', 'tristan');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1300, 520, '#FFE2A8', .3);
    if (t > wo - .2) notes(700, 1400, t, ease(seg(t, wo - .2, wo + .3)));
    if (t > wt - .3) { P('island_cloud', 760, 1150, 340, { in: wt - .3, snd: 'pop' }); album(760, 990, 100, t, ease(seg(t, wt - .2, wt + .2))); }
    person(320, 1860, 30, FB, { in: t0 + .05, mood: 'happy', look: .6, lookY: -.3, key: 'fb' });
    camEnd();
  }
  function shGone(t, lt) {       // at Christmas, a dozen stores: discontinued; no copy since June
    const t0 = t - lt, wd = WT('gone', 'dozen'), ws = WT('gone', 'stopped'), wj = WT('gone', 'june');
    camBegin(540, 1000, 1.0); board('day'); P('city_rowhouses', 220, 1400, 420, { in: t0 + .05 }); P('city_brownstone', 820, 1320, 460, { in: t0 + .1 }); P('city_wintertree', 540, 1500, 300, { in: t0 + .15 });
    if (t > wd - .2) tally(t, 120, 760, 9, Array.from({ length: 9 }, (_, i) => wd - .2 + i * .08), 105);
    if (t > ws - .2) P('sky_raincloud', 540, 1060, 220, { in: ws - .2, sway: .03, snd: 'pop' });
    person(400, 1860, 30, FRIEND, { in: t0 + .05, mood: t > ws ? 'sad' : 'hopeful', look: 1, key: 'friend' });
    if (t > wj - .2) sign(760, 1200, 260, 'SOLD OUT', '#8C3B3B', ease(seg(t, wj - .2, wj + .1)));
    camEnd();
  }
  function shDecide(t, lt) {     // December 27: he decided to prove the principle again
    const t0 = t - lt, wd = WT('decide', 'december'), wp = WT('decide', 'prove');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wd - .2) sign(540, 1080, 340, 'DEC 27', '#3F6FB0', ease(seg(t, wd - .2, wd + .2)));
    person(540, 1860, 32, FB, { in: t0 + .05, mood: t > wp ? 'determined' : 'neutral', look: 0, key: 'fb' });
    if (t > wp) cue('prove', wp, 'pop', 540, 300);
    camEnd();
  }
  function shImagine(t, lt) {    // in his living room: the shop, the salesman's face and voice; "Yes, I have."
    const t0 = t - lt, ws = WT('imagine', 'salesman'), wa = WT('imagine', 'asked'), wy = WT('imagine', 'yes');
    camBegin(540, 1000, 1.0); board('plum'); P('room_lamp', 140, 1540, 340, { in: t0 + .05 });
    P('room_armchair', 360, 1820, 460, { in: t0 + .1 }); person(360, 1820 - 460 * .22, 20, FB, { in: t0 + .15, mood: t > wy ? 'beam' : 'sleepy', key: 'fbc', snd: false }); if (T > t0 + .55) piecePart('room_armchair', 360, 1820, 460, .58, 1);
    if (t > ws - .3) { P('island_cloud', 760, 1260, 440, { in: ws - .3, snd: 'pop' }); person(720, 1180, 9, SALES, { in: ws - .2, mood: t > wy ? 'beam' : 'warm', key: 'sc', snd: false, talk: t > wy - .2 ? talk(t) : 0 }); person(820, 1180, 9, FB, { in: wa - .3, mood: 'hopeful', key: 'fc', snd: false }); }
    if (t > wy - .2) { sign(760, 980, 240, 'YES', '#2F7A4A', ease(seg(t, wy - .2, wy + .1))); glow(760, 1100, 240, '#FFD27A', .5); }
    camEnd();
  }
  function shRepeat(t, lt) {     // over and over until it felt real
    const t0 = t - lt, wr = WT('repeat', 'real');
    camBegin(540, 1000, 1.0); board('plum'); P('room_lamp', 140, 1540, 340, { in: -9 });
    P('room_armchair', 360, 1820, 460, { in: -9 }); person(360, 1820 - 460 * .22, 20, FB, { mood: t > wr ? 'beam' : 'sleepy', key: 'fbc', snd: false }); piecePart('room_armchair', 360, 1820, 460, .58, 1);
    P('island_cloud', 760, 1260, 440, { in: -9 }); sign(760, 980, 240, 'YES', '#2F7A4A');
    for (let i = 0; i < 3; i++) { const k = ((t - t0) * .8 + i / 3) % 1; glow(760, 1100, 100 + 260 * k, '#FFD27A', .4 * (1 - k)); }
    if (t > wr) cue('real', wr, 'sparkle', 760, 300);
    camEnd();
  }
  function shStore(t, lt) {      // that afternoon, the shop; the same salesman had said no in September
    const t0 = t - lt, ws = WT('store', 'salesman'), wn = WT('store', 'no');
    camBegin(540, 1000, 1.0); shop(t, t0, { noTop: false });
    person(540, 1640, 22, SALES, { in: ws - .3, mood: 'neutral', look: -.3, key: 'sales', snd: false });
    if (t > wn - .2) { P('island_cloud', 300, 1100, 240, { in: wn - .2, tint: [170, 170, 180], snd: 'pop' }); sign(300, 980, 200, 'NO', '#8C3B3B'); }
    person(200, 1880, 28, FB, { in: t0 + .1, mood: 'hopeful', look: 1, key: 'fb' });
    camEnd();
  }
  function shNo(t, lt) {         // "No, we haven't." He thought: that's not what I heard you say!
    const t0 = t - lt, wn = WT('no', 'no'), wh = WT('no', 'heard');
    camBegin(540, 1000, 1.0); shop(t, t0, { still: true });
    person(540, 1640, 22, SALES, { mood: 'neutral', look: -.6, key: 'sales', snd: false, talk: t > wn - .3 && t < wn + .8 ? talk(t) : 0 });
    if (t > wn - .1 && t < wh - .3) sign(560, 1260, 220, 'NO', '#8C3B3B');
    if (t > wh - .3) { P('island_cloud', 300, 1120, 260, { in: wh - .3, snd: 'pop' }); sign(300, 990, 200, 'YES', '#2F7A4A'); }
    person(200, 1880, 28, FB, { mood: t > wh ? 'determined' : 'surprised', look: 1, key: 'fb' });
    camEnd();
  }
  function shShelf(t, lt) {      // turning to leave: an ad on the top shelf; the salesman reaches up: the complete album
    const t0 = t - lt, wt = WT('shelf', 'top'), wr = WT('shelf', 'reached'), wa = WT('shelf', 'album'), down = ease(seg(t, wr, wa));
    camBegin(t > wt - .3 && t < wr ? 760 : 540, t > wt - .3 && t < wr ? 1200 : 1000, t > wt - .3 && t < wr ? 1.5 : 1.0); shop(t, t0, { still: true, noTop: true });
    album(lerp(840, 560, down), lerp(1010, 1420, down), lerp(90, 160, down), t, 1, t > wt - .2);
    person(t > wr - .3 ? 760 : 540, 1640, 22, SALES, { mood: t > wa ? 'surprised' : 'neutral', look: t > wr - .3 ? .4 : -.4, lookY: t > wr - .3 && t < wa ? -.6 : 0, key: 'sales', snd: false, aR: t > wr - .3 && t < wa ? 1.2 : -1.2 });
    person(200, 1880, 28, FB, { mood: t > wa ? 'joy' : t > wt ? 'surprised' : 'neutral', look: 1, lookY: t > wt && t < wa ? -.5 : 0, key: 'fb' });
    if (t > wa) cue('alb', wa, 'sparkle', 560, 300);
    camEnd();
  }
  function shLesson(t, lt) {     // it didn't go the way he pictured; it ended the way he pictured
    const t0 = t - lt, we = WT('lesson', 'ended');
    camBegin(540, 1000, 1.0); board('plum');
    if (t < we - .2) { P('sky_raincloud', 540, 1060, 220, { in: t0 + .05, sway: .04, snd: 'pop' }); }
    else { album(540, 1150, 220, t, ease(seg(t, we - .2, we + .2)), true); }
    person(540, 1860, 30, FB, { in: t0 + .05, mood: t > we ? 'beam' : 'neutral', look: 0, lookY: t > we ? -.4 : 0, key: 'fb' });
    camEnd();
  }
  function shClose(t, lt) {      // what answer are you hearing, before you ask?
    const t0 = t - lt, wa = WT('close', 'answer');
    camBegin(540, 1000, 1.0); board('plum'); if (t > wa - .3) { P('island_cloud', 780, 1150, 320, { in: wa - .3, snd: 'pop' }); sign(780, 1010, 220, 'YES', '#2F7A4A', ease(seg(t, wa - .2, wa + .2))); }
    host(t, 330, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'expect'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('want') - .12, shWant], [S('gone') - .12, shGone], [S('decide') - .12, shDecide], [S('imagine') - .12, shImagine], [S('repeat') - .12, shRepeat], [S('store') - .12, shStore], [S('no') - .12, shNo], [S('shelf') - .12, shShelf], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
