window.CHEAP = true;
// "You Are In Barbados": 58.5 s, 1080x1920. Storyboard in STORYBOARD.md. Times come from VOICE_LINES (voice_data.js).
(() => {
  // ---------- voice cues ----------
  const VL = id => VOICE_LINES.find(l => l.id === id);
  const WT = (id, w, n = 0) => { const L = VL(id), k = w.toLowerCase(); const h = L.words.filter(x => x[0].toLowerCase().replace(/[^a-z']/g, '') === k); return (h[n] || h[0] || ['', L.t0])[1]; };

  // ---------- characters ----------
  const NEV = { col: '#5D7DB8', dk: '#3E5A8E', lt: '#9DB6E0', hat: 'fedora' };
  const ABD = { col: '#C98B3A', dk: '#94621F', lt: '#E9BC78', hat: 'top' };
  const nev = (x, y, u, o) => clawd(x, y, u, { ...o, col: NEV.col, dk: NEV.dk, lt: NEV.lt, hat: o.hat === undefined ? NEV.hat : o.hat });
  const abd = (x, y, u, o) => clawd(x, y, u, { ...o, col: ABD.col, dk: ABD.dk, lt: ABD.lt, hat: ABD.hat });

  // ---------- shared painting ----------
  const bg = (col, key, tex = .5) => { boilSeed('bg' + key); paint(rectPts(-200, -200, W + 400, H + 400), { wash: col, ink: null }); paint(rectPts(-200, -200, W + 400, H + 400), { fill: mixCol(col, '#FFFFFF', .12), fillOp: 90, bleed: .2, tex, ink: null, keep: true }); };
  function snow(t, n, key, a = 1, x0 = 0, w = W, y0 = -100, h = H + 200) {
    boilSeed('snow' + key);
    for (let i = 0; i < n; i++) {
      const sp = 60 + 70 * hash(i * 7.1), x = x0 + ((hash(i * 3.3) * w + 30 * Math.sin(t * .9 + i)) % w), y = y0 + ((hash(i * 5.7) * h + t * sp) % h), r = 4 + 5 * hash(i * 1.9);
      paint(ellPts(x, y, r, r, 8), { wash: '#EEF2F8', washOp: 220 * a, ink: null });
    }
  }
  function palm(x, y, s, sway = 0, col = '#2F5D4A') {
    boilSeed('palm' + x);
    paint(ribbon([[x, y], [x + 18 * s, y - 120 * s], [x + 50 * s, y - 230 * s]], 16 * s, 8 * s), { wash: '#7A5236', ink: PAL.ink, sw: .8 });
    const tx = x + 50 * s, ty = y - 232 * s;
    for (let k = 0; k < 6; k++) { const a = -2.6 + k * .9 + .08 * Math.sin(sway + k); paint(ribbon([[tx, ty], [tx + Math.cos(a) * 70 * s, ty + Math.sin(a) * 50 * s - 14 * s], [tx + Math.cos(a) * 125 * s, ty + Math.sin(a) * 70 * s + 25 * s]], 22 * s, 3 * s), { wash: col, ink: PAL.ink, sw: .7 }); }
  }
  // the Barbados view: peach sky, sun, sea, sand, a palm. Drawn inside a rect.
  function barbados(x, y, w, h, t, a = 1, key = 'bb') {
    boilSeed(key);
    paint(rectPts(x, y, w, h), { wash: mixCol('#3B4A72', '#F4B98A', a), ink: null });
    paint(rectPts(x, y, w, h * .55), { fill: '#F7D9A8', fillOp: 150 * a, bleed: .2, tex: .5, ink: null });
    if (a > .05) glow(x + w * .68, y + h * .42, w * .32, '#FFC766', a);
    paint(ellPts(x + w * .68, y + h * .42, w * .09, w * .09, 20), { wash: mixCol('#3B4A72', '#FFE29A', a), ink: null });
    paint(rectPts(x, y + h * .55, w, h * .22), { wash: mixCol('#2A3558', '#3FA3A6', a), ink: null });
    for (let i = 0; i < 3; i++) inkLine([[x + w * (.1 + .3 * i), y + h * (.6 + .05 * (i % 2))], [x + w * (.25 + .3 * i), y + h * (.6 + .05 * (i % 2))]], .7, mixCol('#2A3558', '#E8F6F2', a));
    paint(rectPts(x, y + h * .77, w, h * .23), { wash: mixCol('#3E4766', '#F0D3A0', a), ink: null });
    if (a > .3) palm(x + w * .18, y + h * .95, w / 520, t * 1.5, mixCol('#2A3558', '#2F7D5A', a));
  }
  function cloud(cx, cy, s, col = '#FBF4E6') {
    const P = []; for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, r = 1 + .16 * Math.sin(a * 6); P.push([cx + Math.cos(a) * 190 * s * r, cy + Math.sin(a) * 110 * s * r]); }
    paint(P, { wash: col, ink: PAL.ink, sw: 1, curv: .6 });
  }
  function ticket(x, y, s, rot, gold) {
    push(); translate(x, y); rotate(rot); scale(s);
    if (gold > .05) glow(0, 0, 150, '#FFD36B', gold);
    paint(rrPts(-70, -40, 140, 80, 8), { wash: mixCol('#A39E95', '#F0BE46', gold), ink: PAL.ink, sw: 1 });
    inkLine([[-30, -36], [-30, 36]], .6, mixCol('#77736C', '#B9862A', gold), 'inkfine');
    paint(starPts(20, 0, 18, .45, 5, 0), { wash: mixCol('#C9C4BA', '#FFF1C2', gold), ink: null });
    pop();
  }
  const wipeIn = (lt, cols) => { if (lt < .3) brushWipe(.5 + lt / .6, cols); };
  const wipeOut = (lt, dur, cols) => { if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, cols); };

  // ---------- the street (A and K) ----------
  const WIN = { x: 400, y: 640, w: 280, h: 260 };   // the window above the stoop
  function street(t, glowIn) {
    bg('#27305A', 'st', .6);
    boilSeed('bldg');
    paint(rectPts(-60, 380, 1200, 1200), { wash: '#3A3354', ink: PAL.ink, sw: 1.2 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const x = 60 + c * 260, y = 440 + r * 260; if (x > 330 && x < 700 && y > 560 && y < 980) continue;
      const lit = hash(r * 4 + c + 2) > .55;
      if (lit) glow(x + 60, y + 70, 110, '#FFC766', .5);
      paint(rectPts(x, y, 120, 150), { wash: lit ? '#E9B866' : '#232846', ink: PAL.ink, sw: .8 });
    }
    // the big window: cold, or glowing like Barbados from inside
    boilSeed('win');
    if (glowIn > 0) glow(WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, 330 * glowIn, '#FFB86B', glowIn);
    paint(rectPts(WIN.x - 16, WIN.y - 16, WIN.w + 32, WIN.h + 32), { wash: '#5A4A3E', ink: PAL.ink, sw: 1 });
    if (glowIn > 0) barbados(WIN.x, WIN.y, WIN.w, WIN.h, t, glowIn, 'winbb'); else paint(rectPts(WIN.x, WIN.y, WIN.w, WIN.h), { wash: '#1E2547', ink: null });
    inkLine([[WIN.x + WIN.w / 2, WIN.y], [WIN.x + WIN.w / 2, WIN.y + WIN.h]], 1.2, '#5A4A3E');
    inkLine([[WIN.x, WIN.y + WIN.h / 2], [WIN.x + WIN.w, WIN.y + WIN.h / 2]], 1.2, '#5A4A3E');
    // stoop, door, lamp post, snowy sidewalk
    boilSeed('stoop');
    paint(rectPts(360, 1010, 360, 400), { wash: '#4B3A3C', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 3; i++) paint(rectPts(250 - i * 30, 1390 + i * 50, 580 + i * 60, 52), { wash: mixCol('#6E6476', '#E3E7EF', .35 + .1 * i), ink: PAL.ink, sw: .9 });
    paint(rectPts(-100, 1540, 1300, 500), { wash: '#DCE1EA', ink: null }); inkLine([[-50, 1540], [1130, 1545]], 1.1, PAL.ink);
    boilSeed('lamp');
    glow(900, 760, 260, '#FFD27A', .9);
    inkLine([[900, 780], [900, 1560]], 3.2, '#2A2A38');
    paint(rrPts(860, 720, 80, 80, 14), { wash: '#FFE6A6', ink: PAL.ink, sw: 1 });
    paint(ellPts(900, 1560, 70, 16, 16), { wash: '#B9BFCC', ink: null });
  }

  // ---------- A: broke in New York ----------
  function shotA(t, lt, dur) {
    const pz = ease(seg(t, 0, 3.4));
    camBegin(540, lerp(700, 1080, pz), lerp(1.25, 1.05, pz));
    street(t, 0);
    snow(t, 24, 'a');
    const wb = WT('broke', 'broke'), wbb = WT('broke', 'barbados');
    const mood = emotions(t, [[0, 'sad'], [wb, 'sad', { emote: 'sweat' }], [wbb, 'hopeful', { lookY: -1, lookX: -.2 }]]);
    const pk = seg(t, wb, wb + .3) * (1 - seg(t, wbb - .3, wbb));
    const rag = (u, sw) => { if (pk > .05) paint(ellPts(u * .6, 0, u * .9 * pk, u * .55 * pk, 10), { wash: '#F3EBDC', ink: PAL.ink, sw }); };
    nev(540, 1390, 30, { ...mood, aL: lerp(mood.aL ?? -.3, -1.25, pk), aR: lerp(mood.aR ?? -.3, -1.25, pk), armL: rag, armR: rag });
    // the dream: a cloud with Barbados in it
    const k = backOut(seg(t, wbb - .1, wbb + .45));
    if (k > .02) { push(); translate(540, 760 - 40 * ease(seg(t, wbb, wbb + 1.2))); scale(k);
      boilSeed('dream'); for (let i = 0; i < 3; i++) paint(ellPts(0 + 10 * i, 330 - 70 * i, 16 + 8 * i, 14 + 7 * i, 10), { wash: '#FBF4E6', ink: PAL.ink, sw: .8 });
      cloud(0, 0, 1.15); barbados(-150, -80, 300, 170, t, 1, 'drm'); pop(); }
    camEnd();
    if (t < .7) flash(1 - ease(t / .7), PAL.paper);
    wipeOut(lt, dur, ['#3E5A8E', '#27305A']);
  }

  // ---------- B: Abdullah ----------
  function shotB(t, lt, dur) {
    camBegin(540 + 10 * Math.sin(lt * .5), 1000, 1.02 + .01 * lt);
    bg('#6B4A3A', 'b');
    boilSeed('bfl'); paint(rectPts(-100, 1520, 1300, 500), { wash: '#4A3328', ink: null }); inkLine([[-50, 1520], [1130, 1524]], 1, PAL.ink);
    const wy = WT('told', 'you'), wk = ease(seg(t, wy, wy + .8));
    // window: snowy night that floods with Barbados
    boilSeed('bwin'); paint(rectPts(274, 404, 532, 452), { wash: '#3D2B22', ink: PAL.ink, sw: 1.1 });
    if (wk < 1) { paint(rectPts(290, 420, 500, 420), { wash: '#26305A', ink: null }); snow(t, 14, 'bw', 1 - wk, 290, 500, 420, 420); }
    if (wk > 0) barbados(290, 420, 500, 420, t, wk, 'bbb');
    if (wk > 0) glow(540, 640, 520, '#FFC07A', wk * .8);
    // lamp
    boilSeed('blamp'); glow(130, 980, 220, '#FFD27A', 1); inkLine([[130, 1040], [130, 1520]], 2.6, '#2A2020'); paint(through([[60, 1000], [200, 1000], [160, 920], [100, 920]]), { wash: '#E7B56A', ink: PAL.ink, sw: 1 });
    const ws = WT('told', 'said');
    abd(330, 1600, 36, { ...emotions(t, [[0, 'cool'], [ws, 'determined', { lookX: .6 }], [wy + .9, 'smug']]), view: 'q', aR: lerp(0, 1.0, backOut(seg(t, wy - .15, wy + .2))) });
    nev(800, 1600, 28, { ...emotions(t, [[0, 'nervous', { lookX: -.6 }], [wy + .25, 'surprised', { lookX: -.4, lookY: -.6 }], [wy + 1.1, 'confused', { emote: '?' }]]), view: 'q', flip: true });
    camEnd();
    wipeIn(lt, ['#3E5A8E', '#27305A']);
    wipeOut(lt, dur, ['#3B4A72', '#6B4A3A']);
  }

  // ---------- C: falling asleep in Barbados ----------
  function shotC(t, lt, dur) {
    const wa = WT('sleep', 'asleep'), wal = WT('sleep', 'already'), wk = ease(seg(t, wal, wal + 1.6));
    camBegin(540, 1050 - 60 * ease(seg(lt, 0, dur)), 1.0 + .06 * ease(seg(lt, 0, dur)));
    bg(mixCol('#3B4A72', '#E9A27A', wk), 'c');
    // window
    boilSeed('cwin'); paint(rectPts(314, 404, 452, 432), { wash: mixCol('#2E2A40', '#8A5A3A', wk), ink: PAL.ink, sw: 1 });
    if (wk < 1) { paint(rectPts(330, 420, 420, 400), { wash: '#1E2547', ink: null }); snow(t, 12, 'cw', 1 - wk, 330, 420, 420, 400); }
    if (wk > 0) barbados(330, 420, 420, 400, t, wk, 'cbb');
    if (wk > 0) glow(540, 620, 420, '#FFC07A', wk);
    boilSeed('cfloor'); paint(rectPts(-100, 1560, 1300, 500), { wash: mixCol('#2A2E48', '#B9774E', wk), ink: null });
    // bed: headboard, the sleeper, then the blanket over him
    boilSeed('bed'); paint(rrPts(130, 1080, 820, 300, 40), { wash: mixCol('#5A4A3E', '#8A5A3A', wk), ink: PAL.ink, sw: 1.2 });
    paint(rrPts(220, 1210, 260, 110, 40), { wash: '#F3EBDC', ink: PAL.ink, sw: .9 });
    const closed = t > wa;
    nev(470, 1470, 28, { ...feel('sleepy', t), eyes: closed ? 'closed' : 'sleepy', mouth: wk > .3 ? 'smile' : null, hat: 'beanie', noLegs: true, rot: -.12, emote: wk > .2 ? 'zzz' : undefined, emoteK: seg(t, wal + .3, wal + .7), emoteAge: t - wal });
    boilSeed('blanket'); paint(through([[120, 1360], [500, 1330], [960, 1350], [990, 1600], [110, 1610]]), { wash: mixCol('#4F6FA8', '#E07A62', wk), ink: PAL.ink, sw: 1.2, curv: .5 });
    for (let i = 0; i < 4; i++) inkLine([[200 + i * 200, 1380], [230 + i * 200, 1580]], .6, mixCol('#3E5A8E', '#B5523E', wk));
    camEnd();
    wipeIn(lt, ['#3B4A72', '#6B4A3A']);
    if (lt > dur - .45) { const k = seg(lt, dur - .45, dur); iris(540, 1020, lerp(1500, 0, easeIn(k)), PAL.ink); }
  }

  // ---------- D: the letter ----------
  function shotD(t, lt, dur) {
    const wl = WT('letter', 'letter'), wb = WT('letter', 'brother'), wt = WT('letter', 'ticket');
    camBegin(540, 1080, 1.02);
    bg('#E7D3B0', 'd', .4);
    boilSeed('dfl'); paint(rectPts(-100, 1540, 1300, 500), { wash: '#B98C62', ink: null }); inkLine([[-50, 1540], [1130, 1544]], 1, PAL.ink);
    boilSeed('door'); paint(rrPts(330, 640, 420, 900, 10), { wash: '#8A5A3A', ink: PAL.ink, sw: 1.3 });
    paint(rrPts(380, 700, 320, 300, 8), { wash: '#7A4E31', ink: PAL.ink, sw: .8 }); paint(rrPts(380, 1150, 320, 330, 8), { wash: '#7A4E31', ink: PAL.ink, sw: .8 });
    paint(rectPts(470, 1050, 140, 30), { wash: '#C9A46B', ink: PAL.ink, sw: .9 });
    paint(ellPts(700, 1100, 16, 16, 10), { wash: '#E6B82A', ink: PAL.ink, sw: .7 });
    glow(980, 500, 380, '#FFF0C8', .6);
    // the envelope: through the slot, arcs to the floor, then into his hand
    const walk = stroll(t, lt < 0 ? 0 : VL('letter').t0 - .1, wl + .4, 1050, 760, 30);
    const env = (u, sw) => { if (t > wb) paint(rectPts(u * .2, -u * .9, u * 2.2, u * 1.5), { wash: '#F6EEDD', ink: PAL.ink, sw }); };
    if (t > wl && t <= wb) { const k = seg(t, wl, wl + .7); const [x, y] = arcPt([540, 1065], [470, 1520], -120, ease(k)); boilSeed('env'); push(); translate(x, y); rotate(k * 2.5); paint(rectPts(-55, -36, 110, 72), { wash: '#F6EEDD', ink: PAL.ink, sw: 1 }); inkLine([[-55, -36], [0, 4], [55, -36]], .7); pop(); }
    const mood = emotions(t, [[0, 'neutral'], [wl + .2, 'surprised', { lookX: -.8, lookY: .6 }], [wt, 'excited']]);
    const hop = jump(t, wt + .1, wt + .6, 1.6);
    nev(walk.x, 1580, 30, { ...mood, view: t < wb ? walk.view : 'q', flip: true, walk: walk.walk, dy: (mood.dy || 0) + walk.dy + hop.dy, sq: (mood.sq || 0) + hop.sq, aL: t > wb ? .4 : undefined, armL: env });
    if (t > wt) { const k = backOut(seg(t, wt, wt + .4)); ticket(walk.x - 80, 1580 - 30 * 9 - 60 * k + 30 * (hop.dy || 0), 1.6 * k, -.15 + .05 * Math.sin(t * 3), 1); }
    camEnd();
    if (lt < .5) iris(505, 1065, lerp(0, 1600, easeIn(lt / .5)), PAL.ink);
    wipeOut(lt, dur, ['#F0BE46', '#E9A27A']);
  }

  // ---------- E: third class, first class ----------
  function shotE(t, lt, dur) {
    const w3 = WT('ship', 'third'), wa = WT('ship', 'abdullah'), w1 = WT('ship', 'first', 1), wsl = WT('ship', 'sailed');
    const gold = ease(seg(t, w1, w1 + .5));
    camBegin(540, 1020, 1.0 + .03 * lt);
    bg('#9EC3D9', 'e', .5);
    boilSeed('esun'); glow(860, 420, 300, '#FFE29A', .6); paint(ellPts(860, 420, 70, 70, 20), { wash: '#FFF0C0', ink: null });
    boilSeed('sea'); paint(rectPts(-100, 1180, 1300, 400), { wash: '#3D7FA0', ink: null }); for (let i = 0; i < 6; i++) inkLine([[60 + i * 170 + 20 * Math.sin(t + i), 1230 + (i % 3) * 50], [140 + i * 170 + 20 * Math.sin(t + i), 1230 + (i % 3) * 50]], .7, '#D9EEF2');
    // the ship, sailing right after "sailed"
    const sx = 720 * easeIn(seg(t, wsl + .9, dur + .8));
    push(); translate(sx, 0);
    boilSeed('ship');
    paint(rectPts(420, 700, 80, 260), { wash: '#C2453A', ink: PAL.ink, sw: 1 }); paint(rectPts(620, 740, 80, 220), { wash: '#C2453A', ink: PAL.ink, sw: 1 });
    paint(rectPts(260, 940, 600, 120), { wash: '#F3EBDC', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 6; i++) paint(ellPts(310 + i * 95, 1000, 18, 18, 10), { wash: '#9EC3D9', ink: PAL.ink, sw: .6 });
    paint([[120, 1060], [1040, 1060], [960, 1230], [200, 1230]], { wash: '#2D2F45', ink: PAL.ink, sw: 1.3 });
    paint([[140, 1090], [1020, 1090], [1010, 1120], [150, 1120]], { wash: '#C2453A', ink: null });
    // horn steam on "sailed"
    for (let i = 0; i < 4; i++) { const a = t - wsl - i * .25; if (a > 0 && a < 2) { const k = a / 2; paint(ellPts(460 + 60 * k + 20 * i, 680 - 260 * k, 50 + 70 * k, 40 + 50 * k, 14), { wash: '#F6F4EE', washOp: 255 * (1 - k), ink: null }); } }
    pop();
    boilSeed('dock'); paint(rectPts(-100, 1440, 1300, 600), { wash: '#8A6243', ink: PAL.ink, sw: 1.1 }); for (let i = 0; i < 6; i++) inkLine([[-50, 1480 + i * 80], [1130, 1482 + i * 80]], .7, '#5E4130');
    for (const x of [120, 980]) paint(rectPts(x - 26, 1300, 52, 200), { wash: '#6E4A33', ink: PAL.ink, sw: .9 });
    // Abdullah in a warm thought cloud
    const ck = backOut(seg(t, wa - .1, wa + .35)) * (1 - ease(seg(t, wsl - .2, wsl + .3)));
    if (ck > .02) { push(); translate(320, 520); scale(ck); cloud(0, 0, 1.0, '#FFF3DA'); abd(0, 70, 12, { ...feel('smug', t), view: 'front', noShadow: true }); pop(); }
    // Neville, the ticket, the jump
    const mood = emotions(t, [[0, 'hopeful'], [w3 + .2, 'sad', { lookX: .2, lookY: .8 }], [wa + .5, 'thinking', { lookX: -.6, lookY: -.7 }], [w1 + .1, 'starstruck']]);
    const hop = jump(t, w1 + .45, w1 + .95, 2.2);
    const walk = stroll(t, w1 + 1.1, dur, 380, 820, 30);
    const tk = (u, sw) => { push(); scale(u / 30); ticket(u * .9, -10, .9, -.3, gold); pop(); };
    nev(walk.x, 1620, 32, { ...mood, view: t > w1 + 1.1 ? walk.view : 'q', walk: walk.walk, dy: (mood.dy || 0) + hop.dy + walk.dy, sq: (mood.sq || 0) + hop.sq, aR: lerp(.1, 1.1, ease(seg(t, w1 - .2, w1 + .2))), armR: tk });
    camEnd();
    wipeIn(lt, ['#F0BE46', '#E9A27A']);
    wipeOut(lt, dur, ['#E58E6A', '#F1D9B5']);
  }

  // ---------- F: same move, different costume ----------
  const HATS = ['fedora', 'crown', 'wizard', 'top', 'flower', 'headphones', 'party', 'fedora'];
  function shotF(t, lt, dur) {
    const we = WT('costume', 'every'), wc = WT('costume', 'costume'), wth = WT('costume', 'thing');
    camBegin(540, 1180, 1.05 + .02 * Math.sin(lt * .8));
    bg('#F1D9B5', 'f', .4);
    boilSeed('fstage'); glow(540, 1050, 520, '#FFE2A8', .5); paint(ellPts(540, 1560, 470, 100, 30), { wash: '#E58E6A', ink: PAL.ink, sw: 1 });
    boilSeed('fcurt'); paint(through([[-60, 300], [180, 320], [130, 1700], [-60, 1700]]), { wash: '#B5523E', ink: PAL.ink, sw: 1, curv: .5 }); paint(through([[1140, 300], [900, 320], [950, 1700], [1140, 1700]]), { wash: '#B5523E', ink: PAL.ink, sw: 1, curv: .5 });
    // hats swap on even steps from "every" to just after "costume"; the same little move each time
    const n = HATS.length - 1, step = (wc + .3 - we) / n;
    const i = t < we ? 0 : Math.min(n, Math.floor((t - we) / step) + 1), ts = we + (i - 1) * step;
    const pop2 = i > 0 ? spring(t, ts, 9, 22) : 0, arm = i > 0 ? 1.25 * (1 - seg(t, ts + step * .6, ts + step)) : 0;
    const mood = emotions(t, [[0, 'thinking', { lookY: -.6 }], [wth - .1, 'idea'], [we, 'playful']]);
    nev(540, 1560, 44, { ...mood, hat: HATS[i], aR: i > 0 && i < n ? arm : mood.aR, dy: (mood.dy || 0) - .5 * Math.abs(pop2), sq: (mood.sq || 0) + .12 * pop2, view: 'front' });
    camEnd();
    wipeIn(lt, ['#E58E6A', '#F1D9B5']);
  }

  // ---------- G: attention off the fact ----------
  function shotG(t, lt, dur) {
    const wo = WT('off', 'off'), k = ease(seg(t, wo, wo + .9));
    const pan = easeIn(seg(lt, dur - .35, dur));
    camBegin(540 + 700 * pan, 1100, 1.02);
    bg('#B7B9C4', 'g', .5);
    boilSeed('gfl'); paint(rectPts(-100, 1560, 2400, 500), { wash: '#8E909C', ink: null });
    // the fact: a grey page under a rain cloud
    const s = lerp(1, .45, k);
    push(); translate(330, 800); scale(s); rotate(-.08);
    boilSeed('fact'); paint(rectPts(-170, -10, 340, 420), { wash: mixCol('#D5D3CE', '#B7B9C4', k), ink: PAL.ink, sw: 1 });
    for (let j = 0; j < 7; j++) inkLine([[-130, 50 + j * 48], [100 - 60 * hash(j), 52 + j * 48]], .8, '#6B6E7A', 'inkfine');
    paint(ellPts(-60, 230, 46, 46, 16), { wash: '#C9675C', washOp: 255 * (1 - k), ink: null });
    cloud(0, -150, .9, mixCol('#6B6E7A', '#B7B9C4', k));
    for (let j = 0; j < 6; j++) { const y = (t * 500 + j * 70) % 160; inkLine([[-120 + j * 50, -90 + y], [-130 + j * 50, -60 + y]], .9 * (1 - k), '#6D86BE'); }
    pop();
    const tr = turn(t, wo, wo + .3, -.25, .25);
    nev(700, 1580, 38, { ...emotions(t, [[0, 'nervous', { lookX: -1, lookY: -.4 }], [wo, 'determined']]), ...tr, flip: t < wo + .15 });
    camEnd();
  }

  // ---------- H + I: the doorway (one set, the camera carries through) ----------
  const DOOR = { x: 560, y: 600, w: 420, h: 940 };
  function doorSet(t, open) {
    bg('#4A3F6B', 'h', .5);
    boilSeed('hfl'); paint(rectPts(-100, 1540, 1300, 500), { wash: '#3A3054', ink: null });
    glow(DOOR.x + DOOR.w / 2, DOOR.y + DOOR.h / 2, 700 * (.4 + .6 * open), '#FFB86B', .9);
    boilSeed('hdoor'); paint(rectPts(DOOR.x - 24, DOOR.y - 24, DOOR.w + 48, DOOR.h + 24), { wash: '#6E4A33', ink: PAL.ink, sw: 1.2 });
    barbados(DOOR.x, DOOR.y, DOOR.w, DOOR.h, t, 1, 'hbb');
    paint(rectPts(DOOR.x - 100, DOOR.y + DOOR.h, DOOR.w + 200, 30), { fill: '#FFC766', fillOp: 120 * open, bleed: .3, ink: null });
    const dw = DOOR.w * (1 - open);
    if (dw > 4) { boilSeed('hpanel'); paint(rectPts(DOOR.x, DOOR.y, dw, DOOR.h), { wash: '#7A4E31', ink: PAL.ink, sw: 1 }); if (dw > 60) paint(ellPts(DOOR.x + dw - 36, DOOR.y + DOOR.h * .55, 14, 14, 10), { wash: '#E6B82A', ink: PAL.ink, sw: .6 }); }
  }
  function shotH(t, lt, dur) {
    const wp = WT('on', 'put'), wd = WT('on', 'done'), wf = WT('on', 'feel');
    const open = ease(seg(t, wp, wd + .2));
    camBegin(540 - 700 * (1 - easeOut(seg(lt, 0, .5))), 1100, 1.02);
    doorSet(t, open);
    const walk = stroll(t, wf + .1, dur + .4, 300, 450, 32);
    nev(walk.x, 1600, 34, { ...emotions(t, [[0, 'determined', { lookX: .7 }], [wd, 'hopeful', { lookX: .8 }], [wf, 'love']]), view: t > wf + .1 ? walk.view : 'q', walk: walk.walk, dy: walk.dy });
    camEnd();
  }
  function shotI(t, lt, dur) {
    const wv = WT('catch', 'visit'), wo = WT('catch', 'once'), wl = WT('catch', 'live'), ws = WT('catch', 'slept');
    const push2 = ease(seg(t, ws - .4, ws + .8));
    camBegin(lerp(540, DOOR.x + DOOR.w / 2, push2), lerp(1100, 1080, push2), lerp(1.02, 1.9, push2));
    doorSet(t, 1);
    // the hammock between the palm and the door frame, he's asleep in it after "slept"
    if (t > ws - .2) { boilSeed('ham'); inkLine([[DOOR.x + 120, DOOR.y + 700], [DOOR.x + 220, DOOR.y + 760], [DOOR.x + 380, DOOR.y + 690]], 1.4, '#7A5236'); nev(DOOR.x + 245, DOOR.y + 770, 11, { ...feel('sleepy', t), eyes: 'closed', mouth: 'smile', hat: null, noLegs: true, noShadow: true, emote: 'zzz', emoteK: seg(t, ws, ws + .4), emoteAge: t - ws }); }
    // peek and back out on "visit... once", then walk in on "live"
    let x = 300;
    x = lerp(450, 560, ease(seg(t, wv - .2, wo))) ; if (t > wo) x = lerp(560, 260, ease(seg(t, wo, wo + .7))); if (t > wl - .3) x = lerp(260, 820, ease(seg(t, wl - .3, ws - .3)));
    const inDoor = t > ws - .3;
    const caseHeld = t < wl + .3;
    const sc = (u, sw) => { if (caseHeld) paint(rrPts(-u * .2, u * .2, u * 2.4, u * 1.8, u * .3), { wash: '#8A5A33', ink: PAL.ink, sw }); };
    if (!caseHeld) { boilSeed('case'); paint(rrPts(330, 1520, 120, 90, 14), { wash: '#8A5A33', ink: PAL.ink, sw: 1 }); }
    if (!inDoor) {
      const back = t > wo && t < wo + .7, mood = emotions(t, [[0, 'shy', { lookX: .8 }], [wo, 'nervous'], [wl, 'determined', { lookX: .8 }]]);
      nev(x, 1600, 34, { ...mood, view: back ? 'q' : (t > wl - .3 ? 'side' : 'q'), flip: false, walk: Math.abs(x) / 70, aL: caseHeld ? -1.1 : mood.aL, armL: sc });
    }
    if (t > wo && t < wl) { boilSeed('x'); push(); translate(220, 1100); scale(backOut(seg(t, wo, wo + .25))); paint(ellPts(0, 0, 60, 60, 20), { wash: '#C2453A', ink: PAL.ink, sw: 1 }); inkLine([[-26, -26], [26, 26]], 2.4, PAL.cream); inkLine([[26, -26], [-26, 26]], 2.4, PAL.cream); pop(); }
    if (t > wl && t < ws) { boilSeed('chk'); push(); translate(870, 1100); scale(backOut(seg(t, wl, wl + .25))); paint(ellPts(0, 0, 60, 60, 20), { wash: '#2F9E5B', ink: PAL.ink, sw: 1 }); inkLine([[-28, 0], [-6, 24], [30, -24]], 2.4, PAL.cream); pop(); }
    camEnd();
    if (lt > dur - .45) flash(ease(seg(lt, dur - .45, dur)), '#F6D58A');
  }

  // ---------- J: Romans 12:2 ----------
  function shotJ(t, lt, dur) {
    const wtr = WT('verse', 'transformed'), wr = WT('verse', 'renewing');
    const g = ease(seg(t, wtr, wtr + .8));
    camBegin(540, 1150 - 40 * ease(seg(lt, 0, dur)), 1.05 + .05 * ease(seg(lt, 0, dur)));
    bg('#2E2440', 'j', .6);
    boilSeed('rays'); glow(540, 1260, 600, '#FFD27A', .6 + .4 * g);
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .28; paint([[540, 1260], [540 + Math.cos(a - .06) * 900, 1260 + Math.sin(a - .06) * 900], [540 + Math.cos(a + .06) * 900, 1260 + Math.sin(a + .06) * 900]], { wash: '#FFE9B0', washOp: 40 + 30 * g, ink: null }); }
    const gold = t > wtr + .35;
    if (gold) glow(540, 1150, 420, '#FFD36B', .9);
    clawd(540, 1330, 34, { ...emotions(t, [[0, 'thinking', { lookY: .7 }], [wtr, 'starstruck'], [wr + .4, 'relieved']]), noLegs: true, hat: 'fedora', col: gold ? '#F0BE46' : NEV.col, dk: gold ? '#C68A1E' : NEV.dk, lt: gold ? '#FFE29A' : NEV.lt });
    boilSeed('desk'); paint(rectPts(80, 1320, 920, 600), { wash: '#5A3A2A', ink: PAL.ink, sw: 1.2 });
    boilSeed('book'); paint(through([[300, 1330], [540, 1300], [780, 1330], [760, 1250], [540, 1225], [320, 1250]]), { wash: '#F6EEDD', ink: PAL.ink, sw: 1, curv: .4 }); inkLine([[540, 1228], [540, 1300]], .8);
    for (let i = 0; i < 4; i++) { inkLine([[350, 1255 + i * 16], [510, 1240 + i * 16]], .5, '#8A7A66', 'inkfine'); inkLine([[570, 1240 + i * 16], [730, 1255 + i * 16]], .5, '#8A7A66', 'inkfine'); }
    boilSeed('candle'); glow(200, 1170, 200, '#FFC766', 1); paint(rectPts(180, 1190, 40, 130), { wash: '#F3EBDC', ink: PAL.ink, sw: .8 }); paint(ellPts(200, 1170, 10 + 2 * Math.sin(t * 13), 22, 10), { wash: '#FFCF5A', ink: null });
    if (t > wr) { boilSeed('spk'); for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + t * .6, r = 260 + 30 * Math.sin(t * 3 + i), k = backOut(seg(t, wr + i * .06, wr + .3 + i * .06)); if (k > .02) { glow(540 + Math.cos(a) * r, 1150 + Math.sin(a) * r * .8, 40, '#FFE29A', .8); paint(starPts(540 + Math.cos(a) * r, 1150 + Math.sin(a) * r * .8, 22 * k, .4, 4, t), { wash: '#FFF1C2', ink: null }); } } }
    camEnd();
    if (lt < .45) flash(1 - ease(lt / .45), '#F6D58A');
    { const k = 1 - Math.abs(t - (wtr + .35)) / .3; if (k > 0) flash(k * .85, '#FFF4D6'); }
    wipeOut(lt, dur, ['#3E5A8E', '#27305A']);
  }

  // ---------- K: tonight (rhymes with A) ----------
  function shotK(t, lt, dur) {
    const wt = WT('close', 'tonight'), we = WT('cta', 'end');
    const pk = ease(seg(t, wt, we - .2));
    const cx = lerp(540, WIN.x + WIN.w / 2, pk), cy = lerp(1080, WIN.y + WIN.h / 2, pk), z = lerp(1.05, 2.9, pk);
    camBegin(cx, cy, z);
    street(t, 1);
    // inside the window: he sleeps smiling, warm
    boilSeed('kin'); push();
    nev(WIN.x + 150, WIN.y + WIN.h - 10, 9, { ...feel('sleepy', t), eyes: 'closed', mouth: 'smile', hat: 'beanie', noLegs: true, noShadow: true, emote: 'zzz', emoteK: seg(t, wt + .3, wt + .7), emoteAge: t - wt });
    pop();
    snow(t, 22, 'k');
    const at = toScreen(WIN.x + WIN.w / 2, WIN.y + WIN.h / 2);
    camEnd();
    wipeIn(lt, ['#3E5A8E', '#27305A']);
    if (t > we + .35) { const k = seg(t, we + .35, DUR - .25); iris(at[0], at[1], lerp(1300, 0, easeIn(k)), PAL.ink); }
  }

  const S = id => VL(id).t0;
  shots([
    [0, shotA], [S('told') - .25, shotB], [S('sleep') - .2, shotC], [S('letter') - .1, shotD], [S('ship') - .15, shotE],
    [S('costume') - .1, shotF], [S('off') - .05, shotG], [S('on') - .1, shotH], [S('catch') - .15, shotI], [S('verse') - .2, shotJ], [S('close') - .2, shotK],
  ]);
})();
