### Ngx-Admin Angular 14 application from akveo.com

This is modified and more lightweight version of original application to practice UI Automation with Playwright.

The original repo is here: https://github.com/akveo/ngx-admin


### Comandos 08/11/2025

npx playwright test
npx playwright show-report

npx playwright test --project=chromium // executa teste em background

npx playwright test --project=chromium --headed // browser específico em modo assistido, por padrão 
npx playwright test example.spec.ts --project=chromium // teste específico
npx playwright test example.spec.ts --project=chromium --headed // teste específico em modo assistido

npx playwright test -g "has title" --project=chromium // nome do teste específico
npx playwright test -g "has title" --project=chromium --headed // nome do teste específico

// podemos usar .skip .only para escolher apenas um teste a executar  test.only ou .skip('has title', async ({ page }) => {


npx playwright test --ui // open de UI test

npx playwright test --project=chromium --trace on   // DEBUG test

npx playwright test --project=chromium --debug // visualiza o inspector do playwright, consegue ver o passo a passo do teste, next next next

// podemos executar em modo debug, basta por breakpoint


// LOCATORS - https://playwright.dev/docs/other-locators

// Auto-waiting of elements from playwright - https://playwright.dev/docs/actionability   /  http://www.uitestingplayground.com/ajax
// definimos algumas configs padrão no arquivo playwright.config.ts - timeout é uma delas
