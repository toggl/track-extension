default: lint

lint: node_modules/.bin/jslint
	@$< src/scripts/*.js src/scripts/content/*.js

node_modules/.bin/jslint:
	npm install

dist: clean
	@if [ ! -d "out" ]; then mkdir -p out; fi
	@cp -R src/manifest.json src/images src/scripts src/styles src/html src/sounds out/
	@zip -q -r toggl-button out && rm -rf out

clean:
	@if [ -f "toggl-button.zip" ]; then rm toggl-button.zip; fi

authors:
	git log --all --format='%aN <%cE>' | sort -u > AUTHORS
