// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {
    client: 'postgresql',
    connection: {
      database: 'Notes',
      user:     'postgres',
      password: 'walaala1'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      directory: './migrations',
    },
    seeds: {
        directory: './seeds',
    },
};

export default config;