import { defineConfig, devices } from '@playwright/test';

// Define a base URL for your application.
// This can be a local development server or a deployed environment.
// If running tests against a local dev server, use its address.
const baseURL = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
  // Base URL for all tests.
  baseURL: baseURL,

  // Look for tests in the e2e/tests directory, relative to the project root.
  testDir: './e2e/tests',

  // Run tests in parallel.
  fullyParallel: true,

  // Fail the build on API test failures.
  forbidOnly: !!process.env.CI,

  // Retry failed tests in CI.
  retries: process.env.CI ? 2 : 0,

  // Limit the number of workers in CI to avoid flaky tests.
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration.
  reporter: [
    ['html', { open: 'never' }], // Generate HTML report, but don't open it automatically.
    ['list'], // Simple test list reporter.
    process.env.CI ? ['github'] : ['line'], // GitHub Actions reporter for CI, line reporter otherwise.
  ],

  // Use snapshotting for visual tests.
  snapshotDir: './e2e/snapshots',

  // Options for the test runner.
  use: {
    // Base URL for all requests.
    baseURL: baseURL,

    // Set browser trace to 'on-first-retry' to capture trace on first retry.
    // Useful for debugging flaky tests.
    trace: 'on-first-retry',

    // Capture screenshot only on failure.
    screenshot: 'only-on-failure',

    // Record video only on failure.
    video: 'retain-on-failure',

    // Permissions for the browser context.
    permissions: [
      'geolocation', // Allow access to geolocation API
      'clipboard-read', // Allow reading from clipboard
    ],
  },

  // Configure projects for different browsers and devices.
  projects: [
    // Setup project for authentication (runs once before other tests that depend on it).
    // This is optional and depends on your authentication flow.
    // { name: 'setup', testMatch: /.*\.setup\.ts/ },

    // Default project for desktop browsers.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // dependencies: ['setup'], // Uncomment if you have an auth setup project
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      // dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      // dependencies: ['setup'],
    },

    // Mobile emulation projects.
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      // dependencies: ['setup'],
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
      // dependencies: ['setup'],
    },
  ],

  // Start the development server before running tests.
  webServer: {
    // Execute 'npm run dev' within the 'frontend' directory.
    // 'npm run dev' in 'frontend/package.json' uses 'vite'.
    command: 'npm run dev',
    cwd: './frontend', // Specify the directory where package.json is located
    url: baseURL,
    reuseExistingServer: !process.env.CI, // Reuse server if already running (not in CI)
    timeout: 120 * 1000, // Wait up to 2 minutes for the server to start
  },
});
