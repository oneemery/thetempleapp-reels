// people2.js: the finished character renderer (overrides person() from people.js; uses its CAST and PROPS).
// Cel shaded flat paint: base colour, a shadow side, a highlight side, ink outlines with weight variation.
(() => {
  const dark = (c, k = .28) => mixCol(c, '#1B1222', k), lite = (c, k = .22) => mixCol(c, '#FFF8EC', k);
  const closed = P => P.concat([P[0]]);
  const MOOD = {
    neutral:   { bi: 0, bo: 0, eye: 'open', mouth: 'flat' },
    happy:     { bi: .12, bo: -.04, eye: 'smile', mouth: 'smile' },
    joy:       { bi: .22, bo: .1, eye: 'smile', mouth: 'grin' },
    sad:       { bi: .4, bo: -.25, eye: 'open', mouth: 'frown' },
    surprised: { bi: .5, bo: .45, eye: 'wide', mouth: 'o' },
    worried:   { bi: .45, bo: -.1, eye: 'open', mouth: 'wobble' },
    determined:{ bi: -.35, bo: .12, eye: 'narrow', mouth: 'flat' },
    wise:      { bi: .06, bo: 0, eye: 'lid', mouth: 'smile' },
    sleepy:    { bi: 0, bo: -.1, eye: 'closed', mouth: 'smile' },
    awe:       { bi: .45, bo: .3, eye: 'wide', mouth: 'open' },
    beam:      { bi: .14, bo: 0, eye: 'smile', mouth: 'teeth' },
    warm:      { bi: .1, bo: 0, eye: 'open', mouth: 'teeth' },
    skeptical: { bi: -.2, bo: .35, eye: 'narrow', mouth: 'smirk', asym: true },
  };
  function eyes(cx, ey, er, S, o, m, sw) {
    const lx = (o.look || 0) * er * .35, ly = (o.lookY || 0) * er * .25, skin = S.skin;
    for (const s of [-1, 1]) {
      const x = cx + s * er * 1.85;
      const kind = o.blink ? 'closed' : m.eye;
      if (kind === 'closed') { inkLine([[x - er, ey - er * .1], [x, ey + er * .45], [x + er, ey - er * .1]], sw * 1.1, PAL.ink, 'ink', .6); continue; }
      if (kind === 'smile') { inkLine([[x - er * 1.05, ey + er * .35], [x, ey - er * .55], [x + er * 1.05, ey + er * .35]], sw * 1.2, PAL.ink, 'ink', .6); continue; }
      const rx = kind === 'wide' ? er * 1.05 : er * .95, ry = kind === 'wide' ? er * 1.3 : er * 1.1;
      paint(ellPts(x, ey, rx, ry, 18), { wash: '#FBF7EE', ink: null });
      const ir = Math.min(rx, ry) * (kind === 'wide' ? .52 : .66);
      paint(ellPts(x + lx, ey + ly + er * .1, ir, ir * 1.05, 14), { wash: S.iris || '#4A2E1E', ink: null });
      paint(ellPts(x + lx, ey + ly + er * .1, ir * .5, ir * .52, 10), { wash: '#160E14', ink: null });
      paint(ellPts(x + lx - ir * .38, ey + ly - ir * .25, ir * .26, ir * .26, 8), { wash: '#FFFFFF', ink: null });
      paint(ellPts(x + lx + ir * .35, ey + ly + ir * .4, ir * .12, ir * .12, 6), { wash: '#FFFFFF', ink: null });
      let lidK = kind === 'narrow' ? .5 : kind === 'lid' ? .4 : 0;
      if (m.asym && s < 0) lidK = .2;
      if (lidK > 0) { const ly2 = ey - ry + ry * 2 * lidK; paint([[x - rx * 1.15, ey - ry * 1.25], [x + rx * 1.15, ey - ry * 1.25], [x + rx * 1.15, ly2], [x - rx * 1.15, ly2]], { wash: dark(skin, .12), ink: null }); inkLine([[x - rx, ly2], [x + rx, ly2]], sw * 1.1); }
      else inkLine([[x - rx * 1.1, ey - ry * .1], [x - rx * .5, ey - ry * 1.02], [x + rx * .5, ey - ry * 1.02], [x + rx * 1.1, ey - ry * .2]], sw * 1.25, PAL.ink, 'ink', .6);
      inkLine([[x - rx * .9, ey + ry * .5], [x, ey + ry * 1.0], [x + rx * .9, ey + ry * .5]], sw * .4, dark(skin, .4), 'inkfine', .6);
    }
  }
  function brows(cx, ey, er, S, m, sw) {
    const col = S.brow || S.hair;
    for (const s of [-1, 1]) {
      const x = cx + s * er * 1.85, yb = ey - er * 1.95, bo = m.asym && s > 0 ? m.bo + .3 : m.bo;
      paint(ribbon([[x - s * er * 1.15, yb - m.bi * er * 1.6], [x, yb - er * .3 - (m.bi + bo) * er * .8], [x + s * er * 1.2, yb - bo * er * 1.6 + er * .15]], er * .42, er * .2), { wash: col, ink: null });
    }
  }
  function mouth(cx, my, hw, hh, S, m, sw) {
    const mw = hw * .34, lip = dark(S.skin, .25);
    if (m.mouth === 'speak') {   // continuous talking mouth: sp.open 0..1, sp.round 0..1 (O/U) vs wide (E/I)
      const o = clamp(m.sp.open), r = clamp(m.sp.round), w = mw * (1.15 - .45 * r), h = hh * (.025 + .2 * o) * (1 + .25 * r), y0 = my + hh * .02;
      if (o < .06) { inkLine([[cx - w, y0], [cx, y0 + hh * .03], [cx + w, y0]], sw, PAL.ink, 'ink', .5); return; }
      const P = [[cx - w, y0], [cx - w * .55, y0 - h * .35], [cx, y0 - h * .4], [cx + w * .55, y0 - h * .35], [cx + w, y0], [cx + w * .6, y0 + h * .8], [cx, y0 + h], [cx - w * .6, y0 + h * .8]];
      paint(closed(through(P)), { wash: '#5E2226', ink: PAL.ink, sw: sw * .85 });
      if (r < .55 && o > .25) paint(through([[cx - w * .78, y0 - h * .22], [cx, y0 - h * .3], [cx + w * .78, y0 - h * .22], [cx + w * .6, y0 - h * .02], [cx - w * .6, y0 - h * .02]]).concat([[cx - w * .78, y0 - h * .22]]), { wash: '#FCFAF4', ink: null });
      if (o > .35) paint(ellPts(cx, y0 + h * .62, w * .45, h * .22, 12), { wash: '#D9707A', ink: null });
      inkLine([[cx - mw * .5, my + hh * .2 + h * .6], [cx + mw * .5, my + hh * .2 + h * .6]], sw * .4, lip, 'inkfine', .5);
      return;
    }
    if (m.mouth === 'teeth') {
      const P = through([[cx - mw * 1.3, my - hh * .06], [cx - mw * .6, my + hh * .14], [cx, my + hh * .19], [cx + mw * .6, my + hh * .14], [cx + mw * 1.3, my - hh * .06], [cx, my - hh * .02]]);
      paint(closed(P), { wash: '#6E2A2A', ink: PAL.ink, sw: sw * .9 });
      paint(through([[cx - mw * 1.15, my - hh * .04], [cx, my], [cx + mw * 1.15, my - hh * .04], [cx + mw * .8, my + hh * .07], [cx, my + hh * .08], [cx - mw * .8, my + hh * .07]]).concat([[cx - mw * 1.15, my - hh * .04]]), { wash: '#FCFAF4', ink: null });
      inkLine([[cx - mw * .7, my + hh * .24], [cx + mw * .7, my + hh * .24]], sw * .45, lip, 'inkfine', .5);
      return;
    }
    if (m.mouth === 'grin') { paint(closed(through([[cx - mw * 1.2, my - hh * .05], [cx, my + hh * .2], [cx + mw * 1.2, my - hh * .05], [cx, my]])), { wash: '#6E2A2A', ink: PAL.ink, sw: sw * .9 }); paint(ellPts(cx, my + hh * .12, mw * .5, hh * .06, 10), { wash: '#E07A80', ink: null }); return; }
    if (m.mouth === 'o' || m.mouth === 'open') { const r = m.mouth === 'o' ? .38 : .55; paint(ellPts(cx, my + hh * .04, mw * r, hh * r * .26, 14), { wash: '#5E2226', ink: PAL.ink, sw: sw * .8 }); paint(ellPts(cx, my + hh * .04 + hh * r * .12, mw * r * .6, hh * r * .1, 10), { wash: '#D9707A', ink: null }); return; }
    const C = { flat: [[cx - mw, my], [cx, my + hh * .01], [cx + mw, my]], smile: [[cx - mw * 1.1, my - hh * .05], [cx, my + hh * .09], [cx + mw * 1.1, my - hh * .05]],
      frown: [[cx - mw, my + hh * .06], [cx, my - hh * .04], [cx + mw, my + hh * .06]], wobble: [[cx - mw, my], [cx - mw * .4, my - hh * .03], [cx + mw * .2, my + hh * .02], [cx + mw, my - hh * .01]],
      smirk: [[cx - mw * .8, my + hh * .02], [cx + mw * .3, my + hh * .02], [cx + mw, my - hh * .07]] };
    inkLine(C[m.mouth] || C.flat, sw * 1.0, PAL.ink, 'ink', .5);
    inkLine([[cx - mw * .5, my + hh * .15], [cx + mw * .5, my + hh * .15]], sw * .4, lip, 'inkfine', .5);
  }
  function arm(sx, sy, ang, len, w, S, sw, side) {
    const bend = .32 * side, a1 = ang, a2 = ang + bend;
    const ex = sx + Math.cos(a1) * len * .5, ey = sy + Math.sin(a1) * len * .5;
    const wx = ex + Math.cos(a2) * len * .44, wy = ey + Math.sin(a2) * len * .44;
    const col = S.sleeve || S.coat;
    paint(ribbon([[sx, sy], [ex, ey], [wx, wy]], w, w * .78), { wash: col, ink: PAL.ink, sw });
    paint(ribbon([[sx + Math.cos(a1 + 1.57 * side) * w * .2, sy + Math.sin(a1 + 1.57 * side) * w * .2], [ex + Math.cos(a1 + 1.57 * side) * w * .2, ey + Math.sin(a1 + 1.57 * side) * w * .2], [wx, wy]], w * .35, w * .2), { wash: dark(col, .18), ink: null });
    const cx2 = wx - Math.cos(a2) * w * .25, cy2 = wy - Math.sin(a2) * w * .25;
    paint(ribbon([[cx2, cy2], [wx + Math.cos(a2) * w * .15, wy + Math.sin(a2) * w * .15]], w * .9, w * .88), { wash: S.cuff || dark(col, .12), ink: PAL.ink, sw: sw * .7 });
    const hx = wx + Math.cos(a2) * w * .62, hy = wy + Math.sin(a2) * w * .62;
    push(); translate(hx, hy); rotate(a2 - Math.PI / 2);
    paint(rrPts(-w * .5, -w * .25, w, w * 1.0, w * .45), { wash: S.skin, ink: PAL.ink, sw: sw * .75 });
    paint(ellPts(w * .5 * side * -1, w * .05, w * .2, w * .34, 8, 0, -.5 * side), { wash: S.skin, ink: PAL.ink, sw: sw * .6 });
    inkLine([[-w * .18, w * .55], [-w * .18, w * .72]], sw * .35, dark(S.skin, .4), 'inkfine'); inkLine([[w * .1, w * .55], [w * .1, w * .72]], sw * .35, dark(S.skin, .4), 'inkfine');
    pop();
    return [hx, hy];
  }
  function hair(S, hy, hw, hh, sw, front) {
    const H = S.hair, hl = lite(H, .28);
    if (S.afro && !front) {
      const ax = 0, ay = hy - hh * .78, rx = hw * 1.75, ry = hh * 1.32, B = [];
      for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, k = 1 + .045 * Math.sin(i * 3.1) + .03 * Math.sin(i * 7.3); B.push([ax + Math.cos(a) * rx * k, ay + Math.sin(a) * ry * k * (Math.sin(a) > 0 ? .78 : 1)]); }
      paint(B, { wash: H, ink: PAL.ink, sw: sw * 1.1, curv: .2 });
      for (let i = 0; i < 70; i++) { const a = hash(i * 1.7) * TAU, r = Math.sqrt(hash(i * 2.9)) * .88, x = ax + Math.cos(a) * rx * r, y = ay + Math.sin(a) * ry * r * (Math.sin(a) > 0 ? .78 : 1);
        const up = (y < ay - ry * .2 && x < ax + rx * .3); const c = up ? lite(H, .2) : lite(H, .08); const s = hw * (.1 + .05 * hash(i * 4.1));
        const A = []; for (let q = 0; q <= 6; q++) { const aa = Math.PI * .85 + q / 6 * Math.PI * 1.3; A.push([x + Math.cos(aa) * s * .8, y + Math.sin(aa) * s * .8]); } inkLine(A, sw * .45, c, 'inkfine', .5); }
      return;
    }
    if (S.afro && front) { paint(closed(through([[-hw * 1.03, hy - hh * .3], [-hw * .9, hy - hh * .95], [0, hy - hh * 1.12], [hw * .9, hy - hh * .95], [hw * 1.03, hy - hh * .3], [hw * .75, hy - hh * .62], [hw * .2, hy - hh * .74], [-hw * .4, hy - hh * .7], [-hw * .8, hy - hh * .58]])), { wash: H, ink: null }); inkLine(through([[-hw * .8, hy - hh * .58], [-hw * .4, hy - hh * .7], [hw * .2, hy - hh * .74], [hw * .75, hy - hh * .62]]), sw * .9); return; }
    if (!front) return;
    if (S.hairStyle === 'neat') { paint(closed(through([[-hw * 1.04, hy - hh * .1], [-hw * .95, hy - hh * .92], [-hw * .2, hy - hh * 1.14], [hw * .8, hy - hh * 1.0], [hw * 1.04, hy - hh * .15], [hw * .7, hy - hh * .55], [hw * .1, hy - hh * .72], [-hw * .45, hy - hh * .6], [-hw * .8, hy - hh * .4]])), { wash: H, ink: PAL.ink, sw: sw * .9 }); inkLine([[-hw * .5, hy - hh * .95], [hw * .3, hy - hh * .92]], sw * .6, hl, 'inkfine'); }
    if (S.hairStyle === 'curls') { for (let i = 0; i < 12; i++) { const a = Math.PI * .95 + i / 11 * Math.PI * 1.1, r = hw * (1.0 + .06 * Math.sin(i * 2)); const x = Math.cos(a) * r, y = hy - hh * .45 + Math.sin(a) * hh * .68; paint(ellPts(x, y, hw * .34, hw * .31, 12), { wash: H, ink: PAL.ink, sw: sw * .65 }); inkLine([[x - hw * .12, y - hw * .05], [x + hw * .05, y - hw * .14]], sw * .4, hl, 'inkfine'); } for (let i = 0; i < 5; i++) paint(ellPts(-hw * .6 + i * hw * .3, hy - hh * .95, hw * .3, hw * .28, 10), { wash: H, ink: PAL.ink, sw: sw * .55 }); }
    if (S.hairStyle === 'bald') { paint(ellPts(-hw * .35, hy - hh * .72, hw * .35, hh * .12, 12, 0, -.3), { wash: '#FFFFFF', washOp: 70, ink: null }); for (const s of [-1, 1]) paint(closed(through([[s * hw * 1.04, hy - hh * .45], [s * hw * 1.18, hy - hh * .1], [s * hw * 1.0, hy + hh * .25], [s * hw * .9, hy - hh * .1]])), { wash: H, ink: PAL.ink, sw: sw * .7 }); }
  }
  function beard(S, hy, hw, hh, sw) {
    if (!S.beard) return;
    const C = S.beardCol || S.hair, P = through([[-hw * .98, hy + hh * .02], [-hw * .8, hy + hh * 1.05], [-hw * .3, hy + hh * (1.25 + S.beard)], [0, hy + hh * (1.32 + S.beard)], [hw * .3, hy + hh * (1.25 + S.beard)], [hw * .8, hy + hh * 1.05], [hw * .98, hy + hh * .02], [hw * .55, hy + hh * .5], [hw * .25, hy + hh * .72], [-hw * .25, hy + hh * .72], [-hw * .55, hy + hh * .5]]);
    paint(closed(P), { wash: C, ink: PAL.ink, sw: sw * .9 });
    for (let i = 0; i < 9; i++) { const x = -hw * .7 + i * hw * .175, y0 = hy + hh * (.8 + .1 * Math.sin(i)); inkLine([[x, y0], [x + hw * .03, y0 + hh * (.35 + .25 * Math.cos(i * .7)) * (1 + S.beard)]], sw * .4, dark(C, .18), 'inkfine'); }
    paint(closed(through([[-hw * .55, hy + hh * .5], [-hw * .1, hy + hh * .36], [hw * .1, hy + hh * .36], [hw * .55, hy + hh * .5], [hw * .3, hy + hh * .58], [-hw * .3, hy + hh * .58]])), { wash: lite(C, .05), ink: PAL.ink, sw: sw * .6 });
  }
  function hat(S, hy, hw, hh, sw) {
    const C = S.hatCol;
    if (S.hat === 'fedora') {
      paint(ellPts(0, hy - hh * .8, hw * 1.62, hh * .2, 22), { wash: C, ink: PAL.ink, sw }); paint(ellPts(0, hy - hh * .84, hw * 1.45, hh * .1, 18), { wash: lite(C, .1), ink: null });
      const crown = through([[-hw * .98, hy - hh * .82], [-hw * .9, hy - hh * 1.5], [-hw * .3, hy - hh * 1.6], [0, hy - hh * 1.48], [hw * .3, hy - hh * 1.6], [hw * .9, hy - hh * 1.5], [hw * .98, hy - hh * .82]]);
      paint(closed(crown), { wash: C, ink: PAL.ink, sw }); paint([[hw * .45, hy - hh * 1.45], [hw * .92, hy - hh * 1.45], [hw * .97, hy - hh * .85], [hw * .5, hy - hh * .85]], { wash: dark(C, .25), ink: null });
      inkLine([[0, hy - hh * 1.5], [0, hy - hh * 1.25]], sw * .6, dark(C, .4), 'inkfine');
      paint(rectPts(-hw * .97, hy - hh * 1.03, hw * 1.94, hh * .18), { wash: S.band, ink: PAL.ink, sw: sw * .5 });
    }
    if (S.hat === 'cap') { const P = through([[-hw * 1.0, hy - hh * .55], [-hw * .92, hy - hh * 1.18], [0, hy - hh * 1.32], [hw * .92, hy - hh * 1.18], [hw * 1.0, hy - hh * .55]]); paint(closed(P), { wash: C, ink: PAL.ink, sw }); paint([[hw * .4, hy - hh * 1.25], [hw * .92, hy - hh * 1.15], [hw * .99, hy - hh * .6], [hw * .45, hy - hh * .6]], { wash: dark(C, .25), ink: null }); paint(rectPts(-hw * .99, hy - hh * .74, hw * 1.98, hh * .14), { wash: S.band, ink: PAL.ink, sw: sw * .5 }); for (let i = 0; i < 5; i++) paint(starPts(-hw * .7 + i * hw * .35, hy - hh * .95, hw * .07, .5, 4, 0), { wash: S.band, ink: null }); }
    if (S.hat === 'flatcap') { paint(closed(through([[-hw * 1.04, hy - hh * .5], [-hw * .85, hy - hh * 1.12], [hw * .45, hy - hh * 1.2], [hw * 1.05, hy - hh * .82], [hw * 1.55, hy - hh * .62], [hw * 1.04, hy - hh * .5]])), { wash: C, ink: PAL.ink, sw }); for (let i = 0; i < 4; i++) inkLine([[-hw * .7 + i * hw * .45, hy - hh * 1.08], [-hw * .5 + i * hw * .45, hy - hh * .6]], sw * .35, dark(C, .3), 'inkfine'); paint([[hw * .9, hy - hh * .8], [hw * 1.5, hy - hh * .63], [hw * 1.0, hy - hh * .55]], { wash: dark(C, .3), ink: null }); }
  }
  window.person = function (x, y, u, S, o = {}) {
    boilSeed('person' + (o.key || S.name));
    const m0 = MOOD[o.mood || 'neutral'] || MOOD.neutral, tk = o.talk, sp = tk && typeof tk === 'object' ? tk : null;
    const m = sp ? (sp.on ? { ...m0, mouth: 'speak', sp, eye: m0.eye === 'smile' ? 'open' : m0.eye } : m0) : (tk || 0) > .3 ? { ...m0, mouth: tk > .6 ? 'open' : 'o', eye: m0.eye === 'smile' ? 'open' : m0.eye } : m0;
    const sw = clamp(u / 15, .5, 2.4), dy = (o.dy || 0) * u, bob = Math.sin(T * 2.2 + x * .01) * u * .06;
    push(); translate(x, y + dy); rotate(o.lean || 0);
    const TW = (S.w || 5) * u, legH = (S.leg || 3.4) * u, torsoH = (S.torso || 6.2) * u, top = -legH - torsoH + bob;
    const sh = S.sh ?? .38, flare = S.flare ?? .12, hemOff = S.robe ? legH * .85 : 0, bot = -legH + hemOff + u * .45;
    const shW = TW * sh, hemW = TW * (.5 + flare), waistW = Math.min(shW, hemW) * .94;
    // ground shadow
    paint(ellPts(0, 0, Math.max(TW * .6, hemW * 1.1), u * .5, 18), { wash: '#1B1222', washOp: 45, ink: null });
    // afro / back hair
    const hw = (S.hw || 2.3) * u, hh = (S.hh || 2.7) * u, hy = top - hh * .95 - u * .3;
    hair(S, hy, hw, hh, sw, false);
    // far arm
    const shY = top + u * 1.15, shX = shW * .92;
    const aL = o.aL ?? -1.3, aR = o.aR ?? -1.3, L = (S.arm || 5.6) * u, aw = u * 1.0;
    const angR = Math.PI / 2 - (aR + 1.57) * .95, angL = Math.PI / 2 + (aL + 1.57) * .95;
    const handR = arm(shX, shY, angR, L, aw, S, sw, -1);
    if (o.holdR) o.holdR(handR[0], handR[1], u, sw);
    // legs + shoes
    if (!S.robe || hemOff < legH) for (const s of [-1, 1]) {
      const lx = s * TW * .2;
      paint([[lx - u * .62, -legH], [lx + u * .62, -legH], [lx + u * .52, -u * .4], [lx - u * .52, -u * .4]], { wash: S.pants, ink: PAL.ink, sw });
      paint([[lx + u * .1, -legH], [lx + u * .62, -legH], [lx + u * .52, -u * .4], [lx + u * .15, -u * .4]], { wash: dark(S.pants, .2), ink: null });
      inkLine([[lx, -legH + u * .3], [lx, -u * .6]], sw * .35, dark(S.pants, .4), 'inkfine');
      const sx0 = s > 0 ? lx - u * .62 : lx - u * 1.05; paint(rrPts(sx0, -u * .62, u * 1.67, u * .66, u * .32), { wash: S.shoes, ink: PAL.ink, sw });
      paint(ellPts(lx + s * u * .35, -u * .45, u * .25, u * .08, 8, 0, -.3), { wash: '#FFFFFF', washOp: 120, ink: null });
    }
    // torso: base, shadow side, highlight, outline
    const T0 = through([[0, top - u * .1], [shW * .65, top + u * .05], [shW, top + u * .75], [shW * .98, top + u * 2.3], [waistW, top + torsoH * .6], [hemW, bot], [0, bot + u * .15], [-hemW, bot], [-waistW, top + torsoH * .6], [-shW * .98, top + u * 2.3], [-shW, top + u * .75], [-shW * .65, top + u * .05]]);
    paint(closed(T0), { wash: S.coat, ink: null });
    if (S.stripes) { const n = S.stripes.length; for (let i = 0; i < n; i++) { const a0 = i / n, a1 = (i + 1) / n, xa = (a, w) => -w + 2 * w * a; paint([[xa(a0, shW * .95), top + u * .4], [xa(a1, shW * .95), top + u * .4], [xa(a1, hemW * .97), bot - u * .05], [xa(a0, hemW * .97), bot - u * .05]], { wash: S.stripes[i], ink: null }); } for (let i = 1; i < n; i++) inkLine([[-shW * .95 + 2 * shW * .95 * i / n, top + u * .5], [-hemW * .97 + 2 * hemW * .97 * i / n, bot - u * .1]], sw * .35, '#3A2A2A', 'inkfine'); for (let j = 0; j < 3; j++) inkLine([[-waistW * .9, top + torsoH * (.3 + j * .22)], [waistW * .9, top + torsoH * (.32 + j * .22)]], sw * .3, '#F6EEDD', 'inkfine'); }
    paint([[shW * .35, top + u * .3], [shW * .98, top + u * .9], [shW * .98, top + u * 2.3], [waistW, top + torsoH * .6], [hemW * .98, bot - u * .02], [hemW * .4, bot + u * .1], [waistW * .45, top + torsoH * .55]], { wash: '#1B1222', washOp: 60, ink: null });
    paint([[-shW * .8, top + u * .6], [-shW * .55, top + u * .5], [-waistW * .6, top + torsoH * .55], [-hemW * .7, bot - u * .1], [-hemW * .9, bot - u * .1], [-waistW * .9, top + torsoH * .55]], { wash: '#FFF6E6', washOp: 40, ink: null });
    if (S.robe) for (let i = 0; i < 4; i++) { const xx = -hemW * .6 + i * hemW * .4; inkLine([[xx * .5, top + torsoH * .65], [xx, bot - u * .2]], sw * .4, dark(S.coat, .3), 'inkfine', .3); }
    inkLine(closed(T0), sw * 1.15);
    // collar/shirt/lapels/tie/scarf/sash/buttons
    if (S.lapel && !S.suitV) paint([[-u * .9, top + u * .05], [0, top + u * 2.2], [u * .9, top + u * .05]], { wash: S.lapel, ink: PAL.ink, sw: sw * .8 });
    if (S.suitV) { paint([[-u * 1.0, top + u * .0], [0, top + u * 3.0], [u * 1.0, top + u * .0]], { wash: S.lapel, ink: PAL.ink, sw: sw * .8 }); for (const s of [-1, 1]) { paint([[s * u * 1.0, top - u * .05], [s * u * .15, top + u * 3.1], [s * u * .85, top + u * 2.0], [s * u * 1.65, top + u * 1.2], [s * u * 1.25, top + u * .9]], { wash: S.suitV, ink: PAL.ink, sw: sw * .85 }); inkLine([[s * u * .9, top + u * .3], [s * u * .3, top + u * 2.6]], sw * .3, lite(S.suitV, .25), 'inkfine'); } paint(ellPts(-u * .0, top + u * 4.1, u * .2, u * .2, 8), { wash: dark(S.coat, .3), ink: PAL.ink, sw: sw * .4 }); paint(ellPts(0, top + u * 5.0, u * .2, u * .2, 8), { wash: dark(S.coat, .3), ink: PAL.ink, sw: sw * .4 }); paint([[shW * .35, top + u * 2.1], [shW * .8, top + u * 2.0], [shW * .8, top + u * 2.2], [shW * .35, top + u * 2.3]], { wash: '#F6F1E6', ink: PAL.ink, sw: sw * .4 }); }
    if (S.vest) { paint([[-shW * .62, top + u * .4], [shW * .62, top + u * .4], [waistW * .8, top + torsoH * .62], [-waistW * .8, top + torsoH * .62]], { wash: S.vest, ink: PAL.ink, sw: sw * .7 }); for (let j = 0; j < 3; j++) paint(ellPts(0, top + u * (2.4 + j * .8), u * .14, u * .14, 6), { wash: dark(S.vest, .3), ink: null }); }
    if (S.tie) { paint([[0, top + u * .5], [u * .4, top + u * 1.1], [0, top + u * 3.3], [-u * .4, top + u * 1.1]], { wash: S.tie, ink: PAL.ink, sw: sw * .7 }); paint(rrPts(-u * .32, top + u * .25, u * .64, u * .5, u * .15), { wash: dark(S.tie, .15), ink: PAL.ink, sw: sw * .6 }); if (S.tieStripe) for (let j = 0; j < 4; j++) inkLine([[-u * .3, top + u * (1.15 + j * .5)], [u * .3, top + u * (.9 + j * .5)]], sw * .45, S.tieStripe, 'inkfine'); }
    if (S.scarf) { paint(ribbon([[-u * 1.3, top + u * .3], [0, top + u * .95], [u * 1.3, top + u * .3]], u * .9, u * .9), { wash: S.scarf, ink: PAL.ink, sw: sw * .8 }); paint(ribbon([[u * .9, top + u * .6], [u * 1.05, top + u * 2.4], [u * .95, top + u * 3.4]], u * .75, u * .65), { wash: dark(S.scarf, .1), ink: PAL.ink, sw: sw * .8 }); for (let j = 0; j < 4; j++) inkLine([[u * (.7 + j * .12), top + u * 3.4], [u * (.7 + j * .12), top + u * 3.75]], sw * .4, S.scarf, 'inkfine'); }
    if (S.sash) { paint([[-waistW * 1.02, top + torsoH * .52], [waistW * 1.02, top + torsoH * .45], [waistW * 1.03, top + torsoH * .6], [-waistW * 1.03, top + torsoH * .68]], { wash: S.sash, ink: PAL.ink, sw: sw * .8 }); paint(ribbon([[waistW * .3, top + torsoH * .58], [waistW * .4, top + torsoH * .8]], u * .45, u * .3), { wash: dark(S.sash, .1), ink: PAL.ink, sw: sw * .6 }); }
    if (S.trim) { inkLine([[0, top + u * .3], [0, bot - u * .1]], sw * 1.6, S.trim); inkLine([[-hemW * .97, bot - u * .25], [hemW * .97, bot - u * .25]], sw * 1.4, S.trim); }
    if (S.buttons) for (let j = 0; j < S.buttons; j++) paint(ellPts(u * .25, top + u * (2.6 + j * 1.2), u * .18, u * .18, 8), { wash: dark(S.coat, .35), ink: PAL.ink, sw: sw * .35 });
    if (S.lapel && !S.suitV && S.tie) {}
    // neck
    paint(rrPts(-u * .55, top - u * 1.0, u * 1.1, u * 1.3, u * .3), { wash: S.skin, ink: PAL.ink, sw: sw * .8 });
    paint(rrPts(-u * .55, top - u * .55, u * 1.1, u * .5, u * .2), { wash: dark(S.skin, .22), ink: null });
    // head
    const jaw = S.jaw ?? .62;
    const HP = through([[0, hy - hh], [hw * .78, hy - hh * .9], [hw, hy - hh * .3], [hw * .97, hy + hh * .3], [hw * jaw * 1.05, hy + hh * .82], [0, hy + hh], [-hw * jaw * 1.05, hy + hh * .82], [-hw * .97, hy + hh * .3], [-hw, hy - hh * .3], [-hw * .78, hy - hh * .9]]);
    for (const s of [-1, 1]) { paint(ellPts(s * hw * 1.0, hy + hh * .05, hw * .17, hh * .22, 12), { wash: S.skin, ink: PAL.ink, sw: sw * .75 }); inkLine([[s * hw * 1.02, hy - hh * .05], [s * hw * 1.06, hy + hh * .12]], sw * .35, dark(S.skin, .4), 'inkfine'); }
    paint(closed(HP), { wash: S.skin, ink: null });
    paint(closed(through([[hw * .55, hy - hh * .85], [hw, hy - hh * .3], [hw * .97, hy + hh * .3], [hw * jaw * 1.05, hy + hh * .82], [hw * .2, hy + hh * .98], [hw * .55, hy + hh * .55], [hw * .7, hy]])), { wash: dark(S.skin, .14), ink: null });
    paint(ellPts(-hw * .45, hy - hh * .6, hw * .2, hh * .08, 12, 0, -.3), { wash: '#FFFFFF', washOp: 22, ink: null });
    inkLine(closed(HP), sw * 1.1);
    const er = hw * .24, ey = hy - hh * .02;
    beard(S, hy, hw, hh, sw);
    for (const s of [-1, 1]) paint(ellPts(s * hw * .6, hy + hh * .32, hw * .2, hh * .09, 10), { wash: S.blush || '#E0786A', washOp: S.blushOp ?? 55, ink: null });
    brows(0, ey, er, S, m, sw);
    eyes(0, ey, er, S, o, m, sw);
    if (S.glasses) for (const s of [-1, 1]) { const G = ellPts(s * er * 1.85, ey, er * 1.45, er * 1.35, 20); inkLine(closed(G), sw * .55, '#3A3036', 'inkfine'); inkLine([[s * er * 1.85 - er * .7, ey - er * .9], [s * er * 1.85 - er * .2, ey - er * 1.1]], sw * .4, '#FFFFFF', 'inkfine'); }
    if (S.glasses) inkLine([[-er * .45, ey - er * .2], [er * .45, ey - er * .2]], sw * .55, '#3A3036', 'inkfine');
    // nose
    inkLine([[hw * .04, hy + hh * .05], [hw * .14, hy + hh * .26], [hw * .02, hy + hh * .3]], sw * .6, dark(S.skin, .45), 'inkfine', .5);
    paint(ellPts(-hw * .08, hy + hh * .29, hw * .05, hh * .025, 6), { wash: dark(S.skin, .35), ink: null });
    if (!S.beard || S.beard < .3) mouth(0, hy + hh * .5, hw, hh, S, m, sw);
    else mouth(0, hy + hh * .52, hw, hh, S, m, sw);
    hair(S, hy, hw, hh, sw, true);
    hat(S, hy, hw, hh, sw);
    // near arm + prop
    const handL = arm(-shX, shY, angL, L, aw, S, sw, 1);
    if (o.hold) o.hold(handL[0], handL[1], u, sw);
    pop();
  };
  // finished cast tweaks
  Object.assign(CAST.neville, { buttons: 3, iris: '#3D5A7A', jaw: .58, blushOp: 40 });
  Object.assign(CAST.abdullah, { iris: '#3B2414', blush: '#9A4A36', blushOp: 50, jaw: .7, brow: '#E8E4DA' });
  Object.assign(CAST.dreamer, { iris: '#5A3A1E', jaw: .7, sleeve: '#3F8F8A', cuff: '#E6B82A' });
  Object.assign(CAST.paul, { iris: '#4A5A3A', brow: '#B9B4AA', jaw: .65 });
  Object.assign(CAST.blake, { iris: '#4E7A5A', buttons: 3, jaw: .72, blushOp: 75 });
  Object.assign(CAST.skeptic, { iris: '#6B5A3A', vest: '#8E8F96', coat: '#5C6170', sleeve: '#5C6170', lapel: '#E9E4D8', jaw: .5, blushOp: 25 });
  Object.assign(CAST.emery, { iris: '#2E1A10', blush: '#8E3E2C', blushOp: 45, jaw: .6, cuff: '#F6F1E6' });
  // showcase loops
  const card = (col) => { paint(rectPts(-100, -100, W + 200, H + 200), { wash: col, ink: null }); paint(ellPts(540, 1750, 640, 110, 30), { wash: mixCol(col, '#000000', .1), ink: null }); };
  LOOPS.cast2 = t => { window.CHEAP = true; card('#EADFCB');
    const row = (y, uu, list) => list.forEach(([k, x, o]) => person(x, y, uu, CAST[k], { key: k, ...o }));
    row(1000, 22, [['neville', 150, { mood: 'happy', aR: -.3 }], ['abdullah', 410, { mood: 'wise' }], ['emery', 680, { mood: 'beam', aL: .2 }], ['dreamer', 945, { mood: 'joy', aL: .6, aR: .6 }]]);
    row(1760, 25, [['paul', 190, { mood: 'happy', aL: -.5, hold: PROPS.scroll }], ['blake', 540, { mood: 'surprised', aL: -.3, hold: PROPS.quill }], ['skeptic', 890, { mood: 'skeptical', look: -.8 }]]);
  }; LOOPS.cast2.len = 2;
  LOOPS.hero = t => { window.CHEAP = true; card('#C9CED8'); person(300, 1640, 46, CAST.emery, { mood: 'beam', key: 'h1' }); person(800, 1640, 46, CAST.emery, { mood: 'warm', key: 'h2', aL: .25, look: .4 }); }; LOOPS.hero.len = 2;
  LOOPS.heads = t => { window.CHEAP = true; card('#E3D7C3'); const L = [['neville', 'happy'], ['abdullah', 'wise'], ['dreamer', 'awe'], ['paul', 'joy'], ['blake', 'surprised'], ['skeptic', 'skeptical']];
    L.forEach(([k, md], i) => { const x = 200 + (i % 3) * 340, y = 900 + Math.floor(i / 3) * 900; person(x, y, 38, CAST[k], { mood: md, key: 'hd' + i }); }); }; LOOPS.heads.len = 2;
})();

