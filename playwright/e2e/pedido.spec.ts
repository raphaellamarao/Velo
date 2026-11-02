import { test, expect } from '@playwright/test';

import { generateOrderCode } from '../support/helpers'


test.describe('Consulta de pedido', ()=> {


  test.beforeEach(async ({page}) => {
  await page.goto('http://localhost:5173')

  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

  await page.getByRole('link', { name: 'Consultar Pedido' }).click();

  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  })

test('Deve consultar um pedido aprovado', async ({ page }) => {
  

    const order = 'VLO-2YE8IX'

//Arrange
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
  await page.getByRole('button', { name: 'Buscar pedido' }).click();


  // const containerPedido = page.getByRole('paragraph')
  //   .filter({ hasText: /^Pedido$/ })
  //   .locator('..')

  // await expect(containerPedido).toContainText('VLO-2YE8IX', { timeout: 10_000 })


  // await expect(page.getByText('APROVADO')).toBeVisible()

  await expect(page.getByTestId(`order-result-${order}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order}
    - img
    - text: APROVADO
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: Glacier Blue
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: aero Wheels
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: Fernando Papito
    - paragraph: Email
    - paragraph: papito@velo.dev
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: À Vista
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

});

test('Deve exibir mensagem quando o pedido nao é encontrado', async ({ page }) => {

  const order = generateOrderCode()


  // Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
  await page.getByRole('button', { name: 'Buscar pedido' }).click();

  // Assert
  // await expect(page.locator('#root')).toContainText('Pedido não encontrado')
  // await expect(page.locator('#root')).toContainText('Verifique o número do pedido e tente novamente')

  // const title = page.getByRole('heading', {name: 'Pedido não encontrado'})
  // await expect(title).toBeVisible()

  //   const message = page.getByRole('heading', {name: 'Pedido não encontrado'})
  // await expect(message).toBeVisible()

  //const title = page.getByRole('paragraph')

  await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `);


})

})