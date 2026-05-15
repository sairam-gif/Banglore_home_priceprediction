import { test, expect } from '@playwright/test';

// Define the base URL from the playwright config if available, otherwise use a default.
// In a real scenario, this would likely come from process.env.BASE_URL or be part of the config.
const baseURL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Property Search Functionality', () => {
  test('should not display properties when search criteria yield no results', async ({ page }) => {
    // Navigate to the home page where the search panel and map are located.
    await page.goto('/');

    // --- Interact with the Search Panel ---

    // Fill in the budget (using a sample value)
    await page.getByLabel('Maximum Budget (INR)').fill('5000000'); // Example budget

    // Select a BHK option (e.g., 2 BHK)
    await page.getByRole('checkbox', { name: '2 BHK' }).click();

    // No need to select amenities for a minimal search.

    // Click the search button
    await page.getByRole('button', { name: 'Search Properties' }).click();

    // --- Assert the outcome (current issue: empty results) ---

    // Wait for the map or results area to potentially update.
    // We expect no markers to appear, and potentially a "no results" message.

    // Assert that the "No properties found matching your criteria." message is visible.
    // This message is present in the LocationMap.tsx component when locationData is empty.
    await expect(page.getByText('No properties found matching your criteria.')).toBeVisible();

    // Additionally, assert that no map markers are visible.
    // This is a more robust check to ensure the map truly has no data.
    // The markers are within MarkerClusterGroup. We'll check for markers directly.
    // Note: Playwright might need to wait for the map to render and cluster markers.
    // A common approach is to wait for the map container or a specific element within it.
    await page.waitForSelector('.leaflet-container'); // Wait for the map to be ready.

    // Check if any markers are present in the map. The number of markers should be 0.
    // We can check the total number of cluster groups or individual markers.
    // A simple check is to see if the cluster layer is visible and if it contains any elements,
    // or if the specific "no results" message is displayed.
    // Given the specific "No properties found" message, we rely on that primarily.
    // If we wanted to check for *absence* of markers, we could do:
    // await expect(page.locator('.leaflet-marker-icon')).toBeHidden(); // This might be too simplistic.
    // A better check is often ensuring the "no results" message is shown.
  });

  // Optional: Add another test case with different criteria to see if it yields results.
  // For now, we focus on confirming the current problematic scenario.
});
