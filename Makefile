install:
	npm install

build:
	cd frontend && npm run build

start:
	npx start-server -s ./frontend/dist

develop:
	cd frontend && npm run dev

dev-server:
	npx start-server

.PHONY: install build start develop dev-server