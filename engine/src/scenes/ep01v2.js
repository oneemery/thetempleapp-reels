window.CHEAP = true;
// Episode 1 remake: "You Are In Barbados" with the recurring cast. One voice (Emery, narrator and host); the cast act and
// react with sound effects. Times come from VOICE_LINES (voice_data.js) and AMP (per 1/24 s loudness, for Emery's mouth).
(() => {
  const VL = id => VOICE_LINES.find(l => l.id === id);
  const WT = (id, w, n = 0) => { const L = VL(id), k = w.toLowerCase(); const h = L.words.filter(x => x[0].toLowerCase().replace(/[^a-z']/g, '') === k); return (h[n] || h[0] || ['', L.t0])[1]; };
  const S = id => VL(id).t0;
  // talking mouth: loudness smoothed over ~100 ms, shape from the vowel being spoken in the current word
  const WORDS = (typeof VOICE_LINES !== 'undefined' ? VOICE_LINES : []).flatMap(L => L.words.map(w => ({ txt: String(w[0]).toLowerCase().replace(/[^a-z]/g, ''), a: w[1], b: Math.max(w[2], w[1] + .08) })));
  const ampAt = t => { if (typeof AMP === 'undefined') return 0; let s = 0, n = 0; for (let d = -2; d <= 1; d++) { const v = AMP[Math.floor(t * 24) + d]; if (v != null) { s += v * (d === 0 ? 2 : 1); n += d === 0 ? 2 : 1; } } return n ? s / n : 0; };
  const talk = t => {
    const w = WORDS.find(w => t >= w.a - .03 && t <= w.b + .02);
    const a = ampAt(t), open0 = clamp((a - .1) / .55);
    if (!w || !w.txt) return { on: open0 > .35, open: open0 * .4, round: .2 };
    const k = clamp((t - w.a) / (w.b - w.a)), vs = w.txt.match(/[aeiouy]+/g) || ['a'], v = vs[Math.min(vs.length - 1, Math.floor(k * vs.length))];
    const round = /^(o|oo|ou|u|ow|oa)/.test(v) || /w/.test(w.txt[0]) && k < .3 ? .9 : /^(e|ee|i|ie|y|ea)/.test(v) ? .05 : .4;
    const lips = /^[mbp]/.test(w.txt) && k < .18 || /[mbp]$/.test(w.txt) && k > .85;
    const open = lips ? 0 : clamp(.25 + open0 * .9) * (/^(i|ee|y)/.test(v) ? .7 : 1);
    return { on: true, open, round };
  };
  const C = CAST;

  // ---------- shared painting (from episode 1) ----------
  const bg = (col, key) => { boilSeed('bg' + key); paint(rectPts(-200, -200, W + 400, H + 400), { wash: col, ink: null }); };
  function snow(t, n, key, a = 1, x0 = 0, w = W, y0 = -100, h = H + 200) {
    boilSeed('snow' + key);
    for (let i = 0; i < n; i++) { const sp = 60 + 70 * hash(i * 7.1), x = x0 + ((hash(i * 3.3) * w + 30 * Math.sin(t * .9 + i)) % w), y = y0 + ((hash(i * 5.7) * h + t * sp) % h), r = 4 + 5 * hash(i * 1.9); paint(ellPts(x, y, r, r, 8), { wash: '#EEF2F8', washOp: 220 * a, ink: null }); }
  }
  function palm(x, y, s, sway = 0, col = '#2F5D4A') {
    boilSeed('palm' + x);
    paint(ribbon([[x, y], [x + 18 * s, y - 120 * s], [x + 50 * s, y - 230 * s]], 16 * s, 8 * s), { wash: '#7A5236', ink: PAL.ink, sw: .8 });
    const tx = x + 50 * s, ty = y - 232 * s;
    for (let k = 0; k < 6; k++) { const a = -2.6 + k * .9 + .08 * Math.sin(sway + k); paint(ribbon([[tx, ty], [tx + Math.cos(a) * 70 * s, ty + Math.sin(a) * 50 * s - 14 * s], [tx + Math.cos(a) * 125 * s, ty + Math.sin(a) * 70 * s + 25 * s]], 22 * s, 3 * s), { wash: col, ink: PAL.ink, sw: .7 }); }
  }
  function barbados(x, y, w, h, t, a = 1, key = 'bb') {
    boilSeed(key);
    paint(rectPts(x, y, w, h), { wash: mixCol('#3B4A72', '#F4B98A', a), ink: null });
    if (a > .05) glow(x + w * .68, y + h * .42, w * .32, '#FFC766', a);
    paint(ellPts(x + w * .68, y + h * .42, w * .09, w * .09, 20), { wash: mixCol('#3B4A72', '#FFE29A', a), ink: null });
    paint(rectPts(x, y + h * .55, w, h * .22), { wash: mixCol('#2A3558', '#3FA3A6', a), ink: null });
    for (let i = 0; i < 3; i++) inkLine([[x + w * (.1 + .3 * i), y + h * (.6 + .05 * (i % 2))], [x + w * (.25 + .3 * i), y + h * (.6 + .05 * (i % 2))]], .7, mixCol('#2A3558', '#E8F6F2', a));
    paint(rectPts(x, y + h * .77, w, h * .23), { wash: mixCol('#3E4766', '#F0D3A0', a), ink: null });
    if (a > .3) palm(x + w * .18, y + h * .95, w / 520, t * 1.5, mixCol('#2A3558', '#2F7D5A', a));
  }
  function cloud(cx, cy, s, col = '#FBF4E6') { const P = []; for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, r = 1 + .16 * Math.sin(a * 6); P.push([cx + Math.cos(a) * 190 * s * r, cy + Math.sin(a) * 110 * s * r]); } paint(P, { wash: col, ink: PAL.ink, sw: 1, curv: .6 }); }
  function ticketArt(x, y, s, rot, gold) {
    push(); translate(x, y); rotate(rot); scale(s);
    if (gold > .05) glow(0, 0, 150, '#FFD36B', gold);
    paint(rrPts(-70, -40, 140, 80, 8), { wash: mixCol('#A39E95', '#F0BE46', gold), ink: PAL.ink, sw: 1 });
    inkLine([[-30, -36], [-30, 36]], .6, mixCol('#77736C', '#B9862A', gold), 'inkfine');
    paint(starPts(20, 0, 18, .45, 5, 0), { wash: mixCol('#C9C4BA', '#FFF1C2', gold), ink: null });
    pop();
  }
  const wipeIn = (lt, cols) => { if (lt < .3) brushWipe(.5 + lt / .6, cols); };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, cols); };
  const WIN = { x: 400, y: 640, w: 280, h: 260 }, WINP = { x: 449, y: 121, w: 168, h: 265 };
  const SP = () => !!(window.PLATES || {}).street_night;
  function street(t, glowIn) {
    if (PB('street_night')) { if (glowIn > 0) { glow(WINP.x + WINP.w / 2, WINP.y + WINP.h / 2, 260 * glowIn, '#FFB86B', glowIn); barbados(WINP.x, WINP.y, WINP.w, WINP.h, t, glowIn, 'winbb'); inkLine([[WINP.x + WINP.w / 2, WINP.y], [WINP.x + WINP.w / 2, WINP.y + WINP.h]], 1.6, '#3A2820'); } return; }
    bg('#27305A', 'st');
    boilSeed('bldg'); paint(rectPts(-60, 380, 1200, 1200), { wash: '#3A3354', ink: PAL.ink, sw: 1.2 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const x = 60 + c * 260, y = 440 + r * 260; if (x > 330 && x < 700 && y > 560 && y < 980) continue; const lit = hash(r * 4 + c + 2) > .55; if (lit) glow(x + 60, y + 70, 110, '#FFC766', .5); paint(rectPts(x, y, 120, 150), { wash: lit ? '#E9B866' : '#232846', ink: PAL.ink, sw: .8 }); }
    boilSeed('win');
    if (glowIn > 0) glow(WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, 330 * glowIn, '#FFB86B', glowIn);
    paint(rectPts(WIN.x - 16, WIN.y - 16, WIN.w + 32, WIN.h + 32), { wash: '#5A4A3E', ink: PAL.ink, sw: 1 });
    if (glowIn > 0) barbados(WIN.x, WIN.y, WIN.w, WIN.h, t, glowIn, 'winbb'); else paint(rectPts(WIN.x, WIN.y, WIN.w, WIN.h), { wash: '#1E2547', ink: null });
    inkLine([[WIN.x + WIN.w / 2, WIN.y], [WIN.x + WIN.w / 2, WIN.y + WIN.h]], 1.2, '#5A4A3E'); inkLine([[WIN.x, WIN.y + WIN.h / 2], [WIN.x + WIN.w, WIN.y + WIN.h / 2]], 1.2, '#5A4A3E');
    boilSeed('stoop'); paint(rectPts(360, 1010, 360, 400), { wash: '#4B3A3C', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 3; i++) paint(rectPts(250 - i * 30, 1390 + i * 50, 580 + i * 60, 52), { wash: mixCol('#6E6476', '#E3E7EF', .35 + .1 * i), ink: PAL.ink, sw: .9 });
    paint(rectPts(-100, 1540, 1300, 500), { wash: '#DCE1EA', ink: null }); inkLine([[-50, 1540], [1130, 1545]], 1.1, PAL.ink);
    boilSeed('lamp'); glow(900, 760, 260, '#FFD27A', .9); inkLine([[900, 780], [900, 1560]], 3.2, '#2A2A38'); paint(rrPts(860, 720, 80, 80, 14), { wash: '#FFE6A6', ink: PAL.ink, sw: 1 });
  }
  // Abdullah's study: shelves of books, a lamp, a radiator, a rug, a snowy window that can flood with Barbados
  const PB = n => plate(n, -67.5, -40, W * 1.125, H * 1.125);   // uniform 1.125 overscan: x' = -67.5 + 1.125x, y' = -40 + 1.125y   // plate with overscan for camera moves
  const PBpart = (n, y0) => { const im = (window.PLATES || {})[n]; if (!im) return; flushBrush(); const sy = (y0 + 40) / 1.125; image(im, -67.5, y0, W * 1.125, (1920 - sy) * 1.125, 0, sy, 1080, 1920 - sy); };
  const HALL = () => plate('hallway', -54, -32, W * 1.1, H * 1.1);
  function study(t, warm, key = 'study') {
    if (PB(window.FELT && PLATES.study_felt ? 'study_felt' : 'study')) { if (warm > 0) barbados(442, 5, 381, 698, t, warm, key + 'bb'); return; }
    bg('#5A3F33', key);
    boilSeed(key + 'shelf');
    for (const sx of [40, 700]) { paint(rectPts(sx, 380, 340, 1060), { wash: '#4A2F22', ink: PAL.ink, sw: 1.1 });
      for (let r = 0; r < 5; r++) { paint(rectPts(sx + 10, 420 + r * 205, 320, 14), { wash: '#6E4A33', ink: null }); let x = sx + 18;
        for (let b = 0; b < 9; b++) { const bw = 22 + 14 * hash(r * 17 + b + sx), bh = 120 + 60 * hash(r * 7 + b * 3 + sx); if (x + bw > sx + 330) break; const col = ['#7A2E2E', '#2F4A6B', '#6B5A2E', '#3F5A3A', '#5A3F6B', '#8A6A3A'][(r * 3 + b) % 6]; paint(rectPts(x, 434 + r * 205 - bh + 180, bw, bh), { wash: col, ink: PAL.ink, sw: .5 }); x += bw + 3; } } }
    boilSeed(key + 'win'); paint(rectPts(400, 440, 280, 340), { wash: '#3D2B22', ink: PAL.ink, sw: 1 });
    if (warm < 1) { paint(rectPts(414, 454, 252, 312), { wash: '#26305A', ink: null }); snow(t, 8, key + 'w', 1 - warm, 414, 252, 454, 312); }
    if (warm > 0) barbados(414, 454, 252, 312, t, warm, key + 'bb');
    inkLine([[540, 454], [540, 766]], 1, '#3D2B22');
    boilSeed(key + 'rad'); for (let i = 0; i < 6; i++) paint(rrPts(420 + i * 40, 830, 30, 120, 10), { wash: '#8C8478', ink: PAL.ink, sw: .6 });
    boilSeed(key + 'fl'); paint(rectPts(-100, 1440, 1300, 600), { wash: '#3A2820', ink: null }); paint(ellPts(540, 1610, 420, 70, 24), { wash: '#7A2E2E', ink: PAL.ink, sw: .8 }); paint(ellPts(540, 1610, 330, 45, 24), { wash: '#A9784A', ink: null });
    boilSeed(key + 'lamp'); glow(240, 1180, 240, '#FFD27A', 1); paint(rectPts(150, 1260, 260, 30), { wash: '#6E4A33', ink: PAL.ink, sw: .8 }); inkLine([[240, 1260], [240, 1180]], 1.6, '#3A2A20'); paint(through([[190, 1185], [290, 1185], [270, 1130], [210, 1130]]), { wash: '#2F6B4A', ink: PAL.ink, sw: .8 });
  }
  function host(t, x, y, u, o = {}) { person(x, y, u, C.emery, { mood: 'warm', key: 'host', talk: talk(t), ...o }); }
  function stars(x, y, t, t0) { if (t < t0) return; const k = clamp((t - t0) / 1.4); boilSeed('stars'); for (let i = 0; i < 5; i++) { const a = t * 5 + i * TAU / 5; paint(starPts(x + Math.cos(a) * 90, y + Math.sin(a) * 30, 20 * (1 - k * .5), .45, 5, a), { wash: '#F4C04A', ink: PAL.ink, sw: .6 }); } }

  // ---------- shots ----------
  function shOpen(t, lt, dur) {   // the snowy street; Neville sad on the stoop; Emery hosts in front
    const wb = WT('open', 'barbados');
    camBegin(540, lerp(820, 1080, ease(seg(lt, 0, 3))), lerp(1.2, 1.0, ease(seg(lt, 0, 3))));
    street(t, 0); snow(t, 22, 'a');
    person(560, 1400, 24, C.neville, { mood: t > wb ? 'happy' : 'sad', look: t > wb ? -.2 : 0, lookY: t > wb ? -1 : .4, key: 'nev' });
    const k = backOut(seg(t, wb - .1, wb + .45));
    if (k > .02) { push(); translate(560, 820); scale(k); cloud(0, 0, 1.0); barbados(-130, -70, 260, 150, t, 1, 'drm'); pop(); }
    host(t, 830, 1720, 36, { aL: lerp(-1.2, -.1, ease(seg(lt, .8, 1.3))) });
    camEnd();
    if (lt < .6) flash(1 - ease(lt / .6), PAL.paper);
  }
  function shRelate(t, lt, dur) {   // close on Emery: a shrug
    camBegin(560, 1150, 1.25);
    street(t, 0); snow(t, 18, 'b');
    const sh = Math.sin(seg(lt, .2, .9) * Math.PI);
    host(t, 560, 1900, 50, { mood: 'happy', aL: -.4 + sh * .9, aR: -.4 + sh * .9, dy: -.2 * sh });
    camEnd();
  }
  function shLate(t, lt, dur) {   // flashback: a lecture hall, Abdullah walks up the aisle; the wall clock spins six months
    const ws = WT('late', 'six'), wl = WT('late', 'late');
    camBegin(540, 1080, 1.0);
    const LP = PB('lecture_hall');
    if (!LP) bg('#C9A97A', 'hall');
    if (!LP) boilSeed('hallwall'); if (!LP) paint(rectPts(-100, 380, 1300, 120), { wash: '#A9864E', ink: null });
    boilSeed('clock'); const cx = LP ? 780 : 760, cy = LP ? 400 : 640; paint(ellPts(cx, cy, 120, 120, 30), { wash: '#F6EEDD', ink: PAL.ink, sw: 1.4 }); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; inkLine([[cx + Math.cos(a) * 95, cy + Math.sin(a) * 95], [cx + Math.cos(a) * 110, cy + Math.sin(a) * 110]], .8); }
    const spin = ease(seg(t, ws - .2, wl + .3)) * TAU * 6; inkLine([[cx, cy], [cx + Math.cos(-1.57 + spin) * 85, cy + Math.sin(-1.57 + spin) * 85]], 2.2); inkLine([[cx, cy], [cx + Math.cos(-1.57 + spin / 12) * 55, cy + Math.sin(-1.57 + spin / 12) * 55]], 2.8);
    if (!LP) boilSeed('chairs'); if (!LP) for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const x = 120 + c * 230 + (r % 2) * 40, y = 1150 + r * 170; paint(rrPts(x, y, 150, 110, 14), { wash: '#7A4E31', ink: PAL.ink, sw: .8 }); }
    if (!LP) boilSeed('hfl'); if (!LP) paint(rectPts(-100, 1660, 1300, 400), { wash: '#8A6243', ink: null });
    const ax = lerp(-150, 330, ease(seg(lt, 0, 1.6)));
    person(ax, 1700, 32, C.abdullah, { mood: t > ws ? 'wise' : 'neutral', aL: t > ws ? .3 : -1.2, key: 'abd', lean: lt < 1.6 ? .03 * Math.sin(lt * 9) : 0 });
    person(720, 1700, 28, C.neville, { mood: t > wl ? 'surprised' : 'neutral', look: -1, key: 'nev', dy: t > wl ? -.25 * Math.exp(-(t - wl) * 4) : 0 });
    camEnd();
    paint(rectPts(-50, -50, W + 100, H + 100), { wash: '#C9A06A', washOp: 45, ink: null });   // sepia: it's a memory
    wipeIn(lt, ['#C9A97A', '#8A6243']);
  }
  function shAsk(t, lt, dur) {   // the study: Neville asks; on "Barbados" the window floods warm
    const wb = WT('ask', 'barbados');
    const warm = ease(seg(t, wb - .1, wb + .9));
    camBegin(540, 1060, 1.0 + .02 * lt);
    study(t, warm);
    if (warm > 0) glow(540, 610, 420, '#FFC07A', warm * .8);
    person(330, 1620, 34, C.abdullah, { mood: t > WT('ask', 'says') ? 'wise' : 'neutral', aL: t > wb - .2 ? .5 : -1.2, look: .6, key: 'abd' });
    person(780, 1620, 30, C.neville, { mood: t > wb + .2 ? 'surprised' : 'worried', look: -.8, lookY: t > wb + .2 ? -.6 : 0, key: 'nev' });
    camEnd();
    wipeIn(lt, ['#5A3F33', '#3A2820']);
  }
  function shHelp(t, lt, dur) {   // deadpan: Abdullah back to his book, Neville looks at us
    camBegin(560, 1150, 1.25);
    study(t, 1);
    person(330, 1620, 34, C.abdullah, { mood: 'wise', look: -.4, lookY: .8, hold: PROPS.book, aL: -.3, key: 'abd' });
    person(780, 1620, 30, C.neville, { mood: 'neutral', look: 0, key: 'nev' });
    camEnd();
  }
  function shSleep(t, lt, dur) {   // Neville in bed in the cold room; the room warms into Barbados
    const wa = WT('sleep', 'asleep'), wb = WT('sleep', 'barbados'), k = ease(seg(t, WT('sleep', 'bed') - .3, wb + .6));
    camBegin(540, 1060, 1.0 + .05 * ease(seg(lt, 0, dur)));
    if (PB('ny_room')) { if (k > 0) { barbados(369, 347, 375, 734, t, k, 'slbb'); glow(556, 714, 520, '#FFC07A', k); glow(540, 1300, 900, '#FF9A5A', k * .35); } } else {
    bg(mixCol('#3B4A72', '#E9A27A', k), 'sl');
    boilSeed('slwin'); paint(rectPts(314, 404, 452, 432), { wash: mixCol('#2E2A40', '#8A5A3A', k), ink: PAL.ink, sw: 1 });
    if (k < 1) { paint(rectPts(330, 420, 420, 400), { wash: '#1E2547', ink: null }); snow(t, 10, 'slw', 1 - k, 330, 420, 420, 400); }
    if (k > 0) { barbados(330, 420, 420, 400, t, k, 'slbb'); glow(540, 620, 420, '#FFC07A', k); }
    boilSeed('slfl'); paint(rectPts(-100, 1560, 1300, 500), { wash: mixCol('#2A2E48', '#B9774E', k), ink: null }); }
    boilSeed('bed'); paint(rrPts(130, 1080, 820, 300, 40), { wash: mixCol('#5A4A3E', '#8A5A3A', k), ink: PAL.ink, sw: 1.2 }); paint(rrPts(260, 1200, 300, 110, 40), { wash: '#F3EBDC', ink: PAL.ink, sw: .9 });
    person(470, 1720, 30, { ...C.neville, hat: null, hairStyle: 'neat' }, { mood: t > wa ? 'sleepy' : 'neutral', key: 'nev' });
    boilSeed('blanket'); paint(through([[120, 1340], [500, 1310], [960, 1330], [990, 1750], [110, 1750]]), { wash: mixCol('#4F6FA8', '#E07A62', k), ink: PAL.ink, sw: 1.2, curv: .5 });
    if (t > wa + .4) emote('zzz', 640, 1080, 40, seg(t, wa + .4, wa + .8), t - wa);
    camEnd();
    wipeIn(lt, ['#3B4A72', '#5A3F33']);
  }
  function shLetter(t, lt, dur) {   // the mail slot, the envelope arcs in, money fans out
    const wl = WT('letter', 'letter'), wm = WT('letter', 'money');
    camBegin(540, 1080, 1.02);
    if (!HALL()) { bg('#E7D3B0', 'lt');
    boilSeed('ltfl'); paint(rectPts(-100, 1560, 1300, 500), { wash: '#B98C62', ink: null }); }
    boilSeed('door'); paint(rrPts(330, 640, 420, 920, 10), { wash: '#8A5A3A', ink: PAL.ink, sw: 1.3 }); paint(rectPts(470, 1050, 140, 30), { wash: '#C9A46B', ink: PAL.ink, sw: .9 }); paint(ellPts(700, 1100, 16, 16, 10), { wash: '#E6B82A', ink: PAL.ink, sw: .7 });
    glow(980, 500, 380, '#FFF0C8', .6);
    if (t > wl - .2 && t < wm) { const kk = seg(t, wl - .2, wl + .5); const [x, y] = arcPt([540, 1065], [760, 1260], -160, ease(kk)); boilSeed('env'); push(); translate(x, y); rotate(kk * 3); paint(rectPts(-55, -36, 110, 72), { wash: '#F6EEDD', ink: PAL.ink, sw: 1 }); inkLine([[-55, -36], [0, 4], [55, -36]], .7); pop(); }
    person(840, 1640, 30, C.neville, { mood: t > wm ? 'joy' : t > wl ? 'surprised' : 'neutral', aL: t > wl + .4 ? .3 : -1.2, aR: t > wm ? .5 : -1.2, look: -.5, key: 'nev', dy: t > wm ? -.4 * Math.abs(Math.sin((t - wm) * 6)) * Math.exp(-(t - wm)) : 0 });
    if (t > wm) { boilSeed('bills'); for (let i = 0; i < 5; i++) { const kk = backOut(seg(t, wm + i * .06, wm + .35 + i * .06)); push(); translate(840 - 120 + i * 60, 1060 - 40 * Math.sin(i / 4 * Math.PI)); rotate(-.4 + i * .2); scale(kk); paint(rrPts(-45, -24, 90, 48, 6), { wash: '#7FB07A', ink: PAL.ink, sw: .7 }); paint(ellPts(0, 0, 12, 12, 8), { wash: '#4E7A4A', ink: null }); pop(); } }
    camEnd();
    if (lt < .45) iris(505, 1065, lerp(0, 1600, easeIn(lt / .45)), PAL.ink);
  }
  function shThird(t, lt, dur) {   // the ticket window: the Skeptic slides over a grey third class ticket; Neville runs off
    const w3 = WT('third', 'third'), wr = WT('third', 'runs');
    camBegin(540, 1080, 1.0);
    const TP = PB('ticket_office');
    if (!TP) bg('#B9B4A6', 'tk');
    if (!TP) { boilSeed('tkwall'); paint(rectPts(80, 500, 920, 700), { wash: '#6E5A44', ink: PAL.ink, sw: 1.2 }); paint(rectPts(260, 620, 560, 420), { wash: '#E9DFC8', ink: PAL.ink, sw: 1 }); for (let i = 0; i < 6; i++) inkLine([[260 + i * 93, 620], [260 + i * 93, 1040]], .8, '#6E5A44'); }
    person(540, TP ? 1288 : 1180, 30, C.skeptic, { mood: 'skeptical', look: .5, aL: t > w3 - .2 ? -.2 : -1.2, key: 'agent' });
    if (TP) PBpart('ticket_office', 1148); else boilSeed('counter'); if (!TP) paint(rectPts(80, 1040, 920, 160), { wash: '#8A6243', ink: PAL.ink, sw: 1.2 });
    if (t > w3 - .2) ticketArt(lerp(540, 380, ease(seg(t, w3 - .2, w3 + .4))), TP ? 1168 : 1060, 1.1, -.1, 0);
    if (!TP) boilSeed('tkfl'); if (!TP) paint(rectPts(-100, 1560, 1300, 500), { wash: '#7A7466', ink: null });
    const rx = t > wr ? lerp(330, 1250, easeIn(seg(t, wr, wr + .7))) : 330;
    person(rx, 1720, 30, C.neville, { mood: t > w3 + .2 ? 'sad' : 'hopeful', look: .4, lookY: -.3, key: 'nev', lean: t > wr ? -.18 : 0, aL: t > wr ? .3 : -1.2, aR: t > wr ? -.3 : -1.2 });
    camEnd();
    wipeIn(lt, ['#B9B4A6', '#6E5A44']);
  }
  function doorway(t, open) {   // the study door seen from the hall
    if (!HALL()) { bg('#6B5A4A', 'hall2');
    boilSeed('hall2fl'); paint(rectPts(-100, 1560, 1300, 500), { wash: '#4A3A2E', ink: null }); }
    boilSeed('hall2d'); paint(rectPts(300, 560, 480, 1020), { wash: '#3A2820', ink: PAL.ink, sw: 1.4 });
    glow(540, 1050, 380, '#FFD27A', .7 * open);
    paint(rectPts(330, 590, 420, 970), { wash: '#C99A5A', ink: null }); for (let i = 0; i < 4; i++) paint(rectPts(345 + i * 100, 640, 70, 300), { wash: ['#7A2E2E', '#2F4A6B', '#6B5A2E', '#3F5A3A'][i], ink: PAL.ink, sw: .5 });
  }
  function shFirst(t, lt, dur) {   // Abdullah in his doorway delivers the line; Neville protests
    camBegin(540, 1080, 1.0 + .03 * lt);
    doorway(t, 1);
    person(540, 1580, 34, C.abdullah, { mood: t > WT('first', 'already') ? 'determined' : 'wise', aL: t > WT('first', 'first') ? .7 : .2, look: .6, key: 'abd' });
    person(900, 1720, 30, C.neville, { mood: 'worried', look: -1, aL: .2, key: 'nev' });
    camEnd();
    wipeIn(lt, ['#6B5A4A', '#3A2820']);
  }
  function shDoor(t, lt, dur) {   // SLAM: the door swings shut, the frame shakes, stars circle Neville's head
    const wd = WT('door', 'door'), sl = wd + .05, k = easeIn(seg(t, wd - .35, sl));
    const [sx, sy] = t > sl ? shakeXY(t - sl, 22 * Math.exp(-(t - sl) * 5)) : [0, 0];
    camBegin(540 + sx, 1080 + sy, 1.0);
    doorway(t, 1 - k);
    if (k < .98) person(540, 1580, 34, C.abdullah, { mood: 'wise', key: 'abd' });
    boilSeed('doorpanel'); const dw = 420 * k; if (dw > 4) { paint(rectPts(330, 590, dw, 970), { wash: '#6E4A33', ink: PAL.ink, sw: 1.2 }); if (dw > 120) { paint(rectPts(360, 640, dw - 60, 380), { wash: '#5E3E2A', ink: PAL.ink, sw: .6 }); paint(ellPts(330 + dw - 40, 1100, 16, 16, 10), { wash: '#E6B82A', ink: PAL.ink, sw: .6 }); } }
    person(860, 1720, 30, C.neville, { mood: t > sl ? 'surprised' : 'worried', look: -1, key: 'nev', dy: t > sl ? -.6 * Math.exp(-(t - sl) * 5) : 0, lean: t > sl ? .12 * Math.exp(-(t - sl) * 3) : 0 });
    stars(860, 1180, t, sl);
    camEnd();
    if (t > sl && t < sl + .08) flash(.5, '#FFFFFF');
  }
  function shSail(t, lt, dur) {   // the dock: the agent's good news; the ticket turns gold; the ship's horn
    const wg = WT('sail', 'good'), wf = WT('sail', 'first');
    const gold = ease(seg(t, wf - .2, wf + .4));
    camBegin(540, 1020, 1.0 + .02 * lt);
    const DP = PB('dock');
    if (!DP) {
    bg('#9EC3D9', 'sail');
    boilSeed('sun'); glow(860, 420, 300, '#FFE29A', .6); paint(ellPts(860, 420, 70, 70, 20), { wash: '#FFF0C0', ink: null });
    boilSeed('sea'); paint(rectPts(-100, 1180, 1300, 400), { wash: '#3D7FA0', ink: null });
    boilSeed('ship'); paint(rectPts(420, 700, 80, 260), { wash: '#C2453A', ink: PAL.ink, sw: 1 }); paint(rectPts(620, 740, 80, 220), { wash: '#C2453A', ink: PAL.ink, sw: 1 }); paint(rectPts(260, 940, 600, 120), { wash: '#F3EBDC', ink: PAL.ink, sw: 1 }); for (let i = 0; i < 6; i++) paint(ellPts(310 + i * 95, 1000, 18, 18, 10), { wash: '#9EC3D9', ink: PAL.ink, sw: .6 }); paint([[120, 1060], [1040, 1060], [960, 1230], [200, 1230]], { wash: '#2D2F45', ink: PAL.ink, sw: 1.3 }); paint([[140, 1090], [1020, 1090], [1010, 1120], [150, 1120]], { wash: '#C2453A', ink: null });
    }
    for (let i = 0; i < 4; i++) { const a = t - (wf + .3) - i * .25; if (a > 0 && a < 2) { const kk = a / 2; paint(ellPts((DP ? 350 : 460) + 60 * kk + 20 * i, (DP ? 290 : 680) - 260 * kk, 50 + 70 * kk, 40 + 50 * kk, 14), { wash: '#F6F4EE', washOp: 255 * (1 - kk), ink: null }); } }
    if (!DP) boilSeed('dock'); if (!DP) paint(rectPts(-100, 1440, 1300, 600), { wash: '#8A6243', ink: PAL.ink, sw: 1.1 }); if (!DP) for (let i = 0; i < 6; i++) inkLine([[-50, 1480 + i * 80], [1130, 1482 + i * 80]], .7, '#5E4130');
    person(250, 1740, 30, C.skeptic, { mood: t > wg ? 'happy' : 'neutral', aR: t > wg ? .2 : -1.2, look: 1, key: 'agent' });
    person(760, 1740, 32, C.neville, { mood: t > wf ? 'awe' : 'hopeful', look: -1, key: 'nev', aL: .1, hold: (x, y, u, sw) => ticketArt(x - u * .5, y - u * .8, 1.2, -.3, gold), dy: t > wf + .5 ? -.8 * Math.abs(Math.sin((t - wf - .5) * 5)) * Math.exp(-(t - wf - .5) * 1.5) : 0 });
    camEnd();
    wipeIn(lt, ['#F0BE46', '#E9A27A']);
  }
  function shRoomies(t, lt, dur) {   // first class cabin: Neville squeezed between Paul (asleep) and Blake (startled)
    camBegin(540, 1200, 1.05);
    const CP = PB('cabin');
    if (!CP) {
    bg('#2F4A5A', 'cab');
    boilSeed('cabwall'); paint(rectPts(-100, 380, 1300, 1200), { wash: '#7A5A3A', ink: PAL.ink, sw: 1 }); for (let i = 0; i < 8; i++) inkLine([[i * 150, 380], [i * 150, 1580]], .6, '#5E4430');
    boilSeed('port'); for (const px of [240, 840]) { paint(ellPts(px, 640, 90, 90, 24), { wash: '#C9A46B', ink: PAL.ink, sw: 1.2 }); paint(ellPts(px, 640, 66, 66, 24), { wash: '#9EC3D9', ink: null }); inkLine([[px - 66, 660 + 6 * Math.sin(t * 2)], [px + 66, 650 + 6 * Math.sin(t * 2 + 1)]], .8, '#3D7FA0'); }
    boilSeed('cabfl'); paint(rectPts(-100, 1580, 1300, 500), { wash: '#4A3A5A', ink: null });
    }
    const rock = Math.sin(t * 1.6) * .02;
    person(230, 1760, 26, C.paul, { mood: 'sleepy', key: 'paul', lean: rock });
    person(540, 1760, 28, C.neville, { mood: 'beam', key: 'nev', lean: rock, aL: -.6, aR: -.6 });
    person(850, 1760, 26, C.blake, { mood: 'surprised', look: -1, key: 'blk', lean: rock });
    emote('zzz', 300, 1250, 34, 1, t);
    camEnd();
  }
  // the host set: warm paper, a spotlight
  function hostSet(key) { if (plate('stage', -162, -82, W * 1.3, H * 1.3)) { glow(540, 1150, 520, '#FFE2A8', .35); return; } bg('#F1D9B5', key); boilSeed(key + 'st'); glow(540, 1050, 560, '#FFE2A8', .5); paint(ellPts(540, 1640, 520, 100, 30), { wash: '#E58E6A', ink: PAL.ink, sw: 1 }); boilSeed(key + 'cur'); paint(through([[-60, 300], [180, 320], [130, 1800], [-60, 1800]]), { wash: '#B5523E', ink: PAL.ink, sw: 1, curv: .5 }); paint(through([[1140, 300], [900, 320], [950, 1800], [1140, 1800]]), { wash: '#B5523E', ink: PAL.ink, sw: 1, curv: .5 }); }
  const COSTUMES = [
    {}, { stripes: null, coat: '#3A3F4F', sleeve: '#3A3F4F', hat: 'fedora', hatCol: '#2B2A33', band: '#8C3B3B' }, { stripes: null, coat: '#E9DFC8', sleeve: '#E9DFC8', hat: 'cap', hatCol: '#3B2E5A', band: '#C9963A', robe: true, pants: '#E9DFC8' },
    { stripes: null, coat: '#5C6170', sleeve: '#5C6170', hat: 'flatcap', hatCol: '#5E5A4E', vest: '#8E8F96' }, { stripes: null, coat: '#A9784A', sleeve: '#A9784A', robe: true, pants: '#A9784A', sash: '#5E6B3A' }, {},
  ];
  function shCostume(t, lt, dur) {   // "same move, different costume": the Dreamer's outfit swaps on every beat, the move stays the same
    const we = WT('costume', 'every'), wc = WT('costume', 'costume');
    camBegin(540, 1150, 1.0);
    hostSet('cs');
    const n = COSTUMES.length - 1, step = (wc + .3 - we) / n, i = t < we ? 0 : Math.min(n, Math.floor((t - we) / step) + 1), ts = we + (i - 1) * step;
    const p = i > 0 ? spring(t, ts, 9, 22) : 0, arm = i > 0 && i < n ? 1.2 * (1 - seg(t, ts + step * .6, ts + step)) : -1.2;
    person(330, 1680, 30, C.emery, { mood: 'warm', talk: talk(t), aR: .2, key: 'host' });
    person(760, 1680, 34, { ...C.dreamer, ...COSTUMES[i] }, { mood: 'joy', aL: arm, key: 'drm', dy: -.4 * Math.abs(p), lean: .04 * p });
    if (i > 0 && t - ts < .25) { boilSeed('puff' + i); for (let j = 0; j < 6; j++) { const a = j / 6 * TAU; paint(ellPts(760 + Math.cos(a) * 160, 1300 + Math.sin(a) * 160, 40, 40, 10), { wash: '#FBF4E6', washOp: 255 * (1 - (t - ts) / .25), ink: null }); } }
    camEnd();
    wipeIn(lt, ['#E58E6A', '#F1D9B5']);
  }
  function shMove(t, lt, dur) {   // attention off the grey fact (left), onto the warm doorway (right)
    const wo = WT('move', 'off'), wp = WT('move', 'put'), wd = WT('move', 'done');
    camBegin(540, 1100, 1.0);
    bg('#8E90A0', 'mv');
    boilSeed('mvfl'); paint(rectPts(-100, 1600, 1300, 500), { wash: '#5E6070', ink: null });
    const fk = ease(seg(t, wo, wp));
    push(); translate(230, 820); scale(lerp(1, .5, fk)); boilSeed('fact'); paint(rectPts(-150, 0, 300, 360), { wash: '#D5D3CE', ink: PAL.ink, sw: 1 }); for (let j = 0; j < 6; j++) inkLine([[-110, 50 + j * 48], [80 - 50 * hash(j), 52 + j * 48]], .8, '#6B6E7A', 'inkfine'); cloud(0, -120, .8, '#6B6E7A'); for (let j = 0; j < 5; j++) { const y = (t * 500 + j * 70) % 160; inkLine([[-100 + j * 50, -60 + y], [-110 + j * 50, -30 + y]], .9 * (1 - fk), '#6D86BE'); } pop();
    const open = ease(seg(t, wp, wd + .3));
    boilSeed('mvdoor'); glow(820, 1150, 520 * (.3 + .7 * open), '#FFB86B', .9); paint(rectPts(620, 680, 400, 920), { wash: '#6E4A33', ink: PAL.ink, sw: 1.2 }); barbados(640, 700, 360, 900, t, 1, 'mvbb'); if (open < 1) paint(rectPts(640, 700, 360 * (1 - open), 900), { wash: '#7A4E31', ink: PAL.ink, sw: 1 });
    const tr = t > wp ? .25 : -.25;
    person(470, 1760, 32, C.dreamer, { mood: t > wd ? 'awe' : 'worried', ...turn(t, wp - .1, wp + .2, -.25, .25), look: t > wp ? 1 : -1, key: 'drm' });
    camEnd();
    wipeIn(lt, ['#8E90A0', '#5E6070']);
  }
  function shLive(t, lt, dur) {   // visit once (peek and back out) vs live (walk in, then asleep in a hammock)
    const wv = WT('live', 'visit'), wo = WT('live', 'once'), wl = WT('live', 'live'), ws = WT('live', 'slept');
    const pz = ease(seg(t, ws - .3, ws + .8));
    camBegin(lerp(540, 820, pz), lerp(1100, 1150, pz), lerp(1.0, 1.7, pz));
    bg('#4A3F6B', 'lv'); boilSeed('lvfl'); paint(rectPts(-100, 1600, 1300, 500), { wash: '#3A3054', ink: null });
    boilSeed('lvdoor'); glow(820, 1150, 600, '#FFB86B', .9); paint(rectPts(620, 680, 400, 920), { wash: '#6E4A33', ink: PAL.ink, sw: 1.2 }); barbados(640, 700, 360, 900, t, 1, 'lvbb');
    if (t > ws - .2) { boilSeed('ham'); inkLine([[690, 1360], [800, 1420], [960, 1350]], 1.4, '#7A5236'); emote('zzz', 900, 1250, 30, seg(t, ws, ws + .4), t - ws); paint(through([[700, 1380], [820, 1440], [950, 1370], [820, 1410]]), { wash: '#E07A4F', ink: PAL.ink, sw: .8, curv: .5 }); }
    let x = lerp(380, 600, ease(seg(t, wv - .3, wo))); if (t > wo) x = lerp(600, 300, ease(seg(t, wo, wo + .6))); if (t > wl - .2) x = lerp(300, 1150, ease(seg(t, wl - .2, ws - .1)));
    const held = t < wl + .4;
    if (x < 1100) person(x, 1760, 30, C.dreamer, { mood: t > wl ? 'determined' : t > wo ? 'worried' : 'happy', look: 1, key: 'drm', aL: held ? -.9 : -1.2, hold: held ? (hx, hy, u, sw) => paint(rrPts(hx - u * 1.2, hy - u * .2, u * 2.4, u * 1.8, u * .3), { wash: '#8A5A33', ink: PAL.ink, sw }) : null });
    if (!held) { boilSeed('case'); paint(rrPts(560, 1690, 110, 80, 12), { wash: '#8A5A33', ink: PAL.ink, sw: 1 }); }
    if (t > wo && t < wl) { boilSeed('x'); push(); translate(260, 1150); scale(backOut(seg(t, wo, wo + .25))); paint(ellPts(0, 0, 60, 60, 20), { wash: '#C2453A', ink: PAL.ink, sw: 1 }); inkLine([[-26, -26], [26, 26]], 2.4, PAL.cream); inkLine([[26, -26], [-26, 26]], 2.4, PAL.cream); pop(); }
    camEnd();
  }
  function shVerse(t, lt, dur) {   // Paul with his scroll in candlelight; the Dreamer turns gold on "transformed"
    const wt = WT('verse', 'transformed'), wr = WT('verse', 'renewing'), g = t > wt + .3;
    camBegin(540, 1150, 1.0 + .04 * lt);
    bg('#2E2440', 'vs');
    boilSeed('rays'); glow(540, 1050, 600, '#FFD27A', g ? 1 : .5); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .28; paint([[540, 1300], [540 + Math.cos(a - .06) * 1000, 1300 + Math.sin(a - .06) * 1000], [540 + Math.cos(a + .06) * 1000, 1300 + Math.sin(a + .06) * 1000]], { wash: '#FFE9B0', washOp: g ? 70 : 35, ink: null }); }
    boilSeed('vsfl'); paint(rectPts(-100, 1620, 1300, 500), { wash: '#3A2E4A', ink: null });
    boilSeed('candle'); glow(120, 1380, 200, '#FFC766', 1); paint(rectPts(100, 1400, 40, 180), { wash: '#F3EBDC', ink: PAL.ink, sw: .8 }); paint(ellPts(120, 1380, 10 + 2 * Math.sin(t * 13), 22, 10), { wash: '#FFCF5A', ink: null });
    person(300, 1760, 32, C.paul, { mood: 'wise', aL: .8, hold: PROPS.scroll, key: 'paul' });
    const D = g ? { ...C.dreamer, stripes: null, coat: '#F0BE46', sleeve: '#F6D58A', cuff: '#FFF1C2' } : C.dreamer;
    person(760, 1760, 32, D, { mood: g ? 'awe' : 'neutral', look: -1, key: 'drm', aL: g ? .7 : -1.2, aR: g ? .7 : -1.2 });
    if (t > wr) { boilSeed('spk'); for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + t * .6, r = 240, kk = backOut(seg(t, wr + i * .06, wr + .3 + i * .06)); if (kk > .02) paint(starPts(760 + Math.cos(a) * r, 1300 + Math.sin(a) * r * .8, 22 * kk, .4, 4, t), { wash: '#FFF1C2', ink: null }); } }
    camEnd();
    { const kk = 1 - Math.abs(t - (wt + .3)) / .25; if (kk > 0) flash(kk * .8, '#FFF4D6'); }
    wipeIn(lt, ['#2E2440', '#3A2E4A']);
  }
  function shClose(t, lt, dur) {   // back on the snowy street: the window glows like Barbados, Neville asleep inside; Emery signs off
    const wt = WT('close', 'tonight'), we = WT('close', 'end');
    const pk = ease(seg(t, we + .3, DUR - .4));
    const WW = SP() ? WINP : WIN, SC = SP() ? WINP.w / WIN.w : 1;
    camBegin(lerp(540, WW.x + WW.w / 2, pk), lerp(1080, WW.y + WW.h / 2, pk), lerp(1.0, SP() ? 2.8 : 2.2, pk));
    street(t, ease(seg(t, wt - .2, wt + 1)));
    if (SP()) { const X = WINP.x, Y = WINP.y, w = WINP.w, h = WINP.h; boilSeed('winbedp');
      paint(rrPts(X + .12 * w, Y + .5 * h, .42 * w, .12 * h, 10), { wash: '#F3EBDC', ink: PAL.ink, sw: .5 }); person(X + .42 * w, Y + .92 * h, 7, { ...C.neville, hat: null }, { mood: 'sleepy', key: 'nevw' });
      paint(through([[X + 4, Y + .66 * h], [X + .5 * w, Y + .6 * h], [X + w - 4, Y + .64 * h], [X + w - 4, Y + h - 4], [X + 4, Y + h - 4]]), { wash: '#E07A62', ink: PAL.ink, sw: .6, curv: .5 });
      if (t > wt) emote('zzz', X + .75 * w, Y + .4 * h, 12, seg(t, wt, wt + .4), t - wt); }
    push(); if (SP()) translate(-99999, 0); { boilSeed('winbed'); const P = [[WIN.x, WIN.y], [WIN.x + WIN.w, WIN.y], [WIN.x + WIN.w, WIN.y + WIN.h], [WIN.x, WIN.y + WIN.h]]; }
    paint(rrPts(WIN.x + 95, WIN.y + 118, 100, 50, 18), { wash: '#F3EBDC', ink: PAL.ink, sw: .5 }); person(WIN.x + 145, WIN.y + 215, 8, { ...C.neville, hat: null }, { mood: 'sleepy', key: 'nevw' });
    paint(through([[WIN.x + 10, WIN.y + WIN.h * .62], [WIN.x + 140, WIN.y + WIN.h * .55], [WIN.x + WIN.w - 10, WIN.y + WIN.h * .6], [WIN.x + WIN.w - 4, WIN.y + WIN.h - 4], [WIN.x + 4, WIN.y + WIN.h - 4]]), { wash: '#E07A62', ink: PAL.ink, sw: .6, curv: .5 });
    if (t > wt) emote('zzz', WIN.x + 200, WIN.y + 80, 14, seg(t, wt, wt + .4), t - wt);
    pop();
    snow(t, 20, 'k');
    host(t, 760, 1720, 36, { mood: 'warm', aL: t > we - .2 ? .1 : -1.2, look: t > we ? 0 : -.6 });
    const at = toScreen(WW.x + WW.w / 2, WW.y + WW.h / 2);
    camEnd();
    wipeIn(lt, ['#3E5A8E', '#27305A']);
    if (t > DUR - 1.0) { const kk = seg(t, DUR - 1.0, DUR - .15); iris(at[0], at[1], lerp(1300, 0, easeIn(kk)), PAL.ink); }
  }
  shots([
    [0, shOpen], [S('relate') - .1, shRelate], [S('late') - .15, shLate], [S('ask') - .15, shAsk], [S('help') - .05, shHelp], [S('sleep') - .15, shSleep],
    [S('letter') - .1, shLetter], [S('third') - .15, shThird], [S('first') - .15, shFirst], [S('door') - .05, shDoor], [S('sail') - .15, shSail], [S('roomies') - .1, shRoomies],
    [S('costume') - .15, shCostume], [S('move') - .15, shMove], [S('live') - .1, shLive], [S('verse') - .15, shVerse], [S('close') - .15, shClose],
  ]);
})();
