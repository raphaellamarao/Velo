# Estudo: Skills para Esteira de QA (Azure DevOps → Cenários → Playwright)

**Autor:** Engenharia de Qualidade  
**Projeto:** Velô Sprint (referência)  
**Data:** 2026-08-13

---

## 1. Objetivo

Definir uma arquitetura de **Cursor Agent Skills** que automatize o fluxo diário do QA:

```
Azure DevOps (demanda)  →  Cenários de teste (.md)  →  Playwright (código)  →  Execução
```

---

## 2. O que são Skills no Cursor

Skills são arquivos `SKILL.md` que ensinam o agente a executar workflows especializados. Diferente de rules (sempre ativas), skills são **carregadas sob demanda** quando o contexto combina com a `description` do frontmatter.

### Anatomia

```
.cursor/skills/{nome-da-skill}/
├── SKILL.md              # Instruções principais (< 500 linhas)
├── template-*.md         # Templates de saída
└── reference.md          # Detalhes técnicos (progressive disclosure)
```

### Princípios (fonte: create-skill)

| Princípio | Aplicação na esteira QA |
|-----------|------------------------|
| Conciso | Só incluir o que o agente não sabe (formato ADO, testids do projeto) |
| Progressive disclosure | Template e referência Playwright em arquivos separados |
| Workflow pattern | Checklist com etapas numeradas e gates |
| Template pattern | Tabela padronizada de cenários |
| Feedback loop | Rodar `npx playwright test` antes de concluir |

---

## 3. Por que 3 skills (e não 1 monolítica)

| Abordagem | Prós | Contras |
|-----------|------|---------|
| **1 skill gigante** | Tudo num lugar | Contexto enorme, difícil manter, aciona sempre |
| **3 skills modulares** ✅ | Componível, reutilizável, aciona só o necessário | Requer skill orquestradora |
| **1 skill + rules** | Rules para formato, skill para fluxo | Rules não têm workflow multi-step |

### Arquitetura recomendada

```
┌─────────────────────────────────────────────────────────┐
│  qa-test-pipeline (orquestradora)                       │
│  "Da US até o Playwright passando"                      │
└────────────┬──────────────────────────┬─────────────────┘
             │                          │
             ▼                          ▼
┌────────────────────────┐   ┌─────────────────────────────┐
│ azure-devops-test-     │   │ playwright-from-scenarios   │
│ scenarios              │   │                             │
│ Demanda → .md          │   │ .md → .spec.ts              │
└────────────────────────┘   └─────────────────────────────┘
```

**Uso no dia a dia:**

| Você pede | Skill acionada |
|-----------|----------------|
| "Crie cenários para a US 4521" | `azure-devops-test-scenarios` |
| "Implemente CHK-001 a CHK-010 em Playwright" | `playwright-from-scenarios` |
| "Esteira completa da US 4521" | `qa-test-pipeline` |

---

## 4. Integração com Azure DevOps

### Opções disponíveis hoje

| Método | Quando usar | Configuração |
|--------|-------------|--------------|
| **Colar texto** | Demanda rápida, 1 work item | Nenhuma |
| **URL do work item** | Agente abre via browser/fetch | Permissão de rede |
| **Azure CLI** | Automação, CI | `az extension add --name azure-devops` |
| **REST API** | Scripts customizados | PAT token em env |
| **MCP Azure DevOps** | Futuro — melhor DX | Configurar MCP server |

### Comando CLI útil

```bash
az boards work-item show \
  --id 4521 \
  --org https://dev.azure.com/minha-org \
  --output json \
  --query "{title: fields['System.Title'], ac: fields['Microsoft.VSTS.Common.AcceptanceCriteria'], desc: fields['System.Description']}"
```

### Evolução futura

1. Configurar MCP do Azure DevOps (quando disponível) → skill busca work item automaticamente
2. Hook pós-geração → comentar link dos cenários no work item
3. Cursor Automation → trigger quando work item muda para "Ready for Test"

---

## 5. Convenções definidas

### Cenários (.md)

