window.CHEAP = true; window.FELT = true;
// Depth test: a felt street. Road along the bottom (the caption zone), curb and sidewalk where the front row stands,
// a lawn and driveway running back to the houses on the horizon. The cast ends up in the middle of the frame,
// clear of the Reels/Shorts caption and buttons, and back rows read smaller and higher.
(() => {
  const C = CAST, P = piece;
  const HZ = 1010;                                   // horizon: where the lawn meets the backdrop
  const WALK0 = 1380, WALK1 = 1520, CURB = 1545;     // sidewalk band and curb
  const ZY = z => lerp(HZ + 30, 1475, z), ZS = z => lerp(.6, 1, z);
  const cue = (key, tt, type, x = 540, size = 400) => { CUELOG[key] = { t: tt, type, x, size }; };
  const ZX = (x, z) => 540 + (x - 540) * lerp(.62, 1, z);
  const haze = z => { const k = Math.round(lerp(226, 255, z)); return [k, k, Math.round(k * .985)]; };
  const at = (name, x, z, h, o = {}) => P(name, ZX(x, z), ZY(z), h * ZS(z), { tint: haze(z), ...o });
  const who = (S, x, z, u, o = {}) => person(ZX(x, z), ZY(z), u * lerp(.45, 1, z), S, o);

  // felt fabric cut to any shape: a board texture clipped to a polygon, tinted
  function fabric(board, pts, col, a = 255) {
    const im = (window.PLATES || {})['b:' + board]; if (!im || window.CUEMODE) return;
    flushBrush();
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    const vs = Math.min(1, (y1 - y0) / Math.max(1, x1 - x0) * im.width / im.height);   // keep the felt grain the same scale
    push(); noStroke(); textureMode(NORMAL); tint(col[0], col[1], col[2], a); texture(im);
    beginShape(); for (const [x, y] of pts) vertex(x, y, 0, (x - x0) / Math.max(1, x1 - x0), (y - y0) / Math.max(1, y1 - y0) * vs); endShape(CLOSE); noTint(); pop();
    push(); noFill(); stroke(30, 18, 12, 60); strokeWeight(5); beginShape(); pts.forEach(p => vertex(p[0], p[1] + 3)); endShape(CLOSE); pop();
  }
  const band = (y0, y1) => [[-60, y0], [W + 60, y0], [W + 60, y1], [-60, y1]];

  function street(t) {
    fabric('sand', band(HZ, WALK0), [150, 196, 112]);                                   // lawn, runs back to the horizon
    for (let i = 1; i < 6; i++) { const y = lerp(HZ, WALK0, (i / 6) ** 1.5); push(); stroke(70, 110, 50, 40); strokeWeight(2 + i * .7); line(-40, y, W + 40, y); pop(); }
    fabric('sand', [[505, HZ + 6], [585, HZ + 6], [800, WALK0], [380, WALK0]], [196, 190, 182]);   // driveway narrowing toward the house
    fabric('sand', band(WALK0, WALK1), [214, 206, 196]);                                 // sidewalk
    for (let x = -40; x < W + 40; x += 150) { push(); stroke(120, 110, 100, 90); strokeWeight(3); line(x, WALK0 + 6, x - 30, WALK1 - 4); pop(); }   // slab joints
    fabric('sand', band(WALK1, CURB), [168, 160, 150]);                                  // curb
    fabric('sand', band(CURB, H + 60), [104, 104, 110]);                                // road
    for (let x = -60; x < W + 60; x += 230) fabric('sand', [[x, 1735], [x + 130, 1735], [x + 130, 1752], [x, 1752]], [240, 200, 70]);   // dashed center line
  }

  function shDepth(t, lt, dur) {
    camBegin(540, 960, 1.0);
    board('day');
    P('island_sun', 860, 470, 200, { sway: .02 });
    P('island_cloud', 250, 520, 250, { sway: .02 }); P('island_cloud', 720, 640, 170, { sway: .02 });
    street(t);
    // back (z 0): the houses sit on the horizon, the driveway leads to the middle one
    at('city_brownstone', 110, 0, 620, { sway: 0 });
    at('life_house', 545, 0, 560, { sway: 0 });
    at('city_rowhouses', 975, 0, 600, { sway: 0 });
    who(C.paul, 300, .12, 22, { mood: 'happy', look: .4, key: 'x1' });                  // neighbors far back
    who(C.skeptic, 790, .14, 22, { mood: 'neutral', look: -.5, key: 'x2' });
    // middle (z .45): two extras on the driveway and lawn
    who(C.dreamer, 180, .45, 22, { mood: 'happy', look: 1, key: 'x3' });
    who(C.blake, 610, .5, 22, { mood: 'warm', look: -1, key: 'x4', aL: .3 });
    at('street_picketfence', 300, .3, 220, { sway: 0 }); at('street_picketfence', 790, .3, 220, { sway: 0 }); at('car_pickup', 820, .02, 300, { sway: 0 });
    // front row on the sidewalk (z 1): faces land in the middle of the frame
    P('street_tree', 990, 1470, 620, { sway: .006 }); P('street_hydrant', 820, 1500, 120, { sway: 0 }); P('street_mailbox', 200, 1500, 170, { sway: 0 });                               // sidewalk tree
    P('city_streetlamp', 70, 1480, 640, { sway: .003 });
    who(C.neville, 700, .96, 22, { mood: 'wise', look: -.8, aL: -.2, key: 'nev' });
    who(C.emery, 360, 1, 22, { mood: 'warm', look: .6, aR: .35, key: 'host' });
    // road (caption zone): a car rolls past, nothing that matters lives down here
    P('car_sedan50s', lerp(-500, 1600, (t % 6) / 6), 1890, 330, { sway: 0, snd: false });
    camEnd();
  }

  // ROOM SET: a three wall box in perspective (back wall, side walls, floor), furniture placed by depth so nothing floats
  function room(t, wall = [232, 214, 186], flr = [150, 104, 70]) {
    const BX0 = 170, BX1 = 910, BY0 = 330, BY1 = 1230;                         // back wall rectangle
    fabric('warm', [[-60, -60], [W + 60, -60], [BX1, BY0], [BX0, BY0]], wall.map(c => c * .82));          // ceiling
    fabric('warm', [[BX0, BY0], [BX1, BY0], [BX1, BY1], [BX0, BY1]], wall);                                  // back wall
    fabric('warm', [[-60, -60], [BX0, BY0], [BX0, BY1], [-60, H + 60]], wall.map(c => c * .88));            // left wall
    fabric('warm', [[W + 60, -60], [W + 60, H + 60], [BX1, BY1], [BX1, BY0]], wall.map(c => c * .9));      // right wall
    fabric('sand', [[BX0, BY1], [BX1, BY1], [W + 60, H + 60], [-60, H + 60]], flr);                          // floor
    push(); stroke(80, 50, 30, 50); for (let i = 1; i < 9; i++) { const x = lerp(BX0, BX1, i / 9), xb = lerp(-60, W + 60, i / 9); strokeWeight(3); line(x, BY1, xb, H + 60); } pop();   // floorboards run to the viewer
    push(); stroke(60, 40, 25, 80); strokeWeight(14); line(BX0, BY1, BX1, BY1); pop();                       // baseboard
  }
  function shRoom(t, lt) {
    camBegin(540, 960, 1.0); room(t, [214, 196, 168], [112, 72, 44]);
    P('room_window', 700, 900, 420, { sway: 0 }); P('room_painting', 330, 760, 220, { sway: 0 });
    P('home_piano', 330, 1240, 330, { sway: 0 }); P('room_clock', 880, 700, 120, { sway: .02 });
    P('room_rug', 540, 1560, 900, { sx: 1.5, sy: .32, sway: 0 });
    P('home_sofa', 760, 1380, 330, { sway: 0 });
    person(470, 1500, 22, CAST.emery, { mood: 'warm', look: .6, aR: .35, key: 'host' });
    person(820, 1340, 17, CAST.dreamer, { mood: 'happy', look: -1, key: 'x3' });
    P('room_armchair', 140, 1820, 420, { sway: 0 });                                   // foreground piece frames the set
    camEnd();
  }
  // IN THE CAR: people drawn first, the car drawn over them, heads show through the window holes
  function shCar(t, lt) {
    camBegin(540, 960, 1.0); board('day'); street(t);
    at('life_house', 545, 0, 560, { sway: 0 }); at('city_rowhouses', 975, 0, 600, { sway: 0 }); at('city_brownstone', 110, 0, 620, { sway: 0 });
    const cx = 540 + 20 * Math.sin(t * 1.3), by = 1500, bob = 4 * Math.sin(t * 9);
    if ((window.PLATES || {})['p:car_win_sedan50s']) {
      person(cx - 40, by - 125 + bob, 14, CAST.emery, { mood: 'warm', look: .8, key: 'host' });
      person(cx + 130, by - 112 + bob, 12.5, CAST.neville, { mood: 'wise', look: -.6, key: 'nev' });
      P('car_win_sedan50s', cx, by + bob, 440, { sway: 0, snd: false });
    }
    camEnd();
  }

  // felt smoke: cotton puffs from the tailpipe that grow, rise and fade; burst = a backfire cloud
  function smoke(px, py, t, t0, t1, o = {}) {
    if (window.CUEMODE || t < t0) return; flushBrush(); noStroke();
    const rate = o.rate || 7, life = o.life || 1.1, dir = o.dir || -1;
    for (let k = Math.floor(t0 * rate); k <= Math.floor(Math.min(t, t1) * rate); k++) {
      const born = k / rate, age = t - born; if (age < 0 || age > life) continue;
      const a = age / life, r = (10 + 34 * a) * (o.scale || 1) * (.8 + .4 * hash(k * 3.1));
      const x = px + dir * (30 + 120 * a) * (o.spread || 1) + 12 * Math.sin(k * 2.3), y = py - 50 * a - 8 * hash(k);
      fill(30, 18, 12, 50 * (1 - a)); ellipse(x + 3, y + 4, r * 2, r * 1.7);
      fill(o.col || 236, o.col || 232, (o.col || 236) - 10, 220 * (1 - a)); ellipse(x, y, r * 2, r * 1.7);
    }
  }
  function burst(px, py, t, t0, dir = -1) {
    if (window.CUEMODE || t < t0 || t > t0 + 1.3) return; flushBrush(); noStroke(); const a = (t - t0) / 1.3, G = 1.8;
    if (a < .15) glow(px + dir * 30, py, 120, '#FFB040', 1 - a / .15);
    for (let i = 0; i < 7; i++) { const an = i / 7 * TAU, d = (40 + 110 * Math.sqrt(a)) * G, r = (24 + 38 * a) * G * (.8 + .4 * hash(i));
      fill(30, 18, 12, 60 * (1 - a)); ellipse(px + dir * 60 + Math.cos(an) * d + 3, py - 30 * a + Math.sin(an) * d * .6 + 4, r * 2, r * 1.8);
      fill(92, 86, 84, 240 * (1 - a * a)); ellipse(px + dir * 60 + Math.cos(an) * d, py - 30 * a + Math.sin(an) * d * .6, r * 2, r * 1.8); }
  }
  // DRIVE: car rolls in puffing, stops, honks, backfires, drives off (all sounds logged as cues)
  function shDrive(t, lt) {
    camBegin(540, 960, 1.0); board('day'); street(t);
    at('life_house', 545, 0, 560, { sway: 0 }); at('city_rowhouses', 975, 0, 600, { sway: 0 }); at('city_brownstone', 110, 0, 620, { sway: 0 });
    P('street_tree', 990, 1470, 620, { sway: .006 }); P('street_mailbox', 200, 1500, 170, { sway: 0 });
    who(CAST.dreamer, 820, .96, 22, { mood: lt > 2.6 ? 'surprised' : 'happy', look: -1, key: 'walker' });
    const T0 = 12, stopAt = 2.2, go = 4.2;
    const xin = lt < stopAt ? lerp(-500, 580, easeOut(clamp(lt / stopAt))) : lt < go ? 580 : lerp(580, 1700, easeIn(clamp((lt - go) / 1.8)));
    const bob = (lt < stopAt || lt > go ? 5 : 2) * Math.sin(lt * (lt < stopAt || lt > go ? 14 : 22));
    const by = 1840, tail = xin - 400;   // tailpipe sits at the back bumper (car faces right)
    smoke(tail, by - 40, lt, 0, 6, { scale: 1.5, rate: lt > stopAt && lt < go ? 4 : 9, spread: lt > stopAt && lt < go ? .4 : 1 });
    person(xin - 40, by - 125 + bob, 14, CAST.emery, { mood: lt > 3 && lt < 3.6 ? 'surprised' : 'warm', look: .8, key: 'host' });
    person(xin + 130, by - 112 + bob, 12.5, CAST.neville, { mood: 'wise', look: -.6, key: 'nev' });
    P('car_win_sedan50s', xin, by + bob, 440, { sway: 0, snd: false });
    burst(tail, by - 40, lt, 3.1);
    if (lt > 2.5 && lt < 3.0) { const k = (lt - 2.5) / .5; push(); stroke(PAL.ink); strokeWeight(7); noFill(); for (let i = 0; i < 3; i++) arc(xin + 470, by - 220, 60 + i * 40 + 30 * k, 60 + i * 40 + 30 * k, -.6, .6); pop(); }   // honk lines
    cue('drv1', T0, 'drive', 0, stopAt + .2); cue('idle', T0 + stopAt, 'idle', 580, go - stopAt);
    cue('honk', T0 + 2.5, 'honk', 940); cue('bf', T0 + 3.1, 'backfire', 60); cue('drv2', T0 + go, 'drive', 580, 2);
    camEnd();
  }
  shots([[0, shDepth], [4, shRoom], [8, shCar], [12, shDrive]]);
})();
