/**
 * /api/cron.js
 *
 * Chamado automaticamente pelo Vercel Cron a cada 30 minutos.
 * Valida o Authorization header (Vercel injeta automaticamente o CRON_SECRET).
 * Delega toda a lógica para /api/check.
 */

const { MONITORED_URLS } = require('../lib/urls');
const { checkAll, getAlerts } = require('../lib/checker');
const { sendDiscordAlert, sendDiscordOk } = require('../lib/discord');

module.exports = async function handler(req, res) {
  // Vercel Cron injeta Authorization: Bearer <CRON_SECRET>
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn('[cron] Chamada não autorizada bloqueada.');
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  console.log('[cron] Iniciando health check — ', new Date().toISOString());

  try {
    const results = await checkAll(MONITORED_URLS);
    const alerts = getAlerts(results);

    const okCount = results.filter(r => r.status === 'ok').length;
    console.log(`[cron] ${okCount}/${results.length} OK, ${alerts.length} alerta(s)`);

    if (alerts.length > 0) {
      await sendDiscordAlert(alerts, results);
    } else {
      await sendDiscordOk(results); // só envia se DISCORD_NOTIFY_OK=true
    }

    return res.status(200).json({
      ran: true,
      checkedAt: new Date().toISOString(),
      total: results.length,
      ok: okCount,
      alerts: alerts.length,
    });
  } catch (err) {
    console.error('[cron] Erro:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
