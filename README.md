# STLFLIX LP Health Monitor

Monitora landing pages e checkouts da STLFLIX a cada 30 minutos e envia alertas no Discord quando algo cai ou fica lento.

---

## Estrutura

```
lp-monitor/
├── api/
│   ├── check.js          ← endpoint que roda os checks (GET /api/check)
│   └── cron.js           ← endpoint chamado pelo Vercel Cron
├── lib/
│   ├── urls.js           ← lista de URLs monitoradas ← EDITE AQUI
│   ├── checker.js        ← lógica de fetch + classificação de status
│   └── discord.js        ← envio de alertas via Discord webhook
├── public/
│   └── index.html        ← dashboard visual
├── .env.example          ← variáveis de ambiente necessárias
├── vercel.json           ← configuração do cron (a cada 30min)
└── package.json
```

---

## Deploy em 5 passos

### 1. Criar repositório no GitHub

```bash
cd lp-monitor
git init
git add .
git commit -m "feat: LP health monitor inicial"
gh repo create stlflix-lp-monitor --private --push --source=.
```

### 2. Criar projeto no Vercel

Acesse [vercel.com/new](https://vercel.com/new), importe o repositório `stlflix-lp-monitor` e clique em **Deploy**.

### 3. Criar o webhook do Discord

1. No Discord, vá ao canal onde quer receber os alertas (ex: `#alertas-infra`)
2. Editar Canal → Integrações → Webhooks → **Novo Webhook**
3. Nomeie como `STLFLIX Monitor`, copie a **URL do Webhook**

### 4. Configurar variáveis de ambiente no Vercel

No painel do projeto → **Settings → Environment Variables**, adicione:

| Variável | Valor |
|----------|-------|
| `DISCORD_WEBHOOK_URL` | URL do webhook copiada no passo anterior |
| `CRON_SECRET` | Qualquer string aleatória (ex: `openssl rand -hex 32`) |
| `DISCORD_NOTIFY_OK` | `false` (ou `true` para receber OK também) |

Após adicionar, clique em **Redeploy**.

### 5. Verificar o cron

No painel do Vercel → **Cron Jobs**, você verá o job configurado para rodar a cada 30 minutos. Clique em **Run** para testar manualmente.

---

## Adicionar/remover URLs monitoradas

Edite `lib/urls.js`:

```js
{
  name: 'Minha LP Nova',
  url: 'https://stlflix.com/nova-pagina',
  type: 'lp',           // 'lp' | 'checkout' | 'cta'
  expectStatus: 200,    // código HTTP esperado
  slowThresholdMs: 4000 // acima disso vira alerta "lento"
}
```

Commit + push → Vercel redeploya automaticamente.

---

## Endpoints

| Endpoint | Descrição |
|----------|-----------|
| `GET /` | Dashboard visual |
| `GET /api/check` | Roda todos os checks e retorna JSON |
| `GET /api/cron` | Chamado automaticamente pelo Vercel Cron |

Para chamar `/api/check` manualmente com proteção por secret:
```
GET /api/check?secret=SEU_CRON_SECRET
```

---

## Status possíveis por URL

| Status | Significado |
|--------|-------------|
| `ok` | HTTP esperado + dentro do tempo limite |
| `slow` | HTTP ok mas resposta acima de `slowThresholdMs` |
| `redirect` | HTTP 3xx inesperado |
| `error` | HTTP 4xx/5xx ou timeout/sem resposta |

Alertas Discord são disparados para `slow`, `redirect` e `error`.

---

## Alertas Discord — exemplo

```
🚨 LP Health Monitor — 2 problema(s) detectado(s)
2/4 URLs estão OK · Verificado em 14:30:00 (BRT)

🔴 Checkout Hotmart (BR)
Tipo: Checkout
Status: ERROR (HTTP 503)
Tempo: 1240ms
URL: https://pay.hotmart.com/...

🐢 LP Pricing / Assinaturas
Tipo: Landing Page
Status: SLOW
Tempo: 5812ms
URL: https://stlflix.com/pricing
```
