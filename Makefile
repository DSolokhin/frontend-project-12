build:
	cd frontend && npm ci && npm run build

start:
	FASTIFY_ADDRESS=0.0.0.0 npx start-server -s ./frontend/dist -p $PORT

dev:
	cd frontend && npm run dev

.PHONY: build start dev