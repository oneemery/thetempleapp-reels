# bundles images into src/plates.js as data URLs: plates/*.jpg as their name, kit pieces as 'p:name', felt boards as 'b:name'
import base64, glob, os
K = '/home/claude/studio-pkg/kit/' if os.path.isdir('/home/claude/studio-pkg/kit') else '../kit/'
items = []
for f in sorted(glob.glob('plates/*.jpg')): items.append((os.path.basename(f)[:-4], 'image/jpeg', f))
for f in sorted(glob.glob(K + 'webp/*.webp') or glob.glob('/home/claude/kit/webp/*.webp')): items.append(('p:' + os.path.basename(f)[:-5], 'image/webp', f))
for f in sorted(glob.glob(K + 'boards/*.jpg')): items.append(('b:' + os.path.basename(f)[:-4].replace('board_', ''), 'image/jpeg', f))
out = ['window.PLATE_SRC = {'] + [f"  {n!r}: 'data:{m};base64,{base64.b64encode(open(f, 'rb').read()).decode()}'," for n, m, f in items] + ['};']
open('src/plates.js', 'w').write('\n'.join(out) + '\n'); print(len(items), 'images', round(os.path.getsize('src/plates.js') / 1e6, 1), 'MB')
