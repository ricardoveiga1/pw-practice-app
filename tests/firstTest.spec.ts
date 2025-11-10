import {expect, test} from 'playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})


test('Locator syntax rules', async({page}) => {
    //by Tag name
    await page.locator('input').first().click()

    //by ID
    //await page.locator('#inputEmail1').click()

    //by Class Value - selecione apenas uma classe: input-full-width size-medium status-basic shape-rectangle nb-transition
    page.locator('.shape-rectangle')

    //by Attribute
    page.locator('[placeholder="Email"]')


    //by Class value(full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine differente selectors
    //exemplo: 'input[placeholder="Email"].shape-rectangle' - tipo input + placeholder + class - tem que ser sem espaço
    page.locator('input[placeholder="Email"][nbinput]')

    //by XPath(NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')

    // by partial text match
    page.locator(':text("Using")')

    // by exact text match
    page.locator(':text-is("Using the Grid")')

})

test('User facing locators', async({page} )=> {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()
    
    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    await page.getByTestId('SignIn').click()

   //await page.getByTitle('IoT Dashboard').click()


})

test('locating child elements', async({page})=>{
    // as duas estratégias fazem a mesma coisa, a diferença é que a primeira é compacta
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name: 'Sign in'}).first().click()

    // quarta linha está usando index, o quarto elemento nb_card, sempre starta em 0
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('locating parent elements' , async({page}) =>{
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).first().click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()
    
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    // usando locator status danger é uam class do botão em vermelho submit
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    //fazendo filtro no form que possui um checkbox usando o locator nb-checkbox
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"})
    .getByRole('textbox', {name: "Email"}).click()

    //nao recomendado, é um xpath
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()

})

test('Reusing the locators' , async({page}) =>{
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    //criando uma cost de outra const
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    //await basicForm.getByRole('textbox', {name: "Email"}).fill('test@test.com')
    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    //assert apenas se o campo está preenchido
    await expect(emailField).toHaveValue('test@test.com')

})

test('Extracting values' , async({page}) =>{
    // single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    // all text values
    // ele cria uma lista com todas labels do tipo radio, se por exemplo option 12 vai dar erro, porque não existe na lista da webpage
    //Error: expect(received).toContain(expected) // indexOf
    //Expected value: "Option 12"
    //Received array: ["Option 1", "Option 2", "Disabled Option"]
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1")

    // input value 
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com') // preenchendo campo
    const emailValue = await emailField.inputValue() // pegando valor do campo preenchido na linha anterior
    await expect(emailValue).toEqual('test1@test.com') // validando


    // checando se o nome do placeholder do campo email é Email 
    const placeHolderValue = await emailField.getAttribute('placeHolder')
    expect(placeHolderValue).toEqual('Email')

})


test('assertions', async({page}) => {

    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    // general assertions
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //locator assertion - boa prática, regular assetion
    await expect(basicFormButton).toHaveText('Submit')

    // Soft assertion -  usado quando queremos mesmo que dê erro no passo anterior, continue, não é muito utilizado
    await expect.soft(basicFormButton).toHaveText('Submit5')
    await basicFormButton.click()
})




