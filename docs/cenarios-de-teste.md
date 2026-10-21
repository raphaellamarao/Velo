# Cenários de Teste — Velô Sprint

Documento de cenários de teste para validação da aplicação web **Velô Sprint** (configurador e checkout de veículo elétrico).

**Escopo:** Landing page, configuração do veículo, checkout, análise de crédito, confirmação e consulta de pedidos.

**Stack:** React + Vite, Zustand, Supabase (PostgreSQL + Edge Functions), Playwright (E2E).

**Legenda de prioridade:** P0 (crítico) · P1 (alto) · P2 (médio) · P3 (baixo)

**Legenda de tipo:** E2E · Integração · Unitário · API

---

## 1. Landing Page

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado |
|----|---------|------------|------|---------------|--------|-------------------|
| LP-001 | Carregamento da landing page | P0 | E2E | App rodando | Acessar `/` | Página carrega com `data-testid="landing-page"`, título contém "Velô" |
| LP-002 | Exibição da seção Hero | P0 | E2E | App rodando | Acessar `/` | Seção hero visível (`hero-section`) com título "Velô Sprint" e estatísticas (450 km, 3.2s, 500 cv) |
| LP-003 | CTA principal do Hero | P0 | E2E | App rodando | Clicar em "Configure Agora" (`hero-cta-primary`) | Redireciona para `/configure` |
| LP-004 | Exibição da seção de especificações | P1 | E2E | App rodando | Rolar até `#specs` | Seção `specs-section` visível com cards de especificação |
| LP-005 | Exibição da seção CTA | P1 | E2E | App rodando | Rolar até seção CTA | Seção `cta-section` visível com imagem do carro e botão de configuração |
| LP-006 | CTA secundário | P1 | E2E | App rodando | Clicar no botão CTA da seção inferior (`cta-button`) | Redireciona para `/configure` |
| LP-007 | Seção FAQ | P2 | E2E | App rodando | Rolar até `#faq` | Seção `faq-section` com 6 itens de accordion |
| LP-008 | Expansão de item FAQ | P2 | E2E | App rodando | Clicar em um item FAQ (`faq-item-0`) | Resposta expande com conteúdo visível |
| LP-009 | Footer | P2 | E2E | App rodando | Rolar até o rodapé | Footer visível (`footer`) com links legais |
| LP-010 | Header desktop | P1 | E2E | Viewport ≥ 768px | Acessar `/` | Logo (`header-logo`), nav (`header-nav`), link "Consultar Pedido" e CTA "Configure o Seu" visíveis |
| LP-011 | Menu mobile | P1 | E2E | Viewport < 768px | Clicar no toggle (`header-menu-toggle`) | Menu mobile (`header-mobile-nav`) expande com links de navegação |
| LP-012 | Fechar menu mobile ao navegar | P2 | E2E | Menu mobile aberto | Clicar em "Consultar Pedido" | Redireciona para `/lookup` e menu fecha |

---

## 2. Navegação e Rotas

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado |
|----|---------|------------|------|---------------|--------|-------------------|
| NAV-001 | Rota do configurador | P0 | E2E | App rodando | Acessar `/configure` | Página do configurador carrega com painel de opções |
| NAV-002 | Rota de checkout | P0 | E2E | Configuração no store | Acessar `/order` | Página "Finalizar Pedido" carrega com resumo |
| NAV-003 | Rota de sucesso sem pedido | P0 | E2E | Nenhum state de navegação | Acessar `/success` diretamente | Redireciona para `/` |
| NAV-004 | Rota de consulta | P0 | E2E | App rodando | Acessar `/lookup` | Página "Consultar Pedido" carrega |
| NAV-005 | Termos de uso | P2 | E2E | App rodando | Acessar `/termos` | Página de termos carrega |
| NAV-006 | Política de privacidade | P2 | E2E | App rodando | Acessar `/privacidade` | Página de privacidade carrega |
| NAV-007 | Rota inexistente (404) | P2 | E2E | App rodando | Acessar `/rota-invalida` | Página 404 com mensagem "Page not found" e link para home |
| NAV-008 | Voltar do checkout ao configurador | P1 | E2E | Em `/order` | Clicar no botão voltar (ArrowLeft) | Redireciona para `/configure` |
| NAV-009 | Logo no checkout | P2 | E2E | Em `/order` | Clicar no logo Velô | Redireciona para `/` |

