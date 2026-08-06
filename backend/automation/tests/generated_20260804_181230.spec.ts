import { test, expect, Page } from '@playwright/test';

// ------------------------------------------------------------
// Login Module – Playwright Test Suite
// ------------------------------------------------------------
// All locators are placeholders – replace them with real selectors.
// ------------------------------------------------------------

test.describe('Login Module', () => {
  // Base URL is taken from the environment variable.
  const baseUrl = process.env.BASE_URL || 'http://localhost';
  const loginUrl = `${baseUrl}/login`;

  // -----------------------------------------------------------------
  // Placeholder selectors – update according to the application under test.
  // -----------------------------------------------------------------
  const selectors = {
    usernameInput: 'input[name="username"]', // Username / Email field
    passwordInput: 'input[name="password"]', // Password field
    loginButton: 'button[type="submit"]', // Login button
    rememberMeCheckbox: 'input[name="rememberMe"]', // Remember Me checkbox
    userGreeting: '[data-test="user-greeting"]', // Greeting element on dashboard
    profileIcon: '[data-test="profile-icon"]', // Profile icon/name element
    adminNavMenu: '[data-test="admin-nav"]', // Admin console navigation container
  };

  // -----------------------------------------------------------------
  // Helper to perform a standard login flow.
  // -----------------------------------------------------------------
  async function performLogin(page: Page, username: string, password: string) {
    await page.goto(loginUrl);
    await page.fill(selectors.usernameInput, username);
    await expect(page.locator(selectors.usernameInput)).toHaveValue(username);
    await page.fill(selectors.passwordInput, password);
    await expect(page.locator(selectors.passwordInput)).toHaveValue(password);
    await page.click(selectors.loginButton);
  }

  // -----------------------------------------------------------------
  // TC-001: User logs in with valid username and password
  // -----------------------------------------------------------------
  test('TC-001: User logs in with valid username and password', async ({ page }) => {
    await performLogin(page, 'john.doe', 'Password123!');
    // Verify navigation to the dashboard/home page.
    await expect(page).toHaveURL(/.*\/dashboard/);
    // Verify greeting contains the full name.
    await expect(page.locator(selectors.userGreeting)).toContainText('John Doe');
  });

  // -----------------------------------------------------------------
  // TC-002: User logs in with valid email address and password
  // -----------------------------------------------------------------
  test('TC-002: User logs in with valid email address and password', async ({ page }) => {
    await performLogin(page, 'jane.smith@example.com', 'Secure!456');
    await expect(page).toHaveURL(/.*\/dashboard/);
    // Verify the profile icon displays the correct name.
    await expect(page.locator(selectors.profileIcon)).toContainText('Jane Smith');
  });

  // -----------------------------------------------------------------
  // TC-003: User logs in with "Remember Me" option selected
  // -----------------------------------------------------------------
  test('TC-003: User logs in with "Remember Me" option selected', async ({ page, context }) => {
    await page.goto(loginUrl);
    await page.fill(selectors.usernameInput, 'alice.w');
    await page.fill(selectors.passwordInput, 'Alice@2023');
    await page.check(selectors.rememberMeCheckbox);
    await expect(page.locator(selectors.rememberMeCheckbox)).toBeChecked();
    await page.click(selectors.loginButton);
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Persist authentication state to a file.
    await context.storageState({ path: 'auth-alice.json' });

    // Close current page and create a new context that loads the stored state.
    await page.close();
    const newContext = await test.newContext({ storageState: 'auth-alice.json' });
    const newPage = await newContext.newPage();
    await newPage.goto(baseUrl);
    // The user should be automatically logged in.
    await expect(newPage.locator(selectors.userGreeting)).toContainText('Alice W');
    await newContext.close();
  });

  // -----------------------------------------------------------------
  // TC-004: User logs in with leading and trailing spaces in username
  // -----------------------------------------------------------------
  test('TC-004: User logs in with leading and trailing spaces in username', async ({ page }) => {
    await page.goto(loginUrl);
    const usernameWithSpaces = '  bob.miller  ';
    await page.fill(selectors.usernameInput, usernameWithSpaces);
    await expect(page.locator(selectors.usernameInput)).toHaveValue(usernameWithSpaces);
    await page.fill(selectors.passwordInput, 'Bob#789');
    await page.click(selectors.loginButton);
    // Application is expected to trim whitespace before validation.
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator(selectors.userGreeting)).toContainText('Bob Miller');
  });

  // -----------------------------------------------------------------
  // TC-005: User logs in with password containing special characters
  // -----------------------------------------------------------------
  test('TC-005: User logs in with password containing special characters', async ({ page }) => {
    await performLogin(page, 'charlie.k', 'C!h@r#l$e%2025');
    await expect(page).toHaveURL(/.*\/dashboard/);
    // Verify that user‑specific widgets are displayed – placeholder selector used.
    const widgetLocator = page.locator('[data-test="dashboard-widget-charlie"]');
    await expect(widgetLocator).toBeVisible();
  });

  // -----------------------------------------------------------------
  // TC-006: Administrator logs in and is redirected to admin console
  // -----------------------------------------------------------------
  test('TC-006: Administrator logs in and is redirected to admin console', async ({ page }) => {
    await performLogin(page, 'admin.user', 'AdminPass!01');
    // Admins are typically redirected to a distinct URL.
    await expect(page).toHaveURL(/.*\/admin/);
    // Verify that the admin navigation menu is present.
    await expect(page.locator(selectors.adminNavMenu)).toBeVisible();
    // Additional check for a known admin item (placeholder).
    await expect(page.locator(`${selectors.adminNavMenu} >> text=User Management`)).toBeVisible();
  });
});