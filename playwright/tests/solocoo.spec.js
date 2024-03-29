// import { writeFile } from 'node:fs/promises';
const core = require('@actions/core');
const { test, expect } = require('@playwright/test');


test('CZ', async ({ page }) => {
  await page.goto('https://livetv.skylink.cz');
  await expect(page.getByText('Continue as Free User')).toBeVisible();
  await expect(page).toHaveTitle(/Skylink/);
  // await page.screenshot({ path: `test-results/title.png` });

  await page.getByText('Continue as Free User').click();
  // await page.screenshot({ path: `test-results/click.png` });

  await expect(page.getByText('Live TV')).toBeVisible();
  // await expect(page.getByText('Now on TV')).toBeVisible();
  // await page.screenshot({ path: `test-results/visible.png` });

  const token_CZ = await page.evaluate(() => localStorage.getItem("token"));
  console.log("token_CZ: ", token_CZ)
  const data_CZ = String(token_CZ)
  core.exportVariable('token_CZ', data_CZ);
  core.setOutput('token_CZ', data_CZ);
});

test('SK', async ({ page }) => {
  await page.goto('https://livetv.skylink.sk');
  await expect(page.getByText('Continue as Free User')).toBeVisible();
  await expect(page).toHaveTitle(/Skylink/);
  // await page.screenshot({ path: `test-results/title.png` });

  await page.getByText('Continue as Free User').click();
  // await page.screenshot({ path: `test-results/click.png` });

  await expect(page.getByText('Live TV')).toBeVisible();
  // await expect(page.getByText('Now on TV')).toBeVisible();
  // await page.screenshot({ path: `test-results/visible.png` });

  const token_SK = await page.evaluate(() => localStorage.getItem("token"));
  console.log("token_SK: ", token_SK)
  const data_SK = String(token_SK)
  core.exportVariable('token_SK', data_SK);
  core.setOutput('token_SK', data_SK);
});