---

## 3. Configurador do Veículo

### 3.1 Interface e seleções

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado |
|----|---------|------------|------|---------------|--------|-------------------|
| CFG-001 | Estado padrão da configuração | P0 | E2E | localStorage limpo | Acessar `/configure` | Cor: Glacier Blue, Rodas: Aero, sem opcionais, preço R$ 40.000,00 |
| CFG-002 | Seleção de cor Glacier Blue | P0 | E2E | Em `/configure` | Clicar em `color-option-glacier-blue` | Cor selecionada, imagem exterior atualizada (`car-exterior-image`) |
| CFG-003 | Seleção de cor Midnight Black | P0 | E2E | Em `/configure` | Clicar em `color-option-midnight-black` | Cor selecionada, imagem muda para midnight-black |
| CFG-004 | Seleção de cor Lunar White | P0 | E2E | Em `/configure` | Clicar em `color-option-lunar-white` | Cor selecionada, imagem muda para lunar-white |
| CFG-005 | Seleção de rodas Aero | P0 | E2E | Rodas Sport selecionadas | Clicar em `wheel-option-aero` | Rodas Aero selecionadas, preço reduz R$ 2.000 |
| CFG-006 | Seleção de rodas Sport | P0 | E2E | Configuração base | Clicar em `wheel-option-sport` | Rodas Sport selecionadas, preço aumenta R$ 2.000 |
| CFG-007 | Ativar opcional Precision Park | P0 | E2E | Em `/configure` | Marcar `opt-precision-park` | Opcional ativo, preço +R$ 5.500 |
| CFG-008 | Ativar opcional Flux Capacitor | P0 | E2E | Em `/configure` | Marcar `opt-flux-capacitor` | Opcional ativo, preço +R$ 5.500 |
| CFG-009 | Desativar opcional | P1 | E2E | Opcional marcado | Desmarcar checkbox do opcional | Opcional removido, preço recalculado |
| CFG-010 | Múltiplos opcionais | P1 | E2E | Em `/configure` | Marcar ambos opcionais | Preço = R$ 40.000 + R$ 5.500 + R$ 5.500 = R$ 51.000 |
| CFG-011 | Configuração completa (máxima) | P0 | E2E | Em `/configure` | Sport + ambos opcionais | Preço total = R$ 52.500,00 (`total-price`) |
| CFG-012 | Atualização da imagem por combinação | P1 | E2E | Em `/configure` | Alternar cor e tipo de roda | Imagem exterior reflete combinação cor + roda |
| CFG-013 | Seções visíveis | P2 | E2E | Em `/configure` | Verificar painel | Seções `section-cores`, `section-rodas`, `section-opcionais` visíveis |
| CFG-014 | Botão "Monte o Seu" | P0 | E2E | Configuração definida | Clicar em `checkout-button` | Redireciona para `/order` |

### 3.2 Persistência (Zustand + localStorage)

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado |
|----|---------|------------|------|---------------|--------|-------------------|
| CFG-015 | Persistência após reload | P0 | E2E | Configuração personalizada | Recarregar página | Configuração mantida (cor, rodas, opcionais) |
| CFG-016 | Reset após pedido concluído | P1 | E2E | Pedido finalizado com sucesso | Voltar ao configurador | Configuração volta ao padrão (Glacier Blue, Aero, sem opcionais) |
| CFG-017 | Migração de opcionais inválidos | P2 | Unit | localStorage com opcionais corrompidos | Carregar store (versão 2) | Opcionais inválidos filtrados, apenas valores válidos mantidos |

---

