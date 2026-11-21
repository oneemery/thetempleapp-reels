# Render the full Part 3 with the 3D plates using the live engine in headless Chromium, then add the voice.
import base64, os, subprocess, sys, time
from playwright.sync_api import sync_playwright
HERE = '/content/temple'; OUT = '/content/out'; os.makedirs(OUT, exist_ok=True)
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8765', '--directory', HERE], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5)
base = f'{HERE}/live/cross-part3'
voice = [f for f in os.listdir(base) if f.startswith('voice')][0]
vid = f'{OUT}/v.mp4'; final = f'{OUT}/Temple_Cross_Part3_3D.mp4'
FPS = 30
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1080, 'height': 1920})
    pg.goto('http://127.0.0.1:8765/render.html?base=live/cross-part3/&scene=scene3d.json&full=1&scale=1&q=0.95')
    pg.wait_for_function('window.ready', timeout=180000); pg.evaluate('window.ready')
    total = pg.evaluate('eng.S.TOTAL'); n = int(total * FPS)
    ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'mjpeg', '-i', '-',
                           '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', vid], stdin=subprocess.PIPE)
    t0 = time.time()
    for i in range(n):
        d = pg.evaluate(f'drawAt({i / FPS})'); ff.stdin.write(base64.b64decode(d.split(',')[1]))
        if i % 600 == 0: print(f'frame {i}/{n} {time.time() - t0:.0f}s', flush=True)
    ff.stdin.close(); ff.wait(); b.close()
srv.terminate()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', vid, '-i', f'{base}/{voice}', '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
                '-shortest', '-bsf:v', 'h264_metadata=sample_aspect_ratio=1/1', '-movflags', '+faststart', final], check=True)
print('FINAL', final, os.path.getsize(final) // 1024, 'KB', round(time.time() - t0), 's', flush=True)
