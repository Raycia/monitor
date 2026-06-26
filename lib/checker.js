/**
 * checker.js — lógica central de health check
 * Faz fetch de cada URL, mede tempo de resposta e classifica o resultado.
 */

const DEFAULT_SLOW_THRESHOLD_MS = 4000;
const FETCH_TIMEOUT_MS = 10000;

/**
 * Checa uma URL individual.
 * @param {{ name, url, type, expectStatus?, slowThresholdMs? }} item
 * @returns {{ name, url, type, status, httpCode, responseTimeMs, error, checkedAt }}
 */
async function checkUrl(item) {
  const { name, url, type, expectStatus = 200, slowThresholdMs = DEFAULT_SLOW_THRESHOLD_MS } = item;
  const checkedAt = new Date().toISOString();
  const start = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'STLFLIX-LP-Monitor/1.0',
      },
    });

    clearTimeout(timeout);
    const responseTimeMs = Date.now() - start;
    const httpCode = res.status;

    let status;
    if (httpCode === expectStatus && responseTimeMs <= slowThresholdMs) {
      status = 'ok';
    } else if (httpCode === expectStatus && responseTimeMs > slowThresholdMs) {
      status = 'slow'; // online mas lento
    } else if (httpCode >= 400) {
      status = 'error';
    } else if (httpCode >= 300) {
      status = 'redirect'; // redirect inesperado
    } else {
      status = 'warn';
    }

    return { name, url, type, status, httpCode, responseTimeMs, error: null, checkedAt };
  } catch (err) {
    const responseTimeMs = Date.now() - start;
    const isTimeout = err.name === 'AbortError';
    return {
      name,
      url,
      type,
      status: 'error',
      httpCode: null,
      responseTimeMs,
      error: isTimeout ? 'Timeout após 10s' : err.message,
      checkedAt,
    };
  }
}

/**
 * Checa todas as URLs em paralelo.
 * @param {Array} urls
 * @returns {Promise<Array>}
 */
async function checkAll(urls) {
  return Promise.all(urls.map(checkUrl));
}

/**
 * Filtra resultados que precisam de alerta (não-ok).
 */
function getAlerts(results) {
  return results.filter(r => r.status !== 'ok');
}

module.exports = { checkUrl, checkAll, getAlerts };
