import {
  test as base,
  expect,
  chromium,
  BrowserContext,
} from '@playwright/test';
import path from 'path';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({ browserName }, use) => {
    const browserTypes = { chromium };
    const pathToExtension = path.join(
      '/Users/nicksmacbookair/Library/Application Support/Google/Chrome/Profile 3/Extensions/nkbihfbeogaeaoehlefnkodbefgpgknn/10.15.1_0'
    );
    const context = await browserTypes[browserName].launchPersistentContext(
      '',
      {
        headless: false,
        args: [
          `--disable-extensions-except=${pathToExtension}`,
          `--load-extension=${pathToExtension}`,
        ],
      }
    );
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    // for manifest v2:
    let [background] = context.backgroundPages();
    if (!background) background = await context.waitForEvent('backgroundpage');

    // for manifest v3:
    // let [background] = context.serviceWorkers();
    // if (!background) background = await context.waitForEvent('serviceworker');
    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

// test('example test', async ({ page }) => {
//   await page.goto('http://localhost:3000');
//   // await expect(page.locator('body')).toHaveText('Changed by Metamask');
// });
test('login test', async ({ page, extensionId }) => {
  await page.goto('http://localhost:3000');

  //Login Screen
  await page.waitForSelector(
    '.pages__Page-sc-9ab9105f-2 > .pages__MaxContentWidth-sc-9ab9105f-0 > .pages__ConnectorList-sc-9ab9105f-5 > .pages__Connector-sc-9ab9105f-6:nth-child(1) > .Connector__Container-sc-c7af9b3d-0'
  );
  await page.click(
    '.pages__Page-sc-9ab9105f-2 > .pages__MaxContentWidth-sc-9ab9105f-0 > .pages__ConnectorList-sc-9ab9105f-5 > .pages__Connector-sc-9ab9105f-6:nth-child(1) > .Connector__Container-sc-c7af9b3d-0'
  );

  await page.goto(`chrome-extension://${extensionId}/popup.html`, {
    timeout: 2000,
  });

  // First time Conversations Screen
  await page.waitForSelector(
    '#__next > .Conversations__Page-sc-aebad486-3 > .Conversations__Centered-sc-aebad486-4 > .MobileDisclaimerCard__Card-sc-9ef1fbc6-2 > .MobileDisclaimerCard__Button-sc-9ef1fbc6-5'
  );
  await page.click(
    '#__next > .Conversations__Page-sc-aebad486-3 > .Conversations__Centered-sc-aebad486-4 > .MobileDisclaimerCard__Card-sc-9ef1fbc6-2 > .MobileDisclaimerCard__Button-sc-9ef1fbc6-5'
  );

  // Conversations Screen
  await page.waitForSelector(
    '#__next > .Conversations__Page-sc-aebad486-3 > .Conversations__Centered-sc-aebad486-4 > .MobileStatusCard__Card-sc-ad83da83-1 > .MobileStatusCard__Button-sc-ad83da83-5'
  );
  await page.click(
    '#__next > .Conversations__Page-sc-aebad486-3 > .Conversations__Centered-sc-aebad486-4 > .MobileStatusCard__Card-sc-ad83da83-1 > .MobileStatusCard__Button-sc-ad83da83-5'
  );

  const Header = page.locator(
    '.MobileConversationsHeader__ActiveCategory-sc-954424f9-0 cKLhCG'
  );
  await expect(Header).toContainText('All Messages');

  // await page.waitForSelector(
  //   '#__next > .Conversations__Page-sc-aebad486-3 > .Conversations__Centered-sc-aebad486-4 > .MobileStatusCard__Card-sc-ad83da83-1 > .MobileStatusCard__Button-sc-ad83da83-5'
  // );
  // await page.click(
  //   '#__next > .Conversations__Page-sc-aebad486-3 > .Conversations__Centered-sc-aebad486-4 > .MobileStatusCard__Card-sc-ad83da83-1 > .MobileStatusCard__Button-sc-ad83da83-5'
  // );

  // await browser.close();

  // await page.goto(`chrome-extension://${extensionId}/popup.html`, {
  //   timeout: 2000,
  // });
  // await page.waitForSelector(
  //   '.button.btn--rounded.btn-primary.first-time-flow__button',
  //   { state: 'attached' }
  // );
  // await page.click('.button.btn--rounded.btn-primary.first-time-flow__button');
  // await expect(page.locator('body')).toHaveText('my-extension popup');
});
