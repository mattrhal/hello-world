import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('backdrop filter app functionality', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Check title
  await expect(page.locator('h1')).toHaveText('Backdrop Filter');

  // Initially shows "No Image Uploaded"
  await expect(page.locator('text=No Image Uploaded')).toBeVisible();

  // Create a dummy image for upload
  const filePath = path.join(__dirname, 'test-image.png');
  // Just a tiny 1x1 png
  const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  fs.writeFileSync(filePath, buffer);

  // Upload the image
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.click('text=Upload Now');
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(filePath);

  // Verify image is displayed
  await expect(page.locator('img[alt="Uploaded Preview"]')).toBeVisible();

  // Change a filter (e.g., Blur)
  // Blur slider is the first range input in our current implementation
  const blurInput = page.locator('input[type="range"]').first();
  await blurInput.fill('10');

  // Check if the filter area has the updated style
  const filterArea = page.locator('div[style*="backdrop-filter"]');
  const style = await filterArea.getAttribute('style');
  expect(style).toContain('blur(10px)');

  // Take a screenshot
  await page.screenshot({ path: 'app-screenshot.png', fullPage: true });

  // Clean up
  fs.unlinkSync(filePath);
});
