// import { writeFile } from 'node:fs/promises';
const core = require('@actions/core');
const { test, expect } = require('@playwright/test');
/*
await page.on('console', msg => console.log(msg.text()));


await page.on('console', msg => {
  if (msg.type() === 'error')
    console.log(`Error text: "${msg.text()}"`);
});
*/


test('has title', async ({ page }) => {
  console.log("👉 1: ")
  await page.goto('https://milankomaj-934e3.firebaseapp.com/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/milankomaj/);
});


test('Page Screenshot', async ({ page }) => {
  console.log("👉 2: ")
  await page.goto('https://milankomaj-934e3.firebaseapp.com//');
  await page.screenshot({ path: `test-results/screenshot.png` });
});

test('get other link', async ({ page }) => {
  console.log("👉 3: ")
  await page.goto('https://milankomaj-934e3.firebaseapp.com/');

  // Click the get other link.
  await page.getByRole('link', { name: 'other' }).click();

  // Expects page to have a heading with the name of about:.
  await expect(page.getByRole('heading', { name: 'about:' })).toBeVisible();


  // Screenshot before click.
  await page.screenshot({ path: `test-results/click.png` });


  // togle theme
  await page.locator('xpath=//*[@id="toDark"]').click({ timeout: 20000 });
  const theme = await page.evaluate(() => sessionStorage.getItem("theme"));
  console.log("👉 theme: ", theme)
  await page.goto('https://milankomaj-934e3.firebaseapp.com/');
  await page.screenshot({ path: `test-results/click2.png` });


});


test('Page Screenshot 2', async ({ page }) => {
  console.log("👉 4: ")
  await page.goto('https://milankomaj-934e3.firebaseapp.com//');
  const theme = await page.evaluate(() => sessionStorage.getItem("theme"));

  // togle theme
  await page.locator('xpath=//*[@id="toDark"]').click({ timeout: 20000 });
  console.log("👉 theme: ", theme)
  await page.screenshot({ path: `test-results/click3.png` });


  const data = String(theme)
  // const promise = writeFile('test-results/message.txt', data);
  // await promise;
  core.exportVariable('theme', data);
});
