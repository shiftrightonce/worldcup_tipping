build:
	cd ./frontend && npx quasar build -m pwa  && cp -rf dist/pwa/* ../backend/src/public/