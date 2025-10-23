#!/bin/bash
cd /home/kavia/workspace/code-generation/demo-5458-5738/FrontendWebApplication
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

