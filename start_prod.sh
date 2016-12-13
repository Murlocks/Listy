ASSIGNED_PORT=18668

export PORT=${ASSIGNED_PORT}; export NODE_ENV=production; ~/usr/local/lib/node_modules/.bin/forever -o ~/var/log/app.log -e ~/var/log/app_error.log start dist/bin/www
