import { render } from "https://deno.land/x/eta@v2.2.0/mod.ts";
import shoppingListItemsService from "../services/shoppingListItemsServices.js";

const shoppingListItemsController = {
    async getAll() {
        // Retrieve all items using the service function
        const items = await shoppingListItemsService.getAll();

        // Render the 'shoppingListItems.eta' template with the retrieved items
        return render("views/shoppingListItems.eta", { items });
    },
};

export default shoppingListItemsController;
