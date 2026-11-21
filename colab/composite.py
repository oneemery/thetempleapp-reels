# Composite the Part 3 text and captions (live engine, headless Chromium) over the Blender shots, add the voice.
import base64, io, os, subprocess, sys, time
from PIL import Image
from playwright.sync_api import sync_playwright
HERE = '/content/temple'; OUT = '/content/out'
SECTIONS = [('golgotha', 0.0, 312), ('walls', 50.0, 297), ('rise', 128.4, 378)]
FADE = 8
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8765', '--directory', HERE], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5)
voice = [f for f in os.listdir(f'{HERE}/live/cross-part3') if f.startswith('voice')][0]
final = f'{OUT}/Temple_Cross3_3D.mp4'
ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '1080x1920', '-r', '30', '-i', '-',
                       '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', f'{OUT}/v3d.mp4'], stdin=subprocess.PIPE)
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1080, 'height': 1920})
    pg.goto('http://127.0.0.1:8765/render.html?base=live/cross-part3/&full=1&scale=1')
    pg.wait_for_function('window.ready', timeout=120000); pg.evaluate('window.ready')
    t0 = time.time()
    for si, (shot, ts, n) in enumerate(SECTIONS):
        for f in range(1, n + 1):
            bg = Image.open(f'{OUT}/{shot}/f{f:04d}.jpg').convert('RGBA')
            d = pg.evaluate(f'overlayAt({ts + (f - 1) / 30})')
            ov = Image.open(io.BytesIO(base64.b64decode(d.split(',')[1]))).convert('RGBA')
            im = Image.alpha_composite(bg, ov).convert('RGB')
            k = 1.0
            if si > 0 and f <= FADE: k = f / FADE
            if si < len(SECTIONS) - 1 and f > n - FADE: k = (n - f + 1) / FADE
            if si == len(SECTIONS) - 1 and f > n - 15: k = (n - f + 1) / 15
            if k < 1: im = Image.eval(im, lambda v, k=k: int(v * k))
            ff.stdin.write(im.tobytes())
        print(shot, 'composited', round(time.time() - t0), 's', flush=True)
    b.close()
ff.stdin.close(); ff.wait(); srv.terminate()
# voice: cut the same three stretches and join them
parts = []
for i, (shot, ts, n) in enumerate(SECTIONS):
    d = n / 30; fn = f'{OUT}/a{i}.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(ts), '-t', str(d), '-i', f'{HERE}/live/cross-part3/{voice}',
                    '-af', f'afade=t=in:d=0.12,afade=t=out:st={d - 0.25}:d=0.25', '-ar', '48000', '-ac', '2', fn], check=True)
    parts.append(fn)
open(f'{OUT}/alist.txt', 'w').write(''.join(f"file '{x}'\n" for x in parts))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{OUT}/alist.txt', f'{OUT}/a3d.wav'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{OUT}/v3d.mp4', '-i', f'{OUT}/a3d.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final], check=True)
print('FINAL', final, os.path.getsize(final) // 1024, 'KB', flush=True)
