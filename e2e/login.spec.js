import { test, expect } from '@playwright/test';
//small comment

test('login på shop.lemu.dk', async ({ page }) => {
    // Gå til siden
    await page.goto('https://shop.lemu.dk');

    // Vent på at siden er loadet
    await page.waitForLoadState('networkidle');

    // Håndter cookies hvis banneret er der
    try {
        await page.click('.coi-banner__accept', { timeout: 3000 });
        console.log('Cookie banner accepteret');
        await page.waitForTimeout(1000);
    } catch (e) {
        console.log('Ingen cookie banner fundet');
    }

    // Tag screenshot af forsiden
    await page.screenshot({ path: 'screenshots/01-forside.png', fullPage: true });

    // Klik på "Log ind" knappen
    await page.locator('button.UserBottomNavigationLinks_loggedInItem__ieE7q').click();

    // Vent på at login-modal åbner
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/02-login-modal.png', fullPage: true });

    // Udfyld login felter
    await page.fill('#loginID', process.env.LOGIN_EMAIL);
    await page.fill('#password', process.env.LOGIN_PASSWORD);

    await page.screenshot({ path: 'screenshots/03-felter-udfyldt.png' });

    // Klik på den røde "Log ind" knap
    await page.click('button.LoginForm_button__7DvMh[type="submit"]');

    // Vent på at login gennemføres
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Screenshot efter login
    await page.screenshot({ path: 'screenshots/04-efter-login.png', fullPage: true });

    console.log('Login test gennemført!');
});