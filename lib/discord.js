/**
 * discord.js — envia alertas para o Discord via webhook
 * Usa Discord Embeds para formatação rica.
 */

const STATUS_EMOJI = {
  ok: '✅',
  slow: '🐢',
  redirect: '↪️',
  error: '🔴',
  warn: '⚠️',
};

const STATUS_COLOR = {
  ok: 0x22c55e,       // verde
  slow: 0xf59e0b,     // amarelo
  redirect: 0x8b5cf6, // roxo
  error: 0xef4444,    // vermelho
  warn: 0xf97316,     // laranja
};

const TYPE_LABEL = {
  lp: 'Landing Page',
  checkout: 'Checkout',
  cta: 'Link CTA',
};

/**
 * Envia alerta de problemas encontrados.
 * @param {Array} alerts — resultados com status != ok
 * @param {Array} allResults — todos os resultados do check
 */
async function sendDiscordAlert(alerts, allResults) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('[Discord] DISCORD_WEBHOOK_URL não configurada.');
    return;
  }

  const total = allResults.length;
  const okCount = allResults.filter(r => r.status === 'ok').length;
  const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  // Embed principal
  const mainEmbed = {
    title: `🚨 LP Health Monitor — ${alerts.length} problema(s) detectado(s)`,
    color: alerts.some(a => a.status === 'error') ? STATUS_COLOR.error : STATUS_COLOR.slow,
    description: `**${okCount}/${total}** URLs estão OK · Verificado em ${now} (BRT)`,
    fields: alerts.map(a => ({
      name: `${STATUS_EMOJI[a.status] || '❓'} ${a.name}`,
      value: [
        `**Tipo:** ${TYPE_LABEL[a.type] || a.type}`,
        `**Status:** ${a.status.toUpperCase()}${a.httpCode ? ` (HTTP ${a.httpCode})` : ''}`,
        `**Tempo:** ${a.responseTimeMs ? a.responseTimeMs + 'ms' : '—'}`,
        a.error ? `**Erro:** ${a.error}` : '',
        `**URL:** ${a.url}`,
      ].filter(Boolean).join('\n'),
      inline: false,
    })),
    footer: {
      text: 'STLFLIX LP Monitor · Vercel Cron',
    },
    timestamp: new Date().toISOString(),
  };

  const payload = {
    username: 'STLFLIX Monitor',
    avatar_url: 'https://lp.stlflix.com.br/wp-content/uploads/2025/09/logo-stlflix-blank.svg',
    embeds: [mainEmbed],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`[Discord] Falha ao enviar webhook: ${res.status} — ${text}`);
    } else {
      console.log('[Discord] Alerta enviado com sucesso.');
    }
  } catch (err) {
    console.error('[Discord] Erro ao chamar webhook:', err.message);
  }
}

/**
 * Envia resumo "tudo OK" (opcional — ativa via env DISCORD_NOTIFY_OK=true).
 */
async function sendDiscordOk(allResults) {
  if (process.env.DISCORD_NOTIFY_OK !== 'true') return;
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const avgTime = Math.round(
    allResults.reduce((acc, r) => acc + (r.responseTimeMs || 0), 0) / allResults.length
  );

  const payload = {
    username: 'STLFLIX Monitor',
    embeds: [{
      title: `✅ Tudo OK — ${allResults.length}/${allResults.length} URLs online`,
      color: STATUS_COLOR.ok,
      description: `Tempo médio de resposta: **${avgTime}ms** · ${now} (BRT)`,
      footer: { text: 'STLFLIX LP Monitor · Vercel Cron' },
      timestamp: new Date().toISOString(),
    }],
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

module.exports = { sendDiscordAlert, sendDiscordOk };
