# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: generated_20260804_181230.spec.ts >> Login Module >> TC-002: User logs in with valid email address and password
- Location: tests\generated_20260804_181230.spec.ts:53:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input[name="username"]')

```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | // ------------------------------------------------------------
  4   | // Login Module – Playwright Test Suite
  5   | // ------------------------------------------------------------
  6   | // All locators are placeholders – replace them with real selectors.
  7   | // ------------------------------------------------------------
  8   | 
  9   | test.describe('Login Module', () => {
  10  |   // Base URL is taken from the environment variable.
  11  |   const baseUrl = process.env.BASE_URL || 'http://localhost';
  12  |   const loginUrl = `${baseUrl}/login`;
  13  | 
  14  |   // -----------------------------------------------------------------
  15  |   // Placeholder selectors – update according to the application under test.
  16  |   // -----------------------------------------------------------------
  17  |   const selectors = {
  18  |     usernameInput: 'input[name="username"]', // Username / Email field
  19  |     passwordInput: 'input[name="password"]', // Password field
  20  |     loginButton: 'button[type="submit"]', // Login button
  21  |     rememberMeCheckbox: 'input[name="rememberMe"]', // Remember Me checkbox
  22  |     userGreeting: '[data-test="user-greeting"]', // Greeting element on dashboard
  23  |     profileIcon: '[data-test="profile-icon"]', // Profile icon/name element
  24  |     adminNavMenu: '[data-test="admin-nav"]', // Admin console navigation container
  25  |   };
  26  | 
  27  |   // -----------------------------------------------------------------
  28  |   // Helper to perform a standard login flow.
  29  |   // -----------------------------------------------------------------
  30  |   async function performLogin(page: Page, username: string, password: string) {
  31  |     await page.goto(loginUrl);
> 32  |     await page.fill(selectors.usernameInput, username);
      |                ^ Error: page.fill: Test timeout of 60000ms exceeded.
  33  |     await expect(page.locator(selectors.usernameInput)).toHaveValue(username);
  34  |     await page.fill(selectors.passwordInput, password);
  35  |     await expect(page.locator(selectors.passwordInput)).toHaveValue(password);
  36  |     await page.click(selectors.loginButton);
  37  |   }
  38  | 
  39  |   // -----------------------------------------------------------------
  40  |   // TC-001: User logs in with valid username and password
  41  |   // -----------------------------------------------------------------
  42  |   test('TC-001: User logs in with valid username and password', async ({ page }) => {
  43  |     await performLogin(page, 'john.doe', 'Password123!');
  44  |     // Verify navigation to the dashboard/home page.
  45  |     await expect(page).toHaveURL(/.*\/dashboard/);
  46  |     // Verify greeting contains the full name.
  47  |     await expect(page.locator(selectors.userGreeting)).toContainText('John Doe');
  48  |   });
  49  | 
  50  |   // -----------------------------------------------------------------
  51  |   // TC-002: User logs in with valid email address and password
  52  |   // -----------------------------------------------------------------
  53  |   test('TC-002: User logs in with valid email address and password', async ({ page }) => {
  54  |     await performLogin(page, 'jane.smith@example.com', 'Secure!456');
  55  |     await expect(page).toHaveURL(/.*\/dashboard/);
  56  |     // Verify the profile icon displays the correct name.
  57  |     await expect(page.locator(selectors.profileIcon)).toContainText('Jane Smith');
  58  |   });
  59  | 
  60  |   // -----------------------------------------------------------------
  61  |   // TC-003: User logs in with "Remember Me" option selected
  62  |   // -----------------------------------------------------------------
  63  |   test('TC-003: User logs in with "Remember Me" option selected', async ({ page, context }) => {
  64  |     await page.goto(loginUrl);
  65  |     await page.fill(selectors.usernameInput, 'alice.w');
  66  |     await page.fill(selectors.passwordInput, 'Alice@2023');
  67  |     await page.check(selectors.rememberMeCheckbox);
  68  |     await expect(page.locator(selectors.rememberMeCheckbox)).toBeChecked();
  69  |     await page.click(selectors.loginButton);
  70  |     await expect(page).toHaveURL(/.*\/dashboard/);
  71  | 
  72  |     // Persist authentication state to a file.
  73  |     await context.storageState({ path: 'auth-alice.json' });
  74  | 
  75  |     // Close current page and create a new context that loads the stored state.
  76  |     await page.close();
  77  |     const newContext = await test.newContext({ storageState: 'auth-alice.json' });
  78  |     const newPage = await newContext.newPage();
  79  |     await newPage.goto(baseUrl);
  80  |     // The user should be automatically logged in.
  81  |     await expect(newPage.locator(selectors.userGreeting)).toContainText('Alice W');
  82  |     await newContext.close();
  83  |   });
  84  | 
  85  |   // -----------------------------------------------------------------
  86  |   // TC-004: User logs in with leading and trailing spaces in username
  87  |   // -----------------------------------------------------------------
  88  |   test('TC-004: User logs in with leading and trailing spaces in username', async ({ page }) => {
  89  |     await page.goto(loginUrl);
  90  |     const usernameWithSpaces = '  bob.miller  ';
  91  |     await page.fill(selectors.usernameInput, usernameWithSpaces);
  92  |     await expect(page.locator(selectors.usernameInput)).toHaveValue(usernameWithSpaces);
  93  |     await page.fill(selectors.passwordInput, 'Bob#789');
  94  |     await page.click(selectors.loginButton);
  95  |     // Application is expected to trim whitespace before validation.
  96  |     await expect(page).toHaveURL(/.*\/dashboard/);
  97  |     await expect(page.locator(selectors.userGreeting)).toContainText('Bob Miller');
  98  |   });
  99  | 
  100 |   // -----------------------------------------------------------------
  101 |   // TC-005: User logs in with password containing special characters
  102 |   // -----------------------------------------------------------------
  103 |   test('TC-005: User logs in with password containing special characters', async ({ page }) => {
  104 |     await performLogin(page, 'charlie.k', 'C!h@r#l$e%2025');
  105 |     await expect(page).toHaveURL(/.*\/dashboard/);
  106 |     // Verify that user‑specific widgets are displayed – placeholder selector used.
  107 |     const widgetLocator = page.locator('[data-test="dashboard-widget-charlie"]');
  108 |     await expect(widgetLocator).toBeVisible();
  109 |   });
  110 | 
  111 |   // -----------------------------------------------------------------
  112 |   // TC-006: Administrator logs in and is redirected to admin console
  113 |   // -----------------------------------------------------------------
  114 |   test('TC-006: Administrator logs in and is redirected to admin console', async ({ page }) => {
  115 |     await performLogin(page, 'admin.user', 'AdminPass!01');
  116 |     // Admins are typically redirected to a distinct URL.
  117 |     await expect(page).toHaveURL(/.*\/admin/);
  118 |     // Verify that the admin navigation menu is present.
  119 |     await expect(page.locator(selectors.adminNavMenu)).toBeVisible();
  120 |     // Additional check for a known admin item (placeholder).
  121 |     await expect(page.locator(`${selectors.adminNavMenu} >> text=User Management`)).toBeVisible();
  122 |   });
  123 | });
```