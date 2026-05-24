/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex) {
    // Enable UUID generation
    await knex.raw(`
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);

    // Users table
    await knex.raw(`
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);

    // Notes table
    await knex.raw(`
        CREATE TABLE notes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR(255),
            note TEXT NOT NULL,
            author_id UUID NOT NULL
                REFERENCES users(id)
                ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            is_deleted BOOLEAN NOT NULL DEFAULT FALSE
        );
    `);

    // Sessions table
    await knex.raw(`
        CREATE TABLE sessions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL
                REFERENCES users(id)
                ON DELETE CASCADE,
            token TEXT NOT NULL UNIQUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            expires_at TIMESTAMPTZ NOT NULL
        );
    `);
}

export async function down(knex) {
    // Drop child tables first because of foreign keys
    await knex.raw(`DROP TABLE IF EXISTS sessions;`);
    await knex.raw(`DROP TABLE IF EXISTS notes;`);
    await knex.raw(`DROP TABLE IF EXISTS users;`);
}
