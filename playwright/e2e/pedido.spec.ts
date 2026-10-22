import { test, expect } from '@playwright/test';

test('Deve consultar um pedido aprovado', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

  await page.getByRole('link', { name: 'Consultar Pedido' }).click();

  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  
  
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-2YE8IX');
  await page.getByRole('button', { name: 'Buscar pedido' }).click();


  const containerPedido = page.getByRole('paragraph')
    .filter({ hasText: /^Pedido$/ })
    .locator('..') 

  await expect(containerPedido).toContainText('VLO-2YE8IX', {timeout: 10_000})


  await expect(page.getByText('APROVADO')).toBeVisible()
  

});
