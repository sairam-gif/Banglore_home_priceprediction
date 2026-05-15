import { test, expect } from '@playwright/test';

test.describe('Bangalore House Price Prediction E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage and show title', async ({ page }) => {
    await expect(page.locator('header').getByText('LumeHome')).toBeVisible();
  });

  test('should show prediction result after filling form', async ({ page }) => {
    // Fill form
    await page.locator('input[id="location"]').fill('Electronic City');
    // Wait for the dropdown to appear and then click the first item
    await page.waitForSelector('ul[class*="shadow-lg"] li');
    await page.locator('ul[class*="shadow-lg"] li').filter({ hasText: 'Electronic City' }).first().click(); 
    
    await page.locator('input[id="area"]').fill('1500'); // Area
    await page.locator('select[id="bedrooms"]').selectOption('3'); // BHK
    
    // Check an amenity
    await page.locator('input[name="Gymnasium"]').check();

    // Check if the Predict button is enabled
    const predictButton = page.getByRole('button', { name: 'Get Prediction' });
    await expect(predictButton).toBeEnabled();

    // Click Predict
    await predictButton.click();
    
    // Check if result appears
    await expect(page.locator('h3', { hasText: 'Predicted Price:' })).toBeVisible();
    await expect(page.locator('p').filter({ hasText: '₹' }).first()).toBeVisible();
  });

  test('should display analytics charts', async ({ page }) => {
    await page.getByRole('button', { name: 'Insights' }).click();
    // Check if the Bar chart container exists (more specific locator)
    await expect(page.locator('.h-\\[300px\\] > .recharts-responsive-container')).toBeVisible();
  });

  test('should load the interactive map', async ({ page }) => {
    await page.getByRole('button', { name: 'Map' }).click();
    // Check if Leaflet map is loaded
    await expect(page.locator('.leaflet-container')).toBeVisible();
  });
});
