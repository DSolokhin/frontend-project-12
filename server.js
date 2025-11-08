import { createServer } from '@hexlet/chat-server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const staticPath = join(process.cwd(), 'frontend', 'dist');
const port = process.env.PORT || 10000;

process.env.FASTIFY_ADDRESS = '0.0.0.0';

console.log('=== Starting SPA Server ===');
console.log('Port:', port);
console.log('Static path:', staticPath);

// Используем Fastify для SPA роутинга
const fastify = require('fastify')({
  logger: true
});

// Обслуживаем статические файлы
fastify.register(require('@fastify/static'), {
  root: staticPath,
  prefix: '/',
});

// SPA fallback - все маршруты ведут на index.html
fastify.setNotFoundHandler((request, reply) => {
  reply.sendFile('index.html');
});

// Запускаем сервер
fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
