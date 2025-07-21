#!/bin/sh

cd /app/server && node index.js &
sleep 5  # Attendi che il server si avvii
cd /app && npm run preview -- --host 0.0.0.0