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

  await expect(page.getByRole('heading', { name: 'No missing or repeated times found' })).toBeVisible();
  await expect(page.getByText('2026-03-29: UTC+00:00 → UTC+01:00')).toBeVisible();
  const boundaryRow = page.locator('tbody tr').filter({ hasText: '2026-03-30' });
  await expect(boundaryRow).toContainText('09:00–17:00');
  await expect(boundaryRow).toContainText('08:00–16:00');
  await expect(boundaryRow).toContainText('Boundary');

  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV spreadsheet' }).click();
  expect((await csvDownload).suggestedFilename()).toBe('availability-audit-2026-03-23.csv');
  const icsDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export calendar (.ics)' }).click();
  expect((await icsDownload).suggestedFilename()).toBe('availability-audit-2026-03-23.ics');

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
  await expect(page.getByRole('heading', { name: 'No missing or repeated times found' })).toBeVisible();

  await page.locator('#comparison-zone').fill('Europe/Berlin');

  await expect(page.getByText('Configuration changed. Run the audit again before exporting.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Audit results need a fresh run' })).toBeVisible();
  await expect(page.locator('#results table')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Export CSV spreadsheet' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Export calendar (.ics)' })).toBeDisabled();

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

test('demo is a complete canonical route and route changes focus the page heading', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page).toHaveTitle('Demo — Availability DST Audit');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /completed London/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://availability-dst-audit.sociobot.in/demo/');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Demo — Availability DST Audit');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  await page.goto('/privacy/');
  await expect(page.locator('h1')).toBeFocused();
  await expect(page.locator('#route-announcement')).toContainText('Privacy');
  await page.goBack();
  await expect(page.locator('h1')).toBeFocused();
});

test('product-owned 404 provides a semantic way back', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Availability DST Audit');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'That page was not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open the sample audit' })).toHaveAttribute('href', '/demo/');
});

test('offline fallback uses the shared route skeleton and plain recovery copy', async ({ page }) => {
  await page.goto('/offline.html');
  await expect(page).toHaveTitle('Offline — Availability DST Audit');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Reconnect/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://availability-dst-audit.sociobot.in/offline.html');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Offline — Availability DST Audit');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'The audit is offline' })).toBeFocused();
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Privacy' }).last()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Terms' })).toBeVisible();
  await expect(page.getByText(/Built by Param Factory · build polish-3/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Reconnect, then reload the audit' })).toHaveAttribute('href', '/');
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact ?? ''))).toEqual([]);
});

test('visible phone controls have effective targets of at least 44 by 44 pixels', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-390', 'Phone target audit runs at 390 px.');
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/offline.html', '/404.html']) {
    await page.goto(path);
    if (path === '/demo/') await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
    const failures = await page.locator('a[href], button:not([disabled]), input:not([disabled]), summary, [tabindex="0"]').evaluateAll((elements) => elements.flatMap((element) => {
      const control = element as HTMLElement;
      const style = getComputedStyle(control);
      const rect = control.getBoundingClientRect();
      if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return [];
      const labels = element instanceof HTMLInputElement ? [...element.labels ?? []] : [];
      const labelPasses = labels.some((label) => {
        const labelRect = label.getBoundingClientRect();
        return labelRect.width >= 44 && labelRect.height >= 44;
      });
      if ((rect.width >= 44 && rect.height >= 44) || labelPasses) return [];
      return [`${control.tagName.toLowerCase()}#${control.id || ''}.${control.className || ''} ${Math.round(rect.width)}x${Math.round(rect.height)}`];
    }));
    expect(failures, `${path} undersized controls`).toEqual([]);
  }
});
