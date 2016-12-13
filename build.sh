OUTPUT_DIR='dist'

if [ -d ${OUTPUT_DIR} ]; then
    rm -r './dist'
fi
mkdir -p './dist/bin'

cp "./package.json" "./${OUTPUT_DIR}/package.json"
cp "./bin/www" "./${OUTPUT_DIR}/bin/www"

babel "./api" --out-dir "./${OUTPUT_DIR}/api"
babel "./models" --out-dir "./${OUTPUT_DIR}/models"
babel "./db.js" --out-file "./${OUTPUT_DIR}/db.js"
babel "./server.js" --out-file "./${OUTPUT_DIR}/server.js"

cd client && npm run build && cp -r "./build" "../${OUTPUT_DIR}/public"
