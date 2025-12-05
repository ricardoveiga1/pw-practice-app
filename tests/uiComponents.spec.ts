import {expect, test} from 'playwright/test'
import {delay} from "rxjs/operators";

test.beforeEach(async({page}, testInfo) => {
  await page.goto('http://localhost:4200/')
})

test.describe('Form Layouts page', () => {
  test.beforeEach(async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
  })

  test('input fields', async({page}) => {
    const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', { name: "Email"})

    await usingTheGridEmailInput.fill('test@test.com')
    await usingTheGridEmailInput.clear()
    await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 500})

    // generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue()
    expect(inputValue).toEqual('test2@test.com')


    // locator assertion
    await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')


  })


  test('radio buttons', async({page}) => {
    const usingTheGridCard = page.locator('nb-card', {hasText: "Using the Grid"})

    //await usingTheGridCard.getByLabel('Option 1').check({force: true})
    await usingTheGridCard.getByRole('radio', {name: "Option 1"}).check({force: true})
    const radioStatus = await usingTheGridCard.getByLabel('Option 1').isChecked()
    expect(radioStatus).toBeTruthy()
    // validando se está com check
    await expect(usingTheGridCard.getByRole('radio', {name: "Option 1"})).toBeChecked()

    await usingTheGridCard.getByRole('radio', {name: "Option 2"}).check({force: true}) // fazendo check no option 2
    expect(await usingTheGridCard.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
    expect(await usingTheGridCard.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
  })

})

test.describe('Toaster page', () => {
  test.beforeEach( async ({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()
  })

  test('checkboxes', async({page}) => {
    // check vs uncheck vs click
    await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true})
    await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true})

    //check all buttons
    const allBoxes = page.getByRole('checkbox')
    for (const box of await allBoxes.all()){// convertendo em um array
      await box.uncheck({force: true})
      expect(await box.isChecked()).toBeFalsy()
    }
  })
})

test('Lists and Dropdown', async ({page}) => {

  const dorpDownMenu = page.locator('ngx-header nb-select')
  await dorpDownMenu.click()

  page.getByRole('list') // when the list has a UL tag
  page.getByRole('listitem') //the the list has LI tag

  const optionList = page.locator('nb-option-list nb-option')
  // const optionList = page.getByRole('list').locator('nb-option')
  await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]) // validando lista
  await optionList.filter({hasText: "Cosmic"}).click()
  await expect(dorpDownMenu).toHaveText("Cosmic")
  //validando se a cor do background foi alterada - tem print na pasta prints aulas
  const header = page.locator('nb-layout-header')
  await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

  const colors = {
    "Light": "rgb(255, 255, 255)",
    "Dark": "rgb(34, 43, 69)",
    "Cosmic": "rgb(50, 50, 89)",
    "Corporate": "rgb(255, 255, 255)"
  }

  await dorpDownMenu.click()

  for(const color in colors){
    await optionList.filter({hasText: color}).click()
    await expect(header).toHaveCSS('background-color', colors[color])
    if(color != "Corporate")
      await dorpDownMenu.click()
  }
})

test('tooltips', async({page}) => {
  await page.getByText('Modal & Overlays').click()
  await page.getByText('Tooltip').click()

  const toolTipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
  await toolTipCard.getByRole('button', {name: "Top"}).hover()

  //macete no MAC é ir para modo desenvolvedor> sourcers > usar fn + F8 para fazer freezing na página e entrar no modo debug > retornar Elements e explorar melhor e ver a mensagem do tooltip
  //https://www.google.com/search?q=freeze+chome+in+tooltip&oq=freeze+chome+in+tooltip&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIJCAEQIRgKGKABMgcIAhAhGI8C0gEINDUyMWowajSoAgCwAgE&sourceid=chrome&ie=UTF-8
  page.getByRole('tooltip') //if you have a role tooltip created for the tooltip
  const tooltip = await page.locator('nb-tooltip').textContent()
  expect(tooltip).toEqual('This is a tooltip')
})