## 4. Cálculo de Preços

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado |
|----|---------|------------|------|---------------|--------|-------------------|
| PRC-001 | Preço base | P0 | Unit | Config padrão | `calculateTotalPrice({ aero, sem opcionais })` | R$ 40.000,00 |
| PRC-002 | Preço com rodas Sport | P0 | Unit | wheelType = sport | Calcular total | R$ 42.000,00 |
| PRC-003 | Preço com Precision Park | P0 | Unit | optional precision-park | Calcular total | R$ 45.500,00 |
| PRC-004 | Preço com Flux Capacitor | P0 | Unit | optional flux-capacitor | Calcular total | R$ 45.000,00 |
| PRC-005 | Preço máximo | P0 | Unit | Sport + ambos opcionais | Calcular total | R$ 52.500,00 |
| PRC-006 | Formatação BRL | P1 | Unit | Valor numérico | `formatPrice(40000)` | "R$ 40.000,00" (locale pt-BR) |
| PRC-007 | Atualização em tempo real no configurador | P0 | E2E | Em `/configure` | Alterar opções sequencialmente | `total-price` atualiza a cada mudança |
| PRC-008 | Resumo no checkout reflete configuração | P0 | E2E | Config personalizada | Ir para `/order` | Resumo exibe cor, interior, rodas, opcionais e total corretos |

---

## 5. Checkout / Finalização de Pedido

### 5.1 Validação de formulário

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado |
|----|---------|------------|------|---------------|--------|-------------------|
| CHK-001 | Submit com campos vazios | P0 | E2E | Em `/order` | Clicar "Confirmar Pedido" sem preencher | Erros de validação em todos os campos obrigatórios |
| CHK-002 | Nome com menos de 2 caracteres | P1 | E2E | Em `/order` | Preencher nome "A" e submeter | Erro: "Nome deve ter pelo menos 2 caracteres" |
| CHK-003 | Sobrenome inválido | P1 | E2E | Em `/order` | Preencher sobrenome "B" | Erro: "Sobrenome deve ter pelo menos 2 caracteres" |
| CHK-004 | Email inválido | P0 | E2E | Em `/order` | Preencher email "invalido" | Erro: "Email inválido" |
| CHK-005 | Telefone inválido | P0 | E2E | Em `/order` | Preencher telefone incompleto | Erro: "Telefone inválido" (mín. 14 chars com máscara) |
| CHK-006 | CPF inválido | P0 | E2E | Em `/order` | Preencher CPF incompleto | Erro: "CPF inválido" (mín. 14 chars com máscara) |
| CHK-007 | Loja não selecionada | P0 | E2E | Em `/order` | Não selecionar loja | Erro: "Selecione uma loja" |
| CHK-008 | Termos não aceitos | P0 | E2E | Formulário preenchido, terms=false | Submeter | Erro: "Aceite os termos" |
| CHK-009 | Máscara de telefone | P2 | E2E | Em `/order` | Digitar telefone | Formato `(99) 99999-9999` aplicado |
| CHK-010 | Máscara de CPF | P2 | E2E | Em `/order` | Digitar CPF | Formato `999.999.999-99` aplicado |
| CHK-011 | Limpeza de erro ao corrigir campo | P2 | E2E | Campo com erro | Corrigir valor do campo | Mensagem de erro desaparece |
| CHK-012 | Links para termos e privacidade | P2 | E2E | Em `/order` | Clicar links no checkbox de termos | Abre `/termos` e `/privacidade` respectivamente |

### 5.2 Formas de pagamento

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado |
|----|---------|------------|------|---------------|--------|-------------------|
| CHK-013 | Pagamento à vista (padrão) | P0 | E2E | Em `/order` | Verificar opção padrão | `payment-avista` selecionado, total = preço do configurador |
| CHK-014 | Seleção de financiamento | P0 | E2E | Em `/order` | Clicar `payment-financiamento` | Campo de entrada exibido, parcelas calculadas |
| CHK-015 | Cálculo de parcelas sem entrada | P0 | E2E | Financiamento, entrada = 0 | Verificar valores | Parcela = (total / 12) × 1.02; total financiado = parcela × 12 |
| CHK-016 | Cálculo com entrada parcial | P1 | E2E | Total R$ 40.000, entrada R$ 10.000 | Preencher `input-entry-value` | Valor a financiar = R$ 30.000; parcela recalculada |
| CHK-017 | Entrada de 50% do total | P0 | E2E | Financiamento | Entrada = 50% do total | Percentual de entrada = 0.5 (relevante para regra de crédito) |
| CHK-018 | Resumo atualiza total no financiamento | P1 | E2E | Financiamento selecionado | Verificar `summary-total-price` | Exibe total financiado (não preço à vista) |
| CHK-019 | Estado de loading no submit | P1 | E2E | Formulário válido | Clicar "Confirmar Pedido" | Botão desabilitado, texto "Processando..." com spinner |

