.PHONY: build start install

install: build

build:
	npm ci
	cd frontend && npm ci && npm run build
	cp -r frontend/dist ./dist

start:
	FASTIFY_ADDRESS=0.0.0.0 npx start-server -s ./dist -p $${PORT:-5000}