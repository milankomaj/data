// @ts-check
const { test, expect, defineConfig } = require('@playwright/test');
export default defineConfig({
  use: {
    video: 'on-first-retry',
  },
});




test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});


test('Page Screenshot', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.screenshot({ path: `test-results/screenshot.png` });


});

test('get started link', async ({ page, browser }) => {
  await page.goto('https://playwright.dev/');

  const context = await browser.newContext({ recordVideo: { dir: 'test-results/' } });
  // Make sure to await close, so that videos are saved.
  await context.close();


  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();

  // Screenshot before click.
  await page.screenshot({ path: `test-results/click.png` });



});

console.log("👉end: ")
