#!/bin/bash
# usage: bash herorun.sh   (run from /content after extracting the bundle to /content/temple)
cd /content/temple
python -c "import bpy" 2>/dev/null || pip -q install bpy==5.3.0
python hero.py 2>&1 | grep --line-buffered -E "hero frame|HERO_DONE|Error|Traceback"
python -c "import playwright" 2>/dev/null || pip -q install playwright
python -m playwright install --with-deps chromium > /dev/null 2>&1
python hero_finish.py
echo ALL_DONE
