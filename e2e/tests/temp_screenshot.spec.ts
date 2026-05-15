// e2e/tests/temp_screenshot.spec.ts
import { test, expect } from '@playwright/test';

test('take screenshot of homepage for layout gap analysis', async ({ page }) => {
  // Navigate to the base URL, which is typically the root of the frontend app.
  // The frontend/playwright.config.ts specifies baseURL as http://localhost:3000
  await page.goto('/');
  // Capture the entire page to identify any unnecessary spaces or gaps.
  await expect(page).toHaveScreenshot('homepage_gap_check.png', {
    fullPage: true,
    // You can add other options like masks if needed, but for general gap analysis, fullPage is usually sufficient.
  });
});
