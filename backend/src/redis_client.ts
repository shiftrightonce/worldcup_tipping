import { createClient } from 'redis'
import { env } from "./data-source"


let connection: null | ReturnType<typeof createClient> = null;

export const getRedisConnection = async ()  => {
  if (connection === null) {
    console.log('creating redis client...')

    connection = createClient({ url: env('REDIS_URL', 'redis://redisdb') });
    await connection.connect();
  }

  return connection
}