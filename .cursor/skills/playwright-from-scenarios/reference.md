# Referência Playwright — Projeto Velô

## data-testids mapeados

### Landing
| testid | Elemento |
|--------|----------|
| `landing-page` | Container principal |
| `hero-section` | Seção hero |
| `hero-cta-primary` | CTA "Configure Agora" |
| `header-logo` | Logo |
| `header-nav` | Nav desktop |
| `header-cta` | CTA header |
| `header-menu-toggle` | Menu mobile |
| `specs-section` | Especificações |
| `faq-section` | FAQ |
| `footer` | Rodapé |

### Configurador
| testid | Elemento |
|--------|----------|
| `section-cores` | Seção cores |
| `color-option-{id}` | Swatch de cor |
| `section-rodas` | Seção rodas |
| `wheel-option-{type}` | Opção de roda |
| `section-opcionais` | Opcionais |
| `opt-precision-park` | Checkbox Precision Park |
| `opt-flux-capacitor` | Checkbox Flux Capacitor |
| `total-price` | Preço total |
| `checkout-button` | Ir para checkout |
| `car-exterior-image` | Imagem do carro |

### Checkout
| testid | Elemento |
|--------|----------|
| `checkout-name` | Nome |
| `checkout-surname` | Sobrenome |
| `checkout-email` | Email |
| `checkout-phone` | Telefone |
| `checkout-cpf` | CPF |
| `checkout-store` | Loja |
| `checkout-terms` | Termos |
| `checkout-submit` | Confirmar |
| `payment-avista` | À vista |
| `payment-financiamento` | Financiamento |
| `input-entry-value` | Valor entrada |
| `summary-total-price` | Total resumo |

### Sucesso / Consulta
| testid | Elemento |
|--------|----------|
| `success-status` | Status do pedido |
| `order-id` | Número do pedido |
| `search-order-id` | Campo busca |
| `search-order-button` | Botão buscar |
| `order-result-status` | Status na consulta |

## Spec de exemplo completo

```typescript
import { test, expect } from '@playwright/test';
import { validCustomer } from './helpers/fixtures';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/configure');
    await page.getByTestId('checkout-button').click();
  });

  test('CHK-001 — Submit com campos vazios', async ({ page }) => {
    await page.getByTestId('checkout-submit').click();
    await expect(page.getByText('Nome deve ter pelo menos 2 caracteres')).toBeVisible();
  });

  test('CHK-013 — Pagamento à vista padrão', async ({ page }) => {
    await expect(page.getByTestId('payment-avista')).toHaveClass(/border-primary/);
  });
});
```

## Mocks de crédito por cenário

| Cenário | Score mock | Status esperado |
|---------|-----------|-----------------|
| CRD-002 | 750 | APROVADO |
| CRD-003 | 600 | EM_ANALISE |
| CRD-004 | 450 | REPROVADO |
| CRD-005 | 650 + entrada 50% | APROVADO |

## Scripts package.json sugeridos

Adicionar ao `package.json` se ausente:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:report": "playwright show-report"
  }
}
```
