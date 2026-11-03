// Word by word Reel captions on the crisp 2D overlay (above the grain). Chunks of up to 4 words, broken at punctuation.
(() => {
  const CF = '800 70px "Shantell Sans"';
  const CHUNKS = [];
  for (const L of VOICE_LINES) {
    let cur = []; const isCta = L.id === 'cta' || L.id === 'close' || L.id === 'comment';
    L.words.forEach((w, i) => { cur.push(w); const brk = /[.,?:!]$/.test(w[0]) || cur.length === 4 || i === L.words.length - 1; if (brk) { cur.cta = isCta; CHUNKS.push(cur); cur = []; } });
  }
  const clean = (s, cta) => { s = s.replace(/[.,:]$/, ''); return cta && /^(end|temple)$/i.test(s) ? s.toUpperCase() : s; };
  window.EXTRA_FONTS = [[CF, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ?\'']];
  window.overlayHook = (c, t) => {
    if (window.LOOP) return;
    const k = CHUNKS.findIndex((ch, i) => t >= ch[0][1] - .05 && t < (CHUNKS[i + 1] ? Math.min(CHUNKS[i + 1][0][1] - .05, ch[ch.length - 1][2] + .6) : ch[ch.length - 1][2] + .8));
    if (k < 0) return;
    const ch = CHUNKS[k], y = 400;
    c.save(); c.font = CF; c.textBaseline = 'middle';
    const words = ch.map(w => clean(w[0], ch.cta)), sp = 22, ws = words.map(w => c.measureText(w).width);
    let tot = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1), sc = Math.min(1, 940 / tot);
    c.translate(540, y); c.scale(sc, sc);
    const pop = easeOut(clamp((t - ch[0][1] + .05) / .14));
    c.scale(.85 + .15 * pop, .85 + .15 * pop);
    let x = -tot / 2;
    words.forEach((w, i) => {
      const on = t >= ch[i][1] - .02, now = on && (i === ch.length - 1 || t < ch[i + 1][1]);
      const s = now ? 1 + .1 * (1 - easeOut(clamp((t - ch[i][1]) / .12))) : 1;
      c.save(); c.translate(x + ws[i] / 2, 0); c.scale(s, s);
      c.lineJoin = 'round'; c.lineWidth = 14; c.strokeStyle = '#2A2233'; c.textAlign = 'center';
      c.globalAlpha = on ? 1 : .55; c.strokeText(w, 0, 0); c.fillStyle = now ? '#F4C04A' : '#FBF4E6'; c.fillText(w, 0, 0);
      c.restore(); x += ws[i] + sp;
    });
    c.restore();
  };
})();
