import "reflect-metadata"
import { config } from 'dotenv'
import { DataSource } from "typeorm"

config()

export const env = (name: string, defaultValue: unknown = null) => {
    const value = process.env[name]
    if (value) {
        const cast = {
            'true': true,
            'false': false,
        }

        const toLower = value.toString().toLocaleLowerCase();
        if (cast[toLower] !== undefined) {
            return cast[toLower];
        }
    }

    return value || defaultValue
}

export const AppDataSource = new DataSource({
    type: env('DATABASE_DRIVER', 'mysql'),
    host: env('DATABASE_HOST', 'db'),
    port: env('DATABASE_PORT', 3306),
    username: env('DATABASE_USERNAME', 'root'),
    password: env('DATABASE_PASSWORD', 'dbpassword'),
    database: env('DATABASE_DATABASE', 'worldcup'),
    synchronize: env('DATABASE_SYNCHRONIZE', false),
    logging: env('DATABASE_LOGGING', false),
    entities: ["src/entity/**/*.ts"],
    migrations: [
        "src/migration/**/*.ts"
    ],
    subscribers: [
        "src/subscriber/**/*.ts"
    ],
})