- Local: `docs/cenarios/US-{id}-{slug}.md`
- ID: `{MODULO}-{NNN}` (LP, CFG, CHK, E2E…)
- Colunas: ID, Cenário, Prioridade, Tipo, Pré-condições, Passos, Resultado, Work Item
- Rastreabilidade: cada critério de aceite mapeado para ≥ 1 cenário

### Playwright (.spec.ts)

- Local: `playwright/e2e/{modulo}.spec.ts`
- Nome: `` test('{ID} — {descrição}', ...) ``
- Seletores: `data-testid` primeiro
- Helpers: `playwright/e2e/helpers/fixtures.ts`

---

## 6. Esteira completa — passo a passo

### Fase A — Planejamento (manual ou agente)

1. Product Owner cria User Story no Azure DevOps com critérios de aceite
2. QA move para "Ready for Test" ou equivalente

### Fase B — Cenários (skill: azure-devops-test-scenarios)

```
Entrada:  US-4521 (URL, ID ou texto)
Processo: Analisar AC → explorar código → gerar tabela
Saída:    docs/cenarios/US-4521-checkout-cpf.md
```

### Fase C — Automação (skill: playwright-from-scenarios)

```
Entrada:  IDs P0/P1 tipo E2E do doc
Processo: Mapear testids → escrever spec → rodar testes
Saída:    playwright/e2e/checkout.spec.ts
```

### Fase D — Validação

```bash
npx playwright test --grep "US-4521|CHK-"
```

### Fase E — Fechamento

- Anexar doc de cenários ao work item ADO
- Marcar casos de teste no Test Plan (se usar Azure Test Plans)
- PR com specs Playwright

---

## 7. Skills criadas neste projeto

| Skill | Caminho | Função |
|-------|---------|--------|
| `qa-test-pipeline` | `.cursor/skills/qa-test-pipeline/SKILL.md` | Orquestra A→B→C |
| `azure-devops-test-scenarios` | `.cursor/skills/azure-devops-test-scenarios/SKILL.md` | Demanda → cenários |
| `playwright-from-scenarios` | `.cursor/skills/playwright-from-scenarios/SKILL.md` | Cenários → código |

### Como invocar no Cursor

```
@qa-test-pipeline Esteira completa para US-4521: [colar URL ou critérios]
```

```
@azure-devops-test-scenarios Gere cenários para esta demanda: [texto]
```

```
@playwright-from-scenarios Implemente cenários CHK-001 a CHK-008
```

---

## 8. Copiar para uso pessoal (todos os projetos)

Para usar em qualquer repositório, copie para skills pessoais:

```bash
cp -r .cursor/skills/* ~/.cursor/skills/
```

Adapte `reference.md` de cada projeto com os `data-testid` locais.

---

## 9. Extensões recomendadas

| Extensão | Skill / Artefato | Benefício |
|----------|------------------|-----------|
| Cursor Rule | `.cursor/rules/qa-cenarios-formato.mdc` | Formato de tabela sempre consistente |
| Cursor Hook | `afterFileEdit` em `docs/cenarios/` | Lembrete para implementar Playwright |
| Cursor Automation | Trigger em PR com label `needs-tests` | Gera cenários automaticamente |
| Azure Test Plans | Export XML dos cenários | Sync bidirecional ADO ↔ docs |

---

## 10. Métricas de sucesso

| Métrica | Meta |
|---------|------|
| Tempo demanda → cenários | < 15 min com agente |
| Tempo cenários P0 → Playwright | < 30 min |
| Cobertura P0 automatizada | ≥ 80% |
| Rastreabilidade ADO ↔ cenário | 100% dos IDs com Work Item |

---

## 11. Próximos passos sugeridos

1. [ ] Configurar `baseURL` e `webServer` no `playwright.config.ts`
2. [ ] Adicionar scripts `test:e2e` no `package.json`
3. [ ] Configurar Azure CLI ou MCP para busca automática de work items
4. [ ] Rodar `@qa-test-pipeline` com uma US real como piloto
5. [ ] Copiar skills para `~/.cursor/skills/` para uso cross-project

---

*Skills implementadas em `.cursor/skills/` — prontas para uso via @mention no Cursor.*
