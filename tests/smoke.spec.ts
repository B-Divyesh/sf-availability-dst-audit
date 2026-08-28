import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('runs a 2026 DST audit, persists config, and exports fixtures', async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/');
  await expect(page).toHaveTitle(/Availability DST Audit/);
  await page.locator('#organizer-zone').fill('Europe/London');
  await page.locator('#comparison-zone').fill('America/New_York');
  await page.locator('#start-date').fill('2026-03-23');
  await page.locator('#end-date').fill('2026-04-03');
  await page.getByRole('button', { name: 'Run audit' }).click();

  await expect(page.getByRole('heading', { name: 'Expected availability is internally consistent' })).toBeVisible();
  await expect(page.getByText('2026-03-29: UTC+00:00 → UTC+01:00')).toBeVisible();
  const boundaryRow = page.locator('tbody tr').filter({ hasText: '2026-03-30' });
  await expect(boundaryRow).toContainText('09:00–17:00');
  await expect(boundaryRow).toContainText('08:00–16:00');
  await expect(boundaryRow).toContainText('Boundary');

  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  expect((await csvDownload).suggestedFilename()).toBe('availability-fixture-2026-03-23.csv');
  const icsDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export ICS' }).click();
  expect((await icsDownload).suggestedFilename()).toBe('availability-fixture-2026-03-23.ics');

  expect(await page.evaluate(() => localStorage.getItem('availability-dst-audit:config:v1'))).toContain('Europe/London');
  expect(consoleErrors).toEqual([]);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact ?? ''))).toEqual([]);

  if (testInfo.project.name === 'mobile-390') {
    const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(width.scroll).toBe(width.client);
  }
});

test('replaces stale audit output with an accessible rerun state', async ({ page }) => {
  await page.goto('/');
  await page.locator('#organizer-zone').fill('Europe/London');
  await page.locator('#comparison-zone').fill('America/New_York');
  await page.locator('#start-date').fill('2026-03-23');
  await page.locator('#end-date').fill('2026-04-03');
  await page.getByRole('button', { name: 'Run audit' }).click();
  await expect(page.getByRole('heading', { name: 'Expected availability is internally consistent' })).toBeVisible();

  await page.locator('#comparison-zone').fill('Europe/Berlin');

  await expect(page.getByText('Configuration changed. Run the audit again before exporting.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fixture needs a fresh run' })).toBeVisible();
  await expect(page.locator('#results table')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Export CSV' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Export ICS' })).toBeDisabled();

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact ?? ''))).toEqual([]);
});

test('legal pages expose semantic essentials', async ({ page }) => {
  for (const path of ['/privacy/', '/terms/']) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact ?? ''))).toEqual([]);
  }
});

test('product-owned 404 provides a semantic way back', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Availability DST Audit');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'That page was not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open the sample audit' })).toHaveAttribute('href', '/?demo=1');
});
