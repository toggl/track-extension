default: dist

dist: clean
	@if [ ! -d "out" ]; then mkdir -p out; fi
	@cp -R src/manifest.json src/images src/scripts src/styles src/html src/sounds out/
	@cd out && find . -path '*/.*' -prune -o -type f -print | zip ../ch_toggl-button.zip -@
	@rm -rf out

clean:
	@if [ -f "ch_toggl-button.zip" ]; then rm ch_toggl-button.zip; fi
	@if [ -f "ff_toggl-button.zip" ]; then rm ff_toggl-button.zip; fi

ff-dist: clean
	@if [ ! -d "out" ]; then mkdir -p out; fi
	@cp src/manifest_ff.json src/manifest.json
	@cp -R src/manifest.json src/images src/scripts src/styles src/html src/sounds out/
	@cd out && find . -path '*/.*' -prune -o -type f -print | zip ../ff_toggl-button.zip -@
	@rm -rf out
	@git checkout .
