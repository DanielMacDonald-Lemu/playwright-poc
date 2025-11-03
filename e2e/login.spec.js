import { test, expect } from '../fixtures/auth.fixture';

test('verify login', async ({ authenticatedPage }) => {

    await authenticatedPage.screenshot({ path: 'screenshots/01-logged-in.png', fullPage: true });

    // Verify logout button is visible
    const logoutButton = await authenticatedPage.isVisible('button[data-ui-test="my-lemu-link-log-out"]');
    expect(logoutButton).toBeTruthy();

    console.log('Login verification test passed!');
});

