Dado que sou engenheiro de qualidade de software, e quero criar uma skill para criar novos cenários de teste a partir de demandas escritas no azure devops. faça um estudo sobre skills para criar as skill necessarias aplicar no meu dia a dia. eu gostaria de criar uma esteira, tipo. escreve cenarios de teste, depois desenvolve os cenários de teste em Playwright 

---
name: azure-devops-test-scenarios
description: >-
  Gera cenários de teste estruturados a partir de demandas do Azure DevOps
# Cenários de Teste — {US-ID}: {Título}
**Work Item:** [{US-ID}](https://dev.azure.com/{org}/{project}/_workitems/edit/{US-ID})
**Tipo:** User Story | Bug | Task
---
name: playwright-from-scenarios
description: >-
  Implementa testes Playwright E2E a partir de cenários documentados. Use quando
# Referência Playwright — Projeto Velô
## data-testids mapeados
# Estudo: Skills para Esteira de QA (Azure DevOps → Cenários → Playwright)
**Autor:** Engenharia de Qualidade  
**Projeto:** Velô Sprint (referência)  
Estudo e skills criadas para sua esteira de QA
Analisei a estrutura de skills do Cursor e desenhei uma esteira modular de 3 skills + 1 orquestradora, alinhada ao seu fluxo diário como engenheiro de QA.

Por que 3 skills (e não 1 só)?
Abordagem	Problema
1 skill monolítica
Contexto enorme, difícil manter, aciona sempre
3 skills modulares ✅
Você invoca só o que precisa no momento
Azure DevOps          Cenários (.md)         Playwright (.spec.ts)
     │                      │                        │
     └──── skill 1 ─────────┴──── skill 2 ──────────┘
                    skill 3 orquestra tudo
Skills criadas
Skill	Arquivo	Quando usar
qa-test-pipeline
.cursor/skills/qa-test-pipeline/SKILL.md
Esteira completa: demanda → cenários → código
azure-devops-test-scenarios
.cursor/skills/azure-devops-test-scenarios/SKILL.md
Gerar cenários a partir de US/Bug do ADO
playwright-from-scenarios
.cursor/skills/playwright-from-scenarios/SKILL.md
Implementar specs Playwright dos cenários
Estudo completo: docs/estudo-skills-qa.md

Como usar no dia a dia
1. Só cenários (demanda nova no Azure DevOps)
@azure-devops-test-scenarios Gere cenários para US-4521:
[colar critérios de aceite ou URL do work item]
2. Só Playwright (cenários já existem)
@playwright-from-scenarios Implemente cenários CHK-001 a CHK-008
3. Esteira completa
@qa-test-pipeline Esteira completa para esta demanda:
[colar User Story do Azure DevOps]
O que cada skill faz
Skill 1 — azure-devops-test-scenarios
Obtém demanda (URL, ID, CLI az boards, ou texto colado)
Extrai critérios de aceite
Explora código afetado (data-testid, rotas)
Gera arquivo em docs/cenarios/US-{id}-{slug}.md
Usa template padronizado com rastreabilidade ADO ↔ cenário
Skill 2 — playwright-from-scenarios
Lê cenários E2E P0/P1
Mapeia data-testid do projeto Velô (referência incluída)
Cria specs em playwright/e2e/{modulo}.spec.ts
Nomeia testes como CFG-003 — Seleção de cor Midnight Black
Executa npx playwright test antes de concluir
Skill 3 — qa-test-pipeline
Orquestra as duas skills em sequência
Checklist com gates de validação
Sugere comentário de fechamento para o work item no ADO
Integração com Azure DevOps
Hoje não há MCP do Azure DevOps configurado. A skill cobre 3 formas de entrada:

Colar texto da User Story (mais rápido)
Azure CLI — az boards work-item show --id {ID}
URL do work item (fetch manual)
Evolução futura: configurar MCP do Azure DevOps ou Cursor Automation disparada quando a US entrar em "Ready for Test".

Para usar em todos os projetos
Copie as skills para seu diretório pessoal:

cp -r .cursor/skills/* ~/.cursor/skills/
Em cada projeto, adapte o reference.md com os data-testid locais.

Próximos passos recomendados
Configurar baseURL e webServer no playwright.config.ts
Adicionar "test:e2e": "playwright test" no package.json
Piloto: rodar @qa-test-pipeline com uma US real do seu Azure DevOps
(Opcional) Cursor Rule para formato de tabela sempre consistente
(Opcional) Cursor Automation quando PR receber label needs-tests
Quer que eu rode a esteira piloto com uma demanda real sua, ou configure o playwright.config.ts e os scripts npm para fechar o ciclo?