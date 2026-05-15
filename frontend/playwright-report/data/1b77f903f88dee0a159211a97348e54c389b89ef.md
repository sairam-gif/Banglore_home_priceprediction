# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: prediction.spec.ts >> Bangalore House Price Prediction E2E >> should show prediction result after filling form
- Location: tests\prediction.spec.ts:12:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('ul[class*="shadow-lg"] li') to be visible

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Bangalore House Price Prediction E2E', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('should load the homepage and show title', async ({ page }) => {
  9  |     await expect(page.locator('header').getByText('LumeHome')).toBeVisible();
  10 |   });
  11 | 
  12 |   test('should show prediction result after filling form', async ({ page }) => {
  13 |     // Fill form
  14 |     await page.locator('input[id="location"]').fill('Electronic City');
  15 |     // Wait for the dropdown to appear and then click the first item
> 16 |     await page.waitForSelector('ul[class*="shadow-lg"] li');
     |                ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  17 |     await page.locator('ul[class*="shadow-lg"] li').filter({ hasText: 'Electronic City' }).first().click(); 
  18 |     
  19 |     await page.locator('input[id="area"]').fill('1500'); // Area
  20 |     await page.locator('select[id="bedrooms"]').selectOption('3'); // BHK
  21 |     
  22 |     // Check an amenity
  23 |     await page.locator('input[name="Gymnasium"]').check();
  24 | 
  25 |     // Check if the Predict button is enabled
  26 |     const predictButton = page.getByRole('button', { name: 'Get Prediction' });
  27 |     await expect(predictButton).toBeEnabled();
  28 | 
  29 |     // Click Predict
  30 |     await predictButton.click();
  31 |     
  32 |     // Check if result appears
  33 |     await expect(page.locator('h3', { hasText: 'Predicted Price:' })).toBeVisible();
  34 |     await expect(page.locator('p').filter({ hasText: '₹' }).first()).toBeVisible();
  35 |   });
  36 | 
  37 |   test('should display analytics charts', async ({ page }) => {
  38 |     await page.getByRole('button', { name: 'Insights' }).click();
  39 |     // Check if the Bar chart container exists (more specific locator)
  40 |     await expect(page.locator('.h-\\[300px\\] > .recharts-responsive-container')).toBeVisible();
  41 |   });
  42 | 
  43 |   test('should load the interactive map', async ({ page }) => {
  44 |     await page.getByRole('button', { name: 'Map' }).click();
  45 |     // Check if Leaflet map is loaded
  46 |     await expect(page.locator('.leaflet-container')).toBeVisible();
  47 |   });
  48 | });
  49 | 
```