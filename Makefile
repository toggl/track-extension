default: lint

lint: node_modules/.bin/jslint
	@$< src/scripts/*.js src/scripts/content/*.js

node_modules/.bin/jslint:
	npm install

dist: clean
	@if [ ! -d "out" ]; then mkdir -p out; fi
	@cp -R src/manifest.json src/images src/scripts src/styles src/html src/sounds out/
	@cd out && find . -path '*/.*' -prune -o -type f -print | zip ../ch_toggl-button.zip -@
	@rm -rf out

clean:
	@if [ -f "ch_toggl-button.zip" ]; then rm ch_toggl-button.zip; fi
	@if [ -f "ff_toggl-button.zip" ]; then rm ff_toggl-button.zip; fi

authors:
	#git log --format='%aN <%aE>' | awk '{arr[$0]++} END{for (i in arr){print arr[i], i;}}' | sort -rn | cut -d\  -f2- > AUTHORS
	@echo "Seems to not work for some reason. Copy manually the command from Makefile"

ff-dist: clean
	@if [ ! -d "out" ]; then mkdir -p out; fi
	@cp src/manifest_ff.json src/manifest.json
	@cp -R src/manifest.json src/images src/scripts src/styles src/html src/sounds out/
	@cd out && find . -path '*/.*' -prune -o -type f -print | zip ../ff_toggl-button.zip -@
	@rm -rf out
	@git checkout .