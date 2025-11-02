import { createServer } from '@hexlet/chat-server';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const staticPath = join(process.cwd(), 'frontend', 'dist');
const port = process.env.PORT || 5001;

// Дебаг информация
console.log('=== DEPLOYMENT DEBUG ===');
console.log('Current directory:', process.cwd());
console.log('Static path:', staticPath);
console.log('Dist exists:', existsSync(staticPath));

if (existsSync(staticPath)) {
  const files = readdirSync(staticPath);
  console.log('Files in dist:', files);
}

console.log('Port:', port);
console.log('Starting server...');

// Запускаем сервер
createServer(staticPath, port);

