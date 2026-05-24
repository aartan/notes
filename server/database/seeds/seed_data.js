/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  await knex('sessions').del();
  await knex('notes').del();
  await knex('users').del();

  const [user] = await knex('users')
      .insert({
        username: 'demo_user',
        email: 'demo@example.com',
        password_hash: 'hashed_password'
      })
      .returning('id');

  await knex('notes').insert([
    {
      title: 'First Note',
      note: 'This is a seeded note.',
      author_id: user.id
    }
  ]);
}
