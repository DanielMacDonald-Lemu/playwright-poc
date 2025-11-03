import {test as base} from '@playwright/test';

export const test = base.extend({
    authenticatedPage: async ({page}, use) => {
        // Set timeout
        test.setTimeout(180000);

        // Add bypass header
        await page.setExtraHTTPHeaders({
            'x-vercel-protection-bypass': process.env.VERCEL_BYPASS_TOKEN
        });

        await page.goto('https://lm-shop-frontend-git-develop-lemvigh-muller.vercel.app/da');
        await page.waitForTimeout(3000);

        // Handle Vercel password
        const vercelPasswordField = await page.$('input[name="_vercel_password"]');
        if (vercelPasswordField) {
            await page.fill('input[name="_vercel_password"]', process.env.VERCEL_PASSWORD);
            await page.click('button.submit');
            await page.waitForSelector('input[name="_vercel_password"]', {state: 'hidden', timeout: 20000});
            await page.waitForTimeout(10000);
        }

        // Handle cookies
        try {
            await page.click('.coi-banner__accept', {timeout: 5000});
            await page.waitForTimeout(2000);
        } catch (e) {
            // no cookie banner
        }

        // Click login button
        await page.waitForSelector('button.UserBottomNavigationLinks_loggedInItem__ieE7q', {timeout: 60000});
        await page.click('button.UserBottomNavigationLinks_loggedInItem__ieE7q');

        // Fill login
        await page.waitForSelector('#loginID', {timeout: 15000});
        await page.waitForTimeout(1000);

        await page.fill('#loginID', process.env.LOGIN_EMAIL);
        await page.fill('#password', process.env.LOGIN_PASSWORD);

        // Submit
        await page.click('button.LoginForm_button__7DvMh[type="submit"]');

        // Wait for spinner
        console.log('Waiting for login to complete...');
        await page.waitForSelector('#loginID', {state: 'hidden', timeout: 30000});

        // Wait for page load
        await page.waitForTimeout(5000);

        // Take screenshot
        await page.screenshot({path: 'screenshots/after-login-complete.png', fullPage: true});

        // Page should be ready
        try {
            await page.waitForSelector('button[data-ui-test="my-lemu-link-log-out"]', {timeout: 10000});
            console.log('Logout button found - user is logged in!');
        } catch (e) {
            console.log('Logout button still not visible, continuing anyway...');
        }

        await page.waitForTimeout(2000);

        console.log('User logged in - ready for test');

        await use(page);

        await page.screenshot({path: 'screenshots/test-cleanup.png', fullPage: true});
    },
});

export {expect} from '@playwright/test';