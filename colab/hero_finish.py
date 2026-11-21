# Put the Part 3 text + captions over the hero frames, then splice the hero into the existing 3D reel.
import base64, io, os, subprocess, sys, time
from PIL import Image
from playwright.sync_api import sync_playwright
HERE = '/content/temple'; OUT = '/content/out'
PREV = '/content/drive/MyDrive/Temple Reels/Temple_Cross_Part3_3D.mp4'
N = 318
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8765', '--directory', HERE], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5)
ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '1080x1920', '-r', '30', '-i', '-',
                       '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', f'{OUT}/hero_txt.mp4'], stdin=subprocess.PIPE)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1080, 'height': 1920})
    pg.goto('http://127.0.0.1:8765/render.html?base=live/cross-part3/&full=1&scale=1')
    pg.wait_for_function('window.ready', timeout=120000); pg.evaluate('window.ready')
    for f in range(1, N + 1):
        bg = Image.open(f'{OUT}/hero/f{f:04d}.jpg').convert('RGB').resize((1080, 1920), Image.LANCZOS).convert('RGBA')
        d = pg.evaluate(f'overlayAt({(f - 1) / 30})')
        ov = Image.open(io.BytesIO(base64.b64decode(d.split(',')[1]))).convert('RGBA')
        ff.stdin.write(Image.alpha_composite(bg, ov).convert('RGB').tobytes())
    b.close()
ff.stdin.close(); ff.wait(); srv.terminate()
base = f'{HERE}/live/cross-part3'; voice = [f for f in os.listdir(base) if f.startswith('voice')][0]
final = f'{OUT}/Temple_Cross_Part3_3D_v2.mp4'
if os.path.exists(PREV):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{OUT}/hero_txt.mp4', '-ss', str(N / 30), '-i', PREV, '-i', f'{base}/{voice}',
                    '-filter_complex', '[0:v][1:v]concat=n=2:v=1:a=0[v]', '-map', '[v]', '-map', '2:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18',
                    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final], check=True)
else:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{OUT}/hero_txt.mp4', '-i', f'{base}/{voice}', '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                    '-c:a', 'aac', '-shortest', '-movflags', '+faststart', final], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{OUT}/hero_txt.mp4', '-i', f'{base}/{voice}', '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                '-c:a', 'aac', '-shortest', '-movflags', '+faststart', f'{OUT}/Temple_Cross3_HeroShot.mp4'], check=True)
if os.path.isdir('/content/drive/MyDrive'):
    os.makedirs('/content/drive/MyDrive/Temple Reels', exist_ok=True)
    for fn in ('Temple_Cross_Part3_3D_v2.mp4', 'Temple_Cross3_HeroShot.mp4'):
        subprocess.run(['cp', f'{OUT}/{fn}', '/content/drive/MyDrive/Temple Reels/'], check=True)
    print('COPIED_TO_DRIVE', flush=True)
print('FINISH_DONE', flush=True)