### 5.3 Lojas disponíveis

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado |
|----|---------|------------|------|---------------|--------|-------------------|
| CHK-020 | Lista de lojas | P1 | E2E | Em `/order` | Abrir select `checkout-store` | 4 lojas disponíveis (Paulista, Faria Lima, Morumbi, Ibirapuera) |
| CHK-021 | Seleção de loja | P0 | E2E | Em `/order` | Selecionar uma loja | Valor salvo no formulário |

---

## 6. Análise de Crédito

> Análise acionada **somente** quando `paymentMethod === 'financiamento'`.  
> Pagamento à vista → status `APROVADO` automático (sem consulta de crédito).

### 6.1 Regras de decisão (frontend)

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado |
|----|---------|------------|------|---------------|--------|-------------------|
| CRD-001 | À vista — sem análise | P0 | E2E | Pagamento à vista | Finalizar pedido válido | Status `APROVADO`, sem chamada à edge function |
| CRD-002 | Score > 700 — aprovado | P0 | E2E/Integração | Financiamento, mock score 750 | Finalizar pedido | Status `APROVADO` |
| CRD-003 | Score 501–700 — em análise | P0 | E2E/Integração | Financiamento, mock score 600 | Finalizar pedido | Status `EM_ANALISE` |
| CRD-004 | Score ≤ 500 — reprovado | P0 | E2E/Integração | Financiamento, mock score 450 | Finalizar pedido | Status `REPROVADO` |
| CRD-005 | Entrada ≥ 50% + score < 700 — aprovado | P0 | E2E/Integração | Financiamento, entrada 50%, mock score 650 | Finalizar pedido | Status `APROVADO` (regra de entrada alta) |
| CRD-006 | Entrada ≥ 50% + score ≤ 500 — aprovado | P1 | E2E/Integração | Financiamento, entrada 50%, mock score 400 | Finalizar pedido | Status `APROVADO` (entrada alta prevalece) |
| CRD-007 | Entrada < 50% + score 700 — em análise | P1 | E2E/Integração | Financiamento, entrada 30%, mock score 700 | Finalizar pedido | Status `EM_ANALISE` (score 700 não é > 700) |
| CRD-008 | Score exatamente 501 | P2 | Unit | score=501, entrada < 50% | Aplicar regras | Status `EM_ANALISE` |
| CRD-009 | Score exatamente 500 | P2 | Unit | score=500, entrada < 50% | Aplicar regras | Status `REPROVADO` |
| CRD-010 | Score exatamente 701 | P2 | Unit | score=701, entrada < 50% | Aplicar regras | Status `APROVADO` |

### 6.2 Edge Function `credit-analysis`

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado |
|----|---------|------------|------|---------------|--------|-------------------|
| CRD-011 | CPF obrigatório | P0 | API | — | POST sem CPF | HTTP 400, `{ error: "CPF é obrigatório" }` |
| CRD-012 | Remoção de máscara do CPF | P1 | API | — | POST com CPF `"123.456.789-00"` | CPF enviado à API externa como `"12345678900"` |
| CRD-013 | Resposta válida com score | P0 | API | API externa mockada | POST com CPF válido | HTTP 200, `{ status, score }` |
| CRD-014 | API externa retorna erro | P1 | API | API externa indisponível | POST com CPF | HTTP 502, `{ error: "Erro na consulta de crédito" }` |
| CRD-015 | Resposta sem campo score | P1 | API | API retorna JSON inválido | POST com CPF | HTTP 502, `{ error: "Resposta inválida da API de crédito" }` |
| CRD-016 | Timeout / falha de rede | P1 | API | Rede indisponível | POST com CPF | HTTP 503, `{ error: "Falha na comunicação com serviço de crédito" }` |
| CRD-017 | CORS preflight | P2 | API | — | OPTIONS request | Resposta com headers CORS |
| CRD-018 | Erro no frontend — toast | P0 | E2E | Edge function falha | Finalizar financiamento | Toast de erro (`toast-error`), pedido **não** criado, botão reabilitado |

---

