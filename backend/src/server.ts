import 'dotenv/config';
import { createApp } from './app';
import { prisma } from './config/prisma';

async function bootstrap(): Promise<void> {
  await prisma.$connect();
  console.log('✅ Postgres connected');

  const app = createApp();
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));

  let shuttingDown = false;
  const shutdown = async (signal: string): Promise<void> => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`${signal} received, shutting down...`);

    server.close(async (err) => {
      if (err) {
        console.error('Error while closing HTTP server:', err);
      }
      await prisma.$disconnect();
      process.exit(err ? 1 : 0);
    });
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    void shutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
    void shutdown('unhandledRejection');
  });
}

bootstrap().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
