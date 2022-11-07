build:
	cd ./frontend && npx quasar build -m pwa && rm -rf ../backend/src/public/app && cp -r dist/pwa ../backend/src/public/app