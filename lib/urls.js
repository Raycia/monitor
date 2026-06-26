/**
 * URLs monitoradas pelo LP Health Monitor — STLFLIX
 * Edite este arquivo para adicionar, remover ou ajustar URLs.
 */

const MONITORED_URLS = [

  // ── Landing Pages ──────────────────────────────────────────────────────────

  {
    name: 'LP Lote Especial',
    url: 'https://lp.stlflix.com.br/lote-especial/',
    type: 'lp',
    expectStatus: 200,
    slowThresholdMs: 4000,
  },
  {
    name: 'LP Assine STLFLIX',
    url: 'https://lp.stlflix.com.br/assine/',
    type: 'lp',
    expectStatus: 200,
    slowThresholdMs: 4000,
  },
  {
    name: 'LP Assine STLAI',
    url: 'https://lp.stlflix.com.br/assine-stlai',
    type: 'lp',
    expectStatus: 200,
    slowThresholdMs: 4000,
  },

  // ── Checkouts — Lote Especial ──────────────────────────────────────────────

  {
    name: 'Checkout Lote Especial (Hotmart 1)',
    url: 'https://pay.hotmart.com/R103231544G?checkoutMode=10',
    type: 'checkout',
    expectStatus: 200,
    slowThresholdMs: 5000,
  },
  {
    name: 'Checkout Lote Especial (Hotmart 2)',
    url: 'https://pay.hotmart.com/E103236995U?checkoutMode=10',
    type: 'checkout',
    expectStatus: 200,
    slowThresholdMs: 5000,
  },

  // ── Checkouts — Assine STLFLIX BR ─────────────────────────────────────────

  {
    name: 'Checkout STLFLIX Comercial Mensal',
    url: 'https://lp.stlflix.com.br/?p=stlflix-comercial-mensal',
    type: 'checkout',
    expectStatus: 200,
    slowThresholdMs: 5000,
  },
  {
    name: 'Checkout STLFLIX Comercial Anual',
    url: 'https://lp.stlflix.com.br/?p=stlflix-comercial-anual',
    type: 'checkout',
    expectStatus: 200,
    slowThresholdMs: 5000,
  },
  {
    name: 'Checkout STLFLIX Pessoal Anual',
    url: 'https://lp.stlflix.com.br/?p=stlflix-pessoal-anual',
    type: 'checkout',
    expectStatus: 200,
    slowThresholdMs: 5000,
  },
  {
    name: 'Checkout STLFLIX Pessoal Mensal',
    url: 'https://lp.stlflix.com.br/?p=stlflix-pessoal-mensal',
    type: 'checkout',
    expectStatus: 200,
    slowThresholdMs: 5000,
  },
  {
    name: 'Checkout STLFLIX BR (Hotmart)',
    url: 'https://pay.hotmart.com/R103231544G?checkoutMode=10',
    type: 'checkout',
    expectStatus: 200,
    slowThresholdMs: 5000,
  },

  // ── Checkouts — Assine STLAI ──────────────────────────────────────────────

  {
    name: 'Checkout STLAI Pessoal Mensal',
    url: 'https://lp.stlflix.com.br/?p=stlai-pessoal-mensal',
    type: 'checkout',
    expectStatus: 200,
    slowThresholdMs: 5000,
  },
  {
    name: 'Checkout STLAI Pessoal Anual',
    url: 'https://lp.stlflix.com.br/?p=stlai-pessoal-anual',
    type: 'checkout',
    expectStatus: 200,
    slowThresholdMs: 5000,
  },
  {
    name: 'Checkout STLAI Comercial Mensal',
    url: 'https://lp.stlflix.com.br/?p=stlai-comercial-mensal',
    type: 'checkout',
    expectStatus: 200,
    slowThresholdMs: 5000,
  },
  {
    name: 'Checkout STLAI Comercial Anual',
    url: 'https://lp.stlflix.com.br/?p=stlai-comercial-anual',
    type: 'checkout',
    expectStatus: 200,
    slowThresholdMs: 5000,
  },
  {
    name: 'Checkout STLAI (Hotmart)',
    url: 'https://pay.hotmart.com/E103236995U?checkoutMode=10',
    type: 'checkout',
    expectStatus: 200,
    slowThresholdMs: 5000,
  },

];

module.exports = { MONITORED_URLS };