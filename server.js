import { createServer } from '@hexlet/chat-server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const staticPath = join(process.cwd(), 'frontend', 'dist');
const port = process.env.PORT || 10000;

process.env.FASTIFY_ADDRESS = '0.0.0.0';

console.log('=== Starting Server ===');
console.log('Port:', port);
console.log('Static path:', staticPath);

// Проверяем что dist существует
if (existsSync(staticPath)) {
  console.log('✓ dist folder exists');
  const files = require('fs').readdirSync(staticPath);
  console.log('Files:', files);
} else {
  console.error('✗ dist folder not found!');
  process.exit(1);
}

// Запускаем стандартный сервер
createServer(staticPath, port);
