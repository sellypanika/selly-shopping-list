import db from "../database.js";

const shoppingListItemsService = {
    async getAll() {
        const result = await db.query("SELECT * FROM shopping_list_items");
        return result.rows;
    },
};

export default shoppingListItemsService;
