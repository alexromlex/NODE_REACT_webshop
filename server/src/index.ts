import { createApp } from './server';
import 'dotenv/config';

const app = createApp();
const PORT = process.env.PORT;

console.log('NODE_ENV: ', process.env.NODE_ENV);

const server = app.listen(PORT, () => {
  console.log('Running on port: ' + PORT + ' URL: http://' + process.env.HOST + ':' + process.env.PORT);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
  });
});
