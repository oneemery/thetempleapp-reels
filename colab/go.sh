#!/bin/bash
# Temple Colab runner.  usage: curl -sL .../go.sh | bash -s <mode> [args]
set -e
MODE=$1; shift || true
if [ ! -d /content/temple ] || [ "$MODE" = "update" ] || [ "$MODE" = "speed" ]; then
  rm -rf /content/repo /content/temple
  git clone -q --depth 1 --filter=blob:none --sparse https://github.com/oneemery/thetempleapp-reels /content/repo
  (cd /content/repo && git sparse-checkout set colab) && cp -r /content/repo/colab /content/temple
fi
python -c "import bpy" 2>/dev/null || pip -q install bpy==5.3.0
cd /content/temple
case "$MODE" in
  speed)
    for E in eevee cycles; do OUTDIR=/content/test_$E python temple3d.py golgotha $E 290 290 2>&1 | grep -E "AVG|Error|Traceback" | sed "s/^/$E /"; done ;;
  render)  # render SHOT ENGINE [first last step]
    python temple3d.py "$@" 2>&1 | grep -E "frame [0-9]*0 |AVG|Error|Traceback" ;;
  encode)  # encode SHOT -> /content/out/SHOT.mp4
    ffmpeg -v error -y -framerate 30 -i /content/out/$1/f%04d.jpg -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p /content/out/$1.mp4 && ls -la /content/out/$1.mp4 ;;
esac
echo DONE $MODE
