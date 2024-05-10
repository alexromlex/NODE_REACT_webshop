import { createServer } from './server';
import 'dotenv/config';

const server = createServer();
const PORT = process.env.PORT;

console.log('NODE_ENV: ', process.env.NODE_ENV);

server.listen(PORT, () => {
  console.log('Running on port: ' + PORT + ' URL: http://' + process.env.HOST + ':' + process.env.PORT);
});
