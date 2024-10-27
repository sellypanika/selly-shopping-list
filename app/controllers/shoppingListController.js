import * as shoppingListService from "../services/shoppingListService.js";
import { renderFile } from "https://deno.land/x/eta@v2.2.0/mod.ts";

const responseDetails = {
    headers: { "Content-Type": "text/html; charset=utf-8" },
};

const addShoppingList = async (request) => {
    const body = await request.formData();
    const name = body.get("name");

    await shoppingListService.create(name);

    return new Response(`Shopping list "${name}" added.`, {
        status: 303,
        headers: { Location: "/lists" },
    });
};

const viewShoppingLists = async (_request) => {
    const shoppingLists = await shoppingListService
        .findAllNonCompletedShoppingLists();

    for (const list of shoppingLists) {
        list.items = await shoppingListService.findItemsByListId(list.id);
    }

    const data = { shoppingLists };
    return new Response(
        await renderFile("shoppingLists.eta", data),
        responseDetails,
    );
};

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

const viewShoppingListById = async (request) => {
    const url = new URL(request.url);
    const listId = url.pathname.split("/").pop();

    const shoppingList = await shoppingListService.findShoppingListById(listId);
    console.log("Shopping List Retrieved:", shoppingList);

    if (!shoppingList) {
        return new Response("Shopping list not found", { status: 404 });
    }

    const items = await shoppingListService.findItemsByListId(listId);
    const data = { shoppingList, items };

    console.log("Data being passed to the template:", data);

    return new Response(
        await renderFile("shoppingListDetail.eta", data),
        responseDetails,
    );
};

const deactivateShoppingList = async (request) => {
    const url = new URL(request.url);
    const listId = url.pathname.split("/").slice(-2, -1)[0];

    await shoppingListService.deactivate(listId);

    return new Response(null, {
        status: 303,
        headers: { Location: "/lists" },
    });
};

const addItemToShoppingList = async (request) => {
    const url = new URL(request.url);
    const listId = url.pathname.split("/")[2];
    const body = await request.formData();
    const name = body.get("name");

    await shoppingListService.addItem(listId, name);

    return new Response(null, {
        status: 303,
        headers: { Location: `/lists/${listId}` },
    });
};

const collectItem = async (request) => {
    const url = new URL(request.url);
    const listId = url.pathname.split("/")[2];
    const itemId = url.pathname.split("/")[4];

    await shoppingListService.collectItem(itemId);

    return Response.redirect(new URL(`/lists/${listId}`, request.url), 302);
};

export {
    addItemToShoppingList,
    addShoppingList,
    collectItem,
    deactivateShoppingList,
    viewMainPage,
    viewShoppingListById,
    viewShoppingLists,
};
