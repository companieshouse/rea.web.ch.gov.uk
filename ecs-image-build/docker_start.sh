#!/bin/bash
#
# Start script for registered email address web

PORT=3000

export NODE_PORT=${PORT}
exec node /app/server.js -- ${PORT}