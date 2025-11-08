install:
	npm ci

start:
	npx start-server -s ./frontend/dist

develop:
	make start & cd frontend && npm run dev

build:
	npm run build

lint:
	cd frontend && npm run lint

.PHONY: install start develop build lint
