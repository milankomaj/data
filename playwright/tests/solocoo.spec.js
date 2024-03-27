// import { writeFile } from 'node:fs/promises';
const core = require('@actions/core');
const { test, expect } = require('@playwright/test');


test('get other link', async ({ page }) => {
  await page.goto('https://livetv.skylink.cz');
  await page.screenshot({ path: `test-results/goto.png` });
  await expect(page).toHaveTitle(/Skylink/);
  await page.screenshot({ path: `test-results/title.png` });
  await page.locator('css=sc-jOlsSo brnWrd').click({ timeout: 60000 });
  await page.screenshot({ path: `test-results/click.png` });
  await expect(page.getByText('TV')).toBeVisible();
  await page.screenshot({ path: `test-results/visible.png` });

  const token_CZ = await page.evaluate(() => localStorage.getItem("token"));
  console.log("token_CZ: ", token_CZ)
  const data_CZ = String(token_CZ)
  core.exportVariable('token_CZ', data_CZ);

});