// flannelgraph mode: every figure is a paper cutout pressed onto felt (white cut margin + soft shadow)
(function () {
  const P0 = window.person;
  const phase = k => { let h = 7; for (const c of String(k || 'p')) h = (h * 31 + c.charCodeAt(0)) % 997; return h / 997 * 6.283; };
  window.person = function (x, y, u, S, o = {}) {
    if (window.FELT && o.in != null && !o.still) {   // pressed onto the board: drop in with a little bounce
      const tt = typeof T !== 'undefined' ? T : 0; if (tt < o.in) return;
      const k = clamp((tt - o.in) / .42); y -= (1 - ease(k)) * 220; u *= k < 1 ? 1 + .07 * (1 - backOut(k)) : 1;
      if (window.CUELOG && o.snd !== false) CUELOG[(o.key || S.name) + '@' + o.in.toFixed(2)] = { t: o.in + .36, type: 'pat', x, size: u * 12 };
    }
    if (window.FELT && o.out != null && !o.still) { const tt = typeof T !== 'undefined' ? T : 0, q = clamp((tt - o.out) / .32); if (q >= 1) return; y -= q * q * 260; if (window.CUELOG && o.snd !== false) CUELOG[(o.key || S.name) + '^' + o.out.toFixed(2)] = { t: o.out, type: 'peel', x, size: u * 12 }; }
    if (window.CUEMODE) return;
    if (window.FELT && !o.still) {   // cutout puppet motion: sway from the feet, each figure on its own rhythm
      const ph = phase(String(o.key || S.name).replace(/(sh|cut)$/, '')), tt = typeof T !== 'undefined' ? T : 0;
      o = { ...o, lean: (o.lean || 0) + .035 * Math.sin(tt * 1.9 + ph) + .012 * Math.sin(tt * 4.3 + ph * 2), still: true };
    }
    if (window.FELT && !o.noCut && !window.SIL) {
      window.SIL = { c: '#3A2A22', grow: u * .22 }; push(); translate(u * .16, u * .2); P0(x, y, u, S, { ...o, key: (o.key || '') + 'sh' }); pop();
      window.SIL = { c: '#F6F0E2', grow: u * .2 }; P0(x, y, u, S, { ...o, key: (o.key || '') + 'cut' });
      window.SIL = null;
    }
    return P0(x, y, u, S, o);
  };
})();
