import {expect, test} from 'playwright/test'

test.beforeEach(async({page}, testInfo) => {
  await page.goto('http://www.uitestingplayground.com/ajax')
  await page.getByText('Button Triggering AJAX Request').click()
  testInfo.setTimeout(testInfo.timeout + 2000) // adicionando 2 segundos a mais a partir do timeout default
})

test('auto waiting', async({page}) => {

  // usando timeout padrão da ferramenta, vai quebrar porque alterei na config para 10 segundos
  const successButton = page.locator('.bg-success')
  //await successButton.click()


  //const text = await  successButton.textContent()  // essa validação aguarda elemento é um timout generoso
/*
  await successButton.waitFor({state: "attached"})
  const text = await  successButton.allTextContents() // essa validação não espera o tempo que elemento demora retornar de 15 segundos
  expect(text).toContain('Data loaded with AJAX get request.')

 */
  // default dessa acertiva são 5s, então devemos aumentar timeout
  await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})

})

test('alternative waits', async({page}) => {
  // o texto que exibido tem a class bg-success
  const successButton = page.locator('.bg-success')

  //___wait for element
  //await page.waitForSelector('.bg-success')

  //____wait for particular response
  await page.waitForResponse('http://www.uitestingplayground.com/ajaxdata') // é url do response, olhar no network do browser>ajax>headers

  //___wait for network calls to be completed (Note recommended)
  //await page.waitForLoadState('networkidle')

  const text = await successButton.allTextContents()
  expect(text).toContain('Data loaded with AJAX get request.')

})

test('timeouts', async({page}) => {
  test.setTimeout(10000) // setando todo test para 10s
  test.slow() // adiciona mais tempo somente teste a cho que 3 segundos
  const successButton = page.locator('.bg-success')
  await successButton.click({timeout: 16000})

})
