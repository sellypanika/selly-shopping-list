import { sql } from "../database.js"; // Corrected import

const create = async (name) => {
    return await sql`INSERT INTO shopping_lists (name, active) VALUES (${name}, TRUE)`;
};

const findAllNonCompletedShoppingLists = async () => {
    return await sql`SELECT * FROM shopping_lists WHERE active = TRUE`;
};

// Function to find items by list ID
const findItemsByListId = async (listId) => {
    return await sql`SELECT * FROM shopping_list_items WHERE shopping_list_id = ${listId}`;
};

// New function to find a shopping list by its ID
const findShoppingListById = async (id) => {
    const result = await sql`SELECT * FROM shopping_lists WHERE id = ${id};`;
    return result[0]; // Return the first matching record
};

// New function to deactivate a shopping list
const deactivate = async (id) => {
    return await sql`UPDATE shopping_lists SET active = FALSE WHERE id = ${id};`;
};

// Function to add an item to a shopping list
const addItem = async (listId, name) => {
    return await sql`INSERT INTO shopping_list_items (shopping_list_id, name, collected) VALUES (${listId}, ${name}, FALSE)`;
};

// Function to mark an item as collected
const collectItem = async (itemId) => {
    return await sql`UPDATE shopping_list_items SET collected = TRUE WHERE id = ${itemId}`;
};

// Function to count all shopping lists
const countAllShoppingLists = async () => {
    const result =
        await sql`SELECT COUNT(*)::int AS count FROM shopping_lists WHERE active = TRUE`;
    return result[0].count; // Access the count from the result structure
};

// Function to count all items
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
