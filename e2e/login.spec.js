import { test, expect } from '@playwright/test';

test('login på shop.lemu.dk', async ({ page }) => {
    test.setTimeout(180000);

    await page.goto('https://lm-shop-frontend-git-daily-lemvigh-muller.vercel.app/da');
    await page.waitForTimeout(3000);

    // Screenshot 1: Initial load
    await page.screenshot({ path: 'screenshots/01-initial-page.png', fullPage: true });

    // Håndter Vercel password
    const vercelPasswordField = await page.$('input[name="_vercel_password"]');
    if (vercelPasswordField) {
        await page.fill('input[name="_vercel_password"]', process.env.VERCEL_PASSWORD);
        await page.screenshot({ path: 'screenshots/02-vercel-password-filled.png', fullPage: true });

        await page.click('button.submit');

        // Vent på at password-feltet forsvinder
        await page.waitForSelector('input[name="_vercel_password"]', { state: 'hidden', timeout: 20000 });

        // Vent simpelt 10 sekunder
        await page.waitForTimeout(10000);
    }

    // Screenshot 2: Efter Vercel auth
    await page.screenshot({ path: 'screenshots/03-after-vercel-auth.png', fullPage: true });

    // Håndter cookies
    try {
        await page.click('.coi-banner__accept', { timeout: 5000 });
        await page.waitForTimeout(2000);
    } catch (e) {
        // Ingen cookie banner
    }

    // Screenshot 3: Efter cookies
    await page.screenshot({ path: 'screenshots/04-after-cookies.png', fullPage: true });

    // Vent på login knap
    await page.waitForSelector('button.UserBottomNavigationLinks_loggedInItem__ieE7q', { timeout: 60000 });

    // Screenshot 4: Før login click
    await page.screenshot({ path: 'screenshots/05-before-login-click.png', fullPage: true });

    await page.click('button.UserBottomNavigationLinks_loggedInItem__ieE7q');

    // Udfyld login
    await page.waitForSelector('#loginID', { timeout: 15000 });
    await page.waitForTimeout(1000);

    // Screenshot 5: Login modal åben
    await page.screenshot({ path: 'screenshots/06-login-modal-open.png', fullPage: true });

    await page.fill('#loginID', process.env.LOGIN_EMAIL);
    await page.fill('#password', process.env.LOGIN_PASSWORD);

    // Screenshot 6: Felter udfyldt
    await page.screenshot({ path: 'screenshots/07-credentials-filled.png', fullPage: true });

    // Submit
    await page.click('button.LoginForm_button__7DvMh[type="submit"]');

    await page.waitForTimeout(5000);

    // Screenshot 7: Efter login submit
    await page.screenshot({ path: 'screenshots/08-after-submit.png', fullPage: true });

    await page.waitForTimeout(2000);

    // Screenshot 8: Final state
    await page.screenshot({ path: 'screenshots/09-final-logged-in.png', fullPage: true });

    console.log('Login gennemført!');
});