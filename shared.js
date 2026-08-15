// ============================================================
// SHARED DATA + STORAGE HELPERS
// Used by both index.html (public site) and admin.html (your
// private add-product page). Nothing here is secret — the
// actual gatekeeping happens in admin.js.
// ============================================================

const ICONS = {
  headphones: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="5" height="7" rx="1.5"/><rect x="17" y="14" width="5" height="7" rx="1.5"/></svg>',
  speaker: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="15" r="4"/><circle cx="12" cy="6" r="1.3"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 2Z"/></svg>',
  plug: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0V8Z"/><path d="M12 18v4"/></svg>',
  watch: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 3h6M9 21h6M12 10v2.5l1.5 1"/></svg>',
  pot: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-3Z"/><path d="M2 11h20M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  blender: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10l-1.5 9h-7L7 3Z"/><path d="M8.5 12h7L17 19a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2l1.5-7Z"/></svg>',
  dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6M2 10v4M20 9v6M22 10v4M7 12h10"/><rect x="5" y="7.5" width="4" height="9" rx="1"/><rect x="15" y="7.5" width="4" height="9" rx="1"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="15" height="12" rx="2"/><circle cx="9.5" cy="12" r="3.2"/><path d="M17 10l5-3v10l-5-3"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 12.3 12.7 20.2a1.5 1.5 0 0 1-2.1 0l-7-7a1.5 1.5 0 0 1 0-2.1l7.9-7.9c.3-.3.6-.4 1-.4H18a2 2 0 0 1 2 2v5.6c0 .4-.1.7-.4 1Z"/><circle cx="15" cy="8" r="1.3"/></svg>'
};

const DEFAULT_CATEGORY_LABELS = {
  audio: 'Audio',
  'smart-home': 'Smart Home',
  wearables: 'Wearables',
  kitchen: 'Kitchen',
  fitness: 'Fitness'
};

const STORAGE_PRODUCTS_KEY = 'scn_admin_products';
const STORAGE_CATEGORIES_KEY = 'scn_admin_categories';
const STORAGE_HIDDEN_PRODUCTS_KEY = 'scn_hidden_products';

function loadAdminProducts() {
  try {
    const products = JSON.parse(localStorage.getItem(STORAGE_PRODUCTS_KEY));
    return Array.isArray(products) ? products : [];
  } catch (e) {
    return [];
  }
}

function saveAdminProducts(list) {
  try {
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    return false;
  }
}

function loadAdminCategories() {
  try {
    const categories = JSON.parse(localStorage.getItem(STORAGE_CATEGORIES_KEY));
    return categories && typeof categories === 'object' && !Array.isArray(categories) ? categories : {};
  } catch (e) {
    return {};
  }
}

function saveAdminCategories(map) {
  try {
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(map));
    return true;
  } catch (e) {
    return false;
  }
}

function loadHiddenProductKeys() {
  try {
    const keys = JSON.parse(localStorage.getItem(STORAGE_HIDDEN_PRODUCTS_KEY));
    return Array.isArray(keys) ? keys : [];
  } catch (e) {
    return [];
  }
}

function saveHiddenProductKeys(keys) {
  try {
    localStorage.setItem(STORAGE_HIDDEN_PRODUCTS_KEY, JSON.stringify(keys));
    return true;
  } catch (e) {
    return false;
  }
}

function productKey(product) {
  return product.id || `${product.name}|${product.category}|${product.link}`;
}

// Merges the built-in PRODUCTS (from products.js) with anything
// you've added via the admin page and saved in this browser.
function getAllProducts() {
  const base = (typeof PRODUCTS !== 'undefined') ? PRODUCTS : [];
  const hidden = new Set(loadHiddenProductKeys());
  return base.concat(loadAdminProducts()).filter(product => !hidden.has(productKey(product)));
}

// Merges built-in categories with any custom ones you created.
function getAllCategories() {
  return Object.assign({}, DEFAULT_CATEGORY_LABELS, loadAdminCategories());
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>'\"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[char]);
}

function safeLink(url) {
  const value = String(url ?? '').trim();
  if (value.startsWith('#')) return value;
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '#';
  } catch (e) {
    return '#';
  }
}

function safeImageSource(url) {
  const value = String(url ?? '').trim();
  if (value.startsWith('data:image/')) return value;
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '';
  } catch (e) {
    return '';
  }
}
