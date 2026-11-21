const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  console.log('Navigating to http://localhost:8080/forgot-password...');
  await page.goto('http://localhost:8080/forgot-password', { waitUntil: 'networkidle2' });

  const artifactDir = path.resolve('C:/Users/tuhin/.gemini/antigravity/brain/d753f082-c64f-42d2-9a51-a3d1005af268');

  // Screenshot 1: Direct Forgot Password Form
  await page.screenshot({ path: path.join(artifactDir, 'forgot_password_direct_form.png'), fullPage: true });
  console.log('Saved forgot_password_direct_form.png');

  // Fill in email, password, and confirmPassword
  const emailInput = await page.$('input[type="email"]');
  const passwordInputs = await page.$$('input[type="password"]');

  if (!emailInput || passwordInputs.length < 2) {
    console.error('Could not find all required form inputs!');
    await browser.close();
    process.exit(1);
  }

  console.log('Filling form inputs...');
  await emailInput.type('harispatel62@gmail.com', { delay: 20 });
  await passwordInputs[0].type('NewSecurePass123!', { delay: 20 });
  await passwordInputs[1].type('NewSecurePass123!', { delay: 20 });

  await new Promise(r => setTimeout(r, 600));

  // Screenshot 2: Filled form with live validation badges green
  await page.screenshot({ path: path.join(artifactDir, 'forgot_password_filled_form.png'), fullPage: true });
  console.log('Saved forgot_password_filled_form.png');

  // Click Submit Button
  console.log('Submitting password reset...');
  const submitButton = await page.$('button[type="submit"]');
  await submitButton.click();

  // Wait for confirmation card
  await page.waitForSelector('text/Password Reset Successful!', { timeout: 10000 });
  console.log('Confirmation message visible!');

  await new Promise(r => setTimeout(r, 1000));
  // Screenshot 3: Success Confirmation State
  await page.screenshot({ path: path.join(artifactDir, 'forgot_password_success.png'), fullPage: true });
  console.log('Saved forgot_password_success.png');

  // Click "Sign In with New Password"
  console.log('Clicking "Sign In with New Password"...');
  const signInButton = await page.$('text/Sign In with New Password');
  if (signInButton) {
    await signInButton.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('Navigated to:', page.url());

    // Screenshot 4: Login page with prefilled email
    await page.screenshot({ path: path.join(artifactDir, 'login_prefilled_email.png'), fullPage: true });
    console.log('Saved login_prefilled_email.png');

    // Type the new password and log in
    const loginPwd = await page.$('input[type="password"]');
    if (loginPwd) {
      await loginPwd.type('NewSecurePass123!', { delay: 20 });
      const loginBtn = await page.$('button[type="submit"]');
      await loginBtn.click();
      console.log('Submitted login with new password...');

      await new Promise(r => setTimeout(r, 3000));
      console.log('Current URL after login:', page.url());
      await page.screenshot({ path: path.join(artifactDir, 'login_success_with_new_pwd.png'), fullPage: true });
      console.log('Saved login_success_with_new_pwd.png');
    }
  }

  await browser.close();
  console.log('Test completed successfully!');
})().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
