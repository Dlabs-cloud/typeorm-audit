import { ConnectionOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

export const config: ConnectionOptions = {
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "test",
    "password": "test",
    "database": "test",
    "synchronize": true,
    "logging": false,
    "entities": [
        "src/data/entity/**/*.ts",
        "test/entity/**/*.ts"
    ],
    "migrations": [
        "src/data/migration/**/*.ts"
    ],
    "subscribers": [
        "src/data/subscriber/**/*.ts"
    ],
    "cli": {
        "entitiesDir": "src/data/entity",
        "migrationsDir": "src/data/migration",
        "subscribersDir": "src/data/subscriber"
    },
    namingStrategy: new SnakeNamingStrategy()
}