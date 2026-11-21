// Temple live engine: draws a Temple video frame from scene.json, the same way render.py does.
(function () {
  const ease = x => { x = Math.max(0, Math.min(1, x)); return 1 - Math.pow(1 - x, 3); };
  const step = (keys, t) => { let v = keys[0][1]; for (const k of keys) if (t >= k[0]) v = k[1]; return v; };
  function kf(keys, t) {
    if (keys.length === 1 || t <= keys[0][0]) return keys[0].slice(1);
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1];
      if (t < b[0]) { const p = ease((t - a[0]) / Math.max(0.001, Math.min(0.5, b[0] - a[0]))); return a.slice(1).map((v, j) => v + (b[j + 1] - v) * p); }
    }
    return keys[keys.length - 1].slice(1);
  }
  const rad = d => d * Math.PI / 180;
  const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('load ' + src)); i.src = src; });

  function Engine(canvas, opts) {
    this.c = canvas; this.k = opts.scale || 0.5; this.full = !!opts.full;
    this.S = null; this.ov = {}; this.boxes = [];
  }
  Engine.prototype.load = async function (base, onProgress) {
    const S = this.S = await (await fetch(base + 'scene.json', { cache: 'no-store' })).json();
    this.W = S.W; this.H = S.H;
    const files = [];
    let done = 0; const tick = () => { done++; onProgress && onProgress(done / files.length); };
    files.push(loadImg(base + 'bg.jpg').then(i => { this.bg = i; tick(); }));
    files.push(loadImg(base + 'glow.jpg').then(i => { this.glow = i; tick(); }));
    if (this.full) {
      this.spr = new Array(S.sprites.length);
      S.sprites.forEach((s, i) => files.push(loadImg(base + s[0]).then(im => { this.spr[i] = { im, sx: 0, sy: 0, sw: im.width, sh: im.height }; tick(); })));
    } else {
      this.pages = [];
      S.atlas.pages.forEach((p, k) => files.push(loadImg(base + p).then(im => { this.pages[k] = im; tick(); })));
    }
    await Promise.all(files);
    if (!this.full) this.spr = S.atlas.rects.map(r => ({ im: this.pages[r[0]], sx: r[1], sy: r[2], sw: r[3], sh: r[4] }));
    // particle sprite
    const pc = document.createElement('canvas'); pc.width = pc.height = 64; const px = pc.getContext('2d');
    const g = px.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,226,160,1)'); g.addColorStop(0.28, 'rgba(255,226,160,1)'); g.addColorStop(0.42, 'rgba(255,226,160,0.35)'); g.addColorStop(1, 'rgba(255,226,160,0)');
    px.fillStyle = g; px.fillRect(0, 0, 64, 64); this.part = pc;
    this.resize();
  };
  Engine.prototype.resize = function () {
    const k = this.k, W = this.W, H = this.H;
    this.c.width = Math.round(W * k); this.c.height = Math.round(H * k);
    this.scene = this.scene || document.createElement('canvas');
    this.scene.width = this.c.width; this.scene.height = this.c.height;
    this.lay = this.lay || document.createElement('canvas');
  };
  // draw sprite i with its full (uncropped) top left at x,y, scale s
  Engine.prototype.sprite = function (ctx, i, x, y, s, clipW) {
    const sp = this.S.sprites[i], r = this.spr[i];
    const ox = sp[3], oy = sp[4], cw = sp[5], ch = sp[6];
    if (clipW !== undefined) {
      const vis = Math.max(0, Math.min(cw, clipW - ox)); if (vis <= 0) return;
      ctx.drawImage(r.im, r.sx, r.sy, r.sw * vis / cw, r.sh, x + ox * s, y + oy * s, vis * s, ch * s); return;
    }
    ctx.drawImage(r.im, r.sx, r.sy, r.sw, r.sh, x + ox * s, y + oy * s, cw * s, ch * s);
  };
  Engine.prototype.drawBg = function (ctx, t) {
    const S = this.S, W = this.W, H = this.H;
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(this.bg, 0, 0, W, H);
    const pulse = 0.55 + 0.25 * Math.sin(t * 1.3);
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, pulse * S.glowmax / 255);
    ctx.drawImage(this.glow, 0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    for (const [x0, y0, r, sp, ph, tw] of S.parts) {
      const y = (((y0 - t * sp) % H) + H) % H, x = x0 + 18 * Math.sin(t * 0.4 + ph);
      ctx.globalAlpha = (110 + 120 * (0.5 + 0.5 * Math.sin(t * tw * 2 + ph))) / 255;
      const R = r * 3.6; ctx.drawImage(this.part, x - R, y - R, 2 * R, 2 * R);
    }
    ctx.globalAlpha = 1;
  };
  Engine.prototype.drawEl = function (ctx, e, t, key) {
    const ov = this.ov[key] || {};
    if (ov.hide) return null;
    const dt = ov.dt || 0, t0 = e.t0 + dt, t1 = e.t1 + dt;
    if (t < t0 || t > t1 + e.fout) return null;
    const p = e.fade > 0 ? ease((t - t0) / e.fade) : 1;
    let a = p * e.alpha;
    if (t > t1) a *= 1 - (t - t1) / e.fout;
    if (e.dim && t > e.dim[0] + dt) a *= 1 - (1 - e.dim[1]) * ease((t - e.dim[0] - dt) / 0.4);
    let sc = 1, dy = 0;
    if (e.anim === 'rise') dy = 40 * (1 - p); else if (e.anim === 'zoom') sc = 0.82 + 0.18 * p; else if (e.anim === 'pop') sc = 1.25 - 0.25 * p;
    if (e.pulse) sc *= 1 + 0.025 * Math.sin(t * 3.2);
    sc *= ov.sc || 1;
    let cx = e.cx + e.vx * (t - t0) + (ov.dx || 0), cy = e.cy + dy + (ov.dy || 0);
    if (e.path) { const n = e.path.xy.length, j = Math.max(0, Math.min(n - 1, Math.round((t - dt - e.path.t0) / e.path.dt))); cx += e.path.xy[j][0]; cy += e.path.xy[j][1]; }
    const sp = this.S.sprites[e.img], fw = sp[1], fh = sp[2];
    let clip;
    if (e.anim === 'wipe') { const w = Math.max(1, fw * p); clip = w; a = e.alpha * (t <= t1 ? 1 : 1 - (t - t1) / e.fout); }
    if (a <= 0.01) return null;
    ctx.globalAlpha = Math.min(1, a);
    const x = cx - fw * sc / 2, y = cy - fh * sc / 2;
    this.sprite(ctx, e.img, x, y, sc, clip);
    ctx.globalAlpha = 1;
    return { x: x + sp[3] * sc, y: y + sp[4] * sc, w: sp[5] * sc, h: sp[6] * sc };
  };
  Engine.prototype.drawActor = function (ctx, A, t, key) {
    const ov = this.ov[key] || {};
    if (ov.hide) return null;
    const dt = ov.dt || 0; t -= dt;
    if (t < A.t0 || t > A.t1 + 0.4) return null;
    let a = ease((t - A.t0) / 0.4); if (t > A.t1) a *= 1 - (t - A.t1) / 0.4;
    if (a <= 0.02) return null;
    const S = this.S, R = S.rigs[A.k], sc = R.scale, k = this.k;
    const LW = Math.floor((S.FW + 360) * sc), LH = Math.floor((S.FH + 300) * sc), bx = Math.floor(180 * sc), by = Math.floor(240 * sc);
    const lay = this.lay; lay.width = Math.ceil(LW * k); lay.height = Math.ceil(LH * k);
    const l = lay.getContext('2d'); l.setTransform(k, 0, 0, k, 0, 0); l.clearRect(0, 0, LW, LH);
    const gl = A.glowk ? step(A.glowk, t) : A.glow;
    if (gl) {
      l.save(); l.translate(LW / 2, LH / 2); l.scale(LW * 0.22, LH * 0.24);
      const g = l.createRadialGradient(0, 0, 0, 0, 0, 3);
      [[0, 0.745], [0.5 / 3, 0.58], [1 / 3, 0.274], [1.5 / 3, 0.078], [2 / 3, 0.014], [1, 0]].forEach(([o, al]) => g.addColorStop(o, `rgba(255,226,160,${al})`));
      l.fillStyle = g; l.fillRect(-3, -3, 6, 6); l.restore();
    }
    const pe = ease((t - A.t0) / 0.6);
    const x = (A.xk ? kf(A.xk, t)[0] : A.x) + A.enter * (1 - pe) + (ov.dx || 0);
    const hop = A.enter ? -Math.abs(Math.sin((t - A.t0) * 9)) * 26 * (1 - pe) : 0;
    const bob = 4 * Math.sin(2.2 * t + A.phase) + hop;
    const fr = Math.floor(t * S.FPS); let m = 0;
    if (A.speak.some(([s0, s1]) => s0 <= t && t <= s1) && fr < S.env.length) { const e = S.env[fr]; m = e > 0.45 ? 2 : (e > 0.15 ? 1 : 0); }
    const blink = ((t + A.phase * 1.7) % 3.4) < 0.13 || (A.sleep !== null && A.sleep !== undefined && t >= A.sleep);
    const lk = Math.max(-1, Math.min(1, step(A.look, t)));
    let ex = step(A.expr, t) || R.need[0]; if (!R.need.includes(ex)) ex = R.need[0];
    let [aL, aR] = kf(A.arms, t);
    aR += 3 * Math.sin(1.7 * t + A.phase); aL += 2 * Math.sin(1.3 * t + A.phase + 1);
    const rotDraw = (img, piv, px, py, ang) => {
      const q = Math.round(ang / 3) * 3;
      l.save(); l.translate(px, py); l.rotate(-rad(q)); this.sprite(l, img, -piv[0], -piv[1], 1); l.restore();
    };
    const arm = (side, ang) => {
      const sx = bx + (180 + side * (R.wt + 4)) * sc, sy = by + (R.sh + 4) * sc;
      const A1 = side * ang, B = side * (10 + 0.32 * Math.abs(ang));
      rotDraw(R.upper, R.upiv, sx, sy, A1);
      const L1 = (R.ul - 14) * sc, exx = sx + L1 * Math.sin(rad(A1)), eyy = sy + L1 * Math.cos(rad(A1));
      rotDraw(R.fore, R.fpiv, exx, eyy, A1 + B);
    };
    if (R.back !== null) this.sprite(l, R.back, bx, by, 1);
    arm(-1, aL);
    this.sprite(l, R.body, bx, by, 1);
    const hk = `${m}|${blink ? 1 : 0}|${lk}|${ex}`;
    if (R.heads[hk] !== undefined) this.sprite(l, R.heads[hk], bx, by, 1);
    if (A.prop) {
      const [pim, gx, gy] = A.prop;
      const sx = bx + (180 + (R.wt + 4)) * sc, sy = by + (R.sh + 4) * sc, A1 = aR, B = 10 + 0.32 * Math.abs(aR);
      const L1 = (R.ul - 14) * sc, ex_ = sx + L1 * Math.sin(rad(A1)), ey_ = sy + L1 * Math.cos(rad(A1));
      const L2 = (R.fl - 10) * sc, hx = ex_ + L2 * Math.sin(rad(A1 + B)), hy = ey_ + L2 * Math.cos(rad(A1 + B));
      this.sprite(l, pim, hx - gx, hy - gy, 1);
    }
    arm(1, aR);
    const fx = bx + 180 * sc, fy = by + 580 * sc, G = S.GROUND;
    ctx.save(); ctx.globalAlpha = a;
    ctx.translate(x, G + bob);
    if (A.fall !== null && A.fall !== undefined && t > A.fall) ctx.rotate(-rad(84 * ease((t - A.fall) / 0.75)));
    ctx.drawImage(lay, 0, 0, lay.width, lay.height, -fx, -fy, LW, LH);
    ctx.restore();
    return { x: x - fx + bx, y: G + bob - fy + by, w: 360 * sc, h: 600 * sc };
  };
  // draw the frame at time t. returns hit boxes (top-most last)
  Engine.prototype.frame = function (t) {
    const S = this.S, k = this.k, W = this.W, H = this.H, boxes = [];
    const sc = this.scene.getContext('2d'); sc.setTransform(k, 0, 0, k, 0, 0);
    this.drawBg(sc, t);
    S.back.forEach((e, i) => this.drawEl(sc, e, t, 'back:' + i));
    S.actors.forEach((A, i) => { const b = this.drawActor(sc, A, t, 'actor:' + i); if (b) boxes.push({ key: 'actor:' + i, kind: 'actor', ref: A, box: b }); });
    const ctx = this.c.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    let zoomed = false;
    for (const [s0, s1] of S.stages) {
      if (s0 <= t && t <= s1 + 0.4) {
        const z = 1 + 0.045 * ease((t - s0) / Math.max(1, s1 - s0));
        const cw = W / z, ch = H / z, x0 = (W - cw) / 2, y0 = 1050 - ch * 1050 / H;
        ctx.drawImage(this.scene, Math.floor(x0) * k, Math.floor(y0) * k, Math.floor(cw) * k, Math.floor(ch) * k, 0, 0, this.c.width, this.c.height);
        this.zoom = { z, x0, y0 }; zoomed = true; break;
      }
    }
    if (!zoomed) { ctx.drawImage(this.scene, 0, 0); this.zoom = null; }
    if (this.zoom) boxes.forEach(b => { const { z, x0, y0 } = this.zoom; b.box = { x: (b.box.x - x0) * z, y: (b.box.y - y0) * z, w: b.box.w * z, h: b.box.h * z }; });
    ctx.setTransform(k, 0, 0, k, 0, 0);
    S.els.forEach((e, i) => { const b = this.drawEl(ctx, e, t, 'el:' + i); if (b) boxes.push({ key: 'el:' + i, kind: 'el', ref: e, box: b }); });
    for (const [a, b, img] of S.caps) {
      if (a <= t && t < b + 0.02) {
        const p = ease((t - a) / 0.12), s = 0.92 + 0.08 * p, sp = S.sprites[img];
        this.sprite(ctx, img, W / 2 - sp[1] * s / 2, 1470 - sp[2] * s / 2, s); break;
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.boxes = boxes;
    return boxes;
  };
  // overlay only: transparent canvas with the text elements and captions (for compositing over 3D renders)
  Engine.prototype.overlay = function (t, keep) {
    const S = this.S, k = this.k, W = this.W;
    const ctx = this.c.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, this.c.width, this.c.height);
    ctx.setTransform(k, 0, 0, k, 0, 0);
    S.els.forEach((e, i) => { if (keep(e)) this.drawEl(ctx, e, t, 'el:' + i); });
    for (const [a, b, img] of S.caps) {
      if (a <= t && t < b + 0.02) { const p = ease((t - a) / 0.12), s = 0.92 + 0.08 * p, sp = S.sprites[img]; this.sprite(ctx, img, W / 2 - sp[1] * s / 2, 1470 - sp[2] * s / 2, s); break; }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
  window.TempleEngine = Engine;
})();
