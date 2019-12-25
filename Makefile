SALESFORCE_CLIENT_ID := "3MVG9yZ.WNe6byQBYCaGTfGZBI242shnVTHgzqwWYLIsBR8CLxuYI1e7e3p3S48nyTgT3lvoCylIjvxjx7Pt."
SALESFORCE_REDIRECT_URI_DEV := "http://localhost:8080"
SALESFORCE_REDIRECT_URI := "https://tzmfreedom.github.io/salesfOS/"

.PHONY: build
build:
	npm run build

.PHONY: start
start:
	npm run start

.PHONY: deploy
deploy:
	$(MAKE) build 
	npx gh-pages -d dist

