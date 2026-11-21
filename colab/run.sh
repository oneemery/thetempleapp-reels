#!/bin/bash
# usage: bash run.sh SHOT ENGINE FIRST LAST STEP
cd /content/temple && python temple3d.py "$@" 2>&1 | grep -E "frame|AVG|Error|Traceback"