## 7. Criação e Persistência de Pedidos (Supabase)

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado |
|----|---------|------------|------|---------------|--------|-------------------|
| ORD-001 | Criação de pedido à vista | P0 | Integração | Formulário válido, à vista | Finalizar pedido | Registro inserido na tabela `orders` |
| ORD-002 | Formato do número do pedido | P0 | Unit | — | Gerar order number | Formato `VLO-XXXXXX` (6 caracteres alfanuméricos) |
| ORD-003 | Campos salvos corretamente | P0 | Integração | Config completa | Finalizar pedido | `color`, `wheel_type`, `optionals`, dados do cliente, `payment_method`, `total_price`, `status` corretos |
| ORD-004 | Nome completo concatenado | P1 | Integração | Nome "João", Sobrenome "Silva" | Criar pedido | `customer_name` = "João Silva" |
| ORD-005 | Preço final à vista | P0 | Integração | Total configurador R$ 42.000 | Pagamento à vista | `total_price` = 42000 |
| ORD-006 | Preço final financiamento | P1 | Integração | Financiamento com entrada | Finalizar | `total_price` = entrada + total financiado |
| ORD-007 | Falha ao criar pedido | P1 | E2E | Supabase indisponível (mock) | Submeter formulário | Toast "Erro ao criar pedido", permanece em `/order` |
| ORD-008 | Política RLS — insert público | P1 | Integração | — | Insert anônimo | Permitido (policy "Anyone can create orders") |
| ORD-009 | Política RLS — select público | P1 | Integração | Pedido existente | Select por order_number | Permitido (policy "Anyone can view orders") |

---

## 8. Página de Sucesso

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado |
|----|---------|------------|------|---------------|--------|-------------------|
| SUC-001 | Pedido aprovado | P0 | E2E | Pedido com status APROVADO | Finalizar e chegar em `/success` | Título "Pedido Aprovado!" (`success-status`), ícone verde |
| SUC-002 | Pedido reprovado | P0 | E2E | Pedido com status REPROVADO | Finalizar financiamento reprovado | Título "Crédito Reprovado", ícone vermelho, mensagem alternativa |
| SUC-003 | Exibição do número do pedido | P0 | E2E | Pedido criado | Verificar página | `order-id` exibe número no formato VLO-XXXXXX |
| SUC-004 | Resumo do pedido | P1 | E2E | Pedido com config personalizada | Verificar página | Imagem, cor, interior, rodas, preço e parcelas (se financiamento) |
| SUC-005 | Dados do cliente | P1 | E2E | Pedido criado | Verificar página | Nome, email e loja de retirada corretos |
| SUC-006 | Botão "Consultar Pedido" | P1 | E2E | Em `/success` | Clicar `goto-consultar` | Redireciona para `/lookup` |
| SUC-007 | Botão "Configurar Outro" | P1 | E2E | Em `/success` | Clicar `configure-another` | Redireciona para `/configure` |
| SUC-008 | Pedido em análise (EM_ANALISE) | P2 | E2E | Status EM_ANALISE | Chegar em `/success` | **Nota:** UI trata como reprovado (ícone vermelho). Validar comportamento atual ou registrar como bug |

---

## 9. Consulta de Pedidos

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado |
|----|---------|------------|------|---------------|--------|-------------------|
| LKP-001 | Busca com pedido existente | P0 | E2E | Pedido criado previamente | Inserir número em `search-order-id`, clicar buscar | Card de resultado visível (`order-result-{id}`) |
| LKP-002 | Exibição do status aprovado | P0 | E2E | Pedido APROVADO | Buscar pedido | `order-result-status` = "APROVADO" com badge verde |
| LKP-003 | Exibição do status reprovado | P1 | E2E | Pedido REPROVADO | Buscar pedido | Status "REPROVADO" com badge vermelho |
| LKP-004 | Pedido não encontrado | P0 | E2E | — | Buscar "VLO-INVALID" | Mensagem "Pedido não encontrado" |
| LKP-005 | Botão desabilitado sem input | P2 | E2E | Campo vazio | Verificar botão | `search-order-button` desabilitado |
| LKP-006 | Busca case-insensitive | P1 | Integração | Pedido "VLO-ABC123" | Buscar "vlo-abc123" | Pedido encontrado (`.trim().toUpperCase()`) |
| LKP-007 | Detalhes da configuração | P1 | E2E | Pedido com opcionais | Buscar pedido | Cor, interior, rodas exibidos corretamente |
| LKP-008 | Dados do cliente | P1 | E2E | Pedido existente | Buscar pedido | Nome, email, loja, data formatada (pt-BR) |
| LKP-009 | Informações de pagamento | P1 | E2E | Pedido financiado | Buscar pedido | Método, parcelas (12x) e total exibidos |
| LKP-010 | Estado de loading | P2 | E2E | — | Submeter busca | Botão exibe "Buscando..." com spinner |
| LKP-011 | Status EM_ANALISE na consulta | P2 | E2E | Pedido EM_ANALISE | Buscar pedido | **Nota:** Badge vermelho (mesmo tratamento de reprovado). Validar ou registrar bug |

