#!/bin/bash
# Temple Colab runner.  usage: curl -sL .../go.sh | bash -s <mode> [args]
set -e
MODE=$1; shift || true
if [ -d /content/repo/.git ]; then
  (cd /content/repo && git pull -q)
else
  git clone -q --depth 1 --filter=blob:none --sparse https://github.com/oneemery/thetempleapp-reels /content/repo
  (cd /content/repo && git sparse-checkout set colab)
fi
rm -rf /content/temple && cp -r /content/repo/colab /content/temple
python -c "import bpy" 2>/dev/null || pip -q install bpy==5.3.0
cd /content/temple
case "$MODE" in
  speed)
    for E in eevee cycles; do OUTDIR=/content/test_$E python temple3d.py golgotha $E 290 290 2>&1 | grep --line-buffered -E "AVG|Error|Traceback" | sed "s/^/$E /"; done ;;
  render)  # render SHOT ENGINE [first last step]
    python temple3d.py "$@" 2>&1 | grep --line-buffered -E "frame [0-9]*0 |AVG|Error|Traceback" ;;
  all)  # render every shot, then composite
    for S in golgotha walls rise; do python temple3d.py $S ${1:-cycles} 2>&1 | grep --line-buffered -E "frame [0-9]*00 |AVG|Error|Traceback"; done
    pip -q install playwright && python -m playwright install --with-deps chromium > /dev/null 2>&1
    python composite.py ;;
  composite)
    pip -q install playwright && python -m playwright install --with-deps chromium > /dev/null 2>&1
    python composite.py ;;
  encode)  # encode SHOT -> /content/out/SHOT.mp4
    ffmpeg -v error -y -framerate 30 -i /content/out/$1/f%04d.jpg -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p /content/out/$1.mp4 && ls -la /content/out/$1.mp4 ;;
esac
echo DONE $MODE
