/**
 * URLs monitoradas pelo LP Health Monitor
 * Adicione ou remova entradas conforme necessário.
 *
 * Campos:
 *   name     — nome legível para alertas e dashboard
 *   url      — URL completa a verificar
 *   type     — 'lp' | 'checkout' | 'cta'
 *   expectStatus — código HTTP esperado (padrão: 200)
 *   slowThresholdMs — acima disso vira alerta "lento" (padrão: 4000ms)
 */

const MONITORED_URLS = [
  // ── Landing Pages ──────────────────────────────────────────────
  {
    name: 'Homepage STLFLIX',
    url: 'https://stlflix.com',
    type: 'lp',
    expectStatus: 200,
    slowThresholdMs: 4000,
  },
  {
    name: 'LP Pricing / Assinaturas',
    url: 'https://stlflix.com/pricing',
    type: 'lp',
    expectStatus: 200,
    slowThresholdMs: 4000,
  },
  {
    name: 'LP STLAI',
    url: 'https://stlflix.com/stlai',
    type: 'lp',
    expectStatus: 200,
    slowThresholdMs: 4000,
  },
  {
    name: 'LP STLACADEMY',
    url: 'https://stlflix.com/stlacademy',
    type: 'lp',
    expectStatus: 200,
    slowThresholdMs: 4000,
  },
  {
    name: 'LP Biblioteca',
    url: 'https://stlflix.com/biblioteca',
    type: 'lp',
    expectStatus: 200,
    slowThresholdMs: 4000,
  },

  // ── Checkouts ──────────────────────────────────────────────────
  {
    name: 'Checkout Hotmart (BR)',
    url: 'https://pay.hotmart.com/H99547028G',
    type: 'checkout',
    expectStatus: 200,
    slowThresholdMs: 5000,
  },
  {
    name: 'Checkout Stripe (US)',
    url: 'https://buy.stripe.com/stlflix-us', // ← troque pela URL real
    type: 'checkout',
    expectStatus: 200,
    slowThresholdMs: 5000,
  },

  // ── STLSTORE ───────────────────────────────────────────────────
  {
    name: 'STLSTORE (loja)',
    url: 'https://loja.stlflix.com',
    type: 'lp',
    expectStatus: 200,
    slowThresholdMs: 4000,
  },
];

module.exports = { MONITORED_URLS };