---

## 10. Fluxos End-to-End (Jornadas Completas)

| ID | Cenário | Prioridade | Tipo | Passos resumidos | Resultado esperado |
|----|---------|------------|------|------------------|-------------------|
| E2E-001 | Jornada feliz — à vista | P0 | E2E | Landing → Configurar (cor + sport) → Checkout (dados válidos, à vista, termos) → Confirmar | Pedido APROVADO, número VLO-*, config resetada |
| E2E-002 | Jornada feliz — financiamento aprovado | P0 | E2E | Configurar → Financiamento → CPF com score alto → Confirmar | Pedido APROVADO com parcelas |
| E2E-003 | Jornada — crédito reprovado | P0 | E2E | Configurar → Financiamento → CPF score baixo → Confirmar | Tela "Crédito Reprovado", pedido salvo como REPROVADO |
| E2E-004 | Jornada — crédito em análise | P1 | E2E | Configurar → Financiamento → CPF score médio → Confirmar | Pedido salvo como EM_ANALISE |
| E2E-005 | Jornada — entrada alta salva crédito | P1 | E2E | Configurar → Financiamento → Entrada 50% → CPF score médio → Confirmar | Pedido APROVADO |
| E2E-006 | Consultar pedido após compra | P0 | E2E | Completar E2E-001 → Clicar "Consultar Pedido" → Buscar número | Pedido encontrado com dados consistentes |
| E2E-007 | Configuração máxima + à vista | P1 | E2E | Sport + 2 opcionais → À vista → Confirmar | Total R$ 52.500, pedido criado corretamente |
| E2E-008 | Navegação landing → lookup → configure | P2 | E2E | Header "Consultar Pedido" → voltar → "Configure o Seu" | Fluxo de navegação sem erros |

---

## 11. Responsividade e UX

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado |
|----|---------|------------|------|---------------|--------|-------------------|
| UX-001 | Configurador em mobile | P1 | E2E | Viewport 375×667 | Acessar `/configure` | Layout empilhado (car stage 50vh + painel 50vh) |
| UX-002 | Configurador em desktop | P1 | E2E | Viewport 1280×720 | Acessar `/configure` | Layout lado a lado (70% stage + 30% painel) |
| UX-003 | Checkout responsivo | P2 | E2E | Viewport mobile | Acessar `/order` | Formulário e resumo empilhados |
| UX-004 | Checkout sticky summary (desktop) | P3 | E2E | Viewport desktop | Scroll no formulário | Resumo permanece sticky (`sticky top-8`) |
| UX-005 | Animações de transição | P3 | E2E | Em `/configure` | Trocar cor | Imagem com fade-in (`animate-fade-in`) |

---

## 12. Segurança e Dados

| ID | Cenário | Prioridade | Tipo | Pré-condições | Passos | Resultado esperado |
|----|---------|------------|------|---------------|--------|-------------------|
| SEC-001 | Variáveis de ambiente | P0 | Manual | — | Verificar `.env` | Apenas chaves públicas (anon key), sem service role no frontend |
| SEC-002 | Dados sensíveis no localStorage | P2 | Manual | Após pedido | Inspecionar localStorage | Store persiste config e orders locais; CPF **não** deve persistir no store local |
| SEC-003 | Acesso direto à success sem state | P1 | E2E | — | Acessar `/success` | Redireciona para `/`, impede acesso não autorizado ao resumo |
| SEC-004 | RLS impede update/delete anônimo | P2 | Integração | — | Tentar UPDATE/DELETE anônimo | Operação negada (apenas SELECT e INSERT permitidos) |

---

## 13. Testes Unitários Sugeridos (Store e Hooks)

