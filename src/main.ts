/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Bot from './bot';
import keepAlive from './server';

if (process.env.MODE === 'PROD') {
  const server = keepAlive();
  server.listen(process.env.PORT, () => {
    console.info(
      `⚡️[server]: Server is running at http://localhost:${process.env.PORT}`
    );
  });
}

const bot = Bot.getInstance();
