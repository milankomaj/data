// @ts-check
const { test, expect } = require('@playwright/test');






test('has title', async ({ page }) => {
  await page.goto('https://milankomaj-934e3.firebaseapp.com/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/milankomaj/);
});


test('Page Screenshot', async ({ page }) => {
  await page.goto('https://milankomaj-934e3.firebaseapp.com//');
  await page.screenshot({ path: `test-results/screenshot.png` });
});

test('get other link', async ({ page }) => {
  await page.goto('https://milankomaj-934e3.firebaseapp.com/');

  // Click the get other link.
  await page.getByRole('link', { name: 'other' }).click();

  // Expects page to have a heading with the name of about:.
  await expect(page.getByRole('heading', { name: 'about:' })).toBeVisible();


  // Screenshot before click.
  await page.screenshot({ path: `test-results/click.png` });


  // dark
  await page.locator('#toDark').click();
  await page.goto('https://milankomaj-934e3.firebaseapp.com/');
  await page.screenshot({ path: `test-results/click2.png` });
  await expect(page.getByRole('heading', { name: '©' })).toBeVisible();
});

console.log("👉end: ")
