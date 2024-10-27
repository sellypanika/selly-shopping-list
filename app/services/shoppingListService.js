import { sql } from "../database.js";

const create = async (name) => {
    return await sql`INSERT INTO shopping_lists (name, active) VALUES (${name}, TRUE)`;
};

const findAllNonCompletedShoppingLists = async () => {
    return await sql`SELECT * FROM shopping_lists WHERE active = TRUE`;
};

const findItemsByListId = async (listId) => {
    return await sql`SELECT * FROM shopping_list_items WHERE shopping_list_id = ${listId}`;
};
const findShoppingListById = async (id) => {
    const result = await sql`SELECT * FROM shopping_lists WHERE id = ${id};`;
    return result[0];
};

const deactivate = async (id) => {
    return await sql`UPDATE shopping_lists SET active = FALSE WHERE id = ${id};`;
};

const addItem = async (listId, name) => {
    return await sql`INSERT INTO shopping_list_items (shopping_list_id, name, collected) VALUES (${listId}, ${name}, FALSE)`;
};

const collectItem = async (itemId) => {
    return await sql`UPDATE shopping_list_items SET collected = TRUE WHERE id = ${itemId}`;
};

const countAllShoppingLists = async () => {
    const result =
        await sql`SELECT COUNT(*)::int AS count FROM shopping_lists WHERE active = TRUE`;
    return result[0].count;
};

const countAllItems = async () => {
    const result =
        await sql`SELECT COUNT(*)::int AS count FROM shopping_list_items WHERE shopping_list_id IN (SELECT id FROM shopping_lists WHERE active = TRUE) `;
    return result[0].count;
};

export {
    addItem,
    collectItem,
    countAllItems,
    countAllShoppingLists,
    create,
    deactivate,
    findAllNonCompletedShoppingLists,
    findItemsByListId,
    findShoppingListById,
};
