import { test, expect, Page } from '@playwright/test';

/**
 * Page Object Model for Login Page
 */
export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators using standard Playwright recommended strategies
  get usernameInput() {
    return this.page.getByLabel('Username');
  }

  get passwordInput() {
    return this.page.getByLabel('Password');
  }

  get loginButton() {
    return this.page.getByRole('button', { name: 'Log in' });
  }

  get errorMessage() {
    return this.page.getByRole('alert');
  }

  get userDashboardHeader() {
    return this.page.getByRole('heading', { name: 'Dashboard' });
  }

  // Actions
  async navigate() {
    const baseUrl = process.env.BASE_URL || 'https://example.com';
    await this.page.goto(`${baseUrl}/login`);
  }

  async login(username?: string, password?: string) {
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
    // Arrange & Act
    await loginPage.login('valid_user', 'SecurePassword123!');

    // Assert
    const baseUrl = process.env.BASE_URL || 'https://example.com';
    await expect(page).toHaveURL(`${baseUrl}/dashboard`);
    await expect(loginPage.userDashboardHeader).toBeVisible();
  });

  test('should display error message with non-existent username', async () => {
    // Arrange & Act
    await loginPage.login('non_existent_user', 'SecurePassword123!');

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
  });

  test('should display error message with valid username but wrong password', async () => {
    // Arrange & Act
    await loginPage.login('valid_user', 'WrongPassword!');

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
  });

  test('should show validation error when username field is empty', async () => {
    // Arrange & Act
    await loginPage.login('', 'SecurePassword123!');

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });
});