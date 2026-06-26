/**
 * /api/check.js
 *
 * Endpoint que executa todos os health checks e retorna JSON.
 * Pode ser chamado manualmente (GET) ou pelo cron (via /api/cron).
 *
 * Query params:
 *   ?notify=true   → dispara alerta no Discord mesmo se chamado manualmente
 *   ?secret=XXX    → valida CRON_SECRET para chamadas externas
 */

const { MONITORED_URLS } = require('../lib/urls');
const { checkAll, getAlerts } = require('../lib/checker');
const { sendDiscordAlert, sendDiscordOk } = require('../lib/discord');

module.exports = async function handler(req, res) {
  // Opcional: proteção por secret para evitar chamadas públicas abusivas

  const shouldNotify = req.query.notify === 'true' || req.headers['x-notify'] === 'true';

  try {
    const results = await checkAll(MONITORED_URLS);
    const alerts = getAlerts(results);

    // Dispara Discord se houver problemas (ou se solicitado via query)
    if (alerts.length > 0) {
      await sendDiscordAlert(alerts, results);
    } else if (shouldNotify) {
      await sendDiscordOk(results);
    }

    const summary = {
      checkedAt: new Date().toISOString(),
      total: results.length,
      ok: results.filter(r => r.status === 'ok').length,
      alerts: alerts.length,
      results,
    };

    return res.status(200).json(summary);
  } catch (err) {
    console.error('[/api/check] Erro inesperado:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
};
