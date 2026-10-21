---
name: qa-test-pipeline
description: >-
  Orquestra a esteira de QA: demanda do Azure DevOps → cenários de teste →
  implementação Playwright. Use quando o usuário pedir a esteira completa,
  pipeline de testes, ou combinar Azure DevOps + cenários + Playwright.
---

# Esteira de QA — Azure DevOps → Cenários → Playwright

Skill orquestradora. Coordena as skills especializadas em sequência.

## Quando usar

- "Rode a esteira de testes para a US 1234"
- "Da demanda até o Playwright"
- "Pipeline completo de QA para este work item"

## Fluxo (sempre nesta ordem)

```
[1] azure-devops-test-scenarios  →  docs/cenarios/
[2] playwright-from-scenarios    →  playwright/e2e/
[3] Validação                    →  npx playwright test
```

## Checklist da esteira

```
Progresso:
- [ ] Etapa 1: Demanda obtida e analisada
- [ ] Etapa 2: Cenários gerados/atualizados em docs/cenarios/
- [ ] Etapa 3: Cenários E2E implementados em Playwright
- [ ] Etapa 4: Testes executados e passando
- [ ] Etapa 5: Work item atualizado (se solicitado)
```

## Etapa 1 — Obter demanda

Ler e seguir `.cursor/skills/azure-devops-test-scenarios/SKILL.md`.

Entrada mínima necessária (uma das opções):
- URL ou ID do work item Azure DevOps
- Texto colado da User Story / Bug
- `@docs/cenarios/` existente + delta da nova demanda

## Etapa 2 — Gerar cenários

Ler e seguir `.cursor/skills/azure-devops-test-scenarios/SKILL.md`.

Saída: arquivo em `docs/cenarios/` vinculado ao work item.

## Etapa 3 — Implementar Playwright

Ler e seguir `.cursor/skills/playwright-from-scenarios/SKILL.md`.

Implementar **somente** cenários com tipo `E2E` e prioridade P0/P1 (salvo pedido explícito para P2+).

## Etapa 4 — Validar

```bash
npx playwright test
npx playwright test --grep "ID-DO-CENARIO"
```

Corrigir falhas antes de concluir a esteira.

## Etapa 5 — Fechar loop (opcional)

Se o usuário pedir, sugerir comentário para o Azure DevOps:

```markdown
## Cenários de teste
- Documento: docs/cenarios/{arquivo}.md
- Cenários: {N} total ({X} P0, {Y} P1)

## Automação Playwright
- Spec: playwright/e2e/{arquivo}.spec.ts
- Status: {passando | pendente}
```

## Decisões rápidas

| Situação | Ação |
|----------|------|
| Demanda ambígua | Perguntar critérios de aceite antes de gerar cenários |
| Cenário já existe | Atualizar doc existente, não duplicar ID |
| Sem `data-testid` no app | Registrar gap; usar seletor alternativo documentado |
| API/backend envolvido | Marcar tipo `Integração`/`API`; mock se necessário |
| Apenas cenários, sem código | Parar após Etapa 2 |
| Apenas Playwright | Pular Etapa 1–2 se doc de cenários já existir |

## Skills relacionadas

- [azure-devops-test-scenarios](../azure-devops-test-scenarios/SKILL.md)
- [playwright-from-scenarios](../playwright-from-scenarios/SKILL.md)
