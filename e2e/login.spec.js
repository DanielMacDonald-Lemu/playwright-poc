import { test, expect } from '@playwright/test';

test('login på shop.lemu.dk', async ({ page }) => {
    // Øg timeout for hele testen
    test.setTimeout(60000);

    // Gå til siden
    await page.goto('https://shop.lemu.dk', { waitUntil: 'domcontentloaded' });

    // Håndter cookies hvis banneret er der
    try {
        await page.waitForSelector('.coi-banner__accept', { timeout: 5000 });
        await page.click('.coi-banner__accept');
        console.log('Cookie banner accepteret');
        await page.waitForTimeout(1000);
    } catch (e) {
        console.log('Ingen cookie banner fundet');
    }

    // Tag screenshot af forsiden
    await page.screenshot({ path: 'screenshots/01-forside.png', fullPage: true });

    // Vent på og klik på "Log ind" knappen
    await page.waitForSelector('button.UserBottomNavigationLinks_loggedInItem__ieE7q', { timeout: 10000 });
    await page.locator('button.UserBottomNavigationLinks_loggedInItem__ieE7q').click();

    // Vent på at login-modal åbner og felterne er synlige
    await page.waitForSelector('#loginID', { timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/02-login-modal.png', fullPage: true });

    // Udfyld login felter med miljøvariabler
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