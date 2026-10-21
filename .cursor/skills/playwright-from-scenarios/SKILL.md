---
name: playwright-from-scenarios
description: >-
  Implementa testes Playwright E2E a partir de cenários documentados. Use quando
  o usuário pedir para desenvolver, implementar ou automatizar cenários de teste
  em Playwright, ou converter docs/cenarios em código de teste.
---

# Playwright a partir de Cenários

## Objetivo

Converter cenários documentados (especialmente tipo **E2E**, P0/P1) em specs Playwright executáveis.

## Pré-requisitos

1. Cenários existem em `docs/cenarios/` ou `docs/cenarios-de-teste.md`
2. App acessível (local ou URL configurada)
3. `playwright.config.ts` no projeto

## Estrutura de arquivos

```
playwright/
├── e2e/
│   ├── {modulo}.spec.ts       # ex.: landing.spec.ts, checkout.spec.ts
│   └── helpers/
│       ├── fixtures.ts        # dados de teste compartilhados
│       └── pages/             # Page Objects (opcional, módulos complexos)
playwright.config.ts
```

Organizar specs **por módulo/funcionalidade**, não um arquivo por cenário.

## Convenções deste projeto

| Item | Padrão |
|------|--------|
| Diretório | `playwright/e2e/` |
| Seletores | Preferir `[data-testid="..."]` |
| Nome do teste | `` `{ID} — {descrição do cenário}` `` |
| baseURL | Configurar em `playwright.config.ts` (`http://localhost:8080` ou env) |
| Idioma asserts | Português quando UI é pt-BR |

## Workflow

```
- [ ] Ler cenários alvo (IDs ou arquivo)
- [ ] Verificar data-testids no código-fonte
- [ ] Criar/atualizar helpers se necessário
- [ ] Implementar specs
- [ ] Executar testes
- [ ] Corrigir até passar
```

### 1. Selecionar cenários

Por padrão implementar:
- Tipo = **E2E**
- Prioridade = **P0** e **P1**

Registrar cenários P2+ como `test.skip` com comentário do ID se usuário pedir rastreabilidade.

### 2. Mapear cenário → teste

```typescript
// Cenário CFG-003: Seleção de cor Midnight Black
test('CFG-003 — Seleção de cor Midnight Black', async ({ page }) => {
  await page.goto('/configure');
  await page.getByTestId('color-option-midnight-black').click();
  await expect(page.getByTestId('car-exterior-image')).toBeVisible();
  await expect(page.getByTestId('total-price')).toHaveText(/R\$/);
});
```

### 3. Page Objects (módulos complexos)

Usar quando checkout ou jornada E2E tiver ≥ 5 passos repetidos.

```typescript
// playwright/e2e/helpers/pages/checkout.page.ts
export class CheckoutPage {
  constructor(private page: Page) {}
  async fillPersonalInfo(data: CustomerData) { /* ... */ }
  async submit() {
    await this.page.getByTestId('checkout-submit').click();
  }
}
```

### 4. Dados de teste

Centralizar em `playwright/e2e/helpers/fixtures.ts`:

```typescript
export const validCustomer = {
  name: 'João',
  surname: 'Silva',
  email: 'joao.silva@teste.com',
  phone: '(11) 98765-4321',
  cpf: '123.456.789-00',
  store: 'Velô Paulista - Av. Paulista, 1000',
};
```

### 5. Configuração

Garantir em `playwright.config.ts`:

```typescript
use: {
  baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8080',
  trace: 'on-first-retry',
},
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:8080',
  reuseExistingServer: !process.env.CI,
},
```

## Padrões de implementação

### Navegação
```typescript
await page.goto('/configure');
await expect(page).toHaveURL(/\/configure/);
```

### Formulários com máscara
```typescript
await page.getByTestId('checkout-phone').fill('(11) 98765-4321');
await page.getByTestId('checkout-cpf').fill('123.456.789-00');
```

### Select (Radix/shadcn)
```typescript
await page.getByTestId('checkout-store').click();
await page.getByRole('option', { name: 'Velô Paulista' }).click();
```

### APIs externas (crédito)
Mockar quando cenário depende de score:

```typescript
await page.route('**/functions/v1/credit-analysis', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ score: 750, status: 'Done' }),
  });
});
```

### Jornadas E2E
Agrupar com `test.describe` e reutilizar helpers:

```typescript
test.describe('E2E-001 — Jornada feliz à vista', () => {
  test('fluxo completo', async ({ page }) => { /* ... */ });
});
```

## Anti-padrões

- ❌ `page.waitForTimeout()` — usar `expect` com auto-retry
- ❌ Seletores CSS frágeis (`div > div > button:nth-child(2)`)
- ❌ Testes dependentes de ordem de execução
- ❌ Hardcode de URL completa quando `baseURL` existe
- ❌ Ignorar cenário sem documentar o ID

## Validação

```bash
# Todos
npx playwright test

# Por spec
npx playwright test playwright/e2e/checkout.spec.ts

# Por ID no nome
npx playwright test --grep "CHK-001"

# Com UI (debug)
npx playwright test --ui
```

Corrigir falhas antes de concluir. Se `data-testid` faltar, sugerir adição no componente React.

## Saída ao concluir

```markdown
## Playwright implementado

- Spec(s): playwright/e2e/{arquivo}.spec.ts
- Cenários: {IDs implementados}
- Execução: {N} passed, {M} skipped
- Gaps: {seletores ou mocks pendentes}
```

## Referências

- Padrões detalhados: [reference.md](reference.md)
- Cenários existentes: [docs/cenarios-de-teste.md](../../../docs/cenarios-de-teste.md)
- Config: [playwright.config.ts](../../../playwright.config.ts)