test('dialog box', async({page}) => {
  await page.getByText('Tables & Data').click()
  await page.getByText('Smart Table').click()

  page.on('dialog', dialog => {
    expect(dialog.message()).toEqual('Are you sure you want to delete?')
    dialog.accept()
  })
  await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
// validando se registro foi excluído
  await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('Web tables', async({page}) => {
  await page.getByText('Tables & Data').click()
  await page.getByText('Smart Table').click()

  //1 get the row by any value in this row
  // const targetRow = page.getByRole('row', {name: "mdo@gmail.com"}) // indicado usar role row // fazendo query pelo elemento da tabela
  // await targetRow.locator('.nb-edit').click()
  // await page.locator('input-editor').getByPlaceholder('Age').clear() // utilizando duas estratégias juntas
  // await page.locator('input-editor').getByPlaceholder('Age').fill('35') // update Age
  // await page.locator('.nb-checkmark').click()
  // await expect(targetRow.locator('td').last()).toHaveText('35')
  //
  // //2 get the row based on the the value in the specific column
  // await page.locator('.ng2-smart-pagination-nav').getByText('2').click() // procure utilizar sempre o DOM
  // // const targetRowById = page.getByRole('row', {name: "11"}) -> se usar somente esta query, vai se perder porque na página 2 tem id 11 e age 11
  // const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})  //Create new scratch file from selection -> first column
  // await targetRowById.locator('.nb-edit').click()
  // await page.locator('input-editor').getByPlaceholder('E-mail').clear()
  // await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
  // await page.locator('.nb-checkmark').click()
  // await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com') // -> quinta coluna que é email

  // //3 test filter of the table
  const ages = ["20", "30", "40", "200"]

  for(let age of ages){
    await page.locator('input-filter').getByPlaceholder('Age').clear()
    await page.locator('input-filter').getByPlaceholder('Age').fill(age)
    await page.waitForTimeout(500) // foi adicionado para evitar falha na validação do age, geralmente existe um delay para carregar os dados, o que pode acarretar erro na validação do AGE
    const ageRows = page.locator('tbody tr') // pegando todas as linhas da tabela

    //validando se todos filtros de idade funcionam, geralmente existe um delay para carregar os dados, o que pode acarretar erro na validação do AGE
    // teste abaixo realiza filtro e verifica se todas rows são iguais a idade filtrada
    for(let row of await ageRows.all()){
      const cellValue = await row.locator('td').last().textContent()
      if(age == "200"){
        expect(await page.getByRole('table').textContent()).toContain('No data found')
      } else {
        expect(cellValue).toEqual(age)
      }
    }
  }

})

test('datepicker', async({page}) => {
  await page.getByText('Forms').click()
  await page.getByText('Datepicker').click()

  const calendarInputField = page.getByPlaceholder('Form Picker')
  await calendarInputField.click()

  // let date = new Date()
  // date.setDate(date.getDate() + 1)
  // const expectedDay = date.getDate().toString()

  // THIS IS PART ONE common Datepicker selection
  //await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', {exact: true}).click() // utilizando exatamente data 1, se não usar o true, vai pegar 11, 12, 13, e se perder
  //await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDay, {exact: true}).click()
  //await page.locator('nb-calendar-day-cell').filter({hasNot: page.locator('.bounding-month')}).getByText('19', {exact: true}).click()
  //await expect(calendarInputField).toHaveValue('Dec 6, 2025')// vai quebrar porque está data fixa, com D+1


  //THIS IS PART TWO
  let date = new Date()
  date.setDate(date.getDate() + 10) // adicionando 30 dias na data atual, necessita da lógica do while abaixo
  const expectedDay = date.getDate().toString()
  const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})// Jun, Jul, Dec, etc
  const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'}) // October, November, December, etc
  const expectedYear = date.getFullYear()
  const dateToAssert = `${expectedMonthShort} ${expectedDay}, ${expectedYear}`

  console.log(dateToAssert)
  console.log(expectedMonthLong)
  //lógica para navegar entre meses e anos, caso não encontre clique no próximo mês, até encontrar
  let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
  const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `
  while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
    await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
    calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
  }
  await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDay, {exact: true}).click()
  await expect(calendarInputField).toHaveValue(dateToAssert)

})

test('sliders', async({page}) => {
  // Update attribute
  // utilizando 3 elementos em cadeia para chegar no círculo do slider
  const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
  await tempGauge.evaluate(node => {
    node.setAttribute("cx", "232.193")
    node.setAttribute("cy", "232.193")
  })
  await tempGauge.click()


  // Mouse movement
  const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
  await tempBox.scrollIntoViewIfNeeded()

  const box = await tempBox.boundingBox()
  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 100, y) //moving mouse to the right from center of the box
  await page.mouse.move(x + 100, y + 100) //moving mouse down
  await page.mouse.up()
  await expect(tempBox).toContainText("30")
})


