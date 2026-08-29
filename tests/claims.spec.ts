import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function downloadText(page: import('@playwright/test').Page, name: string) {
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name }).click();
  const stream = await (await download).createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString('utf8');
}

async function openDemo(page: import('@playwright/test').Page, path = '/demo/') {
  await page.goto(path);
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'No missing or repeated times found' })).toBeVisible();
}

test('@claim:sample-audit the completed sample shows weekday availability and the March 2026 London clock change', async ({ page }) => {
  await openDemo(page, '/?demo=1');
  await expect(page.locator('tbody tr')).toHaveCount(10);
  await expect(page.getByText('2026-03-29: UTC+00:00 → UTC+01:00')).toBeVisible();
  const monday = page.locator('tbody tr').filter({ hasText: '2026-03-30' });
  await expect(monday).toContainText('09:00–17:00');
  await expect(monday).toContainText('08:00–16:00');
  await expect(monday).toContainText('Boundary');
});

test('@claim:browser-timezone-rules browser timezone rules keep local hours fixed while UTC changes', async ({ page }) => {
  await openDemo(page);
  const before = page.locator('tbody tr').filter({ hasText: '2026-03-27' });
  const after = page.locator('tbody tr').filter({ hasText: '2026-03-30' });
  await expect(before).toContainText('09:00–17:00');
  await expect(after).toContainText('09:00–17:00');
  await expect(after).toContainText('08:00–16:00');
});

test('@claim:first-boundary-window only the first enabled working window after a clock change is marked', async ({ page }) => {
  await openDemo(page);
  await expect(page.locator('tbody tr').filter({ hasText: '2026-03-30' })).toContainText('◆ Boundary');
  for (const date of ['2026-03-31', '2026-04-01', '2026-04-02', '2026-04-03']) {
    await expect(page.locator('tbody tr').filter({ hasText: date })).not.toContainText('Boundary');
  }
  await expect(page.getByText('1 clock-change row')).toBeVisible();
});

test('@claim:exports expected availability downloads as CSV and UTC ICS', async ({ page }) => {
  await openDemo(page);
  const csvText = await downloadText(page, 'Export CSV');
  expect(csvText).toContain('organizer_timezone');
  expect(csvText.split('\n')).toHaveLength(11);
  const icsText = await downloadText(page, 'Export ICS');
  expect(icsText).toContain('BEGIN:VCALENDAR');
  expect(icsText).toContain('DTSTART:20260330T080000Z');
});

test('@claim:time-edge-cases missing and repeated local times are marked, omitted, or exported at the earlier occurrence', async ({ page }) => {
  await openDemo(page);
  await page.locator('#start-date').fill('2026-03-29');
  await page.locator('#end-date').fill('2026-03-29');
  await page.locator('input[name="day-0"]').check();
  await page.locator('input[name="start-0"]').fill('01:30');
  await page.locator('input[name="end-0"]').fill('02:30');
  await page.getByRole('button', { name: 'Run audit' }).click();
  await expect(page.locator('#results').getByText('Missing local time', { exact: false }).first()).toBeVisible();
  expect(await downloadText(page, 'Export ICS')).not.toContain('BEGIN:VEVENT');

  await page.locator('#start-date').fill('2026-10-25');
  await page.locator('#end-date').fill('2026-10-25');
  await page.getByRole('button', { name: 'Run audit' }).click();
  await expect(page.locator('#results').getByText('Ambiguous local time', { exact: false }).first()).toBeVisible();
  await expect(page.locator('#results').getByText('Duration drift +60m', { exact: false }).first()).toBeVisible();
  const repeatedIcs = await downloadText(page, 'Export ICS');
  expect(repeatedIcs).toContain('DTSTART:20261025T003000Z');
  expect(repeatedIcs).not.toContain('DTSTART:20261025T013000Z');
});

