/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
const server = express();

server.get('/', (req: any, res: any) => {
  res.send('poc running');
});

function keepAlive() {
  return server;
}

export default keepAlive;
