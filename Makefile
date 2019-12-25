SALESFORCE_CLIENT_ID := "3MVG9yZ.WNe6byQBYCaGTfGZBI242shnVTHgzqwWYLIsBR8CLxuYI1e7e3p3S48nyTgT3lvoCylIjvxjx7Pt."
SALESFORCE_REDIRECT_URI_DEV := "http://localhost:8080"
SALESFORCE_REDIRECT_URI := "https://tzmfreedom.github.io/salesfOS/"

.PHONY: build
build:
	npx webpack --mode production

.PHONY: start
start: $(eval SALESFORCE_REDIRECT_URI=$(SALESFORCE_REDIRECT_URI_DEV))
start:
	npx webpack-dev-server --open --mode development

.PHONY: deploy
deploy:
	$(MAKE) build
	npx gh-pages -d dist

