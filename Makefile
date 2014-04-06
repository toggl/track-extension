default: lint

lint:
	jslint src/scripts/*.js src/scripts/content/*.js

dist: clean
	@if [ ! -d "out" ]; then mkdir -p out; fi
	@cp -R src/manifest.json src/images src/scripts src/styles out/
	@zip -q -r toggl-button out && rm -rf out

clean:
	@if [ -f "toggl-button.zip" ]; then rm toggl-button.zip; fi
