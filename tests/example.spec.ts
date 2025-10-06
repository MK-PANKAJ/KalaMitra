import { test, expect, type Page } from '@playwright/test';

test.describe('KalaMitra Application', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Login first using demo account
    await page.goto('/');
    await page.getByText('Quick Demo Login:').waitFor({ timeout: 10000 });

    // Use artisan demo login
    await page.getByText('Rajesh Kumar').click();

    // Wait for dashboard to load completely
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=🎨 Artisan Portal', { timeout: 10000 });
  });

  test('homepage has correct title', async ({ page }: { page: Page }) => {
    // Wait a bit more to ensure title is set
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveTitle(/KalaMitra/i);
  });

  test('dashboard displays user info correctly', async ({ page }: { page: Page }) => {
    // Check if artisan portal is visible
    await expect(page.locator('text=🎨 Artisan Portal')).toBeVisible({ timeout: 5000 });
    
    // Check if welcome message is displayed
    await expect(page.locator('text=/Welcome,/')).toBeVisible();
    
    // Check if dashboard stats are visible using more specific selectors
    await expect(page.locator('text=Products >> nth=0')).toBeVisible();
    await expect(page.locator('text=Orders >> nth=0')).toBeVisible();
  });

  test('can add new product button is visible', async ({ page }: { page: Page }) => {
    // Check if the add product button exists
    const addButton = page.getByRole('button', { name: /Add New Product/i });
    await expect(addButton).toBeVisible();
  });

  test('user can logout', async ({ page }: { page: Page }) => {
    // Click logout button
    await page.getByRole('button', { name: 'Logout' }).click();

    // Should be redirected to login page
    await expect(page.getByText('Welcome! नमस्ते!')).toBeVisible();
  });
});