const { test, expect } = require("@playwright/test");

test("Can add a shopping list", async ({ page }) => {
  await page.goto("/lists");
  await page.locator("input[name='name']").type("Grocery List");
  await page.locator("input[type=submit]").click();
  await expect(page.locator("ul")).toContainText("Grocery List");
});

test("Can view a single shopping list", async ({ page }) => {
  await page.goto("/lists");
  await page.locator("a >> text='Grocery List'").click();
  await expect(page.locator("h1")).toHaveText("Shopping List: Grocery List");
});

test("Can add items to a shopping list", async ({ page }) => {
  await page.goto("/lists/1");
  await page.locator("input[name='name']").type("Eggs");
  await page.locator("input[type=submit]").click();
  await expect(page.locator("ul")).toContainText("Eggs");
});

test("Can mark an item as collected", async ({ page }) => {
  await page.goto("/lists/1");
  await page.locator("input[type=checkbox]").first().check();
  await expect(page.locator("li")).toHaveCSS("text-decoration", "line-through");
});

test("Can deactivate a shopping list", async ({ page }) => {
  await page.goto("/lists");
  await page.locator("button >> text='Deactivate list!'").first().click();
  await expect(page.locator("ul")).not.toContainText("Grocery List");
});
