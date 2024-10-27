import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { configure } from "https://deno.land/x/eta@v2.2.0/mod.ts";
import * as shoppingListController from "./controllers/shoppingListController.js"; // Importing the controller

configure({
  views: `${Deno.cwd()}/views/`,
  cache: false,
});

const _responseDetails = {
  headers: { "Content-Type": "text/html; charset=utf-8" },
};

const handleRequest = async (request) => {
  const url = new URL(request.url);

  if (url.pathname === "/" && request.method === "GET") {
    // Call the updated function and use its response to render the main page
    return await shoppingListController.viewMainPage(request); // Correctly call viewMainPage here
  } else if (url.pathname === "/lists" && request.method === "POST") {
    return await shoppingListController.addShoppingList(request);
  } else if (url.pathname === "/lists" && request.method === "GET") {
    return await shoppingListController.viewShoppingLists(request);
  } else if (url.pathname.startsWith("/lists/")) {
    const _listId = url.pathname.split("/")[2]; // Extract the list ID from the URL

    if (request.method === "GET") {
      return await shoppingListController.viewShoppingListById(request);
    } else if (request.method === "POST") {
      if (url.pathname.endsWith("/deactivate")) {
        return await shoppingListController.deactivateShoppingList(request);
      } else if (url.pathname.endsWith("/collect")) {
        return await shoppingListController.collectItem(request); // Correctly call collectItem from the controller
      } else if (url.pathname.endsWith("/items")) {
        return await shoppingListController.addItemToShoppingList(request);
      }
    }
  }

  return new Response("Not found", { status: 404 });
};

serve(handleRequest, { port: 7777 });
