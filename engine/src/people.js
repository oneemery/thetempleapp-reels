// people.js: painted human characters for the series. person(x, y, u, spec, o)
//   (x, y) = ground point between the feet; u = size unit (character is about 15u tall).
//   spec = a CAST entry (body shape, palette, outfit, hair, hat); o = pose/face: { mood, look, aL, aR, dy, lean, blink, hold }
(() => {
  const SK = { fair: '#EFCBA6', peach: '#E6B48C', tan: '#C98E62', brown: '#9A6240', deep: '#6A4029', ebony: '#4E2E1E' };
  // face parts by mood: brows (inner, outer heights), eyes, mouth
  const MOOD = {
    neutral:   { bi: 0, bo: 0, eye: 'open', mouth: 'flat' },
    happy:     { bi: .1, bo: -.05, eye: 'smile', mouth: 'smile' },
    joy:       { bi: .2, bo: .1, eye: 'smile', mouth: 'grin' },
    sad:       { bi: .35, bo: -.25, eye: 'open', mouth: 'frown' },
    surprised: { bi: .45, bo: .45, eye: 'wide', mouth: 'o' },
    worried:   { bi: .4, bo: -.1, eye: 'open', mouth: 'wobble' },
    determined:{ bi: -.3, bo: .15, eye: 'narrow', mouth: 'flat' },
    wise:      { bi: .05, bo: 0, eye: 'lid', mouth: 'smile' },
    sleepy:    { bi: 0, bo: -.1, eye: 'closed', mouth: 'smile' },
    awe:       { bi: .4, bo: .3, eye: 'wide', mouth: 'open' },
    beam:      { bi: .12, bo: 0, eye: 'smile', mouth: 'teeth' },
    warm:      { bi: .08, bo: 0, eye: 'open', mouth: 'teeth' },
  };
  function face(cx, cy, hw, hh, sk, o, sw) {
    const m = MOOD[o.mood || 'neutral'], lx = (o.look || 0) * hw * .12, ly = (o.lookY || 0) * hh * .08;
    const ex = hw * .42, ey = cy - hh * .05, er = hw * .215;
    for (const s of [-1, 1]) {
      const x = cx + s * ex;
      // brows
      const yb = ey - er * 1.9;
      inkLine([[x - s * er * 1.1, yb - m.bi * er * 2], [x + s * er * 1.1, yb - m.bo * er * 2]], sw * 1.1, PAL.ink, 'ink');
      // eyes
      if (m.eye === 'closed' || o.blink) inkLine([[x - er, ey], [x, ey + er * .45], [x + er, ey]], sw * .9, PAL.ink, 'ink', .5);
      else if (m.eye === 'smile') inkLine([[x - er, ey + er * .3], [x, ey - er * .5], [x + er, ey + er * .3]], sw * .9, PAL.ink, 'ink', .5);
      else {
        const ry = m.eye === 'wide' ? er * 1.15 : m.eye === 'narrow' ? er * .5 : er * .85, rx = m.eye === 'wide' ? er * 1 : er * .85;
        paint(ellPts(x, ey, rx, ry, 14), { wash: '#FBF6EA', ink: PAL.ink, sw: sw * .6 });
        paint(ellPts(x + lx, ey + ly, rx * .5, Math.min(ry, rx) * .55, 10), { wash: '#2A2230', ink: null });
        paint(ellPts(x + lx - rx * .15, ey + ly - ry * .2, rx * .14, rx * .14, 6), { wash: '#FFFFFF', ink: null });
        if (m.eye === 'lid') paint([[x - rx * 1.1, ey - ry * 1.2], [x + rx * 1.1, ey - ry * 1.2], [x + rx * 1.1, ey - ry * .05], [x - rx * 1.1, ey - ry * .05]], { wash: sk, ink: null }), inkLine([[x - rx, ey - ry * .05], [x + rx, ey - ry * .05]], sw * .8);
      }
    }
    // nose
    inkLine([[cx + hw * .02, cy + hh * .02], [cx + hw * .1, cy + hh * .2], [cx - hw * .04, cy + hh * .24]], sw * .7, mixCol(sk, PAL.ink, .55), 'inkfine', .5);
    // mouth
    const my = cy + hh * .45, mw = hw * .32;
    const M = {
      flat: [[cx - mw, my], [cx + mw, my]],
      smile: [[cx - mw, my - hh * .03], [cx, my + hh * .07], [cx + mw, my - hh * .03]],
      grin: null, frown: [[cx - mw, my + hh * .05], [cx, my - hh * .04], [cx + mw, my + hh * .05]],
      wobble: [[cx - mw, my], [cx - mw * .4, my - hh * .03], [cx + mw * .2, my + hh * .02], [cx + mw, my - hh * .01]],
    };
    if (m.mouth === 'grin') paint(through([[cx - mw * 1.1, my - hh * .04], [cx, my + hh * .16], [cx + mw * 1.1, my - hh * .04]]).concat([[cx - mw * 1.1, my - hh * .04]]), { wash: '#7A2E2E', ink: PAL.ink, sw: sw * .7 });
    else if (m.mouth === 'teeth') { paint(through([[cx - mw * 1.25, my - hh * .06], [cx, my + hh * .2], [cx + mw * 1.25, my - hh * .06]]).concat([[cx - mw * 1.25, my - hh * .06]]), { wash: '#FBF8F0', ink: PAL.ink, sw: sw * .8 }); inkLine([[cx - mw * 1.1, my - hh * .02], [cx + mw * 1.1, my - hh * .02]], sw * .35, '#B9B0A0', 'inkfine'); }
    else if (m.mouth === 'o' || m.mouth === 'open') paint(ellPts(cx, my + hh * .03, mw * (m.mouth === 'o' ? .4 : .55), hh * (m.mouth === 'o' ? .09 : .12), 12), { wash: '#6B2A2A', ink: PAL.ink, sw: sw * .6 });
    else inkLine(M[m.mouth], sw * .9, PAL.ink, 'ink', .5);
  }
  function arm(sx, sy, ang, len, w, col, sk, sw) {
    const ex = sx + Math.cos(ang) * len * .52, ey = sy + Math.sin(ang) * len * .52;
    const hx = sx + Math.cos(ang + .15) * len, hy = sy + Math.sin(ang + .15) * len;
    paint(ribbon([[sx, sy], [ex, ey], [hx, hy]], w, w * .75), { wash: col, ink: PAL.ink, sw });
    paint(ellPts(hx, hy, w * .5, w * .5, 10), { wash: sk, ink: PAL.ink, sw: sw * .8 });
    return [hx, hy];
  }
  window.person = function (x, y, u, S, o = {}) {
    boilSeed('person' + (o.key || S.name));
    const sw = clamp(u / 16, .5, 2.2), dy = (o.dy || 0) * u, lean = o.lean || 0;
    push(); translate(x, y + dy); rotate(lean);
    const H = S.h || 15, TW = (S.w || 5) * u, legH = (S.leg || 3.4) * u, torsoH = (S.torso || 6.2) * u, top = -legH - torsoH;
    // shadow
    paint(ellPts(0, 0, TW * .7, u * .5, 16), { wash: '#000000', washOp: 40, ink: null });
    // legs and shoes
    for (const s of [-1, 1]) {
      paint(rrPts(s * TW * .22 - u * .55, -legH - u * .2, u * 1.1, legH, u * .3), { wash: S.pants, ink: PAL.ink, sw });
      paint(ellPts(s * TW * .22 + s * u * .3, -u * .25, u * 1.0, u * .45, 12), { wash: S.shoes, ink: PAL.ink, sw });
    }
    // far arm (behind)
    const shY = top + u * 1.1, shX = TW * ((S.sh ?? .38) + .04);
    const aL = o.aL ?? -1.25, aR = o.aR ?? -1.25;   // angle from horizontal-down: -1.57 = straight down
    const angR = Math.PI / 2 - (aR + 1.57) * .95, angL = Math.PI / 2 + (aL + 1.57) * .95;
    const handR = arm(shX, shY, angR, S.arm * u || 5.6 * u, u * .95, S.sleeve || S.coat, S.skin, sw);
    // torso: a coat / robe / hoodie silhouette
    const flare = S.flare ?? .12, hem = S.robe ? legH * .85 : 0;
    const sh = S.sh ?? .38; const P = [[-TW * sh, top + u * .2], [TW * sh, top + u * .2], [TW * (.5 + flare), -legH + hem + u * .4], [-TW * (.5 + flare), -legH + hem + u * .4]];
    paint(through([P[0], [0, top - u * .15], P[1], [TW * .48, top + torsoH * .45], P[2], [0, -legH + hem + u * .6], P[3], [-TW * .48, top + torsoH * .45], P[0]]), { wash: S.coat, ink: PAL.ink, sw, curv: .4 });
    if (S.stripes) { const n = S.stripes.length, y0 = top + u * .6, y1 = -legH + hem + u * .1; for (let i = 0; i < n; i++) { const a0 = i / n, a1 = (i + 1) / n, wt = TW * sh * .92, wb = TW * (.5 + flare) * .9; const xa = (a, w) => -w + 2 * w * a; paint([[xa(a0, wt), y0], [xa(a1, wt), y0], [xa(a1, wb), y1], [xa(a0, wb), y1]], { wash: S.stripes[i], ink: null }); } inkLine([[-TW * sh * .9, y0 + torsoH * .45], [TW * sh * .9, y0 + torsoH * .42]], sw * .5, PAL.ink, 'inkfine'); }
    if (S.trim) inkLine([[0, top + u * .3], [0, -legH + hem + u * .5]], sw * 1.6, S.trim);
    if (S.lapel) { paint([[-u * .9, top + u * .1], [0, top + u * 2.2], [u * .9, top + u * .1]], { wash: S.lapel, ink: PAL.ink, sw: sw * .8 }); }
    if (S.scarf) paint(ribbon([[-u * 1.2, top + u * .4], [0, top + u * .9], [u * 1.2, top + u * .4], [u * .9, top + u * 3.2]], u * .8, u * .6), { wash: S.scarf, ink: PAL.ink, sw: sw * .8 });
    if (S.hood) paint(through([[-u * 2.1, top + u * .3], [0, top + u * 1.4], [u * 2.1, top + u * .3], [0, top - u * .4], [-u * 2.1, top + u * .3]]), { wash: mixCol(S.coat, PAL.ink, .2), ink: PAL.ink, sw: sw * .8, curv: .4 });
    if (S.sash) paint([[-TW * .45, top + torsoH * .55], [TW * .45, top + torsoH * .45], [TW * .46, top + torsoH * .6], [-TW * .46, top + torsoH * .7]], { wash: S.sash, ink: PAL.ink, sw: sw * .8 });
    // head
    const hw = (S.hw || 2.3) * u, hh = (S.hh || 2.7) * u, hy = top - hh * .95 + Math.sin(T * 2.2 + x) * u * .05;
    paint(rrPts(-u * .45, top - u * .9, u * .9, u * 1.2, u * .3), { wash: S.skin, ink: PAL.ink, sw: sw * .8 });
    if (S.afro) { const ax = 0, ay = hy - hh * .85, rx = hw * 1.62, ry = hh * 1.25; const B = []; for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, k = 1 + .07 * Math.sin(i * 2.7) ; B.push([ax + Math.cos(a) * rx * k, ay + Math.sin(a) * ry * k * (Math.sin(a) > 0 ? .8 : 1)]); } paint(B, { wash: S.hair, ink: PAL.ink, sw, curv: .3 }); for (let i = 0; i < 16; i++) { const a = Math.PI * 1.02 + i / 15 * Math.PI * .96; paint(ellPts(ax + Math.cos(a) * rx * .97, ay + Math.sin(a) * ry * .97, hw * .26, hw * .24, 8), { wash: S.hair, ink: PAL.ink, sw: sw * .6 }); } }
    if (S.hairBack) paint(ellPts(0, hy - hh * .1, hw * 1.12, hh * 1.05, 18), { wash: S.hair, ink: PAL.ink, sw });
    paint(rrPts(-hw, hy - hh, hw * 2, hh * 2, Math.min(hw, hh) * (S.round ?? .9)), { wash: S.skin, ink: PAL.ink, sw });
    for (const s of [-1, 1]) paint(ellPts(s * hw * 1.02, hy + hh * .05, hw * .14, hh * .2, 10), { wash: S.skin, ink: PAL.ink, sw: sw * .7 });
    if (S.beard) paint(through([[-hw * .95, hy + hh * .05], [-hw * .7, hy + hh * 1.2], [0, hy + hh * (1.25 + S.beard)], [hw * .7, hy + hh * 1.2], [hw * .95, hy + hh * .05], [hw * .3, hy + hh * .62], [-hw * .3, hy + hh * .62]]).concat([[-hw * .95, hy + hh * .05]]), { wash: S.beardCol || S.hair, ink: PAL.ink, sw: sw * .8 });
    face(0, hy, hw, hh, S.skin, o, sw);
    // hair on top
    if (S.afro) paint(through([[-hw * 1.02, hy - hh * .25], [-hw * .85, hy - hh * .95], [0, hy - hh * 1.08], [hw * .85, hy - hh * .95], [hw * 1.02, hy - hh * .25], [hw * .6, hy - hh * .62], [0, hy - hh * .7], [-hw * .6, hy - hh * .62]]).concat([[-hw * 1.02, hy - hh * .25]]), { wash: S.hair, ink: PAL.ink, sw: sw * .7 });
    if (S.hairStyle === 'curls') for (let i = 0; i < 9; i++) { const a = Math.PI + i / 8 * Math.PI; paint(ellPts(Math.cos(a) * hw * .92, hy - hh * .55 + Math.sin(a) * hh * .55, hw * .32, hw * .3, 10), { wash: S.hair, ink: PAL.ink, sw: sw * .6 }); }
    if (S.hairStyle === 'wild') for (let i = 0; i < 7; i++) { const a = Math.PI * 1.05 + i / 6 * Math.PI * .9; paint(ribbon([[Math.cos(a) * hw * .7, hy - hh * .5 + Math.sin(a) * hh * .5], [Math.cos(a) * hw * 1.25, hy - hh * .45 + Math.sin(a) * hh * .95]], hw * .35, hw * .08), { wash: S.hair, ink: PAL.ink, sw: sw * .6 }); }
    if (S.hairStyle === 'neat') paint(through([[-hw * 1.02, hy - hh * .1], [-hw * .9, hy - hh * .95], [0, hy - hh * 1.12], [hw * .9, hy - hh * .95], [hw * 1.02, hy - hh * .1], [hw * .6, hy - hh * .62], [-hw * .3, hy - hh * .7]]).concat([[-hw * 1.02, hy - hh * .1]]), { wash: S.hair, ink: PAL.ink, sw: sw * .8 });
    if (S.hairStyle === 'bald') { inkLine([[-hw * .4, hy - hh * .7], [-hw * .1, hy - hh * .78]], sw * .5, mixCol(S.skin, '#FFFFFF', .5)); paint(ellPts(-hw * .98, hy - hh * .05, hw * .18, hh * .35, 10), { wash: S.hair, ink: null }); paint(ellPts(hw * .98, hy - hh * .05, hw * .18, hh * .35, 10), { wash: S.hair, ink: null }); }
    // hats
    if (S.hat === 'fedora') { paint(ellPts(0, hy - hh * .78, hw * 1.55, hh * .18, 18), { wash: S.hatCol, ink: PAL.ink, sw }); paint(through([[-hw * .95, hy - hh * .8], [-hw * .85, hy - hh * 1.5], [0, hy - hh * 1.42], [hw * .85, hy - hh * 1.5], [hw * .95, hy - hh * .8]]).concat([[-hw * .95, hy - hh * .8]]), { wash: S.hatCol, ink: PAL.ink, sw }); paint(rectPts(-hw * .93, hy - hh * 1.0, hw * 1.86, hh * .16), { wash: S.band, ink: null }); }
    if (S.hat === 'cap') paint(through([[-hw * .98, hy - hh * .55], [-hw * .9, hy - hh * 1.15], [0, hy - hh * 1.3], [hw * .9, hy - hh * 1.15], [hw * .98, hy - hh * .55]]).concat([[-hw * .98, hy - hh * .55]]), { wash: S.hatCol, ink: PAL.ink, sw });
    if (S.hat === 'cap' && S.band) paint(rectPts(-hw * .97, hy - hh * .72, hw * 1.94, hh * .14), { wash: S.band, ink: null });
    if (S.glasses) for (const sx of [-1, 1]) { const G = ellPts(sx * hw * .42, hy - hh * .05, hw * .36, hw * .32, 18); inkLine(G.concat([G[0]]), sw * .45, PAL.ink, 'inkfine'); }
    if (S.glasses) inkLine([[-hw * .14, hy - hh * .08], [hw * .14, hy - hh * .08]], sw * .8);
    if (S.hat === 'flatcap') { paint(through([[-hw * 1.02, hy - hh * .5], [-hw * .8, hy - hh * 1.1], [hw * .5, hy - hh * 1.18], [hw * 1.05, hy - hh * .8], [hw * 1.5, hy - hh * .6], [hw * 1.02, hy - hh * .5]]).concat([[-hw * 1.02, hy - hh * .5]]), { wash: S.hatCol, ink: PAL.ink, sw }); }
    if (S.tie) { paint([[0, top + u * .5], [u * .45, top + u * 1.2], [0, top + u * 3.4], [-u * .45, top + u * 1.2]], { wash: S.tie, ink: PAL.ink, sw: sw * .7 }); if (S.tieStripe) for (let j = 0; j < 4; j++) inkLine([[-u * .35, top + u * (1.1 + j * .55)], [u * .35, top + u * (.8 + j * .55)]], sw * .5, S.tieStripe, 'inkfine'); }
    if (S.suitV) for (const sx of [-1, 1]) paint([[sx * u * .95, top + u * .05], [sx * u * .2, top + u * 3.2], [sx * u * 1.6, top + u * 1.4]], { wash: S.suitV, ink: PAL.ink, sw: sw * .8 });
    // near arm (in front) + held prop
    const handL = arm(-shX, shY, angL, S.arm * u || 5.6 * u, u * .95, S.sleeve || S.coat, S.skin, sw);
    if (o.hold) o.hold(handL[0], handL[1], u, sw);
    pop();
  };
  window.CAST = {
    neville: { name: 'neville', sh: .4, w: 4.8, torso: 9.2, leg: 5.9, coat: '#3A3F4F', sleeve: '#3A3F4F', lapel: '#2C3040', scarf: '#5D7DB8', pants: '#2A2D38', shoes: '#1E1C22',
      skin: SK.fair, hw: 2.15, hh: 2.75, round: .8, hair: '#3B2A22', hairStyle: 'neat', hat: 'fedora', hatCol: '#2B2A33', band: '#8C3B3B', flare: .0, arm: 5.9 },
    abdullah: { name: 'abdullah', sh: .44, w: 6.6, torso: 7.0, leg: 3.6, robe: true, coat: '#E9DFC8', sleeve: '#E9DFC8', trim: '#C9963A', sash: '#7A4E8A', pants: '#E9DFC8', shoes: '#5A3A24',
      skin: SK.deep, hw: 2.4, hh: 2.75, round: .85, hair: '#E8E4DA', beard: .35, beardCol: '#ECE8DF', hairStyle: 'none', hat: 'cap', hatCol: '#3B2E5A', band: '#C9963A', flare: .3, arm: 6.0 },
    dreamer: { name: 'dreamer', sh: .5, w: 5.0, torso: 5.6, leg: 3.0, coat: '#D9714E', sleeve: '#3F8F8A', stripes: ['#D2453A', '#E6B82A', '#3F8F8A', '#7A4E8A', '#E07A4F', '#2F9E5B', '#3F6FB0'], pants: '#3E4A6B', shoes: '#F3EBDC',
      skin: SK.tan, hw: 2.8, hh: 2.8, round: 1, hair: '#2B1E19', hairStyle: 'curls', flare: -.02, arm: 5.0 },
    paul: { name: 'paul', sh: .36, w: 5.0, torso: 6.3, leg: 3.2, robe: true, coat: '#A9784A', sleeve: '#A9784A', sash: '#5E6B3A', pants: '#A9784A', shoes: '#4A3424',
      skin: SK.peach, hw: 2.3, hh: 2.8, round: .9, hair: '#9A958C', beard: .5, beardCol: '#B9B4AA', hairStyle: 'bald', flare: .16, arm: 5.7 },
    blake: { name: 'blake', sh: .52, w: 6.4, torso: 5.4, leg: 3.0, coat: '#4F6B4A', sleeve: '#4F6B4A', lapel: '#F3EBDC', pants: '#5A4636', shoes: '#2A1E18',
      skin: '#E8B08E', hw: 2.45, hh: 2.6, round: .95, hair: '#B5643A', hairStyle: 'curls', flare: .1, arm: 5.6 },
    emery: { name: 'emery', sh: .42, w: 4.8, torso: 6.6, leg: 4.0, coat: '#4A3D4A', sleeve: '#4A3D4A', lapel: '#F7F4EE', suitV: '#2E252D', tie: '#5A4A58', tieStripe: '#C9B9C4', pants: '#2E252D', shoes: '#1A1416',
      skin: '#5A3522', hw: 2.1, hh: 2.75, round: .85, hair: '#1C1513', afro: true, hairStyle: 'none', flare: .02, arm: 6.0 },
    skeptic: { name: 'skeptic', sh: .34, w: 4.0, torso: 6.6, leg: 4.0, coat: '#8E8F96', sleeve: '#D9D4C8', lapel: '#D9D4C8', tie: '#5A3A6B', pants: '#3A3A44', shoes: '#22222A',
      skin: SK.peach, hw: 2.0, hh: 2.9, round: .55, hair: '#5A4636', hairStyle: 'neat', hat: 'flatcap', hatCol: '#5E5A4E', glasses: true, flare: -.04, arm: 6.0 },
  };
  // a scroll / a quill / a ticket for hands
  window.PROPS = {
    scroll: (x, y, u, sw) => { paint(rrPts(x - u * 1.6, y - u * .5, u * 3.2, u * 1.0, u * .3), { wash: '#F3E6C4', ink: PAL.ink, sw }); for (const s of [-1, 1]) paint(ellPts(x + s * u * 1.6, y, u * .3, u * .55, 8), { wash: '#C9A46B', ink: PAL.ink, sw: sw * .8 }); },
    quill: (x, y, u, sw) => { paint(ribbon([[x, y], [x + u * 1.2, y - u * 2.2], [x + u * 1.6, y - u * 3.6]], u * .15, u * .7), { wash: '#F6F1E6', ink: PAL.ink, sw: sw * .8 }); },
    ticket: (x, y, u, sw) => { push(); translate(x + u * .6, y - u * .4); rotate(-.3); paint(rrPts(-u * 1.3, -u * .7, u * 2.6, u * 1.4, u * .2), { wash: '#F0BE46', ink: PAL.ink, sw }); pop(); },
    book: (x, y, u, sw) => { paint(rrPts(x - u * 1.2, y - u * 1.6, u * 2.4, u * 3.0, u * .2), { wash: '#7A2E2E', ink: PAL.ink, sw }); },
  };
  // lineup loops: one per character, two moods each, on a soft painted card
  const card = (col) => { paint(rectPts(-100, -100, W + 200, H + 200), { wash: col, ink: null }); paint(ellPts(540, 1620, 520, 70, 24), { wash: mixCol(col, '#000000', .18), ink: null }); };
  const pair = (key, bgc, m1, m2, o1 = {}, o2 = {}) => { LOOPS[key] = t => { window.CHEAP = true; card(bgc); const S = CAST[key.slice(3).replace(/\d$/, '')]; person(300, 1560, 40, S, { mood: m1, key: 'a', ...o1 }); person(790, 1560, 40, S, { mood: m2, key: 'b', ...o2 }); }; LOOPS[key].len = 2; };
  pair('lu_neville', '#C9D3E3', 'neutral', 'happy', { aL: -1.4 }, { aL: -.2, hold: PROPS.ticket });
  pair('lu_abdullah', '#E9C99A', 'happy', 'determined', {}, { aL: .4 });
  pair('lu_dreamer', '#F2C7A9', 'sleepy', 'awe', {}, { aL: -.6, aR: -.6 });
  pair('lu_paul', '#D6C9A8', 'neutral', 'joy', { aL: -.6, hold: PROPS.scroll }, { aL: .9 });
  LOOPS.cast = t => { window.CHEAP = true; card('#E9DCC6');
    const row = (y, list) => list.forEach(([k, x, o]) => person(x, y, list.length > 3 ? 23 : 27, CAST[k], { key: k, ...o }));
    row(1080, [['neville', 140, { mood: 'happy' }], ['abdullah', 405, { mood: 'happy' }], ['emery', 675, { mood: 'beam' }], ['dreamer', 945, { mood: 'joy', aL: .7, aR: .7 }]]);
    row(1760, [['paul', 190, { mood: 'joy', aL: .9, lean: -.05 }], ['blake', 540, { mood: 'surprised', aL: -.2, hold: PROPS.quill }], ['skeptic', 890, { mood: 'neutral', look: -.8 }]]);
  }; LOOPS.cast.len = 2;
  pair('lu_emery', '#C9CED8', 'beam', 'warm', { aL: -1.35, aR: -1.35 }, { aL: .3 });
  pair('lu_dreamer2', '#F2C7A9', 'sleepy', 'joy', {}, { aL: .8, aR: .8 });
  pair('lu_blake', '#C7D8C2', 'surprised', 'happy', { aL: -.3, hold: PROPS.quill }, { aL: -.4, hold: PROPS.quill });
})();
