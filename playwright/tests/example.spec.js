
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
  await page.getByRole('link', { name: 'other' }).click({ timeout: 20000 });

  // Expects page to have a heading with the name of about:.
  await expect(page.getByRole('heading', { name: 'about:' })).toBeVisible();


  // Screenshot before click.
  await page.screenshot({ path: `test-results/click.png` });


  // dark
  await page.locator('xpath=//*[@id="toDark"]').click();
  const theme = await page.evaluate(() => sessionStorage.getItem("theme"));
  console.log("👉 theme: ", theme)
  await page.goto('https://milankomaj-934e3.firebaseapp.com/');
  await page.screenshot({ path: `test-results/click2.png` });
  await expect(page.locator('xpath=//*[@id="loadPage"]')).toBeVisible();
});
console.log("👉 end: ")
