window.CHEAP = true; window.FELT = true;
// Episode 27, flannelgraph cut: "King's Road" (J.R.B. sleeps in the house first) built from the felt cutout kit (kit/cutouts) on felt boards.
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

























  const JRB = { ...C.dreamer, name: 'jrb', coat: '#7A4E8A', sleeve: '#7A4E8A', stripes: null, hair: '#B5643A', skin: '#EFCBA6', torso: 7.2, leg: 4.6, w: 4.6 };
  const HUSB = { ...C.blake, name: 'husb', coat: '#2E3A52', sleeve: '#2E3A52', hat: null, hair: '#5A4636' };
  const MOM = { ...C.dreamer, name: 'mom', coat: '#3F8F8A', sleeve: '#3F8F8A', stripes: null, hair: '#ECE8DF', skin: '#EFCBA6', torso: 7.2, leg: 4.4, w: 4.8 };
  const AUNT = { ...MOM, name: 'aunt', coat: '#C9963A', sleeve: '#C9963A', hair: '#B8B2A8' };
  const AGENT = { ...C.skeptic, name: 'agent', coat: '#8E8F96', sleeve: '#8E8F96', hat: 'fedora', hatCol: '#3A3A44', band: '#22222A' };
  const AGENT2 = { ...C.blake, name: 'agent2', coat: '#5E6B3A', sleeve: '#5E6B3A', hat: null };
  const BUYER = { ...C.blake, name: 'buyer', coat: '#8C5A3C', sleeve: '#8C5A3C', hat: 'fedora', hatCol: '#5A3A24', band: '#C9963A' };
  const OWNER = { ...C.dreamer, name: 'owner', coat: '#4A3A52', sleeve: '#4A3A52', stripes: null, hair: '#ECE8DF', skin: '#EFCBA6', torso: 7.0, leg: 4.4, w: 4.8 };
  const SAVIOR = { ...C.paul, name: 'jesus', coat: '#F3EBDC', sleeve: '#F3EBDC', pants: '#F3EBDC', sash: '#B8463A', skin: '#C98E62', hair: '#3B2A22', hairStyle: 'neat', beard: .5, beardCol: '#3B2A22', flare: .14 };
  const SIGNS = {};
  function sign(x, y, w, txt, col = '#2F7A4A', a = 1) {
    if (window.CUEMODE || a <= 0) return; const key = txt + col;
    if (!SIGNS[key]) { const g = createGraphics(700, 220); g.pixelDensity(1); const c = g.drawingContext;
      c.fillStyle = '#3A2A22'; c.beginPath(); c.roundRect(14, 20, 672, 190, 24); c.fill(); c.fillStyle = '#F6F0E2'; c.beginPath(); c.roundRect(4, 6, 672, 190, 24); c.fill();
      c.fillStyle = col; c.beginPath(); c.roundRect(20, 22, 640, 158, 16); c.fill();
      c.fillStyle = '#F6F0E2'; c.font = 'bold 92px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 340, 104); SIGNS[key] = g; }
    flushBrush(); tint(255, 255 * a); image(SIGNS[key], x - w / 2, y - w * 110 / 700, w, w * 220 / 700); noTint();
  }
  function catShape(s, pose, g, eyes) {   // felt cat parts, grown by g (for the cut margin)
    const E = (x, y, w, h) => ellipse(x, y, w + 2 * g, h + 2 * g), Tri = (ax, ay, bx, by, cx, cy) => triangle(ax - g, ay + g, bx, by - g * 1.4, cx + g, cy + g);
    if (pose === 'lie') { E(0, -s * .28, s * 1.5, s * .56); E(s * .78, -s * .48, s * .62, s * .56); Tri(s * .52, -s * .66, s * .6, -s * .98, s * .74, -s * .7); Tri(s * .84, -s * .7, s * .98, -s * .98, s * 1.04, -s * .64);
      for (let i = 0; i < 6; i++) E(-s * .7 - i * s * .07, -s * .2 + i * s * .03, s * .2, s * .2); }
    else { const up = pose === 'romp' ? -s * .25 : 0; E(0, -s * .48 + up, s * .9, s * .92); E(s * .08, -s * 1.08 + up, s * .62, s * .56);
      Tri(-s * .2, -s * 1.22 + up, -s * .12, -s * 1.56 + up, s * .04, -s * 1.3 + up); Tri(s * .12, -s * 1.3 + up, s * .3, -s * 1.56 + up, s * .36, -s * 1.2 + up);
      for (let i = 0; i < 8; i++) E(s * .42 + i * s * .06, -s * .2 - i * s * .09 + up + (pose === 'romp' ? Math.sin(i) * s * .05 : 0), s * .17, s * .17);
      if (pose === 'romp') { E(-s * .3, -s * .02, s * .2, s * .34); E(s * .3, -s * .12, s * .2, s * .34); } }
  }
  function cat(x, y, s, o = {}) {   // a felt orange tabby: pose sit | lie | romp; o.a alpha, o.sleep closed eyes, o.flip
    if (window.CUEMODE) return; s *= 1.4; const a = o.a ?? 1, pose = o.pose || 'sit'; if (o.gl) glow(x, y - s * .6, s * 1.6, '#FFD27A', o.gl);
    flushBrush(); push(); translate(x, y); if (o.flip) scale(-1, 1); rotate(o.rot || 0); noStroke();
    fill(30, 18, 12, 75 * a); push(); translate(6, 7); catShape(s, pose, 0); pop();
    fill(246, 240, 226, 255 * a); catShape(s, pose, s * .06);
    fill(o.sick ? 170 : 201, o.sick ? 120 : 119, o.sick ? 90 : 58, 255 * a); catShape(s, pose, 0);
    fill(150, 84, 40, 255 * a); if (pose !== 'lie') { const up = pose === 'romp' ? -s * .25 : 0; rect(-s * .3, -s * .7 + up, s * .6, s * .06); rect(-s * .34, -s * .5 + up, s * .68, s * .06); }
    const hx = pose === 'lie' ? s * .8 : s * .1, hy = pose === 'lie' ? -s * .48 : -s * 1.08 + (pose === 'romp' ? -s * .25 : 0);
    fill(42, 36, 48, 255 * a); if (o.sleep || o.sick) { rect(hx - s * .2, hy, s * .14, s * .03); rect(hx + s * .06, hy, s * .14, s * .03); } else { ellipse(hx - s * .13, hy, s * .09, s * .13); ellipse(hx + s * .13, hy, s * .09, s * .13); }
    fill(214, 120, 120, 255 * a); triangle(hx - s * .04, hy + s * .1, hx + s * .04, hy + s * .1, hx, hy + s * .15); pop();
  }
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
  }  function parakeet(x, y, s, t) { if (window.CUEMODE) return; flushBrush(); push(); translate(x, y + Math.sin(t * 6) * 6); noStroke(); fill(246, 240, 226); ellipse(0, 0, s * 1.15, s * .85); fill(92, 170, 92); ellipse(0, 0, s, s * .7); fill(230, 200, 60); ellipse(s * .35, -s * .2, s * .45, s * .45); fill(42, 36, 48); ellipse(s * .42, -s * .24, s * .08, s * .08); fill(230, 150, 60); triangle(s * .55, -s * .2, s * .7, -s * .14, s * .55, -s * .08); pop(); }
  function menagerie(t, tin) { if (t < tin) return;
    for (let i = 0; i < 10; i++) if (t > tin + i * .08) cat(70 + i * 105, 1915 - (i % 2) * 30, 50, { pose: i % 3 === 0 ? 'lie' : 'sit', flip: i % 2 === 1 });
    for (let i = 0; i < 3; i++) if (t > tin + .9 + i * .12) dog(200 + i * 330, 1760, 52, { flip: i === 1 });
    if (t > tin + 1.3) parakeet(900, 1220, 70, t); }
  function kingsHouse(x, y, s, t, tin, o = {}) { if (t < tin) return; P('sky_hill', x, y + s * .1, s * 1.1, { in: tin, sway: 0 }); P('city_wintertree', x - s * .55, y - s * .1, s * .6, { in: tin + .05, tint: [140, 200, 120] }); P('life_house', x, y - s * .12, s * .8, { in: tin + .1, tint: o.tint || [200, 120, 100] }); }
  function dream(x, y, s, t, tin, inner) { if (t < tin) return; P('island_cloud', x, y, s, { in: tin, snd: 'pop', sway: .02 }); if (t > tin + .1) inner(x, y, s); }
  const BX = 540, BBY = 1760, BH = 600;
  function herBed(t, t0, o = {}) {
    board('night'); P('room_window', 880, 1250, 260, { in: o.still ? null : stagger(t0, 0) }); P('island_moon', 900, 1230, 50, { in: o.still ? null : stagger(t0, 1), snd: false });
    P('room_bed', BX, BBY, BH, { in: o.still ? null : stagger(t0, 2), sway: .002 }); const tin = o.still ? -9 : stagger(t0, 3);
    person(BX, BBY - BH * .44, 11, JRB, { in: o.still ? null : tin, mood: o.mood || 'sleepy', key: 'jbed', snd: false, aL: -1.2, aR: -1.2 });
    if (T > tin + .4) piecePart('room_bed', BX, BBY, BH, .43, 1);
  }

  // ---------- shots ----------
  function shHook(t, lt) {   // she'd never split her land; next day: the house and its acre, for their price
    const t0 = t - lt, wn = WT('hook', 'never'), wd = WT('hook', 'day'), wp = WT('hook', 'price');
    camBegin(540, 1000, 1.0); board('day'); kingsHouse(540, 1350, 600, t, t0 + .05);
    if (t < wd) { person(800, 1860, 28, AGENT, { in: t0 + .1, mood: 'skeptical', look: t > wn ? (Math.sin(t * 6) > 0 ? -.8 : .2) : -1, key: 'agent', talk: talk(t) }); }
    else { sign(540, 1080, 360, 'SOLD', '#2F7A4A', ease(seg(t, wd, wd + .3))); if (t > wp - .1) { glow(540, 1200, 420, '#FFD27A', .6); cue('sold', wp, 'sparkle', 540, 300); } }
    person(300, 1860, 28, JRB, { in: t0 + .05, mood: t > wd ? 'joy' : 'hopeful', look: 1, key: 'jrb' });
    camEnd();
  }
  function shVerse(t, lt) {      // Jesus: in my Father's house are many mansions; I go to prepare a place for you
    const t0 = t - lt, wm = WT('verse', 'mansions'), wp = WT('verse', 'prepare');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, wp - .2, wp + .6)));
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (t > wm - .2) P('bible_temple', 790, 1250, 300, { in: wm - .2, snd: 'chime' });
    person(400, 1840, 40, SAVIOR, { in: stagger(t0, 1), mood: 'warm', aL: .8, look: .6, key: 'jesus', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // prepare the place first; then go there
    const t0 = t - lt, wf = WT('meaning', 'first'), wt = WT('meaning', 'there');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wf - .3) dream(780, 1150, 320, t, wf - .3, (x, y, s) => P('life_house', x, y - s * .02, s * .4, { in: wf - .2, snd: false }));
    if (t > wt - .2) glow(780, 1050, 240, '#FFD27A', .6);
    host(t, 360, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shFamily(t, lt) {     // sell, and move in with her mother and aunt; ten cats, three dogs, a parakeet
    const t0 = t - lt, wm = WT('family', 'mother'), wc = WT('family', 'cats');
    camBegin(540, 1000, 1.0); board('day'); P('life_house', 760, 1300, 440, { in: t0 + .05 });
    if (t < wc - .3) { person(260, 1860, 28, JRB, { in: t0 + .05, mood: 'happy', look: 1, key: 'jrb' }); person(420, 1860, 29, HUSB, { in: t0 + .1, mood: 'happy', look: 1, key: 'husb' });
      if (t > wm - .2) { person(700, 1860, 26, MOM, { in: wm - .2, mood: 'warm', look: -1, key: 'mom' }); person(860, 1860, 26, AUNT, { in: wm, mood: 'warm', look: -1, key: 'aunt' }); } }
    else { person(300, 1640, 22, JRB, { mood: 'joy', look: 1, key: 'jrb' }); person(760, 1640, 21, MOM, { mood: 'beam', look: -1, key: 'mom' }); menagerie(t, wc - .3); }
    camEnd();
  }
  function shSold(t, lt) {       // two months, brokers gave up; four nights asleep in the home she wanted; a stranger buys it on day five
    const t0 = t - lt, wn = WT('sold', 'nights'), wf = WT('sold', 'fifth'), wb = WT('sold', 'bought');
    camBegin(540, 1050, 1.0);
    if (t < wn - .8) { board('day'); P('life_house', 540, 1300, 460, { in: t0 + .05 }); sign(540, 1020, 300, 'FOR SALE', '#B8463A'); P('sky_raincloud', 800, 1000, 200, { in: t0 + .4, sway: .03, snd: 'pop' });
      person(300, 1860, 28, HUSB, { in: t0 + .1, mood: 'sad', look: 1, key: 'husb' }); }
    else if (t < wf - .2) { herBed(t, wn - .8, { mood: 'happy' }); dream(400, 1050, 320, t, wn - .4, (x, y, s) => P('life_house', x, y - s * .02, s * .4, { in: wn - .3, snd: false })); tally(t, 300, 760, 4, [wn - .2, wn, wn + .2, wn + .4], 140); }
    else { board('day'); P('life_house', 540, 1300, 460, { in: wf - .2 }); sign(540, 1020, 300, t > wb ? 'SOLD' : 'FOR SALE', t > wb ? '#2F7A4A' : '#B8463A'); person(800, 1860, 28, BUYER, { in: wf - .2, mood: 'happy', look: -1, key: 'buyer' });
      person(300, 1860, 28, JRB, { in: wf - .1, mood: t > wb ? 'joy' : 'hopeful', look: 1, key: 'jrb' }); if (t > wb) cue('sold', wb, 'sparkle', 540, 300); }
    camEnd();
  }
  function shList(t, lt) {       // her impossible list: English house, two living rooms, apartments, library, knoll, dogs; price too low
    const t0 = t - lt, wi = WT('list', 'impossible'), wp = WT('list', 'price');
    camBegin(540, 1000, 1.0); board('plum');
    P('prop_scroll', 540, 1250, 300, { in: t0 + .1, sway: .03 });
    const items = ['english', 'living', 'apartments', 'library', 'knoll', 'dogs'];
    items.forEach((w, i) => { const tw = WT('list', w); if (t > tw - .1) { const k = backOut(seg(t, tw - .1, tw + .2)); flushBrush(); noStroke(); fill(58, 42, 34); rect(450, 1000 + i * 34, 180 * k, 12, 6); } });
    if (t > wp - .2) P('sky_raincloud', 800, 1000, 200, { in: wp - .2, sway: .03, snd: 'pop' });
    person(820, 1860, 28, AGENT, { in: t0 + .05, mood: 'skeptical', look: -1, key: 'agent', aL: t > wi ? .4 : -1.2 });
    person(260, 1860, 28, JRB, { in: t0 + .05, mood: t > wp ? 'determined' : 'hopeful', look: 1, key: 'jrb' });
    camEnd();
  }
  function shKings(t, lt) {      // the sixth office: King's Road; not for sale; two acres, she'd never split
    const t0 = t - lt, wk = WT('kings', 'road'), wa = WT('kings', 'acres'), wn = WT('kings', 'never');
    camBegin(540, 1000, 1.0); board('plum'); P('room_desk', 540, 1620, 360, { in: t0 + .05 });
    if (t > wk - .3) dream(540, 1050, 380, t, wk - .3, (x, y, s) => { P('life_house', x, y - s * .02, s * .4, { in: wk - .2, snd: false, tint: [200, 120, 100] }); });
    if (t > wa - .2) person(940, 1860, 22, OWNER, { in: wa - .2, mood: 'determined', look: -1, key: 'owner', aL: t > wn ? -.2 : -1.2, aR: t > wn ? -.2 : -1.2 });
    person(260, 1860, 28, AGENT2, { in: t0 + .05, mood: 'warm', look: 1, key: 'agent2', talk: t < wa ? talk(t) : 0 });
    person(720, 1860, 28, AGENT, { in: t0 + .1, mood: 'skeptical', look: -1, key: 'agent', talk: t > wa - .5 ? talk(t) : 0 });
    camEnd();
  }
  function shHouse(t, lt) {      // redwood and brick on a knoll; fireplace, balcony, library; too much land; an offer anyway
    const t0 = t - lt, wo = WT('house', 'offer');
    camBegin(540, 1000, 1.0); board('day'); kingsHouse(540, 1350, 640, t, t0 + .05);
    person(260, 1860, 26, JRB, { in: t0 + .1, mood: 'beam', look: 1, lookY: -.3, key: 'jrb' });
    person(820, 1860, 28, HUSB, { in: t0 + .15, mood: t > wo ? 'determined' : 'happy', look: -1, key: 'husb', aL: t > wo ? .5 : -1.2, hold: t > wo ? (x, y, u) => P('prop_envelope', x, y + u, u * 3, { sway: .02, snd: false }) : null });
    camEnd();
  }
  function shNight(t, lt) {      // on the balcony, he by the fireplace: how do you like our new home? I love it; asleep
    const t0 = t - lt, wh = WT('night', 'honey'), wl = WT('night', 'love'), wa = WT('night', 'asleep');
    camBegin(540, 1050, 1.04); herBed(t, t0, { mood: t > wa ? 'sleepy' : 'happy' });
    dream(540, 1000, 520, t, t0 + .5, (x, y, s) => { P('room_painting', x - s * .2, y - s * .24, s * .12, { in: t0 + .6, snd: false }); P('prop_candle', x + s * .2, y - s * .06, s * .14, { in: t0 + .6, snd: false });
      person(x - s * .14, y - s * .02, s * .018, JRB, { in: t0 + .7, mood: t > wl ? 'beam' : 'happy', look: 1, key: 'jc', snd: false }); person(x + s * .14, y - s * .02, s * .019, HUSB, { in: t0 + .75, mood: 'warm', look: -1, key: 'hc', snd: false, talk: t > wh - .3 && t < wl ? talk(t) : 0 }); });
    if (t > wl) { glow(540, 940, 280, '#FFD27A', .6); cue('love', wl, 'chime', 540, 300); }
    if (t > wa) zzz(640, 1250, t, wa, .9);
    camEnd();
  }
  function shCall(t, lt) {       // next day at dinner, the agent calls: she split the land, the house and its acre, their price
    const t0 = t - lt, wc = WT('call', 'called'), ws = WT('call', 'split'), wp = WT('call', 'price');
    camBegin(540, 1000, 1.0);
    if (t < ws - .3) { board('plum'); P('room_desk', 540, 1640, 420, { in: t0 + .05 }); P('prop_candle', 540, 1420, 140, { in: t0 + .1 });
      person(300, 1860, 26, JRB, { in: t0 + .05, mood: t > wc ? 'surprised' : 'happy', look: 1, key: 'jrb', hold: t > wc - .2 ? (x, y, u) => P('prop_telephone', x, y + u, u * 2.6, { sway: .02, snd: false }) : null }); person(780, 1860, 25, MOM, { in: t0 + .1, mood: 'happy', look: -1, key: 'mom' }); }
    else { board('day'); kingsHouse(540, 1350, 600, t, ws - .3); sign(540, 1080, 360, 'SOLD', '#2F7A4A', ease(seg(t, ws, ws + .3)));
      person(300, 1860, 28, JRB, { in: ws - .2, mood: 'joy', look: 1, key: 'jrb2' }); person(780, 1860, 29, HUSB, { in: ws - .1, mood: 'beam', look: -1, key: 'husb' });
      if (t > wp - .1) { glow(540, 1200, 420, '#FFD27A', .6); cue('price', wp, 'sparkle', 540, 300); } }
    camEnd();
  }
  function shLesson(t, lt) {     // twice she slept in the house first; twice the world caught up
    const t0 = t - lt, wt2 = WT('lesson', 'twice', 1), wc = WT('lesson', 'caught');
    camBegin(540, 1050, 1.04); herBed(t, t0, { mood: 'happy' });
    tally(t, 400, 760, 2, [t0 + .3, wt2], 280);
    dream(400, 1050, 320, t, t0 + .4, (x, y, s) => P('life_house', x, y - s * .02, s * .4, { in: t0 + .5, snd: false, tint: [200, 120, 100] }));
    if (t > wc - .2) { glow(400, 960, 260, '#FFD27A', .6); cue('caught', wc, 'sparkle', 400, 300); }
    camEnd();
  }
  function shClose(t, lt) {      // whose house are you sleeping in tonight?
    const t0 = t - lt, ws = WT('close', 'sleeping');
    camBegin(540, 1000, 1.0); board('night'); P('island_moon', 820, 820, 120, { in: t0 + .1, snd: false });
    if (t > ws - .3) dream(780, 1150, 300, t, ws - .3, (x, y, s) => P('life_house', x, y - s * .02, s * .4, { in: ws - .2, snd: false }));
    host(t, 360, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'mind'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('family') - .12, shFamily], [S('sold') - .12, shSold], [S('list') - .12, shList], [S('kings') - .12, shKings], [S('house') - .12, shHouse], [S('night') - .12, shNight], [S('call') - .12, shCall], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
