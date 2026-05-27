import db from "../database/db.js";

export async function getAllUsers() {
    return await db("users").select("*");
}

export async function getUserById(id) {
    return db("users")
        .where({id})
        .first();
}

export async function createUser( username, email, password_hash ) {
    const [user] = await db("users")
        .insert({ username, email, password_hash })
        .returning("*");

    return user;
}

export async function updateUser(id, updates) {
    const [user] = await db("users")
        .where({ id })
        .update(updates)
        .returning("*");

    return user;
}

export async function deleteUser(id) {
    return db("users")
        .where({id})
        .del();
}