import { test, expect } from '@playwright/test';

test.describe('Authentication - Username Login', () => {
  const baseURL = process.env.BASE_URL || 'https://example.com';

  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test scenario
    await page.goto(`${baseURL}/login`);
  });

  test('TC-LOGIN-POS-001: Verify successful login using a valid standard username and password', async ({ page }) => {
    // Locators using standard recommended locator strategies
    const usernameInput = page.getByLabel('Username', { exact: false }).or(page.getByPlaceholder('Enter Username'));
    const passwordInput = page.getByLabel('Password', { exact: false }).or(page.getByPlaceholder('Enter Password'));
    const loginButton = page.getByRole('button', { name: /login/i });
    const userHeader = page.locator('[data-testid="user-profile-header"]');

    // Verify Login Page components display
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // Enter valid credentials
    await usernameInput.fill('john_doe');
    await expect(usernameInput).toHaveValue('john_doe');

    await passwordInput.fill('ValidPass123!');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Submit login
    await loginButton.click();

    // Assert user redirection and active session dashboard state
    await expect(page).toHaveURL(`${baseURL}/dashboard`);
    await expect(userHeader).toBeVisible();
    await expect(userHeader).toContainText('Welcome, john_doe');
  });

  test('TC-LOGIN-POS-002: Verify successful login with automatically trimmed leading and trailing whitespace around username', async ({ page }) => {
    const usernameInput = page.getByLabel('Username', { exact: false }).or(page.getByPlaceholder('Enter Username'));
    const passwordInput = page.getByLabel('Password', { exact: false }).or(page.getByPlaceholder('Enter Password'));
    const loginButton = page.getByRole('button', { name: /login/i });

    // Focus and input username with leading and trailing spaces
    await usernameInput.click();
    await usernameInput.fill('  john_doe  ');
    await expect(usernameInput).toHaveValue('  john_doe  ');

    await passwordInput.fill('ValidPass123!');
    await loginButton.click();

    // Assert system trims whitespace and completes login redirect
    await expect(page).toHaveURL(`${baseURL}/dashboard`);
  });

  test('TC-LOGIN-POS-003: Verify successful login when case-insensitive username sensitivity rule is supported', async ({ page }) => {
    const usernameInput = page.getByLabel('Username', { exact: false }).or(page.getByPlaceholder('Enter Username'));
    const passwordInput = page.getByLabel('Password', { exact: false }).or(page.getByPlaceholder('Enter Password'));
    const loginButton = page.getByRole('button', { name: /login/i });

    // Input username in uppercase
    await usernameInput.fill('JOHN_DOE');
    await expect(usernameInput).toHaveValue('JOHN_DOE');

    await passwordInput.fill('ValidPass123!');
    await loginButton.click();

    // Assert system authenticates regardless of case sensitivity
    await expect(page).toHaveURL(`${baseURL}/dashboard`);
  });

  test('TC-LOGIN-POS-004: Verify successful login with Remember Me checkbox selected', async ({ page, context }) => {
    const usernameInput = page.getByLabel('Username', { exact: false }).or(page.getByPlaceholder('Enter Username'));
    const passwordInput = page.getByLabel('Password', { exact: false }).or(page.getByPlaceholder('Enter Password'));
    const rememberMeCheckbox = page.getByLabel('Remember Me', { exact: false }).or(page.getByRole('checkbox', { name: /remember/i }));
    const loginButton = page.getByRole('button', { name: /login/i });

    await usernameInput.fill('john_doe');
    await passwordInput.fill('ValidPass123!');

    // Select 'Remember Me'
    await rememberMeCheckbox.check();
    await expect(rememberMeCheckbox).toBeChecked();

    await loginButton.click();
    await expect(page).toHaveURL(`${baseURL}/dashboard`);

    // Preserve storage state to simulate closing and reopening the browser
    const storageState = await context.storageState();
    const newContext = await context.browser()!.newContext({ storageState });
    const newPage = await newContext.newPage();

    // Re-navigate to the base application URL and ensure direct routing to Dashboard
    await newPage.goto(`${baseURL}`);
    await expect(newPage).toHaveURL(`${baseURL}/dashboard`);

    await newContext.close();
  });

  test('TC-LOGIN-POS-005: Verify password visibility toggle icon works correctly before submitting login', async ({ page }) => {
    const usernameInput = page.getByLabel('Username', { exact: false }).or(page.getByPlaceholder('Enter Username'));
    const passwordInput = page.getByLabel('Password', { exact: false }).or(page.getByPlaceholder('Enter Password'));
    const togglePasswordVisibility = page.locator('[data-testid="toggle-password-visibility"]');
    const loginButton = page.getByRole('button', { name: /login/i });

    await usernameInput.fill('john_doe');
    await passwordInput.fill('ValidPass123!');

    // Verify initial state is masked
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Toggle visibility ON
    await togglePasswordVisibility.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Toggle visibility OFF
    await togglePasswordVisibility.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Verify user can still submit form and log in
    await loginButton.click();
    await expect(page).toHaveURL(`${baseURL}/dashboard`);
  });
});