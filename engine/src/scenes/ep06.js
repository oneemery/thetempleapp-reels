window.CHEAP = true; window.FELT = true;
// Episode 6, flannelgraph cut: "The Cat" (the widow and the half) built from the felt cutout kit (kit/cutouts) on felt boards.
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




  const WIDOW = { ...C.dreamer, name: 'widow', coat: '#6B4E7A', sleeve: '#6B4E7A', stripes: null, hair: '#C8C2B8', skin: '#EFCBA6', torso: 7.2, leg: 4.4, w: 4.8, hw: 2.4, hh: 2.7 };
  const NIECE = { ...C.dreamer, name: 'niece', coat: '#3F8F8A', sleeve: '#3F8F8A', stripes: null, hair: '#5A3A24', skin: '#E6B48C', torso: 6.8, leg: 4.4, w: 4.4 };
  const VET = { ...C.skeptic, name: 'vet', coat: '#F3EBDC', sleeve: '#F3EBDC', lapel: '#D9D4C8', tie: '#3F6FB0', hat: null };
  const VET2 = { ...VET, name: 'vet2', hair: '#9A958C', glasses: false };
  const MAN_LINEN = { ...C.paul, name: 'linen', coat: '#F6F0E2', sleeve: '#F6F0E2', pants: '#F6F0E2', sash: '#C9963A', hair: '#E8E4DA', hairStyle: 'neat', beard: .4, beardCol: '#E8E4DA' };
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
  function bowl(x, y, s, milk = 1) { if (window.CUEMODE) return; flushBrush(); push(); translate(x, y); noStroke(); fill(30, 18, 12, 70); ellipse(5, 5, s * 1.3, s * .4);
    fill(63, 111, 176); arc(0, 0, s * 1.2, s * .8, 0, PI); rect(-s * .6, -s * .08, s * 1.2, s * .1); if (milk > 0) { fill(250, 248, 240); ellipse(0, -s * .04, s * 1.08 * milk, s * .2 * milk); } pop(); }
  function sitIn(t, cx, by, h, spec, o = {}) {   // a person seated in the armchair: chair, person, then the chair's front over the legs
    P('room_armchair', cx, by, h, { in: o.in, sway: .003 }); person(cx, by - h * .22, o.u || 22, spec, o); if (T > (o.in ?? -9) + .4) piecePart('room_armchair', cx, by, h, .58, 1);
  }

  // ---------- shots ----------
  function shHook(t, lt) {   // two vets say no; she closes her eyes in her chair instead
    const t0 = t - lt, wv = WT('hook', 'vets'), wh = WT('hook', 'herself'), sl = t > wh;
    camBegin(540, 1000, 1.0); board('plum'); if (sl) glow(760, 1350, 420, '#FFD27A', .6 * ease(seg(t, wh, wh + .6)));
    person(150, 1840, 26, VET, { in: t0 + .05, mood: 'determined', look: 1, key: 'v1', aR: t > wv ? .2 : -1.2 }); person(330, 1840, 26, VET2, { in: t0 + .15, mood: 'skeptical', look: 1, key: 'v2' });
    sitIn(t, 760, 1840, 420, WIDOW, { in: t0 + .25, mood: sl ? 'sleepy' : 'sad', look: -.6, key: 'wid' });
    cat(560, 1860, 90, { sick: !sl, sleep: sl, pose: 'lie' }); if (sl) zzz(860, 1300, t, wh + .2, .8);
    camEnd();
  }
  function shVerse(t, lt) {      // the man in linen over the river: a time, times, and an half (three felt dots)
    const t0 = t - lt, w1 = WT('verse', 'time'), w2 = WT('verse', 'times'), w3 = WT('verse', 'half');
    camBegin(540, 1000, 1.0 + .015 * lt); board('day'); glow(540, 1200, 520, '#FFE2A8', .6);
    for (let i = 0; i < 4; i++) P('island_waves', 140 + i * 270, 1560, 140, { in: stagger(t0, i, .05), sway: .02 });
    person(540, 1520, 34, MAN_LINEN, { in: stagger(t0, 4), mood: 'wise', key: 'linen', aL: .9, aR: .9 });
    tally(t, 400, 760, 3, [w1, w2, w3 - .1], 140);
    camEnd();
  }
  function shReading(t, lt) {    // Neville's reading: do the scene (a cloud), do it again (another), fall asleep in it (moon)
    const t0 = t - lt, w1 = WT('reading', 'time'), w2 = WT('reading', 'again'), w3 = WT('reading', 'asleep');
    camBegin(540, 1000, 1.0); board('plum');
    if (t > w1 - .2) { P('island_cloud', 260, 900, 220, { in: w1 - .2, snd: 'pop' }); cat(260, 930, 50, { pose: 'romp' }); }
    if (t > w2 - .2) { P('island_cloud', 560, 760, 220, { in: w2 - .2, snd: 'pop' }); cat(560, 790, 50, { pose: 'romp', flip: true }); }
    if (t > w3 - .2) { P('island_moon', 840, 900, 220, { in: w3 - .2, snd: 'chime' }); zzz(900, 760, t, w3, .7); }
    host(t, 540, 1820, 36, { in: t0 + .02, mood: 'warm', aR: t > w1 - .2 ? .3 : -1.2, look: .3 });
    camEnd();
  }
  function shWidow(t, lt) {      // Neville's apartment house; the widow and her cat
    const t0 = t - lt, wc = WT('widow', 'cat'), wh = WT('widow', 'heart');
    camBegin(540, 1000, 1.0); board('day'); P('city_brownstone', 300, 1500, 760, { in: stagger(t0, 0), sway: .004 }); P('city_streetlamp', 980, 1560, 520, { in: stagger(t0, 1) });
    person(680, 1840, 30, WIDOW, { in: stagger(t0, 2), mood: t > wh - .3 ? 'warm' : 'happy', look: .4, key: 'wid' });
    if (t > wc - .3) { cat(860, 1860, 100, { pose: 'sit' }); cue('meow', wc - .2, 'pop', 860, 200); } if (t > wh - .2) glow(760, 1500, 300, '#FFC0A0', .6 * ease(seg(t, wh - .2, wh + .5)));
    camEnd();
  }
  function shIll(t, lt) {        // under the bed, in pain, not eating
    const t0 = t - lt, we = WT('ill', 'eaten'), wb = WT('ill', 'bed');
    camBegin(540, 1080, 1.08); board('night');
    P('room_window', 760, 860, 460, { in: stagger(t0, 0) }); P('room_bed', 600, 1720, 620, { in: stagger(t0, 1), sway: .002 });
    cat(560, 1750, 80, { sick: true, pose: 'lie' }); piecePart('room_bed', 600, 1720, 620, .78, 1);
    if (t > we - .2) bowl(860, 1840, 110, 1);
    person(220, 1840, 30, WIDOW, { in: stagger(t0, 2), mood: 'worried', look: 1, lookY: .5, key: 'wid' });
    camEnd();
  }
  function shVets(t, lt) {       // two vets: can't be cured
    const t0 = t - lt, wc = WT('vets', 'cured'), ws = WT('vets', 'sleep');
    camBegin(540, 1000, 1.0); board('sand'); P('room_painting', 300, 620, 240, { in: stagger(t0, 0) });
    person(260, 1840, 30, VET, { in: stagger(t0, 1), mood: 'determined', look: 1, key: 'v1', aR: t > wc ? .2 : -1.2 }); person(470, 1840, 30, VET2, { in: stagger(t0, 2), mood: 'sad', look: 1, key: 'v2' });
    cat(680, 1860, 80, { sick: true, pose: 'lie' });
    person(880, 1840, 30, WIDOW, { in: stagger(t0, 3), mood: t > ws ? 'sad' : 'worried', look: -1, key: 'wid' });
    if (t > ws) cue('no', ws, 'door', 400, 300);
    camEnd();
  }
  function shAdvice(t, lt) {     // Neville: tonight, imagine him as his old healthy self (a cloud with the cat romping)
    const t0 = t - lt, wi = WT('advice', 'imagine'), wr = WT('advice', 'real');
    camBegin(540, 1000, 1.0); board('plum'); glow(540, 1100, 500, '#FFD27A', .4);
    person(300, 1840, 32, C.neville, { in: stagger(t0, 0), mood: 'warm', look: 1, key: 'nev', aR: t > wi - .2 ? .5 : -1.2, talk: talk(t) });
    person(800, 1840, 30, WIDOW, { in: stagger(t0, 1), mood: t > wr ? 'hopeful' : 'worried', look: -1, key: 'wid' });
    if (t > wi - .2) { P('island_cloud', 560, 1000, 340, { in: wi - .2, snd: 'pop', sway: .02 }); cat(560, 1050, 70, { pose: 'romp', gl: .3 }); }
    camEnd();
  }
  function shNiece(t, lt) {      // she asks her niece to stay, just in case
    const t0 = t - lt, wn = WT('niece', 'niece'), wv = WT('niece', 'vet');
    camBegin(540, 1000, 1.0); board('warm'); P('room_window', 540, 880, 460, { in: stagger(t0, 0) }); P('room_lamp', 160, 1150, 240, { in: stagger(t0, 1) });
    person(330, 1840, 30, WIDOW, { in: stagger(t0, 2), mood: 'worried', look: 1, key: 'wid', aR: t > wv - .3 ? .3 : -1.2 });
    if (t > wn - .3) person(780, 1840, 30, NIECE, { in: wn - .3, mood: 'happy', look: -1, key: 'niece' });
    cat(560, 1860, 80, { sick: true, pose: 'lie' });
    camEnd();
  }
  function shChair(t, lt) {      // the easy chair: a ghost cat romps around her, scratches the furniture
    const t0 = t - lt, wr = WT('chair', 'romping'), ws = WT('chair', 'scratching');
    camBegin(540, 1000, 1.0); board('night'); P('room_lamp', 140, 1150, 240, { in: stagger(t0, 0) }); glow(140, 1000, 300, '#FFC07A', .6);
    P('room_window', 820, 860, 420, { in: stagger(t0, 1) }); rug(560, 1900, 360, { in: stagger(t0, 2) });
    sitIn(t, 380, 1840, 440, WIDOW, { in: stagger(t0, 3), mood: 'warm', look: 1, key: 'wid' });
    if (t > wr - .3) { const k = t - wr, x = 720 + 140 * Math.sin(k * 3), hop = Math.abs(Math.sin(k * 6)) * 60; cat(x, 1860 - hop, 90, { pose: 'romp', a: .6, flip: Math.cos(k * 3) < 0, gl: .4 }); if (k < .1) cue('romp', wr, 'sparkle', 720, 300); }
    if (t > ws - .2 && t < ws + 1) cue('scratch', ws, 'ticks', 600, .8);
    camEnd();
  }
  function shWander(t, lt) {     // her attention drifts (the cloud floats off); she brings it back and starts again
    const t0 = t - lt, wb = WT('wander', 'back'), wa = WT('wander', 'again'), drift = ease(seg(t, t0 + .2, wb - .2)) * (1 - ease(seg(t, wb - .2, wb + .3)));
    camBegin(540, 1000, 1.0); board('night'); P('room_lamp', 140, 1150, 240, {}); glow(140, 1000, 300, '#FFC07A', .6);
    sitIn(t, 380, 1840, 440, WIDOW, { mood: drift > .5 ? 'neutral' : 'determined', look: drift > .3 ? -1 : 1, key: 'wid' });
    P('island_cloud', 720 + 300 * drift, 1150 - 500 * drift, 300 * (1 - .4 * drift), { sway: .02, snd: false }); cat(720 + 300 * drift, 1180 - 500 * drift, 60 * (1 - .4 * drift), { pose: 'romp', a: .7 });
    if (t > wb - .2) cue('backagain', wb, 'pop', 720, 200); if (t > wa) cue('again', wa, 'sparkle', 720, 300);
    camEnd();
  }
  function shAsleep(t, lt) {     // relief: she drops off to sleep in the chair
    const t0 = t - lt, wr = WT('asleep', 'relief'), wf = WT('asleep', 'asleep'), lit = ease(seg(t, wr - .2, wr + .8));
    camBegin(420, 1300, 1.25); board('night'); P('room_lamp', 140, 1150, 240, {}); glow(380, 1450, 420, '#FFD27A', .7 * lit);
    sitIn(t, 380, 1840, 440, WIDOW, { mood: t > wf - .2 ? 'sleepy' : 'warm', key: 'wid' }); zzz(520, 1280, t, wf, .9);
    camEnd();
  }
  function shFour(t, lt) {       // 4 a.m.: the clock, a cry, the real cat by her chair
    const t0 = t - lt, wf = WT('four', 'four'), wc = WT('four', 'cry'), ws = WT('four', 'standing');
    camBegin(480, 1250, 1.2); board('night'); P('room_lamp', 140, 1150, 240, {});
    if (t > wf - .2) P('room_clock', 760, 820, 200, { in: wf - .2, snd: 'ticks' });
    sitIn(t, 380, 1840, 440, WIDOW, { mood: t > wc ? 'surprised' : 'sleepy', key: 'wid', look: t > wc ? 1 : 0 });
    if (t > wc - .3) { cat(700, 1860, 110, { pose: 'sit', gl: .3 }); cue('cry', wc - .2, 'pop', 700, 300); }
    camEnd();
  }
  function shMilk(t, lt) {       // the kitchen: warm milk, gone, and he cries for more
    const t0 = t - lt, wk = WT('milk', 'kitchen'), wm = WT('milk', 'milk'), wd = WT('milk', 'drank'), wmo = WT('milk', 'more');
    camBegin(540, 1050, 1.04); board('sand'); P('room_window', 700, 860, 440, { in: stagger(t0, 0) }); P('room_lamp', 160, 1150, 220, { in: stagger(t0, 1) });
    person(300, 1840, 30, WIDOW, { in: stagger(t0, 2), mood: t > wmo ? 'joy' : 'happy', look: 1, lookY: .4, key: 'wid', aR: t > wm - .2 && t < wd ? .2 : -1.2 });
    if (t > wm - .2) bowl(760, 1860, 120, 1 - ease(seg(t, wd, wmo - .2)));
    cat(t > wm ? 640 : lerp(900, 640, ease(seg(t, t0, wk + .5))), 1860, 100, { pose: t > wd && t < wmo ? 'lie' : 'sit', flip: true });
    if (t > wmo) cue('more', wmo, 'pop', 640, 200);
    camEnd();
  }
  function shYears(t, lt) {      // five more years: five dots; the cat curled asleep, peaceful
    const t0 = t - lt, wf = WT('years', 'five');
    camBegin(540, 1000, 1.0); board('warm'); P('room_window', 540, 860, 460, { in: stagger(t0, 0) }); rug(540, 1880, 380, { in: stagger(t0, 1) });
    tally(t, 300, 1180, 5, Array.from({ length: 5 }, (_, i) => wf + i * .12), 120);
    cat(540, 1860, 110, { pose: 'lie', sleep: true, gl: .4 });
    camEnd();
  }
  function shLesson(t, lt) {     // a time, times, and the half: three dots, then the moon
    const t0 = t - lt, w1 = WT('lesson', 'time'), w2 = WT('lesson', 'times'), w3 = WT('lesson', 'half');
    camBegin(540, 1000, 1.0); board('night');
    tally(t, 400, 900, 3, [w1, w2, w3], 140); if (t > w3) P('island_moon', 540, 640, 200, { in: w3 + .1, snd: 'chime' });
    sitIn(t, 540, 1840, 440, WIDOW, { in: t0, mood: 'sleepy', key: 'wid' }); zzz(680, 1280, t, w3 + .4, .8);
    camEnd();
  }
  function shClose(t, lt) {      // what will you fall asleep in tonight?
    const t0 = t - lt, wa = WT('close', 'asleep');
    camBegin(540, 1000, 1.0); board('night'); P('island_moon', 820, 520, 200, { in: t0 + .1 }); P('sky_stars', 260, 520, 220, { in: t0 + .2 });
    host(t, 540, 1820, 38, { in: t0 + .02, mood: 'warm', look: 0, aR: t > wa - .3 ? .3 : -1.2 }); if (t > wa) zzz(700, 1250, t, wa, .8);
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
    [0, shHook], [S('verse') - .12, shVerse], [S('reading') - .12, shReading], [S('widow') - .12, shWidow], [S('ill') - .12, shIll], [S('vets') - .12, shVets], [S('advice') - .12, shAdvice], [S('niece') - .12, shNiece], [S('chair') - .12, shChair], [S('wander') - .12, shWander], [S('asleep') - .12, shAsleep], [S('four') - .12, shFour], [S('milk') - .12, shMilk], [S('years') - .12, shYears], [S('lesson') - .12, shLesson], [S('close') - .12, shClose], [S('cta') - .12, shCta], [S('comment') - .12, shComment],
  ]);
})();
