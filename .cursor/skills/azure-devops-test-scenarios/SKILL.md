---
name: azure-devops-test-scenarios
description: >-
  Gera cenários de teste estruturados a partir de demandas do Azure DevOps
  (User Stories, Bugs, Tasks). Use quando o usuário mencionar Azure DevOps, ADO,
  work item, user story, critérios de aceite, ou pedir para escrever/criar
  cenários de teste a partir de uma demanda.
---

# Cenários de Teste a partir do Azure DevOps

## Objetivo

Transformar demandas do Azure DevOps em documentos de cenários de teste rastreáveis, prontos para automação Playwright.

## Entrada — como obter a demanda

Prioridade de fontes:

1. **URL ou ID do work item** — buscar via CLI (se configurado):
   ```bash
   az boards work-item show --id {ID} --org https://dev.azure.com/{org} --output json
   ```
2. **Texto colado** — título, descrição, critérios de aceite, comentários
3. **Arquivo local** — export do ADO em markdown/JSON

Se faltar critérios de aceite, extrair da descrição ou perguntar ao usuário antes de gerar.

## Análise da demanda (antes de escrever)

Extrair e documentar mentalmente:

| Campo | Onde buscar no ADO |
|-------|-------------------|
| ID / título | `System.Id`, `System.Title` |
| Tipo | User Story, Bug, Task |
| Critérios de aceite | `Microsoft.VSTS.Common.AcceptanceCriteria` ou seção na descrição |
| Área / feature | `System.AreaPath`, tags |
| Prioridade | `Microsoft.VSTS.Common.Priority`, `Severity` (bugs) |

Explorar o código afetado quando a demanda mencionar telas, rotas ou APIs.

## Convenção de IDs

```
{MODULO}-{NNN}
```

Módulos comuns (adaptar ao projeto):

| Prefixo | Módulo |
|---------|--------|
| LP | Landing Page |
| NAV | Navegação/Rotas |
| CFG | Configurador |
| CHK | Checkout |
| CRD | Crédito |
| ORD | Pedidos |
| SUC | Sucesso |
| LKP | Consulta |
| E2E | Jornada completa |

Para demanda específica de um work item, prefixar seção:

```markdown
## US-{ID}: {Título da demanda}
```

## Formato de saída

Salvar em `docs/cenarios/`:

```
docs/cenarios/
├── cenarios-de-teste.md          # catálogo geral (se existir)
├── US-{id}-{slug}.md             # cenários de uma demanda
└── BUG-{id}-{slug}.md            # regressão de bug
```

Usar template em [template-cenario.md](template-cenario.md).

### Tabela obrigatória por cenário

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado | Work Item |
|----|---------|------------|------|---------------|--------|-------------------|-----------|

Prioridades: **P0** crítico · **P1** alto · **P2** médio · **P3** baixo

Tipos: **E2E** · **Integração** · **Unitário** · **API**

## Regras de escrita

1. **Um cenário = um comportamento verificável** — evitar "e também" nos passos
2. **Passos numerados e acionáveis** — verbos no imperativo ("Acessar", "Clicar", "Preencher")
3. **Resultado mensurável** — incluir seletores `data-testid` quando existirem no código
4. **Cobertura mínima por User Story:**
   - ≥ 1 cenário P0 happy path
   - ≥ 1 cenário de validação/erro (se aplicável)
   - Cenários de borda relevantes aos critérios de aceite
5. **Bug:** incluir cenário de regressão (reproduzir bug + validar correção)
6. **Rastreabilidade:** coluna Work Item com ID ADO em todo cenário derivado de demanda

## Derivação a partir de critérios de aceite

Para cada critério de aceite:

```
Critério → Cenário(s)
  ├── Caminho feliz      → P0 E2E
  ├── Validação/erro     → P1 E2E ou Integração
  └── Caso de borda      → P2
```

Exemplo:

| Critério de aceite | Cenários gerados |
|-------------------|------------------|
| "Usuário seleciona cor e preço atualiza" | CFG-001 (seleção), PRC-001 (cálculo) |
| "CPF inválido exibe erro" | CHK-006 |
| "Score ≤ 500 reprova crédito" | CRD-004 |

## Workflow

1. Obter demanda (URL, ID, texto ou CLI)
2. Listar critérios de aceite explícitos e implícitos
3. Explorar código (`src/`, rotas, `data-testid`) se demanda for frontend
4. Gerar cenários seguindo template
5. Atualizar `docs/cenarios/cenarios-de-teste.md` **ou** criar arquivo por demanda
6. Apresentar resumo: total de cenários, P0/P1, IDs gerados

## Saída para próxima etapa

Ao concluir, informar:

```markdown
## Cenários gerados — US-{ID}

- Arquivo: docs/cenarios/US-{id}-{slug}.md
- Total: {N} ({X} P0, {Y} P1, {Z} P2)
- Prontos para Playwright: {lista de IDs E2E P0/P1}

Próximo passo: usar skill `playwright-from-scenarios` ou `qa-test-pipeline`.
```

## Referências

- Template: [template-cenario.md](template-cenario.md)
- Catálogo existente: [docs/cenarios-de-teste.md](../../../docs/cenarios-de-teste.md)
