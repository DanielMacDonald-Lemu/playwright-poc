import {expect, test} from "../fixtures/auth.fixture";

test('create stocklist', async ({ authenticatedPage }) => {
    await authenticatedPage.waitForTimeout(9000);
    await authenticatedPage.click('a[data-ui-test="nav-top-list-overview-link"]');
  //  await page.getByText('Lister').click();
    await authenticatedPage.waitForTimeout(9000);

    await authenticatedPage.waitForURL('**/lister');
    await authenticatedPage.screenshot({ path: 'screenshots/01-lists.png', fullPage: true });

    //
    // data-ui-test="nav-top-list-overview-link"
    // await page.click('button.UserTopNavigationLinks_pageTitle__XcBCX');
    // await page.click('button.StockListSearchAndActionBar_navigationButton__cjF_F');
    // await page.click('button.ActionBarButton_button__0KILQ');

    console.log('stocklist created');
});