test('@claim:comparison-date-change the report labels comparison dates that differ from the organizer date', async ({ page }) => {
  await openDemo(page);
  await page.locator('#start-date').fill('2026-03-23');
  await page.locator('#end-date').fill('2026-03-23');
  await page.locator('input[name="start-1"]').fill('00:30');
  await page.locator('input[name="end-1"]').fill('01:30');
  await page.getByRole('button', { name: 'Run audit' }).click();
  const row = page.locator('tbody tr').filter({ hasText: '2026-03-23' });
  await expect(row).toContainText('2026-03-22');
  await expect(row).toContainText('Comparison date differs');
});

test('@claim:published-comparison imported published CSV identifies missing, extra, shifted, and duration-changed slots locally', async ({ page }) => {
  await openDemo(page);
  await expect(page.getByRole('heading', { name: 'Published slots need review' })).toBeVisible();
  await expect(page.locator('#published-comparison')).toContainText('1 missing');
  await expect(page.locator('#published-comparison')).toContainText('1 extra');
  await expect(page.locator('#published-comparison')).toContainText('1 shifted');
  await expect(page.locator('#published-comparison')).toContainText('1 duration');
  await page.locator('#actual-file').setInputFiles({ name: 'matching.csv', mimeType: 'text/csv', buffer: Buffer.from('start_utc,end_utc\n2026-03-23T09:00:00Z,2026-03-23T17:00:00Z\n') });
  await page.getByRole('button', { name: 'Compare published file' }).click();
  await expect(page.locator('#published-comparison')).toContainText('Missing published slot');
});

test('@claim:demo-isolation demo uses separate storage, resets, and discards its data', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('availability-dst-audit:config:v1', JSON.stringify({ organizerZone: 'Pacific/Auckland' })));
  await openDemo(page, '/?demo=1');
  await expect(page.locator('#organizer-zone')).toHaveValue('Europe/London');
  expect(await page.evaluate(() => localStorage.getItem('availability-dst-audit:config:v1'))).toContain('Pacific/Auckland');
  expect(await page.evaluate(() => localStorage.getItem('demo:availability-dst-audit:config:v1'))).toContain('Europe/London');
  await page.locator('#organizer-zone').fill('Europe/Berlin');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#organizer-zone')).toHaveValue('Europe/London');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('/');
  expect(await page.evaluate(() => localStorage.getItem('demo:availability-dst-audit:config:v1'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('availability-dst-audit:config:v1'))).toContain('Pacific/Auckland');
});

test('@claim:real-storage a completed real audit stores only its form configuration in this browser', async ({ page }) => {
  await page.goto('/');
  await page.locator('#organizer-zone').fill('Europe/London');
  await page.locator('#comparison-zone').fill('America/New_York');
  await page.locator('#start-date').fill('2026-03-23');
  await page.locator('#end-date').fill('2026-03-23');
  await page.getByRole('button', { name: 'Run audit' }).click();
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(['availability-dst-audit:config:v1']);
});

test('@claim:privacy-local complete demo and comparison flow makes no third-party requests', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await openDemo(page);
  await downloadText(page, 'Export CSV');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:offline-reload sample audit reloads after the first visit without network', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/');
  await page.evaluate(async () => {
    await Promise.all((await navigator.serviceWorker.getRegistrations()).map((registration) => registration.unregister()));
    await Promise.all((await caches.keys()).map((key) => caches.delete(key)));
  });
  await openDemo(page);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker?.controller));
  await page.reload();
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'No missing or repeated times found' })).toBeVisible();
  await context.close();
});

test('demo is accessible and its completed report starts in the first mobile screen', async ({ page }) => {
  await openDemo(page);
  const top = await page.getByRole('heading', { name: 'No missing or repeated times found' }).evaluate((element) => element.getBoundingClientRect().top);
  expect(top).toBeLessThan(620);
  const report = await new AxeBuilder({ page }).analyze();
  expect(report.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact ?? ''))).toEqual([]);
  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(width.scroll).toBe(width.client);
});
