#!/bin/bash
# Startup script for Hostinger shared hosting
# Sets minimal thread pool size to avoid pthread_create errors

export UV_THREADPOOL_SIZE=1
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=256"

# Run the standalone server
node .next/standalone/server.js
