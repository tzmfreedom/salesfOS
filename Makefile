.PHONY: build
build:
	NODE_ENV=prod npx webpack --mode production

.PHONY: start
start:
	NODE_ENV=dev npx webpack-dev-server --open --mode development

.PHONY: deploy
deploy: build
	npx gh-pages -d dist

