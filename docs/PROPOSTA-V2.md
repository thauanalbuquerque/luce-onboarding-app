# Proposta v2 — Persistência das respostas do onboarding

> **Status:** proposta para discussão. **Nenhum código foi escrito.**
> O v1 (atual) é estático, sem backend: gera resumo JSON/Markdown com copiar/baixar.
> Este documento descreve como o v2 enviaria as respostas para o Supabase do
> `luce-infra`, com as opções, trade-offs e uma recomendação.

---

## 1. Objetivo do v2

Tirar o passo manual (Sara exporta arquivo → alguém importa) e fazer o app
**enviar as respostas direto para o backend** da Luce, prontas para configurar o
assistente da clínica.

Não-objetivos: o v2 **não** coleta dado de paciente (segue a mesma trava do v1).
A lista de pacientes para reativação continua sendo etapa separada e posterior.

---

## 2. O que já existe no `luce-infra` (base para mapear)

O schema atual (`luce-infra/supabase/schema.sql`) já tem as tabelas que recebem
quase tudo do onboarding. RLS está habilitado em todas:

- **`clinicas`** — `nome`, `telefone_whatsapp`, `tom_de_voz`,
  `horario_funcionamento` (jsonb), `link_review_google`, `ativo`.
- **`procedimentos`** — `nome`, `preco_min`, `preco_max`, `descricao`,
  `janela_retorno_dias` (FK `clinica_id`).

E também há `n8n` rodando no mesmo `docker-compose` — relevante para a Opção C.

---

## 3. Mapeamento das respostas → schema

| Pergunta (briefing) | Destino sugerido |
|---|---|
| Q1 nome nas mensagens | `clinicas.nome` |
| Q2 endereço + referência | novo campo `clinicas.endereco` (ou jsonb `infos`) |
| Q3 telefone(s) | `clinicas.telefone_whatsapp` (+ extras em `infos`) |
| Q4 outras especialidades | `clinicas.infos` (jsonb) |
| Q5 horários (seg-sex/sáb/almoço) | `clinicas.horario_funcionamento` (jsonb) |
| Q6 estacionamento / como chegar | `clinicas.infos` |
| Q7 site/redes | `clinicas.infos` (+ `link_review_google` quando for Google) |
| Q8 atendimentos (nome/duração/valor) | linhas em `procedimentos` |
| Q9 convênio / particular | `clinicas.infos` |
| Q10 formas de pagamento | `clinicas.infos` |
| Q11 preparos | `clinicas.infos` ou `procedimentos.descricao` |
| Q12 modo de agendamento | `clinicas.infos` (flag `agenda_autonoma`) |
| Q13–Q14 antecedência/remarcação | `clinicas.infos` |
| Q15 levar no dia | `clinicas.infos` |
| Q16 tom de voz | `clinicas.tom_de_voz` |
| Q17 nome do assistente | `clinicas.infos` |
| Q18 limites médico-safe (confirm) | `clinicas.infos` (decisão + ajuste) |
| Q19 emergência 192 (confirm) | `clinicas.infos` (decisão + texto) |
| Q20 FAQ | `clinicas.infos` (lista) ou tabela `faqs` futura |
| Q21 mensagens iniciadas (checkbox) | `clinicas.infos` (lista p/ templates WhatsApp) |

**Observação:** boa parte das respostas é qualitativa e não tem coluna dedicada
hoje. Duas estratégias possíveis:

- **(a) Campo `infos jsonb` em `clinicas`** — guarda o payload completo do
  onboarding como um documento, e as colunas "fortes" (`nome`, `tom_de_voz`,
  `horario_funcionamento`, `telefone_whatsapp`) são preenchidas a partir dele.
  Mais simples, evita migração grande.
- **(b) Tabela `onboarding_submissions`** — uma linha por envio, com o JSON bruto +
  metadados (clínica, data, versão do formulário, quem preencheu). Preserva o
  histórico de submissões e separa "o que a clínica respondeu" de "config ativa
  da clínica". **Recomendada** — auditável e não acopla o formulário ao schema de
  produção.

Sugestão combinada: gravar em **`onboarding_submissions`** (fonte de verdade do
que foi respondido) e, num segundo passo (manual ou job), **promover** os dados
para `clinicas`/`procedimentos`.

---

## 4. Opções de envio (o ponto arquitetural central)

O app é **estático no GitHub Pages** — não há servidor próprio nem segredo
seguro no front. Isso define as opções:

### Opção A — supabase-js direto do front (anon key + RLS)
- App usa a **publishable/anon key** (feita para ser pública) e faz `insert` numa
  tabela `onboarding_submissions` com **RLS permitindo apenas INSERT** (nunca
  SELECT/UPDATE/DELETE para o papel anônimo).
- **Prós:** menos peças; sem servidor; rápido de montar.
- **Contras:** endpoint de insert fica aberto ao público → risco de spam/lixo.
  Mitigável com: campo honeypot, rate limit (Supabase/Cloudflare), captcha leve,
  e validação. RLS precisa ser escrita com cuidado (o `SECURITY-NOTES.md` do
  infra já trata RLS — alinhar com ele).

### Opção B — Supabase Edge Function como porta de entrada
- App faz `POST` de um JSON para uma **Edge Function**; ela valida e grava com a
  **service role** (que nunca sai do servidor).
- **Prós:** front não fala direto com o banco; validação e sanitização
  centralizadas; dá para exigir um token leve. Melhor postura de segurança.
- **Contras:** mais uma peça para manter/deployar.

### Opção C — Webhook do n8n (já está na stack)
- App faz `POST` para um **webhook do n8n** (já roda no `docker-compose`); o fluxo
  valida, grava no Supabase e ainda pode disparar efeitos (notificar no WhatsApp/
  e-mail que uma clínica concluiu o onboarding, criar a clínica, etc.).
- **Prós:** reusa infra que você já domina; orquestração visual; fácil estender.
- **Contras:** acopla o onboarding ao n8n estar de pé; expõe um webhook (proteger
  com token/segredo no header).

---

## 5. Recomendação

1. **Curto prazo (v2.0):** manter o export do v1 **e** adicionar a **Opção C
   (webhook n8n)** gravando em **`onboarding_submissions`**. Reusa o que já existe,
   permite efeito colateral útil (avisar que a clínica concluiu) e mantém o botão
   de baixar como rede de segurança/offline.
2. **Médio prazo (v2.1):** se o volume crescer ou quiser desacoplar do n8n,
   migrar para a **Opção B (Edge Function)** — mesma tabela, troca só a porta de
   entrada.
3. Em qualquer caso: o front guarda **apenas** uma URL de endpoint pública (não é
   segredo) + um token de baixo privilégio; **service role nunca** vai para o
   front.

---

## 6. Itens a definir antes de implementar

- [ ] Escolher A / B / C (recomendado: C agora, B depois).
- [ ] Criar `onboarding_submissions` (migração) + política RLS de INSERT.
- [ ] Definir formato do payload (versionar o formulário: `form_version`).
- [ ] Endpoint + token: onde guardar no front (variável de build do Vite).
- [ ] Anti-spam: honeypot + rate limit (mínimo).
- [ ] Passo de "promover submissão → `clinicas`/`procedimentos`" (manual no MVP).
- [ ] Confirmar que nada de dado de paciente entra (revisar contra LGPD).
- [ ] Tela de sucesso/erro no app (hoje só há o resumo).

---

## 7. O que **não** muda no v1

- Continua estático, mobile-first, branded, com os 5 blocos.
- Resumo JSON/Markdown com copiar/baixar permanece (útil offline e como backup).
- Trava de "não coletar dado de paciente" continua valendo.
