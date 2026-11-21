const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\tuhin\\.gemini\\antigravity\\brain\\d753f082-c64f-42d2-9a51-a3d1005af268';

async function runDirectResetVerification() {
  console.log('Launching headless Chrome with CDP...');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9255',
    '--user-data-dir=C:\\Users\\tuhin\\AppData\\Local\\Temp\\chrome_direct_reset_test2',
    '--disable-gpu',
    '--window-size=1400,900',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const version = await (await fetch('http://127.0.0.1:9255/json/version')).json();
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const curId = id++;
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === curId) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await new Promise(r => ws.addEventListener('open', r));
  const target = await send('Target.createTarget', { url: 'http://localhost:8080/' });
  const pageWs = new WebSocket('ws://127.0.0.1:9255/devtools/page/' + target.targetId);
  await new Promise(r => pageWs.addEventListener('open', r));

  let pageId = 1;
  const pageSend = (method, params = {}) => new Promise((resolve, reject) => {
    const curId = pageId++;
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === curId) {
        pageWs.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    pageWs.addEventListener('message', handler);
    pageWs.send(JSON.stringify({ id: curId, method, params }));
  });

  await pageSend('Page.enable');
  await pageSend('Runtime.enable');

  const capture = async (filename) => {
    const shot = await pageSend('Page.captureScreenshot', { format: 'png' });
    const fullPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(fullPath, Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot:', filename);
  };

  const evaluate = async (expression) => {
    const res = await pageSend('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) {
      console.error('Eval error for:', expression, res.exceptionDetails);
    }
    return res.result?.value;
  };

  // 1. Navigate to /forgot-password
  console.log('Navigating to http://localhost:8080/forgot-password...');
  await pageSend('Page.navigate', { url: 'http://localhost:8080/forgot-password' });
  await new Promise(r => setTimeout(r, 2500));

  await capture('direct_forgot_password_form.png');

  // 2. Fill in Email, Password, ConfirmPassword using React-compliant native setter
  console.log('Filling form inputs with React-compatible setter...');
  await evaluate(`(() => {
    function setReactInput(input, value) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) setReactInput(emailInput, 'harispatel62@gmail.com');

    const passwordInputs = document.querySelectorAll('input[type="password"]');
    if (passwordInputs.length >= 2) {
      setReactInput(passwordInputs[0], 'NewPassword123!');
      setReactInput(passwordInputs[1], 'NewPassword123!');
    }
  })()`);

  await new Promise(r => setTimeout(r, 1200));
  await capture('direct_forgot_password_filled.png');

  // 3. Click Submit ("Reset Password")
  console.log('Clicking "Reset Password" button...');
  await evaluate(`(() => {
    const btn = document.querySelector('button[type="submit"]');
    if (btn) btn.click();
  })()`);

  // Wait for submission to complete and success screen to show
  await new Promise(r => setTimeout(r, 3500));
  await capture('direct_forgot_password_success.png');

  // 4. Click "Sign In with New Password"
  console.log('Clicking "Sign In with New Password"...');
  await evaluate(`(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const signInBtn = buttons.find(b => b.textContent.includes('Sign In with New Password'));
    if (signInBtn) signInBtn.click();
  })()`);

  await new Promise(r => setTimeout(r, 2500));
  const currentUrl = await evaluate(`window.location.href`);
  console.log('Current URL after redirect:', currentUrl);
  await capture('login_prefilled_email.png');

  // 5. Enter new password on login screen and log in
  console.log('Entering password on login screen and submitting...');
  await evaluate(`(() => {
    function setReactInput(input, value) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const pwdInput = document.querySelector('input[type="password"]');
    if (pwdInput) setReactInput(pwdInput, 'NewPassword123!');

    const loginBtn = document.querySelector('button[type="submit"]');
    if (loginBtn) loginBtn.click();
  })()`);

  await new Promise(r => setTimeout(r, 4000));
  const postLoginUrl = await evaluate(`window.location.href`);
  console.log('Post-login URL:', postLoginUrl);
  await capture('logged_in_with_new_password.png');

  pageWs.close();
  ws.close();
  chrome.kill();
  console.log('All end-to-end tests finished cleanly!');
}

runDirectResetVerification().catch(console.error);
