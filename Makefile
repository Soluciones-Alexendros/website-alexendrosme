# Targets de flota P1: delegan en scripts npm del package.json.
.PHONY: validate test smoke build typecheck lint

validate: typecheck lint test

typecheck:
	npm run typecheck

lint:
	npm run lint

test:
	npm test

smoke:
	npm run smoke

build:
	npm run build
