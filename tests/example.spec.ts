import { test, expect, type Page } from '@playwright/test';

test('homepage has correct title', async ({ page }: { page: Page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Kalamitra/);
});

test('artisan registration flow', async ({ page }: { page: Page }) => {
  await page.goto('/');
  
  // Navigate to registration
  await page.getByRole('link', { name: 'Register' }).click();
  
  // Fill the form
  await page.getByLabel('Name').fill('Test Artisan');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('testpass123');
  
  // Submit and verify
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.getByText('Registration successful')).toBeVisible();
});

test('product search functionality', async ({ page }: { page: Page }) => {
  await page.goto('/');
  
  // Search for a product
  await page.getByPlaceholder('Search products...').fill('handicraft');
  await page.getByRole('button', { name: 'Search' }).click();
  
  // Verify results
  await expect(page.getByTestId('product-grid')).toBeVisible();
  const productCards = await page.getByTestId('product-card').count();
  expect(productCards).toBeGreaterThan(0);
});