| ID | Cenário | Prioridade | Tipo | Função/Módulo | Resultado esperado |
|----|---------|------------|------|---------------|-------------------|
| UNIT-001 | calculateTotalPrice — base | P0 | Unit | `configuratorStore` | 40000 |
| UNIT-002 | calculateTotalPrice — sport + opcionais | P0 | Unit | `configuratorStore` | 52500 |
| UNIT-003 | calculateInstallment | P2 | Unit | `configuratorStore` | Valor com juros compostos 2% a.m. em 12x |
| UNIT-004 | toggleOptional — add/remove | P1 | Unit | `configuratorStore` | Array de opcionais atualizado corretamente |
| UNIT-005 | generateOrderNumber — unicidade | P1 | Unit | `useOrders` | Números gerados seguem padrão VLO-XXXXXX |
| UNIT-006 | dbOrderToOrder — mapeamento | P1 | Unit | `useOrders` | Conversão DB → Order com campos corretos |
| UNIT-007 | orderSchema — validação Zod | P0 | Unit | `Order.tsx` schema | Rejeita dados inválidos, aceita dados válidos |

---

## 14. Dados de Teste Sugeridos

### Cliente válido

```
Nome:       João
Sobrenome:  Silva
Email:      joao.silva@teste.com
Telefone:   (11) 98765-4321
CPF:        123.456.789-00
Loja:       Velô Paulista - Av. Paulista, 1000
```

### CPFs para mock da análise de crédito

| CPF (sugerido) | Score simulado | Resultado esperado |
|----------------|----------------|-------------------|
| 111.111.111-11 | > 700 | APROVADO |
| 222.222.222-22 | 501–700 | EM_ANALISE |
| 333.333.333-33 | ≤ 500 | REPROVADO |

> Ajustar conforme resposta real da API de crédito ou mocks configurados no ambiente de teste.

### Combinações de preço de referência

| Configuração | Total |
|-------------|-------|
| Padrão (Aero, sem opcionais) | R$ 40.000,00 |
| Sport Wheels | R$ 42.000,00 |
| + Precision Park | R$ 45.500,00 |
| + Flux Capacitor | R$ 45.000,00 |
| Sport + ambos opcionais | R$ 52.500,00 |

---

## 15. Observações e Pontos de Atenção

1. **Interior não configurável na UI:** O store suporta `interiorColor`, mas o `ConfigPanel` não expõe seleção de interior. Testes devem validar o valor padrão (`carbon-black`) ou registrar melhoria futura.

2. **Discrepância no cálculo de parcelas:** `calculateInstallment` no store usa juros compostos, mas a página `Order.tsx` usa fórmula simplificada `(total - entrada) / 12 * 1.02`. Testes de parcelas devem seguir a lógica da **página de checkout** (comportamento em produção).

3. **Status EM_ANALISE na UI:** As páginas `Success` e `OrderLookup` tratam qualquer status ≠ APROVADO como reprovado (visual vermelho). Cenários SUC-008 e LKP-011 documentam esse comportamento.

4. **Porta da aplicação:** README indica `localhost:8080`; Vite default é `5173`. Configurar `baseURL` no Playwright conforme ambiente.

5. **data-testid disponíveis:** A aplicação já possui `data-testid` em elementos-chave — priorizar esses seletores nos testes E2E com Playwright.

---

## 16. Matriz de Cobertura por Módulo

| Módulo | Cenários | Prioridade P0 |
|--------|----------|---------------|
| Landing Page | LP-001 a LP-012 | 3 |
| Navegação | NAV-001 a NAV-009 | 4 |
| Configurador | CFG-001 a CFG-017 | 8 |
| Preços | PRC-001 a PRC-008 | 5 |
| Checkout | CHK-001 a CHK-021 | 10 |
| Crédito | CRD-001 a CRD-018 | 7 |
| Pedidos (DB) | ORD-001 a ORD-009 | 3 |
| Sucesso | SUC-001 a SUC-008 | 3 |
| Consulta | LKP-001 a LKP-011 | 3 |
| E2E | E2E-001 a E2E-008 | 3 |
| **Total** | **~110 cenários** | **~49 P0** |

---

*Documento gerado com base na análise do código-fonte em `src/`, `supabase/` e `playwright/`.*
