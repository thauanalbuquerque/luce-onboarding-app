# Luce · Onboarding da Clínica

App web estático para o onboarding de clínicas da **Luce** (agente de IA no
WhatsApp). Questionário multi-etapa, mobile-first, branded. Ao final gera um
**resumo estruturado** das respostas (JSON + texto/Markdown) com botões de
**copiar** e **baixar**.

Primeira clínica: **Centrocardio Sobral** (Dr. Maurício).

## Escopo (v1)

- Apenas front-end. **Sem backend, sem Supabase.** Estado em memória.
- Uso primário: a Sara preenche junto com a clínica numa call e exporta o
  resultado no fim.
- Persistência server-side / envio ao Supabase é **v2** (ver `docs/PROPOSTA-V2.md`).

## Stack

- React 18 + Vite 6 (build estático)
- CSS puro com design tokens (`src/styles/tokens.css`)
- Deploy via `gh-pages` para GitHub Pages

## Estrutura

```
src/
  data/briefing.js     ← perguntas (fonte fiel; não inventar)
  components/           ← Field, ProgressBar, Summary
  utils/form.js         ← validação + montagem do resumo + download
  styles/               ← tokens.css + global.css
  App.jsx               ← orquestra intro → blocos → resumo
```

As perguntas são **data-driven**: para alterar o formulário, edite só
`src/data/briefing.js`.

## Rodar local

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build / preview

```bash
npm run build    # gera dist/
npm run preview  # serve o build local
```

## Deploy no GitHub Pages

1. Crie um repositório `luce-onboarding-app` no GitHub e adicione o remoto:
   ```bash
   git remote add origin git@github.com:thauanalbuquerque/luce-onboarding-app.git
   git push -u origin main
   ```
2. Publique o build na branch `gh-pages`:
   ```bash
   npm run deploy
   ```
3. No GitHub: **Settings → Pages → Build and deployment → Source: `gh-pages`**.
4. Acesse: `https://thauanalbuquerque.github.io/luce-onboarding-app/`

> O `base` em `vite.config.js` já está como `/luce-onboarding-app/`. Se o nome do
> repositório mudar, ajuste lá.
