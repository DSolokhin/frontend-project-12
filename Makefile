install:
	cd frontend && npm ci

build:
	cd frontend && npm ci && npm run build

start:
	FASTIFY_ADDRESS=0.0.0.0 npx start-server -s ./frontend/dist -p 10000

dev:
	cd frontend && npm run dev

lint:
	cd frontend && npm run lint

.PHONY: install build start dev lint

