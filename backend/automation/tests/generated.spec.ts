import { test, expect, Page } from '@playwright/test';

/**
 * Page Object Model representing the Login Page.
 */
class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Recommended Playwright locators using accessible roles and labels
  readonly usernameInput = this.page.getByLabel(/username/i);
  readonly passwordInput = this.page.getByLabel(/password/i);
  readonly loginButton = this.page.getByRole('button', { name: /log in|sign in|submit/i });
  readonly errorMessage = this.page.getByRole('alert');
  readonly userDashboard = this.page.getByTestId('dashboard-header');
  readonly usernameValidationError = this.page.getByText(/username is required/i);

  async navigate(): Promise<void> {
    const baseUrl = process.env.BASE_URL || 'https://example.com';
    await this.page.goto(`${baseUrl}/login`);
  }

  async login(username?: string, password?: string): Promise<void> {
    if (username !== undefined) {
      await this.usernameInput.fill(username);
    }
    if (password !== undefined) {
      await this.passwordInput.fill(password);
    }
    await this.loginButton.click();
  }
}

test.describe('Authentication - Login with Username', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should successfully log in with valid username and password', async ({ page }) => {
    const validUsername = process.env.TEST_USERNAME || 'valid_user';
    const validPassword = process.env.TEST_PASSWORD || 'Password123!';

    await loginPage.login(validUsername, validPassword);

    // Verify successful redirection and authenticated UI element
    await expect(page).toHaveURL(/.*dashboard/i);
    await expect(loginPage.userDashboard).toBeVisible();
  });

  test('should display error message when logging in with invalid password', async () => {
    const validUsername = process.env.TEST_USERNAME || 'valid_user';
    const invalidPassword = 'WrongPassword123!';

    await loginPage.login(validUsername, invalidPassword);

    // Verify error message for invalid credentials
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/invalid credentials|incorrect password/i);
  });

  test('should display error message when logging in with non-existent username', async () => {
    const nonExistentUser = 'non_existent_user_999';
    const password = 'Password123!';

    await loginPage.login(nonExistentUser, password);

    // Verify error response for unknown user
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/user not found|invalid credentials/i);
  });

  test('should display validation error when submitting empty username field', async () => {
    // Attempt to login without providing username
    await loginPage.login('', 'Password123!');

    // Verify field-level validation message
    await expect(loginPage.usernameValidationError).toBeVisible();
  });
});