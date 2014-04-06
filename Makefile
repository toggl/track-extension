lint:
	jslint scripts/*.js scripts/content/*.js

dist:
	@if [ ! -d "out" ]; then mkdir -p out; fi
	@cp -R manifest.json images scripts styles out/
	@zip -q -r toggl-button out && rm -rf out
