window.CHEAP = true; window.FELT = true;
// Episode 26, flannelgraph cut: "The Verdict" (Mrs. G.R. hears the ending) built from the felt cutout kit (kit/cutouts) on felt boards.
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
























  const GR = { ...C.dreamer, name: 'gr', coat: '#3F6FB0', sleeve: '#3F6FB0', stripes: null, hair: '#8C7A68', skin: '#EFCBA6', torso: 7.4, leg: 4.6, w: 4.6 };
  const HUSB = { ...C.blake, name: 'husb', coat: '#5E6B3A', sleeve: '#5E6B3A', hat: null, hair: '#9A958C' };
  const BROKER = { ...C.blake, name: 'broker', coat: '#8E8F96', sleeve: '#8E8F96', lapel: '#22222A', hat: 'fedora', hatCol: '#3A3A44', band: '#B8463A' };
  const LAWYER = { ...C.skeptic, name: 'lawyer', coat: '#22222A', sleeve: '#22222A', hat: null };
  const LAWS = [0, 1, 2].map(i => ({ ...C.skeptic, name: 'law' + i, coat: ['#2E3A52', '#3A3A44', '#4A3A52'][i], sleeve: ['#2E3A52', '#3A3A44', '#4A3A52'][i], hat: null }));
  const JUDGE = { ...C.skeptic, name: 'judge', coat: '#1A1A20', sleeve: '#1A1A20', lapel: '#1A1A20', hat: null, hair: '#ECE8DF' };
  const FORE = { ...C.blake, name: 'fore', coat: '#8C5A3C', sleeve: '#8C5A3C', hat: null, hair: '#3B2A22' };
  const JURY = ['#B8463A', '#3F8F8A', '#C9963A', '#7A4E8A', '#5E6B3A'].map((c, i) => ({ ...C.dreamer, name: 'jur' + i, coat: c, sleeve: c, stripes: null, hair: ['#2B1E19', '#B5643A', '#E6B82A', '#5A3A24', '#8C7A68'][i] }));
  const ISAIAH = { ...C.paul, name: 'isaiah', coat: '#3F6FB0', sleeve: '#3F6FB0', pants: '#3F6FB0', sash: '#E6B82A', hair: '#ECE8DF', hairStyle: 'neat', beard: .6, beardCol: '#ECE8DF' };
  const SIGNS = {};
  function sign(x, y, w, txt, col = '#2F7A4A', a = 1) {
    if (window.CUEMODE || a <= 0) return; const key = txt + col;
    if (!SIGNS[key]) { const g = createGraphics(700, 220); g.pixelDensity(1); const c = g.drawingContext;
      c.fillStyle = '#3A2A22'; c.beginPath(); c.roundRect(14, 20, 672, 190, 24); c.fill(); c.fillStyle = '#F6F0E2'; c.beginPath(); c.roundRect(4, 6, 672, 190, 24); c.fill();
      c.fillStyle = col; c.beginPath(); c.roundRect(20, 22, 640, 158, 16); c.fill();
      c.fillStyle = '#F6F0E2'; c.font = 'bold 92px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 340, 104); SIGNS[key] = g; }
    flushBrush(); tint(255, 255 * a); image(SIGNS[key], x - w / 2, y - w * 110 / 700, w, w * 220 / 700); noTint();
  }
  function bench(x, y, w) { if (window.CUEMODE) return; flushBrush(); push(); noStroke(); fill(58, 42, 34); rect(x - w / 2 + 8, y + 8, w, w * .42, 14); fill(122, 78, 52); rect(x - w / 2, y, w, w * .42, 14); fill(150, 100, 66); rect(x - w / 2, y, w, 30, 10); pop(); }
  function court(t, o = {}) {   // a felt courtroom: the judge's bench and the jury box
    board('plum'); glow(540, 1200, 560, '#FFE2A8', .2);
    person(540, 1240, 22, JUDGE, { mood: o.jm || 'skeptical', look: o.jl || .4, key: 'judge', snd: false }); bench(540, 1080, 420);
    if (!o.noJury) { for (let i = 0; i < 4; i++) person(130 + i * 70, 1360, 11, JURY[i], { mood: 'neutral', look: .5, key: 'j' + i, snd: false }); if (!o.foreUp) person(410, 1360, 11, FORE, { mood: 'neutral', look: .5, key: 'fore', snd: false }); bench(270, 1300, 380); }
  }
  function thought(x, y, s, t, tin, txt = 'NOT GUILTY') { if (t < tin) return; P('island_cloud', x, y, s, { in: tin, snd: 'pop', sway: .02 }); sign(x, y - s * .55, s * .9, txt, '#2F7A4A', ease(seg(t, tin + .1, tin + .4))); }

  // ---------- shots ----------
  function shHook(t, lt) {   // not the slightest chance; she listens to one sentence nobody had said yet
    const t0 = t - lt, wc = WT('hook', 'chance'), ws = WT('hook', 'sentence');
    camBegin(540, 1000, 1.0); board('plum');
    person(780, 1860, 30, LAWYER, { in: t0 + .05, mood: 'skeptical', look: t < ws ? (Math.sin(t * 6) > 0 ? -.8 : .2) : -1, key: 'lawyer' });
    if (t > wc - .2) P('sky_raincloud', 780, 1080, 200, { in: wc - .2, sway: .03, snd: 'pop' });
    if (t > ws - .3) thought(320, 1180, 360, t, ws - .3);
    person(320, 1860, 30, GR, { in: t0 + .05, mood: t > ws ? 'hopeful' : 'worried', look: t > ws ? 0 : 1, lookY: t > ws ? -.4 : 0, key: 'gr' });
    camEnd();
  }
  function shVerse(t, lt) {      // Isaiah: no weapon formed against thee shall prosper
    const t0 = t - lt, ww = WT('verse', 'weapon'), wc = WT('verse', 'condemn');
    camBegin(540, 1050, 1.0 + .015 * lt); board('plum'); glow(560, 1050, 600, '#FFD27A', .25 + .45 * ease(seg(t, wc - .2, wc + .6)));
    P('prop_candle', 140, 1700, 300, { in: stagger(t0, 0) }); if (t > ww - .2) P('bible_staff', 800, 1500, 420, { in: ww - .2, snd: 'pop' });
    person(420, 1840, 40, ISAIAH, { in: stagger(t0, 1), mood: 'wise', aL: .8, look: .6, key: 'isaiah', hold: PROPS.scroll });
    camEnd();
  }
  function shMeaning(t, lt) {    // every tongue against you, even in a courtroom
    const t0 = t - lt, wc = WT('meaning', 'courtroom');
    camBegin(540, 1000, 1.0); board('plum'); if (t > wc - .2) { bench(780, 1300, 300); glow(780, 1300, 240, '#FFD27A', .4); }
    host(t, 360, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shHouse(t, lt) {      // selling their home to buy a bigger place, deposit down
    const t0 = t - lt, wb = WT('house', 'bigger'), wd = WT('house', 'deposit');
    camBegin(540, 1000, 1.0); board('day'); P('life_house', 300, 1500, 420, { in: t0 + .05 }); if (t > t0 + .4) sign(300, 1150, 260, 'FOR SALE', '#B8463A');
    if (t > wb - .3) { P('island_cloud', 780, 1050, 340, { in: wb - .3, snd: 'pop' }); P('life_house', 780, 1060, 200, { in: wb - .2, snd: false }); }
    if (t > wd - .2) P('life_coinbag', 900, 1700, 120, { in: wd - .2, snd: 'pop' });
    person(560, 1870, 26, GR, { in: t0 + .1, mood: 'happy', look: 1, key: 'gr' }); person(720, 1870, 27, HUSB, { in: t0 + .15, mood: 'happy', look: -1, key: 'husb' });
    camEnd();
  }
  function shBroker(t, lt) {     // a broker pushes; they agree to wait; a paper he says isn't binding
    const t0 = t - lt, wb = WT('broker', 'broker'), wp = WT('broker', 'paper'), wbi = WT('broker', 'binding');
    camBegin(540, 1000, 1.0); board('plum'); P('room_desk', 540, 1600, 360, { in: t0 + .05 });
    if (t > wp - .2) P('prop_scroll', 540, 1380, 160, { in: wp - .2, snd: 'pop', sway: .04 });
    person(800, 1860, 30, BROKER, { in: wb - .3, mood: 'happy', look: -1, key: 'broker', talk: talk(t), aL: t > wbi ? .4 : -1.2 });
    person(240, 1860, 26, GR, { in: t0 + .05, mood: 'neutral', look: 1, key: 'gr' }); person(380, 1860, 27, HUSB, { in: t0 + .1, mood: 'neutral', look: 1, key: 'husb' });
    camEnd();
  }
  function shBinding(t, lt) {    // it was binding; the new place fell through; forget it; then sued for $1,500
    const t0 = t - lt, ww = WT('binding', 'was'), wf = WT('binding', 'fell'), wfo = WT('binding', 'forget'), ws = WT('binding', 'sued');
    camBegin(540, 1000, 1.0); board('plum');
    if (t < wf + .4) { P('prop_scroll', 540, 1250, 220, { in: t0 + .05, sway: .04 }); if (t > ww - .1) glow(540, 1250, 220, '#E05A4A', .5); }
    if (t > wf - .2 && t < wfo) { P('island_cloud', 780, 1050, 300, { in: wf - .2, out: wf + .6, tint: [170, 170, 180], snd: 'pop' }); P('life_house', 780, 1060, 170, { in: wf - .1, out: wf + .6, tint: [170, 170, 180], snd: false }); }
    if (t > wfo - .3) person(800, 1860, 30, BROKER, { in: wfo - .3, mood: t > ws ? 'determined' : 'happy', look: -1, key: 'broker', aL: t < ws ? .5 : -1.2, aR: t < ws ? .5 : -1.2 });
    if (t > ws - .2) sign(540, 1200, 360, 'SUED $1,500', '#8C3B3B', ease(seg(t, ws - .2, ws + .2)));
    person(260, 1860, 28, GR, { in: t0 + .05, mood: t > ws ? 'surprised' : t > wf ? 'sad' : 'worried', look: 1, key: 'gr' });
    camEnd();
  }
  function shLawyer(t, lt) {     // a jury; the law is very strict; not the slightest chance
    const t0 = t - lt, wj = WT('lawyer', 'jury'), wc = WT('lawyer', 'chance');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wj - .2) { for (let i = 0; i < 5; i++) person(560 + i * 90, 1300, 10, JURY[i], { in: wj - .2 + i * .05, mood: 'neutral', key: 'jj' + i, snd: false }); bench(740, 1240, 460); }
    person(760, 1860, 30, LAWYER, { in: t0 + .05, mood: 'skeptical', look: t > wc ? (Math.sin(t * 6) > 0 ? -.8 : .2) : -1, key: 'lawyer', talk: talk(t) });
    if (t > wc - .2) P('sky_raincloud', 320, 1060, 220, { in: wc - .2, sway: .03, snd: 'pop' });
    person(320, 1860, 28, GR, { in: t0 + .05, mood: t > wc ? 'sad' : 'worried', look: 1, key: 'gr' });
    camEnd();
  }
  function shCourt(t, lt) {      // husband in hospital; no witnesses; three lawyers and witnesses; the judge on his side
    const t0 = t - lt, wh = WT('court', 'hospital'), wt = WT('court', 'three'), wj = WT('court', 'judge');
    camBegin(540, 1000, 1.0); court(t, { jl: t > wj ? .8 : .4 });
    if (t > wh - .3 && t < wt) { P('island_cloud', 230, 1560, 220, { in: wh - .3, out: wt - .2, tint: [170, 170, 180], snd: 'pop' }); P('room_bed', 230, 1580, 110, { in: wh - .2, out: wt - .2, snd: false }); }
    if (t > wt - .2) for (let i = 0; i < 3; i++) person(660 + i * 110, 1870, 24, LAWS[i], { in: wt - .2 + i * .1, mood: 'determined', look: -1, key: 'law' + i });
    if (t > wt - .2) person(980, 1870, 24, BROKER, { in: wt + .1, mood: 'happy', look: -1, key: 'broker' });
    person(260, 1870, 26, GR, { in: t0 + .05, mood: 'worried', look: 1, key: 'gr' });
    camEnd();
  }
  function shImagine(t, lt) {    // she stops listening; imagines the foreman standing: we find the defendant not guilty
    const t0 = t - lt, ws = WT('imagine', 'standing'), wg = WT('imagine', 'guilty');
    camBegin(540, 1000, 1.0); court(t);
    for (let i = 0; i < 3; i++) person(660 + i * 110, 1870, 24, LAWS[i], { mood: 'determined', look: -1, key: 'law' + i, talk: talk(t + i) });
    person(200, 1870, 26, GR, { in: t0 + .05, mood: t > wg ? 'happy' : 'sleepy', look: .2, key: 'gr' });
    if (t > ws - .3) { P('island_cloud', 470, 1640, 280, { in: ws - .3, snd: 'pop' }); person(470, 1560, 8, FORE, { in: ws - .2, mood: 'warm', key: 'fc', snd: false }); }
    if (t > wg - .3) { sign(470, 1420, 280, 'NOT GUILTY', '#2F7A4A', ease(seg(t, wg - .3, wg))); glow(470, 1460, 240, '#FFD27A', .5); }
    camEnd();
  }
  function shWaited(t, lt) {     // from noon until four thirty, while the jury decides, she hears it over and over
    const t0 = t - lt, wn = WT('waited', 'noon'), wf = WT('waited', 'four'), wo = WT('waited', 'over');
    camBegin(540, 1000, 1.0); court(t, { noJury: true });
    if (t > wn - .2) P('room_clock', 860, 1450, 180, { in: wn - .2, snd: 'pop' });
    person(200, 1870, 26, GR, { in: t0 + .05, mood: 'hopeful', look: .2, lookY: -.3, key: 'gr' });
    thought(470, 1640, 280, t, t0 + .3);
    if (t > wo - .2) for (let i = 0; i < 3; i++) { const k = seg(t, wo + i * .3, wo + i * .3 + .9); if (k > 0 && k < 1) glow(470, 1460, 120 + 220 * k, '#FFD27A', .5 * (1 - k)); }
    camEnd();
  }
  function shVerdict(t, lt) {    // the jury returns; the foreman stands; we find the defendant not guilty
    const t0 = t - lt, ws = WT('verdict', 'stand'), wg = WT('verdict', 'guilty');
    camBegin(540, 1000, 1.0); court(t, { foreUp: t > ws - .2, jm: t > wg ? 'neutral' : 'skeptical' });
    if (t > ws - .2) person(410, 1340, 14, FORE, { in: ws - .2, mood: 'warm', look: .5, key: 'foreup', snd: false });
    if (t > wg - .3) { sign(540, 1560, 380, 'NOT GUILTY', '#2F7A4A', ease(seg(t, wg - .3, wg))); glow(540, 1560, 320, '#FFD27A', .6); cue('verdict', wg, 'sparkle', 540, 300); }
    person(860, 1870, 24, BROKER, { mood: t > wg ? 'sad' : 'happy', look: -1, key: 'broker' });
    person(230, 1870, 26, GR, { in: t0 + .05, mood: t > wg ? 'joy' : 'hopeful', look: 1, key: 'gr', aL: t > wg ? .7 : -1.2, aR: t > wg ? .7 : -1.2 });
    camEnd();
  }
  function shLesson(t, lt) {     // she didn't argue her case in her head; she heard the ending
    const t0 = t - lt, wa = WT('lesson', 'argue'), we = WT('lesson', 'ending');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > wa - .3 && t < we - .2) P('sky_raincloud', 540, 1080, 260, { in: wa - .3, out: we - .3, sway: .04, snd: 'pop' });
    if (t > we - .3) { thought(540, 1180, 380, t, we - .3); glow(540, 1100, 300, '#FFD27A', .5); }
    person(540, 1860, 30, GR, { in: t0 + .05, mood: t > we ? 'beam' : 'neutral', look: 0, lookY: -.3, key: 'gr' });
    camEnd();
  }
  function shClose(t, lt) {      // what's the sentence you need to hear?
    const t0 = t - lt, wh = WT('close', 'hear');
    camBegin(540, 1000, 1.0); board('plum'); if (t > wh - .3) { P('island_cloud', 780, 1050, 300, { in: wh - .3, snd: 'pop' }); glow(780, 950, 220, '#FFD27A', .5); }
    host(t, 380, 1830, 38, { in: t0 + .02, mood: 'warm', look: .5 });
    camEnd();
  }
  function shCta(t, lt, dur) {   // Temple: temple pressed on; the phone tracks; slip and back; goals get easier; sparkle
    const t0 = t - lt, wt = WT('cta', 'temple'), wtr = WT('cta', 'tracks'), wsl = WT('cta', 'hearing'), wg = WT('cta', 'goals'), we = WT('cta', 'easier'), wmf = WT('cta', 'manifestations');
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
    [0, shHook], [S('verse') - .12, shVerse], [S('meaning') - .12, shMeaning], [S('house') - .12, shHouse], [S('broker') - .12, shBroker], [S('binding') - .12, shBinding], [S('lawyer') - .12, shLawyer], [S('court') - .12, shCourt], [S('imagine') - .12, shImagine], [S('waited') - .12, shWaited], [S('verdict') - .12, shVerdict], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
