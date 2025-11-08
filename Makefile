build:
	cd frontend && npm ci && npm run build

start:
	FASTIFY_ADDRESS=0.0.0.0 npx start-server -s ./frontend/dist -p 10000

.PHONY: build start
