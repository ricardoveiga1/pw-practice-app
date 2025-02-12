### Ngx-Admin Angular 14 application from akveo.com

This is modified and more lightweight version of original application to practice UI Automation with Playwright.

The original repo is here: https://github.com/akveo/ngx-admin

### Comandos 12/02/2025

npx playwright test
npx playwright show-report

npx playwright test --project=chromium --headed // specific browser
npx playwright test example.spec.ts --project=chromium // specific file test

npx playwright test -g "has title" --project=chromium // specific test name

// podemos usar .skip e .only para esclher apenas um teste a executar  test.only ou .skip('has title', async ({ page }) => {


npx playwright test --ui // open de UI test

npx playwright test --project=chromium --trace on   // DEBUG test

npx playwright test --project=chromium --debug


//Install playwright

npm init playwrith@latest --force

Getting started with writing end-to-end tests with Playwright:
Initializing project in '.'
✔ Where to put your end-to-end tests? · tests
✔ Add a GitHub Actions workflow? (y/N) · false
✔ Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) · true
Installing Playwright Test (npm install --save-dev @playwright/test)…