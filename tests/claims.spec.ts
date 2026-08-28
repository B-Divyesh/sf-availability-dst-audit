import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function openDemo(page: import('@playwright/test').Page) {
  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Expected availability is internally consistent' })).toBeVisible();
}

test('@claim:sample-audit completed sample shows weekday availability and its DST boundary', async ({ page }) => {
  await openDemo(page);
  await expect(page.locator('tbody tr')).toHaveCount(10);
  await expect(page.getByText('2026-03-29: UTC+00:00 → UTC+01:00')).toBeVisible();
  const monday = page.locator('tbody tr').filter({ hasText: '2026-03-30' });
  await expect(monday).toContainText('09:00–17:00');
  await expect(monday).toContainText('08:00–16:00');
  await expect(monday).toContainText('Boundary');
});

test('@claim:browser-iana browser timezone rules keep local hours fixed while UTC changes', async ({ page }) => {
  await openDemo(page);
  const before = page.locator('tbody tr').filter({ hasText: '2026-03-27' });
  const after = page.locator('tbody tr').filter({ hasText: '2026-03-30' });
  await expect(before).toContainText('09:00–17:00');
  await expect(before).toContainText('09:00–17:00');
  await expect(after).toContainText('09:00–17:00');
  await expect(after).toContainText('08:00–16:00');
});

test('@claim:exports expected availability downloads as CSV and UTC ICS', async ({ page }) => {
  await openDemo(page);
  const csv = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const csvText = await (await csv).createReadStream().then(async (stream) => {
    const chunks: Buffer[] = [];
    for await (const chunk of stream!) chunks.push(chunk as Buffer);
    return Buffer.concat(chunks).toString('utf8');
  });
  expect(csvText).toContain('organizer_timezone');
  expect(csvText.split('\n')).toHaveLength(11);
  const ics = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export ICS' }).click();
  const icsText = await (await ics).createReadStream().then(async (stream) => {
    const chunks: Buffer[] = [];
    for await (const chunk of stream!) chunks.push(chunk as Buffer);
    return Buffer.concat(chunks).toString('utf8');
  });
  expect(icsText).toContain('BEGIN:VCALENDAR');
  expect(icsText).toContain('DTSTART:20260330T080000Z');
});

test('@claim:time-edge-cases missing and repeated local times are marked and omitted or resolved in ICS', async ({ page }) => {
  await openDemo(page);
  await page.locator('#start-date').fill('2026-03-29');
  await page.locator('#end-date').fill('2026-03-29');
  await page.locator('input[name="day-0"]').check();
  await page.locator('input[name="start-0"]').fill('01:30');
  await page.locator('input[name="end-0"]').fill('02:30');
  await page.getByRole('button', { name: 'Run audit' }).click();
  await expect(page.locator('#results').getByText('Missing local time', { exact: false }).first()).toBeVisible();
  const missingIcs = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export ICS' }).click();
  const missingText = await (await missingIcs).createReadStream().then(async (stream) => {
    const chunks: Buffer[] = [];
    for await (const chunk of stream!) chunks.push(chunk as Buffer);
    return Buffer.concat(chunks).toString('utf8');
  });
  expect(missingText).not.toContain('BEGIN:VEVENT');
  await page.locator('#start-date').fill('2026-10-25');
  await page.locator('#end-date').fill('2026-10-25');
  await page.getByRole('button', { name: 'Run audit' }).click();
  await expect(page.locator('#results').getByText('Ambiguous local time', { exact: false }).first()).toBeVisible();
  await expect(page.locator('#results').getByText('Duration drift +60m', { exact: false }).first()).toBeVisible();
});

test('@claim:demo-isolation demo uses separate storage, resets, and discards its data', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('availability-dst-audit:config:v1', JSON.stringify({ organizerZone: 'Pacific/Auckland' })));
  await openDemo(page);
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

test('@claim:privacy-local complete demo flow makes no third-party requests', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await openDemo(page);
  await page.getByRole('button', { name: 'Export CSV' }).click();
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
  await expect(page.getByRole('heading', { name: 'Expected availability is internally consistent' })).toBeVisible();
  await context.close();
});

test('demo is accessible on desktop and mobile', async ({ page }) => {
  await openDemo(page);
  const report = await new AxeBuilder({ page }).analyze();
  expect(report.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact ?? ''))).toEqual([]);
  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(width.scroll).toBe(width.client);
});
