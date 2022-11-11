import { createClient } from 'redis'
import { env } from "./data-source"


let connection: null | ReturnType<typeof createClient> = null;

export const getRedisConnection = async (newConnection = false) => {
  if (newConnection) {
    const conn = createClient({ url: env('REDIS_URL', 'redis://redisdb') });
    await conn.connect();
    return conn
  }

  if (connection === null) {
    connection = createClient({ url: env('REDIS_URL', 'redis://redisdb') });
    await connection.connect();
  }

  return connection
}