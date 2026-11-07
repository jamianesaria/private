import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3038';
const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
const errors = [];
const failed = [];
const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) failed.push(`${response.status()} ${new URL(response.url()).pathname}`); });
await mkdir('.cms-work/static-backup-qa', { recursive: true });
try {
  const response = await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200);
  const skipIntro = page.getByRole('button', { name: /ওয়েবসাইটে প্রবেশ|ওয়েবসাইটে প্রবেশ/ });
  if (await skipIntro.count()) await skipIntro.first().click();
  await page.screenshot({ path: '.cms-work/static-backup-qa/home-desktop.png', fullPage: false });
  const about = page.locator('a[href="/about"]:visible').first();
  await about.click();
  await page.waitForURL('**/about');
  await page.waitForLoadState('networkidle');
  assert.ok((await page.locator('h1').first().innerText()).length > 0, 'Client navigation renders the about heading');
  console.log('Desktop navigation: passed');
  await page.goto(base + '/blog', { waitUntil: 'networkidle' });
  const article = page.locator('a[href^="/blog/"]').first();
  if (await article.count()) {
    await article.click();
    await page.waitForURL('**/blog/*');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: '.cms-work/static-backup-qa/article.png', fullPage: false });
    console.log(JSON.stringify({ articleUrl: page.url(), headings: await page.locator('h1').allTextContents(), errors }));
    await page.locator('article h1').first().waitFor({ timeout: 10000 });
  }
  console.log('Blog navigation: passed');
  await page.goto(base + '/apply', { waitUntil: 'networkidle' });
  assert.ok(await page.locator('input').count(), 'Admission form hydrates');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: 'networkidle' });
  if (await skipIntro.count()) await skipIntro.first().click();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), 'Mobile page fits the viewport');
  await page.screenshot({ path: '.cms-work/static-backup-qa/home-mobile.png', fullPage: false });
  console.log('Mobile layout and form hydration: passed');
  await page.goto(base + '/studio', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.body.innerText.trim().length > 20, { timeout: 20000 });
  await page.screenshot({ path: '.cms-work/static-backup-qa/studio.png', fullPage: false });
  console.log(JSON.stringify({ studioBodyLength: (await page.locator('body').innerText()).length, errors, failed }));
  assert.deepEqual(errors, [], 'No browser execution errors');
  assert.deepEqual(failed, [], 'No failed same-origin assets or pages');
} finally { await browser.close(); }
