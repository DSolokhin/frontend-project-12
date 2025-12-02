install:
	cd frontend && npm ci

build:
	cd frontend && npm run build
	rm -rf dist
	cp -r frontend/dist dist

start:
	npx start-server -s dist -p $${PORT:-5000}

lint:
	cd frontend && npx eslint .

lint-fix:
	cd frontend && npx eslint --fix .
