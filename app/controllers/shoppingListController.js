import * as shoppingListService from "../services/shoppingListService.js";
import { renderFile } from "https://deno.land/x/eta@v2.2.0/mod.ts";

const responseDetails = {
    headers: { "Content-Type": "text/html; charset=utf-8" },
};

// Function to add a shopping list
const addShoppingList = async (request) => {
    const body = await request.formData();
    const name = body.get("name");

    await shoppingListService.create(name);

    return new Response(`Shopping list "${name}" added.`, {
        status: 303,
        headers: { Location: "/lists" },
    });
};

// Function to view all shopping lists
const viewShoppingLists = async (_request) => {
    const shoppingLists = await shoppingListService
        .findAllNonCompletedShoppingLists();

    // Fetch items for each shopping list
    for (const list of shoppingLists) {
        list.items = await shoppingListService.findItemsByListId(list.id);
    }

    const data = { shoppingLists };
    return new Response(
        await renderFile("shoppingLists.eta", data),
        responseDetails,
    );
};

// Function to view the main page with statistics
const viewMainPage = async () => {
    const totalShoppingLists = await shoppingListService
        .countAllShoppingLists();
    const totalShoppingListItems = await shoppingListService.countAllItems();

    const data = {
        shoppingListCount: totalShoppingLists,
        shoppingListItemCount: totalShoppingListItems,
    };

    return new Response(
        await renderFile("mainPage.eta", data),
        responseDetails,
    );
};

// Function to view a shopping list by ID
const viewShoppingListById = async (request) => {
    const url = new URL(request.url);
    const listId = url.pathname.split("/").pop(); // Get the last segment of the path

    const shoppingList = await shoppingListService.findShoppingListById(listId);
    console.log("Shopping List Retrieved:", shoppingList); // Debug log

    if (!shoppingList) {
        return new Response("Shopping list not found", { status: 404 });
    }

    const items = await shoppingListService.findItemsByListId(listId);
    const data = { shoppingList, items };

    console.log("Data being passed to the template:", data); // Debug log

    return new Response(
        await renderFile("shoppingListDetail.eta", data), // Ensure the template name is correct
        responseDetails,
    );
};

// Function to deactivate a shopping list
const deactivateShoppingList = async (request) => {
    const url = new URL(request.url);
    const listId = url.pathname.split("/").slice(-2, -1)[0]; // Get the last segment of the path

    await shoppingListService.deactivate(listId); // Call the service to deactivate the list

    return new Response(null, {
        status: 303,
        headers: { Location: "/lists" }, // Redirect to the lists page
    });
};

const addItemToShoppingList = async (request) => {
    const url = new URL(request.url);
    const listId = url.pathname.split("/")[2]; // Extract the list ID from the URL
    const body = await request.formData();
    const name = body.get("name");

    await shoppingListService.addItem(listId, name);

    return new Response(null, {
        status: 303,
        headers: { Location: `/lists/${listId}` }, // Redirect back to the shopping list
    });
};

const collectItem = async (request) => {
    const url = new URL(request.url);
    const listId = url.pathname.split("/")[2]; // Extract list ID from URL
    const itemId = url.pathname.split("/")[4]; // Extract item ID from URL

    // Call your service function to update the item
    await shoppingListService.collectItem(itemId);

    // Redirect back to the shopping list detail page
    return Response.redirect(new URL(`/lists/${listId}`, request.url), 302);
};

export {
    addItemToShoppingList,
    addShoppingList,
    collectItem,
    deactivateShoppingList,
    viewMainPage, // Export the new function
    viewShoppingListById,
    viewShoppingLists,
};
